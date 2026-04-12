import {GroupPreview} from "@/entities/group/module/types";

export interface User {
    id: string,
    fullName: string,
    "phone": string,
    "email": string,
    "role": Role,
    "status": UserStatus
}

export interface Student extends User {
    class : number,
    groups : GroupPreview[],
    totalCourses : number,
}

export interface UserLookup {
    id: string,
    fullname: string,
}

export interface InviteLink{
    userId : string,
    link : string,
}

export type UserStatus = "invited" | "active" | "blocked"

export type UserRequest = {
    fullName: string,
    phone: string,
    email: string,
    "role": Role
}

export type CreateStudentRequest = {
    fullName: string,
    phone: string,
    email: string,
    class: number
}

export type Role = "admin" | "student" | "teacher" | "methodist"

export const RoleMap: Record<Role, string> = {
    admin: "Администратор",
    student: "Студент",
    teacher: "Преподаватель",
    methodist: "Методист"
}

export const StatusMap: Record<UserStatus, string> = {
    invited : "Приглашен",
    active: "Активен",
    blocked: "Пауза"
}