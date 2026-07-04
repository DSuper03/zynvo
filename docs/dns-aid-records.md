# DNS-AID Records For `zynvosocial.com`

These records must be published at the DNS provider for `zynvosocial.com`.
They cannot be deployed from the Next.js application itself.

## Example records

Use ServiceMode `SVCB`/`HTTPS` records under the `_agents` namespace:

```dns
_index._agents.zynvosocial.com. 3600 IN HTTPS 1 zynvosocial.com. alpn="h2,h3"
_a2a._agents.zynvosocial.com.   3600 IN HTTPS 1 zynvosocial.com. alpn="a2a,h2,h3"
```

If your DNS provider does not yet support named custom SvcParamKeys for DNS-AID,
use experimental numeric `keyNNNNN` parameters as required by the draft.

## DNSSEC

Enable DNSSEC signing for the public zone so validating resolvers can return
authenticated DNS-AID responses.

## Validation

After publishing the records, validate with:

- `https://isitagentready.com/`
- a DNS-over-HTTPS query against Cloudflare or Google Public DNS

## Notes

- Keep the target host aligned with the canonical public HTTPS origin.
- Publish records only in the public DNS zone you control.
- Do not put secrets into DNS records.
