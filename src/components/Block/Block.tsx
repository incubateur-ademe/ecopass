import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"

const Block = ({
  children,
  className,
  secondary,
}: {
  children: ReactNode
  className?: string
  secondary?: boolean
}) => {
  return (
    <div className={secondary ? styles.secondary : ""}>
      <div className={classNames("fr-container", styles.container, className)}>{children}</div>
    </div>
  )
}

export default Block
