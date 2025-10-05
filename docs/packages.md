# Packages Guide

This document provides a detailed overview of all packages in the `packages/` directory. Each package serves a specific purpose and can be imported by the applications.

## Package Overview

| Package                        | Purpose                         | Main Dependencies           |
| ------------------------------ | ------------------------------- | --------------------------- |
| `@hackathon/db`                | Database schemas and operations | Drizzle ORM, PostgreSQL     |
| `@hackathon/domain`            | Domain logic and business rules | None (pure TypeScript)      |
| `@hackathon/shared`            | Shared types and utilities      | Zod, Swagger TypeScript API |
| `@hackathon/transactional`     | Email templates                 | React Email, React          |
| `@hackathon/ui`                | UI components library           | React, Tailwind, Radix UI   |
| `@hackathon/eslint-config`     | ESLint configurations           | ESLint rules                |
| `@hackathon/typescript-config` | TypeScript configurations       | TypeScript compiler options |

## 📊 @hackathon/db

**Location**: `packages/db/`

### Purpose

Manages all database-related code including schemas, migrations, and database operations using Drizzle ORM.

### Key Features

- **Type-safe database schemas** with Drizzle ORM
- **Automatic migrations** and schema generation
- **Seed data** for development and testing
- **Database utilities** for connection management

### Structure

```
packages/db/
├── src/
│   ├── index.ts          # Main exports
│   ├── schema.ts         # Schema aggregation
│   ├── schemas/          # Individual table schemas
│   │   └── test-table.ts # Example table schema
│   ├── seed-data/        # Development seed data
│   │   └── seed-test.ts  # Example seed data
│   ├── seed.ts           # Seed script
│   └── reset.ts          # Database reset script
├── drizzle/              # Generated migrations
└── drizzle.config.ts     # Drizzle configuration
```

### Usage Examples

**Importing schemas:**

```typescript
import type { TestTableInsert, TestTableSelect } from "@hackathon/db";
import { testTable } from "@hackathon/db";
```

**Database operations:**

```typescript
import { db } from "@hackathon/db";

// Insert data
const newRecord = await db.insert(testTable).values({
  email: "user@example.com",
  firstName: "John",
});
```

### Available Scripts

- `pnpm db:generate` - Generate migrations from schema changes
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:seed` - Seed database with development data
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm db:reset` - Reset database (useful for development)

### Adding New Tables

1. Create a new schema file in `src/schemas/`
2. Export the table from `src/schema.ts`
3. Generate migrations: `pnpm db:generate`
4. Apply migrations: `pnpm db:migrate`

## 🏢 @hackathon/domain

**Location**: `packages/domain/`

### Purpose

Contains domain logic, business rules, constants, and pure business functions that are independent of infrastructure concerns.

### Key Features

- **Business constants** (password length, token expiration, etc.)
- **Domain validation rules**
- **Pure business logic functions**
- **Type definitions** for domain entities

### Structure

```
packages/domain/
├── src/
│   ├── index.ts     # Main exports
│   └── auth/        # Authentication domain logic
│       └── index.ts # Auth constants and rules
```

### Usage Examples

**Using domain constants:**

```typescript
import {
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  SALT_ROUNDS,
} from "@hackathon/domain";

// Validation
if (password.length < MIN_PASSWORD_LENGTH) {
  throw new Error(
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  );
}
```

### Adding New Domain Logic

1. Create new domain modules in `src/`
2. Export from the main `index.ts`
3. Keep logic pure (no external dependencies)
4. Focus on business rules and constants

## 🔄 @hackathon/shared

**Location**: `packages/shared/`

### Purpose

Shared utilities, types, routes, and API contracts that are used across multiple applications.

### Key Features

- **API type definitions** generated from Swagger
- **Shared routes** and navigation constants
- **Error message constants**
- **Validation schemas** with Zod
- **Cross-app utilities**

### Structure

```
packages/shared/
├── src/
│   ├── index.ts           # Main exports
│   ├── api-types/         # Generated API types
│   │   └── dto.ts         # Auto-generated from API
│   ├── error-messages/    # Standardized error messages
│   │   └── index.ts
│   └── routes/            # Application routes
│       ├── index.ts
│       └── routes.ts      # Route constants
```

### Usage Examples

**Using API types:**

```typescript
import type {
  CreateTestTableRequestDto,
  GetTestTableResponseDto,
} from "@hackathon/shared";

const createRecord = async (
  data: CreateTestTableRequestDto,
): Promise<GetTestTableResponseDto> => {
  // Implementation
};
```

**Using routes:**

```typescript
import { ROUTES } from "@hackathon/shared";

// Navigation
router.push(ROUTES.MAIN);
```

### API Type Generation

The package includes automatic API type generation:

```bash
pnpm generate-types
```

This generates TypeScript types from the running API's Swagger documentation.

### Adding New Shared Code

1. Add new modules in appropriate directories
2. Export from main `index.ts`
3. Keep dependencies minimal
4. Ensure code works in both browser and Node.js environments

## 📧 @hackathon/transactional

**Location**: `packages/transactional/`

### Purpose

Email templates built with React Email for consistent, responsive email communication.

### Key Features

- **React-based email templates**
- **Responsive email design**
- **Live preview during development**
- **Reusable email components**

### Structure

```
packages/transactional/
├── src/
│   ├── index.ts                          # Main exports
│   └── emails/                           # Email templates
│       ├── layout.tsx                    # Base email layout
│       ├── account-confirmation-email.tsx
│       ├── reset-password-email.tsx
│       └── student-invitation-email.tsx
```

### Usage Examples

**Sending emails (in API):**

