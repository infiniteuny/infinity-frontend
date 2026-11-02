<h1 align="center">Infinity</h1>

<div align="center">
<a href="https://github.com/infiniteuny/infinity-frontend/releases/latest"><img src="https://img.shields.io/github/v/release/infiniteuny/infinity-frontend?style=for-the-badge&labelColor=000000" alt="Latest Version"></a>
<a href="https://github.com/infiniteuny/infinity-frontend#GPL-3.0-1-ov-file"><img src="https://img.shields.io/github/license/infiniteuny/infinity-frontend?style=for-the-badge&labelColor=000000" alt="License"></a>
</div>

The frontend applications for the INFINITE organization management system, built with [Next.js](https://nextjs.org/) and managed as an [Nx](https://nx.dev/) monorepo.

## Getting Started

You will need [Node.js](https://nodejs.org/en/download/) 24 or later, [npm](https://www.npmjs.com/), and Git.

1. Install dependencies, then create your local environment files for the applications:

   ```sh
   npm install
   cp apps/dashboard/.env.example apps/dashboard/.env
   cp apps/landing/.env.example apps/landing/.env
   ```

2. Configure any required environment variables in `apps/dashboard/.env` and `apps/landing/.env` (for example, API endpoints, OAuth/SSO provider credentials, and Redis connection settings), then start the applications as described in [Development](#development).

## Project Structure

```text
.
├── apps/
│   ├── dashboard/       # Internal management dashboard (@infiniteuny/infinity-dashboard)
│   └── landing/         # Public landing website (@infiniteuny/infinity-landing)
└── packages/
    ├── domain/          # Entities, repository contracts, errors, and DI symbols (@infiniteuny/infinity-domain)
    ├── application/     # Application use cases (@infiniteuny/infinity-application)
    ├── infrastructure/  # Data sources, DTOs, and repository implementations (@infiniteuny/infinity-infrastructure)
    ├── ui/              # Shared UI components, Material 3 theme, and styles (@infiniteuny/infinity-ui)
    └── utils/           # Shared utility helpers (@infiniteuny/infinity-utils)
```

### Learn More

- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.
- [Next.js documentation](https://nextjs.org/docs) — framework features and APIs.
- [Next.js deployment documentation](https://nextjs.org/docs/app/getting-started/deploying) — production configuration guidance.
- [Nx documentation](https://nx.dev/docs/getting-started/intro) — monorepo task orchestration and workspace management.

## Development

Start the development server for an individual application (or both concurrently):

```sh
npm run dev:dashboard # Start dashboard app
npm run dev:landing   # Start landing app
npm run dev           # Start all apps
```

Run linting, formatting, and type checks across the workspace:

```sh
npm run lint
npm run format
npm run typecheck
```

## Deployment

Each application in `apps/` includes its own `Dockerfile` for building a standalone production container image from the monorepo root:

```sh
docker build -f apps/dashboard/Dockerfile -t infinity-dashboard .
docker build -f apps/landing/Dockerfile -t infinity-landing .
```

You can also generate and run production builds directly with Node.js:

```sh
npm run build
npm run start:dashboard
npm run start:landing
```

Configure `NEXT_PUBLIC_*` build arguments at image build time and runtime secrets (such as authentication and Redis credentials) in your deployment platform, keeping sensitive values out of the image. See the [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying) for production recommendations.

## Code of Conduct

This project follows INFINITE's [Contributor Covenant Code of Conduct](https://github.com/infiniteuny/infinity-frontend#coc-ov-file). Report abusive, harassing, or otherwise unacceptable behavior to [community@infiniteuny.id](mailto:community@infiniteuny.id). Reports will be reviewed promptly and handled with respect for the reporter's privacy.

## Security

Do not report vulnerabilities in a public issue. Submit them privately using GitHub's [Security Advisories](https://github.com/infiniteuny/infinity-frontend/security/advisories/new) feature.

## License

This project is licensed under the [GNU General Public License v3.0 or later](https://www.gnu.org/licenses/gpl-3.0.html). See [LICENSE](https://github.com/infiniteuny/infinity-frontend#GPL-3.0-1-ov-file) for details.
