# ZiroLogistics WMS — UI/UX Validation Checklist

**Status:** Draft — pending review  
**Purpose:** Validate frontend implementation against [Design System](../DESIGN.md) and [Frontend UI/UX Guidelines](FRONTEND_UI_UX_GUIDELINES.md).

This checklist is an execution aid. An unchecked item is not evidence of failure; it means the check has not yet been recorded.

## 1. Evidence labels

Use these labels in review notes:

- **PASS:** verified through the specified test or inspection.
- **FAIL:** test performed and requirement not met.
- **NOT TESTED:** no test evidence yet.
- **NOT APPLICABLE:** requirement does not apply; include rationale.
- **BLOCKED:** could not test because of an external dependency.

Do not mark an item PASS based only on source-code appearance when runtime behavior is required.

## 2. Visual consistency

- [ ] Light theme is consistent across all implemented routes.
- [ ] Color tokens are centralized and used consistently.
- [ ] Text hierarchy is consistent.
- [ ] Spacing and radius follow the design system.
- [ ] Buttons have consistent variants and states.
- [ ] Cards and panels use consistent surface treatment.
- [ ] Icons are consistent and meaningful.
- [ ] No unsupported promotional or operational claims remain.

## 3. Responsive validation

Test at representative viewport sizes, including:

- [ ] Desktop wide (1440px or similar).
- [ ] Laptop (1280px or similar).
- [ ] Tablet portrait and landscape.
- [ ] Mobile narrow (320–375px).
- [ ] Mobile standard (390–430px).

For each implemented page:

- [ ] No unintended horizontal page overflow.
- [ ] Navigation remains usable.
- [ ] Primary actions remain reachable.
- [ ] Forms fit the viewport.
- [ ] Tables preserve data relationships and remain usable.
- [ ] Dialogs fit and remain operable.
- [ ] Text remains readable at zoom/text resizing.

## 4. Accessibility validation

- [ ] Normal text contrast meets 4.5:1 target.
- [ ] Large text contrast meets 3:1 target.
- [ ] Applicable non-text UI indicators meet 3:1 target.
- [ ] All interactive controls are keyboard reachable.
- [ ] Focus indicators are visible.
- [ ] Focus is not unintentionally trapped or obscured.
- [ ] Inputs have programmatically associated labels.
- [ ] Required fields are identified.
- [ ] Validation messages identify the relevant field.
- [ ] Status is not communicated through color alone.
- [ ] Icon-only controls have accessible names.
- [ ] Dialog and menu keyboard behavior is usable.
- [ ] Automated accessibility scan completed.
- [ ] Manual keyboard and screen-reader spot checks completed.

Target: WCAG 2.2 Level AA. Passing this checklist alone does not certify conformance.

## 5. Shared interaction states

- [ ] Loading state is visible.
- [ ] Empty state is distinct from error state.
- [ ] API failure does not silently appear as valid zero data.
- [ ] Duplicate submission is prevented while processing.
- [ ] Field validation is understandable.
- [ ] Success feedback appears only after confirmed success.
- [ ] Error feedback is actionable and does not expose internals.
- [ ] Retry is offered only when safe.
- [ ] HTTP 401 and 403 are handled differently.
- [ ] User input is preserved after recoverable failures.

## 6. Authentication

- [ ] Valid login succeeds.
- [ ] Invalid login shows understandable feedback.
- [ ] Password visibility control works and is accessible.
- [ ] Registration password rules match backend validation.
- [ ] Registration does not allow self-assigned privileged roles.
- [ ] 401 leads to appropriate re-authentication behavior.
- [ ] 403 preserves a valid authenticated session.
- [ ] Logout clears only the intended application authentication data.

## 7. Dashboard

- [ ] Warehouse count matches API response.
- [ ] Bin count matches API response.
- [ ] Item count matches API response.
- [ ] Transaction count is not presented as actual while backend value remains hard-coded.
- [ ] Loading and error states are distinguishable.
- [ ] No unsupported real-time or system-health claims are shown.
- [ ] Charts use actual data and documented calculations only.

