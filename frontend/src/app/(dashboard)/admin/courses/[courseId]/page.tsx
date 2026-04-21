import {AdminCoursePage} from "@/screens/admin/course/AdminCoursePage";

export const dynamic = "force-dynamic"

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