import {ModulePage} from "@/screens/module/ModulePage";

export const dynamic = "force-dynamic"

type Props = {
    params: Promise<{
        courseId: string
        moduleId: string
    }>
}

export default async function Page({ params }: Props) {

    const data = await params;
    return (
        <ModulePage
            courseId={data.courseId}
            lessonId={data.moduleId}
        />
    )
}