import classNames from "classnames"
import styles from "./StatsList.module.css"
import { ReactNode } from "react"

const StatsList = ({ children, small }: { small?: boolean; children: ReactNode }) => {
  return <ul className={classNames(styles.list, { [styles.smallList]: small })}>{children}</ul>
}

export default StatsList
