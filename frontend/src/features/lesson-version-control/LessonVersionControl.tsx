import styles from "./lesson-version-control.module.css"
import {Button} from "@/shared/ui/button/Button";
import {RotateCcw, Send} from "lucide-react";
import {PublishLessonModal} from "@/features/lesson-version-control/PublishLessonModal";
import {RollbackLessonModal} from "@/features/lesson-version-control/RollbackLessonModal";
import {useState} from "react";
import {usePublishLessonMutation, useRollbackLessonMutation} from "@/entities/module/model/useModuleMutations";

type Props = {
    lessonId: string;
    draftId: string;
}

export function LessonVersionControl({lessonId, draftId} : Props){

    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isRollbackOpen, setIsRollbackOpen] = useState(false);

    const {publish, isPublishing} = usePublishLessonMutation();
    const {rollback, isRollbacking} = useRollbackLessonMutation(lessonId, draftId);

    return (
        <>
        <div className={styles.sidebarVersionControl}>
            <div className="">
                <Button
                    onClick={() => {setIsRollbackOpen(true)}}
                    variant="outline"
                    icon={<RotateCcw size={16} />}
                    className="w-full p-2 mb-5"
                >
                    Откатить изменения
                </Button>

                <Button
                    onClick={() => {setIsPublishOpen(true)}}
                    variant="primary"
                    icon={<Send size={16} />}
                    className="w-full p-4"
                >
                    Опубликовать
                </Button>
            </div>
        </div>
        <PublishLessonModal  isOpen={isPublishOpen} onClose={() => {setIsPublishOpen(false)}} isPending={isPublishing} onConfirm={() => publish(draftId)}></PublishLessonModal>
        <RollbackLessonModal isOpen={isRollbackOpen} onClose={() => {setIsRollbackOpen(false)}} isPending={isRollbacking} onConfirm={() => rollback()}></RollbackLessonModal>
        </>
    )
}