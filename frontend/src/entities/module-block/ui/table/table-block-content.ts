export type TableBlockContent = {
    columns: TableColumn[]
    rows: TableRow[]
}

export type TableColumn = {
    id: string
    title: string
}

export type TableRow = {
    id: string
    cells: string[]
}