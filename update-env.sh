#!/bin/sh
set -e

# Directory containing the built Next.js files
NEXT_DIR="/app/.next"

echo "Updating environment variables in .next directory..."

# Find all files in .next that might contain environment variables
find "$NEXT_DIR" -type f \( -name "*.js" -o -name "*.html" -o -name "*.json" \) -print0 | while IFS= read -r -d '' file; do
    # Get all NEXT_PUBLIC_ environment variables
    env | grep "^NEXT_PUBLIC_" | while IFS='=' read -r key value; do
        # Escape special characters in the value for sed
        escaped_value=$(printf '%s\n' "$value" | sed -e 's/[\/&]/\\&/g')
        
        # Replace both quoted and unquoted values
        # Handle double-quoted values
        sed -i "s/\"$key\":\"[^\"]*\"/\"$key\":\"$escaped_value\"/g" "$file" 2>/dev/null || true
        sed -i "s/\"$key\": \"[^\"]*\"/\"$key\": \"$escaped_value\"/g" "$file" 2>/dev/null || true
        
        # Handle single-quoted values
        sed -i "s/'$key':'[^']*'/'$key':'$escaped_value'/g" "$file" 2>/dev/null || true
        sed -i "s/'$key': '[^']*'/'$key': '$escaped_value'/g" "$file" 2>/dev/null || true
        
        # Handle process.env references
        sed -i "s/process.env.$key\s*||[^,;]*/process.env.$key || \"$escaped_value\"/g" "$file" 2>/dev/null || true
        
        echo "Updated $key in $file"
    done
done

echo "Environment variable update complete!" 