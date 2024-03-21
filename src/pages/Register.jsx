import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from '../components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utilities/urls";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    register();
    setLoader(true);
  }
  const register = async () => {
    try {
      const response = await axios.post(`${BASE_URL}auth/register`,{ username, password });
      if (!response.data.status) {
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        setLoader(false);
        return false;
      }
      toast.success(response.data.message, { position: "bottom-right", className: 'foo-bar' });
      setLoader(false);
      setTimeout(() => { 
        navigate("/auth/login");
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
      formHeading="Register Form"
      buttonValue="Register"
      onSubmit={onSubmit}
      loader={loader}
      />
      <ToastContainer autoClose={2000} />
    </>
  )
}

export default Register
