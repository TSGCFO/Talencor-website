# Markdown Formatting Guide

## Overview

Your project now has professional markdown formatting tools installed to help
you write and maintain clean, consistent documentation.

## Installed Tools

1. **Prettier** - Automatically formats markdown files for consistent style
2. **Markdownlint** - Checks for common markdown issues and can auto-fix them

## How to Use

### Quick Format Script

Run the formatting script in the terminal:

```bash
./format-markdown.sh
```

This gives you three options:

1. **Format all markdown files** - Makes your docs look consistent
2. **Check for issues** - Finds problems without changing anything
3. **Fix and format** - Fixes issues AND formats everything

### Manual Commands

You can also run commands directly:

```bash
# Format all markdown files
npx prettier --write "**/*.md"

# Check for markdown issues
npx markdownlint "**/*.md" --ignore node_modules

# Fix markdown issues automatically
npx markdownlint "**/*.md" --ignore node_modules --fix
```

## Configuration Files

- **.prettierrc** - Controls how Prettier formats your markdown
  - Line width: 80 characters for markdown (100 for code)
  - Prose wrap: Always (wraps long lines automatically)
- **.markdownlint.json** - Controls markdown linting rules
  - Allows inline HTML
  - Enforces consistent heading styles
  - Sets reasonable line length limits

## Benefits

✅ **Consistent formatting** across all documentation  
✅ **Automatic line wrapping** for better readability  
✅ **Error detection** for common markdown mistakes  
✅ **One-command cleanup** of all markdown files

## Tips for Writing Markdown

1. **Use the formatter regularly** - Run it before committing changes
2. **Let Prettier handle line breaks** - Just write naturally
3. **Preview your changes** - Use the Replit markdown preview
4. **Keep it simple** - The tools handle the formatting details

## Examples

### Before Formatting

```markdown
# My Document

This is a really long line that goes on and on and doesn't wrap properly making
it hard to read in the editor and causing horizontal scrolling issues.

- Inconsistent spacing
- Mixed bullet styles
```

### After Formatting

```markdown
# My Document

This is a really long line that goes on and on and doesn't wrap properly making
it hard to read in the editor and causing horizontal scrolling issues.

- Inconsistent spacing
- Mixed bullet styles
```

## Need Help?

Just run `./format-markdown.sh` and choose option 3 to automatically fix and
format all your markdown files!