## 8. Master data

### Warehouses

- [ ] Required code validation works.
- [ ] Code length constraints are reflected.
- [ ] Name is required.
- [ ] Address is optional.
- [ ] Duplicate code conflict is understandable.
- [ ] List state refreshes after successful creation.
- [ ] Update/delete actions that are not supported by the backend are not presented as available actions.

### Bins

- [ ] Warehouse selection is understandable.
- [ ] Bin code is required.
- [ ] Maximum capacity must be positive.
- [ ] Optional fields are represented correctly.
- [ ] Duplicate bin code conflict is understandable.
- [ ] Missing warehouse error is understandable.
- [ ] Capacity values are not confused with item quantity.

### Items

- [ ] SKU and name are required.
- [ ] Base UOM is required.
- [ ] Minimum stock level is represented.
- [ ] Weight per unit must be positive.
- [ ] Duplicate SKU conflict is understandable.
- [ ] Paginated list behavior is correct.
- [ ] Unsupported update/delete controls are absent.

## 9. Inventory transactions

### Inbound

- [ ] Required fields are validated.
- [ ] Quantity must be positive.
- [ ] Capacity conflict is understandable.
- [ ] Duplicate request ID conflict is understandable.
- [ ] Submit is disabled while processing.
- [ ] Uncertain outcome does not trigger blind retry with a new request ID.
- [ ] Successful operation is confirmed by backend response.

### Outbound

- [ ] Required fields are validated.
- [ ] Quantity must be positive.
- [ ] Missing inventory is handled.
- [ ] Insufficient stock conflict is understandable.
- [ ] Duplicate request ID conflict is understandable.
- [ ] Uncertain outcome does not trigger blind retry with a new request ID.
- [ ] Successful operation is confirmed by backend response.

### Transfer

- [ ] Item, source, destination, and quantity are visible in review.
- [ ] Source and destination cannot be the same.
- [ ] Quantity must be positive.
- [ ] Insufficient source stock is handled.
- [ ] Destination capacity conflict is handled.
- [ ] Duplicate request ID conflict is handled.
- [ ] Transfer is presented as one user operation.
- [ ] Uncertain outcome does not trigger blind retry with a new request ID.

## 10. Inventory visibility

### Stocks

- [ ] SKU and item name are visible.
- [ ] Warehouse and bin context are distinct.
- [ ] Quantity and status match API response.
- [ ] Pagination is accurate.
- [ ] No unsupported aggregation is implied.

### Low-stock alerts

- [ ] Alert presentation reflects SKU + warehouse aggregation.
- [ ] UI does not imply per-bin alert calculation.
- [ ] Low stock is distinguishable from zero stock.
- [ ] No unsupported reorder quantity is displayed.

### Ledger

- [ ] Transaction type is visible.
- [ ] Positive/negative quantity change is preserved.
- [ ] Balance before and after are distinct.
- [ ] Reference and actor information are displayed accurately.
- [ ] Timestamp formatting is consistent.
- [ ] Pagination works.
- [ ] Fetch-on-load is not labelled real-time.

## 11. Browser and regression testing

- [ ] All implemented routes load.
- [ ] Navigation links resolve to valid routes.
- [ ] No uncaught runtime errors occur during tested workflows.
- [ ] Browser console has no unexplained errors.
- [ ] API requests use the configured backend base URL.
- [ ] Authentication headers are attached where required.
- [ ] CORS behavior is validated in the intended local/demo environment.
- [ ] Critical workflows are tested end-to-end.
- [ ] Existing functionality is regression-tested after visual changes.

Record browser, viewport, test data, environment, date, and evidence link for each executed test.

## 12. Release review

- [ ] Design documents reviewed and accepted.
- [ ] Known backend limitations are reflected in the UI.
- [ ] No unsupported features are advertised.
- [ ] Critical responsive checks pass.
- [ ] Critical accessibility checks pass.
- [ ] Critical operational workflows pass.
- [ ] Known failures and deferred work are documented.

---

**End of draft — pending review.**