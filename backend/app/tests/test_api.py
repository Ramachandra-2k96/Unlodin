import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.user import User
from app.core.security import get_password_hash
from app.models.order import OrderStatus

# Setup test database
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def test_db():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a test user
    db = TestingSessionLocal()
    test_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("password123"),
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.close()
    
    yield  # Run the tests
    
    # Drop the tables after the test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    # Create a test client with the database
    with TestClient(app) as c:
        yield c

@pytest.fixture
def token(client):
    # Get a token for the test user
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testuser", "password": "password123"}
    )
    token = response.json()["access_token"]
    return token

def test_login(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testuser", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_create_order(client, token):
    # Test creating a new order
    headers = {"Authorization": f"Bearer {token}"}
    order_data = {
        "customer_name": "Test Customer",
        "customer_email": "customer@example.com",
        "shipping_address": "123 Test St",
        "total_amount": 99.99,
        "items": [
            {
                "product_name": "Test Product",
                "product_sku": "TEST-001",
                "quantity": 1,
                "unit_price": 99.99
            }
        ]
    }
    response = client.post(
        "/api/v1/orders/",
        headers=headers,
        json=order_data
    )
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == order_data["customer_name"]
    assert data["status"] == OrderStatus.PENDING
    assert len(data["items"]) == 1

def test_get_order(client, token):
    # Create an order first
    headers = {"Authorization": f"Bearer {token}"}
    order_data = {
        "customer_name": "Test Customer",
        "customer_email": "customer@example.com",
        "shipping_address": "123 Test St",
        "total_amount": 99.99,
        "items": [
            {
                "product_name": "Test Product",
                "product_sku": "TEST-001",
                "quantity": 1,
                "unit_price": 99.99
            }
        ]
    }
    create_response = client.post(
        "/api/v1/orders/",
        headers=headers,
        json=order_data
    )
    order_id = create_response.json()["id"]
    
    # Test getting the order
    response = client.get(
        f"/api/v1/orders/{order_id}",
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == order_id
    assert data["customer_name"] == order_data["customer_name"] 