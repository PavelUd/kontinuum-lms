import {useState} from "react";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Footer} from "@/features/create-course/Footer";
import {Input} from "@/shared/ui/input/Input";

export type Props = {
    onConfirm: (title: string, orderIndex: number) => void;
    isOpen : boolean
    onClose: () => void,
    modulesCount: number
}

export function CreateModuleModal({ isOpen, onClose, onConfirm, modulesCount }: Props){

    function normalizeOrderIndex(value: string, min: number, max: number): string {
        let sanitized = value.replace(/[^\d]/g, "");
        sanitized = sanitized.replace(/^0+/, "");
        if (sanitized === "") return "";

        let num = Number(sanitized);

        if (num < min) num = min;
        if (num > max) num = max;

        return String(num);
    }


    const [title, setTitle] = useState("");
    const [orderIndex, setOrderIndex] = useState("");

    return (
        <Modal title={<div>Создание курса</div>}
               footer={
                   <Footer onClick={
                       () => {
                           let order = modulesCount;
                           if(Number(orderIndex) > 0){
                               order = Number(orderIndex)
                           }
                           onConfirm(title, order)
                           setTitle("")
                           setOrderIndex("")
                       }}>

                   </Footer>
               }
               open={isOpen} onClose={onClose}>
            <Input label={"Название Модуля"}
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <div className={"mt-5"}>
            <Input label={"Порядковый номер"}
                   type={"number"}
                   min={1}
                   max={modulesCount}
                   value={orderIndex}
                   onChange={(e) => {
                       const normalized = normalizeOrderIndex(
                           e.target.value,
                           1,
                           modulesCount
                       );

                       setOrderIndex(normalized);
                   }}
                   onBlur={() => {
                       let num = Number(orderIndex || modulesCount);

                       if (num < 1) num = 1;
                       if (num > modulesCount) num = modulesCount;

                       setOrderIndex(String(num));
                   }}
            ></Input>
            </div>
        </Modal>
    )
}