import {ModulePage} from "@/pages/module/ModulePage";


type Props = {
    params: Promise<{
        courseId: string
        lessonId: string
    }>
}

export default async function Page({ params }: Props) {

    const courseId = (await params).courseId;

    const course = { id: courseId, title: "Математика ЕГЭ" }
    const lesson = { title: "text" }

    return (
        <ModulePage
            course={course}
            lesson={lesson}
        />
    )
}