import {Badge} from "@/shared/ui/badge/Badge";

export function GroupBadge({ groupName} : {courseName: string; groupName: string}) {
    return (
        <Badge variant="blue">
        <span className="font-extrabold truncate min-w-0" style={{ fontSize: "0.65rem" }}>
            {groupName}
        </span>
        </Badge>
    );
}