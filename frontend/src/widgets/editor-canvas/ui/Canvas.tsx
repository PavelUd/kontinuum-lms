import {CanvasHeader} from "@/widgets/editor-canvas/ui/CanvasHeader";
import {CanvasContent} from "@/widgets/editor-canvas/ui/CanvasContent";
import styles from "./canvas.module.css"
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {useMutation} from "@tanstack/react-query";
import {updateModuleTitle} from "@/entities/module/api/module.api";
import {queryClient} from "@/shared/api";

type Props = {
    moduleTitle: string,
    moduleId: string,
    courseId: string
}

export function Canvas({  moduleTitle, moduleId, courseId }: Props) {

    const setActiveBlock = useLessonBlocksStore(s => s.setActiveBlock)

    const updateTitle = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            updateModuleTitle(id, {title: title}),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['modules', courseId],
                exact: true
            })
        }
    }).mutate

    return (
        <div className={styles.editorCanvas} onClick={() => setActiveBlock("")}>
            <CanvasHeader updateModuleTitle={updateTitle} moduleId={moduleId} name={moduleTitle}></CanvasHeader>
            <CanvasContent></CanvasContent>
        </div>
    )
}