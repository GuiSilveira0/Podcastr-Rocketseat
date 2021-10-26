import { useContext, useRef, useEffect, useState } from 'react';
import { PlayerContext } from '../../context/playerContext';
import styles from './styles.module.scss'
import Slider from 'rc-slider';
import 'rc-slider/assets/Index.css'
import Image from 'next/image';
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayState } = useContext(PlayerContext)

    const [progress, setProgress] = useState(0);

    

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }

    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
    
        audioRef.current.addEventListener('timeupdate', () => {
          setProgress(Math.floor(audioRef.current.currentTime))
        })
      }

      function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
    
        setProgress(amount)
      }
    
    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando Agora</strong>
            </header>

            { episode ? (

                <div className={styles.currentEpisode}>
                    <Image width={500} height={500} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) : (

            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>
           
           ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider trackStyle={{backgroundColor: '#04d361'}} railStyle={{backgroundColor:'#9f75ff'}} handleStyle={{borderColor: '#04d361', borderWidth: '4'}} max={episode.duration} value={progress} onChange={handleSeek}/>
                        ) : 
                        (
                            <div className={styles.emptySlider} />
                        )
                    }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>

                    { episode && (
                        <audio src={episode.url} ref={audioRef} autoPlay onPlay={() => [setPlayState(true), setupProgressListener()]} onPause={() => setPlayState(false)}/>
                    )}


                </div>
                <div className={styles.buttons}>
                    <button type='button' disabled={!episode}>
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src="/play-previous.svg" alt="Anterior" />
                    </button>
                    <button type='button' className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying ?  <img src="/pause.svg" alt="Pausar" />  : <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src="/play-next.svg" alt="Próxima" />
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>

                </div>
            </footer>
        </div>
    );
}