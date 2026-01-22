import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"
import BackLink from "./BackLink"

const Block = ({
  children,
  className,
  secondary,
  noMargin,
  large,
  home,
  backLink,
}: {
  children: ReactNode
  className?: string
  secondary?: boolean
  noMargin?: boolean
  large?: boolean
  home?: boolean
  backLink?: { url: string; label: string }
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
        {backLink && <BackLink {...backLink} />}
        {children}
      </div>
    </div>
  )
}

export default Block
