import styles from "@/widgets/employees-list/employees-list.module.css";
import {Group} from "@/entities/group/module/types";
import {GroupRow} from "@/entities/group/ui/GroupRow";

export function GroupsList() {

    const groups : Group[] = [
        {
            id: "1",
            title: "hello",
            teacherName: "Павел Павлович",
            studentsCount: "4",
            course: "Курс 1"
        },
        {
            id: "2",
            title: "hello",
            teacherName: "Павел Павлович",
            studentsCount: "4",
            course: "Курс 2"
        },
        {
            id: "3",
            title: "hello",
            teacherName: "Павел Павлович",
            studentsCount: "4",
            course: "Курс 3"
        },
        {
            id: "4",
            title: "hello",
            teacherName: "Павел Павлович",
            studentsCount: "4",
            course: "Курс 4"
        }
    ]
    const ROW_HEIGHT = 100;
    const GAP = 12;
    const pageSize = 5;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    return (
        <>
            <div className={styles.gridList} style={{
                gridAutoRows: `${ROW_HEIGHT}px`,
                minHeight: `${minHeight}px`
            }}>
                {groups.map((group) => {
                    return (
                        <GroupRow key={group.id} group={group} onDelete={() => {}} onEdit={() => {}}></GroupRow>
                    )
                })}
            </div>
        </>
    )
}