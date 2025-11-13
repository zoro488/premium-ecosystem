# FlowDistributor

Workflow Management System - Part of Premium Ecosystem

## Features

- 🔄 Workflow creation and orchestration
- 📋 Task distribution and assignment
- 📊 Real-time status tracking
- 👥 Team collaboration
- 📈 Analytics and reporting
- 🔔 Real-time notifications

## Architecture

This application follows Clean Architecture principles:

```
src/
├── domain/           # Business logic (pure)
│   ├── entities/     # Core business entities
│   ├── useCases/     # Business use cases
│   └── repositories/ # Repository interfaces
├── application/      # Application services
│   ├── services/     # Application services
│   └── dto/          # Data transfer objects
├── infrastructure/   # External integrations
│   ├── firebase/     # Firebase implementations
│   ├── api/          # API clients
│   └── cache/        # Caching layer
└── presentation/     # UI Layer
    ├── components/   # React components
    ├── pages/        # Page components
    ├── hooks/        # Custom hooks
    └── stores/       # State management
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore, Auth)
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types

## Environment Variables

Create a `.env.local` file with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/domain/useCases/CreateWorkflow.test.ts
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Ensure tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Submit a pull request

## License

Proprietary - Premium Ecosystem
