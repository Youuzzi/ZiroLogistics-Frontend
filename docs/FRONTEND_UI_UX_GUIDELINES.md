# ZiroLogistics WMS — Frontend UI/UX Guidelines

**Status:** Draft — pending review  
**Scope:** Frontend user experience and operational workflows  
**Related document:** [Design System](../DESIGN.md)  
**Backend reference:** Audited ZiroLogistics Backend API contract

## 1. Purpose

This document defines interaction and workflow standards for the WMS frontend. It covers authentication, master data, inventory transactions, inventory visibility, and operational feedback.

The frontend must remain aligned with actual backend capabilities. Backend validation, authorization, and persisted results are authoritative.

## 2. Core UX principles

- **Operational clarity:** users can identify the data, location, action, and expected outcome.
- **Error prevention:** use clear labels, field validation, review context, and duplicate-submission prevention.
- **Transparent feedback:** distinguish loading, success, validation failure, authorization failure, business conflict, missing resource, server failure, and uncertain outcome.
- **Backend as source of truth:** frontend checks improve usability but do not replace backend rules.
- **Preserve context:** retain entered data when a recoverable error occurs.

## 3. Global interaction patterns

### 3.1 Loading

- Show a loading state while a request is pending.
- Disable the relevant submit control during processing.
- Avoid showing placeholder zeroes as confirmed data.
- Prefer local component loading over blocking the entire application when practical.

### 3.2 Empty and error states

- Distinguish an empty result from a request failure.
- Explain why the content is empty and provide a relevant next action when supported.
- Do not expose stack traces, SQL, internal class names, or sensitive implementation details.
- Offer retry only when retry is safe.

### 3.3 Pagination, search, and filters

- Reflect actual API pagination and current page state.
- Handle empty pages and invalid page transitions.
- Do not imply the first page contains every record.
- Do not show search/filter controls unless they are connected to working behavior.
- Do not invent pagination for endpoints that return a simple list.

### 3.4 HTTP status handling

- **400:** explain invalid request or business input where the response provides enough context.
- **401:** treat as authentication failure; clear invalid session data as appropriate and request login.
- **403:** show access denied while preserving a valid authenticated session.
- **404:** explain that the requested resource was not found.
- **409:** explain the relevant conflict, such as duplicate code, duplicate SKU, duplicate request ID, capacity, or insufficient stock.
- **5xx/network failure:** explain that the service could not confirm the result. For inventory transactions, consider the outcome uncertain until reconciled.

Do not collapse all errors into logout or a generic failure message.

## 4. Authentication and session

### 4.1 Login

Provide email and password inputs, show/hide password, field feedback, loading state, and authentication feedback.

After successful login, store authentication data using the application's approved session strategy and navigate to the authenticated area.

### 4.2 Registration

The audited backend requires a password of at least 8 characters, at least one digit, and at least one uppercase character. New accounts receive `ROLE_STAFF`.

Do not offer self-assigned privileged roles in the registration form.

### 4.3 Session and authorization

- Handle 401 separately from 403.
- Do not clear a valid session merely because a user lacks permission for one operation.
- Frontend role checks are presentation controls only; backend authorization is authoritative.
- Avoid exposing actions that the user cannot perform when role information is available, while still handling backend 403 responses safely.

## 5. Dashboard

The audited backend summary fields are:

- `totalWarehouses`
- `totalBins`
- `totalItems`
- `totalTransactionsToday`

**Important limitation:** the current backend implementation returns a hard-coded value of 10 for `totalTransactionsToday`. Do not present it as an actual transaction count until the backend calculation is implemented and verified.

Dashboard behavior:

- Show loading, success, and error states.
- Do not silently convert API errors into legitimate zero values.
- Do not claim real-time updates without an implemented real-time mechanism.
- Do not claim system health based only on successful frontend rendering.
- Do not invent stock accuracy, efficiency, or transaction trend metrics.

## 6. Warehouse management

### Supported API operations

- Create warehouse.
- List warehouses.

The audited API does not currently expose warehouse update or delete operations.

### Create form

- `code`: required, 3–50 characters.
- `name`: required.
- `address`: optional.

UX requirements:

- Mark required fields.
- Show field-level validation.
- Explain duplicate-code conflicts.
- Prevent repeated submission while processing.
- On success, refresh or update the visible list.
- Do not show functional edit/delete actions without backend support.

## 7. Bin management

### Supported API operations

- Create bin.
- List bins by warehouse.

The audited API does not currently expose bin update or delete operations.

### Create form

- `warehousePublicId`: required.
- `zoneName`: optional.
- `rackNumber`: optional.
- `binCode`: required.
- `maxWeightCapacity`: required and positive.
- `minWeightThreshold`: optional.

UX requirements:

- Present warehouse choices using understandable names.
- Show the selected warehouse context.
- Validate positive capacity.
- Explain duplicate bin-code and missing-warehouse errors.
- Do not assume a newly created bin contains stock.

### List

Display warehouse, zone, rack, bin code, maximum weight capacity, current weight occupancy, and minimum weight threshold when returned.

Do not derive weight from item quantity without an explicit conversion rule.

## 8. Item management

### Supported API operations

- Create item.
- List items.

The audited API does not currently expose item update or delete operations.

### Create form

