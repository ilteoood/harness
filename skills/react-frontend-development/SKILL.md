---
name: react-frontend-best-practices
description: Provides domain-specific best practices for building React Single Page Applications with TypeScript. Use when developing, structuring, or reviewing a React SPA — including feature-based architecture, component and hook placement, TypeScript type safety, functional component patterns, performance optimisation (useCallback/useMemo/stable handlers), CSS Modules styling, routing with centralised route constants, data fetching with TanStack React Query, internationalization (i18n), accessibility (a11y/ARIA), environment variable validation, and unit testing with Vitest + React Testing Library. Also covers the pre-commit quality gate (lint, typecheck, test, coverage, snapshots) and Conventional Commits. Trigger terms: React SPA, React component, custom hook, CSS Modules, React Query, react-i18next, Vitest, React Testing Library, feature folder, route constants, component placement.
metadata:
  tags: react, typescript, frontend, spa, vite, react-query, css-modules, i18n, accessibility, vitest, testing-library
---

## When to use

Use this skill whenever you are building or reviewing a React Single Page Application with TypeScript, to apply consistent, framework-agnostic engineering conventions for architecture, components, styling, routing, data fetching, i18n, accessibility, and testing.

These rules are technology-oriented and project-neutral. Adapt path aliases (shown here as `@app/...`), folder names, and translation file locations to the conventions of the repository you are working in.

## Recommended Stack

These practices assume (or work best with) the following stack:

- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand (or similar lightweight store)
- **Routing**: React Router v7+
- **Data Fetching**: TanStack React Query
- **Styling**: CSS Modules
- **Internationalization**: react-i18next
- **Testing**: Vitest with React Testing Library

**CRITICAL**: Never modify the application entry point (e.g. `src/main.tsx`) unless explicitly required for provider configuration or polyfill changes.

## Project Architecture

### Directory Structure

Prefer a feature-based structure:

```
├── public/                      # Static assets served as-is
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with providers
│   ├── assets/                  # Static assets (images, fonts, icons)
│   ├── components/              # Reusable UI components (cross-feature)
│   ├── constants/               # Application constants (routes, query keys)
│   ├── contexts/                # React contexts
│   ├── features/                # Feature-based modules
│   │   └── [featureName]/
│   │       ├── components/      # Feature-specific components
│   │       ├── hooks/           # Feature-specific hooks
│   │       ├── pages/           # Feature pages/routes
│   │       └── utils/           # Feature utilities
│   ├── hooks/                   # Global reusable hooks
│   ├── layouts/                 # Page layout components
│   ├── routes/                  # Route configuration
│   ├── services/                # External services integration
│   ├── store/                   # State store slices
│   ├── styles/                  # Global styles and theme
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
```

### Component Placement Rules

**Decision Tree for Component Placement:**

1. **Is the component reusable across multiple features?**
   - YES → Place in `src/components/`
   - NO → Continue to step 2

2. **Is the component specific to a single feature?**
   - YES → Place in `src/features/[featureName]/components/`
   - NO → Reconsider if it should be in `src/components/`

3. **Is the component a full page/route?**
   - YES → Place in `src/features/[featureName]/pages/` or `src/pages/`
   - NO → Follow rules 1-2

**Apply the same logic to hooks:**
- Generic/reusable hooks → `src/hooks/`
- Feature-specific hooks → `src/features/[featureName]/hooks/`

## Environment Configuration

### Environment Variables

Treat environment variables as a validated boundary:

1. Defined in `.env` (not committed to Git)
2. Documented in `.env.sample` with example values
3. Prefixed for client-side access as required by the bundler (e.g. `VITE_`)
4. Validated at runtime using a schema (e.g. Zod)

### Adding a New Environment Variable

**MANDATORY STEPS** (all must be completed):

1. **Add to `.env` file:**
   ```
   VITE_NEW_VARIABLE=actual_value
   ```

2. **Add to `.env.sample` with example:**
   ```
   VITE_NEW_VARIABLE=example_value_or_description
   ```

3. **Add to the env validation schema (e.g. `src/env.ts`):**
   ```typescript
   const envSchema = z.object({
     // ... existing schemas
     NEW_VARIABLE: z.string().min(1), // or appropriate schema
   })

   export const env = envSchema.parse({
     // ... existing variables
     NEW_VARIABLE: import.meta.env.VITE_NEW_VARIABLE,
   })
   ```

