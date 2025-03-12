#!/bin/sh
set -e

# Create the public directory if it doesn't exist
mkdir -p /app/public

# Generate the env.js file with all NEXT_PUBLIC_ variables
echo "// Runtime environment variables" > /app/public/env.js
echo "window.__ENV = {" >> /app/public/env.js
env | grep "^NEXT_PUBLIC_" | while IFS='=' read -r key value; do
    # Escape any double quotes in the value
    escaped_value=$(printf '%s\n' "$value" | sed 's/"/\\"/g')
    echo "  \"$key\": \"$escaped_value\"," >> /app/public/env.js
done
echo "};" >> /app/public/env.js

echo "Generated runtime environment variables in /app/public/env.js" 