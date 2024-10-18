import React, {
    useState,
    useEffect,
} from 'react';
import "./RecentlyPlayed.css"
import axios from 'axios';



const RecentlyPlayed = () => {


    const [token, setToken] = useState("");
    const [recentTracks, setRecentTracks] = useState([]);


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
    useEffect(() => {
        if (token) {
            // Récupérer l'historique d'écoute dès que le token est disponible
            fetchRecentlyPlayed();
        }
    }, [token]);

    const fetchRecentlyPlayed = async () => {
        try {
            const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=30`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRecentTracks(response.data.items);
            localStorage.setItem('recentTracks', JSON.stringify(recentTracks));

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique d\'écoute:', error);
        }
    }
    const formatPlayTime = (playedAt) => {
        const playDate = new Date(playedAt);
        return playDate.toLocaleString();
    };


    return (
        <div>
            <div className='recently-played'>
                <h2>Recently Played Tracks</h2>
            </div>
            <div className='tracks-list'>
                {recentTracks.map((item, index) => (
                    <div key={index} className='track-items'>
                        <img src={item.track.album.images[0].url} alt={item.track.name} className='tracks-cover' />
                        <div className='track-info'>
                            <span className='track-name'>{item.track.name}</span>
                            <span className='track-artist'>by {item.track.artists.map(artist => artist.name).join(", ")}</span>
                            <div className='play-time'>Played on: {formatPlayTime(item.played_at)}</div>
                            <a href={item.track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className='spotify-link'><img src='../img/logo.png' alt='spotify-logo' style={{ width: '100px', height: 'auto' }}></img></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default RecentlyPlayed;
