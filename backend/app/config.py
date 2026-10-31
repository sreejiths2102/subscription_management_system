from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5433/subscription_management"
    JWT_SECRET_KEY: str = "default_secret_key_needs_override"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_URL: str = "http://localhost:5173"

    # Predefined Admin Credentials
    ADMIN_EMAIL: str = "admin@subscription.com"
    ADMIN_PASSWORD: str = "AdminPassword123!"
    ADMIN_NAME: str = "System Administrator"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

