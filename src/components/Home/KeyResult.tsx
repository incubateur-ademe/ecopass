import Image from "next/image"
import styles from "./KeyResult.module.css"
import { ReactNode } from "react"

const KeyResult = ({ imageSrc, children, source }: { imageSrc: string; children: ReactNode; source: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image src={imageSrc} alt='' width={240} height={240} className={styles.image} />
        <p className={styles.source}>{source}</p>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default KeyResult
