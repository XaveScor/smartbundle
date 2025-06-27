#!/bin/sh
set -e

echo "=== Gitignore Plugin E2E Test ==="

# Phase 1: Verify all built files exist with correct content
echo "Phase 1: Verifying built files"

cd /test-lib

# Check .gitignore exists and has correct content
if [ ! -f ".gitignore" ]; then
    echo "❌ .gitignore file missing"
    exit 1
fi

GITIGNORE_CONTENT=$(cat .gitignore)
if [ "$GITIGNORE_CONTENT" != "*" ]; then
    echo "❌ .gitignore content incorrect"
    exit 1
fi
echo "✓ .gitignore contains '*'"

# Check .npmignore exists and is empty
if [ ! -f ".npmignore" ]; then
    echo "❌ .npmignore file missing"
    exit 1
fi

NPMIGNORE_SIZE=$(wc -c < .npmignore)
if [ "$NPMIGNORE_SIZE" -ne 0 ]; then
    echo "❌ .npmignore not empty"
    exit 1
fi
echo "✓ .npmignore is empty"

# Phase 2: Test git behavior
echo "Phase 2: Testing git behavior"

git init --quiet
git config user.email "test@example.com"
git config user.name "Test User"

# Try to add all files - .gitignore should prevent tracking
git add . 2>/dev/null || true
TRACKED_FILES=$(git status --porcelain | wc -l)

if [ "$TRACKED_FILES" -ne 0 ]; then
    echo "❌ Git tracking files despite .gitignore"
    exit 1
fi
echo "✓ Git ignores all files"

# Phase 3: Test pnpm pack behavior
echo "Phase 3: Testing pnpm pack"

pnpm pack --silent > /dev/null 2>&1
TARBALL=$(ls *.tgz | head -n1)

if [ -z "$TARBALL" ]; then
    echo "❌ pnpm pack failed"
    exit 1
fi
echo "✓ pnpm pack created tarball"

# Phase 4: Compare built files vs tarball contents
echo "Phase 4: Comparing files"

# Extract tarball file list (remove package/ prefix and sort)
tar -tzf "$TARBALL" | sed 's|^package/||' | grep -v '^$' | sort > tarball_files.txt

# Get built file list (exclude .gitignore, .npmignore, tarball and temp files, then sort)
# Also exclude any git-related files and hidden directories
find . -type f ! -name ".gitignore" ! -name ".npmignore" ! -name "*.tgz" ! -name "tarball_files.txt" ! -name "built_files.txt" ! -path "./.git/*" ! -path "./.*/*" | sed 's|^\./||' | sort > built_files.txt

# Compare file lists
if ! diff -q built_files.txt tarball_files.txt > /dev/null; then
    echo "❌ Tarball contents differ from built files"
    echo "Built files:"
    cat built_files.txt
    echo "Tarball files:"
    cat tarball_files.txt
    exit 1
fi

echo "✓ Essential files verified"

echo "=== All tests passed! ==="
echo "✓ .gitignore ignores all files from git"
echo "✓ .npmignore allows all files for npm packaging"
echo "✓ Tarball matches built files exactly"
