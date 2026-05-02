import { useMutation, useQueryClient } from "@tanstack/react-query";
import {AnswerQuestionRequest} from "@/entities/module-block/model/types";
import {submitAnswer} from "@/entities/progress/api/progress.api"; // поправь путь

export const useSubmitAnswerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AnswerQuestionRequest }) =>
            submitAnswer(id, data),

        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lesson-progress"]
            });
        }
    });
};