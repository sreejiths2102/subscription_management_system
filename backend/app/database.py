import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings


def sanitize_db_url(url: str) -> str:
    """Safely escapes special characters (like '@') in database passwords."""
    if "://" in url and url.count("@") > 1:
        prefix, rest = url.split("://", 1)
        user_info, host_info = rest.rsplit("@", 1)
        if ":" in user_info:
            user, pwd = user_info.split(":", 1)
            pwd = urllib.parse.quote_plus(urllib.parse.unquote_plus(pwd))
            return f"{prefix}://{user}:{pwd}@{host_info}"
    return url


db_url = sanitize_db_url(settings.DATABASE_URL)
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(
    db_url,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

