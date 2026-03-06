'use client'

import {TextBlockContent} from "@/entities/module-block/model/types";

type Props = {
    content: TextBlockContent
}

export function TextBlock({ content }: Props) {
    return (
        <div>
            {content.title && <h1 className="text-4xl font-bold mb-6">
                {content.title}
            </h1>}

            <div
                dangerouslySetInnerHTML={{ __html: content.text }}
            />
        </div>
    )
}