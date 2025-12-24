'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export type AdmissionFormData = {
  // Section 1: Basic Information
  schoolBranch: string
  purposeOfForm: string
  academicYear: string

  // Section 2: Student's Personal Details
  studentFullName: string
  dateOfBirth: string
  gender: string
  nationality: string
  religion?: string
  casteCategory: string
  subCaste?: string
  aadhaarNumber: string
  bloodGroup?: string
  identificationMarks?: string
  specialNeedsOrDisabilities?: string
  currentResidentialAddress: string
  permanentAddress?: string

  // Section 3: Academic Details
  admissionType: string
  currentLastStandard?: string
  currentLastSection?: string
  standardApplyingFor: string
  previousSchoolName?: string
  previousSchoolAddress?: string
  lastClassAttended?: string
  yearOfPassingLastClass?: string
  marksPercentageLastExam?: string

  // Re-admission fields
  isRejoining: boolean
  previousRollNumber?: string
  yearStandardWhenLeft?: string
  reasonForLeaving?: string
  reasonForRejoining?: string

  extracurricularInterests?: string

  // Section 4: Sibling Details
  hasSiblingsInSchool: boolean
  siblings?: Array<{
    name: string
    classGrade: string
    rollNumber?: string
    branch: string
  }>

  // Section 5: Parent/Guardian Details
  fatherFullName: string
  fatherOccupation: string
  fatherAnnualIncome?: string
  fatherMobileNumber: string
  fatherEmail?: string
  fatherAadhaarNumber?: string

  motherFullName: string
  motherOccupation: string
  motherAnnualIncome?: string
  motherMobileNumber: string
  motherEmail?: string
  motherAadhaarNumber?: string

  guardianName?: string
  guardianRelation?: string
  guardianOccupation?: string
  guardianMobileNumber?: string
  guardianAadhaarNumber?: string

  emergencyContactName?: string
  emergencyContactRelation?: string
  emergencyContactMobile?: string

  // Section 6: Transport and Other Options
  transportRequired: boolean
  pickupDropLocation?: string
  medicalHistoryOrAllergies?: string
  vaccinations?: Array<{
    vaccineName: string
    vaccinationDate: string
  }>

  // Declaration
  declarationAccepted: boolean
}

export async function submitAdmissionForm(data: AdmissionFormData) {
  try {
    const admission = await prisma.admission.create({
      data: {
        // Basic Information
        schoolBranch: data.schoolBranch,
        purposeOfForm: data.purposeOfForm,
        academicYear: data.academicYear,

        // Student Personal Details
        studentFullName: data.studentFullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
        religion: data.religion,
        casteCategory: data.casteCategory,
        subCaste: data.subCaste,
        aadhaarNumber: data.aadhaarNumber,
        bloodGroup: data.bloodGroup,
        identificationMarks: data.identificationMarks,
        specialNeedsOrDisabilities: data.specialNeedsOrDisabilities,
        currentResidentialAddress: data.currentResidentialAddress,
        permanentAddress: data.permanentAddress,

        // Academic Details
        admissionType: data.admissionType,
        currentLastStandard: data.currentLastStandard,
        currentLastSection: data.currentLastSection,
        standardApplyingFor: data.standardApplyingFor,
        previousSchoolName: data.previousSchoolName,
        previousSchoolAddress: data.previousSchoolAddress,
        lastClassAttended: data.lastClassAttended,
        yearOfPassingLastClass: data.yearOfPassingLastClass,
        marksPercentageLastExam: data.marksPercentageLastExam,

        // Re-admission
        isRejoining: data.isRejoining,
        previousRollNumber: data.previousRollNumber,
        yearStandardWhenLeft: data.yearStandardWhenLeft,
        reasonForLeaving: data.reasonForLeaving,
        reasonForRejoining: data.reasonForRejoining,
        extracurricularInterests: data.extracurricularInterests,

        // Siblings
        hasSiblingsInSchool: data.hasSiblingsInSchool,
        siblings: data.siblings && data.siblings.length > 0 ? {
          create: data.siblings
        } : undefined,

        // Parent Details
        fatherFullName: data.fatherFullName,
        fatherOccupation: data.fatherOccupation,
        fatherAnnualIncome: data.fatherAnnualIncome,
        fatherMobileNumber: data.fatherMobileNumber,
        fatherEmail: data.fatherEmail,
        fatherAadhaarNumber: data.fatherAadhaarNumber,

        motherFullName: data.motherFullName,
        motherOccupation: data.motherOccupation,
        motherAnnualIncome: data.motherAnnualIncome,
        motherMobileNumber: data.motherMobileNumber,
        motherEmail: data.motherEmail,
        motherAadhaarNumber: data.motherAadhaarNumber,

        guardianName: data.guardianName,
        guardianRelation: data.guardianRelation,
        guardianOccupation: data.guardianOccupation,
        guardianMobileNumber: data.guardianMobileNumber,
        guardianAadhaarNumber: data.guardianAadhaarNumber,

        emergencyContactName: data.emergencyContactName,
        emergencyContactRelation: data.emergencyContactRelation,
        emergencyContactMobile: data.emergencyContactMobile,

        // Transport
        transportRequired: data.transportRequired,
        pickupDropLocation: data.pickupDropLocation,
        medicalHistoryOrAllergies: data.medicalHistoryOrAllergies,

        // Vaccinations
        vaccinations: data.vaccinations && data.vaccinations.length > 0 ? {
          create: data.vaccinations
        } : undefined,

        // Declaration
        declarationAccepted: data.declarationAccepted,
      },
    })

    revalidatePath('/')
    return { success: true, id: admission.id }
  } catch (error) {
    console.error('Error submitting admission form:', error)
    return { success: false, error: 'Failed to submit form. Please try again.' }
  }
}
