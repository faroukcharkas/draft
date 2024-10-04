import React from "react"

export default function NoiseOverlay({className}: {className?: string}) {
    return (
        <div 
            className={`pointer-events-none absolute inset-0 ${className} noise-overlay`}
            style={{
                backgroundImage: "linear-gradient(45deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0) 60%), url('../assets/noise.svg')",
                backgroundRepeat: "repeat",
                opacity: 0.75
            }}
        ></div>
    )
}