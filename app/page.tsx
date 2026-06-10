import HeroSection from '@/features/home/ui/components/HeroSection'
import CategoryGrid from '@/features/home/ui/components/CategoryGrid'
import BestSellers from '@/features/home/ui/components/BestSellers'
import NewArrivals from '@/features/home/ui/components/NewArrivals'
import BenefitsGrid from '@/features/home/ui/components/BenefitsGrid'
import TestimonialsSection from '@/shared/components/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <NewArrivals />
      <TestimonialsSection />
      <BenefitsGrid />
    </>
  )
}
