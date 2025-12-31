'use client'

import HeroBannerItem from './HeroBannerItem'
import { GroupField } from '@prismicio/client'
import {
  HomepageDocumentDataHeroBannersItem,
  Simplify,
} from '@/prismicio-types'
import styles from './style.module.css'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/Carousel'
import cn from 'classnames'

interface IHeroBanner {
  banners: GroupField<Simplify<HomepageDocumentDataHeroBannersItem>>
}

const HeroSection: React.FC<IHeroBanner> = ({ banners }) => {
  if (!banners?.length) return null

  return (
    <section className={cn(styles.hero_banner)}>
      <Carousel className="w-full h-full">
        <CarouselContent>
          {banners.map((banner, index) => {
            const bg = banner.background_color || '#4f141f'
            return (
              <CarouselItem key={index} className="w-full">
                <div className="w-full" style={{ backgroundColor: bg }}>
                  <HeroBannerItem data={banner} />
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

export default HeroSection
