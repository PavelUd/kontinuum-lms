import {VideoBlockContent} from "@/entities/module-block/ui/video/video-block-content";


type Props = {
    content: VideoBlockContent
}

export function VideoBlock({ content }: Props) {
    return (

        <div
            style={{
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden"
            }}
        >
            <iframe
                src={content.url}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block"
                }}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
            />
        </div>
    )
}