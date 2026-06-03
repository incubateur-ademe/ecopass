import { ReactNode } from "react"
import Block from "../Block/Block"
import styles from "./LegalContainer.module.css"

const LegalContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Block>
      <div className={styles.container}>{children}</div>
    </Block>
  )
}

export default LegalContainer
