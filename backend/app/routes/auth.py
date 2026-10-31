from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    create_password_reset_token,
    verify_password_reset_token,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user with email uniqueness check and Argon2 password hashing.
    """
    normalized_email = user_data.email.strip().lower()

    # Check if email is already taken
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password with Argon2
    hashed_pwd = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        email=normalized_email,
        password=hashed_pwd,
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and return a signed JWT access token.
    """
    normalized_email = credentials.email.strip().lower()

    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Validate JWT access token and return current authenticated user's information.
    """
    return current_user


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Handle password reset request.
    If the email address is registered, generates a signed reset token and dispatches the reset link.
    """
    normalized_email = request.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()

    if user:
        reset_token = create_password_reset_token(user.email)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        print(f"[AUTH] Password reset link sent to registered email {user.email}: {reset_link}")
        return ForgotPasswordResponse(
            message=f"A password reset link has been sent to your registered email address.",
            reset_link=reset_link,
            is_registered=True
        )

    return ForgotPasswordResponse(
        message="If this email is registered, a password reset link has been dispatched.",
        reset_link=None,
        is_registered=False
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset user password using a valid, non-expired password reset token.
    """
    email = verify_password_reset_token(request.token)
    user = db.query(User).filter(User.email == email.lower()).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this reset link was not found."
        )

    # Hash new password with Argon2
    hashed_pwd = hash_password(request.password)
    user.password = hashed_pwd
    db.commit()

    return ResetPasswordResponse(
        message="Password has been successfully updated. You may now sign in with your new password.",
        success=True
    )


