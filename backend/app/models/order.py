from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
import enum

from app.core.database import Base

class OrderStatus(str, enum.Enum):
    """Order status enum"""
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"  # Carrier has accepted the delivery
    PICKED_UP = "PICKED_UP"  # Carrier has picked up the shipment
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    
    def __str__(self):
        """Return the value of the enum as a string"""
        return self.value
    
    def __repr__(self):
        """Return the value of the enum as a string"""
        return self.value

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    
    # Shipper information (user who created the order)
    shipper_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Carrier information (user who will deliver the order)
    carrier_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_assigned = Column(Boolean, default=False)
    
    # Shipment details
    pickup_location = Column(String, nullable=False)
    delivery_location = Column(String, nullable=False)
    pickup_date = Column(DateTime(timezone=True), nullable=False)
    delivery_deadline = Column(DateTime(timezone=True), nullable=False)
    
    # Package information
    package_description = Column(String, nullable=False)
    weight = Column(Float, nullable=False)  # In KG
    dimensions = Column(String, nullable=True)  # Format: LxWxH in cm
    
    # Customer details
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    
    # Tracking and status
    tracking_number = Column(String, unique=True, index=True, nullable=True)
    # Define enum with name=True to ensure case sensitivity
    status = Column(Enum(OrderStatus, name='orderstatus', create_constraint=True, validate_strings=True), 
                   default=OrderStatus.PENDING, nullable=False)
    notes = Column(String, nullable=True)
    
    # Payment information
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String, default="unpaid", nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # For Pydantic compatibility
    model_config = {"arbitrary_types_allowed": True} 