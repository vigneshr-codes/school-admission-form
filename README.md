# School Admission Form

A modern, responsive, and user-friendly school admission form built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **SQLite**.

## Live Application

🚀 **Currently running at: http://localhost:3000**

## Overview

Complete online admission form for schools with 6 comprehensive sections collecting student information, parent/guardian details, academic history, and more. Features responsive design, real-time validation, and database storage.

## Quick Start

### 1. View the Form
```bash
# Already running! Just open your browser
http://localhost:3000
```

### 2. View Database Submissions
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### 3. Restart Server (if needed)
```bash
npm run dev
```

## Features

### Complete Form Sections

1. **Basic Information** - Branch, purpose, academic year
2. **Student Personal Details** - Name, DOB, Aadhaar, caste, address
3. **Academic Details** - Standards, previous school, re-admission
4. **Sibling Details** - Dynamic list of siblings
5. **Parent/Guardian Details** - Father, mother, guardian, emergency contact
6. **Transport & Medical** - Transport needs, medical history, vaccination

### Key Features

- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Smart Validation** - Aadhaar (12 digits), Mobile (10 digits), Email
- ✅ **Conditional Fields** - Show/hide based on selections
- ✅ **Real-time Feedback** - Instant error messages
- ✅ **Success Notifications** - Toast messages
- ✅ **Database Storage** - SQLite with Prisma

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **SQLite Database**
- **React Hook Form + Zod**
- **Sonner** (Toast notifications)

## Project Structure

```
app/
├── actions/admission.ts          # Form submission
├── components/AdmissionForm.tsx  # Main form
├── lib/prisma.ts                 # Database client
└── page.tsx                      # Home page

prisma/
├── schema.prisma                 # Database schema
└── dev.db                        # SQLite database
```

## Testing

Fill out the form with sample data:
- Aadhaar: `123456789012` (12 digits)
- Mobile: `9876543210` (10 digits)
- Try adding siblings
- Enable transport to see conditional fields
- Check re-admission checkbox

## Documentation

- **QUICK_START.md** - Quick start guide
- **PROJECT_INFO.md** - Detailed technical docs
- **README.md** - This file

## Customization

### Modify Form
Edit: `app/components/AdmissionForm.tsx`

### Update Database
```bash
# Edit prisma/schema.prisma, then run:
npx prisma migrate dev --name your_change
```

### Change Styling
Update Tailwind classes in components

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Auto-deployed!

**Note**: For production, migrate to PostgreSQL (SQLite is file-based)

## Support

Check the documentation files for detailed information:
- Technical details: `PROJECT_INFO.md`
- Quick guide: `QUICK_START.md`

---

**Status**: ✅ Ready to use
**URL**: http://localhost:3000
**Database**: http://localhost:5555 (Prisma Studio)
