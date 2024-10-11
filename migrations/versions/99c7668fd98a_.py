"""empty message

Revision ID: 99c7668fd98a
Revises: 08ffb4fa5141
Create Date: 2024-10-10 13:13:13.847764

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99c7668fd98a'
down_revision = '08ffb4fa5141'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ticket', schema=None) as batch_op:
        batch_op.add_column(sa.Column('qr_code_path', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('ticket_code', sa.String(length=10), nullable=True))
        batch_op.add_column(sa.Column('is_purchased', sa.Boolean(), nullable=True))
        batch_op.create_unique_constraint(None, ['ticket_code'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ticket', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('is_purchased')
        batch_op.drop_column('ticket_code')
        batch_op.drop_column('qr_code_path')

    # ### end Alembic commands ###