import {User} from "@/entities/user/models/types";
import avatarStyles from "../avatar/user-avatar.module.css"
import {RoleBadge} from "@/entities/user/ui/employee/RoleBadge";
import {Edit2, Trash2} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import {Row} from "@/shared/ui/row/Row";

export type Props = {
    user : User
    onDelete: () => void
    onEdit: () => void
}

export function EmployeeRow({user, onDelete, onEdit}: Props) {
    return (
    <Row key={user.id}>
        <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{ width: 42, height: 42, fontSize: '1rem' }}>
            {user.fullName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-[180px]">
            <div className="font-bold text-base">
                {user.fullName}
            </div>
            <div className="text-gray-500 text-sm">
                {user.email}
            </div>
        </div>

        <div className="text-left pr-3 w-[150px]">
            <RoleBadge role={user.role}></RoleBadge>
        </div>
        <div className="flex gap-2 justify-end" style={{ width: '100px' }} onClick={e => e.stopPropagation()}>
            <Button
                variant="ghost"
                icon={<Edit2 size={14}/>}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onEdit()
                }}
            >
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
    </Row>
    )
}