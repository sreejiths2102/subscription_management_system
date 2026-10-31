import re
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full Name")
    email: EmailStr = Field(..., description="Valid Email Address")
    password: str = Field(..., description="Password with strict complexity")
    confirm_password: str = Field(..., description="Confirmation of password")
    role: Literal["customer", "staff"] = Field(default="customer", description="User role: customer or staff")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Full Name is required and cannot be empty.")
        return trimmed

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) <= 8:
            raise ValueError("Password must contain more than 8 characters.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[^a-zA-Z0-9\s]", v):
            raise ValueError("Password must contain at least one special character.")
        return v

    @model_validator(mode="after")
    def check_passwords_match(self) -> "UserRegisterRequest":
        if self.password != self.confirm_password:
            raise ValueError("Confirm password must match the password.")
        return self


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered Email Address")
    password: str = Field(..., min_length=1, description="Password")


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

