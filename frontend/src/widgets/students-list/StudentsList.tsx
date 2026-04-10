import {User} from "@/entities/user/models/types";
import styles from "./students-list.module.css"
import {StudentRow} from "@/entities/user/ui/students/StudentRow";

export function StudentsList(){
    const users : User[] = [
        {
            id: "1",
            fullName: "name",
            phone: "phone phone phone",
            email: "email",
            role: "student",
        }
    ]

    return (
        <table className={styles.studentTable}>
            <thead>
            <tr>
                <th>Ученик</th>
                <th>Класс</th>
                <th>Телефон</th>
                <th>Курсов</th>
                <th>Группы</th>
                <th>Статус</th>
                <th className="text-a pe-4">Действия</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user: User, index: number) => {
               return(
                    <StudentRow key={index} user={user} onDelete={() => {}} onEdit={() => {}}></StudentRow>
               )
            })}
            </tbody>
        </table>
    )
}