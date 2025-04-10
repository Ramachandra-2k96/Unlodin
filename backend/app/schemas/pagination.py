from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional

T = TypeVar('T')

class PaginatedResult(BaseModel, Generic[T]):
    """Pagination wrapper for lists of items."""
    items: List[T]
    total: int
    page: int = Field(1, ge=1, description="Current page number (1-indexed)")
    page_size: int = Field(10, gt=0, description="Number of items per page")
    pages: int = Field(1, ge=1, description="Total number of pages")
    
    @classmethod
    def create(cls, items: List[T], total: int, page: int, page_size: int):
        pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            pages=pages
        ) 