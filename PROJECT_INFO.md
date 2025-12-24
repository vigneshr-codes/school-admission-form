# School Admission Form - Project Information

## Overview

A modern, responsive school admission form built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite. The form collects comprehensive student information including personal details, academic history, parent/guardian information, and more.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Form Management**: React Hook Form with Zod validation
- **UI Components**: Sonner (toast notifications), Lucide React (icons)
- **Date Handling**: React DatePicker

## Features

### Comprehensive Form Sections

1. **Basic Information**
   - School Branch (T. Pudur / Surakullam)
   - Purpose of Form (New Admission / Re-Admission / Update Existing Details)
   - Academic Year

2. **Student's Personal Details**
   - Full name, date of birth, gender
   - Nationality, religion, caste category
   - Aadhaar number (12-digit validation)
   - Blood group, identification marks
   - Special needs or disabilities
   - Current and permanent addresses

3. **Academic Details**
   - Admission type with conditional fields
   - Current/Last standard and section (for existing students)
   - Standard applying for
   - Previous school information
   - Re-admission details (conditional)
   - Extracurricular interests

4. **Sibling Details**
   - Dynamic sibling entry (add/remove multiple siblings)
   - Name, class/grade, roll number, branch for each sibling

5. **Parent/Guardian Details**
   - Father's details (name, occupation, income, mobile, email, Aadhaar)
   - Mother's details (same fields as father)
   - Guardian details (optional)
   - Emergency contact information

6. **Transport and Other Options**
   - Transport requirement (conditional fields)
   - Pickup/drop location and mode of transport
   - Medical history and allergies
   - Vaccination status

7. **Declaration**
   - Mandatory acceptance checkbox

### Key Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Form Validation**:
  - Aadhaar number: 12-digit validation
  - Mobile numbers: 10-digit validation
  - Email validation
  - Required field validation
- **Conditional Fields**: Fields appear/disappear based on user selections
- **Real-time Validation**: Instant feedback on form errors
- **Success Notifications**: Toast notifications on successful submission
- **Database Storage**: All submissions stored in SQLite database
- **Modern UI**: Clean, elegant design with smooth animations

## Project Structure

```
school-admission-form/
├── app/
│   ├── actions/
│   │   └── admission.ts          # Server actions for form submission
│   ├── components/
│   │   └── AdmissionForm.tsx     # Main form component
│   ├── generated/
│   │   └── prisma/               # Generated Prisma client
│   ├── lib/
│   │   └── prisma.ts             # Prisma client instance
│   ├── layout.tsx                # Root layout with Toaster
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── dev.db                        # SQLite database file
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

The project is already set up and running. If you need to restart:

1. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

2. **Run database migrations** (if needed):
   ```bash
   npx prisma migrate dev
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Filling Out the Form

1. Navigate to http://localhost:3000
2. Fill out all required fields (marked with *)
3. Use conditional sections:
   - Check "Has siblings" to add sibling details
   - Check "Is Rejoining" to enter previous school details
   - Check "Transport Required" to specify transport needs
4. Accept the declaration
5. Click "Submit Application"
6. You'll receive a success message if submission is successful

### Viewing Submitted Data

To view submissions in the database:

```bash
npx prisma studio
```

This opens Prisma Studio at http://localhost:5555 where you can:
- View all submissions
- Search and filter records
- Edit or delete entries
- Export data

## Database Schema

### Admission Model
Stores all form data with the following fields:
- Basic information (branch, purpose, academic year)
- Student personal details (name, DOB, gender, etc.)
- Academic details (standards, previous school, etc.)
- Parent/guardian details (father, mother, guardian, emergency contact)
- Transport and medical information
- File upload paths (currently storing paths, ready for file upload implementation)

### Sibling Model
Related to Admission model (one-to-many):
- Name, class/grade, roll number, branch
- Automatically deleted when parent admission is deleted (cascade)

## Validation Rules

- **Aadhaar Number**: Must be exactly 12 digits
- **Mobile Numbers**: Must be exactly 10 digits
- **Email**: Must be valid email format
- **Required Fields**: Marked with red asterisk (*)
- **Declaration**: Must be accepted to submit

## Customization

### Adding New Fields

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name add_new_field`
3. Update the form component in `app/components/AdmissionForm.tsx`
4. Update the server action type in `app/actions/admission.ts`
5. Update the validation schema (Zod)

### Styling

- Modify Tailwind classes in `app/components/AdmissionForm.tsx`
- Update global styles in `app/globals.css`
- Change theme in `tailwind.config.ts`

### Adding File Uploads

The database schema already has fields for file uploads. To implement:
1. Add file input fields in the form
2. Use Next.js API routes or server actions to handle file uploads
3. Store files in `/public/uploads` or cloud storage (AWS S3, Cloudinary)
4. Save file paths to database

## Production Deployment

### Environment Variables

Create a `.env.production` file:
```
DATABASE_URL="file:./prod.db"
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js and deploy
4. For SQLite in production, consider migrating to PostgreSQL:
   - Update `prisma/schema.prisma` datasource to PostgreSQL
   - Add `DATABASE_URL` to Vercel environment variables
   - Run `npx prisma migrate deploy` after deployment

## Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
npx kill-port 3000
npm run dev
```

### Database Issues

Reset database:
```bash
npx prisma migrate reset
```

### Prisma Client Not Generated

Regenerate client:
```bash
npx prisma generate
```

## Future Enhancements

- [ ] File upload functionality for documents
- [ ] Email notifications to parents/school
- [ ] Admin dashboard to view/manage submissions
- [ ] PDF generation for submitted forms
- [ ] Payment integration for admission fees
- [ ] Multi-language support
- [ ] Applicant portal to track application status
- [ ] SMS notifications

## Support

For questions or issues, please contact your school administration.

---

**Built with Next.js + TypeScript + Tailwind CSS + Prisma + SQLite**
