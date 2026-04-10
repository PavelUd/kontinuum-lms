import {Role, RoleMap} from "@/entities/user/models/types";
import {Badge, BadgeVariant} from "@/shared/ui/badge/Badge";

type Props = {
    role: Role;
};

const ROLE_VARIANT: Record<Role, BadgeVariant> = {
    admin: "red",
    methodist: "blue",
    teacher: "green",
    student: "yellow",
};

export function RoleBadge({ role }: Props) {
    return (
        <Badge variant={ROLE_VARIANT[role]}>
            {RoleMap[role]}
        </Badge>
    );
}