from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Subscription, Invoice, Payment, Customer, Plan, User
from app.security import require_staff_or_admin

router = APIRouter(prefix="/api/reports", tags=["Reports & Analytics"])


@router.get("")
def get_reports_data(
    category: Optional[str] = Query("revenue"),
    customer_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
) -> Dict[str, Any]:
    """
    Computes dynamic reports from PostgreSQL records for all 5 business categories:
    revenue, subscription, payment, outstanding, overdue.
    """
    total_customers = db.query(Customer).count()
    active_subs = db.query(Subscription).filter(Subscription.status == "Active").all()
    all_subs = db.query(Subscription).all()
    all_invoices = db.query(Invoice).all()
    all_payments = db.query(Payment).all()

    # Revenue metrics
    cleared_payments = [p for p in all_payments if p.status == "Cleared"]
    total_cleared_revenue = sum(float(p.amount) for p in cleared_payments)
    
    mrr_val = 0.0
    for s in active_subs:
        amt = float(s.amount or 0.0)
        if s.billing_interval == "yearly":
            mrr_val += amt / 12.0
        elif s.billing_interval == "quarterly":
            mrr_val += amt / 3.0
        elif s.billing_interval == "weekly":
            mrr_val += amt * 4.33
        else:
            mrr_val += amt
    mrr_val = round(mrr_val, 2)
    arpu = round(mrr_val / max(total_customers, 1), 2)

    # Subscription metrics
    active_count = len(active_subs)
    paused_count = sum(1 for s in all_subs if s.status == "Paused")
    new_signups = len(all_subs)

    # Outstanding and Overdue metrics
    outstanding_invoices = [i for i in all_invoices if i.status in ["Pending", "Confirmed"]]
    outstanding_total = sum(float(i.total_amount - (i.paid_amount or 0.0)) for i in outstanding_invoices)

    overdue_invoices = [i for i in all_invoices if i.status == "Overdue"]
    overdue_total = sum(float(i.total_amount - (i.paid_amount or 0.0)) for i in overdue_invoices)

    # Category stats
    category_stats = {
        "revenue": [
            {"label": "Total Revenue (Cleared)", "value": f"${total_cleared_revenue:,.2f}", "change": f"{len(cleared_payments)} payments", "positive": True},
            {"label": "MRR Current", "value": f"${mrr_val:,.2f}", "change": "Calculated live", "positive": True},
            {"label": "Avg Customer ARPU", "value": f"${arpu:,.2f}", "change": f"{total_customers} accounts", "positive": True},
            {"label": "Annual Run Rate (ARR)", "value": f"${mrr_val * 12:,.2f}", "change": "Projected ARR", "positive": True},
        ],
        "subscription": [
            {"label": "Active Subscriptions", "value": str(active_count), "change": f"{active_count} recurring", "positive": True},
            {"label": "Paused Accounts", "value": str(paused_count), "change": f"{paused_count} on hold", "positive": False if paused_count > 0 else True},
            {"label": "Total Subscriptions", "value": str(len(all_subs)), "change": "In database", "positive": True},
            {"label": "Retention Rate", "value": f"{int((active_count / max(len(all_subs), 1)) * 100)}%", "change": "Active ratio", "positive": True},
        ],
        "payment": [
            {"label": "Cleared Transactions", "value": f"${total_cleared_revenue:,.2f}", "change": f"{len(cleared_payments)} cleared", "positive": True},
            {"label": "Total Logged Payments", "value": str(len(all_payments)), "change": "In ledger", "positive": True},
            {"label": "Pending Settlements", "value": str(sum(1 for p in all_payments if p.status == "Pending")), "change": "Awaiting ACH", "positive": False},
            {"label": "Clearance Rate", "value": f"{int((len(cleared_payments) / max(len(all_payments), 1)) * 100)}%", "change": "Gateway success", "positive": True},
        ],
        "outstanding": [
            {"label": "Total Outstanding", "value": f"${outstanding_total:,.2f}", "change": f"{len(outstanding_invoices)} invoices", "positive": False},
            {"label": "Pending Invoices", "value": str(len(outstanding_invoices)), "change": "Awaiting payment", "positive": False},
            {"label": "Unpaid Ratio", "value": f"{int((len(outstanding_invoices) / max(len(all_invoices), 1)) * 100)}%", "change": "Of total billings", "positive": False},
            {"label": "Dispute Rate", "value": "0.0%", "change": "0 disputes", "positive": True},
        ],
        "overdue": [
            {"label": "Total Overdue", "value": f"${overdue_total:,.2f}", "change": f"{len(overdue_invoices)} overdue", "positive": False},
            {"label": "Overdue Count", "value": str(len(overdue_invoices)), "change": "Past due date", "positive": False},
            {"label": "Action Needed", "value": f"${overdue_total:,.2f}", "change": "Follow up required", "positive": False},
            {"label": "Recovery Target", "value": "100%", "change": "Prioritized queue", "positive": True},
        ]
    }

    # Dynamic table rows based on category
    table_rows = []
    if category == "revenue":
        for sub in all_subs:
            table_rows.append({
                "col1": sub.plan_name,
                "col2": f"${float(sub.amount):,.2f}",
                "col3": sub.customer_name,
                "col4": sub.billing_interval.capitalize(),
                "col5": sub.status
            })
    elif category == "subscription":
        for sub in all_subs:
            table_rows.append({
                "col1": sub.code,
                "col2": sub.customer_name,
                "col3": sub.plan_name,
                "col4": sub.status,
                "col5": f"Renewal: {sub.next_billing_date or 'N/A'}"
            })
    elif category == "payment":
        for pay in all_payments:
            table_rows.append({
                "col1": pay.code,
                "col2": pay.customer_name,
                "col3": f"${float(pay.amount):,.2f}",
                "col4": pay.payment_method,
                "col5": f"{pay.status} ({pay.payment_date})"
            })
    elif category == "outstanding":
        for inv in outstanding_invoices:
            table_rows.append({
                "col1": inv.code,
                "col2": inv.customer_name,
                "col3": f"${float(inv.total_amount):,.2f}",
                "col4": f"Due {inv.due_date}",
                "col5": f"Balance: ${float(inv.total_amount - (inv.paid_amount or 0)):,.2f}"
            })
    elif category == "overdue":
        for inv in overdue_invoices:
            table_rows.append({
                "col1": inv.code,
                "col2": inv.customer_name,
                "col3": f"${float(inv.total_amount):,.2f}",
                "col4": f"Past Due: {inv.due_date}",
                "col5": "Overdue (Follow Up Required)"
            })
    else:
        for sub in all_subs:
            table_rows.append({
                "col1": sub.code,
                "col2": sub.customer_name,
                "col3": sub.plan_name,
                "col4": sub.status,
                "col5": sub.rate
            })

    # Customers list for dropdown filter
    customer_names = ["All Customers"] + [c.name for c in db.query(Customer).order_by(Customer.name.asc()).all()]

    return {
        "category": category,
        "category_stats": category_stats,
        "table_rows": table_rows,
        "customers": customer_names
    }

