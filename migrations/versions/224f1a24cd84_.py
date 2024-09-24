"""empty message

Revision ID: 224f1a24cd84
Revises: 6c98282f20e1
Create Date: 2024-09-21 13:43:23.386343

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '224f1a24cd84'
down_revision = '6c98282f20e1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dapaint', schema=None) as batch_op:
        batch_op.add_column(sa.Column('isBoosted', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('host_winnerId', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('host_loserId', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('foe_winnerId', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('foe_loserId', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'user', ['host_winnerId'], ['id'])
        batch_op.create_foreign_key(None, 'user', ['host_loserId'], ['id'])
        batch_op.create_foreign_key(None, 'user', ['foe_winnerId'], ['id'])
        batch_op.create_foreign_key(None, 'user', ['foe_loserId'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dapaint', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('foe_loserId')
        batch_op.drop_column('foe_winnerId')
        batch_op.drop_column('host_loserId')
        batch_op.drop_column('host_winnerId')
        batch_op.drop_column('isBoosted')

    # ### end Alembic commands ###