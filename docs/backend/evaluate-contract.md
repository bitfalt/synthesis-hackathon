# BE-1 Evaluate Contract

This file is the handoff contract for FE-1.

## Endpoint

### `POST /api/evaluate/demo`

This is the minimum stable backend route FE-1 should call.

## Request body

```json
{
  "treasuryPolicy": "18 month runway minimum. Review any transfer above 400 ETH. Block bridge destinations.",
  "treasuryState": "Current stable reserve runway is 20 months. ETH concentration is 32%.",
  "proposedAction": "Move 450 ETH into a bridge liquidity program to expand market making."
}
```

## Response body

```json
{
  "decision": "WARN",
  "confidence": "medium",
  "triggeredChecks": [
    {
      "name": "Runway Preservation",
      "result": "pass",
      "detail": "Stable reserve runway compared against minimum policy threshold."
    },
    {
      "name": "Single Transfer Threshold",
      "result": "review",
      "detail": "Transfer amount compared against manual review threshold."
    }
  ],
  "privateRationale": "...",
  "publicSummary": "...",
  "receipt": {
    "receiptId": null,
    "hash": null,
    "urls": {
      "receiptJson": null,
      "agentJson": null,
      "agentLog": null
    }
  }
}
```

## FE-1 expectations

The frontend should assume:
- `decision` is already determined by deterministic guardrail logic
- `confidence`, `privateRationale`, and `publicSummary` are reasoning-layer outputs
- `triggeredChecks` is stable enough to render directly
- `receipt` fields may be null in BE-1 and become richer in BE-2+

## Important rule

Do not redesign the response shape in FE-1.
Use this file as the source of truth.
