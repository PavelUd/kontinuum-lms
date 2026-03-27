import {api} from "@/shared/api";
import {LessonAnalyticProgress} from "@/entities/analytic/model/types";

export const GetCourseProgressAnalytic  = async (id: string) : Promise<LessonAnalyticProgress[]> => {
    return api.get<LessonAnalyticProgress[]>(`/analytic/progress/courses/${id}`, {auth : true})
}