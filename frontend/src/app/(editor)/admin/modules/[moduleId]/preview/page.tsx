import {PreviewHeader} from "@/widgets/module-header/PreviewHeader";
import {ModulePreviewPage} from "@/pages/module/ModulePreviewPage";

type Props = {
    params: Promise<{
        moduleId: string
    }>
}

export default async function Page({ params }: Props) {
    const { moduleId } = await params

    return (
        <>
            <ModulePreviewPage lessonId={moduleId}></ModulePreviewPage>
        </>
    )
}