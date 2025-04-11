from typing import Any, Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.sql.expression import literal
from sqlalchemy import update

from app.core.auth import get_current_active_user
from app.core.database import get_db
from app.models.order import Order as OrderModel, OrderStatus
from app.models.user import User
from app.services import order as order_service
from app.schemas.order import Order, OrderCreate, OrderUpdate, OrderStatusUpdate, OrderFilter, CarrierAssignment
from app.schemas.pagination import PaginatedResult

router = APIRouter()

# Helper function to check if user is a shipper
def is_shipper(user: User) -> bool:
    return user.account_type == "shipper"

# Helper function to check if user is a carrier
def is_carrier(user: User) -> bool:
    return user.account_type == "carrier"

# SHIPPER ENDPOINTS

@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new order (Shipper only).
    """
    # Check if user is a shipper
    if not is_shipper(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only shippers can create orders"
        )
    
    order = order_service.create(db=db, obj_in=order_in, shipper_id=current_user.id)
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return Order.model_validate(order)

@router.get("/my-shipments", response_model=PaginatedResult[Order])
def list_shipper_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    customer_email: Optional[str] = Query(None, description="Filter by customer email"),
    is_assigned: Optional[bool] = Query(None, description="Filter by assignment status"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all orders created by the current shipper.
    """
    # Check if user is a shipper
    if not is_shipper(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only shippers can access their shipments"
        )
    
    # Create filter parameters
    filter_params = OrderFilter(
        status=status,
        customer_email=customer_email,
        is_assigned=is_assigned
    )
    
    # Calculate skip value for pagination
    skip = (page - 1) * page_size
    
    # Get orders
    orders_page = order_service.get_multi(
        db=db,
        shipper_id=current_user.id,
        filter_params=filter_params,
        skip=skip,
        limit=page_size
    )
    
    # Load order items for each order
    for order in orders_page.items:
        order.items = order_service.get_items(db, order.id)
    
    # Convert SQLAlchemy models to Pydantic models
    orders_page.items = [Order.model_validate(order) for order in orders_page.items]
    
    return orders_page

# CARRIER ENDPOINTS

@router.get("/available", response_model=PaginatedResult[Order])
def list_available_orders(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all unassigned orders (Carrier only).
    """
    # Check if user is a carrier
    if not is_carrier(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only carriers can view available orders"
        )
    
    # Calculate skip value for pagination
    skip = (page - 1) * page_size
    
    # Get available orders
    orders_page = order_service.get_available_orders(
        db=db,
        skip=skip,
        limit=page_size
    )
    
    # Load order items for each order
    for order in orders_page.items:
        order.items = order_service.get_items(db, order.id)
    
    # Convert SQLAlchemy models to Pydantic models
    orders_page.items = [Order.model_validate(order) for order in orders_page.items]
    
    return orders_page

@router.get("/my-deliveries", response_model=PaginatedResult[Order])
def list_carrier_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all orders assigned to the current carrier.
    """
    # Check if user is a carrier
    if not is_carrier(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only carriers can access their deliveries"
        )
    
    # Create filter parameters
    filter_params = OrderFilter(
        status=status,
        is_assigned=True
    )
    
    # Calculate skip value for pagination
    skip = (page - 1) * page_size
    
    # Get orders
    orders_page = order_service.get_multi(
        db=db,
        carrier_id=current_user.id,
        filter_params=filter_params,
        skip=skip,
        limit=page_size
    )
    
    # Load order items for each order
    for order in orders_page.items:
        order.items = order_service.get_items(db, order.id)
    
    # Convert SQLAlchemy models to Pydantic models
    orders_page.items = [Order.model_validate(order) for order in orders_page.items]
    
    return orders_page

@router.post("/{order_id}/accept", response_model=Order)
def accept_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Accept an order for delivery (Carrier only).
    """
    # Check if user is a carrier
    if not is_carrier(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only carriers can accept orders"
        )
    
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Check if the order is already assigned
    if order.is_assigned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order is already assigned to a carrier"
        )
    
    try:
        # Update the order using the carrier assignment service function
        carrier_assignment = CarrierAssignment(carrier_id=current_user.id)
        order = order_service.assign_carrier(db=db, db_obj=order, carrier_assignment=carrier_assignment)
        
        # Get order items
        order.items = order_service.get_items(db, order.id)
        
        return Order.model_validate(order)
    except Exception as e:
        db.rollback()
        print(f"Error accepting order: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to accept order: {str(e)}"
        )

# SHARED ENDPOINTS

@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get order by ID (Shipper can access their own orders, Carrier can access assigned orders).
    """
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Check permissions based on user role
    if is_shipper(current_user):
        # Shipper can only access their own orders
        if order.shipper_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this order"
            )
    elif is_carrier(current_user):
        # Carrier can only access orders assigned to them
        if order.carrier_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this order"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid account type"
        )
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return Order.model_validate(order)

@router.get("/track/{tracking_number}", response_model=Order)
def track_order(
    tracking_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Track an order by tracking number.
    """
    order = order_service.get_by_tracking_number(db=db, tracking_number=tracking_number)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with tracking number {tracking_number} not found"
        )
    
    # Check permissions based on user role
    if is_shipper(current_user):
        # Shipper can only track their own orders
        if order.shipper_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to track this order"
            )
    elif is_carrier(current_user):
        # Carrier can only track orders assigned to them
        if order.carrier_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to track this order"
            )
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return Order.model_validate(order)

@router.patch("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update order status (Shipper can cancel, Carrier can update delivery status).
    """
    print(f"Received status update request for order {order_id}")
    print(f"Status update data: {status_update}")
    print(f"Status value: {status_update.status}, Type: {type(status_update.status)}")
    
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Apply role-based permissions for status updates
    if is_shipper(current_user):
        # Shipper can only update their own orders
        if order.shipper_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to modify this order"
            )
        
        # Shipper can only cancel orders that are not yet delivered
        if status_update.status == OrderStatus.CANCELLED:
            if order.status in [OrderStatus.DELIVERED]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot cancel an order that has been delivered"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Shippers can only cancel orders"
            )
            
    elif is_carrier(current_user):
        # Carrier can only update orders assigned to them
        if order.carrier_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to modify this order"
            )
        
        # Carrier cannot cancel orders
        if status_update.status == OrderStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Carriers cannot cancel orders"
            )
        
        # Validate status transitions
        valid_transitions = {
            OrderStatus.ACCEPTED: [OrderStatus.PICKED_UP],
            OrderStatus.PICKED_UP: [OrderStatus.IN_TRANSIT],
            OrderStatus.IN_TRANSIT: [OrderStatus.DELIVERED]
        }
        
        if order.status not in valid_transitions or status_update.status not in valid_transitions.get(order.status, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status transition from {order.status} to {status_update.status}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid account type"
        )
    
    # Update order status
    order = order_service.update_status(db=db, db_obj=order, status_update=status_update)
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return Order.model_validate(order) 