## Code Organization

### File Naming Conventions

| Type             | Convention                   | Example                   |
|------------------|------------------------------|---------------------------|
| React Components | PascalCase + `.tsx`          | `UserProfile.tsx`         |
| Hooks            | camelCase + `.ts`            | `useUserData.ts`          |
| Utilities        | camelCase + `.ts`            | `formatDate.ts`           |
| Types/Interfaces | PascalCase in `.ts`          | `User`, `ApiResponse`     |
| Constants        | SCREAMING_SNAKE_CASE         | `MAX_RETRY_COUNT`         |
| Test Files       | Match source + `.test.tsx`   | `UserProfile.test.tsx`    |
| CSS Modules      | Match source + `.module.css` | `UserProfile.module.css`  |

### Barrel Files

**CRITICAL RULE**: Avoid barrel files (index files that re-export multiple modules).

**Why Barrel Files Are Problematic:**

1. **Bundle Size Impact**: Barrel files can lead to unnecessary code being included in the bundle, even when only a single export is needed.
2. **Tree Shaking Issues**: Modern bundlers may struggle to properly tree-shake unused exports when they're re-exported through barrel files.
3. **Build Performance**: They can slow down build times as bundlers need to resolve more complex dependency graphs.

**Examples:**

```typescript
// ❌ WRONG: Using barrel file
// components/index.ts
export { Button } from './Button'
export { Card } from './Card'
export { Modal } from './Modal'

// Then importing from barrel
import { Button, Card } from '@app/components'

// ✅ CORRECT: Direct imports
import { Button } from '@app/components/Button/Button'
import { Card } from '@app/components/Card/Card'
```

## Development Guidelines

### TypeScript Standards

#### Type Safety

**RULE**: Avoid `any` type at all costs.

```typescript
// ✅ CORRECT: Use @ts-expect-error with explanation
// @ts-expect-error: Third-party library has incorrect typings for this method
someLibrary.undocumentedMethod()

// ❌ WRONG: Using any
const data: any = fetchData()

// ❌ WRONG: Using @ts-ignore (hides errors permanently)
// @ts-ignore
problematicCode()
```

#### Type Definitions

**Prefer interfaces for object shapes:**
```typescript
// ✅ CORRECT
interface UserProps {
  name: string
  age: number
  onClick: () => void
}

// Use type for unions, intersections, or mapped types
type Status = 'idle' | 'loading' | 'success' | 'error'
type UserWithId = User & { id: string }
```

### React Component Guidelines

#### Component Structure

**MANDATORY**: Use functional components with hooks.

**MANDATORY**: Define a dedicated interface for component props. Never use inline prop types.

**MANDATORY**: Do not use JSDoc comments in component files. Keep code clean and self-documenting through clear naming and structure.

```typescript
// ✅ CORRECT: Dedicated interface for props, no JSDoc
interface MyComponentProps {
  title: string
  onClick: () => void
}

const MyComponent = ({ title, onClick }: MyComponentProps) => {
  // ...
}

// ❌ WRONG: Inline prop types
const MyComponent = ({ title, onClick }: { title: string; onClick: () => void }) => {
  // ...
}

// ❌ WRONG: JSDoc comments
/**
 * MyComponent does something
 * @param title - The title prop
 */
const MyComponent = ({ title, onClick }: MyComponentProps) => {
  // ...
}
```

**Standard Component Template:**
```typescript
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import styles from './ExampleComponent.module.css'

interface ExampleComponentProps {
  title: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const ExampleComponent = ({
  title,
  onClick,
  disabled = false,
  className,
}: ExampleComponentProps) => {
  const {t} = useTranslation()

  // Memoized values
  const displayTitle = useMemo(() => title.toUpperCase(), [title])

  // Callbacks
  const handleClick = useCallback(() => {
    onClick(title)
  }, [onClick, title])

  return (
    <button
      type="button"
      className={clsx(styles.button, disabled && styles.disabled, className)}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {displayTitle}
    </button>
  )
}
```

#### Performance Optimization

**CRITICAL RULES:**

