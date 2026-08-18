import { LandingScreen } from '@/features/landing/components/LandingScreen'
import { useLandingFlow } from '@/features/landing/hooks/useLandingFlow'

export default function LandingPage() {
  return <LandingScreen flow={useLandingFlow()} />
}
