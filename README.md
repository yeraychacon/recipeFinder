# RECIPEFINDER 🍽️

## About the Project 🌟

RecipeFinder is a web application designed to help you discover delicious recipes based on your favorite ingredients. Whether you're looking to explore random recipes, get daily or weekly meal plans, or save your favorite dishes, RecipeFinder has got you covered! 🍲✨

### Key Features

- **Ingredient-Based Search**: Find recipes that match your preferred ingredients. 🥕🍅
- **Random Recipe Exploration**: Browse through a variety of random recipes for inspiration. 🎲🍽️
- **Meal Plans**: Get daily or weekly meal suggestions to simplify your meal planning. 📅🍴
- **Favorites**: Save your favorite recipes for easy access later. ❤️📖

## MICROSERVICES ⚙️

### 1. Authentication Microservice

Welcome to the Authentication Microservice! 🚀

#### Getting Started

Follow these steps to get the authentication service up and running:

#### Prerequisites

Make sure you have the following installed:

- [Python](https://www.python.org/) (version 3.8 or higher)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)

#### Installation ⚙️

1. Activate the virtual environment:

   ```bash
   venv\Scripts\activate
   ```

2. Install the dependencies:
   ```bash
    pip install -r requirements.txt
   ```

#### Configuration ⚙️

1. Create a `.env` file in the root directory and add the necessary environment variables. For `client_id` and `client_secret`, you need to use the keys obtained from the Google Developer Console:
   ```plaintext
   GOOGLE_CLIENT_ID = "your_client_id"
   CLIENT_SECRET = "your_client_secret"
   SECRET_KEY = "your_secret_key"
   ```

### Running the Service

1. Start the service:

   ```bash
    uvicorn main:app --reload
   ```

2. The service should now be running on `http://localhost:8000`.

### 2. RECIPE FINDER MICROSERVICE

This microservice is developed in node.js and is used to obtain recipes by ingredients, random recipes, daily and weekly meal plans.

#### INSTALATION ⚙️

To run it, tou need to download or clone the repository and have Node.js installed.

You need to download the following dependencies:

**axios, config, dotenv, express, nodemon and spoonacular**

To do this, run the following command:

    npm install axios config dotenv express nodemon mongoose spoonacular

#### EXECUTION ▶️

To run the project, simply execute the following command:

    npm start

## GATEWAY

### 🌐 Gateway Service Overview

The **Gateway Service** acts as an intermediary between the frontend and backend of the project. It is responsible for routing requests from the client to the appropriate backend microservices. This project consists of two microservices that handle different aspects of the application's functionality.

### 🚀 How to Start the Gateway

1. **Install Dependencies** 📦

   ```sh
   npm install
   ```

2. **Start the Gateway** 🏃
   ```sh
   node gateway.js
   ```

## FRONTEND

### 🌟 Frontend Overview

The **Frontend** is the user interface of the RecipeFinder application. It is developed using React, a popular JavaScript library for building user interfaces. The frontend allows users to interact with the application, search for recipes, view meal plans, and manage their favorite dishes.

### 🚀 How to Start the Frontend

1. **Install Dependencies** 📦

   ```sh
   npm install
   ```

2. **Start the Frontend** 🏃

   ```sh
   npm start
   ```

The frontend should now be running on `http://localhost:3000`.
