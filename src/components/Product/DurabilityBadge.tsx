"use client"

import { useState, useRef, useEffect } from "react"
import Badge from "@codegouvfr/react-dsfr/Badge"
import styles from "./DurabilityBadge.module.css"

interface DurabilityBadgeProps {
  durability: number
}

const DurabilityBadge = ({ durability }: DurabilityBadgeProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipId = "durability-tooltip"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowTooltip(false)
      }
    }

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [showTooltip])

  return (
    <div className={styles.container} ref={containerRef}>
      <Badge severity='info' noIcon>
        coefficient de durabilité : {Math.round(durability * 100) / 100} points
      </Badge>
      <button
        className={styles.infoButton}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label='Informations sur le coefficient de durabilité'
        aria-expanded={showTooltip}
        aria-describedby={showTooltip ? tooltipId : undefined}
        type='button'>
        ?
      </button>
      {showTooltip && (
        <div id={tooltipId} className={styles.tooltip} role='tooltip' aria-live='polite'>
          Ce coefficient est lié aux pratiques commerciales des marques et la propension qu&apos;ont les vêtements à
          être utilisés plus longtemps. Compris entre 0,67 et 1,45. Ainsi, les vêtements de marques particulièrement
          vertueuses auront un coefficient de durabilité élevé (1,45), à l&apos;inverse les vêtements issus de marques
          de type « ultra fast fashion » auront un coefficient de durabilité bas (0,67)
        </div>
      )}
    </div>
  )
}

export default DurabilityBadge
