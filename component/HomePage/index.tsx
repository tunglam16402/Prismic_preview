import { HomepageDocumentData, Simplify } from '@/prismicio-types'

interface IHomePage {
  data: Simplify<HomepageDocumentData>
}

const HomePage: React.FC<IHomePage> = ({ data }) => {

  return (
    <div>
      <HeroSection banners={data.hero_banners} />
      
    </div>
  )
}

export default HomePage
