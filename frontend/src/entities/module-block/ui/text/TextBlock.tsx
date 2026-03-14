'use client'

import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";

type Props = {
    content: TextBlockContent
}

export function TextBlock({ content }: Props) {


    return (
        <div>
            <div
                dangerouslySetInnerHTML={{ __html: content.text }}
            />
        </div>
    )
}