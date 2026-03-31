#!/bin/bash
# Script to create a test contact in GoHighLevel using the v1 API
# Usage: myGHL_API_KEY=your_api_key ./create-test-contact.sh

set -euo pipefail

if [ -z "${myGHL_API_KEY:-}" ]; then
  echo "Error: myGHL_API_KEY environment variable is not set."
  echo "Usage: myGHL_API_KEY=your_api_key ./create-test-contact.sh"
  exit 1
fi

API_URL="https://rest.gohighlevel.com/v1/contacts/"

echo "Creating test contact in GoHighLevel..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Authorization: Bearer ${myGHL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Contact",
    "email": "testcontact@glaciersystems.example.com",
    "phone": "+15551234567",
    "tags": ["test", "api-created"],
    "source": "API Test"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "Success! (HTTP $HTTP_CODE)"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
  echo "Failed with HTTP $HTTP_CODE"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  exit 1
fi