- `sku`: required.
- `name`: required.
- `baseUom`: required.
- `description`: optional.
- `minStockLevel`: required.
- `weightPerUnit`: required and positive.

UX requirements:

- Make SKU easy to identify.
- Display base UOM consistently; backend normalizes it to uppercase.
- Explain duplicate-SKU conflicts.
- Validate positive weight.
- Handle paginated list results.

## 9. Inbound

Inbound records stock entering a bin.

Required fields: `requestId`, `sku`, `binCode`, `quantity`. Quantity must be positive. `referenceNo` and `note` are optional.

Workflow:

1. Select or enter item.
2. Select or enter destination bin.
3. Enter quantity and optional reference/note.
4. Review item, destination, and quantity.
5. Submit once.
6. Display the confirmed result.

Handle missing data, duplicate request ID, and capacity conflict clearly.

### Transaction uncertainty

A network timeout or lost response does not prove that the transaction was rolled back. Do not automatically generate a new request ID and submit another transaction when the prior outcome is uncertain.

The audited backend responds with a conflict for a reused request ID; it does not replay the original successful response. Do not promise automatic idempotent retry. Provide a safe reconciliation path, such as checking the ledger, before a new transaction is initiated.

## 10. Outbound

Outbound records stock leaving a bin.

Required fields: `requestId`, `sku`, `binCode`, `quantity`. Quantity must be positive. `referenceNo` and `note` are optional.

Workflow:

1. Select or enter item.
2. Select or enter source bin.
3. Enter quantity and optional reference/note.
4. Review the operation.
5. Submit once.
6. Display the confirmed result.

Handle missing inventory, insufficient quantity, duplicate request ID, and other backend conflicts.

Apply the same uncertain-outcome and reconciliation principles as inbound.

## 11. Transfer

Transfer moves inventory from a source bin to a destination bin.

Required fields: `requestId`, `sku`, `sourceBinCode`, `destinationBinCode`, and positive `quantity`. `note` is optional.

Workflow:

1. Select item.
2. Select source bin.
3. Select destination bin.
4. Enter quantity.
5. Review item, source, destination, and quantity together.
6. Submit once.
7. Display one user-facing transfer result.

Validation and feedback:

- Source and destination must differ.
- Quantity must be positive.
- Source stock must be sufficient.
- Destination capacity must be sufficient.
- Explain duplicate request ID and resource errors.

A successful backend transfer produces transfer-out and transfer-in ledger entries. Present this as one user operation, not two separately submitted transactions.

Apply uncertain-outcome reconciliation. Do not automatically resubmit with a new request ID.

## 12. Inventory

### 12.1 Stocks

Endpoint: `GET /api/v1.0/inventory/stocks`

Supported response fields include item SKU, item name, warehouse name, bin code, quantity, and status.

- Keep warehouse and bin context distinct.
- Reflect API pagination.
- Do not aggregate bin quantities unless an explicit aggregation rule is implemented and documented.

### 12.2 Low-stock alerts

Endpoint: `GET /api/v1.0/inventory/low-stock-alerts`

The audited backend aggregates available stock by SKU and warehouse, then compares the aggregate with the item's minimum stock level.

Therefore:
- Present the alert at SKU + warehouse level.
- Do not imply the alert is calculated independently per bin.
- Distinguish low stock from zero stock.
- Do not invent reorder quantities or purchasing recommendations.

### 12.3 Ledger

Endpoint: `GET /api/v1.0/inventory/ledger`

Supported fields include transaction public ID, SKU, item name, bin code, transaction type, quantity change, balance before/after, reference number, user ID, note, and creation timestamp.

- Preserve positive and negative quantity semantics.
- Make transaction type easy to identify.
- Format timestamps consistently and communicate timezone where relevant.
- Reflect API pagination.
- Do not label fetch-on-load data as a real-time feed.

## 13. Notifications and confirmations

Success notifications should identify the completed operation.

Error notifications should explain the problem and next safe action. Avoid generic messages when the backend provides a meaningful conflict or validation reason.

Use confirmation dialogs for destructive or high-impact actions, not for every routine interaction. Do not create destructive actions until the backend supports them.

## 14. Responsive UX

- **Desktop:** optimize data entry, comparison, and operational visibility.
- **Tablet:** preserve readable tables and touch-friendly controls.
- **Mobile:** use single-column layouts, stacked forms, readable transaction summaries, and reachable primary actions.
- Choose table scrolling or compact cards based on data relationships; do not blindly apply one strategy to every table.

## 15. Accessibility

Follow the WCAG 2.2 Level AA target defined in `DESIGN.md`. Include keyboard access, visible focus, labels, understandable validation, sufficient contrast, accessible dialogs, and non-color status cues. Automated scans must be complemented by manual checks.

## 16. Out-of-scope capabilities

The current audited contract does not establish support for purchase orders, sales orders, supplier/customer management, barcode/QR workflows, stocktaking, manual stock adjustments, picking/packing, shipping/delivery, warehouse scheduling, real-time notifications, or advanced reporting.

Do not expose these as implemented features without separate requirements and backend support.

## 17. Change control

Review new workflows against backend capabilities, business rules, authorization, data integrity, operational risk, accessibility, and responsive behavior. Update this document when backend behavior changes.

---

**End of draft — pending review.**