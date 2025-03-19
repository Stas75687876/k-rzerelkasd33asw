import React from 'react';
import styles from './HeroBackground.module.css';

const HeroBackground = () => {
  return (
    <div className={styles.heroBackground}>
      <iframe
        src="https://player.vimeo.com/video/1067507561?h=48d0275128&autoplay=1&loop=1&background=1&muted=1"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        className={styles.heroVideo}
        title="Hero Background Video"
      ></iframe>
    </div>
  );
};

export default HeroBackground; 