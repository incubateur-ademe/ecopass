"use client"
import { useEffect, useRef } from "react"

const InfoTriScript = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    // Avoid duplicate initialization on fast refresh or remounts
    const alreadyInitialized = container.querySelector("iframe")
    if (alreadyInitialized) {
      return
    }

    // Remove any previous script if present
    const prevScript = container.querySelector('script[src*="quefairedemesdechets.ademe.fr/infotri/iframe.js"]')
    if (prevScript) {
      prevScript.remove()
    }

    const script = document.createElement("script")
    script.src = "https://quefairedemesdechets.ademe.fr/infotri/iframe.js"
    script.async = true
    script.dataset.config = "categorie=tous&consigne=3&avec_phrase=false"
    container.appendChild(script)
  }, [])

  return <div ref={containerRef} />
}

export default InfoTriScript
