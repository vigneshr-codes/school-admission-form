import { prisma } from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function AdmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const admission = await prisma.admission.findUnique({
    where: { id },
    include: {
      siblings: true,
      vaccinations: true,
    }
  })

  if (!admission) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to List
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admission Details
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Submitted on: {new Date(admission.createdAt).toLocaleString()}
          </p>

          {/* Section 1: Basic Information */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="School Branch" value={admission.schoolBranch} />
              <DetailItem label="Purpose of Form" value={admission.purposeOfForm} />
              <DetailItem label="Academic Year" value={admission.academicYear} />
            </div>
          </div>

          {/* Section 2: Student Details */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Full Name" value={admission.studentFullName} />
              <DetailItem label="Date of Birth" value={admission.dateOfBirth} />
              <DetailItem label="Gender" value={admission.gender} />
              <DetailItem label="Nationality" value={admission.nationality} />
              <DetailItem label="Religion" value={admission.religion} />
              <DetailItem label="Caste Category" value={admission.casteCategory} />
              <DetailItem label="Sub-Caste" value={admission.subCaste} />
              <DetailItem label="Aadhaar Number" value={admission.aadhaarNumber} />
              <DetailItem label="Blood Group" value={admission.bloodGroup} />
              <DetailItem label="Identification Marks" value={admission.identificationMarks} />
              <DetailItem label="Special Needs" value={admission.specialNeedsOrDisabilities} className="md:col-span-2" />
              <DetailItem label="Current Address" value={admission.currentResidentialAddress} className="md:col-span-2" />
              <DetailItem label="Permanent Address" value={admission.permanentAddress} className="md:col-span-2" />
            </div>
          </div>

          {/* Section 3: Academic Details */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Admission Type" value={admission.admissionType} />
              <DetailItem label="Standard Applying For" value={admission.standardApplyingFor} />
              <DetailItem label="Current/Last Standard" value={admission.currentLastStandard} />
              <DetailItem label="Current/Last Section" value={admission.currentLastSection} />
              <DetailItem label="Previous School" value={admission.previousSchoolName} />
              <DetailItem label="Previous School Address" value={admission.previousSchoolAddress} className="md:col-span-2" />
              <DetailItem label="Last Class Attended" value={admission.lastClassAttended} />
              <DetailItem label="Year of Passing" value={admission.yearOfPassingLastClass} />
              <DetailItem label="Marks/Percentage" value={admission.marksPercentageLastExam} />
              <DetailItem label="Is Rejoining" value={admission.isRejoining ? 'Yes' : 'No'} />
              {admission.isRejoining && (
                <>
                  <DetailItem label="Previous Roll Number" value={admission.previousRollNumber} />
                  <DetailItem label="Year/Standard When Left" value={admission.yearStandardWhenLeft} />
                  <DetailItem label="Reason for Leaving" value={admission.reasonForLeaving} className="md:col-span-2" />
                  <DetailItem label="Reason for Rejoining" value={admission.reasonForRejoining} className="md:col-span-2" />
                </>
              )}
              <DetailItem label="Extracurricular Interests" value={admission.extracurricularInterests} className="md:col-span-2" />
            </div>
          </div>

          {/* Section 4: Siblings */}
          {admission.hasSiblingsInSchool && admission.siblings.length > 0 && (
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Siblings in School</h2>
              <div className="space-y-3">
                {admission.siblings.map((sibling, index) => (
                  <div key={sibling.id} className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-gray-700 mb-2">Sibling {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <DetailItem label="Name" value={sibling.name} />
                      <DetailItem label="Class/Grade" value={sibling.classGrade} />
                      <DetailItem label="Roll Number" value={sibling.rollNumber} />
                      <DetailItem label="Branch" value={sibling.branch} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Parent Details */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Parent/Guardian Details</h2>

            <h3 className="font-medium text-gray-700 mb-2">Father&apos;s Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DetailItem label="Name" value={admission.fatherFullName} />
              <DetailItem label="Occupation" value={admission.fatherOccupation} />
              <DetailItem label="Annual Income" value={admission.fatherAnnualIncome} />
              <DetailItem label="Mobile" value={admission.fatherMobileNumber} />
              <DetailItem label="Email" value={admission.fatherEmail} />
              <DetailItem label="Aadhaar" value={admission.fatherAadhaarNumber} />
            </div>

            <h3 className="font-medium text-gray-700 mb-2">Mother&apos;s Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DetailItem label="Name" value={admission.motherFullName} />
              <DetailItem label="Occupation" value={admission.motherOccupation} />
              <DetailItem label="Annual Income" value={admission.motherAnnualIncome} />
              <DetailItem label="Mobile" value={admission.motherMobileNumber} />
              <DetailItem label="Email" value={admission.motherEmail} />
              <DetailItem label="Aadhaar" value={admission.motherAadhaarNumber} />
            </div>

            {admission.guardianName && (
              <>
                <h3 className="font-medium text-gray-700 mb-2">Guardian Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <DetailItem label="Name" value={admission.guardianName} />
                  <DetailItem label="Relation" value={admission.guardianRelation} />
                  <DetailItem label="Occupation" value={admission.guardianOccupation} />
                  <DetailItem label="Mobile" value={admission.guardianMobileNumber} />
                  <DetailItem label="Aadhaar" value={admission.guardianAadhaarNumber} />
                </div>
              </>
            )}

            {admission.emergencyContactName && (
              <>
                <h3 className="font-medium text-gray-700 mb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Name" value={admission.emergencyContactName} />
                  <DetailItem label="Relation" value={admission.emergencyContactRelation} />
                  <DetailItem label="Mobile" value={admission.emergencyContactMobile} />
                </div>
              </>
            )}
          </div>

          {/* Section 6: Transport */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Transport Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Transport Required" value={admission.transportRequired ? 'Yes' : 'No'} />
              {admission.transportRequired && (
                <DetailItem label="Pickup/Drop Location" value={admission.pickupDropLocation} className="md:col-span-2" />
              )}
            </div>
          </div>

          {/* Section 7: Medical & Vaccination */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Medical History & Vaccination</h2>
            <div className="mb-4">
              <DetailItem label="Medical History/Allergies" value={admission.medicalHistoryOrAllergies} />
            </div>

            {admission.vaccinations.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Vaccinations</h3>
                <div className="space-y-3">
                  {admission.vaccinations.map((vacc, index) => (
                    <div key={vacc.id} className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium text-gray-700 mb-2">Vaccination {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 font-medium">Vaccine Name:</span>
                          <span className="ml-2 text-gray-900">{vacc.vaccineName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Date:</span>
                          <span className="ml-2 text-gray-900">{vacc.vaccinationDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Declaration */}
          <div className="mb-6">
            <DetailItem
              label="Declaration Accepted"
              value={admission.declarationAccepted ? 'Yes' : 'No'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  label,
  value,
  className = ''
}: {
  label: string
  value?: string | null
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
  )
}
