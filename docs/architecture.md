# Architecture Guide

This document provides a comprehensive overview of the system architecture, design decisions, and patterns used in the Hackathon Template project.

## 🏗 System Overview

The Hackathon Template is a full-stack TypeScript application built with a modern, scalable architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   API Server    │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │              ┌─────────────────┐
         │                       │              │  Email Service  │
         │                       └─────────────►│   (AWS SES)     │
         │                                      └─────────────────┘
         │              ┌─────────────────┐
         └─────────────►│  Static Assets  │
                        │   (Vercel CDN)  │
                        └─────────────────┘
```

## 🎯 Architecture Principles

### 1. Separation of Concerns

- **Frontend**: User interface and user experience
- **Backend**: Business logic and data management
- **Database**: Data persistence and integrity
- **Packages**: Shared code and utilities

### 2. Type Safety

- End-to-end TypeScript usage
- Shared type definitions across frontend and backend
- Runtime validation with compile-time types

### 3. Scalability

- Modular architecture for easy feature addition
- Horizontal scaling support
- Caching strategies for performance

### 4. Developer Experience

- Hot reloading in development
- Comprehensive tooling and linting
- Clear documentation and examples

## 📦 Monorepo Structure

### Turborepo Configuration

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "test": { "dependsOn": ["^test"] }
  }
}
```

### Package Dependencies

```
apps/api ─────┐
             ├─► @hackathon/db
             ├─► @hackathon/domain
             ├─► @hackathon/shared
             └─► @hackathon/transactional

apps/web ─────┐
             ├─► @hackathon/ui
             ├─► @hackathon/shared
             └─► @hackathon/domain

packages/db ──► @hackathon/domain
packages/shared ──► @hackathon/domain
```

### Benefits of Monorepo

- **Shared Code**: Common utilities and types
- **Atomic Changes**: Update multiple packages together
- **Consistent Tooling**: Shared linting and build configuration
- **Type Safety**: Cross-package type checking

## 🔧 Backend Architecture (NestJS)

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│                Controllers                  │ ← REST API Layer
├─────────────────────────────────────────────┤
│                 Services                    │ ← Business Logic
├─────────────────────────────────────────────┤
│            Commands & Queries               │ ← CQRS Pattern
├─────────────────────────────────────────────┤
│               Repositories                  │ ← Data Access
├─────────────────────────────────────────────┤
│                Database                     │ ← Data Persistence
└─────────────────────────────────────────────┘
```

### CQRS Pattern Implementation

#### Commands (Write Operations)

```typescript
// Command Definition
export class CreateUserCommand {
  constructor(public readonly data: CreateUserRequestDto) {}
}

// Command Handler
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // Business logic for creating user
    return await this.userRepository.create(command.data);
  }
}
```

#### Queries (Read Operations)

```typescript
// Query Definition
export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}

// Query Handler
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    return await this.userRepository.findById(query.id);
  }
}
```

### Module Structure

```typescript
@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    ...UserCommandHandlers,
    ...UserQueryHandlers,
    UserService,
    UserRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
```

### Repository Pattern

```typescript
// Abstract Repository Interface
export abstract class UserRepositoryInterface {
  abstract create(data: UserInsert): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, data: Partial<UserInsert>): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
}

// Concrete Implementation
@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async create(data: UserInsert): Promise<User> {
    const [user] = await this.db.insert(userTable).values(data).returning();
    return user;
  }
}
```

### Dependency Injection

NestJS uses decorators for dependency injection:

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: LoggerService,
  ) {}
}
```

## 🌐 Frontend Architecture (Next.js)

### App Router Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── not-found.tsx          # 404 page
├── _components/           # Shared components
├── _providers/            # Context providers
├── _utils/               # Utility functions
└── feature/              # Feature routes
    ├── page.tsx          # Feature page
    ├── layout.tsx        # Feature layout
    ├── [id]/             # Dynamic routes
    ├── _api/             # API communication
    ├── _modules/         # Feature components
    └── _utils/           # Feature utilities
