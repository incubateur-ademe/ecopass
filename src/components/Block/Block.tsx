import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"

const Block = ({
  children,
  className,
  secondary,
  noMargin,
  large,
  home,
}: {
  children: ReactNode
  className?: string
  secondary?: boolean
  noMargin?: boolean
  large?: boolean
  home?: boolean
}) => {
  return (
    <div
      className={classNames({
        [styles.secondary]: secondary,
        [styles.home]: home,
      })}>
      <div
        className={classNames("fr-container", styles.container, className, {
          [styles.noMargin]: noMargin,
          [styles.large]: large,
        })}>
        {children}
      </div>
    </div>
  )
}

export default Block
