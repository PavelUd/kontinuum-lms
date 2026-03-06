import {CourseSummary} from "@/entities/course/model/types";
import {Header} from "@/widgets/courses-header/ui/Header";
import {CourseList} from "@/widgets/course-list/ui/CourseList";

type Props = {
    userName: string
    userEmail: string
    streak: number
    courses: CourseSummary[]
}

export function CoursesPage({
                                userName,
                                userEmail,
                                streak,
                                courses
                            }: Props) {

    return (
        <>
            <Header
                userName={userName}
                userEmail={userEmail}
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