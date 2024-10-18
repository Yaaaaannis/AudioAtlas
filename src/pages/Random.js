import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Random.css';
import Spinner from '../components/Spinner';
import AudioAnalyser from '../components/AudioAnalyser';

function Random() {
    const [randomTrack, setRandomTrack] = useState(null);
    const [token, setToken] = useState("");
    const [storedTracks, setStoredTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.1);
    const audioPlayer = useRef(null); // Utilisez useRef pour conserver la même instance de Audio






    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }
        setToken(token);
    }, []);



    const saveArtist = (artist) => {
        const storedArtists = JSON.parse(localStorage.getItem('randomArtists')) || [];
        storedArtists.push(artist);
        localStorage.setItem('randomArtists', JSON.stringify(storedArtists));
    };

    const fetchRandomTrack = async () => {
        if (isPlaying) {
            audioPlayer.current.pause();
            setIsPlaying(false);
            audioPlayer.current = null;
        }

        setIsLoading(true);

        const genres = ['rock', 'pop', 'jazz', 'metal', 'disco', 'classical', 'rap', 'french', 'hip-hop', 'r-n-b', 'k-pop'];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];

        try {
            const response = await axios.get(`https://api.spotify.com/v1/search?q=genre:${randomGenre}&type=track`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const tracks = response.data.tracks.items;
            const newRandomTrack = tracks[Math.floor(Math.random() * tracks.length)];

            setTimeout(() => { // Ajoute un délai de 1.5 seconde
                setRandomTrack(newRandomTrack);
                setAudioPreviewUrl(newRandomTrack.preview_url);
                if (newRandomTrack) {
                    saveArtist(newRandomTrack.artists[0]);
                }
                setIsLoading(false); // Termine le chargement
            }, 1200);

        } catch (error) {
            console.error(error);
            setIsLoading(false); // En cas d'erreur, termine le chargement
        }
    };

    const saveTrack = () => {
        const newStoredTracks = [...storedTracks, randomTrack];
        const isTrackAlreadySaved = storedTracks.some(track => track.id === randomTrack.id);
        if (!isTrackAlreadySaved) {
            const newStoredTracks = [...storedTracks, randomTrack];
            setStoredTracks(newStoredTracks);
            localStorage.setItem('randomTracks', JSON.stringify(newStoredTracks));
        }
        else {
            alert('This song is already saved !');
        }
    };
    useEffect(() => {
        const tracks = JSON.parse(localStorage.getItem('randomTracks')) || [];
        setStoredTracks(tracks);
    }, []);
    const deleteTrack = (index) => {
        const newStoredTracks = storedTracks.filter((_, i) => i !== index);
        setStoredTracks(newStoredTracks);
        localStorage.setItem('randomTracks', JSON.stringify(newStoredTracks));
    };


    const playPreview = () => {
        if (!audioPlayer.current) {
            audioPlayer.current = new Audio(audioPreviewUrl);
            audioPlayer.current.volume = volume; // Appliquer le volume initial
        }

        if (isPlaying) {
            audioPlayer.current.pause();
        } else {
            audioPlayer.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioPlayer.current) {
            audioPlayer.current.volume = newVolume;
        }
    };

    const createPlaylist = async () => {
        try {
            // Obtention de l'ID de l'utilisateur
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = userResponse.data.id;

            // Création de la playlist
            const playlistResponse = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                { name: "My New Playlist" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const playlistId = playlistResponse.data.id;

            // Ajout de morceaux à la playlist
            const trackUris = storedTracks.map(track => track.uri); // Assurez-vous que storedTracks contient les URI des morceaux
            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { uris: trackUris },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Playlist created !");
        } catch (error) {
            console.error("Error : ", error);
        }
    };

    return (
        <div className='random'>
            <div className='first-block'>
                <div className='btn-container'>
                    <button className='app-btn' onClick={fetchRandomTrack}>Generate a random song</button>
                </div>
                {isLoading ? (
                    <Spinner />
                ) :
                    randomTrack && (
                        <div className='main-random'>
                            <h3>{randomTrack.name} par {randomTrack.artists[0].name}</h3>
                            <img src={randomTrack.album.images[0].url} alt="album cover" />
                            <a className='spotify-link' href={randomTrack.external_urls.spotify} target="_blank" rel="noopener noreferrer"><img src='../img/logo.png' alt='spotify-logo' style={{ width: '150px', height: 'auto' }}></img></a>
                            <div>
                                <input
                                    type="range"
                                    min="0"
                                    max=".5"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                            {audioPreviewUrl && (
                                <button className='app-btn' onClick={playPreview}>
                                    {isPlaying ? 'Pause Preview' : 'Play Preview'}
                                </button>
                            )}
                            <button className='app-btn' onClick={saveTrack}>Save This Song</button>

                        </div>

                    )}

            </div>
            <div className='random-map'>
                <div className='random-details'>
                    <h2>Your saved songs :</h2>
                    <div className='create-playlist'>
                        <button className='app-btn' onClick={createPlaylist}>Create Playlist</button>
                    </div>
                    <div className='track-container'>
                        {storedTracks.map((track, index) => (
                            <div key={`track-${index}`} className='track-item'>
                                <img src={track.album.images[0].url} alt="album cover" />
                                <h3>{track.name} par {track.artists[0].name}</h3>
                                <div className='links-container'>
                                    <a className='spotify-links' href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer"><img src='../img/logo.png' alt='spotify-logo' style={{ width: '70px', height: 'auto', objectFit: 'cover' }}></img></a>
                                    <button className="tooltip" onClick={() => deleteTrack(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                            <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                        </svg>
                                        <span className="tooltiptext">remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    );

}

export default Random;
