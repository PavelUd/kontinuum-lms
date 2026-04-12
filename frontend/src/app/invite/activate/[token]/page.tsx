import {InvitePage} from "@/pages/invite/InvitePage";

type Props = {
    params: Promise<{
        token : string
    }>
}

export default async function Page({ params }: Props) {
    const { token } = await params;

    return (<InvitePage token={token}></InvitePage>)
}