"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Download, ArrowLeft, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Head from "next/head"

const DESIGN_OPTIONS = [
  { id: "design-1", label: "Design 1", image: "/images/Design 1.jpeg" },
  { id: "design-2", label: "Design 2", image: "/images/Design 2.jpeg" },
  { id: "design-3", label: "Design 3", image: "/images/Design 3.jpeg" },
] as const

export default function PreviewPage() {
  const router = useRouter()
  const [cardData, setCardData] = useState<{ message: string; userName: string } | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<(typeof DESIGN_OPTIONS)[number]["image"]>(DESIGN_OPTIONS[0].image)
  const [generatedCard, setGeneratedCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

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

  useEffect(() => {
    if (!cardData) return

    setIsGenerating(true)
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = selectedDesign

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth || 960
      canvas.height = img.naturalHeight || 1280
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        setGeneratedCard(selectedDesign)
        setIsGenerating(false)
        return
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      drawCenteredEidText(ctx, cardData, canvas.width, canvas.height, selectedDesign)
      setGeneratedCard(canvas.toDataURL("image/jpeg", 0.95))
      setIsGenerating(false)
    }

    img.onerror = () => {
      setGeneratedCard(selectedDesign)
      setIsGenerating(false)
    }
  }, [cardData, selectedDesign])

  const downloadCard = useCallback(() => {
    if (!generatedCard) return
    const link = document.createElement("a")
    const selectedOption = DESIGN_OPTIONS.find((option) => option.image === selectedDesign)
    const designNumber =
      selectedOption?.id === "design-1" ? "1" : selectedOption?.id === "design-2" ? "2" : "3"
    const studentName = (cardData?.userName || "Student").trim()
    link.download = `AFS Eid Card ${designNumber} - ${studentName}.jpeg`
    link.href = generatedCard
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [generatedCard, selectedDesign, cardData])

  const goBack = () => {
    router.push("/")
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>AFS Eid Card</title>
        <link rel="icon" type="image/png" href="/images/AFS Logo.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="/images/AFS Logo.png"
              alt="AFS Logo"
              style={{ maxHeight: 96, width: 'auto', cursor: 'pointer' }}
              onClick={() => router.push("/")}
            />
          </div>
          <header className="text-center">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">তোমার ঈদ কার্ড বানাও এসিএস ফিউচার স্কুল এর সাথে!</h2>
            <p className="text-gray-600">ফর্মটি ফিলআপ করেই পেয়ে চাও তোমার ঈদ কার্ড, আর শেয়ার করো বন্ধুদের সাথে!</p>
          </header>

          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-center">কার্ডের প্রিভিউ</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {DESIGN_OPTIONS.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => {
                      setSelectedDesign(design.image)
                      setIsGenerating(true)
                    }}
                    className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                      selectedDesign === design.image
                        ? "border-pink-500 ring-2 ring-pink-300"
                        : "border-pink-100 hover:border-pink-300"
                    }`}
                    aria-label={`${design.label} নির্বাচন করো`}
                  >
                    <img src={design.image || "/placeholder.svg"} alt={design.label} className="w-full h-20 object-cover" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {design.id === "design-1"
                        ? "ডিজাইন ১"
                        : design.id === "design-2"
                          ? "ডিজাইন ২"
                          : "ডিজাইন ৩"}
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative border rounded-lg overflow-hidden bg-white p-4 flex justify-center min-h-[280px] items-center">
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center p-6 absolute">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>কার্ড লোড হচ্ছে...</p>
                  </div>
                )}
                <img
                  src={generatedCard || "/placeholder.svg"}
                  alt="নির্বাচিত ঈদ কার্ডের প্রিভিউ"
                  className={`max-w-full h-auto transition-opacity ${isGenerating ? "opacity-0" : "opacity-100"}`}
                  style={{ maxHeight: "600px" }}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={downloadCard}
                disabled={isGenerating || !generatedCard}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Download className="w-4 h-4 mr-2" />
                এই ডিজাইন ডাউনলোড করো
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={async () => {
                  if (navigator.share && generatedCard) {
                    try {
                      const response = await fetch(generatedCard)
                      const blob = await response.blob()
                      const selectedLabel = DESIGN_OPTIONS.find((option) => option.image === selectedDesign)?.label ?? "design"
                      const file = new File([blob], `${selectedLabel.toLowerCase().replace(/\s+/g, "-")}.jpeg`, { type: blob.type })
                      await navigator.share({
                        files: [file],
                        title: "AFS Eid Card",
                        text: "আমার ঈদ কার্ড দেখো!",
                      })
                    } catch (err: any) {
                      if (!err || err.name !== "AbortError") {
                        alert("শেয়ার করতে সমস্যা হয়েছে।")
                      }
                    }
                  } else {
                    alert("তোমার ডিভাইসে শেয়ার ফিচারটি সাপোর্টেড নয়।")
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                কার্ড শেয়ার করো
              </Button>
              <Button
                variant="outline"
                onClick={goBack}
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ফর্মে ফিরে যাও
              </Button>
            </CardFooter>
          </Card>

          <footer className="text-center text-sm text-gray-500 pt-4">
            <p>© ২০২৫ এসিএস ফিউচার স্কুল. সর্বস্বত্ব সংরক্ষিত।</p>
          </footer>
        </div>
      </div>
    </>
  )
}

function drawCenteredEidText(
  ctx: CanvasRenderingContext2D,
  data: { message: string; userName: string },
  width: number,
  height: number,
  designImage: string,
) {
  const maxWidth = width * 0.78
  const baseFontSize = Math.max(28, Math.floor(width * 0.035))
  const lineHeight = Math.floor(baseFontSize * 1.35)
  const lines = wrapTextLines(ctx, data.message, maxWidth, baseFontSize)
  const nameLine = `- ${data.userName}`
  const totalHeight = (lines.length + 1) * lineHeight
  // Different vertical positions per design:
  // - Design 1: higher (your preferred position)
  // - Design 2 & 3: lower so text comes down
  const isDesignOne = designImage.toLowerCase().includes("design 1")
  const offsetMultiplier = isDesignOne ? 5 : 4
  const verticalOffset = -lineHeight * offsetMultiplier
  let y = height / 2 - totalHeight / 2 + lineHeight / 2 + verticalOffset

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)"
  ctx.shadowBlur = 6
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 2

  ctx.fillStyle = "#ffffff"
  ctx.font = `700 ${baseFontSize}px 'Baloo Da 2', system-ui, -apple-system, 'Segoe UI', sans-serif`
  for (const line of lines) {
    ctx.fillText(line, width / 2, y)
    y += lineHeight
  }

  ctx.fillStyle = "#ffd6e7"
  ctx.fillText(nameLine, width / 2, y)

  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
) {
  ctx.font = `700 ${fontSize}px 'Baloo Da 2', system-ui, -apple-system, 'Segoe UI', sans-serif`
  const rawLines = text.split("\n")
  const finalLines: string[] = []

  for (const rawLine of rawLines) {
    const words = rawLine.split(" ")
    let line = ""

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word
      const testWidth = ctx.measureText(testLine).width
      if (testWidth > maxWidth && line) {
        finalLines.push(line)
        line = word
      } else {
        line = testLine
      }
    }

    finalLines.push(line || "")
  }

  return finalLines
}