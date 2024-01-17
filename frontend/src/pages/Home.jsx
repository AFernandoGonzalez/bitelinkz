import { UrlForm } from '../components/UrlForm'
import { LatestUrl } from '../components/LatestUrl'
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/Theme';

export const Home = () => {
  // const { currentUser } = useAuth();
  // const isLoggedIn = currentUser ? currentUser.email : 'Guest'
  const { theme } = useTheme();
  return (
    <div className='m-2'>
      <h1 className={`text-center text-3xl md:text-6xl font-bold mb-2${theme ? "" : "text-gray-800"}`}>Shorten. Share. Simplify.</h1>
      <div className="max-w-screen-md mx-auto mt-8 text-center">
        <p className={`text-2xl ${theme? "text-white" : ""}`}>
          Welcome to SnipSnap, where we make URL shortening a breeze. Create concise and branded links effortlessly,
          track their performance, and simplify your online sharing experience.
        </p>
      </div>
      <UrlForm theme={theme} />
      <LatestUrl theme={theme} />
    </div>
  )
}
