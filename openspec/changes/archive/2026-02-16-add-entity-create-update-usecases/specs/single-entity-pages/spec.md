## MODIFIED Requirements

### Requirement: Edit pages SHALL display entity data in form layout

Each dashboard entity module SHALL have an edit page at `/{module}/[entityId]/edit` that fetches the entity by ID on the server, converts it to a DTO, and renders a client-side form component with fields pre-populated from entity data. The form SHALL submit through application-layer write use cases to perform update operations, and create-mode forms SHALL submit through matching create use cases.

#### Scenario: Open edit page for a single entity

- **WHEN** an authenticated user navigates to `/{module}/{entityId}/edit`
- **THEN** the page SHALL fetch the entity via the corresponding `Get{Entity}` use case
- **AND** render a form component with fields pre-populated from the entity data
- **AND** the form SHALL include section groupings consistent with the detail view layout

#### Scenario: Submit existing entity form

- **WHEN** a user submits a form that has existing `initialEntity` data
- **THEN** the form SHALL resolve and execute `Update{Entity}` from the application layer
- **AND** on success SHALL navigate to the single-entity detail page

#### Scenario: Submit create-mode entity form

- **WHEN** a user submits a form that has no `initialEntity` data
- **THEN** the form SHALL resolve and execute `Create{Entity}` from the application layer
- **AND** on success SHALL navigate to the newly created entity detail page