1. **Function References**
   ```typescript
   // ❌ WRONG: Creates new function on every render
   <button onClick={() => handleClick(id)}>Click</button>

   // ✅ CORRECT: Use data attributes and single handler
   <button data-id={id} onClick={handleClick}>Click</button>

   const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
     const id = e.currentTarget.dataset.id
     // handle click
   }, [])
   ```

2. **useCallback for Functions Passed as Props**
   ```typescript
   // ✅ CORRECT: Memoized callback
   const handleSubmit = useCallback((data: FormData) => {
     submitForm(data)
   }, [submitForm])
   ```

3. **useMemo for Expensive Computations**
   ```typescript
   // ✅ CORRECT: Memoized expensive computation
   const sortedItems = useMemo(() => {
     return [...items].sort((a, b) => a.name.localeCompare(b.name))
   }, [items])
   ```

### Styling Guidelines

**MANDATORY**: Never use inline styles. Always use CSS Modules for component styling.

```typescript
// ✅ CORRECT: CSS Modules
import styles from './MyComponent.module.css'

export const MyComponent = () => {
  return <div className={styles.container}>Content</div>
}

// ❌ WRONG: Inline styles
export const MyComponent = () => {
  return <div style={{ display: 'flex', padding: '1rem' }}>Content</div>
}
```

#### CSS Modules

```typescript
// Component file: Button.tsx
import styles from './Button.module.css'

export const Button = ({ variant = 'primary' }: ButtonProps) => {
  return (
    <button className={clsx(styles.button, styles[variant])}>
      Click me
    </button>
  )
}
```

```css
/* Button.module.css */
.button {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
}

.primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.secondary {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
```

#### CSS Custom Properties (Design Tokens)

Use design tokens (CSS custom properties) defined in the project's theme file rather than hardcoded values.

### Routing

#### Route Configuration

**RULE**: All route paths MUST be defined in a central constants file (e.g. `src/constants/routes.ts`). Never hardcode URL paths.

```typescript
// ✅ CORRECT: Import from constants
import {USER_PROFILE} from '@app/constants/routes'

redirect(USER_PROFILE)

// ❌ WRONG: Hardcoded string
redirect('UserProfile')
```

#### Navigation Usage

```typescript
import { useCallback } from 'react'
import { redirect, Link, generatePath } from 'react-router-dom'
import { USER_PROFILE, HOME } from '@app/constants/routes'

interface UserListProps {
  userId: string
}

export const UserList = ({userId}: UserListProps) => {
  const handleUserClick = useCallback((userId: string) => {
    if (userId) {
      redirect(generatePath(USER_PROFILE, {userId}))
    }
  }, [userId])

  return (
    <nav>
      {/* ✅ CORRECT: Use Link for declarative navigation */}
      <Link to={HOME}>Home</Link>

      {/* ✅ CORRECT: Use navigate for programmatic navigation */}
      <button onClick={() => handleUserClick(userId)}>
        Go to user
      </button>
    </nav>
  )
}
```

### Data Fetching with React Query

#### API Hook Pattern

**MANDATORY**: Create a dedicated hook for each API endpoint. Centralize query keys in a constants file (e.g. `src/constants/queryKeys.ts`).

**Usage in Component:**
```typescript
const UserProfile = ({ userId }: UserProfileProps) => {
  const { data: user, isFetching, error } = useUser(userId)
  const { mutate: updateUser, isPending } = useUpdateUser()

  if (isFetching) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!user) return null

  const handleSave = (formData: UpdateUserPayload) => {
    updateUser({ userId, data: formData })
  }

  return <UserForm user={user} onSave={handleSave} isSaving={isPending} />
}
```

### Internationalization (i18n)

#### Translation Key Format

**RULE**: Use hierarchical dot notation.

**Format:**
- With sub-feature: `featureName.subFeatureName.keyName`
- Without sub-feature: `featureName.keyName`

#### JSON Structure

Translation files typically live under the translation service directory (e.g. `src/services/translation/en.json`).

```json
{
  "auth": {
    "login.title": "Sign in to your account, {{name}}",
    "login.button": "Sign In",
    "logout.confirmTitle": "Are you sure?",
    "logout.confirmMessage": "You will be signed out of the app"
  },
  "profile": {
    "edit.saveButton": "Save Changes",
    "edit.cancelButton": "Cancel"
  },
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "loading": "Loading..."
  }
}
```

