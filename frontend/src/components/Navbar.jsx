import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <ul>
      <li><a href="/">Home</a></li>
      {currentUser ? (
        <div>
          <li><a href="/manage-links">Manage Links</a></li>
          <li><a href="/logout">Logout</a></li>
        </div>

      ) : (
        <div>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </div>
      )}

    </ul>
  )
}

export default Navbar