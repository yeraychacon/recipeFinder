
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

    useEffect(() => {
        axios.get('/api/finder/getRecipesByIngredients')
            .then((response) => {
                console.log(response.data);
                setRecipes(response.data);
                setLoading(false);

            }).catch((error) => {
                setError('Error obtaining recipes');
                console.error('Error obtaining recipes:', error);
                setLoading(false);
            });
        
    });

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
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-options">
                        <label>
                            <input
                                type="radio"
                                value="ingredient"
                                checked={searchType === 'ingredient'}
                                onChange={() => setSearchType('ingredient')}
                            />
                            By Ingredient
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="type"
                                checked={searchType === 'type'}
                                onChange={() => setSearchType('type')}
                            />
                            By Type
                        </label>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search by ${searchType}`}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </section>
        </main>
    );
};

export default Home;