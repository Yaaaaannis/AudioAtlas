import { useEffect, useState, useCallback } from 'react';
import './Homepage.css';
import axios from 'axios';
import Tilt from 'react-parallax-tilt';
import { gsap } from 'gsap';
import Modal from '../components/Modal';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const TopArtist = () => {

    const [token, setToken] = useState("");
    const [topArtists, setTopArtists] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");

    const [selectedArtist, setSelectedArtist] = useState(null);
    const [animationsEnabled, setAnimationsEnabled] = useState(true); // État pour contrôler les animations


    const showArtistModal = (artist) => {
        setAnimationsEnabled(false); // Désactive les animations
        setSelectedArtist(artist);
    }

    const hideModal = () => {
        setSelectedArtist(null);
        setAnimationsEnabled(false); // Réactive les animations
    };

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, []);

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        setToken(token)
    }, [])




    const getTopArtists = useCallback(async () => {
        try {
            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTopArtists(data.items);
            localStorage.setItem('topArtists', JSON.stringify(topArtists));

        } catch (error) {
            console.error(error);
        }
    }, [timeRange, token])

    useEffect(() => {
        if (token) {
            getTopArtists();
        }
    }, [token, getTopArtists]);



    const renderTopArtists = () => {
        // Cartes pour les trois premiers artistes
        const topArtistCards = topArtists.slice(0, 3).map((artist, index) => (
            <Tilt key={artist.id} >
                <div className="top-artist-card" onClick={() => showArtistModal(artist)}>
                    {artist.images.length ? (
                        <img src={artist.images[0].url} alt={artist.name} className="artist-image" />
                    ) : (
                        <div className="no-image">No Image</div>
                    )}
                    <div className="artist-info">
                        <span className="artist-number">{index + 1}.</span>
                        <span className="artist-name">{artist.name}</span>
                        <a className='spotify-link' href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <img src='../img/logo.png' alt='spotify-logo' style={{ width: '150px', height: 'auto' }} />
                        </a>
                    </div>
                </div>
            </Tilt>

        ));

        // Liste pour les artistes restants
        const restOfArtistsList = topArtists.slice(3).map((artist, index) => (


            <div key={artist.id} className="resst-artist" onClick={() => showArtistModal(artist)} ref={el => {
                if (animationsEnabled && el) {
                    gsap.from(el, {
                        opacity: 0,
                        y: 50,
                        x: 100,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    });
                }
            }}>
                {artist.images.length ? (
                    <img src={artist.images[0].url} alt={artist.name} className="rest-artist-image" />

                ) : (
                    <div className="no-image">No Image</div>
                )}
                <div className="resst-artist-info">
                    <span className="resst-artist-number">{index + 4}.</span>
                    <span className="resst-artist-name">{artist.name}</span>

                    <a className='spotify-link' href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer"><img src='../img/logo.png' alt='spotify-logo' style={{ width: '100px', height: 'auto' }}></img></a>
                </div>
            </div>

        ));


        return (
            <>
                <div className="top-artists-container">{topArtistCards}</div>
                <div className="rest-artists-list">{restOfArtistsList}</div>
                <Modal artist={selectedArtist} onClose={hideModal} />
            </>
        );
    };
    const setTimeRangeAndRefresh = (newTimeRange) => {
        window.localStorage.setItem("timeRange", newTimeRange);
        window.location.reload();
    };

    useEffect(() => {
        const savedTimeRange = window.localStorage.getItem("timeRange");
        if (savedTimeRange) {
            setTimeRange(savedTimeRange);
        }
    }, []);

    return (
        <div className='app'>

            <header className='app-header'>
                <h1>Your Spotify Tops</h1>
            </header>
            <div className='content'>
                <div className='buttons'>




                </div>
                <div className='time-buttons'>
                    <button className='app-btn' onClick={() => setTimeRangeAndRefresh('short_term')}>3 Months</button>
                    <button className='app-btn' onClick={() => setTimeRangeAndRefresh('medium_term')}>6 Months</button>
                    <button className='app-btn' onClick={() => setTimeRangeAndRefresh('long_term')}>1 Year</button>
                </div>

                {topArtists.length > 0 && renderTopArtists()}


            </div>




        </div >
    );
}

export default TopArtist;
