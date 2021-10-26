import '../styles/global.scss'
import { Header } from '../components/header/Index'
import { Player } from '../components/player/Index'
import styles from '../styles/app.module.scss'
import { PlayerContext } from '../context/playerContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlayingIndex] = useState(false);

  function play(episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlayingIndex(true);
  }

  function togglePlay(){
    setIsPlayingIndex(!isPlaying);
  }

  function setPlayState(state : boolean){
    setIsPlayingIndex(state)
  }

  return (
    <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayState}}>
      <div className={styles.wrapper}>

        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />

      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
