import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InfinitySpin } from "react-loader-spinner";
import { useGetUserId } from '../hooks/useGetUserId';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import { BASE_URL } from '../utilities/urls';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loader, setLoader] = useState(true);
  const userId = useGetUserId();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, setCookies] = useCookies(["access_token"])


  useEffect(() => {
    getAllRecipes();
    if(cookies.access_token){
      getAllSavedRecipes();
    }
  }, []);
  
  const getAllRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}recipes`);
      if (!response.data.status) {
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        setLoader(false);
        return false;
      }
      setRecipes(response.data.data);
      setLoader(false);
    } catch (error) {
      console.log("ERROR : ",error);
    }
  }
  const getAllSavedRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}recipes/saved-recipes/ids/${userId}`,{
        headers : {
          authorization : cookies.access_token
        }
      });
      if (response.data.status) {
        setSavedRecipes(response.data.recipeIds);
        console.log(response.data.recipeIds);
      }
    } catch (error) {
      console.log("ERROR : ",error);
    }
  }
  // when we click on save recipes buttons
  const saveRecipes = async (recipeId) => {
    try {
      const response = await axios.put(`${BASE_URL}recipes`,{ recipeId, userId },{
        headers : {
          authorization : cookies.access_token
        }
      });
      console.log(response);
      if (!response.data.status) {
        setSavedRecipes(response.data.savedRecipes);
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        console.log(this);
        return false;
      }
      toast.success(response.data.message, { position: "bottom-right", className: 'foo-bar' });
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.log("ERROR : ",error);
      if (error.response.status == 401) {
        toast.error("Please login first before saving the recipes.", { position: "bottom-right", className: 'foo-bar' });
        return false;
      }
    }
  }
  const isRecipeSaved = (recipeId) => savedRecipes.includes(recipeId);
  
  return (
    <div className="recipes">
      <h2>Recipes</h2>
      <div className="recipes-data">
          {
            loader ? (
              <div style={{textAlign : "center"}}>
                <InfinitySpin visible={true} width="100" color="#000" ariaLabel="infinity-spin-loading" />
              </div>
            ) : (
              recipes.map((recipe) => (
                <div className='single-recipe' key={recipe._id}>
                  <div className='single-recipe-data'>
                    <div>
                      <h2>{recipe.name}</h2>
                    </div>
                    <button onClick={() => saveRecipes(recipe._id)} disabled={isRecipeSaved(recipe._id)}>{isRecipeSaved(recipe._id) ? "saved" : "save"}</button>
                    <div className="instructions">
                      <p>{recipe.instructions.slice(0,120)}...</p>
                    </div>
                    <img className='recipe-image' src={recipe.imageUrl} alt={recipe.name} />
                    <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
                  </div>
                </div>
              ))
            )
          }
        </div>
      <ToastContainer autoClose={2000} />
    </div>
  )
}

export default Home;