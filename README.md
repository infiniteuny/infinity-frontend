<h1 align="center">Infinity</h1>

Infinity is the main management system for the INFINITE organization. This is the front-end app built with [Next.js](https://nextjs.org/).

## Getting Started

1. Set up the development environment

   You need to set up your development environment before you can do anything.

   Install [Node.js and npm](https://nodejs.org/en/download/).

2. Install the dependencies

   ```bash
   npm install
   ```

3. Run in development mode

   ```bash
   npm run dev:dashboard # Dashboard app
   npm run dev:landing   # Landing app
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

You can start editing pages inside `apps/dashboard/app/` or `apps/landing/app/`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load font.

## Project Structure

```
.
├── apps
│   ├── dashboard           # Internal dashboard application (@infiniteuny/infinity-dashboard)
│   │   ├── app             # App Router routes & layouts
│   │   ├── config          # Fonts & app configuration
│   │   ├── public          # Static files
│   │   └── src
│   │       ├── presentation        # Feature views, controllers, hooks, stores
│   │       ├── server-injection.ts # Server DI container
│   │       └── client-injection.ts # Client DI container
│   └── landing             # Public landing application (@infiniteuny/infinity-landing)
│       ├── app             # App Router routes & layouts
│       ├── config          # Fonts & app configuration
│       ├── public          # Static files
│       └── src
│           ├── server-injection.ts # Server DI container
│           └── client-injection.ts # Client DI container
└── packages
    ├── domain              # Enterprise business rules (@infiniteuny/infinity-domain)
    ├── application         # Application business rules / use cases (@infiniteuny/infinity-application)
    ├── infrastructure      # Datasources, DTOs, repositories (@infiniteuny/infinity-infrastructure)
    ├── ui                  # Shared UI components, Material 3 theme, styles (@infiniteuny/infinity-ui)
    └── utils               # Shared utility functions (@infiniteuny/infinity-utils)
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

1. Generate a production build

   ```bash
   npm run build
   ```

   The output is generated inside the `.next` folder

2. Start the Node.js server

   ```bash
   npm run start
   ```
