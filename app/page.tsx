import AdmissionForm from '@/app/components/AdmissionForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Oxford Matriculation Higher Secondary School
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-2">
            Admission Form
          </h2>
          <p className="text-gray-600 text-lg">
            Please fill out the form below for admission
          </p>
        </header>
        <AdmissionForm />
        <footer className="text-center mt-8 text-gray-600">
          <p>For queries, contact your school administration</p>
        </footer>
      </div>
    </div>
  )
}
