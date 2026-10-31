import re
from datetime import datetime
from typing import Literal, Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


# ==============================================================================
# Authentication & User Schemas
# ==============================================================================
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


# ==============================================================================
# Product & Variant Schemas
# ==============================================================================
class ProductVariantBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50, description="Variant Code / SKU")
    name: str = Field(..., min_length=1, max_length=200, description="Variant Name")
    additional_price: float = Field(default=0.00, ge=0.0, description="Additional price over base product")
    is_active: bool = Field(default=True, description="Active status")


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    additional_price: Optional[float] = Field(None, ge=0.0)
    is_active: Optional[bool] = None


class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int
    total_price: float = Field(description="Calculated total price: product base + additional")
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ProductBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50, description="Product SKU / Code")
    name: str = Field(..., min_length=1, max_length=200, description="Product Name")
    category: str = Field(default="Software Suite", max_length=100, description="Category / Product Type")
    sales_price: float = Field(default=0.00, ge=0.0, description="Base Sales Price")
    cost_price: float = Field(default=0.00, ge=0.0, description="Internal Cost Price")
    description: Optional[str] = Field(default=None, description="Detailed product description")
    is_active: bool = Field(default=True, description="Whether the product is currently active")


class ProductCreate(ProductBase):
    initial_variants: Optional[List[ProductVariantCreate]] = Field(default=None, description="Optional initial variants")


class ProductUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = Field(None, max_length=100)
    sales_price: Optional[float] = Field(None, ge=0.0)
    cost_price: Optional[float] = Field(None, ge=0.0)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    variants_count: int = Field(default=0)
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class ProductDetailResponse(ProductResponse):
    variants: List[ProductVariantResponse] = Field(default_factory=list)

    model_config = {
        "from_attributes": True
    }


# ==============================================================================
# Plan Schemas
# ==============================================================================
class PlanBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50, description="Unique Plan Code")
    name: str = Field(..., min_length=1, max_length=200, description="Plan Display Name")
    description: Optional[str] = Field(default=None, description="Plan description and features")
    product_id: int = Field(..., description="Associated Product ID")
    variant_id: Optional[int] = Field(default=None, description="Optional Associated Product Variant ID")
    billing_interval: str = Field(default="monthly", description="Billing Cadence: daily, weekly, monthly, quarterly, yearly")
    price: float = Field(..., ge=0.0, description="Recurring billing price")
    min_quantity: int = Field(default=1, ge=1, description="Minimum allowed subscription quantity")
    available_from: datetime = Field(default_factory=datetime.utcnow, description="Start date of plan availability")
    available_to: Optional[datetime] = Field(default=None, description="End date of plan availability")
    allow_pause: bool = Field(default=True, description="Allow customer/staff to pause subscription")
    allow_renewal: bool = Field(default=True, description="Allow automatic or manual renewal")
    allow_closure: bool = Field(default=True, description="Allow subscription closure/cancellation")
    trial_days: int = Field(default=0, ge=0, description="Free trial period in days")
    is_active: bool = Field(default=True, description="Active status")


class PlanCreate(PlanBase):
    pass


class PlanUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    product_id: Optional[int] = None
    variant_id: Optional[int] = None
    billing_interval: Optional[str] = None
    price: Optional[float] = Field(None, ge=0.0)
    min_quantity: Optional[int] = Field(None, ge=1)
    available_from: Optional[datetime] = None
    available_to: Optional[datetime] = None
    allow_pause: Optional[bool] = None
    allow_renewal: Optional[bool] = None
    allow_closure: Optional[bool] = None
    trial_days: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class PlanResponse(PlanBase):
    id: int
    product_name: Optional[str] = None
    variant_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class PlanDetailResponse(PlanResponse):
    product: Optional[ProductResponse] = None
    variant: Optional[ProductVariantResponse] = None

    model_config = {
        "from_attributes": True
    }

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered Email Address")


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_link: str | None = None
    is_registered: bool = False


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1, description="Password reset token")
    password: str = Field(..., description="New password with strict complexity")
    confirm_password: str = Field(..., description="Confirmation of new password")

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
    def check_passwords_match(self) -> "ResetPasswordRequest":
        if self.password != self.confirm_password:
            raise ValueError("Confirm password must match the password.")
        return self


class ResetPasswordResponse(BaseModel):
    message: str
    success: bool = True


