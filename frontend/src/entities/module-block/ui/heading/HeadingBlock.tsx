'use client'

import {HeadingBlockContent} from "@/entities/module-block/model/types";

type Props = {
    content: HeadingBlockContent
}

export function HeadingBlock({ content }: Props) {

    return (
        <div>
            {content.text && <h2 className="text-3xl font-bold">
                {content.text}
            </h2>
            }
        </div>
    )
}