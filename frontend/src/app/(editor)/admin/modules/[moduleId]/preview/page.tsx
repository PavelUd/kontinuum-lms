

import {ModulePreviewPage} from "@/screens/module/ModulePreviewPage";

export const dynamic = "force-dynamic"

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