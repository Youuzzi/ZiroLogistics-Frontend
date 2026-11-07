# ZiroLogistics WMS — Design System

**Status:** Draft — pending review  
**Scope:** Frontend web application  
**Design direction:** Modern Light Enterprise SaaS  
**Related documents:** [Frontend UI/UX Guidelines](docs/FRONTEND_UI_UX_GUIDELINES.md), [Design Decisions](docs/DESIGN_DECISIONS.md), [UI/UX Validation Checklist](docs/UI_UX_VALIDATION_CHECKLIST.md)

## 1. Purpose and design philosophy

This document is the visual source of truth for the ZiroLogistics WMS frontend. It defines the visual language, design tokens, layout, reusable component conventions, and accessibility target.

The interface should help warehouse operators understand operational information and complete supported workflows accurately.

Principles:

1. **Clarity over decoration** — operational information takes priority over ornamental UI.
2. **Consistency** — shared components use consistent tokens and interaction states.
3. **Responsive by default** — workflows remain usable on desktop, tablet, and mobile.
4. **Operational efficiency** — reduce unnecessary steps and prevent avoidable input mistakes.
5. **Honest interface** — never present unsupported capabilities or static values as live operational data.
6. **Accessible interaction** — support keyboard, assistive technology, readable contrast, and clear feedback.

## 2. Visual direction

### 2.1 Theme

The default theme is **Light Mode**.

- Application background: very light neutral.
- Main surfaces: white.
- Primary action color: deep teal.
- Main text: dark slate.
- Secondary text: muted slate.
- Borders: subtle neutral.
- Shadows: restrained and used to communicate hierarchy.
- Avoid excessive gradients, glow effects, and decorative elements that compete with operational data.

Dark mode is outside the initial redesign scope.

### 2.2 Initial color tokens

These are proposed starting values, not yet approved production tokens. Test contrast before implementation.

| Token | Proposed value | Usage |
|---|---|---|
| Primary | `#0F766E` | Primary actions, active navigation |
| Primary hover | `#115E59` | Hover state |
| Background | `#F8FAFC` | Application background |
| Surface | `#FFFFFF` | Cards, panels, forms |
| Text primary | `#0F172A` | Main content |
| Text secondary | `#64748B` | Supporting content |
| Border | `#E2E8F0` | Dividers and outlines |
| Success | `#15803D` | Successful operations |
| Warning | `#B45309` | Warning text and icons on light surfaces; use a separate pale warning surface token if needed |
| Danger | `#DC2626` | Errors and destructive actions |
| Info | `#2563EB` | Informational states |

Semantic colors must be consistent. Never communicate status through color alone; pair it with text, an icon, or another perceivable cue.

## 3. Typography

Preferred font: **Inter**, with fallback `ui-sans-serif, system-ui, sans-serif`.

| Element | Suggested size | Weight |
|---|---:|---:|
| Page title | 24–30px | 600–700 |
| Section title | 18–20px | 600 |
| Card title | 14–16px | 500–600 |
| Body | 14px | 400 |
| Supporting text | 12–13px | 400 |
| Table content | 13–14px | 400 |
| Button | 13–14px | 500–600 |

Prioritize readability and an information density appropriate for warehouse operations.

## 4. Spacing and shape

Use a consistent 4px-based spacing scale.

| Token | Value | Typical use |
|---|---:|---|
| xs | 4px | Tight internal spacing |
| sm | 8px | Small component gaps |
| md | 12px | Form and card spacing |
| lg | 16px | Standard component spacing |
| xl | 24px | Section spacing |
| 2xl | 32px | Major layout spacing |

Suggested radius:

- Small controls: 6px.
- Buttons and inputs: 8px.
- Cards and panels: 12px.
- Dialogs: 12–16px.

Avoid excessive rounding that makes an operations tool feel like a consumer-oriented application.

## 5. Application layout

### 5.1 Desktop

- Persistent sidebar for primary navigation.
- Header/top navigation for page-level context and account actions.
- Main content area with consistent page padding.
- Sidebar navigation must only expose implemented destinations.
- Page titles and primary actions should be easy to locate.

### 5.2 Tablet

- Sidebar may collapse into a compact rail or drawer.
- Main content uses available width.
- Tables use controlled horizontal scrolling or a deliberate compact presentation.
- Forms remain readable and touch-friendly.

### 5.3 Mobile

- Use a drawer or suitable compact navigation.
- Prefer a single-column content layout.
- Stack cards and form fields.
- Keep primary actions easy to reach.
- Tables may use controlled horizontal scrolling or a card/list alternative where relationships remain clear.
- Do not remove essential information solely to fit a narrow viewport.

## 6. Component standards

### 6.1 Buttons

Variants: primary, secondary, outline, ghost, and danger.

- Use clear action labels.
- Provide hover, focus, active, and disabled states.
- Disable submission controls while the same operation is processing.
- Avoid multiple competing primary actions in one section.
- Icon-only buttons require accessible names.

