# Development Workflow Standards

## Project Structure
```
pos-project/
├── cashier-front/          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable UI components
│   │   └── contexts/       # React contexts (Auth, etc.)
│   └── package.json
└── pos-backend/            # NestJS Backend API
    ├── src/
    │   ├── auth/          # Authentication module
    │   ├── entities/      # Database entities
    │   ├── menu/          # Menu & permissions module
    │   └── schemas/       # Mongoose schemas
    └── package.json
```

## Git Flow Standards

### Branch Strategy
- **`master`**: Production-ready code
- **`dev`**: Development integration branch
- **`feature/*`**: New features (e.g., `feature/user-management`)
- **`hotfix/*`**: Critical bug fixes (e.g., `hotfix/login-error`)
- **`release/*`**: Release preparation (e.g., `release/v1.0.0`)

### Branch Rules
1. **Never commit directly to `master`**
2. All new features start from `dev` branch
3. Use descriptive branch names with prefixes
4. Delete feature branches after merging

### Commit Message Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Build process or auxiliary tool changes

#### Examples:
```bash
feat(auth): implement JWT authentication system
fix(menu): resolve permission loading error
docs(api): add endpoint documentation
refactor(db): optimize query performance
```

### Development Workflow

#### 1. Starting New Feature
```bash
# Switch to dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/user-profile

# Work on your feature...
git add .
git commit -m "feat(user): implement user profile page"

# Push feature branch
git push origin feature/user-profile
```

#### 2. Code Review Process
1. Create Pull Request to `dev` branch
2. Add appropriate reviewers
3. Ensure all tests pass
4. Address review comments
5. Merge after approval

#### 3. Release Process
```bash
# Create release branch from dev
git checkout dev
git pull origin dev
git checkout -b release/v1.0.0

# Final testing and bug fixes
git commit -m "fix: minor UI adjustments"

# Merge to master
git checkout master
git merge release/v1.0.0
git tag v1.0.0

# Merge back to dev
git checkout dev
git merge master

# Clean up
git branch -d release/v1.0.0
```

## Code Quality Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type usage
- Use meaningful variable and function names

### Testing
- Write unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components
- Minimum 80% code coverage

## Quick Commands Reference

### Git Commands
```bash
# Check current branch
git branch

# Switch to dev branch
git checkout dev

# Create and switch to new branch
git checkout -b feature/new-feature

# Stage and commit changes
git add .
git commit -m "feat(scope): description"

# Push branch to remote
git push origin branch-name
```

### Development Commands
```bash
# Backend
npm run start:dev    # Start development server
npm run test        # Run tests

# Frontend  
npm run dev         # Start development server
npm run build       # Build for production
```
