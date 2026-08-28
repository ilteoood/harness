// Sync configuration - export an array of source repos with their skills
export default [
  {
    repo: 'github/awesome-copilot',
    branch: 'main',
    skills: [
      { name: 'codeql', category: 'core' },
      { name: 'commit-message-storyteller', category: 'core' },
      { name: 'conventional-commit', category: 'core' },
      { name: 'create-agentsmd', category: 'core' },
      { name: 'create-implementation-plan', category: 'core' },
      { name: 'create-llms', category: 'core' },
      { name: 'create-readme', category: 'core' },
      { name: 'create-specification', category: 'core' },
      { name: 'create-technical-spike', category: 'core' },
      { name: 'create-tldr-page', category: 'core' },
      { name: 'dependabot', category: 'core' },
      { name: 'drawio', category: 'core' },
      { name: 'gh-cli', category: 'core' },
      { name: 'git-commit', category: 'core' },
      { name: 'git-flow-branch-creator', category: 'core' },
      { name: 'github-issues', category: 'core' },
      { name: 'github-release', category: 'core' },
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
