import {api} from "@/shared/api";
import {CourseAnalyticProgress, LessonAnalyticProgress} from "@/entities/analytic/model/types";

export const GetCourseProgressAnalytic  = async (id: string) : Promise<CourseAnalyticProgress> => {
    return api.get<CourseAnalyticProgress>(`/analytic/progress/courses/${id}`, {auth : true})
}