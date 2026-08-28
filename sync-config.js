// Sync configuration - export an array of source repos with their skills
export default [
  {
    repo: 'github/awesome-copilot',
    branch: 'main',
    skills: [
      { name: 'codeql', category: 'core' },
      { name: 'commit-message-storyteller', category: 'core' },
      { name: 'conventional-commit', category: 'core' },
      { name: 'create-agentsmd', category: 'documentation' },
      { name: 'create-implementation-plan', category: 'documentation' },
      { name: 'create-llms', category: 'documentation' },
      { name: 'create-readme', category: 'documentation' },
      { name: 'create-specification', category: 'documentation' },
      { name: 'create-technical-spike', category: 'documentation' },
      { name: 'create-tldr-page', category: 'documentation' },
      { name: 'dependabot', category: 'core' },
      { name: 'drawio', category: 'presentation-creation' },
      { name: 'gh-cli', category: 'core' },
      { name: 'git-commit', category: 'core' },
      { name: 'git-flow-branch-creator', category: 'core' },
      { name: 'github-issues', category: 'core' },
      { name: 'github-release', category: 'core' },
    ],
  },
  {
    repo: 'mattpocock/skills',
    branch: 'main',
    skills: [
      { name: 'grill-me', category: 'documentation' },
      { name: 'grill-with-docs', category: 'documentation' },
      { name: 'grilling', category: 'documentation' },
    ],
  },
  {
    repo: 'mcollina/skills',
    branch: 'main',
    skills: [
      { name: 'fastify', category: 'nodejs-development' },
      { name: 'node', category: 'nodejs-development' },
    ],
  },
  {
    repo: 'raineorshine/npm-check-updates',
    branch: 'main',
    skills: [
      { name: 'npm-check-updates', category: 'nodejs-development' },
    ],
  },
  {
    repo: 'callstackincubator/agent-skills',
    branch: 'main',
    skills: [
      { name: 'create-react-native-library', category: 'mobile-development' },
      { name: 'react-native-best-practices', category: 'mobile-development' },
      { name: 'react-native-brownfield-migration', category: 'mobile-development' },
      { name: 'react-navigation', category: 'mobile-development' },
      { name: 'upgrading-react-native', category: 'mobile-development' },
    ],
  },
  {
    repo: 'slidevjs/slidev',
    branch: 'main',
    skills: [
      { name: 'slidev', category: 'presentation-creation' },
    ],
  },
  {
    repo: 'anthropics/skills',
    branch: 'main',
    skills: [
      { name: 'frontend-design', category: 'web-development' },
    ],
  },
  {
    repo: 'vercel-labs/agent-skills',
    branch: 'main',
    skills: [
      { name: 'web-design-guidelines', category: 'web-development' },
    ],
  },
  {
    repo: 'github/gh-stack',
    branch: 'main',
    skills: [
      { name: 'gh-stack', category: 'core' },
    ],
  },
];
