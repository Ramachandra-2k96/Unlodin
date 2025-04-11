from fastapi import APIRouter

from app.api.v1.endpoints import auth, orders

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])

# Create a proper router for the /me endpoint
me_router = APIRouter()
me_router.get("/me", tags=["Users"])(auth.get_current_user)
api_router.include_router(me_router, prefix="/users")
