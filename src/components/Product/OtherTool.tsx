import { Button } from "@codegouvfr/react-dsfr/Button"
import styles from "./OtherTool.module.css"
import Link from "next/link"
import { ReactNode } from "react"

const OtherTool = ({
  title,
  subTitle,
  buttonLabel,
  buttonLink,
  link,
  linkLabel,
  children,
}: {
  title: ReactNode
  subTitle: ReactNode
  buttonLabel?: string
  buttonLink?: string
  link?: string
  linkLabel?: string
  children: React.ReactNode
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.badge}>Les outils pour aller plus loin</p>
      <div className={styles.left}>
        <p className={styles.title}>{title}</p>
        <p>{subTitle}</p>
        {link && linkLabel && (
          <Link href={link} target='_blank' rel='noopener noreferrer' className={styles.link}>
            {linkLabel}
          </Link>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.iframeContainer}>{children}</div>
        {buttonLink && buttonLabel && (
          <Button
            priority='secondary'
            linkProps={{
              href: buttonLink,
              target: "_blank",
              rel: "noopener noreferrer",
            }}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default OtherTool
