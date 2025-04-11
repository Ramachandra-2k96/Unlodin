# Unlodin Application

A full-stack application with a modern React frontend and FastAPI backend.

## 🚀 Technology Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Anime.js
- Axios
- React Router DOM

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Python 3.12
- Uvicorn

## 🛠️ Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.11 (for local backend development)
- PostgreSQL (for local development)

## 🏃‍♂️ Running the Application

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Ramachandra-2k96/Unlodin.git
cd unlodin
```

2. Build and run the Docker container:
```bash
docker build -t unlodin-app .
docker run -p 8000:8000 -p 3000:3000 unlodin-app
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Local Development

#### Backend Setup
1. Create a virtual environment:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend:
```bash
uvicorn app.main:app --reload
```

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔧 Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## 📦 Project Structure

```
unlodin/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
└── Dockerfile
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request