# Pharmacy Inventory & Prescription Billing API

A REST API built with Node.js, Express, Sequelize, and MySQL. The API manages patients and medicine stock, creates billed prescriptions, and produces an inventory/sales report.

## Requirements and setup

- Node.js 18 or newer
- MySQL 8 (or a compatible MySQL server)

1. Create a MySQL database and a least-privilege database user. For example:

   ```sql
   CREATE DATABASE pharmacy_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'pharmacy_app'@'localhost' IDENTIFIED BY 'replace_with_a_strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
     ON pharmacy_inventory.* TO 'pharmacy_app'@'localhost';
   ```

2. Copy `.env.example` to `.env`, then set the database credentials and allowed browser origin. Set `DB_SSL=true` when connecting to a MySQL server that requires TLS; certificate verification remains enabled.
3. Install dependencies and apply the schema/demo data:

   ```sh
   npm install
   npm run db:migrate
   npm run db:seed
   npm start
   ```

The API listens on `http://localhost:3000` by default. `GET /health` is a liveness endpoint. Do not use the demo seed data in production.

## Data model

- A **Patient** has many **Prescriptions**.
- A **Prescription** has many **PrescriptionItems**.
- A **Medicine** appears in many **PrescriptionItems**.
- `prescription_items` is the relational junction table between prescriptions and medicines; it stores quantity and price-at-sale snapshots. A unique constraint prevents duplicate medicine lines on one prescription.

Prescription creation runs as a database transaction, locks the requested medicine rows, verifies stock, records immutable line prices, decrements inventory, and saves the invoice total. A failed validation or insufficient stock rolls the entire operation back.

## API conventions

All request and response bodies use JSON. Successful collection responses use `{ "data": [...], "pagination": { "page": 1, "limit": 20, "total": 2 } }`; successful resource responses use `{ "data": {...} }`. List endpoints accept `page` and `limit` (default 1 and 20; maximum limit 100).

Errors use `{ "error": "message" }`. Validation failures may also include a `details` array. The API uses:

- `200 OK` for successful reads and updates
- `201 Created` for creation
- `204 No Content` for deletion
- `400 Bad Request` for invalid payloads/filters
- `404 Not Found` for missing records or routes
- `409 Conflict` for duplicate unique values, referenced records, or insufficient stock
- `500 Internal Server Error` for unexpected server failures

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/api/patients?page=1&limit=20` | List patients |
| POST | `/api/patients` | Create patient |
| GET | `/api/patients/:id` | Get patient |
| PATCH | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient (409 if referenced by a prescription) |
| GET | `/api/medicines?search=para&category=Analgesic&lowStock=true` | Search/filter stock |
| POST | `/api/medicines` | Add medicine |
| GET | `/api/medicines/:id` | Get medicine |
| PATCH | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine (409 if referenced by a prescription) |
| GET | `/api/prescriptions?patientId=1&status=billed` | List prescriptions with patient and item details |
| POST | `/api/prescriptions` | Create prescription and bill atomically |
| GET | `/api/prescriptions/:id` | Get prescription invoice |
| GET | `/api/reports/inventory?category=Analgesic&lowStock=true` | Inventory, dispensed units, and sales report (parameterized raw SQL) |

### Example payloads

Create a patient:

```json
{
  "firstName": "Aarav",
  "lastName": "Shah",
  "email": "aarav.shah@example.com",
  "phone": "+91-9000000001",
  "dateOfBirth": "1990-03-15"
}
```

Create a medicine:

```json
{
  "name": "Paracetamol 500 mg",
  "sku": "MED-PAR-500",
  "category": "Analgesic",
  "unitPrice": "2.50",
  "stockQuantity": 250,
  "reorderLevel": 25,
  "expiryDate": "2027-12-31"
}
```

Create a prescription/invoice:

```json
{
  "patientId": 1,
  "items": [
    { "medicineId": 1, "quantity": 2 },
    { "medicineId": 2, "quantity": 1 }
  ]
}
```

The response includes the billed total and each line's unit-price and line-total snapshots. Stock is deducted only when the transaction succeeds.

## Tests

Run the dependency-free unit tests with:

```sh
npm test
```
