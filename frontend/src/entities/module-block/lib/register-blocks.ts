import { registerBlock } from "./block-registry"

import { TextBlock } from "../ui/text/TextBlock"
import {EditTextBlock} from "@/entities/module-block/ui/text/EditTextBlock";
import {HeadingBlock} from "@/entities/module-block/ui/heading/HeadingBlock";
import {EditHeadingBlock} from "@/entities/module-block/ui/heading/EditHeadingBlock";
import {CalloutBlock} from "@/entities/module-block/ui/callout/CalloutBlock";
import {EditCalloutBlock} from "@/entities/module-block/ui/callout/EditCalloutBlock";
import {FormulaBlock} from "@/entities/module-block/ui/formula/FormulaBlock";
import {EditFormulaBlock} from "@/entities/module-block/ui/formula/EditFormulaBlock";
import { SpoilerBlock } from "../ui/spoiler/SpoilerBlock";
import {EditSpoilerBlock} from "@/entities/module-block/ui/spoiler/EditSpoilerBlock";
import {TableBlock} from "@/entities/module-block/ui/table/TableBlock";
import {EditTableBlock} from "@/entities/module-block/ui/table/EditTableBlock";

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

registerBlock("formula", {
    view: FormulaBlock,
    editor: EditFormulaBlock
})

registerBlock("spoiler", {
    view: SpoilerBlock,
    editor: EditSpoilerBlock
})

registerBlock("table", {
    view: TableBlock,
    editor: EditTableBlock
})