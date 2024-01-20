import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ManageLinks } from './pages/ManageLinks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useTheme } from './context/Theme';
import './App.css';
import { Register } from './components/auth/Register';
import { SignIn } from './components/auth/SignIn';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme ? "dark-mode bg-gray-900 text-white" : "light-mode bg-white"} `}
    >
      <header>
        <Navbar />
      </header>
      <main className='max-w-screen-lg mx-auto mt-8 text-center flex-grow' >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<Register />} />
          <Route
            path="/manage-links"
            element={
              <ProtectedRoute>
                <ManageLinks />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </main>
      <Footer theme={theme} />
    </div>
  );
};

export default App;
