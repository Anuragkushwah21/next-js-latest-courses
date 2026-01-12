import Slider from '@/components/home/slider'
import HomeMarquee from '@/components/home/home-marquee'
import LatestCourse from '@/components/home/latest-course'
import OurFeatures from '@/components/home/our-features'
import Counter from '@/components/home/counter'
import StudentReview from '@/components/home/student-review'
import AppSection from '@/components/home/app-section'

export default function Home() {
  return (
    <main>
      <Slider />
      <HomeMarquee />
      <LatestCourse />
      <OurFeatures />
      <Counter />
      <StudentReview />
      <AppSection />
    </main>
  )
}
