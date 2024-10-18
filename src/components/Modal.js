import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import "./Modal.css";



const Modal = ({ artist, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topTracks, setTopTracks] = useState([]);
    const [recentAlbums, setRecentAlbums] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
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
    // useEffect(() => {
    //     // Optionnel: Vous pourriez vouloir vérifier si ScrollTrigger est disponible
    //     if (ScrollTrigger) {
    //         // Rafraîchir ScrollTrigger lorsque le modal s'ouvre ou se ferme
    //         ScrollTrigger.refresh();
    //         setTimeout(() => ScrollTrigger.refresh(), 100);

    //         // Optionnel: Retarder le refresh pour vous assurer que le DOM a été mis à jour
    //         // setTimeout(() => ScrollTrigger.refresh(), 100);
    //     }
    // }, [isModalOpen]); // Dépendance à isModalOpen

    // Reste de votre composant, incluant la logique pour ouvrir et fermer le modal...
    useEffect(() => {
        const fetchArtistData = async () => {
            if (!artist || !token) return;

            try {
                const topTracksRes = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTopTracks(topTracksRes.data.tracks.slice(0, 3));

                const recentAlbumsRes = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&limit=5`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecentAlbums(recentAlbumsRes.data.items);

                const relatedArtistsRes = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRelatedArtists(relatedArtistsRes.data.artists.slice(0, 3));
            } catch (error) {
                console.error('Error fetching artist data', error);
            }
        };

        fetchArtistData();
    }, [artist, token]);

    if (!artist) return null;

    const modalClasses = `modal-backdrop ${artist ? 'active' : ''}`;

    const truncateText = (text, length) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };


    return (
        <div className={modalClasses}>
            <div className='modal'>
                <div className='modal-artist-name'>
                    <h2>{artist.name}</h2>
                    <p>Genre: {artist.genres[0]}</p>
                </div>
                <div className='modal-artist-toptracks'>
                    <h3>Top Tracks :</h3>
                    <ul>
                        {topTracks.map(track => (
                            <li key={track.id}><a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">{track.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className='modal-albums'>
                    <h3>Recent Albums :</h3>
                    <ul>
                        {recentAlbums.slice(0, 3).map(album => (

                            <li key={album.id}><a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">{album.images.length > 0 && (
                                <img src={album.images[0].url} alt={album.name} className='album-image' />
                            )}
                                <p className='truncate'>{truncateText(album.name, 20)}</p>
                            </a></li>


                        ))}
                    </ul>
                </div>
                <div className='modal-recommandation'>
                    <h3>Related Artists:</h3>
                    <ul>
                        {relatedArtists.map(artist => (
                            <li key={artist.id}><a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className='modal-btn-container'>
                    <button className='modal-btn' onClick={onClose}>Close</button>
                </div>

            </div>
        </div>
    );

}


export default Modal;
