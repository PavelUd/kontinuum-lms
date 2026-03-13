import { registerBlock } from "./block-registry"

import { TextBlock } from "../ui/text/TextBlock"
import {EditTextBlock} from "@/entities/module-block/ui/text/EditTextBlock";
import {HeadingBlock} from "@/entities/module-block/ui/heading/HeadingBlock";
import {EditHeadingBlock} from "@/entities/module-block/ui/heading/EditHeadingBlock";
import {CalloutBlock} from "@/entities/module-block/ui/callout/CalloutBlock";
import {EditCalloutBlock} from "@/entities/module-block/ui/callout/EditCalloutBlock";

registerBlock("text", {
    view: TextBlock,
    editor: EditTextBlock
})

registerBlock("heading", {
    view: HeadingBlock,
    editor: EditHeadingBlock
})

registerBlock("callout", {
    view: CalloutBlock,
    editor: EditCalloutBlock
})