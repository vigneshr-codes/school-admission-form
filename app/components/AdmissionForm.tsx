'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'sonner'
import { submitAdmissionForm, type AdmissionFormData } from '@/app/actions/admission'
import { Plus, Trash2, Loader2 } from 'lucide-react'

// Validation schema
const admissionSchema = z.object({
  // Section 1
  schoolBranch: z.string().min(1, 'School branch is required'),
  purposeOfForm: z.string().min(1, 'Purpose is required'),
  academicYear: z.string().min(1, 'Academic year is required'),

  // Section 2
  studentFullName: z.string().min(1, 'Student name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  religion: z.string().optional(),
  casteCategory: z.string().min(1, 'Caste category is required'),
  subCaste: z.string().optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  bloodGroup: z.string().optional(),
  identificationMarks: z.string().optional(),
  specialNeedsOrDisabilities: z.string().optional(),
  currentResidentialAddress: z.string().min(1, 'Current address is required'),
  permanentAddress: z.string().optional(),

  // Section 3
  admissionType: z.string().min(1, 'Admission type is required'),
  currentLastStandard: z.string().optional(),
  currentLastSection: z.string().optional(),
  standardApplyingFor: z.string().min(1, 'Standard applying for is required'),
  previousSchoolName: z.string().optional(),
  previousSchoolAddress: z.string().optional(),
  lastClassAttended: z.string().optional(),
  yearOfPassingLastClass: z.string().optional(),
  marksPercentageLastExam: z.string().optional(),

  isRejoining: z.boolean(),
  previousRollNumber: z.string().optional(),
  yearStandardWhenLeft: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  reasonForRejoining: z.string().optional(),
  extracurricularInterests: z.string().optional(),

  // Section 4
  hasSiblingsInSchool: z.boolean(),
  siblings: z.array(z.object({
    name: z.string().min(1, 'Sibling name is required'),
    classGrade: z.string().min(1, 'Class/Grade is required'),
    rollNumber: z.string().optional(),
    branch: z.string().min(1, 'Branch is required'),
  })).optional(),

  // Section 5
  fatherFullName: z.string().min(1, 'Father\'s name is required'),
  fatherOccupation: z.string().min(1, 'Father\'s occupation is required'),
  fatherAnnualIncome: z.string().optional(),
  fatherMobileNumber: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  fatherEmail: z.string().email().optional().or(z.literal('')),
  fatherAadhaarNumber: z.string().optional(),

  motherFullName: z.string().min(1, 'Mother\'s name is required'),
  motherOccupation: z.string().min(1, 'Mother\'s occupation is required'),
  motherAnnualIncome: z.string().optional(),
  motherMobileNumber: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  motherEmail: z.string().email().optional().or(z.literal('')),
  motherAadhaarNumber: z.string().optional(),

  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianMobileNumber: z.string().optional(),
  guardianAadhaarNumber: z.string().optional(),

  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactMobile: z.string().optional(),

  // Section 6
  transportRequired: z.boolean(),
  pickupDropLocation: z.string().optional(),
  medicalHistoryOrAllergies: z.string().optional(),
  vaccinations: z.array(z.object({
    vaccineName: z.string().min(1, 'Vaccine name is required'),
    vaccinationDate: z.string().min(1, 'Vaccination date is required'),
  })).optional(),

  declarationAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the declaration'
  }),
})

type FormData = z.infer<typeof admissionSchema>

