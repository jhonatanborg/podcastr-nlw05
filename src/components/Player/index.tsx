import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePlayer } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationTime } from '../../utils/ConvertDurationTimeToString'
export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        toggleLoop,
        toogleShuffle,
        setPlayingState,
        playNext,
        playPrevius,
        clearPlaylistState,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
    } = usePlayer()
    useEffect(() => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])
    const episode = episodeList[currentEpisodeIndex]
    function setupProgressListener() {
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }
    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }
    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlaylistState()
        }
    }
    return (
        <div className={styles.playerContainer}>
            <header>
                <Image
                    width={30}
                    height={30}
                    src="/playing.svg"
                    alt="Tocando agora"
                />
                <strong>Tocando agora</strong>
            </header>
            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={392}
                        height={392}
                        src={episode.thumbnail}
                        objectFit="cover"
                        alt="Capa do episodio"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationTime(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <div className="">
                                <Slider
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04d361' }}
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{
                                        borderColor: '#04d361',
                                        borderWidth: 4,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationTime(episode?.duration ?? 0)}</span>
                </div>
                {episode && (
                    <audio
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEpisodeEnded}
                        ref={audioRef}
                        src={episode.url}
                        loop={isLooping}
                        autoPlay
                        onLoadedMetadata={setupProgressListener}
                    ></audio>
                )}
                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={() => toogleShuffle()}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <Image
                            width={30}
                            height={30}
                            src="/shuffle.svg"
                            alt="Embaralhar"
                        />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevius}
                    >
                        <Image
                            width={30}
                            height={30}
                            src="/play-previous.svg"
                            alt="Tocar anterior"
                        />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Image
                                width={15}
                                height={15}
                                src="/pause.svg"
                                alt="Parar"
                            />
                        ) : (
                            <Image
                                width={30}
                                height={30}
                                src="/play.svg"
                                alt="Tocar"
                            />
                        )}
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <Image
                            width={30}
                            height={30}
                            src="/play-next.svg"
                            alt="Tocar próxima"
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleLoop()}
                        disabled={!episode}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <Image
                            width={30}
                            height={30}
                            src="/repeat.svg"
                            alt="Tocar novamente"
                        />
                    </button>
                </div>
            </footer>
        </div>
    )
}
