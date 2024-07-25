"""empty message

Revision ID: 6df343d258f9
Revises: 0b98cd3387dd
Create Date: 2024-07-25 16:59:36.721585

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6df343d258f9'
down_revision = '0b98cd3387dd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('da_paint', schema=None) as batch_op:
        batch_op.alter_column('date',
               existing_type=postgresql.TIME(),
               type_=sa.String(length=100),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('da_paint', schema=None) as batch_op:
        batch_op.alter_column('date',
               existing_type=sa.String(length=100),
               type_=postgresql.TIME(),
               existing_nullable=False)

    # ### end Alembic commands ###
