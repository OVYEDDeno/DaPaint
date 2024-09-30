"""empty message

Revision ID: 125b64d09d55
Revises: efe334b8dfee
Create Date: 2024-09-30 14:24:01.454260

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '125b64d09d55'
down_revision = 'efe334b8dfee'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('feedback', schema=None) as batch_op:
        batch_op.alter_column('rating',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('feedback', schema=None) as batch_op:
        batch_op.alter_column('rating',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###