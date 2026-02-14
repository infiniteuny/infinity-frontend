## Purpose

Define consistent behavior for internal dashboard entity list pages so modules follow a unified users-pattern composition while preserving clean-architecture boundaries.

## Requirements

### Requirement: Dashboard module list pages SHALL be implemented with users-pattern composition

The system SHALL implement top-level dashboard list pages for achievements, community group admins, core teams, fund applications, groups, permissions, project galleries, teams, and testimonials using the same composition pattern as the `users` page: server-side use-case execution, section header with module title (and toolbar when available), and list rendering with mapped DTO initial data.

#### Scenario: Open a non-settings dashboard module page

- **WHEN** an authenticated internal user navigates to one of the target module routes
- **THEN** the page loads initial module data via its application use-case on the server
- **AND** the page renders a section header and module list component with the initial mapped data

### Requirement: Settings page SHALL remain out of scope for this change

The system MUST NOT change behavior, layout, or data-loading logic for the `settings` dashboard page as part of this capability.

#### Scenario: Open settings after rollout

- **WHEN** an authenticated internal user navigates to the `settings` route
- **THEN** the route behavior remains unchanged from pre-change behavior

### Requirement: Dashboard pages SHALL preserve clean-architecture boundaries

Each implemented module page MUST obtain data through application-layer use-cases resolved via configured dependency injection containers, and MUST NOT call infrastructure repositories or data sources directly from route components.

#### Scenario: Review page implementation dependencies

- **WHEN** a target dashboard page implementation is inspected
- **THEN** data retrieval is performed through an application use-case resolved from DI
- **AND** repository/data-source concrete implementations remain wired only in composition roots
