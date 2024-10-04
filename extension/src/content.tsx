import React, { useState, useEffect, useCallback } from 'react'
import { Drawer, DrawerContent } from "./components/ui/drawer"
import NoiseOverlay from "./components/noise-overlay"
import "../style.css"
import { useDrawer } from "./hooks/use-drawer"


export default function App() {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer()

  return (
    <div className="h-screen w-screen z-[99999]">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-[#cccccc] max-h-[80vh] h-full justify-center items-center">
          {isDrawerOpen && <NoiseOverlay />}
          <div className="max-h-[75vh] h-full max-w-[750px] w-full shadow-xl rounded-xl p-8 bg-gray-50">
            <h1 className="text-4xl font-bold">Hello, World!</h1>
            <p className="text-lg">This is a custom React component.</p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
