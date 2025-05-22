                        ┌───────────────────────────────┐
                        │         Frontend (React)      │
                        │   - Dashboard                 │
                        │   - Auth Pages (JWT)          │
                        │   - Task Views                │
                        └─────────────┬─────────────────┘
                                      │ API Calls (REST)
                                      ▼
                        ┌───────────────────────────────┐
                        │  Backend (Node.js + Express)  │
                        │  - Auth Controller            │
                        │  - Task Controller            │
                        │  - Admin Controller           │
                        │  - Audit Logger Middleware    │
                        └─────────────┬─────────────────┘
                                      │ ORM/Query
                                      ▼
                        ┌───────────────────────────────┐
                        │          MySQL DB             │
                        │  - Users                      │
                        │  - Tasks                      │
                        │  - Audit Logs                 │
                        └───────────────────────────────┘
