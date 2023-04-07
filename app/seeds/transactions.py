from app.models import db, Transaction, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds transaction seed data
def seed_transactions():
    demo = User.query.get(1)

    packages = [
        {"name": "Basic", "requests": 20, "price": 0.99},
        {"name": "Starter", "requests": 100, "price": 3.99},
        {"name": "Pro", "requests": 500, "price": 9.99},
        {"name": "Pro Plus", "requests": 1000, "price": 14.99},
    ]

    for package in packages:
        demo_transaction = Transaction(
            user_id=demo.id,
            package=package["name"],
            amount_generations=package["requests"],
            cost=package["price"],
            created_at=datetime.utcnow()
        )

        db.session.add(demo_transaction)

    # Additional transactions for demo user
    additional_demo_transactions = [
        {"package": "Pro", "requests": 500, "price": 9.99},
        {"package": "Basic", "requests": 20, "price": 0.99},
    ]

    for transaction in additional_demo_transactions:
        additional_demo_transaction = Transaction(
            user_id=demo.id,
            package=transaction["package"],
            amount_generations=transaction["requests"],
            cost=transaction["price"],
            created_at=datetime.utcnow()
        )
        db.session.add(additional_demo_transaction)

    db.session.commit()

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the transactions table. SQLAlchemy doesn't
# have a built-in function to do this. With PostgreSQL in production, TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite3 in development, you need to instead use DELETE to remove all data, and
# it will reset the primary keys for you as well.
def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))

    db.session.commit()
