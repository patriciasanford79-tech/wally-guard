# Receipt vault

Local receipt database extracted from Patricia.sanford79@gmail.com.

## Files
- `build_vault.py` — extractor (Gmail JSON → SQLite → Excel + summary)
- `receipts.db` — SQLite database (single `receipts` table)
- `receipts.xlsx` — Excel workbook with autofilter, frozen header, dollar formatting
- `receipts_errors.csv` — messages that didn't yield a parseable total (msg_id, subject, sender, reason)
- `summary.txt` — totals by category and top merchants

## Schema
`date, time, merchant, merchant_address, category, items, subtotal, tax, total,
payment_method_last4, source, gmail_msg_id, gmail_link, notes`

## Categories
`gas, food/groceries, utilities, medical, kids, household, business, legal/gov,
tech/saas, shipping, other`

## Re-running

The script reads `raw/*.json` (Gmail thread/message dumps), extracts receipts via
regex, and writes the DB + Excel. It's idempotent — re-running with new raw files
upserts on `gmail_msg_id` so nothing duplicates.

```bash
# init schema
python3 build_vault.py init

# ingest raw/ → DB
python3 build_vault.py ingest

# export DB → xlsx + summary
python3 build_vault.py export

# all of the above
python3 build_vault.py
```

## Scope

Date range: 2025-01-01 → 2026-05-19. This first pass uses targeted sender queries
(Apple, Stripe receipts, Found, 2checkout, MUSC, PayPal, Boost Mobile). Many more
receipts (Amazon, utilities, gas, shipping, etc.) likely live in the inbox; expand
by adding raw JSON dumps to `raw/` and re-running.
