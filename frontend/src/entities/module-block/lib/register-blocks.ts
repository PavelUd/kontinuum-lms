import { registerBlock } from "./block-registry"

import { TextBlock } from "../ui/text/TextBlock"
import {EditTextBlock} from "@/entities/module-block/ui/text/EditTextBlock";

registerBlock("text", {
    view: TextBlock,
    editor: EditTextBlock
})