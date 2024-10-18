import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';




const Header = () => {
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

        window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${encodeURIComponent(SCOPE)}&response_type=${RESPONSE_TYPE}&scope=user-read-recently-played`;

    };
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token");
        window.location.reload();
    }






    return (
        <div className='header-btn' >
            <div className='btn-left'>
                <Link to='/' className='app-btn'>Home</Link>
                <div className='btn-left'>
                    <Link to='/topartist' className='app-btn'>Top Artists</Link>
                </div>
                <div className='btn-left'>
                    <Link to='/toptracks' className='app-btn'>Top Tracks</Link>
                </div>
                <div className='btn-left'>
                    <Link to='/random' className='app-btn'>Random</Link>
                </div>
                <div className='btn-left'>
                    <Link to='/recently-played' className='app-btn'>Recently Played</Link>
                </div>
            </div>

            {!token ?
                <button className='app-btn' onClick={handleLogin}>Login to Spotify</button>
                : <button onClick={logout} className='app-btn'>Logout</button>}
        </div>
    );
}

export default Header;
