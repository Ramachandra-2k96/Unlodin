# Order Management Backend Service

A production-grade REST API for managing orders, built with FastAPI and PostgreSQL following microservice principles.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens
- **Migration**: Alembic
- **Testing**: pytest
- **Deployment**: Ready for Vercel PostgreSQL

## Features

- Complete order management (CRUD operations)
- User authentication (signup, login, logout)
- Pagination and filtering for order listing
- Role-based access control
- Input validation
- Database migrations
- Comprehensive error handling

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL (or use Vercel's PostgreSQL)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual database connection string and other settings.

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000.

## API Documentation

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### API Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/logout` - Logout (clear session)

#### Orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders` - List orders (with pagination & filters)
- `GET /api/v1/orders/{order_id}` - Get order by ID
- `PUT /api/v1/orders/{order_id}` - Update order
- `PATCH /api/v1/orders/{order_id}/status` - Update order status

### API Examples (cURL)

#### Register a new user
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/login' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=testuser&password=password123'
```

#### Create an order
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/orders' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "shipping_address": "123 Main St, City, Country",
    "total_amount": 99.99,
    "items": [
      {
        "product_name": "Product 1",
        "product_sku": "SKU001",
        "quantity": 2,
        "unit_price": 49.99
      }
    ]
  }'
```

#### Get orders (with filters)
```bash
curl -X 'GET' \
  'http://localhost:8000/api/v1/orders?status=pending&page=1&page_size=10' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

#### Update order status
```bash
curl -X 'PATCH' \
  'http://localhost:8000/api/v1/orders/1/status' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "shipped"
  }'
```

## Testing

Run the tests with pytest:
```bash
pytest
```

## Database Migrations

After making changes to database models:
```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
``` 