export const dynamic = "force-dynamic"

import {EditorPage} from "@/screens/editor/EditorPage";

type Props = {
    params: Promise<{
        moduleId: string
    }>
}

export default async function Page({ params }: Props) {
    const { moduleId } = await params

    return (
        <EditorPage moduleId={moduleId}></EditorPage>
    )
}