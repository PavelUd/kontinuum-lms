import styles from "./editor-sidebar.module.css"
import {ArrowLeft, RotateCcw, Send} from "lucide-react";
import {BlockLibraryItem, iconMap} from "@/features/editor-sidebar/model/types";
import {BlockContent, BlockType} from "@/entities/module-block/model/types";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {getDefaultBlockContent} from "@/entities/module-block/model/block-defaults";
import Link from "next/link";
import {Button} from "@/shared/ui/button/Button";
import {LessonVersionControl} from "@/features/lesson-version-control/LessonVersionControl";


type Props = {
    moduleId: string,
    draftId: string,
    courseId: string
}



export function EditorSidebar({ moduleId,draftId, courseId }: Props) {

    const createBlock = (type: BlockType, lessonId: string, content?: BlockContent) => {
        const { addBlock, setActiveBlock } = useLessonBlocksStore.getState()
        const tempId = addBlock(type, lessonId, content)
        setActiveBlock(tempId)

        return tempId
    }

    const blocks: BlockLibraryItem[] = [
        { type: "text", icon: "type", color: "blue", label: "Текстовый блок" },
        { type: "heading", icon: "heading", color: "purple", label: "Заголовок" },
        { type: "image", icon: "image", color: "cyan", label: "Изображение" },
        { type: "video", icon: "play-circle", color: "red", label: "Видео" },
        { type: "audio", icon: "audio", color: "#FFC107", label: "Аудио" },
        { type: "callout", variant: "note", icon: "info", color: "green", label: 'Блок "Внимание"' },
        { type: "callout", variant: "tip", icon: "lightbulb", color: "orange", label: 'Блок "Совет"' },
        { type: "spoiler", icon: "eye-off", color: "gray", label: "Скрытый блок" },
        { type: "formula", icon: "variable", color: "blue", label: "Формула (KaTeX)" },
        { type: "table", icon: "table", color: "cyan", label: "Таблица" },
        { type: "code", icon: "code", color: "black", label: "Блок кода" },
        { type: "file", icon: "file", color: "gray", label: "Файл для скачивания" },
        { type: "openquestion", icon: "edit3", color: "red", label: "Открытй вопрос" },
        { type: "choicequestion",variant: "Single", icon: "edit3", color: "red", label: "Тест (1 выбор)" },
        { type: "choicequestion",variant:"Multiple",  icon: "", color: "red", label: "Тест (мульти)" },
        {type: "pagebreak", icon:"file", color: "#6c757d", label:"Разрыв страницы"}
    ]

    return (
        <div className={styles.editorSidebar}>
            <div className={styles.blockLibraryHeader}>
                <Link href={`/admin/courses/${courseId}`} className={styles.backLink}>
                    <ArrowLeft size={14} className="icon" />
                    Выход в панель
                </Link>

                <h5 className={styles.title}>Библиотека блоков</h5>
            </div>

            {blocks.map(block => {
                const BlockIcon = iconMap[block.variant ?? block.type];

                const content = !block.variant ? undefined : {
                    ...getDefaultBlockContent(block.type),
                    variant: block.variant
                }

                return (
                    <div
                        key={`${block.type}-${block.variant ?? "default"}`}
                        className={styles.blockEntry}
                        onClick={() => {
                            // @ts-ignore
                            createBlock(block.type, draftId, content)}}
                    >
                        <BlockIcon size={20} style={{ color: block.color }}/>
                        {block.label}
                    </div>
                );
            })}
            <LessonVersionControl lessonId={moduleId} draftId={draftId}></LessonVersionControl>
        </div>
    )
}