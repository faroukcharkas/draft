import React from "react"

export default function NoiseOverlay({className}: {className?: string}) {
    return <div className={`noise pointer-events-none absolute inset-0 ${className}`}></div>
}