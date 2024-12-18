import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#002c2f] to-[#008585] text-white">
      <header className="p-6">
        <img
          src="/assets/logo2.png"
          alt="MealMeet Logo"
          className="w-32 mb-1"
        />
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-5xl font-bold mb-6">
            Discover, Share, and Cook Together
          </h2>
          <p className="text-xl mb-8">
            Find recipes based on your ingredients, cooking time, and dietary
            preferences. Connect with food lovers and inspire each other's
            culinary journeys.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-[#00c2cb] text-[#272727] hover:bg-[#00a8b0] font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
        <div className="md:w-1/4 flex justify-center">
          <img
            src="/assets/landing-image.jpg"
            alt="Delicious meal"
            className="rounded-lg shadow-2xl max-w-md w-full mb-8"
          />
        </div>
      </main>

      <footer className="p-6 bg-[#272727] bg-opacity-70">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">
              Key Features
            </h3>
            <ul className="list-disc list-inside">
              <li>Comprehensive Recipe Discovery</li>
              <li>Smart Cooking Companion</li>
              <li>Advanced Search Options</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">
              Perfect For
            </h3>
            <ul className="list-disc list-inside">
              <li>Busy professionals</li>
              <li>Home cooks</li>
              <li>Food enthusiasts</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">
              Coming Soon ( Second Phase )
            </h3>
            <ul className="list-disc list-inside">
              <li>Personalized recommendations</li>
              <li>Nutritional information</li>
              <li>Step-by-step cooking guides</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
