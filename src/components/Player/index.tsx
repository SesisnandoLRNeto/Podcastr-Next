import { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PlayerContext } from '../../contexts/PlayerContext'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import styles from './styles.module.scss'

export default function Player() {

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlaying,
  } = useContext(PlayerContext)

  const episode = episodeList[currentEpisodeIndex]
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if(!audioRef.current) {
      return
    }
    if(isPlaying) audioRef.current.play()
    else audioRef.current.pause()

  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ?
        (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit='cover'
            />
            <strong>{episode.title}</strong>
          </div>
        ) :
        (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={ !episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? 
            (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : 
            (
              <div className={styles.emptySlider}/>
            )
            }
            
          </div>
          <span>00:00</span>
        </div>

        { episode && ( //&& caso queira somente o true e || em caso de false apenas
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlaying(true)}
            onPause={()=> setPlaying(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type='button' disabled={ !episode }>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button >
          <button type='button' disabled={ !episode }>
            <img src="/play-previous.svg" alt="Anterior"/>
          </button>
          <button 
            type='button' 
            className={styles.playButton}
            onClick={togglePlay}  
          >
            { isPlaying 
              ? <img src="/pause.svg" alt='Pause'/>
              : <img src="/play.svg" alt="Play"/>
            }
          </button>
          <button type='button' disabled={ !episode }>
            <img src="/play-next.svg" alt="Proxima"/>
          </button>
          <button type='button' disabled={ !episode }>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>

    </div>
  )
}