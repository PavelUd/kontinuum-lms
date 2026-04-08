import {Group} from "@/entities/group/module/types";
import {Row} from "@/shared/ui/row/Row";
import {Trash2, Users} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";

export type Props = {
    group : Group
    onDelete: () => void
}

export function GroupRow({group, onDelete}: Props) {
    return (
        <Row key={group.id}>
                <div className="bg-white shadow-sm mr-3 p-2 rounded">
                    <Users size={18} className="text-blue-500" />
                </div>

                <div className="flex-1">
                    <div className="font-semibold text-base">{group.title}</div>
                    <div className="text-gray-500 text-sm">{group.courseId}</div>
                </div>

                <div className="mr-4 text-left w-[150px]">
                    <div className="text-sm text-gray-500 mb-1">Преподаватель</div>
                    <div className="font-semibold text-sm">Нет преподавателя</div>
                </div>

                <div className="mr-4 text-right w-[100px]">
                    <div className="text-sm text-gray-500 mb-1">Учеников</div>
                    <div className="font-semibold">{group.studentsCount}</div>
                </div>
            <div className="flex gap-2 justify-end" style={{ width: '100px' }} onClick={e => e.stopPropagation()}>
                <Button
                    variant={"ghost"}
                    style={{background: "#fef2f2"}}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete()
                    }}
                    icon={<Trash2 className="text-red-500" size={14}>
                    </Trash2>}>
                </Button>
            </div>
        </Row>
    )
}