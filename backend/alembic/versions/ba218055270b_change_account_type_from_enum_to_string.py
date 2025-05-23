"""Change account_type from enum to string

Revision ID: ba218055270b
Revises: bf7dba165790
Create Date: 2025-04-11 09:23:24.281033

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'ba218055270b'
down_revision = 'bf7dba165790'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'account_type',
               existing_type=postgresql.ENUM('SHIPPER', 'CARRIER', name='accounttype'),
               type_=sa.String(),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'account_type',
               existing_type=sa.String(),
               type_=postgresql.ENUM('SHIPPER', 'CARRIER', name='accounttype'),
               existing_nullable=False)
    # ### end Alembic commands ### 