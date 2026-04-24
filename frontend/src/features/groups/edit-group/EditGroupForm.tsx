"use client"

import {Input} from "@/shared/ui/input/Input";
import {Select} from "@/shared/ui/input/Select";

type Props = {
    groupId: string;
}

export function EditGroupForm({groupId} : Props){
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-5">
            <Input
                className={"mb-2"}
                label="Название группы"
                fullWidth={true}
                value=""
                onChange={e => {}}
            />
            <Select
                className="mb-5"
                label="Курс"
                fullWidth
                error=""
                value=""
                onChange={(e) => {}}
                options={[
                    { value: "", label: "Выберите курс" }
                ]}
            />
            <Select
                className="mb-5"
                label="Преподаватель"
                fullWidth
                error=""
                value=""
                onChange={(e) => {}}
                options={[
                    { value: "", label: "Выберите преподавателя" }
                ]}
            />
        </div>
    )
}