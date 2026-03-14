import ModulePage from "@/pages/module/ModulePage";


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