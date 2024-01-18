import { UrlForm } from '../components/UrlForm';
import { LatestUrl } from '../components/LatestUrl';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/Theme';
import { FeaturesSection } from '../components/FeaturesSection';
import { HeroSection } from '../components/HeroSection';
import { FAQSection } from '../components/FAQSection';

export const Home = () => {
  const { theme } = useTheme();
  return (
    <div className='m-2'>
      <div className="h-[100%]">
        <HeroSection theme={theme} />
        <UrlForm theme={theme} />
      </div>
      <LatestUrl theme={theme} />
      <div className="">
        <FeaturesSection theme={theme} />
      </div>
      <FAQSection />
    </div>
  );
};


