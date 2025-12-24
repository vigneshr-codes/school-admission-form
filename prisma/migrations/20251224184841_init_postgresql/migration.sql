-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolBranch" TEXT NOT NULL,
    "purposeOfForm" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "studentFullName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL DEFAULT 'Indian',
    "religion" TEXT,
    "casteCategory" TEXT NOT NULL,
    "subCaste" TEXT,
    "aadhaarNumber" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "identificationMarks" TEXT,
    "specialNeedsOrDisabilities" TEXT,
    "currentResidentialAddress" TEXT NOT NULL,
    "permanentAddress" TEXT,
    "admissionType" TEXT NOT NULL,
    "currentLastStandard" TEXT,
    "currentLastSection" TEXT,
    "standardApplyingFor" TEXT NOT NULL,
    "previousSchoolName" TEXT,
    "previousSchoolAddress" TEXT,
    "lastClassAttended" TEXT,
    "yearOfPassingLastClass" TEXT,
    "marksPercentageLastExam" TEXT,
    "isRejoining" BOOLEAN NOT NULL DEFAULT false,
    "previousRollNumber" TEXT,
    "yearStandardWhenLeft" TEXT,
    "reasonForLeaving" TEXT,
    "reasonForRejoining" TEXT,
    "extracurricularInterests" TEXT,
    "hasSiblingsInSchool" BOOLEAN NOT NULL DEFAULT false,
    "fatherFullName" TEXT NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "fatherAnnualIncome" TEXT,
    "fatherMobileNumber" TEXT NOT NULL,
    "fatherEmail" TEXT,
    "fatherAadhaarNumber" TEXT,
    "motherFullName" TEXT NOT NULL,
    "motherOccupation" TEXT NOT NULL,
    "motherAnnualIncome" TEXT,
    "motherMobileNumber" TEXT NOT NULL,
    "motherEmail" TEXT,
    "motherAadhaarNumber" TEXT,
    "guardianName" TEXT,
    "guardianRelation" TEXT,
    "guardianOccupation" TEXT,
    "guardianMobileNumber" TEXT,
    "guardianAadhaarNumber" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactRelation" TEXT,
    "emergencyContactMobile" TEXT,
    "transportRequired" BOOLEAN NOT NULL DEFAULT false,
    "pickupDropLocation" TEXT,
    "medicalHistoryOrAllergies" TEXT,
    "declarationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "birthCertificate" TEXT,
    "aadhaarCardStudent" TEXT,
    "aadhaarCardParents" TEXT,
    "transferCertificate" TEXT,
    "casteCertificate" TEXT,
    "studentPhoto" TEXT,
    "addressProof" TEXT,

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sibling" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classGrade" TEXT NOT NULL,
    "rollNumber" TEXT,
    "branch" TEXT NOT NULL,

    CONSTRAINT "Sibling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "vaccinationDate" TEXT NOT NULL,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sibling" ADD CONSTRAINT "Sibling_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
