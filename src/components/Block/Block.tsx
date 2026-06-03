import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"
import { Breadcrumb, BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"

const Block = ({
  children,
  className,
  secondary,
  noMargin,
  large,
  home,
  breadCrumbs,
}: {
  children: ReactNode
  className?: string
  secondary?: boolean
  noMargin?: boolean
  large?: boolean
  home?: boolean
  breadCrumbs?: BreadcrumbProps
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
          [styles.withBreadcrumbs]: breadCrumbs,
        })}>
        {breadCrumbs && <Breadcrumb {...breadCrumbs} />}
        {children}
      </div>
    </div>
  )
}

export default Block
