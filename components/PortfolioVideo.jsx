import React from 'react';
import styles from './PortfolioVideo.module.css';

const PortfolioVideo = () => {
  return (
    <div className={styles.portfolioVideoContainer}>
      <iframe
        src="https://player.vimeo.com/video/1067508106?h=343f245390&autoplay=0&loop=0"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className={styles.portfolioVideo}
        title="Demo Video"
      ></iframe>
    </div>
  );
};

export default PortfolioVideo; 