import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// Retrieve all recipes from the database
router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving recipes",
      error: err.message,
    });
  }
});

// Create a new recipe using data from the request body
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error creating recipe",
      error: err.message,
    });
  }
});

// Add a recipe to a user's list of saved recipes
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({
      message: "Error to favourite a recipe",
      error: err.message,
    });
  }
});

// Fetch saved recipe IDs for a user
router.get("/addRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.status(500).json({
      message: "Error in Fetch saved recipe IDs for a user",
      error: err.message,
    });
  }
});

// Fetch and return the actual saved recipes for a user
router.get("/myRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.status(500).json({
      message: "Error in Fetch and return the actual saved recipes for a user",
      error: err.message,
    });
  }
});

// Fetch recipes created by a specific user
router.get("/userRecipes/:userID", async (req, res) => {
  try {
    const userRecipes = await RecipeModel.find({
      userOwner: req.params.userID,
    });
    res.json(userRecipes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user's recipes",
      error: err.message,
    });
  }
});

export { router as recipesRouter };
