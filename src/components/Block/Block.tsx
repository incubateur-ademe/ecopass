import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"
import Link from "next/link"

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
        {backLink && (
          <Link href={backLink.url} className={styles.backLink}>
            <span className='fr-icon-arrow-left-line' aria-hidden='true'></span> {backLink.label}
          </Link>
        )}
        {children}
      </div>
    </div>
  )
}

export default Block
