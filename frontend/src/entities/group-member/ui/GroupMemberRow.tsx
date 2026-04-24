import avatarStyles from "@/entities/user/ui/avatar/user-avatar.module.css";
import {Row} from "@/shared/ui/row/Row";
import {GroupMember} from "@/entities/group-member/model/types";
import {Button} from "@/shared/ui/button/Button";
import {Trash2} from "lucide-react";

export type Props = {
    member : GroupMember
    onDelete: () => void
}

export function GroupMemberRow({member, onDelete}: Props) {
    return (
        <Row key={member.id}>
            <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{ width: 42, height: 42, fontSize: '1rem' }}>
                {member.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-[180px]">
                <div className="font-bold text-base">
                    {member.fullName}
                </div>
            </div>
            <div className="flex gap-2 justify-end" style={{ width: '100px' }} onClick={e => e.stopPropagation()}>
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
        );
    }