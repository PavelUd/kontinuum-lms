import {AdminModulePage} from "@/screens/admin/module/AdminModulePage";

type Props = {
    params: Promise<{
        moduleId: string
    }>
}

export default async function Page({ params }: Props) {
    const { moduleId } = await params

    return (
        <AdminModulePage moduleId={moduleId}></AdminModulePage>
    )
}