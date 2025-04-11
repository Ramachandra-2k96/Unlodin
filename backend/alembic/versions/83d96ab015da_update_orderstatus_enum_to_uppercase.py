"""update_orderstatus_enum_to_uppercase

Revision ID: 83d96ab015da
Revises: 6189205ffeaf
Create Date: 2025-04-11 11:35:05.190928

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '83d96ab015da'
down_revision = '6189205ffeaf'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # We'll use a simpler approach that preserves data and works with PostgreSQL
    
    # 1. Create a new column with the updated enum values as text (not using enum type)
    op.execute("""
    ALTER TABLE orders ADD COLUMN status_new TEXT;
    """)
    
    # 2. Convert and migrate the existing enum values to uppercase
    op.execute("""
    UPDATE orders SET status_new = 
        CASE 
            WHEN status::text = 'pending' THEN 'PENDING'
            WHEN status::text = 'accepted' THEN 'ACCEPTED'
            WHEN status::text = 'picked_up' THEN 'PICKED_UP'
            WHEN status::text = 'in_transit' THEN 'IN_TRANSIT'
            WHEN status::text = 'delivered' THEN 'DELIVERED'
            WHEN status::text = 'cancelled' THEN 'CANCELLED'
            ELSE 'PENDING'
        END;
    """)
    
    # 3. Drop the old status column
    op.execute("""
    ALTER TABLE orders DROP COLUMN status;
    """)
    
    # 4. Create a new enum type with uppercase values
    op.execute("""
    DROP TYPE IF EXISTS orderstatus CASCADE;
    CREATE TYPE orderstatus AS ENUM ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
    """)
    
    # 5. Convert the temporary column to use the new enum type
    op.execute("""
    ALTER TABLE orders ADD COLUMN status orderstatus DEFAULT 'PENDING' NOT NULL;
    UPDATE orders SET status = status_new::orderstatus;
    ALTER TABLE orders DROP COLUMN status_new;
    """)


def downgrade() -> None:
    # Similar approach for downgrade, but converting back to lowercase
    
    # 1. Create a new column with the downgraded enum values as text
    op.execute("""
    ALTER TABLE orders ADD COLUMN status_new TEXT;
    """)
    
    # 2. Convert and migrate the existing enum values to lowercase
    op.execute("""
    UPDATE orders SET status_new = 
        CASE 
            WHEN status::text = 'PENDING' THEN 'pending'
            WHEN status::text = 'ACCEPTED' THEN 'accepted'
            WHEN status::text = 'PICKED_UP' THEN 'picked_up'
            WHEN status::text = 'IN_TRANSIT' THEN 'in_transit'
            WHEN status::text = 'DELIVERED' THEN 'delivered'
            WHEN status::text = 'CANCELLED' THEN 'cancelled'
            ELSE 'pending'
        END;
    """)
    
    # 3. Drop the old status column
    op.execute("""
    ALTER TABLE orders DROP COLUMN status;
    """)
    
    # 4. Create the original enum type with lowercase values
    op.execute("""
    DROP TYPE IF EXISTS orderstatus CASCADE;
    CREATE TYPE orderstatus AS ENUM ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled');
    """)
    
    # 5. Convert the temporary column to use the original enum type
    op.execute("""
    ALTER TABLE orders ADD COLUMN status orderstatus DEFAULT 'pending' NOT NULL;
    UPDATE orders SET status = status_new::orderstatus;
    ALTER TABLE orders DROP COLUMN status_new;
    """) 