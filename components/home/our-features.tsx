'use client'

import { motion } from 'framer-motion'

function OurFeatures() {
 const features = [
  { icon: "fa fa-laptop", title: "Hindi & English Typing", description: "CPCT, SSC, MP High Court Stenographer, Rajasthan High Court, JJA Exam & all Government Exams." },
  { icon: "fa fa-film", title: "LIVE Classes & Mock Tests", description: "Join live sessions, take practice tests, and learn concept & get your doubts in the live classes" },
  { icon: "fa fa-users", title: "Student Discussion", description: "Get access to 24*7 live discussion group with coursemates & faculty" },
  { icon: "fa fa-comments", title: "Quiz & Assignments", description: "Practice chapter wise quizzes, full length test papers to learn and revise concepts " },
  { icon: "fa fa-book", title: "Important E-Books", description: "Get important topics for last minutes revision in the pdf format & hardcopy also" },
  { icon: "fa-solid fa-bell", title: "Alert & Notification", description: "Stay up-to-date & get notify everytime the course content is updated" }
];

  return (
    <section id="mu-features" className="py-12 bg-blue-400">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white uppercase">Our Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.4 }}
              viewport={{ once: true }}
            >
              <span className={`text-4xl text-blue-500 ${feature.icon}`}></span>
              <h4 className="text-xl font-semibold text-gray-800 mt-4">{feature.title}</h4>
              <p className="text-gray-600 mt-2">{feature.description}</p>
              <a href="#" className="text-blue-500 font-medium mt-4 inline-block hover:underline">Read More</a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurFeatures
