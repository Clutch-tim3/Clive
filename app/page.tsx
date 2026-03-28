import { HeroNew as Hero } from '@/components/home/HeroNew';
import { HackKitSpotlight } from '@/components/home/HackKitSpotlight';
import { StatsStrip } from '@/components/home/StatsStrip';
import { ProductsSection } from '@/components/home/ProductsSection';
import { WhyClive } from '@/components/home/WhyClive';
import { NavyBand } from '@/components/home/NavyBand';
import { PlatformSection } from '@/components/home/PlatformSection';
import { ChannelsSection } from '@/components/home/ChannelsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { APIlayerPartnersSection } from '@/components/home/APIlayerPartnersSection';
import { ReadyToBuildCTA } from '@/components/home/ReadyToBuildCTA';

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsStrip />
      <HackKitSpotlight />
      <ProductsSection />
      <WhyClive />
      <NavyBand />
      <PlatformSection />
      <ChannelsSection />
      <PricingSection />
      <APIlayerPartnersSection />
      <ReadyToBuildCTA />
    </div>
  );
}