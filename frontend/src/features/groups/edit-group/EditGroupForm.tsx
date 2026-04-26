"use client"

import {Input} from "@/shared/ui/input/Input";
import {Select} from "@/shared/ui/input/Select";
import {useGroupQuery} from "@/entities/group/module/useGroupsQuery";
import {useEmployeesLookupQuery} from "@/entities/user/models/useEmployeesQuery";
import {useCoursesLookupQuery} from "@/entities/course/model/useCoursesQuery";
import {Group, GroupRequest} from "@/entities/group/module/types";
import {useEffect, useMemo, useState} from "react";
import {useChangeCuratorMutation, useGroupMutations} from "@/entities/group/module/useGroupsMutations";
import {debounce} from "next/dist/server/utils";

type Props = {
    groupId: string;
}

export function EditGroupForm({groupId} : Props){

    const {isLoading, data} = useGroupQuery(groupId);
    const {data: emploeesData,isLoading: emploeesLoading} = useEmployeesLookupQuery();
    const {data: coursesData,isLoading: isCoursesLoading} = useCoursesLookupQuery();

    const {update} = useGroupMutations();
    const changeCuratorMutation = useChangeCuratorMutation();

    const [form, setForm] = useState<Partial<Group>>({
        title: "",
        courseId: "",
        teacherId: ""
    })

    useEffect(() => {
        if (data) {
            setForm({
                title: data.title ?? "",
                courseId: data.courseId ?? ""
            })
        }
    }, [data])

    const debouncedUpdate = useMemo(
        // eslint-disable-next-line react-hooks/preserve-manual-memoization
        () => debounce((id: string, patch: Partial<Group>) => {
            update({ id, patch })
        }, 500),
        []
    )

    const handleChange = <K extends keyof Group>(
        key: K,
        value: Group[K]
    ) => {
        const id = data?.id
        if (!id) return


        setForm(prev => ({ ...prev, [key]: value }))
        if(key == "teacherId"){
            changeCuratorMutation.mutate({groupId: id, curatorId: value ?? ""})
        }
        else {
            debouncedUpdate(id, {[key]: value})
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-5">
            <Input
                className={"mb-2"}
                label="Название группы"
                fullWidth={true}
                value={form.title ?? ""}
                onChange={e => handleChange("title", e.target.value)}
            />
            <Select
                className="mb-5"
                label="Курс"
                fullWidth
                error=""
                value={form.courseId ?? ""}
                onChange={(e) => handleChange("courseId", e.target.value)}
                options={[
                    { value: "", label: "Выберите курс" },
                    ...(coursesData?.map(item => ({
                        value: item.id,
                        label: item.name
                    })) ?? [])
                ]}
            />
            <Select
                className="mb-5"
                label="Преподаватель"
                fullWidth
                error=""
                value={form?.teacherId ?? ""}
                onChange={(e) => handleChange("teacherId", e.target.value)}
                options={[
                    { value: "", label: "Без преподавателя" },
                    ...(emploeesData?.map(item => ({
                        value: item.id,
                        label: item.fullname
                    })) ?? [])
                ]}
            />
        </div>
    )
}