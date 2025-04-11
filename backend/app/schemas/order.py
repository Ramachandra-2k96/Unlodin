from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
import re

from app.models.order import OrderStatus
from app.schemas.order_item import OrderItemCreate, OrderItem

# Shared properties
class OrderBase(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    pickup_location: Optional[str] = None
    delivery_location: Optional[str] = None
    pickup_date: Optional[datetime] = None
    delivery_deadline: Optional[datetime] = None
    package_description: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    total_amount: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[OrderStatus] = None
    payment_status: Optional[str] = None

# Properties to receive via API on creation
class OrderCreate(OrderBase):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    pickup_location: str
    delivery_location: str
    pickup_date: datetime
    delivery_deadline: datetime
    package_description: str
    weight: float
    total_amount: float
    items: List[OrderItemCreate]

    @validator('weight')
    def check_weight(cls, v):
        if v <= 0:
            raise ValueError('Weight must be greater than zero')
        return v

    @validator('total_amount')
    def check_total_amount(cls, v):
        if v <= 0:
            raise ValueError('Total amount must be greater than zero')
        return v
    
    @validator('delivery_deadline')
    def check_delivery_deadline(cls, v, values):
        if 'pickup_date' in values and v < values['pickup_date']:
            raise ValueError('Delivery deadline must be after pickup date')
        return v

# Properties to receive via API on update
class OrderUpdate(OrderBase):
    pass

# Properties to receive via API for status update
class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    
    @validator('status', pre=True)
    def validate_status(cls, v):
        """Ensure the status is a valid uppercase enum value"""
        if isinstance(v, str):
            # Convert string to uppercase
            v = v.upper()
            # Check if it's a valid enum value
            try:
                return OrderStatus(v)
            except ValueError:
                raise ValueError(f"Invalid status value: {v}. Valid values are: {[s.value for s in OrderStatus]}")
        return v

# Properties to receive via API for carrier assignment
class CarrierAssignment(BaseModel):
    carrier_id: int

# Properties shared by models stored in DB
class OrderInDBBase(OrderBase):
    id: int
    order_number: str
    shipper_id: int
    carrier_id: Optional[int] = None
    is_assigned: bool
    tracking_number: Optional[str] = None
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Order(OrderInDBBase):
    items: List[OrderItem] = []

# Additional properties stored in DB
class OrderInDB(OrderInDBBase):
    pass

# Properties for order filter
class OrderFilter(BaseModel):
    status: Optional[OrderStatus] = None
    customer_email: Optional[EmailStr] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    is_assigned: Optional[bool] = None 