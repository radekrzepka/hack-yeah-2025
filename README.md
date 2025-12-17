# ZUSometr - Pension Calculator Platform

A comprehensive pension calculation and simulation platform built for the Polish social security system (ZUS), enabling users to forecast retirement benefits, explore improvement scenarios, and generate detailed PDF reports.

## 🎯 Key Features

- **Advanced Pension Calculations** - Complex algorithms accounting for salary growth, indexation, contract types (UOP, B2B, zlecenie, dzieło), and custom work experience periods
- **Interactive Dashboards** - Real-time visualization of pension projections with interactive charts and KPI cards
- **Improvement Scenarios** - Explore multiple optimization strategies including working longer, reducing sick leave, and salary increases
- **PDF Report Generation** - Automated generation of comprehensive pension reports using Puppeteer to render dynamic React components
- **Admin Dashboard** - Administrative interface for managing simulation data and system analytics
- **Type-Safe Architecture** - End-to-end TypeScript with shared types across frontend and backend
- **Monorepo Structure** - Scalable Turborepo setup with shared packages for UI components, database schemas, and domain logic

## 🏗 Architecture & Tech Stack

### System Architecture

The platform follows a modern, scalable monorepo architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web   │◄──►│   NestJS API    │◄──►│   PostgreSQL    │
│   (Port 3000)   │    │   (Port 4000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       └──► Puppeteer (PDF Generation)
         │
         └──► React Query (State Management)
```

### Backend Stack

- **NestJS** - Enterprise-grade Node.js framework with dependency injection
- **CQRS Pattern** - Command Query Responsibility Segregation for scalable data operations
- **Drizzle ORM** - Type-safe database operations with PostgreSQL
- **Puppeteer** - Headless browser automation for PDF generation from React components
- **Swagger/OpenAPI** - Comprehensive API documentation with interactive testing

### Frontend Stack

- **Next.js 14** - React framework with App Router for optimal performance and SEO
- **React Query** - Powerful server state management with caching and optimistic updates
- **React Hook Form + Zod** - Type-safe form handling with runtime validation
- **Recharts** - Interactive data visualization for pension projections
- **Tailwind CSS + Shadcn/ui** - Modern, accessible UI components

### Monorepo Packages

- **@hackathon/db** - Database schemas, migrations, and seed data
- **@hackathon/domain** - Business logic and domain constants
- **@hackathon/shared** - Shared TypeScript types and API routes
- **@hackathon/ui** - Reusable React components built with Radix UI and Tailwind
- **@hackathon/transactional** - React Email templates for transactional emails

## 🔧 Technical Challenges

### 1. Complex Pension Calculation Engine

The system implements sophisticated pension calculation algorithms that must account for multiple variables simultaneously:

- **Multi-factor calculations**: Salary growth rates, indexation, contract type contributions, and custom work experience periods
- **Year-by-year breakdowns**: Tracking contributions, valorization rates, and account balances across decades
- **Scenario modeling**: Comparing baseline projections against improvement scenarios (extended work, reduced sick leave, salary increases)
- **Accuracy requirements**: Ensuring calculations align with Polish ZUS regulations while maintaining performance

The solution leverages a dedicated `PensionCalculationService` with modular calculation functions, comprehensive type definitions, and extensive validation to ensure accuracy and maintainability.

### 2. Dynamic PDF Generation from React Components

Generating PDF reports requires rendering interactive React dashboards with charts into static PDF documents:

- **Browser automation**: Using Puppeteer to launch headless Chrome and navigate to dashboard URLs
- **Chart rendering**: Waiting for Recharts components to fully render before PDF capture
- **Resource management**: Efficiently managing browser instances and memory in a server environment
- **Production deployment**: Handling Puppeteer dependencies and Chromium installation in containerized environments

The implementation uses a singleton browser pattern with proper lifecycle management, viewport optimization, and error handling to ensure reliable PDF generation across different environments.

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** 8.15.6 or higher ([installation guide](https://pnpm.io/installation))
- **Docker** and Docker Compose (for local database)
- **Git** for version control

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hack-yeah-2025-1
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   This will install all dependencies for the monorepo, including workspace packages.

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```bash
   # Database
   DATABASE_URL=postgresql://user:ZAQ!2wsx@localhost:54321/hackathon

   # API Configuration
   PORT=4000
   JWT_SECRET=your-secret-key-here

   # Frontend URLs
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_WEB_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Email Service (optional for development)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

4. **Start the database**

   ```bash
   pnpm db:up
   ```

   This command will:
   - Start PostgreSQL in a Docker container
   - Run database migrations
   - Seed the database with initial data

5. **Start development servers**

   ```bash
   pnpm dev
   ```

   This will start both applications in development mode:
   - **API Server**: `http://localhost:4000`
   - **Web Application**: `http://localhost:3000`
   - **API Documentation**: `http://localhost:4000/api` (Swagger UI)

### Verification

1. **Check API health**: Visit `http://localhost:4000/health` - should return `{ "status": "ok" }`
2. **Check database connection**: Visit `http://localhost:4000/health/database` - should return database status
3. **Access web application**: Visit `http://localhost:3000` - should display the landing page
4. **View API documentation**: Visit `http://localhost:4000/api` - should display Swagger UI

### Additional Commands

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm --filter=api dev       # Start API only
pnpm --filter=web dev       # Start web only

# Database Management
pnpm db:up                  # Start database with migrations and seed
pnpm db:down                # Stop database
pnpm db:reset               # Reset database with fresh data
pnpm --filter=db db:generate  # Generate new migrations
pnpm --filter=db db:migrate   # Apply migrations

# Code Quality
pnpm lint                   # Lint all packages
pnpm check-types           # Type check all packages
pnpm build                 # Build all packages for production
pnpm test                  # Run all tests

# Package Management
pnpm packages:check        # Check for dependency issues
pnpm packages:fix          # Fix package dependency issues
```

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architecture Guide](docs/architecture.md)** - System design, patterns, and architectural decisions
- **[Apps Guide](docs/apps.md)** - Detailed overview of API and Web applications
- **[Packages Guide](docs/packages.md)** - Monorepo package structure and usage
- **[Templates Guide](docs/templates.md)** - Step-by-step guide for creating new features
- **[Development Guide](docs/development-guide.md)** - Best practices, coding standards, and workflows
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🎨 Project Structure

```
hack-yeah-2025-1/
├── apps/
│   ├── api/                    # NestJS backend application
│   │   └── src/
│   │       ├── modules/        # Feature modules (simulation, admin, etc.)
│   │       └── common/         # Shared utilities and middleware
│   └── web/                     # Next.js frontend application
│       └── app/                 # App Router structure
│           ├── (landing)/      # Landing page components
│           ├── form/           # Pension calculation form
│           ├── dashboard/      # Interactive dashboard with charts
│           └── admin/          # Admin dashboard
├── packages/
│   ├── db/                      # Database schemas and migrations
│   ├── domain/                  # Business logic and constants
│   ├── shared/                  # Shared types and utilities
│   ├── ui/                      # React UI component library
│   └── transactional/           # Email templates
├── docs/                        # Project documentation
└── docker-compose.yml           # Local database setup
```

## 🔐 Security

- **JWT Authentication** - Token-based authentication for protected routes
- **Input Validation** - Comprehensive validation using class-validator and Zod
- **CORS Configuration** - Properly configured cross-origin resource sharing
- **Password Hashing** - Bcrypt for secure password storage
- **Environment Variables** - Sensitive data stored in environment variables

## 🚢 Deployment

The platform is configured for deployment on:

- **Railway** - Primary deployment target for API and database
- **Vercel** - Frontend deployment with edge functions
- **Docker** - Containerized deployment option

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed production deployment instructions.

## 🤝 Contributing

1. Follow the established patterns in existing modules (e.g., `simulation` module)
2. Use TypeScript strictly - avoid `any` types
3. Follow the naming conventions outlined in the development guide
4. Write tests for new features
5. Update documentation when adding new features

## 📄 License

This project is part of a hackathon submission.

---

Built with ❤️ using NestJS, Next.js, and TypeScript
