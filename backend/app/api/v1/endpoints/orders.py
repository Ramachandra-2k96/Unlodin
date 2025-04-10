from typing import Any, Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.core.database import get_db
from app.models.order import Order as OrderModel
from app.models.user import User
from app.services import order as order_service
from app.schemas.order import Order, OrderCreate, OrderUpdate, OrderStatusUpdate, OrderFilter
from app.schemas.pagination import PaginatedResult

router = APIRouter()

@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new order.
    """
    order = order_service.create(db=db, obj_in=order_in, user_id=current_user.id)
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return order

@router.get("/", response_model=PaginatedResult[Order])
def list_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    customer_email: Optional[str] = Query(None, description="Filter by customer email"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve orders with pagination and filtering.
    """
    # Create filter parameters
    filter_params = OrderFilter(
        status=status,
        customer_email=customer_email
    )
    
    # Calculate skip value for pagination
    skip = (page - 1) * page_size
    
    # Get orders
    orders_page = order_service.get_multi(
        db=db,
        user_id=current_user.id,
        filter_params=filter_params,
        skip=skip,
        limit=page_size
    )
    
    # Load order items for each order
    for order in orders_page.items:
        order.items = order_service.get_items(db, order.id)
    
    return orders_page

@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get order by ID.
    """
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Check if the order belongs to the current user
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this order"
        )
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return order

@router.put("/{order_id}", response_model=Order)
def update_order(
    order_id: int,
    order_in: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update an order.
    """
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Check if the order belongs to the current user
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this order"
        )
    
    # Update order
    order = order_service.update(db=db, db_obj=order, obj_in=order_in)
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return order

@router.patch("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update order status.
    """
    order = order_service.get_by_id(db=db, order_id=order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Check if the order belongs to the current user
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this order"
        )
    
    # Update order status
    order = order_service.update_status(db=db, db_obj=order, status_update=status_update)
    
    # Get order items
    order.items = order_service.get_items(db, order.id)
    
    return order 