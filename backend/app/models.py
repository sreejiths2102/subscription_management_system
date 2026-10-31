from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base


def get_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(String(20), nullable=False, default="customer")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

