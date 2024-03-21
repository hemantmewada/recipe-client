import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InfinitySpin } from "react-loader-spinner";
import { useGetUserId } from '../hooks/useGetUserId';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import { BASE_URL } from "../utilities/urls";

const MyRecipes = () => {
  const [myRecipes, setSavedRecipes] = useState([]);
  const [loader, setLoader] = useState(true);
  const userId = useGetUserId();
  const [cookies, setCookies] = useCookies(["access_token"]);
  useEffect(() => {
    getAllMyRecipes();
  }, []);
  
  const getAllMyRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}recipes/${userId}`,{
        headers : {
          authorization : cookies.access_token
        }
      });
      if (response.data.status) {
        setSavedRecipes(response.data.data);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("ERROR : ",error);
    }
  }
  return (
    <div className="recipes">
      <h2>My Recipes</h2>
      <div className="recipes-data">
          {
            loader ? (
              <div style={{textAlign : "center"}}>
                <InfinitySpin visible={true} width="100" color="#000" ariaLabel="infinity-spin-loading" />
              </div>
            ) : (
              myRecipes.map((recipe) => (
                <div className='single-recipe' key={recipe._id}>
                  <div className='single-recipe-data'>
                    <div>
                      <h2>{recipe.name}</h2>
                    </div>
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

export default MyRecipes;