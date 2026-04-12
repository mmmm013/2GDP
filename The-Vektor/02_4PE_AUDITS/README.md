# 4PE Audits

Audit documentation for 4PE platform structure deployments.

## What Gets Audited

Each 4PE deployment (per industry) must satisfy the absolute component checklist:

| Component | Present? | Notes |
|---|---|---|
| STI (Standard Template Item) | required | One or more slots per deployment |
| STI-Slot (container) | required | Each STI must have at least one STI-Slot |
| BTI (Branded Template Item) | required | At least one BTI filling an STI-Slot |
| KKr (per industry) | required | Industry-specific KKr instance wired to generic 4PE model |

Adaptability audit: confirm BTI content + KKr config is industry-specific while STI/STI-Slot structure remains generic.
