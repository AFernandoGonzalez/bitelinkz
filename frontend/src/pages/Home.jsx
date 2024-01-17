import { UrlForm } from '../components/UrlForm'
import { LatestUrl } from '../components/LatestUrl'
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { currentUser } = useAuth();
  const isLoggedIn = currentUser ? currentUser.email : 'Guest'
  
  return (
    <div>
      <h1 className='underline' >URL Shortener , welcome {isLoggedIn}</h1>
      <UrlForm />
      <LatestUrl/>
    </div>
  )
}
