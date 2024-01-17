import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/Theme';
import LogoLight from '../assets/logo-bgDark.png';
import LogoDark from '../assets/logo-bgWhite.png';

const Navbar = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    console.log('toggleMenu');
    setShowMenu(!showMenu);
  };

  const navbarClasses = `bg-${theme ? 'gray-900' : 'white'} `;
  const linkClasses = `text-${theme ? 'white' : 'gray-900'}`;

  const renderAuthLinks = () => (
    <ul className={`flex ${linkClasses} flex-col justify-center items-center md:flex-row`}>
      <li className={`m-2 text-center text-4xl md:text-lg`}>
        <Link to="/manage-links" className={`${linkClasses}`} onClick={toggleMenu}>
          Manage Links
        </Link>
      </li>
      <li className={`m-2 text-center text-4xl md:text-lg`}>
        <Link to="/logout" className={linkClasses} onClick={toggleMenu}>
          Logout
        </Link>
      </li>
    </ul>
  );

  const renderGuestLinks = () => (
    <ul className={`flex ${linkClasses}`}>
      <li className={`m-2 text-center text-4xl md:text-lg`}>
        <Link to="/login" className={linkClasses} onClick={toggleMenu}>
          Login
        </Link>
      </li>
      <li className={`m-2 text-center text-4xl md:text-lg`}>
        <Link to="/register" className={linkClasses} onClick={toggleMenu}>
          Register
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className={navbarClasses}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={theme ? LogoLight : LogoDark} style={{ height: "80px", width: "80px", objectFit: "contain" }} alt="Logo" />

        </a>

        <div className="flex items-center">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            {currentUser ? renderAuthLinks() : renderGuestLinks()}
          </div>

          <label className="relative inline-flex items-center cursor-pointer hidden w-full md:block md:w-auto">
            <input type="checkbox" className="sr-only peer" checked={theme} onChange={toggleTheme} />
            <span className="ms-3 text-sm font-medium">
              {theme ? <i className="fas fa-sun text-yellow-500 text-2xl"></i> : <i className="fas fa-moon text-gray-900 text-2xl hover"></i>}
            </span>
          </label>
        </div>

        <div className="md:hidden" id="navbar-mobile">
          <i className="fas fa-bars " onClick={toggleMenu}></i>
          {showMenu && (
            <div className={`bg-${theme ? 'gray-800' : 'white'} fixed inset-0 z-10`}>
              <div className="p-6 h-full flex flex-col justify-center items-center">
                <i className={`fas fa-times absolute top-10 right-5  text-2xl cursor-pointer  ${theme ? "" : "text-gray-900 "}`} onClick={toggleMenu}></i>
                <label className="flex justify-center items-center cursor-pointer w-full ">
                  <input type="checkbox" className="sr-only peer" checked={theme} onChange={toggleTheme} />
                  <span className="text-sm font-medium ">
                    {theme ? <i className="fas fa-sun text-yellow-500 text-2xl"></i> : <i className="fas fa-moon text-gray-900 text-2xl hover"></i>}
                  </span>
                </label>
                {currentUser ? renderAuthLinks() : renderGuestLinks()}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
