import React, { useState, useEffect, useRef } from 'react';

function AudioAnalyser({ audioPreviewUrl }) {
    const [averageFrequency, setAverageFrequency] = useState(0);
    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const analyser = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const getFrequencyData = () => {
            const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
            analyser.current.getByteFrequencyData(dataArray);

            // Calcul de la fréquence moyenne
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const avg = sum / dataArray.length;
            setAverageFrequency(Math.round(avg));

            animationFrameId.current = requestAnimationFrame(getFrequencyData);
        };

        if (audioPreviewUrl) {
            fetchAudio(audioPreviewUrl).then(getFrequencyData);
        }

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [audioPreviewUrl]);

    const fetchAudio = async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
        const source = audioContext.current.createBufferSource();
        source.buffer = audioBuffer;

        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 2048;
        source.connect(analyser.current);
        analyser.current.connect(audioContext.current.destination);
        source.start();
    };

    return (
        <div>
            <h2>Current Average Frequency: {averageFrequency} Hz</h2>
        </div>
    );
}

export default AudioAnalyser;
