"use client"

import Link from "next/link"
import styles from "./BackLink.module.css"
import { useSearchParams } from "next/navigation"

const BackLink = ({ url, label }: { url: string; label: string }) => {
  const searchParams = useSearchParams()
  return (
    <Link href={`${url}?${searchParams.toString()}`} className={styles.backLink}>
      <span className='fr-icon-arrow-left-line' aria-hidden='true'></span> {label}
    </Link>
  )
}

export default BackLink
