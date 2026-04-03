"use client"

import styles from "@/widgets/module/ui/module.module.css";
import {ModuleHero} from "@/widgets/module/ui/ModuleHero";
import {PreviewHeader} from "@/widgets/module-header/PreviewHeader";
import {PreviewModuleContent} from "@/widgets/module/ui/PreviewModuleContent";
import {ModuleBlock} from "@/entities/module-block/model/types";
import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";

type Props = {
    lessonId: string
}

export function ModulePreviewPage({ lessonId }: Props) {

    const blocks : ModuleBlock<any>[] = [
        {
            id: "1",
            type: "text",
            orderIndex: 1,
            content : {text : "text text text text text text texttexttexttext text"} as TextBlockContent
        }
    ]

    return (
        <>
            <PreviewHeader></PreviewHeader>
            <div className={styles.container}>
                <ModuleHero module={1} category={"heloo"} title={"hello"}></ModuleHero>
                <PreviewModuleContent blocks={blocks}></PreviewModuleContent>
            </div>
        </>
    )
}