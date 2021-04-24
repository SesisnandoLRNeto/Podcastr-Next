import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Array<Episode> 
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  hasNext: boolean
  hasPrevious: boolean
  play: (episode: Episode) => void
  playList: (list: Array<Episode>, index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  setPlaying: (state: boolean) => void
  playNext: () => void
  playPrevious: () => void
  clearPlayerState: () => void

}

type PlayerContextProviderProps = {
  children: ReactNode //É qualquer coisa HTML + JSX etc
}

export const PlayerContext = createContext({} as PlayerContextData)
  // episodeList: [],
  // currentEpisodeIndex: 0
//})

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)


  function clearPlayerState () {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }


  function play(episode) : void {
    setEpisodeList([ episode ])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Array<Episode>, index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(): void {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(): void {
    setIsLooping(!isLooping)
  }

  function toggleShuffle(): void {
    setIsShuffling(!isShuffling)
  }

  function setPlaying(state: boolean): void {
    setIsPlaying(state)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext(): void {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious(): void {
    if(hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  const valuesContext = { 
    episodeList, 
    currentEpisodeIndex, 
    clearPlayerState,
    isPlaying,
    isLooping,
    isShuffling,
    play,  
    playList,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlaying,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  }

{/* short - sintax */}
  return ( 
    <PlayerContext.Provider value={valuesContext}>
        {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}