#### Usage in Components

```typescript
import { useTranslation } from 'react-i18next'

export const LoginScreen = ({ userName }: Props) => {
  const { t } = useTranslation()

  return (
    <header>
      <h1>{t('auth.login.title', { name: userName })}</h1>
      <p>{t('auth.login.button')}</p>
    </header>
  )
}
```

#### Adding New Translations

**STEPS:**
1. Add key to the translation file following the format rules
2. Use the `t()` function in the component

### Accessibility (a11y)

**MANDATORY**: All interactive elements must be accessible.

```typescript
// ✅ CORRECT: Accessible button
<button
  type="button"
  onClick={handleClick}
  aria-label="Close dialog"
  aria-pressed={isPressed}
>
  <CloseIcon aria-hidden="true" />
</button>

// ✅ CORRECT: Accessible form input
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <span id="email-error" role="alert">{error}</span>}

// ✅ CORRECT: Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to proceed?</p>
</div>

// ✅ CORRECT: Skip to main content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## Testing Requirements

### Unit Testing

#### Test Framework

- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **User Events**: @testing-library/user-event

#### Element Querying Strategy

**CRITICAL RULE**: Never use `data-testid` attributes or `getByTestId` queries.

**Why Test IDs Are Prohibited:**

1. **Accessibility Verification**: Using roles ensures components are accessible to assistive technologies
2. **User-Centric Testing**: Tests should interact with components the way users do
3. **Implicit Accessibility Auditing**: Role-based queries fail if elements lack proper ARIA attributes
4. **Maintenance**: Roles are semantic and less likely to change than arbitrary test IDs

**Query Priority (follow Testing Library guidelines):**

1. `getByRole` - Always prefer this (buttons, links, headings, etc.)
2. `getByLabelText` - For form fields
3. `getByPlaceholderText` - When label is not available
4. `getByText` - For non-interactive elements
5. `getByDisplayValue` - For filled form elements

```typescript
// ❌ WRONG: Using test IDs
<button data-testid="submit-btn">Submit</button>
screen.getByTestId('submit-btn')

// ✅ CORRECT: Using roles
<button type="submit">Submit</button>
screen.getByRole('button', { name: 'Submit' })

// ❌ WRONG: Using test IDs for links
<a href="/home" data-testid="home-link">Home</a>
screen.getByTestId('home-link')

// ✅ CORRECT: Using roles for links
<a href="/home">Home</a>
screen.getByRole('link', { name: 'Home' })

// ❌ WRONG: Using test IDs for inputs
<input data-testid="email-input" type="email" />
screen.getByTestId('email-input')

// ✅ CORRECT: Using labels for inputs
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />
screen.getByLabelText('Email Address')
```

#### Test File Naming

| Source File Type  | Test File Name            |
|-------------------|---------------------------|
| Component         | `ComponentName.test.tsx`  |
| Hook              | `useHookName.test.ts`     |
| Utility           | `utilityName.test.ts`     |

**Location**: Test files MUST be in the same directory as the source file.

#### Coverage Requirements

**RECOMMENDED THRESHOLDS** (all metrics): ≥ 90% for statements, functions, branches, and lines. Adapt to the repository's configured thresholds.

#### Test Setup

**IMPORTANT**: Prefer a custom `render`/`renderHook` helper that wraps components with the necessary providers (QueryClient, Router, i18n, etc.) instead of importing them directly from `@testing-library/react`. This avoids manually wrapping with providers in every test.

#### Component Test Template

```typescript
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'

import { render } from '@app/utils/testUtils'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    const {container} = render(<Button>Click me</Button>)

    expect(container).toMatchSnapshot()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### Test Best Practices

**RULE**: Extract common query functions to reduce repetition and improve maintainability.

When the same element query is used multiple times in a test suite, extract it as a helper function at the top of the describe block.

