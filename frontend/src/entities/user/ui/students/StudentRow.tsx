import {Student} from "@/entities/user/models/types";
import avatarStyles from "@/entities/user/ui/avatar/user-avatar.module.css";
import {ExternalLink, Pause, Plus, Trash2} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import {GroupBadge} from "@/entities/user/ui/students/GroupBadge";
import {StatusBadge} from "@/entities/user/ui/common/StatusBadge";
import {Row} from "@/shared/ui/row/Row";
import styles from "./student-row.module.css"

export type Props = {
    user : Student
    onDelete: () => void
    className?: string
}

export function StudentRow({ user, onDelete, className }: Props) {
    return (
        <div key={user.id} className={styles.row}>
                <div>
                    <div className="flex items-center">
                    <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{  width: 32, height: 32, fontSize: '0.7rem' }}>
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-bold text-gray-900">{user.fullName}</div>
                    </div>
                </div>

            <div className="font-semibold">{user.class}</div>
            <div className="text-sm text-gray-500">{user.phone}</div>
            <div className="font-semibold">{user.totalCourses}</div>
                <div><div className={"flex items-center"}>
                {user.groups.map(group => (
                    <GroupBadge key={group.id} groupName={group.title} />
                ))}
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
            </div>
            </div>
            <div>
                <StatusBadge status={user.status}></StatusBadge>
            </div>

            <div className="text-end">
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
            </div>
        </div>
    )
}