# 🛡️ Security & Privacy Architecture

## Security Controls
1. **Authentication & Password Security**:
   - Passwords hashed using `bcryptjs` with salt work factor 12.
   - JWT tokens signed with expiration and secret keys stored in environment variables.
2. **Role-Based Access Control (RBAC)**:
   - Strict middleware checks for `farmer`, `student`, `expert`, and `admin` scopes.
   - Admin-only guard on destructive operations (`POST /schemes`, `POST /knowledge`, user verification).
3. **Data Protection & Rate Limiting**:
   - `helmet` security headers applied on all API endpoints.
   - `express-rate-limit` prevents brute force and DDoS on authentication routes.
   - Multi-part file upload sanitization and MIME-type verification (JPEG/PNG only for vision).
4. **Environment Isolation**:
   - `.env` files excluded via `.gitignore`.
   - `.env.example` templates provided with placeholder keys.
