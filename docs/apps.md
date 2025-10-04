# Apps Guide

This document provides a comprehensive overview of the applications in the `apps/` directory, their structure, features, and how they work together.

## Applications Overview

| Application | Purpose                  | Technology           | Port |
| ----------- | ------------------------ | -------------------- | ---- |
| `api`       | Backend REST API         | NestJS + TypeScript  | 4000 |
| `web`       | Frontend web application | Next.js + TypeScript | 3000 |

## 🔧 API Application (`apps/api`)

**Location**: `apps/api/`  
**Framework**: NestJS  
**Port**: 4000

### Purpose

The API application serves as the backend for the entire system, providing RESTful endpoints, database operations, authentication, and business logic.

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

The API follows CQRS pattern to separate read and write operations:

- **Commands**: Handle data modifications (Create, Update, Delete)
- **Queries**: Handle data retrieval (Read operations)

#### Modular Architecture

Each feature is organized into self-contained modules with clear boundaries.

### Project Structure

```
apps/api/
├── src/
│   ├── main.ts                    # Application bootstrap
│   ├── common/                    # Shared utilities and middleware
│   │   ├── constants/            # Application constants
│   │   ├── decorators/           # Custom decorators
│   │   ├── dtos/                 # Base DTOs
│   │   ├── middlewares/          # Global middleware
│   │   ├── services/             # Shared services
│   │   └── validators/           # Validation utilities
│   └── modules/                  # Feature modules
│       ├── app.module.ts         # Root application module
│       ├── database/             # Database connection module
│       ├── email/                # Email service module
│       ├── encryption/           # Encryption utilities
│       ├── health/               # Health check endpoints
│       └── test-table/           # Example CRUD module
├── dist/                         # Compiled output
├── jest.config.ci.js            # Jest configuration
├── nest-cli.json                # NestJS CLI configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

### Key Features

#### 🔐 Security

- **CORS configuration** for cross-origin requests
- **Global validation pipes** for request validation
- **JWT authentication** setup (decorators ready)
- **Password hashing** utilities
- **Input sanitization** and validation

#### 📚 API Documentation

- **Swagger/OpenAPI** integration
- **Automatic documentation** generation
- **Interactive API explorer** at `/api`
- **Type-safe DTOs** with validation decorators

#### 🏗 Module Structure

Each feature module follows a consistent structure:

```
feature-module/
├── commands/                     # CQRS Commands
│   └── create-feature/
│       ├── create-feature.command.ts
│       └── create-feature.handler.ts
├── queries/                      # CQRS Queries
│   └── get-feature/
│       ├── get-feature.query.ts
│       └── get-feature.handler.ts
├── controllers/                  # REST endpoints
│   └── feature.controller.ts
├── dtos/                        # Data transfer objects
│   ├── create-feature/
│   └── get-feature/
├── exceptions/                   # Custom exceptions
│   └── feature.exceptions.ts
├── repositories/                 # Data access layer
│   ├── feature.repository.interface.ts
│   └── feature.repository.ts
├── services/                     # Business logic
│   └── feature.service.ts
└── feature.module.ts            # Module definition
```

### Example: Test Table Module

The `test-table` module demonstrates a complete CRUD implementation:

#### Controller (`test-table.controller.ts`)

```typescript
@ApiTags("Test Table")
@Controller({ version: "1", path: "test-table" })
export class TestTableController {
  @Post()
  @ApiOperation({ summary: "Create a new test table record" })
  async create(@Body() createDto: CreateTestTableRequestDto) {
    return await this.testTableService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.testTableService.findAll();
  }

  // ... other CRUD operations
}
```

#### Service (`test-table.service.ts`)

Handles business logic and orchestrates commands/queries:

```typescript
@Injectable()
export class TestTableService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateTestTableRequestDto) {
    return this.commandBus.execute(new CreateTestTableCommand(dto));
  }
}
```

#### Repository Pattern

Data access is abstracted through repositories:

```typescript
export abstract class TestTableRepositoryInterface {
  abstract create(data: TestTableInsert): Promise<TestTableSelect>;
  abstract findAll(): Promise<TestTableSelect[]>;
  // ... other methods
}
```

### Available Endpoints

#### Health Check

- `GET /health` - Application health status
- `GET /health/database` - Database connectivity check

#### Test Table (Example CRUD)

- `POST /v1/test-table` - Create record
- `GET /v1/test-table` - Get all records
- `GET /v1/test-table/:id` - Get record by ID
- `PUT /v1/test-table/:id` - Update record
- `DELETE /v1/test-table/:id` - Delete record

### Development Scripts

```bash
# Development
pnpm dev                 # Start with hot reload
pnpm build              # Build for production
pnpm start              # Start production build

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage

# Code Quality
pnpm lint               # Lint code
pnpm check-types        # Type checking
```

### Environment Variables

Key environment variables for the API:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=4000
JWT_SECRET=your-secret-key
EMAIL_API_KEY=your-email-service-key
```

## 🌐 Web Application (`apps/web`)

**Location**: `apps/web/`  
**Framework**: Next.js 14 with App Router  
**Port**: 3000

### Purpose

The web application provides the user interface for the system, built with modern React patterns and optimized for performance.

### Architecture Patterns

#### App Router Structure

Uses Next.js 14 App Router for file-based routing with layout support.

#### Feature-Based Organization

Each feature is organized in its own directory with co-located components, API calls, and utilities.

#### Server-Side Rendering

Leverages Next.js SSR capabilities for optimal performance and SEO.

### Project Structure

