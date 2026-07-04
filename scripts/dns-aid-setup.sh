#!/usr/bin/env bash
# =============================================================================
# DNS-AID Setup Script — DNS for AI Discovery (draft-mozleywilliams-dnsop-dnsaid)
# Domain: zynvosocial.com
# Provider: BigRock (dns1-4.bigrock.in)
#
# Usage:
#   1. Log in to your BigRock DNS management console
#   2. Add the SVCB records below. If BigRock does not support SVCB (type 65),
#      add TXT-record equivalents as shown.
#   3. Enable DNSSEC on the zone for authenticated data (AD flag).
#
# References:
#   - https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
#   - https://www.rfc-editor.org/rfc/rfc9460 (SVCB/HTTPS)
#   - https://www.dns-aid.org/
# =============================================================================

echo "=== DNS-AID Records for zynvosocial.com ==="
echo ""

# -----------------------------------------------------------------------------
# 1. Agent Index — Well-known entrypoint for organisational agent discovery
#    SVCB ServiceMode record pointing at the gateway that serves the index.
#    The 'well-known' SvcParamKey names the RFC 8615 path.
# -----------------------------------------------------------------------------
echo "[Record 1] _index._agents.zynvosocial.com — SVCB"
cat << 'EOF'
Type:     SVCB (65)
Name:     _index._agents.zynvosocial.com
TTL:      3600
Priority: 1
Target:   zynvosocial.com
Params:   alpn="h2,h3" port=443 well-known="/.well-known/agent-index.json"
EOF
echo "  ➤  dig SVCB _index._agents.zynvosocial.com @8.8.8.8"
echo ""

# -----------------------------------------------------------------------------
# 2. AI Assistant Agent — Agent-to-Agent (A2A) endpoint
#    Advertises the AI agent using the legacy underscore naming for
#    backward-compatible discovery.
# -----------------------------------------------------------------------------
echo "[Record 2] _ai._a2a._agents.zynvosocial.com — SVCB"
cat << 'EOF'
Type:     SVCB (65)
Name:     _ai._a2a._agents.zynvosocial.com
TTL:      3600
Priority: 1
Target:   zynvosocial.com
Params:   alpn="h2,h3" port=443 bap="a2a=1.0" well-known="/.well-known/agent-card.json"
EOF
echo "  ➤  dig SVCB _ai._a2a._agents.zynvosocial.com @8.8.8.8"
echo ""

# -----------------------------------------------------------------------------
# 3. TXT Fallbacks (if BigRock does not support SVCB records)
#    DNS-AID specifies that TXT records may be used as a fallback when
#    the authoritative server does not support SVCB.  These encode the
#    same discovery information in a flat key-value format.
# -----------------------------------------------------------------------------
echo "[Fallback] TXT records (if SVCB not supported)"
cat << 'EOF'
Type:     TXT
Name:     _index._agents.zynvosocial.com
TTL:      3600
Value:    "agent-index=https://zynvosocial.com/.well-known/agent-index.json alpn=h2,h3 port=443"

Type:     TXT
Name:     _ai._a2a._agents.zynvosocial.com
TTL:      3600
Value:    "agent=ai endpoint=https://zynvosocial.com/api/ai protocol=a2a version=1.0 alpn=h2,h3 port=443 cap=https://zynvosocial.com/.well-known/agent-card.json"
EOF
echo "  ➤  dig TXT _index._agents.zynvosocial.com @8.8.8.8"
echo ""

# -----------------------------------------------------------------------------
# 4. DNSSEC
#    BigRock supports DNSSEC.  Enable DNSSEC signing on the
#    zynvosocial.com zone so resolvers can validate the DNS-AID
#    records (returns the AD bit in responses).
# -----------------------------------------------------------------------------
echo "[DNSSEC] Enable DNSSEC on the zynvosocial.com zone"
cat << 'EOF'
Action:  In BigRock DNS console, navigate to "DNSSEC Settings"
         and enable DNSSEC signing.  Publish the DS record to the
         parent zone (.com TLD) if required.
Verify:  dig zynvosocial.com DNSKEY @8.8.8.8 +multiline
         -> Should return RRSIG records alongside the answer.
EOF
echo ""

# -----------------------------------------------------------------------------
# 5. Verification
#    Run these checks after adding the records to confirm they resolve.
# -----------------------------------------------------------------------------
echo "=== Verification Commands ==="
echo ""
echo "# Check SVCB records (via Google DNS):"
echo "dig SVCB _index._agents.zynvosocial.com @8.8.8.8 +short"
echo "dig SVCB _ai._a2a._agents.zynvosocial.com @8.8.8.8 +short"
echo ""
echo "# Check TXT fallbacks:"
echo "dig TXT _index._agents.zynvosocial.com @8.8.8.8 +short"
echo "dig TXT _ai._a2a._agents.zynvosocial.com @8.8.8.8 +short"
echo ""
echo "# Check DNSSEC:"
echo "dig zynvosocial.com DNSKEY @8.8.8.8 +multiline"
echo "dig _index._agents.zynvosocial.com SVCB @8.8.8.8 +dnssec +multiline"
echo ""
echo "=== End ==="
