import {Book, GraduationCap, Shield, Users} from "lucide-react";

export const NavigationConfig = [
    {
        name: "Обучение",
        routes:[
            {
                href: "/admin/courses",
                label: "Курсы",
                icon: Book,
            },
            {
                href: "/admin/groups",
                label: "Группы",
                icon: Users,
            }
        ],
    },
    {
        name: "Люди",
        routes:[
            {
                href: "/admin/employees",
                label: "Сотрудники",
                icon: Shield,
            },
            {
                href: "/admin/students",
                label: "Ученики",
                icon: GraduationCap,
            }
        ],
    },
];