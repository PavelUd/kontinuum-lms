import {api} from "@/shared/api";
import {EngagementItem} from "@/entities/engagement/models/types";

export const track = async (data: EngagementItem[]) : Promise<void> => {
    return await api.post<void>("/tracking/engagement", data, {auth : true})
}