import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Input} from "@/shared/ui/input/Input";
import {useState} from "react";
import {useCourseMutations} from "@/entities/course/model/useCourseMutations";
import {Footer} from "@/features/create-course/Footer";

export type Props = {
    isOpen : boolean
    onClose: () => void
}

export function CreateCourseForm({ isOpen, onClose }: Props){

    const [title, setTitle] = useState("");


    const mutations = useCourseMutations();
    return (
        <Modal width={600} title={<div>Создание курса</div>}
               footer={
                <Footer onClick={ () => {
                       mutations.create({name : title, avatarUrl :""})
                        setTitle("")
                       onClose();
                   }}>

                </Footer>
            }
             open={isOpen} onClose={onClose}>
            <Input label={"Название курса"}
                value={title}
                   onChange={(e) => setTitle(e.target.value)}
            ></Input>
        </Modal>
    )
}