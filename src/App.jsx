import { useState } from 'react';
import { BrowserRouter, Route, Routes }  from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateRecipe from "./pages/CreateRecipe";
import Register from "./pages/Register";
import SavedRecipes from "./pages/SavedRecipes";
import PageNotFound from "./pages/PageNotFound";
import { Navbar } from './components';
import "./App.css";
import {useCookies} from "react-cookie";
import MyRecipes from './pages/MyRecipes';

function App() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/auth/register' element={<Register />} />
          <Route path='/create-recipe' element={cookies.access_token ? <CreateRecipe /> : ( <Home /> )} />
          <Route path='/saved-recipes' element={cookies.access_token ? <SavedRecipes /> : ( <Home /> )} />
          <Route path='/my-recipes' element={cookies.access_token ? <MyRecipes /> : ( <Home /> )} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
