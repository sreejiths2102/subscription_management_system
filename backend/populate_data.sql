-- =============================================================================
-- Complete SQL Seed Queries to Populate Subscription Management System DB
-- =============================================================================

INSERT INTO users (name, email, password, role, created_at)
VALUES 
    ('Elena Rostova', 'elena.staff@subscription.com', '$argon2id$v=19$m=65536,t=3,p=4$pyIicy+VMlWUbz+nbR1y0Q$w8CBi24yfGKQnH9xskdGxV0BgnavJmLRdA/dvJejuUU', 'staff', NOW()),
    ('David Chen', 'david.staff@subscription.com', '$argon2id$v=19$m=65536,t=3,p=4$pyIicy+VMlWUbz+nbR1y0Q$w8CBi24yfGKQnH9xskdGxV0BgnavJmLRdA/dvJejuUU', 'staff', NOW()),
    ('Marcus Vance', 'marcus.vance@quantumdyn.com', '$argon2id$v=19$m=65536,t=3,p=4$pyIicy+VMlWUbz+nbR1y0Q$w8CBi24yfGKQnH9xskdGxV0BgnavJmLRdA/dvJejuUU', 'customer', NOW()),
    ('Sophia Martinez', 'sophia@cybershield.io', '$argon2id$v=19$m=65536,t=3,p=4$pyIicy+VMlWUbz+nbR1y0Q$w8CBi24yfGKQnH9xskdGxV0BgnavJmLRdA/dvJejuUU', 'customer', NOW()),
    ('Liam O''Connor', 'liam@vanguardlogistics.com', '$argon2id$v=19$m=65536,t=3,p=4$pyIicy+VMlWUbz+nbR1y0Q$w8CBi24yfGKQnH9xskdGxV0BgnavJmLRdA/dvJejuUU', 'customer', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (code, name, contact_person, email, phone, tier, is_active, created_at)
VALUES
    ('CUST-3042', 'Stellar Dynamics Inc.', 'Dr. Julian Thorne', 'julian.t@stellardynamics.com', '+1-415-555-0192', 'Enterprise Annual', true, NOW()),
    ('CUST-3043', 'CyberShield Security', 'Sophia Martinez', 'sophia@cybershield.io', '+1-212-555-0144', 'Enterprise Tier', true, NOW()),
    ('CUST-3044', 'BioHealth Informatics', 'Dr. Aris Thorne', 'billing@biohealth-info.org', '+1-617-555-0188', 'Enterprise Tier', true, NOW()),
    ('CUST-3045', 'Vanguard Logistics Corp', 'Liam O''Connor', 'liam@vanguardlogistics.com', '+1-312-555-0177', 'Pro Monthly', true, NOW()),
    ('CUST-3046', 'OmniRetail Global', 'Chloe Bennett', 'finance@omniretail.com', '+1-206-555-0122', 'Enterprise Tier', true, NOW()),
    ('CUST-3047', 'NovaStream Media', 'Lucas Ray', 'admin@novastream.tv', '+1-310-555-0165', 'Pro Tier', true, NOW()),
    ('CUST-3048', 'Quantum Financial Solutions', 'Victoria Sterling', 'v.sterling@quantumfin.ch', '+41-22-555-0199', 'Enterprise Annual', true, NOW()),
    ('CUST-3049', 'HyperScale Robotics', 'Kenji Takahashi', 'kenji@hyperscalerobotics.jp', '+81-3-5555-0133', 'Enterprise Tier', true, NOW()),
    ('CUST-3050', 'Aurora Cloud Networks', 'Frederik Lind', 'accounts@auroracloud.se', '+46-8-555-0145', 'Pro Monthly', true, NOW()),
    ('CUST-3051', 'PulseMetrics Analytics', 'Tara Simmons', 'tara@pulsemetrics.ai', '+1-650-555-0118', 'Startup Tier', true, NOW()),
    ('CUST-3052', 'EcoSmart Energy Labs', 'Matthias Bauer', 'm.bauer@ecosmart-energy.de', '+49-30-555-0176', 'Pro Tier', true, NOW()),
    ('CUST-3053', 'PrimeMatrix AI', 'Amara Okafor', 'amara@primematrix.tech', '+1-404-555-0155', 'Enterprise Annual', true, NOW()),
    ('CUST-3054', 'CloudForge DevOps', 'Nikhil Sharma', 'nikhil@cloudforge.io', '+91-80-5555-0190', 'Pro Monthly', true, NOW()),
    ('CUST-3055', 'ZenDesk Partners UK', 'Oliver Wright', 'oliver@zendeskpartners.co.uk', '+44-20-7946-0182', 'Enterprise Annual', true, NOW()),
    ('CUST-3056', 'Alpine Data Systems', 'Claire Dubois', 'c.dubois@alpinedata.fr', '+33-1-40-55-0123', 'Pro Monthly', true, NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (code, name, category, sales_price, cost_price, description, is_active, created_at, updated_at)
VALUES
    ('PRD-006', 'API Gateway & Webhook Relay', 'Developer Tools', 79.00, 15.00, 'High-throughput programmable webhook dispatcher and API proxy engine.', true, NOW(), NOW()),
    ('PRD-007', 'Compliance & Audit Vault', 'Security & Governance', 299.00, 60.00, 'Immutable SOC-2, HIPAA and GDPR compliance logging and audit verification repository.', true, NOW(), NOW()),
    ('PRD-008', 'Global Multi-Region CDN Accelerator', 'Infrastructure', 189.00, 45.00, 'Low-latency Anycast content delivery network with automated edge caching and TLS termination.', true, NOW(), NOW()),
    ('PRD-009', 'Automated Billing & Revenue Engine', 'Financial SaaS', 129.00, 25.00, 'Subscription lifecycle, automated recurring invoicing, and tax reconciliation platform.', true, NOW(), NOW()),
    ('PRD-010', 'AI Workflow Automation Studio', 'AI Solutions', 349.00, 70.00, 'Visual pipeline studio for autonomous agents, LLM integrations, and scheduled tasks.', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO product_variants (product_id, code, name, additional_price, is_active, created_at)
SELECT p.id, v.code, v.name, v.additional_price, true, NOW()
FROM products p
JOIN (VALUES
    ('PRD-006', 'VAR-006-1', 'Standard Rate Limit (10k req/min)', 0.00),
    ('PRD-006', 'VAR-006-2', 'Dedicated High-Throughput Cluster', 50.00),
    ('PRD-007', 'VAR-007-1', 'SOC-2 Standard Retention (1 Year)', 0.00),
    ('PRD-007', 'VAR-007-2', 'FedRAMP & HIPAA Permanent Vault', 150.00),
    ('PRD-008', 'VAR-008-1', 'Global 50 Edge PoPs', 0.00),
    ('PRD-008', 'VAR-008-2', '200+ Tier-1 Anycast Edge Network', 100.00),
    ('PRD-009', 'VAR-009-1', 'Standard Multi-Currency Core', 0.00),
    ('PRD-009', 'VAR-009-2', 'Automated Global Tax Filing Suite', 70.00),
    ('PRD-010', 'VAR-010-1', '50k Monthly Workflow Executions', 0.00),
    ('PRD-010', 'VAR-010-2', 'Unlimited Neural Flow Workflows', 250.00)
) AS v(pcode, code, name, additional_price) ON p.code = v.pcode
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants pv WHERE pv.code = v.code
);

INSERT INTO plans (code, name, description, product_id, billing_interval, price, min_quantity, available_from, allow_pause, allow_renewal, allow_closure, trial_days, is_active, created_at, updated_at)
SELECT pl.code, pl.name, pl.description, p.id, pl.billing_interval, pl.price, 1, NOW(), true, true, true, pl.trial_days, true, NOW(), NOW()
FROM products p
JOIN (VALUES
    ('PLN-006', 'API Gateway Pro Monthly', '10k requests/min, Webhook retries, Rate limiting, Developer dashboard', 'PRD-006', 'monthly', 79.00, 14),
    ('PLN-007', 'API Gateway Scale Annual', '10k requests/min, Dedicated IP, Annual SLA discount applied, 2 months free', 'PRD-006', 'yearly', 790.00, 14),
    ('PLN-008', 'Compliance Vault Pro Monthly', 'SOC-2 audit trails, Tamper-proof logs, Automated reports, Daily backup', 'PRD-007', 'monthly', 299.00, 14),
    ('PLN-009', 'Enterprise Security & Audit Suite', 'Full FedRAMP and HIPAA compliance vault, 7-year retention, Audit readiness', 'PRD-007', 'yearly', 2990.00, 30),
    ('PLN-010', 'Global Anycast CDN Monthly', '50 global edge locations, Unlimited bandwidth, HTTP/3, Edge TLS', 'PRD-008', 'monthly', 189.00, 14),
    ('PLN-011', 'AI Automation Studio Team Monthly', '50k monthly workflow executions, Visual graph builder, Gemini API integration', 'PRD-010', 'monthly', 349.00, 14),
    ('PLN-012', 'AI Automation Studio Enterprise Annual', 'Unlimited workflows, Dedicated GPU instances, Custom model fine-tuning', 'PRD-010', 'yearly', 3490.00, 30),
    ('PLN-013', 'Billing & Revenue Pro Quarterly', 'Automated recurring billing, Multi-currency, Tax engine, Quarterly cadence', 'PRD-009', 'quarterly', 349.00, 14)
) AS pl(code, name, description, pcode, billing_interval, price, trial_days) ON p.code = pl.pcode
ON CONFLICT (code) DO NOTHING;

INSERT INTO subscriptions (code, customer_id, customer_name, plan_name, billing_interval, rate, amount, start_date, expiry_date, next_billing_date, status, created_at)
SELECT s.code, c.id, c.name, s.plan_name, s.billing_interval, s.rate, s.amount, s.start_date, s.expiry_date, s.next_billing_date, s.status, NOW()
FROM customers c
JOIN (VALUES
    ('SUB-2042', 'CUST-3042', 'Enterprise Dedicated Suite', 'yearly', '$3,600.00 / yr', 3600.00, '15-Jan-2026', '15-Jan-2027', '15-Jan-2027', 'Active'),
    ('SUB-2043', 'CUST-3043', 'Enterprise Security & Audit Suite', 'yearly', '$2,990.00 / yr', 2990.00, '01-Feb-2026', '01-Feb-2027', '01-Feb-2027', 'Active'),
    ('SUB-2044', 'CUST-3044', 'Professional Team Annual', 'yearly', '$1,490.00 / yr', 1490.00, '10-Mar-2026', '10-Mar-2027', '10-Mar-2027', 'Active'),
    ('SUB-2045', 'CUST-3045', 'Professional Team Monthly', 'monthly', '$149.00 / mo', 149.00, '01-Oct-2026', '01-Nov-2026', '01-Nov-2026', 'Active'),
    ('SUB-2046', 'CUST-3046', 'Enterprise Dedicated Suite', 'yearly', '$3,600.00 / yr', 3600.00, '20-May-2026', '20-May-2027', '20-May-2027', 'Active'),
    ('SUB-2047', 'CUST-3047', 'Global Anycast CDN Monthly', 'monthly', '$189.00 / mo', 189.00, '05-Oct-2026', '05-Nov-2026', '05-Nov-2026', 'Active'),
    ('SUB-2048', 'CUST-3048', 'AI Automation Studio Enterprise Annual', 'yearly', '$3,490.00 / yr', 3490.00, '18-Apr-2026', '18-Apr-2027', '18-Apr-2027', 'Active'),
    ('SUB-2049', 'CUST-3049', 'Professional Team Monthly', 'monthly', '$149.00 / mo', 149.00, '12-Oct-2026', '12-Nov-2026', '12-Nov-2026', 'Active'),
    ('SUB-2050', 'CUST-3050', 'API Gateway Pro Monthly', 'monthly', '$79.00 / mo', 79.00, '25-Oct-2026', '25-Nov-2026', '25-Nov-2026', 'Active'),
    ('SUB-2051', 'CUST-3051', 'Starter Cloud Monthly', 'monthly', '$49.00 / mo', 49.00, '01-Oct-2026', '01-Nov-2026', '01-Nov-2026', 'Active'),
    ('SUB-2052', 'CUST-3052', 'Professional Team Monthly', 'monthly', '$149.00 / mo', 149.00, '15-Jul-2026', '15-Nov-2026', '15-Nov-2026', 'Paused'),
    ('SUB-2053', 'CUST-3053', 'AI Automation Studio Team Monthly', 'monthly', '$349.00 / mo', 349.00, '02-Oct-2026', '02-Nov-2026', '02-Nov-2026', 'Active'),
    ('SUB-2054', 'CUST-3054', 'API Gateway Scale Annual', 'yearly', '$790.00 / yr', 790.00, '14-Aug-2026', '14-Aug-2027', '14-Aug-2027', 'Active'),
    ('SUB-2055', 'CUST-3055', 'Enterprise Dedicated Suite', 'yearly', '$3,600.00 / yr', 3600.00, '05-Nov-2025', '05-Nov-2026', '05-Nov-2026', 'Upcoming Renewal'),
    ('SUB-2056', 'CUST-3056', 'Professional Team Monthly', 'monthly', '$149.00 / mo', 149.00, '01-Jan-2026', '01-Oct-2026', 'N/A', 'Closed')
) AS s(code, ccode, plan_name, billing_interval, rate, amount, start_date, expiry_date, next_billing_date, status) ON c.code = s.ccode
ON CONFLICT (code) DO NOTHING;

INSERT INTO invoices (code, customer_id, customer_name, subscription_id, issue_date, due_date, subtotal, discount_amount, tax_amount, total_amount, paid_amount, status, created_at)
SELECT inv.code, c.id, c.name, s.id, inv.issue_date, inv.due_date, inv.subtotal, inv.discount_amount, inv.tax_amount, inv.total_amount, inv.paid_amount, inv.status, NOW()
FROM customers c
JOIN (VALUES
    ('INV-2026-093', 'CUST-3042', 'SUB-2042', '15-Jan-2026', '30-Jan-2026', 3272.73, 0.00, 327.27, 3600.00, 3600.00, 'Paid'),
    ('INV-2026-094', 'CUST-3043', 'SUB-2043', '01-Feb-2026', '15-Feb-2026', 2718.18, 0.00, 271.82, 2990.00, 2990.00, 'Paid'),
    ('INV-2026-095', 'CUST-3044', 'SUB-2044', '10-Mar-2026', '25-Mar-2026', 1354.55, 0.00, 135.45, 1490.00, 1490.00, 'Paid'),
    ('INV-2026-096', 'CUST-3045', 'SUB-2045', '25-Oct-2026', '05-Nov-2026', 135.45, 0.00, 13.55, 149.00, 0.00, 'Pending'),
    ('INV-2026-097', 'CUST-3046', 'SUB-2046', '20-May-2026', '05-Jun-2026', 3272.73, 0.00, 327.27, 3600.00, 3600.00, 'Paid'),
    ('INV-2026-098', 'CUST-3047', 'SUB-2047', '28-Oct-2026', '10-Nov-2026', 171.82, 0.00, 17.18, 189.00, 0.00, 'Pending'),
    ('INV-2026-099', 'CUST-3048', 'SUB-2048', '18-Apr-2026', '02-May-2026', 3172.73, 0.00, 317.27, 3490.00, 3490.00, 'Paid'),
    ('INV-2026-100', 'CUST-3049', 'SUB-2049', '12-Oct-2026', '26-Oct-2026', 135.45, 0.00, 13.55, 149.00, 149.00, 'Paid'),
    ('INV-2026-101', 'CUST-3050', 'SUB-2050', '25-Oct-2026', '08-Nov-2026', 71.82, 0.00, 7.18, 79.00, 79.00, 'Paid'),
    ('INV-2026-102', 'CUST-3051', 'SUB-2051', '22-Oct-2026', '03-Nov-2026', 44.55, 0.00, 4.45, 49.00, 0.00, 'Pending'),
    ('INV-2026-103', 'CUST-3052', 'SUB-2052', '01-Oct-2026', '15-Oct-2026', 135.45, 0.00, 13.55, 149.00, 0.00, 'Overdue'),
    ('INV-2026-104', 'CUST-3053', 'SUB-2053', '02-Oct-2026', '16-Oct-2026', 317.27, 0.00, 31.73, 349.00, 349.00, 'Paid'),
    ('INV-2026-105', 'CUST-3054', 'SUB-2054', '14-Aug-2026', '28-Aug-2026', 718.18, 0.00, 71.82, 790.00, 790.00, 'Paid'),
    ('INV-2026-106', 'CUST-3055', 'SUB-2055', '29-Oct-2026', '05-Nov-2026', 3600.00, 0.00, 0.00, 3600.00, 0.00, 'Pending'),
    ('INV-2026-107', 'CUST-3056', 'SUB-2056', '10-Sep-2026', '25-Sep-2026', 135.45, 0.00, 13.55, 149.00, 0.00, 'Overdue')
) AS inv(code, ccode, scode, issue_date, due_date, subtotal, discount_amount, tax_amount, total_amount, paid_amount, status) ON c.code = inv.ccode
LEFT JOIN subscriptions s ON s.code = inv.scode
ON CONFLICT (code) DO NOTHING;

INSERT INTO payments (code, customer_id, customer_name, invoice_code, amount, payment_date, payment_method, status, created_at)
SELECT p.code, c.id, c.name, p.invoice_code, p.amount, p.payment_date, p.payment_method, p.status, NOW()
FROM customers c
JOIN (VALUES
    ('PAY-8823', 'CUST-3042', 'INV-2026-093', 3600.00, '28-Jan-2026', 'Direct Wire Settlement', 'Cleared'),
    ('PAY-8824', 'CUST-3043', 'INV-2026-094', 2990.00, '10-Feb-2026', 'Stripe ACH Transfer', 'Cleared'),
    ('PAY-8825', 'CUST-3044', 'INV-2026-095', 1490.00, '22-Mar-2026', 'Credit Card (Visa ···· 8021)', 'Cleared'),
    ('PAY-8826', 'CUST-3046', 'INV-2026-097', 3600.00, '01-Jun-2026', 'Direct Wire Settlement', 'Cleared'),
    ('PAY-8827', 'CUST-3048', 'INV-2026-099', 3490.00, '30-Apr-2026', 'Bank Transfer (SEPA)', 'Cleared'),
    ('PAY-8828', 'CUST-3049', 'INV-2026-100', 149.00, '24-Oct-2026', 'Credit Card (Mastercard ···· 4410)', 'Cleared'),
    ('PAY-8829', 'CUST-3050', 'INV-2026-101', 79.00, '26-Oct-2026', 'Credit Card (Visa ···· 9012)', 'Cleared'),
    ('PAY-8830', 'CUST-3053', 'INV-2026-104', 349.00, '14-Oct-2026', 'Stripe ACH Transfer', 'Cleared'),
    ('PAY-8831', 'CUST-3054', 'INV-2026-105', 790.00, '25-Aug-2026', 'Bank Transfer (ACH)', 'Cleared'),
    ('PAY-8832', 'CUST-3045', 'INV-2026-096', 149.00, '31-Oct-2026', 'Bank Transfer (ACH)', 'Pending'),
    ('PAY-8833', 'CUST-3047', 'INV-2026-098', 189.00, '30-Oct-2026', 'Credit Card (Visa ···· 3120)', 'Pending'),
    ('PAY-8834', 'CUST-3051', 'INV-2026-102', 49.00, '29-Oct-2026', 'Credit Card (Mastercard ···· 7731)', 'Pending'),
    ('PAY-8835', 'CUST-3042', 'INV-2026-093', 500.00, '20-Oct-2026', 'Credit Card (Amex ···· 1004)', 'Cleared'),
    ('PAY-8836', 'CUST-3046', 'INV-2026-097', 1200.00, '22-Oct-2026', 'Stripe ACH Transfer', 'Cleared'),
    ('PAY-8837', 'CUST-3055', 'INV-2026-106', 3600.00, '31-Oct-2026', 'Bank Transfer (BACS/SEPA)', 'Pending')
) AS p(code, ccode, invoice_code, amount, payment_date, payment_method, status) ON c.code = p.ccode
ON CONFLICT (code) DO NOTHING;

INSERT INTO quotations (code, customer_id, customer_name, contact_person, plan_name, amount, expiry_date, status, created_at)
SELECT q.code, c.id, c.name, c.contact_person, q.plan_name, q.amount, q.expiry_date, q.status, NOW()
FROM customers c
JOIN (VALUES
    ('QT-2026-043', 'CUST-3042', 'Enterprise Dedicated Multi-Region Node', 42000.00, '15-Dec-2026', 'Accepted'),
    ('QT-2026-044', 'CUST-3043', 'Compliance & Security Enterprise Suite', 24500.00, '30-Nov-2026', 'Accepted'),
    ('QT-2026-045', 'CUST-3044', 'HIPAA Compliance Vault & 100 Seats', 18900.00, '20-Nov-2026', 'Pending Review'),
    ('QT-2026-046', 'CUST-3045', 'High-Throughput Fleet Tracking API', 9600.00, '18-Nov-2026', 'Pending Review'),
    ('QT-2026-047', 'CUST-3046', 'Global CDN & Scaled Invoicing Platform', 38000.00, '28-Nov-2026', 'Pending Review'),
    ('QT-2026-048', 'CUST-3047', 'Edge Video Transcoding CDN Package', 15400.00, '05-Nov-2026', 'Expiring Soon'),
    ('QT-2026-049', 'CUST-3048', 'Ultra-Low Latency Dedicated FinTech Node', 54000.00, '10-Dec-2026', 'Accepted'),
    ('QT-2026-050', 'CUST-3049', 'Realtime Telemetry & Neural Automation', 28500.00, '04-Nov-2026', 'Expiring Soon'),
    ('QT-2026-051', 'CUST-3050', 'Hybrid Cloud Interconnect Suite', 11200.00, '15-Oct-2026', 'Expired'),
    ('QT-2026-052', 'CUST-3053', 'AI Workflow Studio (1M Executions/Mo)', 32000.00, '25-Nov-2026', 'Pending Review')
) AS q(code, ccode, plan_name, amount, expiry_date, status) ON c.code = q.ccode
ON CONFLICT (code) DO NOTHING;

INSERT INTO quotation_templates (code, name, discount, validity, description, is_active, created_at)
VALUES
    ('TPL-04', 'Non-Profit & Academic Grant Plan', '30% First Year', '60 Days', 'Subsidized proposal package for recognized research bodies and non-profits.', true, NOW()),
    ('TPL-05', 'Global Strategic Partner Agreement', '35% Multi-Year', '90 Days', 'Exclusive pricing schedule for authorized system integration partners.', true, NOW()),
    ('TPL-06', 'Seed-Stage Founder Launchpad Bundle', '40% Off List', '21 Days', 'High-velocity onboarding package for early-stage startup accelerators.', true, NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO staff_tasks (task, customer_name, due_date, status, priority, task_type, created_at)
SELECT t.task, t.customer_name, t.due_date, t.status, t.priority, t.task_type, NOW()
FROM (VALUES
    ('Follow up overdue payment on invoice INV-2026-103', 'EcoSmart Energy Labs', '02-Nov', 'Pending', 'High', 'Invoice'),
    ('Process annual renewal contract review', 'Stellar Dynamics Inc.', '04-Nov', 'Upcoming', 'High', 'Renewal'),
    ('Audit reverse charge VAT identification', 'ZenDesk Partners UK', '05-Nov', 'Pending', 'Medium', 'Compliance'),
    ('Conduct enterprise onboarding technical call', 'Quantum Financial Solutions', '06-Nov', 'Upcoming', 'High', 'Onboarding'),
    ('Resolve ACH transfer settlement flag', 'Vanguard Logistics Corp', '07-Nov', 'Pending', 'Urgent', 'Payment'),
    ('Prepare quarterly commercial proposal', 'OmniRetail Global', '08-Nov', 'Upcoming', 'Medium', 'Quotation'),
    ('Verify tax-exempt certification', 'BioHealth Informatics', '09-Nov', 'Pending', 'Low', 'Tax'),
    ('Schedule customer success quarterly business review', 'HyperScale Robotics', '10-Nov', 'Completed', 'Normal', 'Support')
) AS t(task, customer_name, due_date, status, priority, task_type)
WHERE NOT EXISTS (
    SELECT 1 FROM staff_tasks st WHERE st.task = t.task
);

INSERT INTO tax_rules (code, name, rate, category, is_active, created_at)
VALUES
    ('TAX-006', 'Canada Harmonized Sales Tax (HST)', 13.00, 'Goods & Services Tax (GST)', true, NOW()),
    ('TAX-007', 'Australia Goods & Services Tax (GST)', 10.00, 'Goods & Services Tax (GST)', true, NOW()),
    ('TAX-008', 'Singapore Goods & Services Tax (GST)', 9.00, 'Goods & Services Tax (GST)', true, NOW()),
    ('TAX-009', 'Germany Mehrwertsteuer (MwSt)', 19.00, 'Value Added Tax (VAT)', true, NOW()),
    ('TAX-010', 'New York State & City Sales Tax', 8.88, 'Sales Tax', true, NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO discounts (code, name, discount_type, value, valid_until, is_active, created_at)
VALUES
    ('PARTNER15', 'PARTNER15', 'percentage', 15.00, '31-Dec-2027', true, NOW()),
    ('SUMMER26', 'SUMMER26', 'percentage', 20.00, '31-Jul-2026', true, NOW()),
    ('NONPROFIT30', 'NONPROFIT30', 'percentage', 30.00, '31-Dec-2028', true, NOW()),
    ('CREDIT100', 'CREDIT100', 'fixed', 100.00, '30-Jun-2027', true, NOW()),
    ('ENTERPRISE10', 'ENTERPRISE10', 'percentage', 10.00, '31-Dec-2026', true, NOW())
ON CONFLICT (code) DO NOTHING;

