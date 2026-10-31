import unittest
from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import SessionLocal, Base, engine
from app.models import User, Product, ProductVariant, Plan
from app.schemas import ProductCreate, ProductUpdate, ProductVariantCreate, PlanCreate, PlanUpdate
from app.routes.products import (
    create_product,
    get_all_products,
    get_product_details,
    update_product,
    delete_or_deactivate_product,
    add_product_variant,
    delete_product_variant
)
from app.routes.plans import (
    create_plan,
    get_all_plans,
    get_plan_details,
    update_plan,
    delete_or_deactivate_plan
)


class TestProductAndPlanManagement(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.db = SessionLocal()
        cls.admin = cls.db.query(User).filter(User.role == "admin").first()
        cls.staff = cls.db.query(User).filter(User.role == "staff").first()

        # If staff user not found in DB, create one for test
        if not cls.staff:
            cls.staff = User(name="Staff Tester", email="staff_test@subscription.com", password="dummy", role="staff")
            cls.db.add(cls.staff)
            cls.db.commit()
            cls.db.refresh(cls.staff)

    @classmethod
    def tearDownClass(cls):
        # Clean up any test records created
        cls.db.query(Plan).filter(Plan.code.like("TEST-%")).delete(synchronize_session=False)
        cls.db.query(ProductVariant).filter(ProductVariant.code.like("VAR-TEST-%")).delete(synchronize_session=False)
        cls.db.query(Product).filter(Product.code.like("TEST-%")).delete(synchronize_session=False)
        cls.db.commit()
        cls.db.close()

    def test_01_create_product_and_variant_pricing(self):
        """Test Product Creation, Adding Variants, and Additional Pricing Calculation."""
        payload = ProductCreate(
            code="TEST-PRD-01",
            name="Automated Cloud Suite",
            category="Software Suite",
            sales_price=100.00,
            cost_price=20.00,
            description="Testing automated product creation",
            is_active=True
        )
        created = create_product(payload=payload, db=self.db, admin=self.admin)
        self.assertEqual(created["code"], "TEST-PRD-01")
        self.assertEqual(created["sales_price"], 100.00)
        self.assertTrue(created["is_active"])

        # Add a custom variant with additional price
        var_payload = ProductVariantCreate(
            code="VAR-TEST-01",
            name="10-User Team Seat Pack",
            additional_price=45.00,
            is_active=True
        )
        added_variant = add_product_variant(
            product_id=created["id"],
            payload=var_payload,
            db=self.db,
            admin=self.admin
        )
        self.assertEqual(added_variant["additional_price"], 45.00)
        # Expected Total Price: Base (100.00) + Additional (45.00) = 145.00
        self.assertEqual(added_variant["total_price"], 145.00)

        # Check full details
        details = get_product_details(product_id=created["id"], db=self.db, current_user=self.staff)
        self.assertTrue(len(details["variants"]) >= 2)
        match_var = next(v for v in details["variants"] if v["code"] == "VAR-TEST-01")
        self.assertEqual(match_var["total_price"], 145.00)

    def test_02_edit_and_deactivate_product(self):
        """Test Product Editing and Deactivation."""
        product = self.db.query(Product).filter(Product.code == "TEST-PRD-01").first()
        self.assertIsNotNone(product)

        # Update product
        update_payload = ProductUpdate(
            name="Automated Cloud Suite V2",
            sales_price=120.00
        )
        updated = update_product(product_id=product.id, payload=update_payload, db=self.db, admin=self.admin)
        self.assertEqual(updated["name"], "Automated Cloud Suite V2")
        self.assertEqual(updated["sales_price"], 120.00)

        # Deactivate product
        deactivated = delete_or_deactivate_product(product_id=product.id, hard_delete=False, db=self.db, admin=self.admin)
        self.assertFalse(deactivated["is_active"])

        # Reactivate for subsequent plan test
        update_product(product_id=product.id, payload=ProductUpdate(is_active=True), db=self.db, admin=self.admin)

    def test_03_create_plan_with_permissions(self):
        """Test Plan Creation with Associated Product, Cadence, Dates, and Permissions."""
        product = self.db.query(Product).filter(Product.code == "TEST-PRD-01").first()
        self.assertIsNotNone(product)

        plan_payload = PlanCreate(
            code="TEST-PLN-01",
            name="Cloud Monthly Team Plan",
            description="Recurring monthly subscription with pause and renewal enabled",
            product_id=product.id,
            billing_interval="monthly",
            price=120.00,
            min_quantity=1,
            trial_days=14,
            allow_pause=True,
            allow_renewal=True,
            allow_closure=True,
            is_active=True
        )
        created_plan = create_plan(payload=plan_payload, db=self.db, admin=self.admin)
        self.assertEqual(created_plan["code"], "TEST-PLN-01")
        self.assertEqual(created_plan["billing_interval"], "monthly")
        self.assertEqual(created_plan["price"], 120.00)
        self.assertTrue(created_plan["allow_pause"])
        self.assertTrue(created_plan["allow_renewal"])
        self.assertTrue(created_plan["allow_closure"])

    def test_04_edit_and_deactivate_plan(self):
        """Test Plan Editing and Deactivation."""
        plan = self.db.query(Plan).filter(Plan.code == "TEST-PLN-01").first()
        self.assertIsNotNone(plan)

        # Edit plan price and interval
        updated = update_plan(
            plan_id=plan.id,
            payload=PlanUpdate(price=110.00, billing_interval="quarterly"),
            db=self.db,
            admin=self.admin
        )
        self.assertEqual(updated["price"], 110.00)
        self.assertEqual(updated["billing_interval"], "quarterly")

        # Deactivate plan
        res = delete_or_deactivate_plan(plan_id=plan.id, hard_delete=False, db=self.db, admin=self.admin)
        self.assertFalse(res["is_active"])

    def test_05_staff_cannot_create_or_delete_product(self):
        """Test RBAC: Staff cannot create or delete products (Admin only)."""
        payload = ProductCreate(
            code="TEST-STAFF-FAIL",
            name="Staff Attempt",
            sales_price=50.00
        )
        # Attempting create_product with staff should fail with 403 Forbidden
        with self.assertRaises(HTTPException) as cm:
            create_product(payload=payload, db=self.db, admin=self.staff)
        self.assertEqual(cm.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()

