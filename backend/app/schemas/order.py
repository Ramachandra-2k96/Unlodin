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
    shipping_address: Optional[str] = None
    total_amount: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[OrderStatus] = None

# Properties to receive via API on creation
class OrderCreate(OrderBase):
    customer_name: str
    customer_email: EmailStr
    shipping_address: str
    total_amount: float
    items: List[OrderItemCreate]

    @validator('total_amount')
    def check_total_amount(cls, v):
        if v <= 0:
            raise ValueError('Total amount must be greater than zero')
        return v

# Properties to receive via API on update
class OrderUpdate(OrderBase):
    pass

# Properties to receive via API for status update
class OrderStatusUpdate(BaseModel):
    status: OrderStatus

# Properties shared by models stored in DB
class OrderInDBBase(OrderBase):
    id: int
    order_number: str
    user_id: int
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