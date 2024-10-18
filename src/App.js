import React, { useState, useEffect } from 'react';
import Homepage from './pages/Homepage';
import Random from './pages/Random';
import TopTracks from './pages/TopTracks';
import TopArtist from './pages/TopArtist';
import { BrowserRouter as Router, Routes, Route, useHistory } from 'react-router-dom';
import Header from './components/Header';
import RecentlyPlayed from './pages/RecentlyPlayed';


const App = () => {
  // const [lenis, setLenis] = useState(null);
  // useEffect(() => {
  //   // Initialiser Lenis et le stocker dans l'état
  //   const newLenis = new Lenis({
  //     duration: 2.5,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //     direction: 'vertical',
  //     gestureDirection: 'vertical',
  //     smooth: true,
  //     mouseMultiplier: 1,
  //     smoothTouch: false,
  //     touchMultiplier: 2,
  //     infinite: false
  //   });

  //   setLenis(newLenis);

  //   function raf(time) {
  //     newLenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);

  //   return () => {
  //     if (newLenis) newLenis.destroy();
  //   };
  // }, []);




  return (
    <Router>
      <div className='app'>
        <Header />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path='/' element={<Homepage />} />
          <Route path='/random' element={<Random />} />
          <Route path='/topartist' element={<TopArtist />} />
          <Route path='/toptracks' element={<TopTracks />} />
          <Route path='/recently-played' element={<RecentlyPlayed />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
