import {TableBlockContent} from "@/entities/module-block/ui/table/table-block-content";
import styles from "./table.module.css"
type Props = {
    content: TableBlockContent
}

export function TableBlock({ content }: Props) {

    const {columns, rows}  = content;

    return (
                <table className={styles.lessonTable}>
                    <thead>
                    <tr>
                        {columns.map((cell, cIdx) => (
                            <th
                                key={cIdx}
                                dangerouslySetInnerHTML={{ __html: cell.title }}
                            />
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, rIdx) => (
                        <tr key={rIdx + 1}>
                            {row.cells.map((cell, cIdx) => (
                                <td
                                    key={cIdx}
                                    dangerouslySetInnerHTML={{ __html: cell }}
                                />
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
    )
}