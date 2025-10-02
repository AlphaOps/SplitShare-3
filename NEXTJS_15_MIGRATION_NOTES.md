# Next.js 15 Migration Notes

## Dynamic Route Params Type Requirements

In Next.js 15, the `params` prop in dynamic routes **must** be typed as a `Promise`.

### For Client Components (using `use` hook)

```tsx
'use client';

import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <div>{id}</div>;
}
```

### For Server Components (using `async/await`)

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <div>{id}</div>;
}
```

### For API Routes

```tsx
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ... rest of code
}
```

## Pages Using `useSearchParams()`

Any component using `useSearchParams()` must be wrapped in a `Suspense` boundary:

```tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MyPageContent() {
  const searchParams = useSearchParams();
  // ... component logic
}

export default function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
```

## Common Build Errors

### Error: "Type does not satisfy the constraint 'PageProps'"

**Cause:** Params not typed as Promise in Next.js 15

**Solution:** Update params type to `Promise<{ ... }>`

### Error: "Page does not match the required types"

**Cause:** Missing default export or incorrect component structure

**Solution:** Ensure page has a default export and follows Next.js conventions

## Files Fixed

- ✅ `/app/checkout/[id]/page.tsx` - Added `use` hook for client component
- ✅ `/app/verify-email/page.tsx` - Added Suspense wrapper for useSearchParams
- ✅ `/app/subscription/[id]/page.tsx` - Already correct
- ✅ `/app/api/pools/[poolId]/join/route.ts` - Already correct
- ✅ `/app/api/pools/[poolId]/verify/route.ts` - Already correct

## Build Status

✅ Build passes successfully with no type errors
⚠️ Warnings about `themeColor` in metadata (non-blocking, can be migrated to viewport export later)
