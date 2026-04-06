import {Role, RoleMap} from "@/entities/user/models/types";
import styles from "@/entities/user/ui/employee/employee.module.css";

type Props = {
    role: Role;
};

export const RoleBadge = ({ role }: Props) => {

    const ROLE_STYLES: Record<Role, string> = {
        admin: 'bg-red-100 text-red-600',
        methodist: 'bg-blue-100 text-blue-600',
        teacher: 'bg-green-100 text-green-600',
        student: 'bg-yellow-100 text-yellow-600',
    };

    return (
    <span className={`${styles.statusBadge} ${ROLE_STYLES[role]}`}>
        {RoleMap[role]}
    </span>
    );
};