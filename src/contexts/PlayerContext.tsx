import { createContext, useState, ReactNode, useContext }  from 'react';
//Declaracao de tipagens do component player
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  pause: () => void;
  loop: () => void;
  shuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayingState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  //function para manipular os valores dos values
  
  function play(episode: Episode) {// function - parametro - tipagem
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  //pega toda a lista de episodios, depois pega o index do episodio selecionado
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true); // permite a troca de um ep em execucao para ouvir outro
  }

  function pause(){
    setIsPlaying(!isPlaying);
  }

  function loop(){
    setIsLooping(!isLooping);
  }

  function shuffle(){
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  function clearPlayingState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);;
    }
  }

  function playPrevious() {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider 
    value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      isPlaying,
      isLooping,
      isShuffling,
      playNext,
      playPrevious, 
      pause, 
      setPlayingState,
      hasNext,
      hasPrevious,
      loop,
      shuffle,
      clearPlayingState
      }}>
        {children}
      </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}