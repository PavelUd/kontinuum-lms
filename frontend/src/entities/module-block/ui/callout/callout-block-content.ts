export type CalloutVariant = "tip" | "note"

export type CalloutBlockContent = {
    variant: CalloutVariant
    text: string
}

export const CALLOUT_TITLES: Record<CalloutVariant, string> = {
    note: "Важно запомнить",
    tip: "Совет"
}