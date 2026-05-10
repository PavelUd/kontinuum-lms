import {CanvasHeader} from "@/widgets/editor-canvas/ui/CanvasHeader";
import {CanvasContent} from "@/widgets/editor-canvas/ui/CanvasContent";
import styles from "./canvas.module.css"
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {useMutation} from "@tanstack/react-query";
import {updateModuleTitle} from "@/entities/module/api/module.api";
import {queryClient} from "@/shared/api";
import {ModuleBlock} from "@/entities/module-block/model/types";
import {useEffect} from "react";
import {SaveStatusIndicator} from "@/features/save-status-indicator/SaveStatusIndicator";
import {useModuleBlocks} from "@/entities/module-block/model/useModuleBlocks";
import {Loader} from "@/shared/ui/loader";

type Props = {
    moduleTitle: string,
    moduleId: string,
    courseId: string,
}

export function Canvas({  moduleTitle, moduleId, courseId }: Props) {

    const {
        data: blocks,
        isLoading: blocksLoading,
        isError: blocksError
    } = useModuleBlocks(moduleId);

    const loadBlocks = useLessonBlocksStore(s => s.loadBlocks)
    const status = useLessonBlocksStore(s => s.saveStatus)
    useEffect(() => {
        if (blocks) {
            console.log(moduleId);
            loadBlocks(blocks, moduleId)
        }
    }, [blocks])

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

    if (blocksLoading)
        return <Loader />
    if (blocksError)
        return <div>Ошибка загрузки</div>

    return (
        <div className={styles.editorCanvas} onClick={() => setActiveBlock("")}>
            <SaveStatusIndicator status={status}></SaveStatusIndicator>
            <CanvasHeader updateModuleTitle={updateTitle} moduleId={moduleId} name={moduleTitle}></CanvasHeader>
            <CanvasContent></CanvasContent>
        </div>
    )
}