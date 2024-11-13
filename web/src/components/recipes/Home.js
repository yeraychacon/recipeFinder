
import logo from '../../styles/images/logo.png';
import React, { useEffect, useState } from 'react';
import axios from "axios";




const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('ingredient');
    const [recipes, setRecipes] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality here
        console.log(`Searching for ${searchTerm} by ${searchType}`);
    };

    

    const findRecipes = async () => {
        axios.get(`/api/finder/getRecipesByIngredients/ingredients=${searchTerm}`)
            .then((response) => {
                console.log(response.data);
                setRecipes(response.data);
            })
            .catch((error) => {
                console.error('Error fetching recipes:', error);
                setError(error);
            })
    };
        

    

    return (
        <main className='home-container' role='main'>
            <header>
                <h1>Welcome to Recipe Finder</h1>
            </header>
            <section>
                <figure>
                    <img className='home-logo' src={logo} alt='Recipe Finder Logo'/>
                </figure>
                <article className="text-container">
                    <h2 className="home-subtitle">
                        Search for a recipe
                        <br /> <br />
                        <p>Recipe Finder is the place to find the best recipes for any dish you want to cook.</p>
                        <p>Enter the name of the dish you want to cook and we will find the recipe for you.</p>
                    </h2>
                </article>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Enter an ingredient"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button type="submit" className="search-button" onClick={findRecipes}>Search</button>
                
            </section>
        </main>
    );
};

export default Home;