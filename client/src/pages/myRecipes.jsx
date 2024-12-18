import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
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

  pdf.save(`${recipe.name}.pdf`);
};

const MyRecipes = () => {
  const userID = useGetUserID();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `${server}/recipes/myRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipe();
  }, [userID]);

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
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
        My Favourites
      </h1>
      {!savedRecipes || savedRecipes.length === 0 ? (
        <p className="text-white md:px-10 px-5 mt-5">
          You haven't saved any recipes yet!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedRecipes.map((recipe) => (
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
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Recipe Modal"
        className="ReactModal__Content relative h-[90vh] w-[90vw] bg-[#272727] flex flex-col rounded-lg"
        overlayClassName="ReactModal__Overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {selectedRecipe && (
          <div className="p-6 overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
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
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedRecipe.name}
            </h2>
            <p className="text-gray-300 mb-4">{selectedRecipe.description}</p>
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#ffc20d]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white">
                {selectedRecipe.cookingTime} minutes
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Ingredients:
            </h3>
            <ul className="list-disc list-inside mb-4 text-gray-300">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-white mb-2">
              Instructions:
            </h3>
            <ol className="list-decimal list-inside text-gray-300">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            <button
              onClick={() => generatePDF(selectedRecipe)}
              className="mt-6 bg-[#ffc20d] text-white py-2 px-4 rounded hover:bg-[#e8b416] transition duration-300"
            >
              Download Recipe PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyRecipes;
