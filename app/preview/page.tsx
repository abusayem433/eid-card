"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Download, ArrowLeft, School, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PreviewPage() {
  const router = useRouter()
  const [cardData, setCardData] = useState<{ message: string; userName: string } | null>(null)
  const [generatedCard, setGeneratedCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedData = sessionStorage.getItem("eidCardData")
    if (!storedData) {
      // If no data, redirect back to form
      router.push("/")
      return
    }

    try {
      const parsedData = JSON.parse(storedData)
      setCardData(parsedData)
    } catch (error) {
      console.error("Error parsing stored data:", error)
      router.push("/")
    }
  }, [router])

  // NEW EFFECT: generate card only when both cardData and canvas are ready
  useEffect(() => {
    if (cardData && canvasRef.current) {
      generateCard(cardData)
    }
  }, [cardData, canvasRef])

  const generateCard = useCallback(async (data: { message: string; userName: string }) => {
    if (!data) return

    try {
      const canvas = canvasRef.current
      console.log("Canvas ref:", canvas)
      if (!canvas) {
        console.error("Canvas not found")
        setIsGenerating(false)
        return
      }

      const ctx = canvas.getContext("2d")
      console.log("Canvas context:", ctx)
      if (!ctx) {
        console.error("Canvas context not found")
        setIsGenerating(false)
        return
      }

      // Set canvas dimensions to match the image aspect ratio
      canvas.width = 960
      canvas.height = 1280

      // Create background image
      const img = new Image()
      img.crossOrigin = "anonymous"

      // Use the existing template image
      console.log("Attempting to load image from URL")
      const imageUrl = "/images/eid-card-template.png"
      img.src = imageUrl

      // Add a timeout to handle cases where the image takes too long to load
      const imageLoadTimeout = setTimeout(() => {
        if (!img.complete) {
          console.log("Image load timed out, using fallback")
          img.onerror(new Error("Image load timeout"))
        }
      }, 5000) // 5 second timeout

      img.onload = () => {
        clearTimeout(imageLoadTimeout)
        console.log("Image loaded successfully")
        // Draw background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Set text properties for message
        ctx.font = `bold 32px Arial, sans-serif`
        ctx.fillStyle = "#FFFFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Add text shadow for better visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Draw message in the middle of the image
        const lines = data.message.split("\n")
        const lineHeight = 32 * 1.2
        const totalTextHeight = lineHeight * lines.length
        const startY = canvas.height / 2 - 50 // Slightly above center

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight
          ctx.fillText(line, canvas.width / 2, y)
        })

        // Draw "From: [userName]" at the bottom
        ctx.font = `bold 24px Arial, sans-serif`
        ctx.fillText(`From: ${data.userName}`, canvas.width / 2, canvas.height - 100)

        // Add ACS Future School branding
        ctx.font = `bold 18px Arial, sans-serif`
        ctx.fillText("ACS Future School", canvas.width / 2, canvas.height - 50)

        // Convert canvas to JPEG
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95)
        setGeneratedCard(jpegDataUrl)
        setIsGenerating(false)
      }

      img.onerror = (error) => {
        console.error("Error loading image:", error)
        console.log("Attempting to use fallback background")
        // Create a fallback gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "#c2185b")
        gradient.addColorStop(1, "#8e24aa")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add fallback text
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 48px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Eid Mubarak", canvas.width / 2, 200)

        // Continue with the rest of the text rendering...
        ctx.font = `bold 32px Arial`
        ctx.fillStyle = "#FFFFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        const lines = data.message.split("\n")
        const lineHeight = 32 * 1.2
        const startY = canvas.height / 2 - 50

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight
          ctx.fillText(line, canvas.width / 2, y)
        })

        ctx.font = `bold 24px Arial`
        ctx.fillText(`From: ${data.userName}`, canvas.width / 2, canvas.height - 100)

        ctx.font = `bold 18px Arial`
        ctx.fillText("ACS Future School", canvas.width / 2, canvas.height - 50)

        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95)
        setGeneratedCard(jpegDataUrl)
        setIsGenerating(false)
      }
    } catch (error) {
      console.error("Error generating card:", error)
      setIsGenerating(false)
    }
  }, [])

  const downloadCard = useCallback(() => {
    if (!generatedCard) return

    const link = document.createElement("a")
    link.download = `eid-greeting-${cardData?.userName || "card"}.jpg`
    link.href = generatedCard
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [generatedCard, cardData])

  const goBack = () => {
    router.push("/")
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <School className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">ACS Future School</h1>
          </div>
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Your Eid Greeting Card</h2>
        </header>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <CardTitle className="text-center">Card Preview</CardTitle>
          </CardHeader>

          <CardContent className="p-6 flex justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Generating your Eid card...</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden bg-white p-4 flex justify-center">
                <img
                  src={generatedCard || "/placeholder.svg"}
                  alt="Generated Eid greeting card"
                  className="max-w-full h-auto"
                  style={{ maxHeight: "600px" }}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-4 w-full">
              <Button
                onClick={downloadCard}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Card
              </Button>

              <Button variant="outline" onClick={goBack} className="border-pink-300 text-pink-700 hover:bg-pink-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => alert("Sharing functionality would be implemented here")}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Card
            </Button>
          </CardFooter>
        </Card>

        <footer className="text-center text-sm text-gray-500 pt-4">
          <p>© 2025 ACS Future School. All rights reserved.</p>
        </footer>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />
    </div>
  )
}