export default function AdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [copyAddress, setCopyAddress] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      nationality: 'Indian',
      hasSiblingsInSchool: false,
      isRejoining: false,
      transportRequired: false,
      declarationAccepted: false,
      siblings: [],
      vaccinations: []
    }
  })

  const { fields: siblingFields, append: appendSibling, remove: removeSibling } = useFieldArray({
    control,
    name: 'siblings'
  })

  const { fields: vaccinationFields, append: appendVaccination, remove: removeVaccination } = useFieldArray({
    control,
    name: 'vaccinations'
  })

  const hasSiblingsInSchool = watch('hasSiblingsInSchool')
  const isRejoining = watch('isRejoining')
  const transportRequired = watch('transportRequired')
  const admissionType = watch('admissionType')
  const currentAddress = watch('currentResidentialAddress')

  // Handle address copy
  const handleCopyAddress = (checked: boolean) => {
    setCopyAddress(checked)
    if (checked) {
      setValue('permanentAddress', currentAddress)
    } else {
      setValue('permanentAddress', '')
    }
  }

  // Handle current year checkbox
  const handleCurrentYear = (checked: boolean) => {
    if (checked) {
      const currentYear = new Date().getFullYear()
      const nextYear = currentYear + 1
      setValue('academicYear', `${currentYear}-${nextYear}`)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitAdmissionForm(data as AdmissionFormData)

      if (result.success) {
        toast.success('Form submitted successfully! We will contact you via email/mobile within 7 days.')
        reset()
        setSelectedDate(null)
      } else {
        toast.error(result.error || 'Failed to submit form')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Section 1: Basic Information */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 1: Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Branch <span className="text-red-500">*</span>
            </label>
            <select
              {...register('schoolBranch')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>
              <option value="T. Pudur">T. Pudur</option>
              <option value="Surakullam">Surakullam</option>
            </select>
            {errors.schoolBranch && (
              <p className="text-red-500 text-xs mt-1">{errors.schoolBranch.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Form <span className="text-red-500">*</span>
            </label>
            <select
              {...register('purposeOfForm')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Purpose</option>
              <option value="New Admission">New Admission</option>
              <option value="Re-Admission">Re-Admission (left and rejoined)</option>
              <option value="Update Existing Details">Update Existing Details</option>
            </select>
            {errors.purposeOfForm && (
              <p className="text-red-500 text-xs mt-1">{errors.purposeOfForm.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 2025-2026"
              {...register('academicYear')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.academicYear && (
              <p className="text-red-500 text-xs mt-1">{errors.academicYear.message}</p>
            )}
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                onChange={(e) => handleCurrentYear(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Use current academic year</span>
            </label>
          </div>
        </div>
      </section>

      {/* Section 2: Student's Personal Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 2: Student&apos;s Personal Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name of Student <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('studentFullName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.studentFullName && (
              <p className="text-red-500 text-xs mt-1">{errors.studentFullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nationality')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nationality && (
              <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Religion
            </label>
            <select
              {...register('religion')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Jain">Jain</option>
              <option value="Parsi (Zoroastrian)">Parsi (Zoroastrian)</option>
              <option value="Jewish">Jewish</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caste Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('casteCategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC (Other Backward Classes)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
              <option value="Other">Other</option>
            </select>
            {errors.casteCategory && (
              <p className="text-red-500 text-xs mt-1">{errors.casteCategory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Caste (if applicable)
            </label>
            <input
              type="text"
              {...register('subCaste')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={12}
              placeholder="12-digit number"
              {...register('aadhaarNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.aadhaarNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              {...register('bloodGroup')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identification Marks
            </label>
            <textarea
              rows={2}
              {...register('identificationMarks')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Any Special Needs or Disabilities
            </label>
            <textarea
              rows={2}
              {...register('specialNeedsOrDisabilities')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Residential Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Include house number, street, city, PIN code, state"
              {...register('currentResidentialAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentResidentialAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.currentResidentialAddress.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={copyAddress}
                onChange={(e) => handleCopyAddress(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Same as Current Address</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permanent Address (if different)
            </label>
            <textarea
              rows={3}
              {...register('permanentAddress')}
              disabled={copyAddress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Academic Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 3: Academic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is this a New Admission or Existing Student? <span className="text-red-500">*</span>
            </label>
            <select
              {...register('admissionType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="New Admission">New Admission</option>
              <option value="Existing Student">Existing Student (updating details)</option>
              <option value="Re-Admission">Re-Admission</option>
            </select>
            {errors.admissionType && (
              <p className="text-red-500 text-xs mt-1">{errors.admissionType.message}</p>
            )}
          </div>

          {(admissionType === 'Existing Student' || admissionType === 'Re-Admission') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current / Last Standard
                </label>
                <select
                  {...register('currentLastStandard')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Standard</option>
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current / Last Section
                </label>
                <select
                  {...register('currentLastSection')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="Not Applicable">Not Applicable</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard Applying For <span className="text-red-500">*</span>
            </label>
            <select
              {...register('standardApplyingFor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Standard</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
              ))}
            </select>
            {errors.standardApplyingFor && (
              <p className="text-red-500 text-xs mt-1">{errors.standardApplyingFor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous School Name (if any)
            </label>
            <input
              type="text"
              {...register('previousSchoolName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous School Address
            </label>
            <textarea
              rows={2}
              {...register('previousSchoolAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Class/Standard Attended at Previous School
            </label>
            <input
              type="text"
              {...register('lastClassAttended')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year of Passing Last Class
            </label>
            <input
              type="text"
              placeholder="e.g., 2024-2025"
              {...register('yearOfPassingLastClass')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks/Percentage in Last Exam
            </label>
            <input
              type="text"
              {...register('marksPercentageLastExam')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isRejoining')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                If Rejoining This School After Leaving
              </span>
            </label>
          </div>

          {isRejoining && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Roll Number in Our School
                </label>
                <input
                  type="text"
                  {...register('previousRollNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year/Standard When Left
                </label>
                <input
                  type="text"
                  {...register('yearStandardWhenLeft')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Leaving
                </label>
                <textarea
                  rows={2}
                  {...register('reasonForLeaving')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Rejoining
                </label>
                <textarea
                  rows={2}
                  {...register('reasonForRejoining')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extracurricular Interests
            </label>
            <textarea
              rows={2}
              placeholder="e.g., sports, arts, music"
              {...register('extracurricularInterests')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Sibling Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 4: Sibling Details
        </h2>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('hasSiblingsInSchool')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Does the Student Have Siblings in This School?
            </span>
          </label>
        </div>

        {hasSiblingsInSchool && (
          <div className="space-y-4">
            {siblingFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Sibling {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSibling(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`siblings.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.siblings?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.siblings[index]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class/Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`siblings.${index}.classGrade`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.siblings?.[index]?.classGrade && (
                      <p className="text-red-500 text-xs mt-1">{errors.siblings[index]?.classGrade?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      {...register(`siblings.${index}.rollNumber`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register(`siblings.${index}.branch`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Branch</option>
                      <option value="T. Pudur">T. Pudur</option>
                      <option value="Surakullam">Surakullam</option>
                    </select>
                    {errors.siblings?.[index]?.branch && (
                      <p className="text-red-500 text-xs mt-1">{errors.siblings[index]?.branch?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendSibling({ name: '', classGrade: '', rollNumber: '', branch: '' })}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add Sibling</span>
            </button>
          </div>
        )}
      </section>

      {/* Section 5: Parent/Guardian Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 5: Parent/Guardian Details
        </h2>

        {/* Father's Details */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Father&apos;s Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('fatherFullName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fatherFullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherFullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('fatherOccupation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fatherOccupation && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherOccupation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income (in INR)
            </label>
            <input
              type="text"
              {...register('fatherAnnualIncome')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="10-digit number"
              {...register('fatherMobileNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fatherMobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherMobileNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('fatherEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fatherEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              maxLength={12}
              {...register('fatherAadhaarNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mother's Details */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Mother&apos;s Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('motherFullName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.motherFullName && (
              <p className="text-red-500 text-xs mt-1">{errors.motherFullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('motherOccupation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.motherOccupation && (
              <p className="text-red-500 text-xs mt-1">{errors.motherOccupation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income (in INR)
            </label>
            <input
              type="text"
              {...register('motherAnnualIncome')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="10-digit number"
              {...register('motherMobileNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.motherMobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.motherMobileNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('motherEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.motherEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.motherEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              maxLength={12}
              {...register('motherAadhaarNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Guardian Details */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Guardian Details (if applicable)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register('guardianName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relation to Student
            </label>
            <input
              type="text"
              {...register('guardianRelation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              type="text"
              {...register('guardianOccupation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              maxLength={10}
              {...register('guardianMobileNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              maxLength={12}
              {...register('guardianAadhaarNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Emergency Contact (other than parents)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register('emergencyContactName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relation
            </label>
            <input
              type="text"
              {...register('emergencyContactRelation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              maxLength={10}
              {...register('emergencyContactMobile')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 6: Transport Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 6: Transport Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('transportRequired')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Transport Required?
              </span>
            </label>
          </div>

          {transportRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Pickup/Drop Location
              </label>
              <textarea
                rows={2}
                placeholder="e.g., nearest bus stop or address"
                {...register('pickupDropLocation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </section>

      {/* Section 7: Medical History and Vaccination */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Section 7: Medical History and Vaccination
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Any Medical History or Allergies?
            </label>
            <textarea
              rows={3}
              placeholder="e.g., asthma, food allergies—for emergency purposes"
              {...register('medicalHistoryOrAllergies')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Vaccination Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vaccination Details</h3>

            <div className="space-y-4">
              {vaccinationFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Vaccination {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeVaccination(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vaccine Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., COVID-19, MMR, DPT"
                        {...register(`vaccinations.${index}.vaccineName`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.vaccinations?.[index]?.vaccineName && (
                        <p className="text-red-500 text-xs mt-1">{errors.vaccinations[index]?.vaccineName?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vaccination Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register(`vaccinations.${index}.vaccinationDate`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.vaccinations?.[index]?.vaccinationDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.vaccinations[index]?.vaccinationDate?.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendVaccination({ vaccineName: '', vaccinationDate: '' })}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add Vaccination</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Declaration */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Declaration
        </h2>

        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              {...register('declarationAccepted')}
              className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I hereby declare that the information provided is true and correct to the best of my knowledge.
              I agree to abide by the school rules. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.declarationAccepted && (
            <p className="text-red-500 text-xs mt-1">{errors.declarationAccepted.message}</p>
          )}
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Application</span>
          )}
        </button>
      </div>
    </form>
  )
}
