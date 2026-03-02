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

            <main className="container-custom px-8 md:px-14 xl:px-24 py-12">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Мои курсы
                    </h1>
                </div>

                <CourseList />
            </main>
        </>
    )
}