# SDM (Studio, Dress, Makeup)

Wedding preparation platform for simulating wedding photos and matching vendors.

## Features

- **Vendor Browsing**: Browse studios, dress shops, and makeup artists
- **Wedding Simulator**: 4-step photo simulation wizard
- **User Authentication**: Login and registration

## Tech Stack

| Frontend (`apps/web`) | Backend (`apps/api`) |
|----------------------|---------------------|
| Next.js 15, TypeScript | NestJS 10, TypeScript |
| Tailwind CSS, Motion | Prisma, PostgreSQL |
| Zustand, React Hook Form | BullMQ, Socket.io |

## Run Commands

```bash
# Frontend (apps/web)
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Backend (apps/api)
pnpm dev              # Start with watch mode
pnpm start            # Start server
pnpm prisma:seed      # Seed database
```

### Vendor Registration Link Example
 - http://localhost:3000/vendor-register?token=faae9c23fb5f1b25a041b0b1590e0d745d28900eb669b6050e2739ffa6308303