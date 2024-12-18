import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddRecipes from "./pages/addRecipes";
import MyRecipes from "./pages/myRecipes";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Login } from "./components/Auth/Login";
import Search from "./pages/Search";
import { Register } from "./components/Auth/Register";
import LandingPage from "./pages/LandingPage";
import UserRecipes from "./pages/UserRecipes";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/my-recipes" element={<MyRecipes />} />
                  <Route path="/user-recipes" element={<UserRecipes />} />
                  <Route path="/add-recipes" element={<AddRecipes />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