```typescript
import { AccountConfirmationEmail } from "@hackathon/transactional";
import { render } from "@react-email/render";

const emailHtml = render(
  AccountConfirmationEmail({
    userName: "John",
    confirmationUrl: "https://app.com/confirm",
  }),
);
```

### Development

Start the email preview server:

```bash
cd packages/transactional
pnpm dev
```

Visit `http://localhost:3002` to preview emails.

### Adding New Email Templates

1. Create new `.tsx` file in `src/emails/`
2. Use the layout component for consistency
3. Export from `src/index.ts`
4. Test with the preview server

## 🎨 @hackathon/ui

**Location**: `packages/ui/`

### Purpose

Comprehensive UI component library built with React, Tailwind CSS, Radix UI primitives, and shadcn/ui components.

### Key Features

- **shadcn/ui components** - Modern, accessible, and customizable UI components
- **Accessible components** built on Radix UI primitives
- **Consistent design system** with Tailwind CSS
- **Form components** with validation support
- **TypeScript-first** component API

### Structure

```
packages/ui/
├── src/
│   ├── index.ts              # Main exports
│   ├── globals.css           # Global styles
│   ├── components/
│   │   ├── form/             # Form-specific components
│   │   │   ├── form-input.tsx
│   │   │   ├── form-password-input.tsx
│   │   │   └── ...
│   │   ├── typography/       # Typography components
│   │   └── ui/               # Base UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   ├── hooks/                # Shared React hooks
│   └── lib/
│       └── utils.ts          # Utility functions
```

### Usage Examples

**Basic components:**

```typescript
import { Button, Card, CardHeader, CardTitle, CardContent } from '@hackathon/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

**Form components:**

```typescript
import { FormInput, FormPasswordInput } from '@hackathon/ui';
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { control } = useForm();

  return (
    <form>
      <FormInput
        name="email"
        label="Email"
        control={control}
        type="email"
      />
      <FormPasswordInput
        name="password"
        label="Password"
        control={control}
      />
    </form>
  );
}
```

**Theme support:**

```typescript
import { ThemeProvider } from '@hackathon/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <div>
        {/* Your app content */}
      </div>
    </ThemeProvider>
  );
}
```

### Styling

The package includes:

- **Tailwind CSS configuration** exported for apps
- **Global styles** for consistent typography
- **CSS custom properties** for theme variables
- **Component variants** using class-variance-authority

### Adding New shadcn/ui Components

The UI package is configured with shadcn/ui for easy component installation:

#### Installation Process

1. **Navigate to the UI package**:

   ```bash
   cd packages/ui
   ```

2. **Install shadcn/ui components**:

   ```bash
   npx shadcn@latest add <component-name>
   ```

   Example:

   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add dialog
   npx shadcn@latest add context-menu
   ```

3. **Fix imports manually** - shadcn/ui generates components with incorrect import paths:

   **❌ Generated import (incorrect):**

   ```typescript
   import { cn } from "src/lib/utils";
   ```

   **✅ Correct import for this package:**

   ```typescript
   import { cn } from "../../lib/utils";
   ```

4. **Export the component** from `src/index.ts`:
   ```typescript
   export * from "./components/ui/context-menu";
   ```

#### Configuration

The package includes a `components.json` configuration file that defines:

- **Style**: "new-york" variant
- **Base color**: zinc
- **CSS variables**: enabled for theming
- **Icon library**: lucide-react
- **Component paths**: correctly mapped to package structure

#### Common Import Fixes

When adding new shadcn/ui components, you'll typically need to fix these imports:

```typescript
// ❌ Generated (incorrect)
import { cn } from "src/lib/utils";

// ✅ Correct
import { cn } from "../../lib/utils";
```

```typescript
// ❌ If component imports other components incorrectly
import { Button } from "src/components/ui/button";

// ✅ Correct
import { Button } from "./button";
```

### Adding Custom Components

1. Create component in appropriate `src/components/` subdirectory
2. Export from `src/index.ts`
3. Follow existing patterns for props and styling
4. Include TypeScript types
5. Use Radix UI primitives when possible
6. Follow shadcn/ui patterns for consistency

## 🔧 Configuration Packages

### @hackathon/eslint-config

Provides ESLint configurations for different environments:

- `internal-library.js` - For packages
- `nest.js` - For NestJS applications
- `next.js` - For Next.js applications

### @hackathon/typescript-config

Provides TypeScript configurations:

- `base.json` - Base configuration
- `internal-library.json` - For packages
- `nest.json` - For NestJS applications
- `nextjs.json` - For Next.js applications

## 🔗 Package Dependencies

### Dependency Graph

```
apps/api     → @hackathon/db, @hackathon/domain, @hackathon/shared, @hackathon/transactional
apps/web     → @hackathon/ui, @hackathon/domain, @hackathon/shared
@hackathon/db → @hackathon/domain
@hackathon/shared → @hackathon/domain
```

### Best Practices

1. **Keep packages focused** - Each package should have a single responsibility
2. **Minimize dependencies** - Avoid heavy dependencies in shared packages
3. **Use workspace protocol** - Reference other packages with `workspace:*`
4. **Export everything explicitly** - Use barrel exports from `index.ts`
5. **Type everything** - No `any` types allowed
6. **Document public APIs** - Use JSDoc for public interfaces

## 🔄 Package Development Workflow

### Making Changes

1. Make changes in the package
2. Build the package: `pnpm build`
3. Test in consuming applications
4. Update version if needed
5. Commit changes

### Adding New Packages

1. Create new directory in `packages/`
2. Initialize with `package.json`
3. Add to `pnpm-workspace.yaml`
4. Configure TypeScript and ESLint
5. Export from appropriate places
6. Update documentation

This package system provides a solid foundation for sharing code across applications while maintaining clear boundaries and dependencies.
