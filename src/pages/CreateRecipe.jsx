import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfinitySpin } from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import { useGetUserId } from '../hooks/useGetUserId';
import { useCookies } from "react-cookie";
import { BASE_URL } from "../utilities/urls";

const CreateRecipe = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const userId = useGetUserId();
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name : "",
    ingredients : [],
    instructions : "",
    imageUrl : "",
    cookingTime : "",
    userId : userId
  });
  const hadleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({...recipe, [name] : value});
  }
  const handleIngredientChange = (e, index) => {
    const { value } = e.target;
    const ingredients = recipe.ingredients;
    ingredients[index] = value;
    setRecipe({...recipe, ingredients})
  }
  const addIngredient = () => {
    setRecipe({...recipe, ingredients : [...recipe.ingredients, ""]});
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipe.name == "") {
      toast.error("Name is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    } else if (recipe.instructions == "") {
      toast.error("Instructions is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    } else if (recipe.imageUrl == "") {
      toast.error("Image URL is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    } else if (recipe.cookingTime == "") {
      toast.error("Cooking Time is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    } else if (recipe.instructions == "") {
      toast.error("Instructions is required.", { position: "bottom-right", className: 'foo-bar' });
      return false;
    }
    onSubmit();
    setLoader(true);
  }
  const onSubmit = async (e) => {
    try {
      const response = await axios.post(`${BASE_URL}recipes`,recipe, {
        headers : {
          authorization : cookies.access_token
        }
      });
      if (!response.data.status) {
        toast.error(response.data.message, { position: "bottom-right", className: 'foo-bar' });
        setLoader(false);
        return false;
      }
      toast.success(response.data.message, { position: "bottom-right", className: 'foo-bar' });
      setLoader(false);
      setTimeout(() => { 
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("ERROR : ",error);
    }
  }

  return (
    <div className='create-recipe'>
      <form onSubmit={handleSubmit}>
          <h2 className='color-black'>Create a recipe</h2>
          <div className="form-group">
            <label className='color-black' htmlFor="name">Name : </label>
            <input type="text" id='name' name='name' placeholder='Enter Name' onChange={hadleChange} />
          </div>
          <div className="form-group">
            <label className='color-black' htmlFor="ingredients">Ingredients : </label>
            <button type='button' onClick={addIngredient}>Add Ingredients</button>
            {
              recipe.ingredients.map((ingredient, index) => (
                <input key={index} type="text" name="ingredients" id="" onChange={(e) => handleIngredientChange(e, index)} />
              ))  
            }
          </div>
          <div className="form-group">
            <label className='color-black' htmlFor="instructions">Instructions : </label>
            <input type="text" id='instructions' name='instructions' placeholder='Enter instructions' onChange={hadleChange} />
          </div>
          <div className="form-group">
            <label className='color-black' htmlFor="imageUrl">Image URL : </label>
            <input type="text" id='imageUrl' name='imageUrl' placeholder='Paste Image URL here' onChange={hadleChange} />
          </div>
          <div className="form-group">
            <label className='color-black' htmlFor="cookingTime">Cooking Time : </label>
            <input type="text" id='cookingTime' name='cookingTime' placeholder='Enter cooking time' onChange={hadleChange} />
          </div>
          <div className="form-group">
            <label className='color-black'></label>
            <button type="submit" className={loader ? 'with-loader' : null}>
              Create Recipe
              {
                loader && 
                <InfinitySpin
                  visible={true}
                  width="100"
                  color="#FFF"
                  ariaLabel="infinity-spin-loading"
                  />
              }
              </button>
          </div>
      </form>
      <ToastContainer autoClose={2000} />
    </div>
  )
}

export default CreateRecipe
