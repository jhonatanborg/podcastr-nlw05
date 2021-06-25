import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}
type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    togglePlay: () => void
    toggleLoop: () => void
    toogleShuffle: () => void
    playPrevius: () => void
    playNext: () => void
    clearPlaylistState: () => void
    playList: (list: Episode[], index: number) => void
    setPlayingState: (state: boolean) => void
    play: (episode: Episode) => void
    hasNext: boolean
    hasPrevious: boolean
}
type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({
    children,
}: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setPlaying(true)
    }
    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setPlaying(true)
    }
    function togglePlay() {
        setPlaying(!isPlaying)
    }
    function toggleLoop() {
        setIsLooping(!isLooping)
    }
    function toogleShuffle() {
        setIsShuffling(!isShuffling)
    }
    function setPlayingState(state: boolean) {
        setPlaying(state)
    }
    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

    function clearPlaylistState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }
    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(
                Math.random() * episodeList.length
            )
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }
    function playPrevius() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }
    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                play,
                isLooping,
                isShuffling,
                togglePlay,
                setPlayingState,
                playList,
                playNext,
                playPrevius,
                hasNext,
                hasPrevious,
                toggleLoop,
                toogleShuffle,
                clearPlaylistState,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}
