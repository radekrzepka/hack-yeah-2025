# Templates Guide

This document explains how to use the existing templates and patterns in the codebase to quickly create new features. The `test-table` module serves as a comprehensive template for CRUD operations across the entire stack.

## 🎯 Template Overview

The codebase includes complete templates for:

- **Backend CRUD module** (NestJS with CQRS)
- **Frontend feature** (Next.js with forms and tables)
- **Database schema** (Drizzle ORM)
- **API communication** (Type-safe client/server calls)
- **UI components** (Forms, tables, modals)

## 🏗 Backend API Template

### Location

`apps/api/src/modules/test-table/`

### Template Structure

```
feature-module/
├── commands/                     # Write operations
│   ├── create-feature/
│   │   ├── create-feature.command.ts
│   │   └── create-feature.handler.ts
│   ├── update-feature/
│   └── delete-feature/
├── queries/                      # Read operations
│   ├── get-all-features/
│   └── get-feature-by-id/
├── controllers/
│   └── feature.controller.ts     # REST endpoints
├── dtos/                        # Request/response types
│   ├── create-feature/
│   ├── get-feature/
│   └── update-feature/
├── exceptions/
│   └── feature.exceptions.ts     # Custom exceptions
├── repositories/
│   ├── feature.repository.interface.ts
│   └── feature.repository.ts     # Data access layer
├── services/
│   └── feature.service.ts        # Business logic orchestration
└── feature.module.ts            # Module configuration
```

### Step-by-Step: Creating a New API Module

#### 1. Database Schema

First, create your database schema in `packages/db/src/schemas/`:

```typescript
// packages/db/src/schemas/user.ts
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: MAX_EMAIL_LENGTH }).unique().notNull(),
  firstName: varchar({ length: MAX_NAME_LENGTH }).notNull(),
  lastName: varchar({ length: MAX_NAME_LENGTH }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type UserSelect = InferSelectModel<typeof userTable>;
export type UserInsert = InferInsertModel<typeof userTable>;
```

Don't forget to export from `packages/db/src/schema.ts`:

```typescript
export * from "./schemas/user";
```

#### 2. Create Module Directory

```bash
mkdir -p apps/api/src/modules/user/{commands,queries,controllers,dtos,exceptions,repositories,services}
```

#### 3. DTOs (Data Transfer Objects)

Create request/response DTOs based on the test-table pattern:

```typescript
// apps/api/src/modules/user/dtos/create-user/create-user-request.dto.ts
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserRequestDto {
  @ApiProperty({
    description: "User email address",
    example: "john@example.com",
    maxLength: MAX_EMAIL_LENGTH,
  })
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
    maxLength: MAX_NAME_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_NAME_LENGTH)
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
    maxLength: MAX_NAME_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_NAME_LENGTH)
  lastName: string;
}
```

#### 4. Repository Interface and Implementation

```typescript
// apps/api/src/modules/user/repositories/user.repository.interface.ts
import type { UserInsert, UserSelect } from "@hackathon/db";

export abstract class UserRepositoryInterface {
  abstract create(data: UserInsert): Promise<UserSelect>;
  abstract findAll(): Promise<UserSelect[]>;
  abstract findById(id: string): Promise<UserSelect | null>;
  abstract update(
    id: string,
    data: Partial<UserInsert>,
  ): Promise<UserSelect | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<UserSelect | null>;
}
```

#### 5. Commands and Queries

Follow the CQRS pattern:

```typescript
// apps/api/src/modules/user/commands/create-user/create-user.command.ts
import type { CreateUserRequestDto } from "../../dtos/create-user/create-user-request.dto";

export class CreateUserCommand {
  constructor(public readonly data: CreateUserRequestDto) {}
}
```

```typescript
import type { ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";

import { UserRepository } from "../../repositories/user.repository";
import { CreateUserCommand } from "./create-user.command";

// apps/api/src/modules/user/commands/create-user/create-user.handler.ts

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { data } = command;
    return await this.userRepository.create(data);
  }
}
```

#### 6. Controller

Create the REST endpoints:

