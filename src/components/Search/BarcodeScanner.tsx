"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import Button from "@codegouvfr/react-dsfr/Button"
import { BarcodeFormat, BrowserMultiFormatOneDReader } from "@zxing/browser"
import styles from "./BarcodeScanner.module.css"
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen"

const modal = createModal({
  id: "barcode-scanner-modal",
  isOpenedByDefault: false,
})

const BarcodeScanner = ({
  onScan,
  setError,
}: {
  onScan: (barcode: string) => void
  setError: (error: string) => void
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCameraAccess, setHasCameraAccess] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasAccess =
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasCameraAccess(hasAccess)
  }, [])

  const onClose = useCallback(() => {
    setIsScanning(false)
  }, [])

  useIsModalOpen(modal, {
    onConceal: onClose,
  })

  const stopScanning = useCallback(() => {
    onClose()
    modal.close()
  }, [onClose])

  useEffect(() => {
    if (!isScanning || !videoContainerRef.current) {
      return
    }

    const initializeZXing = async () => {
      try {
        const codeReader = new BrowserMultiFormatOneDReader()
        codeReader.possibleFormats = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]

        const videoElement = document.createElement("video")
        videoElement.style.width = "100%"
        videoElement.style.height = "100%"
        videoContainerRef.current?.appendChild(videoElement)

        await codeReader.decodeFromConstraints(
          {
            video: {
              facingMode: "environment",
              focusMode: "continuous",
              frameRate: { ideal: 10, max: 15 },
              width: { min: 640, ideal: 2048, max: 4048 },
            } as MediaTrackConstraints,
            audio: false,
          },
          videoElement,
          (decodedText) => {
            if (decodedText && isScanning) {
              alert(`Code detected: ${decodedText.getText()}`)
              onScan(decodedText.getText())
              stopScanning()
            }
          },
        )
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (!errorMessage.includes("Cancelled") && !errorMessage.includes("abort")) {
          console.error("Erreur initialisation ZXing:", error)
          setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
          stopScanning()
        }
      }
    }

    initializeZXing()
  }, [isScanning, onScan, setError, stopScanning])

  const startScanning = async () => {
    try {
      setError("")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      })

      stream.getTracks().forEach((track) => {
        track.stop()
        const capabilities = track.getCapabilities()
        if ("focusDistance" in capabilities && capabilities.focusDistance) {
          track.applyConstraints({
            advanced: [{ focusMode: "continuous" }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
        }
      })

      setIsScanning(true)
      modal.open()
    } catch (error) {
      console.error("Erreur démarrage scanner:", error)
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
    }
  }

  if (!hasCameraAccess) {
    return null
  }

  return (
    <>
      <Button
        priority='secondary'
        iconId='ri-camera-line'
        onClick={startScanning}
        disabled={isScanning}
        className={styles.scanButton}
        title='Scanner un code-barres avec la caméra'>
        Scanner
      </Button>

      <modal.Component
        title='Scanner un code-barres'
        buttons={[
          {
            children: "Fermer",
            priority: "secondary",
            onClick: stopScanning,
          },
        ]}>
        <div ref={videoContainerRef} className={styles.videoContainer} />
        <p className={styles.instruction}>Pointez le code-barres vers la caméra</p>
      </modal.Component>
    </>
  )
}

export default BarcodeScanner
