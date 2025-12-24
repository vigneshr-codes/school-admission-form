/*
  Warnings:

  - You are about to drop the column `modeOfTransport` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `vaccinationDetails` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `vaccinationStatus` on the `Admission` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admissionId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "vaccinationDate" TEXT NOT NULL,
    CONSTRAINT "Vaccination_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "addressProof" TEXT
);
INSERT INTO "new_Admission" ("aadhaarCardParents", "aadhaarCardStudent", "aadhaarNumber", "academicYear", "addressProof", "admissionType", "birthCertificate", "bloodGroup", "casteCategory", "casteCertificate", "createdAt", "currentLastSection", "currentLastStandard", "currentResidentialAddress", "dateOfBirth", "declarationAccepted", "emergencyContactMobile", "emergencyContactName", "emergencyContactRelation", "extracurricularInterests", "fatherAadhaarNumber", "fatherAnnualIncome", "fatherEmail", "fatherFullName", "fatherMobileNumber", "fatherOccupation", "gender", "guardianAadhaarNumber", "guardianMobileNumber", "guardianName", "guardianOccupation", "guardianRelation", "hasSiblingsInSchool", "id", "identificationMarks", "isRejoining", "lastClassAttended", "marksPercentageLastExam", "medicalHistoryOrAllergies", "motherAadhaarNumber", "motherAnnualIncome", "motherEmail", "motherFullName", "motherMobileNumber", "motherOccupation", "nationality", "permanentAddress", "pickupDropLocation", "previousRollNumber", "previousSchoolAddress", "previousSchoolName", "purposeOfForm", "reasonForLeaving", "reasonForRejoining", "religion", "schoolBranch", "specialNeedsOrDisabilities", "standardApplyingFor", "studentFullName", "studentPhoto", "subCaste", "transferCertificate", "transportRequired", "updatedAt", "yearOfPassingLastClass", "yearStandardWhenLeft") SELECT "aadhaarCardParents", "aadhaarCardStudent", "aadhaarNumber", "academicYear", "addressProof", "admissionType", "birthCertificate", "bloodGroup", "casteCategory", "casteCertificate", "createdAt", "currentLastSection", "currentLastStandard", "currentResidentialAddress", "dateOfBirth", "declarationAccepted", "emergencyContactMobile", "emergencyContactName", "emergencyContactRelation", "extracurricularInterests", "fatherAadhaarNumber", "fatherAnnualIncome", "fatherEmail", "fatherFullName", "fatherMobileNumber", "fatherOccupation", "gender", "guardianAadhaarNumber", "guardianMobileNumber", "guardianName", "guardianOccupation", "guardianRelation", "hasSiblingsInSchool", "id", "identificationMarks", "isRejoining", "lastClassAttended", "marksPercentageLastExam", "medicalHistoryOrAllergies", "motherAadhaarNumber", "motherAnnualIncome", "motherEmail", "motherFullName", "motherMobileNumber", "motherOccupation", "nationality", "permanentAddress", "pickupDropLocation", "previousRollNumber", "previousSchoolAddress", "previousSchoolName", "purposeOfForm", "reasonForLeaving", "reasonForRejoining", "religion", "schoolBranch", "specialNeedsOrDisabilities", "standardApplyingFor", "studentFullName", "studentPhoto", "subCaste", "transferCertificate", "transportRequired", "updatedAt", "yearOfPassingLastClass", "yearStandardWhenLeft" FROM "Admission";
DROP TABLE "Admission";
ALTER TABLE "new_Admission" RENAME TO "Admission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
