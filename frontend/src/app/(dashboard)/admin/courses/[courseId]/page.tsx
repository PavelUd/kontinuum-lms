import {AdminCoursePage} from "@/pages/admin/course/AdminCoursePage";

type Props = {
    params: Promise<{
        courseId: string
    }>
}

export default async function Page({ params }: Props) {

    const data = await params;

    return (
        <AdminCoursePage courseId={data.courseId}></AdminCoursePage>
    )
}