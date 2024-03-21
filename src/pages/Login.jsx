import React, { useEffect, useState } from 'react'
import { Form } from '../components'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utilities/urls";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (username == "") {
      toast.error("Username is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    } else if (password == "") {
      toast.error("Password is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    }
    login();
    setLoader(true);
  }
  const login = async () => {
    try {
      const response = await axios.post(`${BASE_URL}auth/login`,{ username, password });
      if (!response.data.status) {
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        setLoader(false);
        return false;
      }
      toast.success(response.data.message, { position: "bottom-right", className: 'foo-bar' });
      setCookies("access_token",response.data.token);
      window.localStorage.setItem("userId",response.data.userId);
      setLoader(false);
      setTimeout(() => { 
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoader(false);
      console.log("ERROR : ",error);
    }
  }
  
  
  return (
    <>
      <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      formHeading="Login Form"
      buttonValue="Login"
      onSubmit={onSubmit}
      loader={loader}
      />
      <ToastContainer autoClose={2000} />
    </>
  )
}

export default Login
