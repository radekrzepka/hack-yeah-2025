# Development Guide

This guide covers best practices, coding standards, development workflows, and tools for contributing to the Hackathon Template project.

## 🎯 Development Philosophy

This project follows clean code principles and modern TypeScript best practices:

- **Type Safety First**: No `any` types allowed
- **Clean Architecture**: Clear separation of concerns
- **Testable Code**: Write code that's easy to test
- **Documentation**: Code should be self-documenting with clear naming
- **Consistency**: Follow established patterns throughout the codebase

## 📋 Code Standards

### TypeScript Guidelines

#### General Principles

- Use English for all code and documentation
- Always declare types for variables and functions (parameters and return values)
- Avoid using `any` - create proper types instead
- Use JSDoc to document public classes and methods
- Don't leave blank lines within functions
- One export per file

#### Naming Conventions

- **PascalCase** for classes: `UserService`, `CreateUserCommand`
- **camelCase** for variables, functions, and methods: `getUserById`, `isLoading`
- **kebab-case** for file and directory names: `user-service.ts`, `create-user/`
- **UPPERCASE** for environment variables: `DATABASE_URL`, `JWT_SECRET`
- **Complete words** instead of abbreviations (except standard ones like API, URL)

**Acceptable abbreviations:**

- `i`, `j` for loops
- `err` for errors
- `ctx` for contexts
- `req`, `res`, `next` for middleware parameters

#### Function Guidelines

- Write short functions with a single purpose (< 20 instructions)
- Name functions with a verb: `createUser`, `validateEmail`
- Boolean functions should use `isX`, `hasX`, `canX`: `isValid`, `hasPermission`
- Use early returns to avoid nesting
- Use arrow functions for simple functions (< 3 instructions)
- Use named functions for complex logic
- Use default parameters instead of checking for null/undefined

#### Data Handling

- Encapsulate data in composite types instead of using primitives
- Prefer immutability
- Use `readonly` for data that doesn't change
- Use `as const` for literals that don't change

### NestJS Specific Guidelines

#### Module Architecture

- One module per main domain/route
- One controller per route with secondary controllers for sub-routes
- Organize in folders: `models/`, `dtos/`, `services/`, `entities/`
- Use CQRS pattern for complex business logic
- Implement repository pattern for data access

#### Controller Structure

```typescript
@ApiTags("Feature")
@Controller({ version: "1", path: "feature" })
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Create feature" })
  @ApiCreatedResponse({ type: CreateFeatureResponseDto })
  async create(@Body() dto: CreateFeatureRequestDto) {
    return await this.featureService.create(dto);
  }
}
```

#### Service Pattern

```typescript
@Injectable()
export class FeatureService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    dto: CreateFeatureRequestDto,
  ): Promise<CreateFeatureResponseDto> {
    return this.commandBus.execute(new CreateFeatureCommand(dto));
  }
}
```

### React/Next.js Guidelines

#### Component Structure

- Use functional components with hooks
- Keep components focused and small
- Extract custom hooks for reusable logic
- Use TypeScript interfaces for props

#### File Organization

- Co-locate related files (components, styles, tests)
- Use feature-based folder structure
- Prefix private folders with underscore: `_api/`, `_utils/`

#### State Management

- Use React Query for server state
- Use local state for UI state
- Lift state up when needed by multiple components

#### UI Components (shadcn/ui)

- Use `@hackathon/ui` package for all UI components
- Add new shadcn/ui components via: `cd packages/ui && npx shadcn@latest add <component>`
- **Always fix imports manually** after adding shadcn/ui components:
  - Change `import { cn } from "src/lib/utils"` to `import { cn } from "../../lib/utils"`
- Export new components from `packages/ui/src/index.ts`
- Follow the "new-york" style variant and zinc color scheme

## 🛠 Development Workflow

### Getting Started

1. **Environment Setup**

   ```bash
   # Install dependencies
   pnpm install

   # Set up environment
   cp .env.example .env
   # Edit .env with your values

   # Start database
   pnpm db:up

   # Start development servers
   pnpm dev
   ```

