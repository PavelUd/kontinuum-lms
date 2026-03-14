import {
    PointerSensor,
    PointerSensorOptions
} from "@dnd-kit/core";

import type { PointerEvent as ReactPointerEvent } from "react";

export class CustomPointerSensor extends PointerSensor {

    static activators = [
        {
            eventName: "onPointerDown" as const,
            handler: (
                { nativeEvent }: ReactPointerEvent<Element>,
                { onActivation }: PointerSensorOptions
            ): boolean => {

                const target = nativeEvent.target as HTMLElement;

                console.log(target.closest("input") ||
                    target.closest("textarea") ||
                    target.closest("[contenteditable='true']"))
                // блокируем drag внутри editable
                if (
                    target.closest("input") ||
                    target.closest("textarea") ||
                    target.closest("[contenteditable='true']")
                ) {
                    return false;
                }

                return true;
            }
        }
    ];
}