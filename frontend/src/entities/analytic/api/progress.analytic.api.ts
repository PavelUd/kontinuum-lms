import {api} from "@/shared/api";
import {
    CourseAnalyticProgress,
    GroupAnalyticProgress,
    LessonAnalyticProgress,
    UserAnalyticProgress
} from "@/entities/analytic/model/types";

export const GetCourseProgressAnalytic  = async (id: string) : Promise<CourseAnalyticProgress> => {
    return api.get<CourseAnalyticProgress>(`/analytic/progress/courses/${id}`, {auth : true})
}

export const GetModuleProgressAnalytic  = async (id: string, moduleId : string) : Promise<LessonAnalyticProgress> => {
    return api.get<LessonAnalyticProgress>(`/analytic/progress/courses/${id}/modules/${moduleId}`, {auth : true})
}

export const GetGroupsProgressAnalytic  = async (courseId: string, moduleId : string) : Promise<GroupAnalyticProgress[]> => {
    return api.get<GroupAnalyticProgress[]>(`/analytic/progress/groups?courseId=${courseId}&moduleId=${moduleId}`, {auth : true})
}

export const GetGroupProgressAnalytic  = async (groupId: string, moduleId : string) : Promise<UserAnalyticProgress[]> => {
    return api.get<UserAnalyticProgress[]>(`/analytic/progress/groups/${groupId}/members?moduleId=${moduleId}`, {auth : true})
}