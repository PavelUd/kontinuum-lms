import {Input} from "@/shared/ui/input/Input";
import {Select} from "@/shared/ui/input/Select";
import {User, UserRequest} from "@/entities/user/models/types";


type Props = {
    value: UserRequest;
    onChange: (data: UserRequest) => void;
};

export function EmployeeForm({ value, onChange }: Props) {
    const handleChange = (field: keyof UserRequest, val: string) => {
        onChange({ ...value, [field]: val });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <Input
                label="Полное Имя"
                value={value.fullName}
                onChange={e => handleChange("fullName", e.target.value)}
            />

            <Input
                label="Телефон"
                value={value.phone}
                onChange={e => handleChange("phone", e.target.value)}
                placeholder="+7 (999) 000-00-00"
            />

            <Input
                label="Почта"
                type="email"
                value={value.email}
                onChange={e => handleChange("email", e.target.value)}
                placeholder="example@gmail.com"
            />

            <Select
                label="Роль"
                value={value.role}
                onChange={e => handleChange("role", e.target.value)}
                options={[
                    { value: "admin", label: "Администратор" },
                    { value: "methodist", label: "Методист" },
                    { value: "teacher", label: "Преподаватель" },
                    { value: "curator", label: "Куратор" },
                ]}
            />

        </div>
    );
}