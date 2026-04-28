'use client'

import {Loader} from "@/shared/ui/loader";
import {CoursesPage} from "@/screens/courses/CoursesPage";
import {useProfileQuery} from "@/entities/user/models/useUsersQuery";
import {useMyCoursesQuery} from "@/entities/course/model/useCoursesQuery";

export default function HomePage() {
    const { data, isLoading, isError } = useMyCoursesQuery()

    const {
        data: profileData,
        isLoading: profileLoading,
        isError: profileError
    } = useProfileQuery();


    if (isLoading && profileLoading) return <Loader />
    if (isError && profileError) return <div>Ошибка загрузки</div>

    const profile = profileData?.data;
    const courses = data?.data ?? []

    return (
        <CoursesPage
            profile={profile}
            streak={12}
            courses={courses}
        />
    )
}