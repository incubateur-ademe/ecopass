"use client"

import { useEffect, useRef } from "react"

const ImpactCo2Script = ({ value }: { value: number }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    container.replaceChildren()

    const script = document.createElement("script")
    script.async = true
    script.dataset.name = "impact-co2"
    script.src = "https://impactco2.fr/iframe.js"
    script.dataset.type = "comparateur/etiquette-animee"
    script.dataset.search = `?value=${value}&comparisons=voiturethermique,random,random`

    container.appendChild(script)
  }, [value])

  return <div ref={containerRef} />
}

export default ImpactCo2Script
