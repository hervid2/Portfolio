# Roles and permissions

## Roles
| Role | Description | Data scope (which records they can see) |
|---|---|---|
| Visitor | Any anonymous person or bot browsing the site | All public content; never contact messages |
| Owner (operator) | Hernán, operating the API and database outside the app | Contact messages, through database access only (no admin UI) |

## Permission matrix
| Resource / action | Visitor | Owner |
|---|---|---|
| Public content (projects, case studies, maps, CV link): view | ✅ | ✅ |
| Contact message: create | ✅ (rate-limited, CAPTCHA) | ✅ |
| Contact message: view / delete | ❌ | ✅ (DB access, outside the app) |
| Site content: edit | ❌ | ✅ (via git + deploy) |

## Segregation of duties and auditing
- Actions that require dual approval: N/A — single-owner project.
- Actions that generate an audit log entry: contact message creation stores `submittedAt`, `sourceIp` and `userAgent`. No other auditing applies (N/A — no authenticated users).