```

### Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │◄──►│  React Query    │◄──►│   API Layer     │
│                 │    │   (State Mgmt)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Local State    │    │     Cache       │    │  HTTP Requests  │
│  (useState)     │    │   (Memory)      │    │   (fetch API)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### State Management Strategy

#### Server State (React Query)

```typescript
// Data fetching with caching
const { data, error, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: getAllUsersClient,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutations with optimistic updates
const { mutate } = useMutation({
  mutationFn: createUserClient,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

#### Client State (React Hooks)

```typescript
// Local UI state
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

// Form state
const form = useForm<FormData>({
  resolver: zodResolver(validationSchema),
  defaultValues: {
    /* ... */
  },
});
```

### Component Architecture

```typescript
// Container Component (Smart)
export function UserListContainer() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsersClient,
  });

  return <UserList users={users} onUserSelect={handleUserSelect} />;
}

// Presentation Component (Dumb)
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export function UserList({ users, onUserSelect }: UserListProps) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={onUserSelect} />
      ))}
    </div>
  );
}
```

## 🗄 Database Architecture

### Drizzle ORM Schema

```typescript
// Table Definition
export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).unique().notNull(),
  firstName: varchar({ length: 128 }).notNull(),
  lastName: varchar({ length: 128 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type Inference
export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;
```

### Migration Strategy

```typescript
// drizzle.config.ts
export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

### Connection Management

```typescript
// Database connection with pooling
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client);
```

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │       API       │    │    Database     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ 1. Login Request     │                      │
          ├─────────────────────►│                      │
          │                      │ 2. Verify Credentials│
          │                      ├─────────────────────►│
          │                      │                      │
          │                      │ 3. User Data         │
          │                      │◄─────────────────────┤
          │ 4. JWT Token         │                      │
          │◄─────────────────────┤                      │
          │                      │                      │
          │ 5. Authenticated Req │                      │
          ├─────────────────────►│                      │
          │                      │ 6. Verify JWT        │
          │                      │                      │
          │ 7. Response          │                      │
          │◄─────────────────────┤                      │
```

### Authorization Patterns

```typescript
// Route Protection
@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {}

// Role-based Access
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
async delete(@Param('id') id: string) {}

// Public Routes
@Public()
@Get('health')
async health() {}
```

### Input Validation

```typescript
// DTO with Validation
export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  firstName: string;
}
```

## 📧 Communication Architecture

### Email System

```typescript
// Email Template (React Email)
export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Welcome, {userName}!</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Email Service
@Injectable()
export class EmailService {
  async sendWelcomeEmail(user: User) {
    const emailHtml = render(WelcomeEmail({ userName: user.firstName }));
    await this.sesClient.sendEmail({
      Source: 'noreply@example.com',
      Destination: { ToAddresses: [user.email] },
      Message: {
        Subject: { Data: 'Welcome!' },
        Body: { Html: { Data: emailHtml } },
      },
    });
  }
}
```

### API Communication

```typescript
// Type-safe API Client
export const createUser = async (
  data: CreateUserRequest,
): Promise<CreateUserResponse> => {
  return clientFetch<CreateUserResponse>("/v1/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Server-side Fetching
export const getUsersServer = async (): Promise<User[]> => {
  return serverFetch<User[]>("/v1/users");
};
```

## 🚀 Performance Architecture

### Database Optimization

```typescript
// Indexes for Performance
export const userTable = pgTable(
  "user",
  {
    id: uuid().primaryKey(),
    email: varchar({ length: 255 }).unique().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  }),
);
```

### Error Handling

```typescript
// Global Exception Filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
```

### Health Checks

```typescript
// Health Check Endpoints
@Controller("health")
export class HealthController {
  @Get()
  check() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("database")
  async checkDatabase() {
    try {
      await this.db.select().from(userTable).limit(1);
      return { status: "ok", database: "connected" };
    } catch (error) {
      throw new ServiceUnavailableException("Database connection failed");
    }
  }
}
```

## 🌍 Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Railway API   │    │  PostgreSQL DB  │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Managed)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │              ┌─────────────────┐
         │                       │              │   AWS SES       │
         │                       └─────────────►│   (Email)       │
         │                                      └─────────────────┘
         │              ┌─────────────────┐
         └─────────────►│  Static Assets  │
                        │   (CDN Cache)   │
                        └─────────────────┘
```

### Container Architecture

```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

This architecture provides a solid foundation for scalable, maintainable applications while ensuring developer productivity and system reliability.
