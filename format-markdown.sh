#!/bin/bash

# <MarkdownFormatterScriptSnippet>
# This script helps you format and clean up markdown files
# It makes your documentation look neat and consistent

echo "🔧 Markdown Formatter Tool"
echo "=========================="
echo ""

# Show menu options to the user
echo "Choose what you want to do:"
echo "1) Format all markdown files (makes them look nice)"
echo "2) Check for markdown issues (finds problems)"
echo "3) Fix markdown issues and format (does both)"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📝 Formatting all markdown files..."
    # This makes all markdown files look consistent
    npx prettier --write "**/*.md" --ignore-path .gitignore
    echo "✅ Done! Your markdown files are now formatted."
    ;;
  2)
    echo ""
    echo "🔍 Checking for markdown issues..."
    # This finds any problems in your markdown files
    npx markdownlint "**/*.md" --ignore node_modules
    echo "✅ Check complete!"
    ;;
  3)
    echo ""
    echo "🔧 Fixing issues and formatting..."
    # First fix any problems
    npx markdownlint "**/*.md" --ignore node_modules --fix
    # Then make everything look nice
    npx prettier --write "**/*.md" --ignore-path .gitignore
    echo "✅ All done! Your markdown files are clean and formatted."
    ;;
  *)
    echo "Invalid choice. Please run the script again and choose 1, 2, or 3."
    ;;
esac
# </MarkdownFormatterScriptSnippet>