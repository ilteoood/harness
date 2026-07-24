---
name: react-native-development
description: Core engineering conventions for building React Native applications with TypeScript. Use when creating or modifying React Native components, hooks, screens, navigation, data-fetching layers, styling, internationalization, tests, or preparing changes for commit. Covers project structure, component/hook placement, TypeScript standards, performance patterns, centralized locators and screen names, API hook patterns, i18n key formatting, unit testing with coverage gates, and the pre-commit quality workflow (lint, typecheck, test, snapshots, conventional commits). Trigger terms: React Native, TypeScript component, custom hook, navigation screen, react-query hook, unistyles theme, testID locator, unit test coverage, conventional commit.
metadata:
  tags: react-native, typescript, react, testing, conventions, best-practices
---

## When to use

Apply this skill whenever you develop in a React Native + TypeScript codebase and need consistent, maintainable conventions for:

- Placing components, hooks, and feature code
- Writing type-safe, performant React components
- Managing environment variables, constants, and translations
- Fetching data via dedicated API hooks
- Writing unit tests that meet coverage thresholds
- Passing pre-commit quality gates and committing correctly

Adapt import aliases, file paths, and tooling commands (`pnpm`, `npm`, `yarn`) to the conventions of the specific project you are working in.

## Project Architecture

### Feature-based structure

Organize code by feature. A typical layout:

```
src/
├── assets/          # Static assets (SVG icons, images)
├── components/      # Reusable UI components (cross-feature)
├── constants/       # Application constants (locators, screens)
├── contexts/        # React contexts
├── features/        # Feature-based modules
│   └── [featureName]/
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── screens/     # Feature screens
│       └── utils/       # Feature utilities
├── hooks/           # Global reusable hooks
├── navigation/      # Navigation configuration
├── services/        # External services integration
├── store/           # State management slices
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Component & hook placement

Decision tree:

1. Is it reusable across multiple features? → place in `src/components/` (or `src/hooks/`).
2. Is it specific to a single feature? → place in `src/features/[featureName]/components/` (or `.../hooks/`).
3. Otherwise reconsider whether it belongs in the shared location.

### Entry point

Never modify the app's entry point (polyfills, OTA setup, initialization) unless the task explicitly requires a polyfill or initialization change.

## Code Organization

### File naming conventions

| Type             | Convention                 | Example                |
| ---------------- | -------------------------- | ---------------------- |
| React Components | PascalCase + `.tsx`        | `UserProfile.tsx`      |
| Hooks            | camelCase + `.ts`          | `useUserData.ts`       |
| Utilities        | camelCase + `.ts`          | `formatDate.ts`        |
| Types/Interfaces | PascalCase                 | `User`, `ApiResponse`  |
| Constants        | SCREAMING_SNAKE_CASE       | `MAX_RETRY_COUNT`      |
| Test Files       | Match source + `.test.tsx` | `UserProfile.test.tsx` |

### No barrel files

Avoid barrel files (index files that re-export multiple modules). They hurt bundle size, break tree-shaking, and slow builds. Import directly from source modules instead.

```typescript
// ❌ WRONG: barrel re-export + import
// components/index.ts
export {Button} from './Button'
import {Button, Card} from '@app/components'

// ✅ CORRECT: direct imports
import {Button} from '@app/components/Button'
import {Card} from '@app/components/Card'
```

### Environment variables

When a project validates environment variables (e.g. via a schema), adding a new variable requires updating all of: the local env file, the committed example file, and the validation schema. Run the project's env validation step afterward.

## TypeScript Standards

### Type safety

- Avoid `any` at all costs.
- When a type cannot be satisfied, use `@ts-expect-error` with an explanatory comment — never `@ts-ignore`.

```typescript
// ✅ CORRECT
// @ts-expect-error: Third-party library has incorrect typings for this method
someLibrary.undocumentedMethod()

// ❌ WRONG
const data: any = fetchData()
```

### Type definitions

- Prefer `interface` for object shapes.
- Use `type` for unions, intersections, and mapped types.

```typescript
interface UserProps {
  name: string
  age: number
  onPress: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'
type UserWithId = User & {id: string}
```

## React Component Guidelines

- Use functional components with hooks.
- Define a dedicated interface for props. Never use inline prop types.

```typescript
// ✅ CORRECT
interface MyComponentProps {
  title: string
  onPress: () => void
}

const MyComponent = ({title, onPress}: MyComponentProps) => {
  // ...
}

// ❌ WRONG: inline prop types
const MyComponent = ({title, onPress}: {title: string; onPress: () => void}) => {
  // ...
}
```

### Performance optimization

1. Pass function references directly; do not wrap in inline arrow functions.

   ```typescript
   <Button onPress={handlePress} />       // ✅ CORRECT
   <Button onPress={() => handlePress()} /> // ❌ WRONG: new function each render
   ```

2. Use `useCallback` for functions passed to child components.
3. Use `useMemo` for expensive computations or transformations.

## Styling

Use a theme-based styling solution and read values from the theme rather than hardcoding. Access theme tokens (colors, spacing, typography) and runtime values (safe-area insets, orientation) through the styling hook.

```typescript
const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginBottom: rt.insets.bottom,
  },
}))
```

## Navigation

- Define all screen names in a central constants file and import them — never hardcode navigation strings.
- Type navigation params via the framework's typed param list.

```typescript
import {USER_PROFILE} from '@app/constants/screens'

