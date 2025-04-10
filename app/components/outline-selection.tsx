"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CustomCheckbox } from "./custom-checkbox"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface OutlineItem {
  id: string
  level: "h1" | "h2" | "h3"
  text: string
  indent?: boolean
}

interface OutlineSelectionProps {
  keyword: string
  onGenerate: (selectedOutlines: string[], isRegenerated: boolean) => void
  onRegenerate: () => void
}

export function OutlineSelection({ keyword, onGenerate, onRegenerate }: OutlineSelectionProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isRegenerating, setIsRegenerating] = React.useState(false)
  const [isRegenerated, setIsRegenerated] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  // Initial outlines
  const initialOutlines: OutlineItem[] = [
    { id: "1", level: "h1", text: "Teeth Whitening in NYC" },
    { id: "2", level: "h2", text: "Professional Teeth Whitening Treatment Details", indent: true },
    { id: "3", level: "h2", text: "Changes You Can Expect from Professional Teeth Whitening", indent: true },
    { id: "4", level: "h3", text: "How Long do Teeth Whitening Results Last?", indent: true },
    { id: "5", level: "h2", text: "Teeth Whitening Candidacy Considerations", indent: true },
    { id: "6", level: "h2", text: "Take-Home Whitening Kits", indent: true },
    { id: "7", level: "h2", text: "Schedule an Appointment for Teeth Whitening", indent: true },
  ]

  // Lorem ipsum outlines for regeneration
  const loremOutlines: OutlineItem[] = [
    { id: "1", level: "h1", text: "Lorem Ipsum Treatment Options" },
    { id: "2", level: "h2", text: "Understanding the Lorem Ipsum Procedure", indent: true },
    { id: "3", level: "h2", text: "Benefits of Professional Lorem Ipsum Services", indent: true },
    { id: "4", level: "h3", text: "How Long Does Lorem Ipsum Last?", indent: true },
    { id: "5", level: "h2", text: "Who is a Good Candidate for Lorem Ipsum?", indent: true },
    { id: "6", level: "h2", text: "At-Home Lorem Ipsum Solutions", indent: true },
    { id: "7", level: "h2", text: "Schedule Your Lorem Ipsum Consultation Today", indent: true },
  ]

  const [outlines, setOutlines] = React.useState<OutlineItem[]>(initialOutlines)
  const [selectedOutlines, setSelectedOutlines] = React.useState<string[]>(initialOutlines.map((o) => o.id))

  const handleCheckboxChange = (outlineId: string, checked: boolean) => {
    if (checked) {
      setSelectedOutlines([...selectedOutlines, outlineId])
    } else {
      setSelectedOutlines(selectedOutlines.filter((id) => id !== outlineId))
    }
  }

  const handleGenerateContent = () => {
    // Show loading state
    setIsGenerating(true)
    setProgress(0)

    // Call the onGenerate callback with selected outlines and regeneration status
    onGenerate(selectedOutlines, isRegenerated)

    // Simulate generation process with progress updates
    const totalTime = 5000 // 5 seconds total
    const intervalTime = 100 // Update every 100ms
    const steps = totalTime / intervalTime
    const increment = 100 / steps

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += increment

      // Add some randomness to make it look more natural
      const randomFactor = Math.random() * 0.5 + 0.8 // Between 0.8 and 1.3
      const adjustedIncrement = increment * randomFactor

      // Ensure we don't exceed 100%
      if (currentProgress >= 100) {
        setProgress(100)
        clearInterval(interval)

        // Complete the generation after reaching 100%
        setTimeout(() => {
          setIsGenerating(false)
          // Navigate to the content editor page with query parameters to indicate regenerated content
          router.push(
            `/dental-clinic/${encodeURIComponent(keyword)}/editor?regenerated=${isRegenerated ? "true" : "false"}`,
          )
        }, 300)
      } else {
        setProgress(Math.min(currentProgress, 99)) // Cap at 99% until complete
      }
    }, intervalTime)
  }

  const handleRegenerateOutlines = () => {
    // Show regenerating state
    setIsRegenerating(true)

    // Call the onRegenerate callback
    onRegenerate()

    // Simulate regeneration process for 1 second
    setTimeout(() => {
      // Switch to lorem ipsum outlines
      setOutlines(loremOutlines)
      // Select all new outlines by default
      setSelectedOutlines(loremOutlines.map((o) => o.id))
      setIsRegenerating(false)
      // Mark as regenerated
      setIsRegenerated(true)
    }, 1000)
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white h-full overflow-hidden flex flex-col">
        <div className="p-6 overflow-y-auto">
          <h2 className="mb-6 text-lg font-medium">Please select outlines to generate content.</h2>

          <div className="space-y-4 mb-6">
            {outlines.map((outline) => (
              <div key={outline.id} className={cn("flex items-start space-x-2", outline.indent && "ml-6")}>
                <CustomCheckbox
                  id={outline.id}
                  checked={selectedOutlines.includes(outline.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(outline.id, checked as boolean)}
                  disabled={isGenerating || isRegenerating}
                />
                <label
                  htmlFor={outline.id}
                  className={cn(
                    "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    selectedOutlines.includes(outline.id) ? "text-gray-900" : "text-gray-400 line-through",
                    outline.level === "h1" && "font-semibold",
                    outline.level === "h2" && "font-medium",
                    outline.level === "h3" && "font-normal",
                  )}
                >
                  {outline.text}
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={handleGenerateContent}
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white"
            size="lg"
            disabled={isGenerating || isRegenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>

          <div className="mt-4 text-center text-sm">
            {"Don't like the outlines? "}
            <button
              onClick={handleRegenerateOutlines}
              className="text-[#1a73e8] hover:text-[#1557b0] font-medium"
              disabled={isGenerating || isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <span className="inline-block align-middle">Regenerating...</span>
                </>
              ) : (
                "Re-generate outlines."
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay dialog with progress bar */}
      <Dialog open={isGenerating} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <DialogTitle className="text-xl text-center">Generating content</DialogTitle>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#1a73e8] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-gray-500 mt-2">{Math.round(progress)}% complete</p>

            <p className="text-center text-gray-500 mt-4">
              Please wait while we generate your content based on the selected outlines...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

