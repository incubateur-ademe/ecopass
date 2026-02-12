"use client"

import { useEffect, useRef } from "react"

export const InfoTri = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const script = document.createElement("script")
    script.src = "https://quefairedemesdechets.ademe.fr/infotri/configurateur.js"
    script.async = true
    script.dataset.config = "categorie=tous&consigne=1&avec_phrase=false"
    container.appendChild(script)

    return () => {
      container.removeChild(script)
    }
  }, [])

  return <div ref={containerRef} />
}
