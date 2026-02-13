#!/bin/sh
set -e

# Default values for environment variables
API_BASE_URL="${API_BASE_URL:-http://pbuf.cloud}"
API_TOKEN="${API_TOKEN:-}"
PUBLIC_ENABLED="${PUBLIC_ENABLED:-}"

# Normalize API_TOKEN: we always build the header as `Bearer ${API_TOKEN}` in nginx.
if [ -n "$API_TOKEN" ]; then
    API_TOKEN="$(echo "$API_TOKEN" | sed -E 's/^[Bb]earer[[:space:]]+//')"
fi

# Export variables so envsubst can access them
export API_BASE_URL
export API_TOKEN
export PUBLIC_ENABLED

echo "Starting nginx with configuration:"
echo "  API_BASE_URL: $API_BASE_URL"
echo "  API_TOKEN: ${API_TOKEN:+***set***}"
echo "  PUBLIC_ENABLED: ${PUBLIC_ENABLED:+***set***}"

# Create a temporary nginx config with environment variables substituted
envsubst '$API_BASE_URL $API_TOKEN $PUBLIC_ENABLED' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Generate runtime app config for the browser
if [ -f /usr/share/nginx/html/config.template.js ]; then
    envsubst '$PUBLIC_ENABLED' < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
fi

# Test nginx configuration
nginx -t

# Start nginx
exec "$@"
