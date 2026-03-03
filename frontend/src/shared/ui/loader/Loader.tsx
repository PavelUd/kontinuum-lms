'use client'

import styles from './Loader.module.css'



export function Loader() {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.dots}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        </div>
    )
}