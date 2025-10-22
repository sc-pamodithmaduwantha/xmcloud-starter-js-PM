# DMZ Git Workflow - Complete Implementation Guide

## Overview

This repository uses a DMZ git workflow to ensure the `main` branch is always clean, deployable, and never breaks. All changes go through a **two-tier validation system** before being merged to `main`.

## Problem Solved

When using **squash and merge** to `dmz` followed by **fast-forward** to `main`, developers were seeing "previous commits appearing in their PRs." This happened when developers created feature branches from an outdated `main` that hadn't yet been fast-forwarded with the latest squashed commits.

## Solution Overview

A **two-tier validation system** that:
1. ✅ Prevents PRs based on outdated `main` from being merged
2. ✅ Validates code quality at PR time (before merge)
3. ✅ Double-checks everything after merge to `dmz` (before fast-forward to `main`)
4. ✅ Maintains both requirements: squash merge + fast-forward

## Branch Structure

```
main (clean, deployable)
  ↑
dmz (integration branch)
  ↑
feature branches (developer forks)
```

### Key Principles

- **Main branch is always clean**: Never accepts direct PRs from developers
- **DMZ branch is the integration point**: All PRs target the `dmz` branch
- **Automated validation**: All changes are validated before reaching `main`
- **Fast-forward only**: `main` is only updated via fast-forward from `dmz`
- **Automatic rollback**: Failed builds can be automatically reverted

## Workflow Architecture

### Gate 1: PR Validation (`.github/workflows/pr-validation.yml`)

**Triggers**: When a PR is opened or updated targeting `dmz`

**Validates**:
- ✅ PR branch is based on the **latest `main` HEAD**
- ✅ PR can be squash merged without conflicts
- ✅ Linting passes
- ✅ Formatting is correct
- ✅ TypeScript type checking passes
- ✅ All starters build successfully
- ✅ All tests pass

**Key Features**:
- **Smart change detection**: Only validates starters that have changes
- **Global change handling**: Validates all starters if global files change
- **Automated PR comments**: Provides clear feedback to developers
- **Incremental validation**: Updates existing comments instead of creating new ones

**Result**: 
- If validation fails → PR blocked, developer must fix issues
- If validation passes → PR can be reviewed and merged

### Gate 2: DMZ Validation (`.github/workflows/dmz-validation.yml`)

**Triggers**: When code is pushed to `dmz` (after PR is squash merged)

**Validates**:
- ✅ Linting passes (double-check)
- ✅ Formatting is correct (double-check)
- ✅ TypeScript type checking passes (double-check)
- ✅ All starters build successfully (double-check)
- ✅ All tests pass (double-check)

**Key Features**:
- **Comprehensive validation**: Tests all enabled starters
- **Automatic fast-forward**: Updates `main` only when validation passes
- **Mandatory testing**: All tests must pass before main branch updates
- **Detailed reporting**: Provides clear success/failure summaries

**Result**:
- If validation fails → `main` is NOT updated, `dmz` can be rebased
- If validation passes → `main` is automatically fast-forwarded to `dmz`

### Gate 3: DMZ Revert (`.github/workflows/revert-dmz.yml`)

**Triggers**: Manual workflow dispatch only

**What it does**:
- Reverts specified commits from `dmz` branch
- Creates tracking issues for reverted commits
- Notifies related PRs about the revert
- Provides detailed revert information

**Key Features**:
- **Flexible commit targeting**: Can revert specific commits or latest commit
- **Automatic tracking**: Creates issues to track revert reasons and fixes
- **PR notification**: Comments on related PRs about the revert
- **Detailed documentation**: Provides comprehensive revert information

## How It Prevents Duplicate Commits

### The Old Problem

```
Timeline:
1. Developer A creates feature-a from main (commit A→B→C)
2. Developer A adds commits D, E
3. Developer A's PR is squash merged to dmz as commit F
4. Main is fast-forwarded to include F
5. Developer B created feature-b from main at step 1 (has A→B→C)
6. Developer B's PR shows commits D, E, G, H ❌
   - D and E are from Developer A
   - G and H are from Developer B
   - GitHub doesn't know D and E were squashed into F
```

### The New Solution

```
Timeline:
1. Developer A creates feature-a from main (commit A→B→C)
2. Developer A adds commits D, E
3. Developer A's PR validation checks: based on latest main? ✅
4. PR is squash merged to dmz as commit F
5. Main is fast-forwarded to include F
6. Developer B created feature-b from main at step 1 (has A→B→C)
7. Developer B's PR validation checks: based on latest main? ❌
8. PR is REJECTED with clear instructions
9. Developer B rebases: git rebase origin/main
10. Now Developer B's branch has A→B→C→F→G→H
11. Developer B's PR validation checks: based on latest main? ✅
12. Developer B's PR shows only commits G, H ✅
```

## Developer Workflow

