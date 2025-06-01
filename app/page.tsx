"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { MessageCircle, User, School } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    message: "Eid Mubarak!",
    userName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.message.trim()) {
      alert("Please enter a greeting message")
      return
    }

    if (!formData.userName.trim()) {
      alert("Please enter your name")
      return
    }

    setIsSubmitting(true)

    // Store form data in sessionStorage to pass to the next page
    sessionStorage.setItem("eidCardData", JSON.stringify(formData))

    // Navigate to the preview page
    router.push("/preview")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <School className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">ACS Future School</h1>
          </div>
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Eid Greeting Card Generator</h2>
          <p className="text-gray-600">Create a personalized Eid greeting card to share with friends and family</p>
        </header>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <CardTitle className="text-center">Create Your Eid Card</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="userName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </Label>
              <Input
                id="userName"
                placeholder="Enter your name..."
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                className="border-pink-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Greeting Message
              </Label>
              <textarea
                id="message"
                placeholder="Enter your Eid greeting message..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="min-h-[120px] w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isSubmitting ? "Processing..." : "Generate Eid Card"}
            </Button>
          </CardFooter>
        </Card>

        <footer className="text-center text-sm text-gray-500 pt-4">
          <p>© 2025 ACS Future School. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
