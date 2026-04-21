import {InvitePage} from "@/screens/invite/InvitePage";

export const dynamic = "force-dynamic"

type Props = {
    params: Promise<{
        token : string
    }>
}

export default async function Page({ params }: Props) {
    const { token } = await params;

    return (<InvitePage token={token}></InvitePage>)
}