### 1. Create a Feature Branch

**Always create feature branches from the latest `main`:**

```bash
# Ensure you have the latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/my-feature
```

### 2. Work on Your Feature

Make your commits as usual:

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### 3. Create a Pull Request to `dmz`

1. Go to GitHub and create a PR
2. **Important**: Set the base branch to `dmz` (not `main`)
3. The PR validation workflow will automatically check:
   - ✅ Your branch is based on the latest `main`
   - ✅ No merge conflicts with `dmz`
   - ✅ Linting passes
   - ✅ Formatting is correct
   - ✅ TypeScript type checking passes
   - ✅ All starters build successfully
   - ✅ All tests pass

### 4. If Validation Fails: "Not Based on Latest Main"

If you see this error, it means `main` was updated after you created your branch. Fix it:

```bash
# Fetch the latest main
git fetch origin main

# Rebase your branch onto the latest main
git checkout feature/my-feature
git rebase origin/main

# If there are conflicts, resolve them, then:
git add .
git rebase --continue

# Force push (use --force-with-lease for safety)
git push --force-with-lease origin feature/my-feature
```

### 5. Merge to `dmz` (Reviewers Only)

Once approved, reviewers will:
1. **Use "Squash and merge"** (this is required)
2. Ensure the squash commit message is descriptive
3. Delete the feature branch after merging

### 6. Automatic Validation and Fast-Forward

After merging to `dmz`:
1. The DMZ validation workflow runs as a **final gate** (double-checks everything)
2. If validation passes: `main` is automatically fast-forwarded to `dmz`
3. If validation fails: `dmz` can be rebased to remove the problematic commits

**Note**: Since PR validation already checked everything, dmz validation should almost always pass. This is a safety net in case something changes between PR approval and merge.

### 7. Keep Your Branches Updated

If you have a long-running feature branch, regularly update it:

```bash
# Fetch the latest main
git fetch origin main

# Rebase your branch
git checkout feature/my-feature
git rebase origin/main
git push --force-with-lease origin feature/my-feature
```

## Common Issues and Solutions

### Issue: "Previous commits showing in my PR"

**Cause**: Your branch was created from an outdated `main` before other PRs were merged.

**Solution**: Rebase your branch onto the latest `main` (see Step 4 above).

### Issue: "Merge conflicts with dmz"

**Cause**: Another PR changed the same files you're working on.

**Solution**:
```bash
git fetch origin main
git rebase origin/main
# Resolve conflicts
git add .
git rebase --continue
git push --force-with-lease origin feature/my-feature
```

### Issue: "My PR includes commits from other PRs"

**Cause**: You created your branch from `dmz` or another feature branch instead of `main`.

**Solution**: Create a new branch from `main` and cherry-pick your commits:
```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature-fixed

# Cherry-pick only YOUR commits
git cherry-pick <commit-hash-1> <commit-hash-2>
git push origin feature/my-feature-fixed
```

## Security Requirements

### Required Branch Protection Rules

To ensure the DMZ workflow provides maximum security, the following branch protection rules **MUST** be configured:

#### For `main` branch:

- **Require Status Checks**: DISABLED (we use fast-forward, not PRs)
- **Restrict Push Access**: ENABLED
  - Add: `github-actions[bot]` (allows CI to fast-forward)
  - Optionally add: Repository admins (for emergency fixes)
- **Require Linear History**: ENABLED (prevents merge commits)
- **Do Not Allow Force Pushes**: ENABLED (protects history)
- **Allow Deletions**: DISABLED

#### For `dmz` branch:

- **Require Pull Request Before Merging**: ENABLED
  - **Require Approvals**: ENABLED (at least 1 approval recommended)
  - **Dismiss Stale Pull Request Approvals**: ENABLED
- **Require Status Checks**: ENABLED
  - Required checks:
    - ✅ `Validate PR Base Branch` (from pr-validation.yml)
    - ✅ `Validate PR Code Quality` (from pr-validation.yml)
- **Merge Strategy**:
  - **Allow Squash Merging**: ENABLED (required for DMZ workflow)
  - **Allow Merge Commits**: DISABLED (enforces squash only)
  - **Allow Rebase Merging**: DISABLED (enforces squash only)
- **Require Linear History**: ENABLED
- **Do Not Allow Force Pushes**: ENABLED
  - Exception: Allow repository admins to force push (for rebasing out bad commits)

### Configuration Steps

1. **Go to Repository Settings** > Branches
2. **Add rule** for `main` branch
3. **Add rule** for `dmz` branch
4. **Configure all settings** listed above
5. **Save changes**

⚠️ **Important**: Without these branch protection rules, the DMZ workflow can be bypassed by direct pushes to the main branch.

## Configuration

### Environment Variables

The workflows use the following environment variables:

- `NODE_VERSION`: Set to `22.11.0` (matches xmcloud.build.json)
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Starter Applications

