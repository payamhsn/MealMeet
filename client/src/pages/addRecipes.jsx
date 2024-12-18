import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const server = process.env.REACT_APP_SERVER_URL;

const AddRecipes = () => {
  const userID = useGetUserID();
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: [],
    imageUrl: "",
    diet: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleInstructionChange = (event, idx) => {
    const { value } = event.target;
    const instructions = [...recipe.instructions];
    instructions[idx] = value;
    setRecipe({ ...recipe, instructions });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const removeIngredient = (idx) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(idx, 1);
    setRecipe({ ...recipe, ingredients });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ""] });
  };

  const removeInstruction = (idx) => {
    const instructions = [...recipe.instructions];
    instructions.splice(idx, 1);
    setRecipe({ ...recipe, instructions });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${server}/recipes`, recipe, {
        headers: { authorization: cookies.access_token },
      });
      alert("Recipe Added!");
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-20 md:pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Add New Recipe</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Recipe Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="diet"
                className="block text-sm font-medium text-gray-300"
              >
                Diet (Veg/Non-Veg)
              </label>
              <select
                name="diet"
                id="diet"
                className="mt-1 block w-full rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                onChange={handleChange}
                value={recipe.diet}
              >
                <option value="">Select Diet</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="mt-1 block w-full rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-300"
            >
              Ingredients
            </label>
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex space-x-2 mt-2">
                <input
                  type="text"
                  name="ingredients"
                  className="flex-grow rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                  value={ingredient}
                  onChange={(event) => handleIngredientChange(event, idx)}
                />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIngredient}
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300"
              type="button"
            >
              Add Ingredient
            </button>
          </div>

          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-300"
            >
              Instructions
            </label>
            {recipe.instructions.map((instruction, idx) => (
              <div key={idx} className="flex space-x-2 mt-2">
                <textarea
                  rows="3"
                  name="instructions"
                  className="flex-grow rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                  value={instruction}
                  onChange={(event) => handleInstructionChange(event, idx)}
                />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addInstruction}
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300"
              type="button"
            >
              Add Instruction
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-300"
              >
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                className="mt-1 block w-full rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="cookingTime"
                className="block text-sm font-medium text-gray-300"
              >
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                name="cookingTime"
                className="mt-1 block w-full rounded-md bg-[#1c1c1c] border-gray-600 text-white shadow-sm focus:border-[#ffc20d] focus:ring focus:ring-[#ffc20d] focus:ring-opacity-50"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipes;
