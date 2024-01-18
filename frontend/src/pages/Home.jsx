import { UrlForm } from '../components/UrlForm';
import { LatestUrl } from '../components/LatestUrl';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/Theme';

export const Home = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const isLoggedIn = currentUser ? currentUser.email : 'Guest';

  return (
    <div className='m-2'>
      <h1 className={`text-center text-3xl md:text-6xl font-bold mb-2 ${theme ? '' : 'text-gray-800'}`}>
        Shorten. Share. Simplify.
      </h1>
      <div className='max-w-screen-md mx-auto mt-8 text-center'>
        <p className={`text-xl ${theme ? 'text-white' : ''}`}>
          Welcome to SnipSnap, where we make URL shortening a breeze. Create concise and branded links effortlessly,
          track their performance, and simplify your online sharing experience.
        </p>
      </div>
      <UrlForm theme={theme} />
      <LatestUrl theme={theme} />

      <section className={`max-w-screen-lg mx-auto p-6 rounded-lg ${theme ? 'bg-gray-700' : 'bg-slate-50'}`}>
        <div className='mb-8'>
          <h2 className={`text-center text-3xl md:text-6xl font-bold mb-2 ${theme ? '' : 'text-gray-800'}`}>
            Features
          </h2>
          <p className={`text-xl ${theme ? 'text-white' : ''}`}>
            SnipSnap provides a variety of features to help you manage your links.
          </p>
        </div>

        <div className='flex flex-wrap justify-around'>
          <FeatureCard theme={theme} iconClass='fas fa-link' title='Short Links' description='Generate concise short links for easy sharing.' />
          <FeatureCard theme={theme} iconClass='fas fa-qrcode' title='Generate QR Codes' description='Create QR codes for your short links.' />
          <FeatureCard theme={theme} iconClass='fas fa-list' title='Manage Your Links' description='Effortlessly manage and organize your shortened links.' />
          <FeatureCard theme={theme} iconClass='fas fa-chart-line' title='Campaign Tracking and Analytics' description='Track the performance of your links with detailed analytics.' />
        </div>
        <button className='mt-8 bg-blue-500 text-white px-4 py-2 rounded'>Sign Up</button>
      </section>

      <section className='max-w-screen mx-4 mt-8 flex flex-wrap justify-between'>
        <div className='p-2 w-full sm:w-1/3 flex items-center'>
          <i className={`fas fa-share text-4xl md:text-4xl p-2 m-2 mr-4 rounded-lg ${theme ? "bg-gray-700" : "bg-gray-100"}`}></i>
          <div>
            <h6 className='text-start text-xl md:text-2xl font-semibold'>Share Links</h6>
            <p className='text-start'>Enhance your online presence by easily sharing branded links.</p>
          </div>
        </div>
        <div className='p-2 w-full sm:w-1/3 flex items-center'>
          <i className={`fas fa-chart-line text-4xl md:text-6xl  mr-4 md:text-4xl p-2 m-2 mr-4 rounded-lg ${theme ? "bg-gray-700" : "bg-gray-100"}`}></i>
          <div>
            <h6 className='text-start text-xl md:text-2xl font-semibold'>Drive Conversion</h6>
            <p className='text-start'>Increase conversion rates by directing users to targeted content.</p>
          </div>
        </div>
        <div className='p-2 w-full sm:w-1/3 flex items-center'>
          <i className={`fas fa-chart-bar text-4xl md:text-6xl  mr-4 md:text-4xl p-2 m-2 mr-4 rounded-lg ${theme ? "bg-gray-700" : "bg-gray-100"}`}></i>
          <div>
            <h6 className='text-start text-xl md:text-2xl font-semibold'>Track Performance</h6>
            <p className='text-start'>Track the performance of your links with detailed analytics.</p>
          </div>
        </div>
      </section>


    </div>
  );
};

const FeatureCard = ({ iconClass, title, description, theme }) => {
  console.log(theme);
  return (
    <div className={`w-full md:w-48 h-[200px] rounded-lg shadow-lg p-2 m-4 flex flex-col justify-around ${theme ? "bg-gray-800" : "bg-white"}`}>
      <i className={`text-3xl ${iconClass}`}></i>
      <p className='text-xl font-semibold'>{title}</p>
      <p className='text-sm'>{description}</p>
    </div>
  );
};
