from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from datetime import datetime
import uuid

from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate, OrderUpdate, OrderStatusUpdate, OrderFilter, CarrierAssignment
from app.schemas.pagination import PaginatedResult

def generate_order_number() -> str:
    """Generate a unique order number."""
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"

def generate_tracking_number() -> str:
    """Generate a unique tracking number."""
    return f"TRK-{uuid.uuid4().hex[:10].upper()}"

def get_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def get_by_order_number(db: Session, order_number: str) -> Optional[Order]:
    return db.query(Order).filter(Order.order_number == order_number).first()

def get_by_tracking_number(db: Session, tracking_number: str) -> Optional[Order]:
    return db.query(Order).filter(Order.tracking_number == tracking_number).first()

def get_items(db: Session, order_id: int) -> List[OrderItem]:
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

def get_multi(
    db: Session, 
    shipper_id: Optional[int] = None,
    carrier_id: Optional[int] = None,
    filter_params: Optional[OrderFilter] = None,
    skip: int = 0, 
    limit: int = 100
) -> PaginatedResult[Order]:
    query = db.query(Order)
    
    # Apply shipper_id filter if provided
    if shipper_id is not None:
        query = query.filter(Order.shipper_id == shipper_id)
    
    # Apply carrier_id filter if provided
    if carrier_id is not None:
        query = query.filter(Order.carrier_id == carrier_id)
    
    # Apply additional filters if provided
    if filter_params:
        if filter_params.status:
            query = query.filter(Order.status == filter_params.status)
        if filter_params.customer_email:
            query = query.filter(Order.customer_email == filter_params.customer_email)
        if filter_params.date_from:
            query = query.filter(Order.created_at >= filter_params.date_from)
        if filter_params.date_to:
            query = query.filter(Order.created_at <= filter_params.date_to)
        if filter_params.is_assigned is not None:
            query = query.filter(Order.is_assigned == filter_params.is_assigned)
    
    # Get total count before applying pagination
    total = query.count()
    
    # Apply ordering and pagination
    items = query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    
    # Calculate page information
    page_size = limit
    page = (skip // page_size) + 1 if page_size > 0 else 1
    
    return PaginatedResult.create(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

def get_available_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> PaginatedResult[Order]:
    """Get orders that are not assigned to a carrier."""
    query = db.query(Order).filter(Order.is_assigned == False)
    
    # Get total count before applying pagination
    total = query.count()
    
    # Apply ordering and pagination
    items = query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    
    # Calculate page information
    page_size = limit
    page = (skip // page_size) + 1 if page_size > 0 else 1
    
    return PaginatedResult.create(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

def create(db: Session, obj_in: OrderCreate, shipper_id: int) -> Order:
    """Create a new order with items."""
    order_data = obj_in.model_dump(exclude={"items"})
    
    # Create order
    db_obj = Order(
        **order_data,
        shipper_id=shipper_id,
        order_number=generate_order_number(),
        status=OrderStatus.PENDING,
        is_assigned=False
    )
    db.add(db_obj)
    db.flush()  # Flush to get the order ID without committing
    
    # Create order items
    for item in obj_in.items:
        item_data = item.model_dump()
        db_item = OrderItem(
            **item_data,
            order_id=db_obj.id
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Order, obj_in: OrderUpdate) -> Order:
    """Update an order."""
    update_data = obj_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_status(db: Session, db_obj: Order, status_update: OrderStatusUpdate) -> Order:
    """Update order status."""
    old_status = db_obj.status
    db_obj.status = status_update.status
    
    # Generate tracking number when order is accepted by carrier
    if old_status == OrderStatus.PENDING and status_update.status == OrderStatus.ACCEPTED:
        db_obj.tracking_number = generate_tracking_number()
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def assign_carrier(db: Session, db_obj: Order, carrier_assignment: CarrierAssignment) -> Order:
    """Assign a carrier to an order."""
    db_obj.carrier_id = carrier_assignment.carrier_id
    db_obj.is_assigned = True
    db_obj.status = OrderStatus.ACCEPTED
    db_obj.tracking_number = generate_tracking_number()
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, order_id: int) -> bool:
    """Delete an order and its items."""
    # Delete the order items first
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    
    # Delete the order
    result = db.query(Order).filter(Order.id == order_id).delete()
    db.commit()
    
    return result > 0