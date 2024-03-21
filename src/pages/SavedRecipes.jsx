import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InfinitySpin } from "react-loader-spinner";
import { useGetUserId } from '../hooks/useGetUserId';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import { BASE_URL } from "../utilities/urls";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loader, setLoader] = useState(true);
  const userId = useGetUserId();
  const [cookies, setCookies] = useCookies(["access_token"]);
  useEffect(() => {
    getAllSavedRecipes();
  }, []);
  
  const getAllSavedRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}recipes/saved-recipes/${userId}`,{
        headers : {
          authorization : cookies.access_token
        }
      });
      if (response.data.status) {
        setSavedRecipes(response.data.savedRecipes);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("ERROR : ",error);
    }
  }
  
  const removeRecipe = async (recipeId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}recipes/remove`,
        { recipeId, userId },
        { headers : { authorization : cookies.access_token } }
      );
      if (!response.data.status) {
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        return false;
      }
      toast.success(response.data.message, { position: "bottom-right", className: 'foo-bar' });
      getAllSavedRecipes();
    } catch (error) {
      console.log("ERROR : ",error);
      if (error.response.status == 401) {
        toast.error("Please login first before saving the recipes.", { position: "bottom-right", className: 'foo-bar' });
        return false;
      }
    }
  }
  return (
    <div className="recipes">
      <h2>Saved Recipes</h2>
      <div className="recipes-data">
          {
            loader ? (
              <div style={{textAlign : "center"}}>
                <InfinitySpin visible={true} width="100" color="#000" ariaLabel="infinity-spin-loading" />
              </div>
            ) : (
              savedRecipes.map((recipe) => (
                <div className='single-recipe' key={recipe._id}>
                  <div className='single-recipe-data'>
                    <div>
                      <h2>{recipe.name}</h2>
                    </div>
                    <button onClick={() => removeRecipe(recipe._id)}>remove</button>
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

export default SavedRecipes;