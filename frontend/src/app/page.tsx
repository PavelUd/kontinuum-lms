import { CourseList } from '@/widgets/course-list/ui/CourseList'
import { Header } from '@/widgets/header/ui/Header'

export default function HomePage() {
    return (
        <>
            <Header
                userName="Николай"
                userEmail="nikolai@example.com"
                streak={12}
                myCourses={['Математика ЕГЭ', 'Русский язык ОГЭ']}
            />

            <main className="max-w-[1800px] mx-auto px-6 md:px-10 xl:px-16 p py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Мои курсы
                    </h1>
                </div>

                <CourseList />
            </main>
        </>
    )
}