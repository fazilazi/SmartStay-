from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Depends


DATABASE_URL ="mysql+pymysql://root:root@localhost/backend"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base =declarative_base()

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