2. **Verify Setup**
   - API: `http://localhost:4000/health`
   - Web: `http://localhost:3000`
   - Swagger: `http://localhost:4000/api`
   - Emails: `http://localhost:3002`

### Daily Development

#### Starting Work

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Start development servers
pnpm dev
```

#### Making Changes

1. **Create feature branch**

   ```bash
   git checkout -b feature/user-authentication
   ```

2. **Run quality checks**

   ```bash
   pnpm lint          # Check code style
   pnpm check-types   # Type checking
   pnpm test          # Run tests
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   ```

### Code Quality Tools

#### ESLint Configuration

The project uses strict ESLint rules:

- No unused variables
- Consistent import ordering
- TypeScript-specific rules
- React hooks rules
- Accessibility rules

#### Prettier Configuration

Automatic code formatting with:

- 2-space indentation
- Single quotes
- Trailing commas
- Import sorting

## 📊 Database Development

### Schema Changes

1. **Modify schema** in `packages/db/src/schemas/`
2. **Generate migration**
   ```bash
   pnpm --filter=db db:generate
   ```
3. **Review migration** in `packages/db/drizzle/`
4. **Apply migration**
   ```bash
   pnpm --filter=db db:migrate
   ```

### Development Database

```bash
# Reset database with fresh data
pnpm db:reset

# Open database studio
pnpm --filter=db db:studio

# Seed additional data
pnpm --filter=db db:seed
```

### Production Considerations

- Always backup before migrations
- Test migrations on staging first
- Use transactions for complex migrations
- Document breaking changes

## 🔧 Debugging

### API Debugging

- Use NestJS built-in logger
- Add debug logs in development
- Use Swagger UI for API testing
- Check database queries in Drizzle Studio

### Frontend Debugging

- Use React DevTools
- Use React Query DevTools (enabled in development)
- Check network requests in browser DevTools
- Use console.log sparingly (remove before commit)

### Common Issues

#### Database Connection

```bash
# Check if database is running
docker ps

# Restart database
pnpm db:down && pnpm db:up
```

#### Port Conflicts

```bash
# Check what's using a port
lsof -i :4000

# Kill process
kill -9 <PID>
```

#### Type Errors

- Ensure all packages are built: `pnpm build`
- Restart TypeScript server in VS Code
- Check for circular dependencies

## 🚀 Performance Guidelines

### Backend Performance

- Use database indexes appropriately
- Implement pagination for large datasets
- Use connection pooling
- Cache expensive operations
- Profile API endpoints

### Frontend Performance

- Use React Query for caching
- Implement code splitting
- Optimize images and assets
- Use proper loading states
- Minimize bundle size

### Database Performance

- Index frequently queried columns
- Use appropriate data types
- Avoid N+1 queries
- Use database-level constraints

## 📝 Documentation

### Code Documentation

- Use JSDoc for public APIs
- Include examples in documentation
- Document complex business logic
- Keep README files updated

### API Documentation

- Use Swagger decorators
- Provide example requests/responses
- Document error responses
- Include authentication requirements

## 🔒 Security Guidelines

### Input Validation

- Validate all inputs with class-validator
- Sanitize user data
- Use parameterized queries
- Implement rate limiting

### Authentication & Authorization

- Use strong password requirements
- Implement proper session management
- Use HTTPS in production
- Validate JWT tokens properly

### Environment Security

- Never commit secrets to git
- Use environment variables for config
- Rotate secrets regularly
- Use different secrets per environment

## 🌐 Deployment Preparation

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance tested

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=strong-secret-key
EMAIL_API_KEY=...
```

## 🤝 Collaboration

### Git Workflow

```bash
# Feature branch naming
feature/user-authentication
fix/login-validation
chore/update-dependencies

# Commit message format
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
```

### Communication

- Use clear, descriptive commit messages
- Document breaking changes
- Communicate architectural decisions
- Share knowledge through code comments

This development guide ensures consistent, high-quality code across the project while maintaining developer productivity and code maintainability.
