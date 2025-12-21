#!/bin/sh
set -e

# Default values for environment variables
API_BASE_URL="${API_BASE_URL:-http://pbuf.cloud}"
API_TOKEN="${API_TOKEN:-}"

# Export variables so envsubst can access them
export API_BASE_URL
export API_TOKEN

echo "Starting nginx with configuration:"
echo "  API_BASE_URL: $API_BASE_URL"
echo "  API_TOKEN: ${API_TOKEN:+***set***}"

# Create a temporary nginx config with environment variables substituted
envsubst '$API_BASE_URL $API_TOKEN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# If API_TOKEN is empty, comment out the Authorization header lines
if [ -z "$API_TOKEN" ]; then
    sed -i 's/proxy_set_header Authorization/# proxy_set_header Authorization/g' /etc/nginx/conf.d/default.conf
fi

# Test nginx configuration
nginx -t

# Start nginx
exec "$@"
