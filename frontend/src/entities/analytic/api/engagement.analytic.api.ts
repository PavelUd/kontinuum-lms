import {HeatmapItem} from "@/entities/analytic/model/types";
import {api} from "@/shared/api";

export const GetEngagementStats  = async (moduleId : string) : Promise<HeatmapItem[]> => {
    return api.get<HeatmapItem[]>(`analytic/lessons/${moduleId}/engagement`, {auth : true})
}