```typescript
// apps/api/src/modules/user/controllers/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "../../../common/decorators/public.decorator";
import { UserService } from "../services/user.service";

@ApiTags("User")
@Controller({ version: "1", path: "user" })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  async create(@Body() createDto: CreateUserRequestDto) {
    return await this.userService.create(createDto);
  }

  // ... other endpoints following the same pattern
}
```

#### 7. Module Configuration

```typescript
// apps/api/src/modules/user/user.module.ts
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateUserHandler } from "./commands/create-user/create-user.handler";
// ... import other handlers
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";

const UserCommandHandlers = [
  CreateUserHandler /* ... other command handlers */,
];
const UserQueryHandlers = [
  /* query handlers */
];

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

#### 8. Register Module in App

Add to `apps/api/src/modules/app.module.ts`:

```typescript
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    // ... existing modules
    UserModule,
  ],
})
export class AppModule {}
```

## 🌐 Frontend Template

### Location

`apps/web/app/test/`

### Template Structure

```
feature/
├── page.tsx                      # Main feature page
├── layout.tsx                    # Feature layout
├── [itemId]/                     # Dynamic routes
│   ├── page.tsx                 # Detail page
│   └── not-found.tsx            # Not found page
├── _api/                        # API communication
│   ├── client/                  # Client-side calls
│   └── server/                  # Server-side calls
├── _modules/                    # Feature components
│   ├── feature-list.tsx         # List component
│   ├── create-feature-form.tsx  # Create form
│   ├── edit-feature-form.tsx    # Edit form
│   └── feature-detail.tsx       # Detail component
└── _utils/                      # Feature utilities
    └── handle-feature-error.ts  # Error handling
```

### Step-by-Step: Creating a New Frontend Feature

#### 1. Create Feature Directory

```bash
mkdir -p apps/web/app/user/{_api/{client,server},_modules,_utils,[userId]}
```

#### 2. API Communication Layer

**Server-side API calls** (`_api/server/`):

```typescript
// apps/web/app/user/_api/server/get-all-users.ts
import type { GetUserResponseDto } from "@hackathon/shared";

import { serverFetch } from "../../../_utils/fetch/server-fetch";

export const getAllUsersServer = async (): Promise<GetUserResponseDto[]> => {
  return serverFetch<GetUserResponseDto[]>("/v1/user");
};
```

**Client-side API calls** (`_api/client/`):

```typescript
// apps/web/app/user/_api/client/get-all-users.ts
import type { GetUserResponseDto } from "@hackathon/shared";

import { clientFetch } from "../../../_utils/fetch/client-fetch";

export const getAllUsersClient = async (): Promise<GetUserResponseDto[]> => {
  return clientFetch<GetUserResponseDto[]>("/v1/user");
};

