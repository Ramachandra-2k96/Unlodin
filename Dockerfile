# Build stage for frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist /app/static

# Create a script to run both services
RUN echo '#!/bin/bash\n\
cd /app\n\
uvicorn app.main:app --host 0.0.0.0 --port 8000 & \n\
cd /app/static\n\
python3 -m http.server 3000\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 8000 3000

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Run the start script
CMD ["/app/start.sh"] 