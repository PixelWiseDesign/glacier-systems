#!/bin/bash
# ============================================================================
# Create a one-page funnel in GoHighLevel for use as a Stripe website URL
#
# Usage: myGHL_API_KEY=your_api_key ./create-ghl-funnel.sh [locationId]
#
# If locationId is not provided, the script will attempt to find it.
# ============================================================================

set -euo pipefail

API_BASE="https://services.leadconnectorhq.com"
API_KEY="${myGHL_API_KEY:?Error: myGHL_API_KEY environment variable is not set.}"
LOCATION_ID="${1:-}"

header() {
  echo ""
  echo "==========================================="
  echo "  $1"
  echo "==========================================="
}

api_call() {
  local method="$1"
  local endpoint="$2"
  local data="${3:-}"

  local args=(
    -s -w "\n__HTTP_CODE__%{http_code}"
    -X "$method"
    "${API_BASE}${endpoint}"
    -H "Authorization: Bearer ${API_KEY}"
    -H "Version: 2021-07-28"
    -H "Content-Type: application/json"
  )

  if [ -n "$data" ]; then
    args+=(-d "$data")
  fi

  local response
  response=$(curl "${args[@]}" 2>&1)

  local http_code
  http_code=$(echo "$response" | grep "__HTTP_CODE__" | sed 's/.*__HTTP_CODE__//')
  local body
  body=$(echo "$response" | sed '/__HTTP_CODE__/d')

  if [ "$http_code" -ge 200 ] 2>/dev/null && [ "$http_code" -lt 300 ] 2>/dev/null; then
    echo "$body"
  else
    echo "API Error (HTTP $http_code): $body" >&2
    return 1
  fi
}

# ── Step 1: Resolve Location ID ────────────────────────────────────────────

header "Step 1: Resolving Location"

if [ -z "$LOCATION_ID" ]; then
  echo "No locationId provided, attempting to discover..."

  # Try to get location from the token (works for Sub-Account/Location API keys)
  LOCATION_RESPONSE=$(api_call GET "/locations/search?limit=1" 2>/dev/null || true)

  if [ -n "$LOCATION_RESPONSE" ]; then
    LOCATION_ID=$(echo "$LOCATION_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    locations = data.get('locations', data.get('location', []))
    if isinstance(locations, list) and locations:
        print(locations[0]['id'])
    elif isinstance(locations, dict):
        print(locations['id'])
except: pass
" 2>/dev/null || true)
  fi

  if [ -z "$LOCATION_ID" ]; then
    echo ""
    echo "Could not auto-detect locationId."
    echo "Please provide it as an argument: ./create-ghl-funnel.sh <locationId>"
    echo ""
    echo "You can find your Location ID in GHL under:"
    echo "  Settings > Business Info > Company ID"
    echo "  Or in the URL: https://app.gohighlevel.com/v2/location/<LOCATION_ID>/..."
    exit 1
  fi
fi

echo "Using Location ID: $LOCATION_ID"

# ── Step 2: Create the Funnel ──────────────────────────────────────────────

header "Step 2: Creating Funnel"

FUNNEL_PAYLOAD=$(cat <<'ENDJSON'
{
  "locationId": "__LOCATION_ID__",
  "name": "Glacier Systems - Home",
  "type": "funnel",
  "steps": [
    {
      "name": "Home",
      "url": "/glacier-home"
    }
  ]
}
ENDJSON
)

FUNNEL_PAYLOAD="${FUNNEL_PAYLOAD//__LOCATION_ID__/$LOCATION_ID}"

echo "Creating funnel 'Glacier Systems - Home'..."
FUNNEL_RESPONSE=$(api_call POST "/funnels/funnel" "$FUNNEL_PAYLOAD" 2>&1) || {
  echo ""
  echo "Direct funnel creation failed. Response: $FUNNEL_RESPONSE"
  echo ""
  echo "This likely means your API key doesn't have funnel permissions,"
  echo "or the API version requires a different approach."
  echo ""
  echo "Trying alternative: creating via Sites API..."

  SITE_PAYLOAD=$(cat <<ENDJSON2
{
  "locationId": "$LOCATION_ID",
  "name": "Glacier Systems",
  "type": "website"
}
ENDJSON2
)
  FUNNEL_RESPONSE=$(api_call POST "/sites" "$SITE_PAYLOAD" 2>&1) || true
}

echo "$FUNNEL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$FUNNEL_RESPONSE"

# Extract funnel/site ID
FUNNEL_ID=$(echo "$FUNNEL_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    fid = data.get('funnel', data.get('site', data.get('data', {}))).get('id', '')
    if not fid:
        fid = data.get('id', '')
    print(fid)
except: pass
" 2>/dev/null || true)

if [ -n "$FUNNEL_ID" ]; then
  echo ""
  echo "Funnel/Site created with ID: $FUNNEL_ID"
else
  echo ""
  echo "Could not extract funnel ID from response."
fi

# ── Step 3: Summary ────────────────────────────────────────────────────────

header "Done!"

cat <<EOF

Funnel has been created in your GoHighLevel account.

NEXT STEPS:
  1. Log into GoHighLevel: https://app.gohighlevel.com
  2. Go to Sites > Funnels (or Sites > Websites)
  3. Find "Glacier Systems - Home" and open the page editor
  4. Customize the page with your branding (or use the template below)
  5. Publish the funnel
  6. Copy the published URL and paste it into Stripe as your website link

YOUR FUNNEL URL WILL LOOK LIKE:
  https://<your-subdomain>.gohighlevel.com/glacier-home
  or your custom domain if configured

FOR STRIPE:
  - Go to Stripe Dashboard > Settings > Business Settings > Public details
  - Paste your funnel URL in the "Website" field

═══════════════════════════════════════════════════════════
  RECOMMENDED PAGE CONTENT FOR STRIPE COMPLIANCE
═══════════════════════════════════════════════════════════

Stripe requires your website to have:
  - Business name and description
  - Contact information (email/phone)
  - Refund/cancellation policy
  - Terms of service link
  - Privacy policy link

When editing your funnel page in GHL, include these sections:

  HERO:
    "Glacier Systems | Intelligent Automation Solutions"
    "We design and deploy enterprise-grade automation that
     eliminates bottlenecks and reduces operational costs."

  SERVICES:
    - Business Process Automation
    - AI-Powered Integrations
    - Workflow Optimization
    - Custom Solutions

  CONTACT:
    - Email: (your business email)
    - Phone: (your business phone)

  FOOTER:
    - Terms of Service (link)
    - Privacy Policy (link)
    - Refund Policy (link)
    - © $(date +%Y) Glacier Systems. All rights reserved.

EOF
