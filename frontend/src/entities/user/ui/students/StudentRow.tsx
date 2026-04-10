import {User} from "@/entities/user/models/types";
import avatarStyles from "@/entities/user/ui/avatar/user-avatar.module.css";
import {ExternalLink, Pause, Plus, Trash2} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import { Badge } from "@/shared/ui/badge/Badge";
import {GroupBadge} from "@/entities/user/ui/students/GroupBadge";

;

export type Props = {
    user : User
    onDelete: () => void
    onEdit: () => void
}

export function StudentRow({ user, onDelete, onEdit }: Props) {
    return (
        <tr>
                <td>
                    <div className="flex items-center">
                    <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{  width: 32, height: 32, fontSize: '0.7rem' }}>
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-bold text-gray-900">{user.fullName}</div>
                    </div>
                </td>

            <td className="font-semibold">{11}</td>
            <td className="text-sm text-gray-500">{user.phone}</td>
            <td className="font-semibold">2</td>
            <td>
                <GroupBadge courseName={"Математика"} groupName={"ЕГЭ Профиль - Поток А"}></GroupBadge>
                <Button
                    className={"rounded-full"}
                    variant={"ghost"}
                    style={{ width: "22px", height: "22px", marginLeft: "5px" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    icon={<Plus size={14}></Plus>}>
                </Button>
            </td>
            <td>
                <Badge variant={"green"}>Активен</Badge>
            </td>

            <td className="text-end">
                <div className="flex gap-1 justify-end">
                <Button
                    variant={"ghost"}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    icon={<ExternalLink size={14}></ExternalLink>}>
                </Button>
                <Button
                    variant={"ghost"}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    icon={<Pause size={14}></Pause>}>
                </Button>
                <Button
                    variant={"ghost"}
                    style={{background: "#fef2f2"}}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete()
                    }}
                    icon={<Trash2 className="text-red-500" size={14}>
                    </Trash2>}>
                </Button>
                </div>
            </td>
        </tr>
    )
}