"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Download, ArrowLeft, School, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Head from "next/head"

export default function PreviewPage() {
  const router = useRouter()
  const [cardData, setCardData] = useState<{ message: string; userName: string; gender: string } | null>(null)
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

  const generateCard = useCallback(async (data: { message: string; userName: string; gender: string }) => {
    if (!data) return

    try {
      const canvas = canvasRef.current
      if (!canvas) {
        setIsGenerating(false)
        return
      }
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setIsGenerating(false)
        return
      }
      canvas.width = 960
      canvas.height = 1280

      // Use the appropriate template image based on gender
      let imageUrl = "/images/eid-card-template-female.jpeg";
      if (data.gender === "ছেলে") {
        imageUrl = "/images/eid-card-template-male.jpeg";
      }
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl

      const imageLoadTimeout = setTimeout(() => {
        if (!img.complete) {
          if (typeof img.onerror === 'function') {
            img.onerror(new Event('error'))
          }
        }
      }, 5000)

      img.onload = () => {
        clearTimeout(imageLoadTimeout)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawCardText(ctx, data, canvas)
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95)
        setGeneratedCard(jpegDataUrl)
        setIsGenerating(false)
      }

      img.onerror = () => {
        // fallback gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "#c2185b")
        gradient.addColorStop(1, "#8e24aa")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawCardText(ctx, data, canvas)
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95)
        setGeneratedCard(jpegDataUrl)
        setIsGenerating(false)
      }
    } catch (error) {
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
                    alt="তোমার ঈদ কার্ডের প্রিভিউ"
                    className="max-w-full h-auto"
                    style={{ maxHeight: "600px" }}
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={downloadCard}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Download className="w-4 h-4 mr-2" />
                কার্ড ডাউনলোড করো
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={async () => {
                  if (navigator.share && generatedCard) {
                    try {
                      const response = await fetch(generatedCard);
                      const blob = await response.blob();
                      const file = new File([blob], `eid-greeting-${cardData?.userName || "card"}.jpg`, { type: blob.type });
                      await navigator.share({
                        files: [file],
                        title: 'AFS Eid Card',
                        text: 'আমার ঈদ কার্ড দেখো!',
                      });
                    } catch (err: any) {
                      if (!err || err.name !== 'AbortError') {
                        alert('শেয়ার করতে সমস্যা হয়েছে।');
                      }
                    }
                  } else {
                    alert('তোমার ডিভাইসে শেয়ার ফিচারটি সাপোর্টেড নয়।');
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

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />
      </div>
    </>
  )
}

// Helper function to wrap text within a given width
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
  });
  return lines.length;
}

// Single function for all text rendering
function drawCardText(
  ctx: CanvasRenderingContext2D,
  data: { message: string; userName: string; gender: string },
  canvas: HTMLCanvasElement
) {
  // Always use black text color for greeting
  const textColor = "#000000";
  const nameColor = "#e11d48"; // Tailwind's red-600
  ctx.font = `36px 'Noto Sans Bengali', 'Hind Siliguri', Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lineHeight = 36 * 1.2;
  const maxWidth = canvas.width - 120;
  const startY = data.gender === "মেয়ে" ? canvas.height / 2 - 275 : canvas.height / 2 - 250;
  const lines = data.message.split("\n");
  let totalLines = 0;
  lines.forEach((line) => {
    ctx.fillStyle = textColor;
    totalLines += wrapText(ctx, line, canvas.width / 2, startY + totalLines * lineHeight, maxWidth, lineHeight);
  });
  // Draw user name immediately after the last line, with no extra spacing, same font size, but in red
  ctx.font = `36px 'Noto Sans Bengali', 'Hind Siliguri', Arial, sans-serif`;
  ctx.fillStyle = nameColor;
  ctx.fillText(`- ${data.userName}`, canvas.width / 2, startY + totalLines * lineHeight);
} 