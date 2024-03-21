import React from 'react';
import { Link } from 'react-router-dom';
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem("userId");
    setCookies("access_token","");
    navigate("/auth/login");
  }
  return (
    <div className='navbar'>
        <Link to="/">Home</Link>
        {
          cookies.access_token && (
            <div className="dropdown">
              <Link>Recipe Management</Link>
              <div className="dropdown-content">
                <div className="dropdown-content-data">
                  <Link className='font-size-16' to="/create-recipe">Create Recipe</Link>
                  <Link className='font-size-16' to="/saved-recipes">Saved Recipes</Link>
                  <Link className='font-size-16' to="/my-recipes">My Recipes</Link>
                </div>
              </div>
            </div>
          )
        }
        <div className="dropdown">
          <Link>Account</Link>
          <div className="dropdown-content">
            <div className="dropdown-content-data">
              {
                !cookies.access_token ? (
                  <>
                    <Link to="/auth/login" className='font-size-16'>Login</Link>
                    <Link to="/auth/register" className='font-size-16'>Register</Link>
                  </>
                ) : (
                  <Link className='font-size-16' onClick={logout}>Logout</Link>
                )
              }
            </div>
          </div>
        </div>
        {/* <ToastContainer autoClose={2000} /> */}
    </div>
  )
}

export default Navbar;