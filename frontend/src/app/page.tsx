'use client'

import {useCoursesQuery} from "@/entities/course";
import {Loader} from "@/shared/ui/loader";
import {CoursesPage} from "@/pages/courses/CoursesPage";
import {useProfileQuery} from "@/entities/user/models/useUsersQuery";

export default function HomePage() {
    const { data, isLoading, isError } = useCoursesQuery()

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