```
apps/web/
├── app/                          # App Router structure
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── not-found.tsx           # 404 page
│   ├── _components/            # Shared components
│   ├── _providers/             # Context providers
│   ├── _utils/                 # Utility functions
│   │   └── fetch/              # API communication utilities
│   └── test/                   # Example feature
│       ├── page.tsx            # Feature main page
│       ├── layout.tsx          # Feature layout
│       ├── [itemId]/           # Dynamic route
│       ├── _api/               # API communication
│       ├── _modules/           # Feature components
│       └── _utils/             # Feature utilities
├── middleware.ts               # Next.js middleware
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies and scripts
```

### Key Features

#### 🎨 Modern UI Stack

- **Tailwind CSS** for styling
- **Shadcn/ui components** via `@hackathon/ui`
- **Dark/light theme** support
- **Responsive design** patterns
- **Lucide React icons**

#### 📡 Data Management

- **React Query** for server state management
- **Optimistic updates** for better UX
- **Error handling** with toast notifications
- **Loading states** and skeleton components

#### 📱 User Experience

- **Client-side navigation** with Next.js router
- **Form validation** with React Hook Form + Zod
- **Toast notifications** with Sonner
- **Loading indicators** and error boundaries

### Example: Test Table Feature

The `test` route demonstrates a complete feature implementation:

#### Page Structure

```
app/test/
├── page.tsx                    # List view with server-side data
├── layout.tsx                  # Feature-specific layout
├── [itemId]/
│   ├── page.tsx               # Detail view
│   └── not-found.tsx          # Item not found page
├── _api/                      # API communication layer
│   ├── client/                # Client-side API calls
│   └── server/                # Server-side API calls
├── _modules/                  # Feature components
│   ├── test-table-list.tsx    # List component
│   ├── create-test-table-form.tsx
│   ├── edit-test-table-form.tsx
│   └── test-table-detail.tsx
└── _utils/                    # Feature utilities
    └── handle-test-table-error.ts
```

#### API Layer Organization

**Client-side API calls** (`_api/client/`):

```typescript
// get-all-test-tables.ts
export const getAllTestTablesClient = async (): Promise<
  GetTestTableResponseDto[]
> => {
  return clientFetch<GetTestTableResponseDto[]>("/v1/test-table");
};
```

**Server-side API calls** (`_api/server/`):

```typescript
// get-all-test-tables.ts
export const getAllTestTablesServer = async (): Promise<
  GetTestTableResponseDto[]
> => {
  return serverFetch<GetTestTableResponseDto[]>("/v1/test-table");
};
```

#### Component Patterns

**List Component with State Management**:

```typescript
export function TestTableList({ initialData }: TestTableListProps) {
  const { data: testTables = initialData } = useQuery({
    queryKey: ["test-tables"],
    queryFn: getAllTestTablesClient,
    initialData,
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteTestTableClient,
    onSuccess: () => {
      toast.success("Record deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["test-tables"] });
    },
  });

  // ... component implementation
}
```

**Form Component with Validation**:

```typescript
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
});

export function CreateTestTableForm({ onSuccess }: CreateTestTableFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTestTableClient,
    onSuccess: () => {
      toast.success("Record created successfully!");
      onSuccess?.();
    },
  });

  // ... form implementation
}
```

### Routing Patterns

#### Static Routes

- `/` - Home page
- `/test` - Test table list

#### Dynamic Routes

- `/test/[itemId]` - Test table detail page

#### Route Groups

- `_components` - Shared components (not routed)
- `_api` - API utilities (not routed)
- `_modules` - Feature components (not routed)

### Data Fetching Patterns

#### Server-Side Rendering

```typescript
// app/test/page.tsx
export default async function TestPage() {
  const testTables = await getAllTestTablesServer();

  return <TestTableList initialData={testTables} />;
}
```

#### Client-Side State Management

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["test-tables"],
  queryFn: getAllTestTablesClient,
});
```

### Development Scripts

```bash
# Development
pnpm dev                # Start development server
pnpm build             # Build for production
pnpm start             # Start production server

# Testing
pnpm test              # Run tests with Vitest
pnpm test:dev          # Run tests in watch mode

# Code Quality
pnpm lint              # Lint code
pnpm check-types       # Type checking
```

## 🔗 App Communication

### API Communication

The web app communicates with the API through:

1. **Type-safe API calls** using shared types from `@hackathon/shared`
2. **Fetch utilities** that handle authentication and error handling
3. **React Query** for caching and state management

### Shared Dependencies

Both apps share:

- **TypeScript configurations** from `@hackathon/typescript-config`
- **ESLint rules** from `@hackathon/eslint-config`
- **Domain logic** from `@hackathon/domain`
- **Shared types** from `@hackathon/shared`

### Environment Synchronization

Environment variables are coordinated:

- `NEXT_PUBLIC_API_URL` - API endpoint for web app
- `NEXT_PUBLIC_WEB_URL` - Web app URL for API CORS

## 🚀 Development Workflow

### Starting Both Apps

```bash
# Start everything (recommended)
pnpm dev

# Or start individually
pnpm --filter=api dev     # API only
pnpm --filter=web dev     # Web only
```

### Adding New Features

1. **API First**: Create the backend module following the test-table pattern
2. **Types**: Update shared types if needed
3. **Frontend**: Create the frontend feature following the test pattern
4. **Testing**: Add tests for both API and web components

### Hot Reloading

Both applications support hot reloading:

- **API**: Automatic restart on file changes
- **Web**: Instant updates in browser
- **Packages**: Changes trigger rebuilds in consuming apps

This architecture provides a solid foundation for rapid development while maintaining code quality and clear separation of concerns.
