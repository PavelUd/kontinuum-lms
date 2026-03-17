import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import styles from "./video.module.css"
import React, {useMemo, useState} from "react";

type Props = {
    url?: string;
    onError: () => void
};

export const VideoPreview = React.memo(function VideoPreview({ url = "", onError }: Props) {

    const isLocalVideo = /\.(mp4|webm|ogg)$/i.test(url);
    const [isReady, setReady] = useState(false);
    const source = useMemo(() => ({
        type: "video" as const,
        sources: [{ src: url, type: "video/mp4" }]
    }), [url])

    const options = useMemo(() => ({
        controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "fullscreen"
        ]
    }), [])

    return (
        <div className={styles.videoPreviewWrapper}>

            {!isReady && (
                <div className={styles.videoPlaceholder}></div>
            )}
            { isLocalVideo ? (

                <Plyr
                    onCanPlayThrough ={() => setReady(true)}
                    onError={onError}
                    source={source}
                    options={options}
                />

            ) : (

                <div className={styles.videoIframeWrapper}>
                    <iframe
                        onLoad={() => setReady(true)}
                        onError={onError}
                        src={url}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        frameBorder="0"
                    />
                </div>
            )}
        </div>
    );
})