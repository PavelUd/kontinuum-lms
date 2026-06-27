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
import {CodeBlock} from "@/entities/module-block/ui/code/CodeBlock";
import {EditCodeBlock} from "@/entities/module-block/ui/code/EditCodeBlock";
import {ImageBlock} from "@/entities/module-block/ui/upload/image/ImageBlock";
import {EditImageBlock} from "@/entities/module-block/ui/upload/image/EditImageBlock";
import {VideoBlock} from "@/entities/module-block/ui/upload/video/VideoBlock";
import {EditVideoBlock} from "@/entities/module-block/ui/upload/video/EditVideoBlock";
import {AudioBlock} from "@/entities/module-block/ui/upload/audio/AudioBlock";
import {EditAudioBlock} from "@/entities/module-block/ui/upload/audio/EditAudioBlock";
import {FileBlock} from "@/entities/module-block/ui/upload/file/FileBlock";
import {EditFileBlock} from "@/entities/module-block/ui/upload/file/EditFileBlock";
import {OpenQuestionBlock} from "@/entities/module-block/ui/question/openQuestion/OpenQuestionBlock";
import {EditOpenQuestionBlock} from "@/entities/module-block/ui/question/openQuestion/EditOpenQuestionBlock";
import {ChoiceQuestionBlock} from "@/entities/module-block/ui/question/choiceQuestion/ChoiceQuestionBlcok";
import {EditChoiceQuestionBlock} from "@/entities/module-block/ui/question/choiceQuestion/EditChoiceQuestionBlock";
import {PageBreakBlock} from "@/entities/module-block/ui/page-break/PageBreakBlock";
import {EditPageBreakBlock} from "@/entities/module-block/ui/page-break/EditPageBreak";

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

registerBlock("code", {
    view: CodeBlock,
    editor: EditCodeBlock
})

registerBlock("image", {
    view: ImageBlock,
    editor: EditImageBlock
})

registerBlock("video", {
    view: VideoBlock,
    editor: EditVideoBlock
})

registerBlock("audio", {
    view: AudioBlock,
    editor: EditAudioBlock
})

registerBlock("file", {
    view: FileBlock,
    editor: EditFileBlock
})

registerBlock("file", {
    view: FileBlock,
    editor: EditFileBlock
})

registerBlock("openquestion", {
    view: OpenQuestionBlock,
    editor: EditOpenQuestionBlock
})

registerBlock("choicequestion", {
    view: ChoiceQuestionBlock,
    editor: EditChoiceQuestionBlock
})

registerBlock("pagebreak", {
    view: PageBreakBlock,
    editor: EditPageBreakBlock
})