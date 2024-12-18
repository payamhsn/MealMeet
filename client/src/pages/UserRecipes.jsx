import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import Modal from "react-modal";

const server = process.env.REACT_APP_SERVER_URL;

const UserRecipes = () => {
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await axios.get(
          `${server}/recipes/userRecipes/${userID}`,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserRecipes();
  }, [userID, cookies.access_token]);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          My Recipes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {recipe.name}
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {recipe.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {recipe.cookingTime} mins
                  </span>
                  <button
                    onClick={() => openModal(recipe)}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Recipe Details"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        {selectedRecipe && (
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white">
              {selectedRecipe.name}
            </h2>
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.name}
              className="w-full h-64 object-cover mb-6 rounded-lg"
            />
            <p className="text-gray-300 mb-6">{selectedRecipe.description}</p>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">
                Ingredients:
              </h3>
              <ul className="list-disc list-inside text-gray-300">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">
                Instructions:
              </h3>
              <ol className="list-decimal list-inside text-gray-300">
                {selectedRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                Cooking Time: {selectedRecipe.cookingTime} minutes
              </span>
              <button
                onClick={closeModal}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserRecipes;
