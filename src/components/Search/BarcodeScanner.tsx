"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import Button from "@codegouvfr/react-dsfr/Button"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
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
  const [selectedCameraId, setSelectedCameraId] = useState<string>("")
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)

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
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
    }
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

    const initializeScanner = async () => {
      try {
        const scanner = new Html5Qrcode("barcode-scanner-video", {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8],
        })

        scannerRef.current = scanner

        await scanner.start(
          selectedCameraId
            ? {
                deviceId: { exact: selectedCameraId },
              }
            : {
                facingMode: "environment",
              },
          {
            fps: 10,
            qrbox: { width: 320, height: 180 },
            aspectRatio: 16 / 9,
          },
          (decodedText) => {
            if (isScanning) {
              onScan(decodedText)
              stopScanning()
            }
          },
          () => {},
        )
      } catch (error) {
        console.error("Erreur initialisation scanner:", error)
        setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
        stopScanning()
      }
    }

    initializeScanner()
  }, [isScanning, onScan, setError, stopScanning, selectedCameraId])

  const startScanning = async () => {
    try {
      setError("")
      const mediaDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        setError("Aucune caméra détectée sur votre appareil.")
        return
      }

      const video = videoDevices.find(
        (device) => device.label.toLowerCase().includes("back") && device.label.toLowerCase().includes("0"),
      )

      if (video) {
        setSelectedCameraId(video.deviceId)
      }

      setIsScanning(true)
      modal.open()
    } catch (error) {
      console.error("Erreur démarrage scanner:", error)
      alert(`Erreur démarrage scanner: ${error}`)
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
    }
  }

  if (!hasCameraAccess) {
    return null
  }

  return (
    <>
      <Button
        type='button'
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
        <div id='barcode-scanner-video' ref={videoContainerRef} className={styles.videoContainer} />
        <p className={styles.instruction}>Pointez le code-barres vers la caméra</p>
      </modal.Component>
    </>
  )
}

export default BarcodeScanner