export const createUserClient = async (
  data: CreateUserRequestDto,
): Promise<CreateUserResponseDto> => {
  return clientFetch<CreateUserResponseDto>("/v1/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
```

#### 3. Form Validation Schema

```typescript
// apps/web/app/user/_modules/user-form.validation.ts
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { z } from "zod";

export const createUserFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(
      MAX_EMAIL_LENGTH,
      `Email must be ${MAX_EMAIL_LENGTH} characters or less`,
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(
      MAX_NAME_LENGTH,
      `First name must be ${MAX_NAME_LENGTH} characters or less`,
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(
      MAX_NAME_LENGTH,
      `Last name must be ${MAX_NAME_LENGTH} characters or less`,
    ),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
```

#### 4. Form Components

```typescript
// apps/web/app/user/_modules/create-user-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormInput } from "@hackathon/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createUserClient } from "../_api/client/create-user";
import { handleUserError } from "../_utils/handle-user-error";
import { createUserFormSchema, type CreateUserFormData } from "./user-form.validation";

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: createUserClient,
    onSuccess: () => {
      toast.success("User created successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error(handleUserError(error));
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUser(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        name="email"
        label="Email"
        type="email"
        control={form.control}
        placeholder="john@example.com"
      />
      <FormInput
        name="firstName"
        label="First Name"
        control={form.control}
        placeholder="John"
      />
      <FormInput
        name="lastName"
        label="Last Name"
        control={form.control}
        placeholder="Doe"
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
```

#### 5. List Component

```typescript
// apps/web/app/user/_modules/user-list.tsx
"use client";

import type { GetUserResponseDto } from "@hackathon/shared";
import { useState } from "react";
import {
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TypographyH1,
} from "@hackathon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteUserClient } from "../_api/client/delete-user";
import { getAllUsersClient } from "../_api/client/get-all-users";
import { handleUserError } from "../_utils/handle-user-error";
import { CreateUserForm } from "./create-user-form";

interface UserListProps {
  initialData: Array<GetUserResponseDto>;
}

export function UserList({ initialData }: UserListProps) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: users = initialData } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersClient,
    initialData,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserClient,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      toast.error(handleUserError(error));
    },
  });

  // ... rest of component implementation
}
```

#### 6. Main Page

```typescript
// apps/web/app/user/page.tsx
import { getAllUsersServer } from "./_api/server/get-all-users";
import { UserList } from "./_modules/user-list";

export default async function UserPage() {
  const users = await getAllUsersServer();

  return (
    <div className="container mx-auto py-8">
      <UserList initialData={users} />
    </div>
  );
}
```

## 📝 Checklist for New Features

### Backend Checklist

- [ ] Create database schema in `packages/db/src/schemas/`
- [ ] Export schema from `packages/db/src/schema.ts`
- [ ] Run database migration: `pnpm db:generate && pnpm db:migrate`
- [ ] Create module directory structure
- [ ] Define DTOs with validation decorators
- [ ] Create repository interface and implementation
- [ ] Implement commands and command handlers
- [ ] Implement queries and query handlers
- [ ] Create service to orchestrate operations
- [ ] Create controller with proper API documentation
- [ ] Create custom exceptions
- [ ] Configure module with all providers
- [ ] Register module in `app.module.ts`
- [ ] Test endpoints in Swagger UI

### Frontend Checklist

- [ ] Create feature directory structure
- [ ] Implement server-side API calls
- [ ] Implement client-side API calls
- [ ] Create form validation schemas with Zod
- [ ] Build form components with validation
- [ ] Create list/table components
- [ ] Implement detail/view components
- [ ] Add error handling utilities
- [ ] Create main page with SSR data fetching
- [ ] Add dynamic routes if needed
- [ ] Test all user interactions

### Shared Types Checklist

- [ ] Generate API types: `pnpm --filter=shared generate-types`
- [ ] Update shared constants if needed
- [ ] Add new routes to `packages/shared/src/routes/`

## 🎨 UI Patterns

### Common Component Patterns

#### Modal Forms

```typescript
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogTrigger asChild>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add New
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Create New Item</DialogTitle>
    </DialogHeader>
    <CreateForm onSuccess={() => setIsModalOpen(false)} />
  </DialogContent>
</Dialog>
```

#### Data Tables

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">
          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Form Validation

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(validationSchema),
  defaultValues: {
    /* ... */
  },
});

const { mutate, isPending } = useMutation({
  mutationFn: apiCall,
  onSuccess: () => {
    toast.success("Success!");
    form.reset();
    onSuccess?.();
  },
  onError: (error) => {
    toast.error(handleError(error));
  },
});
```

## 🚀 Quick Start Commands

### Create New Backend Module

```bash
# Replace 'feature' with your feature name
FEATURE_NAME="user"

# Create directory structure
mkdir -p "apps/api/src/modules/${FEATURE_NAME}"/{commands,queries,controllers,dtos,exceptions,repositories,services}

# Copy and rename test-table files as templates
# Then customize for your feature
```

### Create New Frontend Feature

```bash
# Replace 'feature' with your feature name
FEATURE_NAME="user"

# Create directory structure
mkdir -p "apps/web/app/${FEATURE_NAME}"/{_api/{client,server},_modules,_utils,[itemId]}

# Copy and rename test files as templates
# Then customize for your feature
```

This template system allows you to rapidly create new features while maintaining consistency and best practices across your application. The `test-table` module serves as a living example that you can reference and copy from when building new functionality.
