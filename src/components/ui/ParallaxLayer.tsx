'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'

interface ParallaxLayerProps {
    children: ReactNode
    speed?: number     // Positive = moves slower than scroll, negative = opposite
    className?: string
    fadeOut?: boolean   // Fade as user scrolls
}

export function ParallaxLayer({ children, speed = 0.3, className = '', fadeOut = false }: ParallaxLayerProps) {
    const [offset, setOffset] = useState(0)
    const [opacity, setOpacity] = useState(1)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let ticking = false

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY
                    setOffset(scrollY * speed)
                    if (fadeOut) {
                        const fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.6))
                        setOpacity(fade)
                    }
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [speed, fadeOut])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `translate3d(0, ${offset}px, 0)`,
                opacity: fadeOut ? opacity : 1,
                willChange: 'transform, opacity',
            }}
        >
            {children}
        </div>
    )
}
