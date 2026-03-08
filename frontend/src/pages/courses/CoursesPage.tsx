import {CourseSummary} from "@/entities/course/model/types";
import {Header} from "@/widgets/courses-header/ui/Header";
import {CourseList} from "@/widgets/course-list/ui/CourseList";
import {User} from "@/entities/user/models/types";

type Props = {
    profile?: User
    streak: number
    courses: CourseSummary[]
}

export function CoursesPage({
                                profile,
                                streak,
                                courses
                            }: Props) {


    return (
        <>
            <Header
                profile={profile}
                streak={streak}
                courses={courses}
            />

            <main className="max-w-[1800px] mx-auto px-6 md:px-10 xl:px-16 py-12">

                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Мои курсы
                    </h1>
                </div>

                <CourseList courses={courses} />

            </main>
        </>
    )
}