import UrlForm from './components/UrlForm';
import UrlInfo from './components/UrlInfo';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Register from './components/auth/register';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { currentUser } = useAuth();
  const isLoggedIn = currentUser ? currentUser.email : 'Guest'

  return (
    <div>
      <header>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </header>
      <h1>URL Shortener , welcome {isLoggedIn}</h1>
      <UrlForm  />
      <UrlInfo />
    </div>
  );
};

export default App;
