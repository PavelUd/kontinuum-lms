import styles from "./editor-sidebar.module.css"
import {ArrowLeft} from "lucide-react";
import {BlockLibraryItem, iconMap} from "@/features/editor-sidebar/model/types";
import {BlockType} from "@/entities/module-block/model/types";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";


type Props = {
    moduleId: string
}

export function EditorSidebar({ moduleId }: Props) {

    const createBlock =(type: BlockType, lessonId: string) => {
        const { addBlock, setActiveBlock,  } = useLessonBlocksStore.getState()
        const tempId = addBlock(type, lessonId)
        setActiveBlock(tempId)
    }

    const blocks: BlockLibraryItem[] = [
        { type: "text", icon: "type", color: "blue", label: "Текстовый блок" },
        { type: "heading", icon: "heading", color: "purple", label: "Заголовок" },
        { type: "image", icon: "image", color: "cyan", label: "Изображение" },
        { type: "video", icon: "play-circle", color: "red", label: "Видео" },
        { type: "note", icon: "info", color: "green", label: 'Блок "Внимание"' },
        { type: "tip", icon: "lightbulb", color: "orange", label: 'Блок "Совет"' },
        { type: "spoiler", icon: "eye-off", color: "gray", label: "Скрытый блок" },
        { type: "formula", icon: "variable", color: "blue", label: "Формула (KaTeX)" },
        { type: "code", icon: "code", color: "black", label: "Блок кода" }
    ]

    return (
        <div className={styles.editorSidebar}>
            <div className={styles.blockLibraryHeader}>
                <a href="/admin" className={styles.backLink}>
                    <ArrowLeft size={14} className="icon" />
                    Выход в панель
                </a>

                <h5 className={styles.title}>Библиотека блоков</h5>
            </div>

            {blocks.map(block => {
                const BlockIcon = iconMap[block.type];

                return (
                    <div
                        key={block.type}
                        className={styles.blockEntry}
                        onClick={() => {createBlock(block.type, moduleId)}}
                    >
                        <BlockIcon size={20} style={{ color: block.color }}/>
                        {block.label}
                    </div>
                );
            })}
        </div>
    )
}