import {GroupMember} from "@/entities/group-member/model/types";
import avatarStyles from "@/entities/user/ui/avatar/user-avatar.module.css";
import styles from "./group-member-stats-row.module.css";
import {SteppedProgress} from "@/shared/ui/stepped-progress";

export type Props = {
    member : GroupMember
}


export function GroupMemberStatsRow({member}: Props){
    return (
        <div key={member.id} className={styles.row}>
        <div className={styles.cell}>
            <div className="flex items-center">
                    <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                        {member.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                <div className="ml-2">
                    <div className="font-bold">
                        {member.fullName}
                    </div>
                    <div className="text-gray-500 text-[0.65rem]">
                        {"group"}
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.cell}>
            <div className="flex items-center gap-2">
                <div className="flex-grow-1">
                    <SteppedProgress progress={72} width={125} height={6} />
                </div>
                <span className="text-sm font-bold">
                        {72}%
                    </span>
            </div>
        </div>
        </div>
    )
}