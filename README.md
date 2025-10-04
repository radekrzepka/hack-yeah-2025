# Hackathon Template 2k25

A modern, full-stack TypeScript template built with NestJS, Next.js, and Turborepo. This template provides a solid foundation for hackathon projects with a complete development environment, database setup, email system, and UI components.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8.15.6+
- Docker (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hackathon-template-2k25
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**

   ```bash
   pnpm db:up
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

This will start:

- API server at `http://localhost:4000`
- Web app at `http://localhost:3000`
- Email preview at `http://localhost:3002`

## 📁 Project Structure

This is a Turborepo monorepo with the following structure:

```
hackathon-template-2k25/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend application
├── packages/
│   ├── db/           # Database schemas and migrations (Drizzle ORM)
│   ├── domain/       # Domain logic and business rules
│   ├── shared/       # Shared types, routes, and utilities
│   ├── transactional/ # Email templates (React Email)
│   └── ui/           # Shared UI components (React + Tailwind)
├── docs/             # Documentation
└── scripts/          # Build and deployment scripts
```

## 🛠 Technology Stack

### Backend (API)

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary database
- **CQRS Pattern** - Command Query Responsibility Segregation
- **Swagger/OpenAPI** - API documentation

### Frontend (Web)

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **React Query** - Server state management
- **React Hook Form** - Form handling

### Shared Packages

- **Drizzle ORM** - Database management
- **React Email** - Email templates
- **Zod** - Runtime validation
- **ESLint & Prettier** - Code quality

## 🏗 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps and packages
pnpm lint             # Lint all packages
pnpm check-types      # Type check all packages
pnpm test             # Run all tests

# Database
pnpm db:up            # Start database and run migrations + seed
pnpm db:down          # Stop database
pnpm db:reset         # Reset database with fresh data

# Maintenance
pnpm packages:check   # Check package dependencies
pnpm packages:fix     # Fix package dependency issues
```

### Package-Specific Commands

Each package has its own scripts. See individual `package.json` files for details.

## 📖 Documentation

- **[Packages Guide](docs/packages.md)** - Detailed overview of all packages
- **[Apps Guide](docs/apps.md)** - Applications structure and features
- **[Templates Guide](docs/templates.md)** - How to use existing templates for new features
- **[Development Guide](docs/development-guide.md)** - Best practices and workflows
- **[Architecture Guide](docs/architecture.md)** - System design and patterns
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🔧 Adding New Features

This template includes comprehensive examples in the `test-table` module that demonstrate:

1. **Backend (API)**: Complete CRUD operations with CQRS pattern
2. **Frontend (Web)**: Full-featured UI with forms, tables, and state management
3. **Database**: Schema definition with Drizzle ORM
4. **Types**: Shared TypeScript interfaces

To add a new feature, use the existing `test-table` implementation as a reference. See the [Templates Guide](docs/templates.md) for detailed instructions.

## 🌐 API Documentation

When the API is running, visit `http://localhost:4000/api` to access the Swagger documentation with interactive API testing.

## 🎨 UI Components

The template includes a comprehensive UI library built with:

- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom form components** with validation

All components are documented and ready to use. Import them from `@hackathon/ui`.

## 📧 Email System

Email templates are built with React Email and include:

- Account confirmation
- Password reset
- Custom invitation emails

Preview emails in development at `http://localhost:3002`.

## 🗄 Database

The template uses PostgreSQL with Drizzle ORM:

- Type-safe database operations
- Automatic migrations
- Seed data for development
- Connection pooling ready for production

## 🔒 Authentication Ready

While not fully implemented, the template includes:

- JWT token structure
- Password hashing utilities
- Authentication decorators
- User domain models

## 🚢 Deployment

The template is configured for easy deployment on:

- **Railway** - Primary deployment target
- **Vercel** - Frontend deployment
- **Docker** - Containerized deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

1. Follow the established patterns in the `test-table` examples
2. Use TypeScript strictly (no `any` types)
3. Follow the naming conventions in the style guide
