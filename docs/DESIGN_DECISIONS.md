# ZiroLogistics WMS — Design Decisions

**Status:** Draft — pending review  
**Scope:** Frontend visual and UX decisions  
**Parent reference:** [Design System](../DESIGN.md)

This log records the rationale, consequences, and status of significant frontend design decisions. It does not override backend contracts or architecture decisions.

## Decision status

- **Proposed:** suggested but not approved.
- **Accepted:** approved direction for implementation.
- **Superseded:** replaced by a later decision.
- **Rejected:** considered and intentionally not adopted.

## D-001 — Light theme as the default

**Status:** Proposed  
**Decision:** Use a modern light theme as the default WMS appearance.

**Rationale:** Operational tables, forms, stock information, and long work sessions benefit from a clean, high-contrast neutral surface. The current frontend uses a dark visual direction; the redesign should establish a more conventional enterprise operations interface.

**Consequences:**
- Define centralized light-theme tokens.
- Validate text and component contrast.
- Review every page and shared component for consistency.
- Dark mode is not part of the initial redesign scope.

## D-002 — Enterprise operational visual language

**Status:** Proposed  
**Decision:** Prefer restrained surfaces, clear hierarchy, consistent spacing, and functional components over decorative dashboard styling.

**Rationale:** The product is a warehouse operations tool. Information clarity and error prevention matter more than visual effects.

**Consequences:**
- Limit gradients, glow, and decorative elements.
- Use cards only when they group meaningful information.
- Keep data tables readable and information-dense.

## D-003 — Backend contract is the source of truth for UI capability

**Status:** Proposed  
**Decision:** The frontend must not present unsupported actions or metrics as implemented.

**Rationale:** The audited backend currently exposes create/list operations for warehouse, bin, and item master data; inventory endpoints; and inbound, outbound, and transfer operations. The audited contract does not establish master-data update/delete operations or several broader WMS capabilities.

**Consequences:**
- No fake edit/delete controls.
- No unsupported purchase, shipping, stocktake, or supplier workflows.
- Review UI changes against API behavior before implementation.

## D-004 — WCAG 2.2 Level AA as an accessibility target

**Status:** Proposed  
**Decision:** Use WCAG 2.2 Level AA as the design and validation target.

**Rationale:** Accessibility should be designed into components rather than added after visual implementation.

**Consequences:**
- Validate text and non-text contrast.
- Support keyboard navigation and visible focus.
- Associate labels and validation feedback with fields.
- Perform automated and manual accessibility testing.
- Do not claim conformance until it has been assessed.

## D-005 — Responsive tables use content-specific strategies

**Status:** Proposed  
**Decision:** Select horizontal scrolling, compact tables, or card/list presentation based on the data and task.

**Rationale:** Some warehouse records are inherently tabular; other data can be presented more clearly as stacked content on narrow screens.

**Consequences:**
- Preserve relationships between column headings and values.
- Do not hide essential data without an accessible alternative.
- Test table workflows at desktop, tablet, and mobile widths.

## D-006 — Transaction uncertainty must be visible

**Status:** Proposed  
**Decision:** Treat a lost response or network timeout during inventory transactions as an uncertain outcome, not proof of failure.

**Rationale:** Inbound, outbound, and transfer operations affect stock. The audited backend rejects reused request IDs with a conflict rather than replaying the original result.

**Consequences:**
- Do not silently retry with a new request ID.
- Preserve transaction context.
- Provide a reconciliation path using inventory/ledger information.
- Do not promise idempotent replay unless backend behavior changes and is verified.

## D-007 — Dashboard metrics must be evidence-based

**Status:** Proposed  
**Decision:** Only display metrics backed by real API values and documented calculations.

**Rationale:** The audited backend currently returns a hard-coded value for `totalTransactionsToday`; this must not be presented as an actual daily transaction count.

**Consequences:**
- Label unavailable metrics honestly or omit them.
- Do not invent trends, accuracy scores, or performance indicators.
- Revisit dashboard metrics when backend support is implemented.

## D-008 — Centralized design tokens and reusable components

**Status:** Proposed  
**Decision:** Manage colors, typography, spacing, radii, shadows, breakpoints, and focus states centrally.

**Rationale:** Centralized tokens reduce visual drift and make future redesigns maintainable.

**Consequences:**
- Avoid scattered one-off values.
- Reuse shared components where behavior and semantics match.
- Review token changes against all affected screens.

## Decision review

A proposed decision becomes accepted only after product-owner review. Implementation details and validation evidence should be linked or recorded when the decision is accepted.

---

**End of draft — pending review.**