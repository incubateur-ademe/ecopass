"use client"
import { useEffect, useRef } from "react"

const InfoTri = () => {
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
    const prevScript = container.querySelector('script[src*="quefairedemesdechets.ademe.fr/infotri/configurateur.js"]')
    if (prevScript) prevScript.remove()

    const script = document.createElement("script")
    script.src = "https://quefairedemesdechets.ademe.fr/infotri/configurateur.js"
    script.async = true
    script.dataset.config = "categorie=tous&consigne=1&avec_phrase=false"
    container.appendChild(script)
  }, [])

  return (
    <>
      <h3 className='fr-mt-2w'>Info tri</h3>
      <div ref={containerRef} />
    </>
  )
}

export default InfoTri
