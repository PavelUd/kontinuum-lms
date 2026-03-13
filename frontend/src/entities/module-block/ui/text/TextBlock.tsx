'use client'

import {TextBlockContent} from "@/entities/module-block/model/types";

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