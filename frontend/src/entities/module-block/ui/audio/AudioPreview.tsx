import {useRef, useState, useMemo, useEffect} from "react";
import {Plyr} from "plyr-react";
import type { APITypes } from "plyr-react";
import {Headphones, Pause} from "lucide-react";
import styles from "./audio.module.css"

type Props = {
    url?: string;
    caption?: string;
    onError: () => void
};

export function AudioBlockPreview({ url = "", caption, onError }: Props) {

    const playerRef = useRef<APITypes | null>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    const speeds = [0.5, 1, 2]

    const source = useMemo(() => ({
        type: "audio" as const,
        sources: [
            {
                src: url,
                type: "audio/mp3"
            }
        ]
    }), [url])

    const options = useMemo(() => ({
        controls: [
            "progress",
            "current-time",
            "duration"
        ]
    }), [])

    const togglePlay = () => {
        const player = playerRef.current?.plyr
        if (!player) return
        if (player.playing) {
            player.pause()
            setIsPlaying(false)
        } else {
            player.play()
            setIsPlaying(true)
        }
    }

    const changeSpeed = (value: number) => {

        const player = playerRef.current?.plyr
        if (!player) return

        player.speed = value
        setSpeed(value)
    }

    return (
        <div className={styles.audioPlaceholder}>

            <div className={styles.audioHeader}>

                {isPlaying ? (
                    <Pause
                        size={40}
                        className={styles.audioIcon}
                        onClick={togglePlay}
                    />
                ) : (
                    <Headphones
                        size={40}
                        className={styles.audioIcon}
                        onClick={togglePlay}
                    />
                )}

                <div>
                    <div className={styles.audioTitle}>
                        {caption}
                    </div>

                    <div className={styles.audioHint}>
                        Нажмите на иконку для прослушивания
                    </div>
                </div>

            </div>

            <div className={styles.audioControls}>

                <div className={styles.audioPlayer}>
                    <Plyr
                        ref={playerRef}
                        source={source}
                        options={options}
                        onError={onError}
                    />
                </div>

                <div className={styles.speedControls}>
                    {speeds.map((s) => (
                        <button
                            key={s}
                            className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""}`}
                            onClick={() => changeSpeed(s)}
                        >
                            {s}x
                        </button>
                    ))}
                </div>

            </div>

        </div>
    )
}