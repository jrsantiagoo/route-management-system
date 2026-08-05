# QA Deliverables

QA documentation for the Route Management System. Jira: everything is tracked under epic
[RMS-39 "QA & Testing"](https://route-management-system.atlassian.net/browse/RMS-39).

| Document | Deliverable | Jira |
| --- | --- | --- |
| [test-scripts.md](test-scripts.md) | Test Documents — revised manual test scripts 01–09 | RMS-70 |
| [test-db.md](test-db.md) | Test Documents — canonical test data set | RMS-70 |
| [test-classes.md](test-classes.md) | Test Documents — automated test inventory (unit / integration / e2e) | RMS-70 |
| [traceability-matrix.md](traceability-matrix.md) | Test Documents — requirement → case → test → defect | RMS-70 |
| [sw-design-defect-report.md](sw-design-defect-report.md) | SW Design Defect Report (DD-01…DD-08) | RMS-68 |
| [bug-report.md](bug-report.md) | Bug Report (BR-01…BR-03, plus template) | RMS-69 |

## Running the automated tests

```bash
# from the repo root
npm run test:server        # all server tests (unit + integration)
npm run test:client        # client lib unit tests (Vitest)
npm run test:unit          # server unit tests only
npm run test:integration   # server integration tests only
npm run test:e2e           # Playwright e2e suite (boots server + client)
```

Test tiers and conventions are documented in [test-classes.md](test-classes.md).
