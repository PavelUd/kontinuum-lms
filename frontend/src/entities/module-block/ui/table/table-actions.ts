import {TableBlockContent, TableRow} from "@/entities/module-block/ui/table/table-block-content";



export const updateColumnTitle = (
    table: TableBlockContent,
    columnIndex: number,
    value: string
): TableBlockContent => {

    const columns = table.columns.map((col, index) =>
        index === columnIndex
            ? { ...col, title: value }
            : col
    )

    return {
        ...table,
        columns
    }
}

export const updateCell = (
    table: TableBlockContent,
    rowIndex: number,
    colIndex: number,
    value: string
): TableBlockContent => {

    const rows = [...table.rows]

    rows[rowIndex] = {
        ...rows[rowIndex],
        cells: [...rows[rowIndex].cells]
    }

    rows[rowIndex].cells[colIndex] = value

    return {
        ...table,
        rows
    }
}

export const addRow = (table: TableBlockContent): TableBlockContent => {

    const newRow: TableRow = {
        id: crypto.randomUUID(),
        cells: table.columns.map(() => "Новая ячейка")
    }

    return {
        ...table,
        rows: [...table.rows, newRow]
    }
}

export const removeRow = (table: TableBlockContent): TableBlockContent => {

    if (table.rows.length <= 1)
        return table

    return {
        ...table,
        rows: table.rows.slice(0, -1)
    }
}

export const addColumn = (table: TableBlockContent): TableBlockContent => {

    const columnId = crypto.randomUUID()

    const columns = [
        ...table.columns,
        { id: columnId, title: "Новая колонка" }
    ]

    const rows = table.rows.map(row => ({
        ...row,
        cells: [...row.cells, "Новая ячейка"]
    }))

    return {
        columns,
        rows
    }
}

export const removeColumn = (table: TableBlockContent): TableBlockContent => {

    if (table.columns.length <= 1)
        return table

    const columns = table.columns.slice(0, -1)

    const rows = table.rows.map(row => ({
        ...row,
        cells: row.cells.slice(0, -1)
    }))

    return {
        columns,
        rows
    }
}