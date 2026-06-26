# Skills

Skills for AI agents following the [skills.sh](https://skills.sh) format.

## Structure

Each skill is a directory containing a `SKILL.md` file with YAML frontmatter:
- `name`: Unique identifier (lowercase, hyphens)
- `description`: Brief explanation

## Available Skills

### From [github/awesome-copilot](https://github.com/github/awesome-copilot)

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
- `github-issues/` - Create, update, and manage GitHub issues using MCP tools
- `github-release/` - Guides through releasing a new version of a GitHub library end-to-end with SemVer versioning and Keep a Changelog formatting

### From [mcollina/skills](https://github.com/mcollina/skills)

- `node/` - Provides domain-specific best practices for Node.js development with TypeScript, covering type stripping, async patterns, error handling, streams, modules, testing, performance, caching, logging, and more.
- `fastify/` - Guides development of Fastify Node.js backend servers and REST APIs using TypeScript or JavaScript. Use when building, configuring, or debugging a Fastify application — including defining routes, implementing plugins, setting up JSON Schema validation, handling errors, optimising performance, managing authentication, configuring CORS and security headers, integrating databases, working with WebSockets, and deploying to production.

### From [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills)

- `create-react-native-library/` - Scaffolds React Native libraries with `create-react-native-library` for standalone libraries or local native modules and views. Use when creating or working on React Native libraries or adding native functionality in an existing app.
- `react-native-best-practices/` - Provides React Native performance optimization guidelines for FPS, TTI, bundle size, memory leaks, re-renders, and animations. Applies to tasks involving Hermes optimization, JS thread blocking, bridge overhead, FlashList, native modules, or debugging jank and frame drops.
- `react-native-brownfield-migration/` - Provides an incremental adoption strategy to migrate native iOS or Android apps to React Native or Expo using `@callstack/react-native-brownfield` for initial setup. Use when planning migration steps, packaging XCFramework/AAR artifacts, and integrating them into host apps.
- `react-navigation/` - Provides React Navigation UI patterns for stacks, tabs, drawers etc. Use when building navigation UIs with React Navigation, configuring headers, bottom sheets or handling safe areas and insets.
- `upgrading-react-native/` - Upgrades React Native apps to newer versions by applying `rn-diff-purge` template diffs, updating `package.json` dependencies, migrating native iOS and Android configuration, resolving CocoaPods and Gradle changes, and handling breaking API updates. Use when upgrading React Native, bumping RN version, updating from RN 0.x to 0.y, or migrating Expo SDK alongside a React Native upgrade.

### From other sources

- `npm-check-updates/` - Upgrade `package.json` dependencies to the latest versions with [npm-check-updates](https://github.com/raineorshine/npm-check-updates). Use when checking for outdated dependencies, upgrading packages with filters/rejections, targeting specific version ranges, scanning monorepos, running interactive selection, detecting breaking upgrades with `--doctor`, or using the programmatic API.

## Usage

Add skills to your AI agent configuration or use with compatible tools.