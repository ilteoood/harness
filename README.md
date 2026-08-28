# Skills

Skills for AI agents following the [skills.sh](https://skills.sh) format.

## Structure

Skills are grouped by the category of project they apply to:

- `core/` - Universal skills reused across every project (git, GitHub, docs, security, dev tooling). These stay in the root `.claude` folder.
- `web-development/` - Skills specific to web frontends (React, UI/UX, design).
- `nodejs-development/` - Skills specific to Node.js backends (Fastify, npm).
- `mobile-development/` - Skills specific to React Native mobile apps.
- `presentation-creation/` - Skills specific to building slides and presentations.

Each skill is a directory containing a `SKILL.md` file with YAML frontmatter:
- `name`: Unique identifier (lowercase, hyphens)
- `description`: Brief explanation

## Available Skills

### `core/`

From [github/awesome-copilot](https://github.com/github/awesome-copilot):

- `codeql/` - Comprehensive guide for GitHub CodeQL including alert management, CLI commands, compiled languages, SARIF output, troubleshooting, and workflow configuration
- `commit-message-storyteller/` - Generate meaningful commit messages using story-telling principles
- `conventional-commit/` - Execute conventional commit format with smart commit message generation
- `create-agentsmd/` - Create agent model definitions for AI coding agents
- `create-implementation-plan/` - Create implementation plans for features and changes
- `create-llms/` - Create LLMS full text documentation files
- `create-readme/` - Generate README documentation files
- `create-specification/` - Create technical specifications and design documents
- `create-technical-spike/` - Research and document technical spikes
- `create-tldr-page/` - Create TLDR-style documentation pages
- `dependabot/` - Comprehensive guide for configuring and managing GitHub Dependabot
- `drawio/` - Create draw.io diagrams and export them to PNG
- `gh-cli/` - GitHub CLI (gh) comprehensive reference for repositories, issues, pull requests, Actions, projects, releases, gists, codespaces, organizations, extensions, and all GitHub operations from the command line
- `git-commit/` - Execute git commit with conventional commit message analysis, intelligent staging, and message generation
- `git-flow-branch-creator/` - Intelligent Git Flow branch creator that analyzes git status/diff and creates appropriate branches following the nvie Git Flow branching model
- `github-issues/` - Create, update, and manage GitHub issues using MCP tools
- `github-release/` - Guides through releasing a new version of a GitHub library end-to-end with SemVer versioning and Keep a Changelog formatting

From [github/gh-stack](https://github.com/github/gh-stack):

- `gh-stack/` - Manage stacked branches and pull requests with the `gh-stack` GitHub CLI extension. Use when the user wants to create, push, rebase, sync, navigate, or view stacks of dependent PRs. Triggers on tasks involving stacked diffs, dependent pull requests, branch chains, or incremental code review workflows.

Manually added:

- `localhost-run/` - Expose local HTTP, HTTPS, and TLS applications to the public internet via [localhost.run](https://localhost.run) SSH tunnels. Covers the basic `ssh -R` command, HTTP tunnel mode with auto-HTTPS and proxy headers, TLS passthrough for non-HTTP protocols, Custom Domain setup with DNS records, the Forever Free Tier restrictions, tunneling WordPress / web frameworks / SSH, and troubleshooting connection issues.

### `web-development/`

From [anthropics/skills](https://github.com/anthropics/skills):

- `frontend-design/` - Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

From [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills):

- `web-design-guidelines/` - Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".

Manually added:

- `react-frontend-development/` - Domain-specific best practices for building React Single Page Applications with TypeScript. Covers feature-based architecture, component and hook placement, TypeScript type safety, functional component patterns, performance optimisation, CSS Modules styling, routing with centralised route constants, data fetching with TanStack React Query, internationalization, accessibility, environment variable validation, and unit testing with Vitest + React Testing Library.

### `nodejs-development/`

From [mcollina/skills](https://github.com/mcollina/skills):

- `node/` - Provides domain-specific best practices for Node.js development with TypeScript, covering type stripping, async patterns, error handling, streams, modules, testing, performance, caching, logging, and more.
- `fastify/` - Guides development of Fastify Node.js backend servers and REST APIs using TypeScript or JavaScript. Use when building, configuring, or debugging a Fastify application — including defining routes, implementing plugins, setting up JSON Schema validation, handling errors, optimising performance, managing authentication, configuring CORS and security headers, integrating databases, working with WebSockets, and deploying to production.

From [raineorshine/npm-check-updates](https://github.com/raineorshine/npm-check-updates):

- `npm-check-updates/` - Upgrade `package.json` dependencies to the latest versions with [npm-check-updates](https://github.com/raineorshine/npm-check-updates). Use when checking for outdated dependencies, upgrading packages with filters/rejections, targeting specific version ranges, scanning monorepos, running interactive selection, detecting breaking upgrades with `--doctor`, or using the programmatic API.

### `mobile-development/`

From [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills):

- `create-react-native-library/` - Scaffolds React Native libraries with `create-react-native-library` for standalone libraries or local native modules and views. Use when creating or working on React Native libraries or adding native functionality in an existing app.
- `react-native-best-practices/` - Provides React Native performance optimization guidelines for FPS, TTI, bundle size, memory leaks, re-renders, and animations. Applies to tasks involving Hermes optimization, JS thread blocking, bridge overhead, FlashList, native modules, or debugging jank and frame drops.
- `react-native-brownfield-migration/` - Provides an incremental adoption strategy to migrate native iOS or Android apps to React Native or Expo using `@callstack/react-native-brownfield` for initial setup. Use when planning migration steps, packaging XCFramework/AAR artifacts, and integrating them into host apps.
- `react-navigation/` - Provides React Navigation UI patterns for stacks, tabs, drawers etc. Use when building navigation UIs with React Navigation, configuring headers, bottom sheets or handling safe areas and insets.
- `upgrading-react-native/` - Upgrades React Native apps to newer versions by applying `rn-diff-purge` template diffs, updating `package.json` dependencies, migrating native iOS and Android configuration, resolving CocoaPods and Gradle changes, and handling breaking API updates. Use when upgrading React Native, bumping RN version, updating from RN 0.x to 0.y, or migrating Expo SDK alongside a React Native upgrade.

Manually added:

- `react-native-development/` - Core engineering conventions for building React Native applications with TypeScript. Covers project structure, component/hook placement, TypeScript standards, performance patterns, centralized locators and screen names, API hook patterns, i18n key formatting, unit testing with coverage gates, and the pre-commit quality workflow (lint, typecheck, test, snapshots, conventional commits).

### `presentation-creation/`

From [slidevjs/slidev](https://github.com/slidevjs/slidev):

- `slidev/` - Create and present web-based slidedecks for developers using Slidev with Markdown, Vue components, code highlighting, animations, and interactive features. Use when building technical presentations, conference talks, code walkthroughs, teaching materials, or developer decks.

## Usage

Add skills to your AI agent configuration or use with compatible tools.

Core skills should be installed at the root `.claude` folder so they are available across every project. Skills scoped to a category should only be installed in the `.claude` folder of the projects they apply to.
