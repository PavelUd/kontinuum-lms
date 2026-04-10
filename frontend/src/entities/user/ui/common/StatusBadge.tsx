import {RoleMap, StatusMap, UserStatus} from "@/entities/user/models/types";
import {Badge, BadgeVariant} from "@/shared/ui/badge/Badge";

const ROLE_VARIANT: Record<UserStatus, BadgeVariant> = {
    blocked: "red",
    invited: "blue",
    active: "green"
};

type Props = {
    status: UserStatus;
};

export function StatusBadge({ status }: Props) {
    return (
        <Badge variant={ROLE_VARIANT[status]}>
            {StatusMap[status]}
        </Badge>
    );
}