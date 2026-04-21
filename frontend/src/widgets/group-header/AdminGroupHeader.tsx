"use client"

import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {Button} from "@/shared/ui/button/Button";
import {Select} from "@/shared/ui/input/Select";
import {Input} from "@/shared/ui/input/Input";

export function AdminGroupHeader() {
    return (
        <div>
            <Link href={"/src/screens/admin/groups"}>
                <Button
                    variant="ghost"
                    style={{backgroundColor: "#F8FAFC"}}
                    className={"mb-5"}
                    icon={<ChevronLeft size={16} className="mb-1"/>}
                >Назад к группам
                </Button>
            </Link>
            <div className="flex items-center justify-between mb-5">
                <h4 className="m-0 text-2xl font-semibold">
                    Настройка группы
                </h4>
                <div className="flex gap-2">
                </div>
            </div>
        </div>
    )
}