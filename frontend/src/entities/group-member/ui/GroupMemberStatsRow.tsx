
import avatarStyles from "@/entities/user/ui/avatar/user-avatar.module.css";
import styles from "./group-member-stats-row.module.css";
import {SteppedProgress} from "@/shared/ui/stepped-progress";
import {UserAnalyticProgress} from "@/entities/analytic/model/types";

export type Props = {
    member : UserAnalyticProgress
    groupName : string
}


export function GroupMemberStatsRow({member, groupName}: Props){
    return (
        <div key={member.id} className={styles.row}>
        <div className={styles.cell}>
            <div className="flex items-center">
                    <div className={`${avatarStyles.adminUserAvatar} shadow-sm mr-3`} style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                <div className="ml-2">
                    <div className="font-bold">
                        {member.name}
                    </div>
                    <div className="text-gray-500 text-[0.65rem]">
                        {groupName}
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.cell}>
            <div className="flex items-center gap-2">
                <div className="flex-grow-1">
                    <SteppedProgress progress={member.progress} width={125} height={6} />
                </div>
                <span className="text-sm font-bold">
                        {member.progress}%
                    </span>
            </div>
        </div>
        </div>
    )
}