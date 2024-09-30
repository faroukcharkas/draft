import React, { useState } from 'react'
import { Button } from "./components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "./components/ui/drawer"
import NoiseOverlay from "./components/noise-overlay"
import "../style.css"

export default function Content() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  console.log("Content script loaded")

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.metaKey && event.shiftKey && event.key === "P") {
      console.log("Hotkey Cmd+Shift+P pressed")
      setIsDrawerOpen(true)
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  return (
    <div className="h-screen w-screen">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger />
        <DrawerContent className="bg-[#cccccc] max-h-[80vh] h-full">
          <NoiseOverlay/>
          Hi
        </DrawerContent>
      </Drawer>
    </div>
  )
}
