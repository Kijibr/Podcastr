import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0); //inicia em 0 e armazena tempo percorrido

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    pause,
    loop,
    shuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayingState,
    hasNext,
    hasPrevious
   } = usePlayer();

   useEffect(() => {
     if(!audioRef.current){
       return;
     }

     if(isPlaying){
       audioRef.current.play();
     }
     else{
       audioRef.current.pause();
     }
   }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0; // ao trocar de ep, o tempo volta ao 0

    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime)); //retorna tempo atual do player
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount; //seta o tempo em que o usuario seleciona com o slider
    setProgress(amount); //mantém dentro da variavel, o quanto ela percorreu no audio
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else {
      clearPlayingState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
          width={592}
          height={592} 
          src={episode.thumbnail} 
          objectFit="cover" 
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>) }
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor:'#04d361' }}
                railStyle={{ backgroundColor:'#9f75ff' }}
                handleStyle={{ borderColor:'#04d361' }}
              />
            ) : (
              <div className={styles.emptySlider} />
              )}
          </div>
        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
          src={episode.url}
          ref={audioRef}
          loop={ isLooping }
          autoPlay
          onEnded={handleEpisodeEnded}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
          type = "button" 
          disabled={!episode || episodeList.length === 1}
          onClick={shuffle}
          className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type = "button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button 
          type = "button" 
          className={styles.playButton} 
          disabled={!episode}
          onClick={pause}
          >
            { isPlaying 
           ? <img src="/pause.svg" alt="Pausar" />
           : <img src="/play.svg" alt="Tocar" /> 
           }
          </button>
          <button type = "button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar Próximo" />
          </button>
          <button 
            type = "button" 
            disabled={!episode}
            onClick={loop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}