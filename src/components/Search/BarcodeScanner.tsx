"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import Button from "@codegouvfr/react-dsfr/Button"
import Quagga from "@ericblade/quagga2"
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
    Quagga.stop()
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
    const initializeQuagga = () => {
      try {
        Quagga.init(
          {
            locate: false,
            inputStream: {
              type: "LiveStream",
              constraints: {
                facingMode: "environment",
                aspectRatio: { ideal: 16 / 9 },
              },
              target: videoContainerRef.current as HTMLElement,
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader"],
            },
          },
          (err) => {
            if (err) {
              console.error("Erreur initialisation Quagga:", err)
              setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
              stopScanning()
              return
            }

            Quagga.start()

            Quagga.onDetected((result) => {
              if (result.codeResult?.code) {
                alert(`Code detected: ${result.codeResult?.code}`)
                const code = result.codeResult.code
                onScan(code)
                stopScanning()
              }
            })
          },
        )
      } catch (error) {
        console.error("Erreur démarrage scanner:", error)
        setError("Erreur lors du démarrage du scanner.")
        stopScanning()
      }
    }

    initializeQuagga()
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
