"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { MessageCircle, User, School, Phone, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"


export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    message: "Eid Mubarak!",
    userName: "",
    mobile: "",
    gender: "",
    class: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      alert("দয়া করে ঈদের শুভেচ্ছা বার্তা লিখো।")
      return
    }
    if (!formData.userName.trim()) {
      alert("দয়া করে তোমার নাম লিখ।")
      return
    }
    if (!formData.mobile.trim()) {
      alert("দয়া করে তোমার মোবাইল নম্বর লিখো।")
      return
    }
    if (!/^\d{11}$/.test(formData.mobile.trim())) {
      alert("মোবাইল নম্বর অবশ্যই ১১ সংখ্যার হতে হবে এবং শুধুমাত্র সংখ্যা হতে হবে।")
      return
    }
    if (!formData.gender.trim()) {
      alert("দয়া করে তোমার লিঙ্গ নির্বাচন করো।")
      return
    }
    if (!formData.class.trim()) {
      alert("দয়া করে তোমার শ্রেণি নির্বাচন করো।")
      return
    }

    setIsSubmitting(true)

    // Send data to Google Sheet via Apps Script
    try {
      console.log('Sending data to Google Sheets:', formData);
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbwinnC-Be1R_3nnYXFAy1i8YwHh-gaJxGDauQZ9qyAC452wNPejtTjvdecsF4E7yN7J/exec', {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS restrictions
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.userName,
          mobile: formData.mobile,
          gender: formData.gender,
          class: formData.class,
          message: formData.message
        }),
      });
      
      console.log('Response received from Google Sheets');
    } catch (err) {
      console.error('Error submitting to Google Sheets:', err);
      alert('Google Sheet-এ সাবমিট করতে সমস্যা হয়েছে।');
    }

    // Store form data in sessionStorage to pass to the next page
    sessionStorage.setItem("eidCardData", JSON.stringify(formData))

    // Navigate to the preview page
    router.push("/preview")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-4">
            <img src="/images/AFS Logo.png" alt="AFS Logo" style={{ maxHeight: 96, width: 'auto' }} />
          </div>
          <header className="text-center">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">তোমার ঈদ কার্ড বানাও এসিএস ফিউচার স্কুল এর সাথে!</h2>
            <p className="text-gray-600">ফর্মটি ফিলআপ করেই পেয়ে চাও তোমার ঈদ কার্ড, আর শেয়ার করো বন্ধুদের সাথে!</p>
          </header>

          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-center">ফর্মটি পূরণ করো</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  তোমার নাম
                </Label>
                <Input
                  id="userName"
                  placeholder="তোমার নাম লিখো..."
                  value={formData.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  className="border-pink-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  মোবাইল নম্বর
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="তোমার মোবাইল নম্বর লিখো..."
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value.replace(/[^0-9]/g, ""))}
                  className="border-pink-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  লিঙ্গ
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="min-h-[40px] w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
                  required
                >
                  <option value="">লিঙ্গ নির্বাচন করো</option>
                  <option value="ছেলে">ছেলে</option>
                  <option value="মেয়ে">মেয়ে</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-pink-600" />
                  শ্রেণি
                </Label>
                <select
                  id="class"
                  value={formData.class}
                  onChange={(e) => handleInputChange("class", e.target.value)}
                  className="min-h-[40px] w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
                  required
                >
                  <option value="">শ্রেণি নির্বাচন করো</option>
                  <option value="৫ম">৫ম</option>
                  <option value="৬ষ্ঠ">৬ষ্ঠ</option>
                  <option value="৭ম">৭ম</option>
                  <option value="৮ম">৮ম</option>
                  <option value="৯ম">৯ম</option>
                  <option value="১০ম">১০ম</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-pink-600" />
                  ঈদের শুভেচ্ছা বার্তা
                </Label>
                <textarea
                  id="message"
                  placeholder="তোমার ঈদের শুভেচ্ছা বার্তা লিখো..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="min-h-[120px] w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

            </CardContent>

            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isSubmitting ? "প্রসেস হচ্ছে..." : "তোমার ঈদ কার্ড তৈরি করো"}
              </Button>
            </CardFooter>
          </Card>

          <footer className="text-center text-sm text-gray-500 pt-4">
            <p>© ২০২৫ এসিএস ফিউচার স্কুল. সর্বস্বত্ব সংরক্ষিত।</p>
          </footer>
        </div>
      </div>
  )
}
