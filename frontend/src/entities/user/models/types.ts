export interface User {
    id: string,
    fullName: string,
    "phone": string,
    "email": string,
    "role": Role
}

export interface UserLookup {
    id: string,
    fullname: string,
}

export type UserRequest = {
    fullName: string,
    "phone": string,
    "email": string,
    "role": Role
}

export type Role = "admin" | "student" | "teacher" | "methodist"

export const RoleMap: Record<Role, string> = {
    admin: "Администратор",
    student: "Студент",
    teacher: "Преподаватель",
    methodist: "Методист"
}