The workflows automatically detect and validate these starter applications:

- `kit-nextjs-skate-park`
- `kit-nextjs-article-starter`
- `kit-nextjs-location-finder`
- `kit-nextjs-product-listing`

### Required npm Scripts

Each starter application should have these npm scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "build": "next build",
    "test": "jest"
  }
}
```

## Troubleshooting

### Common Issues

#### PR Validation Fails

**Linting Errors:**
```bash
# Fix linting issues
npm run lint -- --fix
```

**Formatting Issues:**
```bash
# Fix formatting
npm run format
```

**Type Errors:**
```bash
# Check TypeScript errors
npm run type-check
```

**Build Failures:**
- Check for missing dependencies
- Verify import paths
- Check for syntax errors

#### DMZ Validation Fails

1. **Check the workflow logs** for specific error details
2. **Fix issues** in the `dmz` branch
3. **Push fixes** to trigger re-validation
4. **Use revert workflow** if needed to remove problematic commits

#### Fast-Forward Issues

1. **Check if `dmz` is ahead** of `main`
2. **Verify validation passed** before fast-forward
3. **Fix validation failures** - no bypassing allowed
4. **Check for merge conflicts** in the logs

### Emergency Procedures

#### Immediate Rollback

1. **Use revert workflow** to remove problematic commits
2. **Specify the commit SHA** that caused issues
3. **Provide clear reason** for the revert
4. **Monitor the revert process**

#### Handling Validation Failures

1. **Fix the underlying issues** causing validation failures
2. **Push fixes to dmz branch** to trigger re-validation
3. **Use revert workflow** if commits need to be removed
4. **No bypassing allowed** - all tests must pass

## Best Practices

1. **Always branch from `main`**, never from `dmz` or other feature branches
2. **Keep feature branches short-lived** (merge within 1-2 days if possible)
3. **Rebase frequently** if you have a long-running branch
4. **Squash is mandatory** - don't use regular merge commits for PRs to `dmz`
5. **Clean up**: Delete feature branches after they're merged
6. **Communication**: Coordinate with team if working on overlapping areas

## Why This Workflow?

### Two-Tier Validation

This workflow uses **defense in depth** with two validation layers:

1. **PR Validation** (before merge to dmz):
   - Checks if branch is based on latest main
   - Runs lint, format, type-check, build, tests
   - Catches issues early, before they reach dmz
   - Provides fast feedback to developers

2. **DMZ Validation** (after merge to dmz, before fast-forward to main):
   - Double-checks everything again
   - Safety net in case something changes between PR approval and merge
   - Only fast-forwards to main if validation passes
   - Protects main from any issues that slip through

### Benefits

| Benefit | Description |
|---------|-------------|
| **No Duplicate Commits** | PRs only show new changes, not previous squashed commits |
| **Early Feedback** | Issues caught at PR time, not after merge |
| **Always Clean Main** | Two validation gates ensure main never breaks |
| **Fast-Forward Works** | Enforcing base branch makes fast-forward reliable |
| **Clean History** | Squash merge creates one commit per feature |
| **Safety Net** | Two tiers of validation catch issues before they reach main |
| **Clear Process** | Automated checks guide developers with clear messages |

### Why Squash and Merge?

- Creates a single commit per feature
- Clean, linear history on `main`
- Easy to revert entire features
- Removes "fix typo" and "address review comments" noise

### Why Fast-Forward?

- `main` and `dmz` share the same commit SHAs
- No merge commits cluttering history
- Easy to understand what's deployed
- Predictable git graph

## Testing the Solution

### 1. Test PR Validation - Happy Path

```bash
# Create branch from latest main
git checkout main
git pull origin main
git checkout -b test-feature

# Make a change
echo "test" >> README.md
git add README.md
git commit -m "test: happy path"
git push origin test-feature

# Create PR to dmz on GitHub
# Expected: ✅ All checks pass
```

### 2. Test PR Validation - Outdated Branch

```bash
# Create branch from old main
git checkout -b test-outdated <old-commit-hash>

# Make a change
echo "test" >> README.md
git add README.md
git commit -m "test: outdated branch"
git push origin test-outdated

# Create PR to dmz on GitHub
# Expected: ❌ "Not based on latest main" error

# Fix it
git fetch origin main
git rebase origin/main
git push --force-with-lease origin test-outdated

# Expected: ✅ Now checks pass
```

### 3. Test DMZ Validation

```bash
# After merging a PR to dmz
# Check Actions tab on GitHub
# Expected: ✅ DMZ validation passes and main is fast-forwarded
```




## Support

For questions or issues with the DMZ Git Flow:

1. **Check this documentation** for common solutions
2. **Review workflow logs** for specific error details
3. **Create an issue** with detailed information about the problem
4. **Contact the maintainers** for urgent issues

---

_This documentation is automatically updated with the workflow implementations._