```typescript
// ✅ CORRECT: Extract common query function
describe('MyComponent', () => {
  const getBackLink = () => screen.getByRole('link', {name: 'functionality.backButton'})
  const getSubmitButton = () => screen.getByRole('button', {name: 'functionality.submitButton'})

  it('displays back link with correct href', () => {
    render(<MyComponent />)

    expect(getBackLink()).toHaveAttribute('href', '/home')
  })

  it('back link is keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.tab()

    expect(getBackLink()).toHaveFocus()
  })
})

// ❌ WRONG: Repeating the same query, using a regex for the name
describe('MyComponent', () => {
  it('displays back link with correct href', () => {
    render(<MyComponent />)

    expect(screen.getByRole('link', {name: /back/i})).toHaveAttribute('href', '/home')
  })

  it('back link is keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.tab()

    expect(screen.getByRole('link', {name: /back/i})).toHaveFocus()
  })
})
```

#### Hook Test Template

```typescript
import { waitFor } from '@testing-library/react'
import { renderHook } from '@app/utils/testUtils'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import * as apiClient from '@app/services/api/client'
import { useUser } from './useUser'

vi.mock('@app/services/api/client')

describe('useUser', () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches user data successfully', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser })

    const { result } = renderHook(() => useUser('1'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUser)
  })

  it('handles error state', async () => {
    const error = new Error('Failed to fetch user')
    vi.mocked(apiClient.get).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useUser('1'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})
```

## Pre-Commit Quality Gates

**CRITICAL RULE**: Before committing any code changes, complete ALL of the following steps in order.

### Step 1: Run Linting

```bash
<pm> lint       # e.g. npm run lint / pnpm lint / yarn lint
<pm> lint:fix   # attempt to auto-fix
```

All linting errors MUST be resolved before proceeding. Common issues: unused imports/variables, incorrect import order, missing semicolons/trailing commas, `console.log`/`debugger` statements in production code.

### Step 2: Run Type Checking

```bash
<pm> typecheck
```

Type checking MUST pass with zero errors. Common issues: missing type definitions, incorrect assignments, use of `any` (prohibited), missing interface properties.

### Step 3: Run Tests

```bash
<pm> test
```

- ALL tests MUST pass.
- Code coverage of the whole test suite SHOULD meet the repository's threshold (commonly ≥90% for all metrics).

If coverage is below threshold, generate the coverage report, identify uncovered sections, add missing test cases, and re-run.

### Step 4: Update Snapshots (If Needed)

Update snapshots ONLY when you intentionally changed component UI/output, props, or structure.

```bash
<pm> test -- -u                       # update all snapshots
<pm> test ComponentName.test.tsx -- -u # update specific file
```

**CRITICAL WARNINGS:**
- ⚠️ NEVER blindly update snapshots without reviewing the changes.
- ⚠️ ALWAYS review snapshot diffs to ensure changes are intentional.
- ⚠️ ALWAYS re-run tests after updating snapshots to verify they pass.
- ⚠️ NEVER update snapshots to bypass legitimate test failures.

### Step 5: Verify Everything Together

```bash
<pm> lint && <pm> typecheck && <pm> test
```

This MUST complete successfully with zero errors before committing.

### Pre-Commit Verification Checklist

- ✅ Lint passed
- ✅ Type check passed
- ✅ All tests passed
- ✅ Coverage meets threshold
- ✅ Snapshots reviewed and updated (if UI changed)
- ✅ Snapshot files committed (if updated)
- ✅ Commit message follows Conventional Commits format
- ✅ No debug code (`console.log`, `debugger` statements)
- ✅ No commented-out code blocks

## Checklist for New Features

When implementing a new feature, ensure:

- [ ] Feature organized in `src/features/[featureName]/`
- [ ] Components placed correctly (generic vs feature-specific)
- [ ] Component props defined with dedicated interfaces
- [ ] Route paths defined in the central route constants file
- [ ] Query keys defined in the central query keys file
- [ ] API hooks created with `useQuery`/`useMutation`
- [ ] Translation keys added to translation files
- [ ] Styles follow design system tokens (CSS Modules, no inline styles)
- [ ] TypeScript strict mode compliance (no `any`)
- [ ] Accessibility requirements met (ARIA, keyboard nav)
- [ ] Unit tests written meeting the coverage threshold
- [ ] No inline function definitions in JSX
- [ ] Performance optimizations applied (`useCallback`/`useMemo`)
- [ ] Error boundaries for feature sections
- [ ] Loading states implemented
- [ ] Lint, type check, and tests all pass
- [ ] Commit message follows Conventional Commits format
