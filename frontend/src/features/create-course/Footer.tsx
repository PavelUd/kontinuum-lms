import {Button} from "@/shared/ui/button/Button";
import {ApiResponse} from "@/shared/api/types/api-response";

type Props = {
    onClick: () => void;
}

export function Footer({onClick}: Props) {
    return (
        <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
            <Button onClick={onClick} variant={"primary"}>
            Создать
        </Button>
        </div>
    );
}