### 6.2 Cards

Use cards for dashboard metrics, summary information, and grouped operational content.

- Keep padding, border, radius, and typography consistent.
- Do not present static values as live metrics.
- Avoid decorative cards that add no useful operational information.

### 6.3 Tables

Tables should provide:

- Clear column headings and alignment.
- Readable row spacing.
- Loading, empty, and error states.
- Pagination only when supported by the data source and implemented.
- A responsive strategy appropriate to the data.
- Clear indication of current page or loaded scope when data is paginated.

Do not imply that one loaded page represents the complete dataset.

### 6.4 Forms

- Every field has a visible label.
- Required fields are identified.
- Validation feedback is specific and associated with the field.
- Input types match the expected data.
- Submit/cancel actions are clear.
- Loading and disabled states are visible.
- Backend validation remains authoritative.

### 6.5 Status indicators

Use semantic colors with readable labels. Only show statuses returned by the backend or derived through documented rules.

### 6.6 Feedback

- Use toast notifications for brief operation feedback.
- Use inline messages for field validation, persistent page errors, empty states, and operational warnings.
- A network failure must not automatically be interpreted as proof that a transaction was not committed.

## 7. Navigation and information architecture

Potential destinations based on the audited backend API:

1. Dashboard
2. Warehouses
3. Bins
4. Items
5. Inbound
6. Outbound
7. Transfer
8. Inventory Stocks
9. Inventory Ledger
10. Low Stock Alerts

**Implementation note:** stock, ledger, and low-stock endpoints exist in the audited backend contract, but the current frontend audit did not find a complete stock inventory page/navigation entry. The list above is a target information architecture, not a claim that every destination is currently implemented.

## 8. Warehouse data visualization

### 8.1 Stock

- Distinguish item quantity from minimum stock level.
- Display warehouse and bin context clearly.
- Distinguish bin-level records from warehouse-level aggregates.
- Low-stock presentation must reflect the backend aggregation rule: current alerts aggregate available stock by SKU and warehouse.

### 8.2 Bin capacity

- Show maximum capacity and current weight occupancy as separate values.
- Use progress indicators only when both values are valid and available.
- Do not equate item quantity with weight without a documented conversion rule.
- Explain unavailable capacity information rather than inventing a value.

### 8.3 Ledger

- Distinguish transaction type, quantity change, balance before, and balance after.
- Preserve positive and negative quantity semantics.
- Format timestamps consistently and identify the applicable timezone where needed.
- Keep reference and actor information accessible.

### 8.4 Data integrity

- Do not fabricate chart values or operational scores.
- Do not label ordinary fetch-on-load data as real-time.
- Do not imply a full dataset when only one API page has been loaded.
- Do not present dashboard transaction totals as verified until the backend calculation is implemented; the audited implementation currently returns a hard-coded value.

## 9. Accessibility target

Target: **WCAG 2.2 Level AA**. This is a design and validation target, not a claim of current conformance.

- Normal text contrast target: at least 4.5:1.
- Large text contrast target: at least 3:1.
- Meaningful UI component boundaries and graphical indicators should meet applicable 3:1 non-text contrast requirements.
- All interactive controls must be keyboard accessible.
- Focus indicators must be visible and not entirely obscured.
- Inputs must have programmatically associated labels.
- Errors must identify the affected field and explain correction.
- Status must not rely on color alone.
- Icon-only controls need accessible names.
- Dialogs and menus must support appropriate keyboard behavior.
- Support text resizing and responsive reflow.
- Aim for WCAG 2.2 AA target-size requirements (24 × 24 CSS pixels, subject to documented exceptions); frequently used touch controls should preferably be larger.

Automated checks alone do not establish WCAG conformance. Manual testing is required.

## 10. Iconography

Use Lucide React consistently.

- Choose recognizable icons.
- Keep icon sizing consistent within component types.
- Avoid decorative icons without meaning.
- Provide accessible names for icon-only controls.

## 11. Technology alignment

The design system should work with the existing stack:

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Lucide React
- React Hot Toast

Prefer reusable components and centralized tokens. Introduce another UI library only when there is a clear maintenance or technical benefit.

## 12. Design quality criteria

A design implementation is ready for review when:

- Visual hierarchy is clear and consistent.
- Light theme is applied consistently.
- Desktop, tablet, and mobile layouts remain usable.
- Shared components use centralized tokens.
- Forms provide understandable validation.
- Loading, empty, and error states are handled.
- Navigation reflects implemented functionality.
- No unsupported operational claims are displayed.
- Keyboard and accessibility behavior is considered.
- Existing backend workflows remain compatible.

## 13. Scope and change control

This document defines visual direction and component standards. It does not authorize backend changes or imply new business capabilities.

Any material change to tokens, layout, or component behavior should be reviewed against existing pages, accessibility, responsive layouts, and the companion UX guidelines.

---

**End of draft — pending review.**