navigation.navigate(USER_PROFILE) // ✅
navigation.navigate('UserProfile') // ❌ hardcoded
```

## Data Fetching

Create a dedicated hook for each API endpoint (query or mutation). Components consume the hook and handle loading/error/success states.

```typescript
const UserProfile = ({userId}: Props) => {
  const {data, isLoading, error} = useUserData(userId)
  const updateMutation = useUpdateUser()

  const handleUpdate = useCallback(
    (newData: UpdateData) => updateMutation.mutate({id: userId, ...newData}),
    [userId, updateMutation],
  )

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  return <UserForm data={data} onSubmit={handleUpdate} />
}
```

## Internationalization

- Never hardcode user-facing strings; use the translation function.
- Use hierarchical dot notation for keys: `featureName.subFeatureName.keyName` (or `featureName.keyName` without a sub-feature).
- Add new keys to the project's translation source file, then reference them via `t()`.

```typescript
const {t} = useTranslation()
return <Text>{t('auth.login.title')}</Text>
```

## Test IDs and Locators

- Define every `testID` value in a central locators constants file and import it.
- Add a locator at the moment it is first used with a real `testID`. Do not define unused locators.

```typescript
import {USER_PROFILE_SAVE_BUTTON} from '@app/constants/locators'

<Button testID={USER_PROFILE_SAVE_BUTTON} onPress={handleSave} />
```

## Testing Requirements

### Conventions

- Do not add explanatory comments in tests. Use the Given-When-Then methodology expressed through clear, non-technical `describe`/`it` names.
- Place test files in the same directory as the source file.
- Prefer the project's custom render/renderHook helpers (which wrap required providers) over importing directly from the testing library.

| Source File Type | Test File Name           |
| ---------------- | ------------------------ |
| Component        | `ComponentName.test.tsx` |
| Hook             | `useHookName.test.ts`    |
| Utility          | `utilityName.test.ts`    |

### Coverage thresholds

Maintain ≥ 90% for statements, functions, branches, and lines across the whole test suite.

### Component test example

```typescript
import {fireEvent} from '@testing-library/react-native'
import {render} from '@app/utils/testUtils'
import {USER_PROFILE_SAVE_BUTTON} from '@app/constants/locators'
import {UserProfile} from './UserProfile'

describe('UserProfile', () => {
  const mockOnSave = jest.fn()
  const defaultProps = {
    user: {id: '1', name: 'John Doe', email: 'john@example.com'},
    onSave: mockOnSave,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show user information correctly', () => {
    const {getByText} = render(<UserProfile {...defaultProps} />)
    expect(getByText('John Doe')).toBeOnTheScreen()
  })

  it('should save data when save button is pressed', () => {
    const {getByTestId} = render(<UserProfile {...defaultProps} />)
    fireEvent.press(getByTestId(USER_PROFILE_SAVE_BUTTON))
    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })
})
```

### Hook test example

```typescript
import {waitFor} from '@testing-library/react-native'
import * as httpsService from '@app/services/httpsService'
import {renderHook} from '@app/utils/testUtils'
import {useUserData} from './useUserData'

describe('Given a hook to handle user data', () => {
  it('should fetch user data successfully', async () => {
    const mockUser = {id: '1', name: 'John Doe'}
    jest.spyOn(httpsService, 'callApi').mockResolvedValue(mockUser)

    const {result} = renderHook(() => useUserData('1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockUser)
  })

  it('should handle errors appropriately', async () => {
    const mockError = new Error('Network error')
    jest.spyOn(httpsService, 'callApi').mockRejectedValue(mockError)

    const {result} = renderHook(() => useUserData('1'))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toEqual(mockError)
  })
})
```

## New Feature Checklist

- [ ] Feature organized under `src/features/[featureName]/`
- [ ] Components placed correctly (shared vs feature-specific)
- [ ] Props defined with dedicated interfaces (no inline types)
- [ ] All `testID` locators added to the central locators file
- [ ] Screen names added to the central screens file
- [ ] API hooks created (query/mutation) per endpoint
- [ ] Translation keys added and referenced via `t()`
- [ ] Styles use the theme system
- [ ] No `any`; strict TypeScript compliance
- [ ] Unit tests written with ≥ 90% coverage
- [ ] No inline function wrappers (`onPress={() => fn()}`)
- [ ] `useCallback` / `useMemo` applied where appropriate
- [ ] Lint, typecheck, and tests pass
- [ ] Snapshots updated and committed if applicable
- [ ] Commit and PR titles follow Conventional Commits
