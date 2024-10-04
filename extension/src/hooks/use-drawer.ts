import { useState, useCallback, useEffect } from "react"

export function useDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'p') {
      console.log("Drawer opened")
      setIsDrawerOpen(prev => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return { isDrawerOpen, setIsDrawerOpen }
}