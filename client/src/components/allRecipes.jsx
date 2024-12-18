import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import jsPDF from "jspdf";

const server = process.env.REACT_APP_SERVER_URL;

const generatePDF = (recipe) => {
  const pdf = new jsPDF();
  const margin = 20;
  const fontSize = 12;
  let textY = 20;

  pdf.setFontSize(16);
  pdf.text(margin, textY, recipe.name);

  pdf.setFontSize(fontSize);
  const lines = pdf.splitTextToSize(
    recipe.instructions,
    pdf.internal.pageSize.width - 2 * margin
  );
  lines.forEach((line) => {
    pdf.text(margin, (textY += fontSize), line);
  });

  textY += 10; // Add some space between paragraphs

  pdf.text(margin, textY, `Cooking Time: ${recipe.cookingTime} min`);

  textY += 15; // Add space before the Ingredients section

  pdf.setFontSize(14); // Set font size for Ingredients section
  pdf.text(margin, textY, "Ingredients:");
  pdf.setFontSize(fontSize);
  // Loop through the ingredients and add them to the PDF
  recipe.ingredients.forEach((ingredient) => {
    pdf.text(margin, (textY += fontSize), `- ${ingredient}`);
  });

  pdf.save(`${recipe.name}.pdf`);
};

const AllRecipes = () => {
  const userID = useGetUserID();
  const [recipe, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);

  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedCookingTime, setSelectedCookingTime] = useState(null);
  // For modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${server}/recipes`);
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${server}/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
    if (cookies.access_token) fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        `${server}/recipes`,
        { recipeID, userID },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes && savedRecipes.includes(id);

  const filterRecipes = () => {
    return recipe.filter((recipe) => {
      const dietMatch = !selectedDiet || recipe.diet === selectedDiet;
      const timeMatch =
        !selectedCookingTime ||
        (selectedCookingTime === "under15" && recipe.cookingTime < 15) ||
        (selectedCookingTime === "15to30" &&
          recipe.cookingTime >= 15 &&
          recipe.cookingTime <= 30) ||
        (selectedCookingTime === "over30" && recipe.cookingTime > 30);
      return dietMatch && timeMatch;
    });
  };

  const clearFilters = () => {
    setSelectedDiet(null);
    setSelectedCookingTime(null);
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">All Recipes</h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Diet</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDiet(null)}
              className={`px-4 py-2 rounded-full ${
                !selectedDiet ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDiet("veg")}
              className={`px-4 py-2 rounded-full ${
                selectedDiet === "veg"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setSelectedDiet("non-veg")}
              className={`px-4 py-2 rounded-full ${
                selectedDiet === "non-veg"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Cooking Time</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCookingTime("under15")}
              className={`px-4 py-2 rounded-full ${
                selectedCookingTime === "under15"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Under 15 min
            </button>
            <button
              onClick={() => setSelectedCookingTime("15to30")}
              className={`px-4 py-2 rounded-full ${
                selectedCookingTime === "15to30"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              15 to 30 min
            </button>
            <button
              onClick={() => setSelectedCookingTime("over30")}
              className={`px-4 py-2 rounded-full ${
                selectedCookingTime === "over30"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Over 30 min
            </button>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300"
        >
          Clear Filters
        </button>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filterRecipes().map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {recipe.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {recipe.description.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {recipe.cookingTime} min
                </span>
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}
                  className={`p-2 rounded-full ${
                    isRecipeSaved(recipe._id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => openModal(recipe)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filterRecipes().map((recipe) => (
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Recipe Modal"
        className="ReactModal__Content relative h-[90vh] w-[90vw] bg-white rounded-lg p-8 overflow-auto"
        overlayClassName="ReactModal__Overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedRecipe && (
          <div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedRecipe.name}</h2>
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <p className="text-gray-700 mb-4">{selectedRecipe.description}</p>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside">
                {selectedRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllRecipes;
