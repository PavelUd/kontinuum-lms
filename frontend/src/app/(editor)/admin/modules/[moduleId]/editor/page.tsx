import {EditorPage} from "@/pages/editor/EditorPage";

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