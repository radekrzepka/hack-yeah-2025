# Dashboard API Layer

This directory contains the client-side API functions for the retirement dashboard.

## Structure

```
_api/
├── client/
│   ├── index.ts                    # Barrel export
│   ├── get-simulation-data.ts      # Fetch simulation data
│   └── generate-pdf-report.ts      # Generate PDF report
└── server/
    ├── index.ts                    # Server-side exports
    └── get-simulation-data.ts      # Server-side data fetching
```

## Client Functions

### `getSimulationDataClient(tokenID: string)`

Fetches simulation result data for a given token ID.

**Returns:** `GetSimulationResultResponseDto`

**Usage:**

```typescript
import { getSimulationDataClient } from "./_api/client";

const data = await getSimulationDataClient(tokenID);
```

### `generatePdfReportClient({ tokenID: string })`

Generates and downloads a PDF report for the simulation.

**Returns:** `Blob` (PDF file)

**Usage:**

```typescript
import { generatePdfReportClient } from "./_api/client";

const pdfBlob = await generatePdfReportClient({ tokenID });
```

**Features:**

- Handles authentication tokens automatically
- Validates PDF content type
- Provides detailed error messages
- Returns Blob for flexible handling (download, preview, etc.)

## Error Handling

All client functions throw errors with descriptive messages:

```typescript
try {
  const blob = await generatePdfReportClient({ tokenID });
} catch (error) {
  console.error(error.message); // "Failed to generate PDF report: 404 - Not Found"
}
```

## Type Safety

All functions use TypeScript types imported from the API module or defined locally for type safety.
