'use client'

export default function Education() {
  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-[#f59e0b]">Education</span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-xl">
            <h3 className="text-xl font-bold">B.S. Software Engineering</h3>
            <p className="text-[#f59e0b]">Technical Vocational College of Qom | 2024 - Present</p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl">
            <h3 className="text-xl font-bold">Associate Software Engineering</h3>
            <p className="text-[#f59e0b]">Technical Vocational College of Qom | 2022 - 2024</p>
          </div>
        </div>
      </div>
    </section>
  )
}
