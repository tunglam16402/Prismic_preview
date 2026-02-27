import { HomepageDocumentData, Simplify } from "@/prismicio-types";
import HeroSection from "../HeroSection";
import NativePlayer from "../NativePlayer";

interface IHomePage {
  data: Simplify<HomepageDocumentData>;
}

const HomePage: React.FC<IHomePage> = ({ data }) => {
  return (
    <div>
      <HeroSection banners={data.hero_banners} />
      <div className="mt-40">
        <NativePlayer />
      </div>
    </div>
  );
};

export default HomePage;
