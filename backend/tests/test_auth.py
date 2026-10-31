import unittest
from fastapi import HTTPException
from app.database import engine, SessionLocal, Base
from app.models import User
from app.schemas import UserRegisterRequest, UserLoginRequest
from app.security import hash_password, verify_password, create_access_token, decode_access_token
from app.routes.auth import register, login, get_me


class TestAuthentication(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.query(User).filter(User.email.like("%test%@example.com")).delete(synchronize_session=False)
        cls.db.commit()
        cls.db.close()

    def test_01_registration_success_and_db_record(self):
        req = UserRegisterRequest(
            name="Alex Johnson",
            email="alex.test@example.com",
            password="Password123!",
            confirm_password="Password123!",
            role="customer"
        )
        user = register(user_data=req, db=self.db)
        self.assertEqual(user.email, "alex.test@example.com")
        self.assertEqual(user.name, "Alex Johnson")
        self.assertEqual(user.role, "customer")
        self.assertIsNotNone(user.id)
        self.assertIsNotNone(user.created_at)

        # Password must be hashed with Argon2
        self.assertNotEqual(user.password, "Password123!")
        self.assertTrue(user.password.startswith("$argon2id$"))
        self.assertTrue(verify_password("Password123!", user.password))

    def test_02_registration_with_staff_role(self):
        req = UserRegisterRequest(
            name="Sarah Staff",
            email="sarah.test@example.com",
            password="Password123!",
            confirm_password="Password123!",
            role="staff"
        )
        user = register(user_data=req, db=self.db)
        self.assertEqual(user.role, "staff")
        self.assertEqual(user.email, "sarah.test@example.com")

    def test_03_registration_duplicate_email(self):
        req = UserRegisterRequest(
            name="Duplicate User",
            email="alex.test@example.com",
            password="Password123!",
            confirm_password="Password123!",
            role="customer"
        )
        with self.assertRaises(HTTPException) as ctx:
            register(user_data=req, db=self.db)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("already exists", ctx.exception.detail.lower())

    def test_04_login_success(self):
        req = UserLoginRequest(
            email="alex.test@example.com",
            password="Password123!"
        )
        res = login(credentials=req, db=self.db)
        self.assertIsNotNone(res.access_token)
        self.assertEqual(res.token_type, "bearer")
        self.assertEqual(res.user.email, "alex.test@example.com")
        self.assertEqual(res.user.role, "customer")

        # Verify token decoding
        payload = decode_access_token(res.access_token)
        self.assertEqual(payload.get("sub"), "alex.test@example.com")
        self.assertEqual(payload.get("role"), "customer")

    def test_05_login_invalid_password(self):
        req = UserLoginRequest(
            email="alex.test@example.com",
            password="WrongPassword123!"
        )
        with self.assertRaises(HTTPException) as ctx:
            login(credentials=req, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("invalid email or password", ctx.exception.detail.lower())

    def test_06_login_nonexistent_email(self):
        req = UserLoginRequest(
            email="nonexistent.test@example.com",
            password="Password123!"
        )
        with self.assertRaises(HTTPException) as ctx:
            login(credentials=req, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("invalid email or password", ctx.exception.detail.lower())

    def test_07_get_me(self):
        user = self.db.query(User).filter(User.email == "alex.test@example.com").first()
        res = get_me(current_user=user)
        self.assertEqual(res.email, "alex.test@example.com")
        self.assertEqual(res.name, "Alex Johnson")
        self.assertEqual(res.role, "customer")


if __name__ == "__main__":
    unittest.main()
