# Conventional Commits Setup

This project uses conventional commits to maintain a clean and consistent commit history.

## What's Included

- **Commitlint**: Validates commit messages against conventional commit format
- **Commitizen**: Interactive commit message generator
- **Husky**: Git hooks for automated validation

## Usage

### Using Commitizen (Recommended)

Use the interactive commit tool:

```bash
pnpm run commit
```

This will guide you through creating a properly formatted commit message.

### Manual Commits

If you prefer to write commits manually, follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
feat: add user authentication system
fix(api): resolve memory leak in user controller
docs: update API documentation
style: format code with biome
refactor: extract user validation logic
perf: optimize database queries
test: add unit tests for user service
build: update dependencies
ci: add automated testing workflow
chore: update package.json scripts
```

## Validation

All commit messages are automatically validated when you commit. If a message doesn't follow the conventional commit format, the commit will be rejected with an error message explaining what needs to be fixed.

## Retry Failed Commits

If your commit was rejected due to format issues, you can retry with:

```bash
pnpm run commit:retry
```

This will amend your last commit with the corrected message.
