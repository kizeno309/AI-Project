import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <Loader2 className="h-12 w-12 animate-spin text-[#4285f4]" />
    </div>
  )
}

