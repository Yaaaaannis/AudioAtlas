import { useEffect, useState, useCallback } from 'react';
import './Homepage.css';
import axios from 'axios';
import Tilt from 'react-parallax-tilt';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TopTracks = () => {

    const [token, setToken] = useState("");
    const [topTracks, setTopTracks] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");




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


    const getTopTracks = useCallback(async () => {
        try {
            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTopTracks(data.items);
            localStorage.setItem('topTracks', JSON.stringify(topTracks));

        } catch (error) {
            console.log(error);
        }
    }, [timeRange, token])

    useEffect(() => {
        if (token) {
            getTopTracks();
        }
    }, [token, getTopTracks]); // inclure les fonctions comme dépendances




    const renderTopTracks = () => {
        const topTracksCards = topTracks.slice(0, 3).map((track, index) => (
            <Tilt>
                <div key={track.id} className="top-tracks-card">
                    {track.album.images.length ? (
                        <img src={track.album.images[0].url} alt={track.name} className="track-image" />
                    ) : (
                        <div className="no-image">No Image</div>
                    )}
                    <div className="track-info">
                        <span className="track-number">{index + 1}.</span>
                        <span className="track-name">{track.name}</span>
                        <a className='spotify-link' href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <img src='../img/logo.png' alt='spotify-logo' className='spotify-logo' style={{ width: '150px', height: 'auto' }} />
                        </a>
                    </div>
                </div>
            </Tilt>
        ));

        const restOfTracksList = topTracks.slice(3).map((track, index) => (
            <div key={track.id} className="rest-tracks"
                ref={el => {
                    gsap.from(el, {
                        opacity: 0,
                        y: 50,
                        x: -100, // déplacement vertical pour l'effet
                        duration: 1,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%", // début de l'animation quand l'élément est à 80% du viewport
                            toggleActions: "play none none reverse"
                        }
                    });
                }}>
                {track.album.images.length ? (
                    <img src={track.album.images[0].url} alt={track.name} className="rest-tracks-image" />
                ) : (
                    <div className="no-image">No Image</div>
                )}
                <div className="rest-tracks-info">
                    <span className="rest-tracks-number">{index + 4}.</span>
                    <span className="rest-tracks-name">{track.name}</span>
                    <a className='spotify-link' href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        <img src='../img/logo.png' alt='spotify-logo' className='spotify-logo' style={{ width: '100px', height: 'auto' }} />
                    </a>
                </div>
            </div>
        ));

        return (
            <>
                <div className="top-tracks-container">{topTracksCards}</div>
                <div className="rest-tracks-list">{restOfTracksList}</div>
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

                {topTracks.length > 0 && renderTopTracks()}


            </div>




        </div >
    );
}

export default TopTracks;
