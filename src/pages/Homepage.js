import { useEffect, useState, useCallback, useRef } from 'react';


import './Homepage.css';



function Homepage() {

    const CLIENT_ID = "675022a1324e4432bc318f3777385ae7";
    // const REDIRECT_URL = "https://goattop.netlify.app/";
    const REDIRECT_URL = "http://localhost:3000/";
    // const REDIRECT_URL = "https://yanniszzzz.netlify.app/";
    // const REDIRECT_URL = "https://audioatlas.netlify.app/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPE = [
        'user-top-read',
        'user-read-recently-played',
        // 'playlist-modify-public',
        // 'playlist-modify-private'

    ].join(' ');



    const [token, setToken] = useState("");
    useEffect(() => {
        const hash = window.location.hash;
        let tokenInLocalStorage = window.localStorage.getItem("token");

        if (!tokenInLocalStorage && hash) {
            const newToken = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", newToken);
            setToken(newToken);

            // Rafraîchir la page après avoir défini le nouveau token
            window.location.reload();
        } else {
            setToken(tokenInLocalStorage);
        }
    }, []);


    const handleLogin = () => {

        window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${encodeURIComponent(SCOPE)}&response_type=${RESPONSE_TYPE}`;



    };
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token");
        window.location.reload();
    }




    return (
        <div className='app'>
            <header>
                <div className='header-container'>
                    <div className='homepage-header'>
                        <h1>AudioAtlas</h1>
                    </div>
                    <div className='homepage-subheader'>
                        <h2>Discover a new way to explore your musical universe with Spotify Tops, your personal companion for enriched Spotify experience</h2>
                    </div>
                </div>
            </header>

            <section>
                <div className='card-container'>
                    <div className='card'>
                        <div className='card-title'>
                            <h3>Your Personalized Tops</h3>
                        </div>
                        <div className='card-content'>
                            <p>
                                Dive into a custom-made world of music where your top artists and tracks are showcased, uniquely tailored to your listening habits. Discover your all-time favorites and recent obsessions all in one place!
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-title'>
                            <h3> Random Music Generator</h3>
                        </div>
                        <div className='card-content'>
                            <p>Embark on an exhilarating musical journey with a simple click! Unleash a limitless stream of random tracks across various genres - a perfect way to explore new sounds and uncover hidden gems.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-title'>
                            <h3>Your Music, Your Adventure</h3>
                        </div>
                        <div className='card-content'>
                            <p>Transform your music listening into an epic adventure. Explore new genres, rediscover old favorites, and track your musical journey over time. It's not just listening, it's an adventure in sound!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <div className='footer'>
                    <h3>Ready to explore your musical universe ?</h3>
                    <p>Log in with your Spotify account and start your musical journey today!
                    </p>
                    {!token ?
                        <button className='footer-btn' onClick={handleLogin} > Start Your Experience !</button>
                        : <button onClick={logout} className='footer-btn'>Logout</button>}
                </div>
            </footer>

        </div >
    );
}

export default Homepage;
