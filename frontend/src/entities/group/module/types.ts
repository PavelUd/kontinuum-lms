export interface Group {
    id: string,
    title: string,
    studentsCount: string,
    courseId: string
    courseName : string
    teacherId? : string,
    teacherName? : string
}

export interface GroupPreview {
    id: string,
    title: string
}

export interface GroupRequest {
    title: string,
    courseId: string,
    teacherId? : string,

}