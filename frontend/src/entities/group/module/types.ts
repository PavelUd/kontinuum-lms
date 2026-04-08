export interface Group {
    id: string,
    title: string,
    studentsCount: string,
    courseId: string
}

export interface GroupRequest {
    title: string,
    courseId: string,
    teacherId? : string,

}