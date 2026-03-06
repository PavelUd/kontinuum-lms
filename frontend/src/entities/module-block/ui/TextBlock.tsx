'use client'

import DOMPurify from "dompurify"

type Props = {
    content: string
}

export function TextBlock({ content }: Props) {

    const cleanHtml = DOMPurify.sanitize(content);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    )
}