import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./Block.module.css"
import { Breadcrumb, BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"

const Block = ({
  children,
  className,
  containerClassName,
  type,
  noMargin,
  large,
  breadCrumbs,
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
  type?: "yellow" | "blue" | "grey"
  noMargin?: boolean
  large?: boolean
  breadCrumbs?: BreadcrumbProps
}) => {
  return (
    <div className={classNames(containerClassName, type ? styles[type] : "")}>
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
