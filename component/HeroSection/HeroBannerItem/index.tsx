'use client'

import { PrismicNextImage } from '@prismicio/next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { HomepageDocumentDataHeroBannersItem } from '@/prismicio-types'
import styles from './style.module.css'

interface IHeroBannerItem {
  data: HomepageDocumentDataHeroBannersItem
}

const HeroBannerItem: React.FC<IHeroBannerItem> = ({ data }) => {
  return (
    <div className={styles.hero_banner_item}>
      <div className="relative h-[60%] md:flex-1 md:h-full">
        <PrismicNextImage
          field={data.image}
          fill
          alt=""
          className="object-cover"
          preload
          fetchPriority='high'
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className={styles.hero_text}>
        <h1 className="text-white font-extralight text-5xl md:text-6xl">
          {data.title}
          {data.lower_title && (
            <span className="font-[tangerine] text-6xl px-2">
              {data.lower_title}
            </span>
          )}
          {data.title_2 && data.title_2}
        </h1>

        {data.text && (
          <span className="text-white font-semibold mt-6 md:text-lg text-center md:px-8">
            {data.text}
          </span>
        )}

        {data.button_text && (
          <Link href={data.pathname || '#'}>
            <Button className="uppercase mt-8 px-12 md:px-18 md:mt-10 text-lg">
              {data.button_text}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default HeroBannerItem
