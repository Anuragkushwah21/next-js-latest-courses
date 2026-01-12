import Marquee from "react-fast-marquee"

function HomeMarquee() {
  return (
    <div className="w-full bg-[#384e6e] overflow-hidden">
      <Marquee
        speed={50}
        pauseOnHover={true}
        gradient={true}
        gradientColor={[56, 78, 110]}
        className="text-white p-2 md:p-4 lg:p-6 overflow-hidden no-scrollbar whitespace-nowrap"
      >
        <span className="mx-2 text-sm md:text-base lg:text-lg xl:text-xl font-semibold">🔥 Latest Updates🔥</span>
        <span className="mx-2 text-sm md:text-base lg:text-lg xl:text-xl font-semibold">
          📢 Prepare for CPCT, SSC Stenographer C&D, MP High Court Stenographer, Rajasthan High Court, JJA Exam & all Govt. Exams
        </span>
        <span className="mx-2 text-sm md:text-base lg:text-lg xl:text-xl font-semibold">
          📱 WhatsApp No: +91-7974249633
        </span>
      </Marquee>
    </div>
  )
}

export default HomeMarquee
