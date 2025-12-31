"use client";

import { HomepageDocumentDataHeroBannersItem } from "@/prismicio-types";
import { PrismicNextImage } from "@prismicio/next";
import styles from "./style.module.css";

interface IHeroBannerItem {
  data: HomepageDocumentDataHeroBannersItem;
}

const HeroBannerItem: React.FC<IHeroBannerItem> = ({ data }) => {
  return (
    <div className={styles.hero_banner_item}>
      <div className="relative h-[60%] md:h-full md:flex-1">
        <PrismicNextImage
          field={data.image}
          fill
          alt=""
          className="object-cover"
          preload
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className={styles.hero_text}>
        <h1 className="text-5xl font-extralight text-white md:text-6xl">
          {data.title}
          {data.lower_title && (
            <span className="px-2 font-[tangerine] text-6xl">
              {data.lower_title}
            </span>
          )}
          {data.title_2 && data.title_2}
        </h1>

        {data.text && (
          <span className="mt-6 text-center font-semibold text-white md:px-8 md:text-lg">
            {data.text}
          </span>
        )}

        {/* {data.button_text && (
          <Link href={data.pathname || '#'}>
            <Button className="uppercase mt-8 px-12 md:px-18 md:mt-10 text-lg">
              {data.button_text}
            </Button>
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default HeroBannerItem;
