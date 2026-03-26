## MODIFIED Requirements

### Requirement: Dashboard module list pages SHALL be implemented with users-pattern composition

The system SHALL implement top-level dashboard list pages for achievements, community group admins, core teams, fund applications, groups, permissions, project galleries, teams, and testimonials using the same composition pattern as the `users` page: server-side use-case execution, section header with module title (and toolbar when available), and list rendering with mapped DTO initial data. Additionally, each module SHALL have a single-entity detail page and an edit page following the same composition pattern.

#### Scenario: Open a non-settings dashboard module page

- **WHEN** an authenticated internal user navigates to one of the target module routes
- **THEN** the page loads initial module data via its application use-case on the server
- **AND** the page renders a section header and module list component with the initial mapped data

#### Scenario: Open a single-entity detail page

- **WHEN** an authenticated internal user navigates to `/{module}/{entityId}`
- **THEN** the page fetches the single entity via its application use-case on the server
- **AND** the page renders a section header with toolbar and entity view component with mapped DTO data

#### Scenario: Open a single-entity edit page

- **WHEN** an authenticated internal user navigates to `/{module}/{entityId}/edit`
- **THEN** the page fetches the single entity via its application use-case on the server
- **AND** the page renders a form component pre-populated with the entity data
