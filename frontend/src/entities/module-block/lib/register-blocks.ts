import { registerBlock } from "./block-registry"

import { TextBlock } from "../ui/text/TextBlock"
import {EditTextBlock} from "@/entities/module-block/ui/text/EditTextBlock";
import {HeadingBlock} from "@/entities/module-block/ui/heading/HeadingBlock";
import {EditHeadingBlock} from "@/entities/module-block/ui/heading/EditHeadingBlock";

registerBlock("text", {
    view: TextBlock,
    editor: EditTextBlock
})

registerBlock("heading", {
    view: HeadingBlock,
    editor: EditHeadingBlock
})