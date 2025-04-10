from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

# Shared properties
class OrderItemBase(BaseModel):
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None

# Properties to receive via API on creation
class OrderItemCreate(OrderItemBase):
    product_name: str
    product_sku: str
    quantity: int
    unit_price: float

    @validator('quantity')
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be greater than zero')
        return v

    @validator('unit_price')
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Unit price must be greater than zero')
        return v

# Properties to receive via API on update
class OrderItemUpdate(OrderItemBase):
    pass

# Properties shared by models stored in DB
class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class OrderItem(OrderItemInDBBase):
    pass

# Additional properties stored in DB
class OrderItemInDB(OrderItemInDBBase):
    pass 