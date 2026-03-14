import {TableBlockContent} from "@/entities/module-block/ui/table/table-block-content";
import {EditBlockProps} from "@/entities/module-block/model/types";
import styles from "./table.module.css"
import {
    addColumn,
    addRow,
    removeColumn,
    removeRow,
    updateCell,
    updateColumnTitle
} from "@/entities/module-block/ui/table/table-actions";

export function EditTableBlock({block, updateBlock, isActive}: EditBlockProps<TableBlockContent>) {

    const {columns, rows}  = block.content;

    const updateTableBlock = (transform: (table: TableBlockContent) => TableBlockContent) => {
        if (!block)
            return

        const newContent = transform(block.content)
        updateBlock(block.id,  newContent)
    }


    return (
        <div className={styles.editorTableContainer}>
          <div className={styles.lessonTableWrapper} >
            <table className={styles.lessonTable}>
                <thead>
                <tr>
                    {columns.map((cell, cIdx) => (
                        <th
                            contentEditable={isActive}
                            suppressContentEditableWarning
                            onBlur={(e) =>updateTableBlock(table => updateColumnTitle(table, cIdx, e.target.innerText))}
                            key={cIdx}
                            dangerouslySetInnerHTML={{ __html: cell.title }}
                        />
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {row.cells.map((cell, cIdx) => (
                            <td
                                contentEditable={isActive}
                                suppressContentEditableWarning
                                onBlur={(e) =>updateTableBlock(table => updateCell(table, rIdx, cIdx, e.target.innerText))}
                                key={cIdx}
                                dangerouslySetInnerHTML={{ __html: cell }}
                            />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

            <div className={styles.colControls}>
                <div className={styles.tableControlBtn} onClick={() =>  updateTableBlock(table => addColumn(table))} title="Добавить колонку">+</div>
                <div className={`${styles.tableControlBtn} remove`} onClick={() =>  updateTableBlock(table => removeColumn(table))} title="Удалить колонку">-</div>
            </div>

            {/* Кнопки управления строками (снизу) */}
            <div className={styles.rowControls}>
                <div className={styles.tableControlBtn} onClick={() => updateTableBlock(table => addRow(table))} title="Добавить строку">+</div>
                <div className={`${styles.tableControlBtn} remove`} onClick={() => updateTableBlock(table => removeRow(table))} title="Удалить строку">-</div>
            </div>
      </div>
    )
}