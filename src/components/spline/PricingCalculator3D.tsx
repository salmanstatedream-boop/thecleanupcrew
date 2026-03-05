'use client'

import { useEffect, useRef } from 'react'

export default function PricingCalculator3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        resize()

        const rings = [
            { radius: 80, speed: 0.008, dots: 8, color: '#FFD700' },
            { radius: 130, speed: -0.005, dots: 12, color: '#FFC107' },
            { radius: 180, speed: 0.003, dots: 16, color: '#A855F7' },
        ]

        let time = 0

        const animate = () => {
            const w = canvas.offsetWidth
            const h = canvas.offsetHeight
            ctx.clearRect(0, 0, w, h)
            time += 1

            const cx = w / 2
            const cy = h / 2

            // Central glow
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
            glow.addColorStop(0, 'rgba(0, 212, 255, 0.1)')
            glow.addColorStop(1, 'transparent')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(cx, cy, 100, 0, Math.PI * 2)
            ctx.fill()

            // Central price label circle
            ctx.beginPath()
            ctx.arc(cx, cy, 40, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(0, 212, 255, 0.05)'
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)'
            ctx.lineWidth = 1
            ctx.fill()
            ctx.stroke()

            // $ sign
            ctx.fillStyle = '#FFD700'
            ctx.font = 'bold 24px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('$', cx, cy)

            // Orbiting rings
            rings.forEach(ring => {
                const angle = time * ring.speed
                for (let i = 0; i < ring.dots; i++) {
                    const a = angle + (Math.PI * 2 / ring.dots) * i
                    const x = cx + Math.cos(a) * ring.radius
                    const y = cy + Math.sin(a) * ring.radius * 0.6 // Elliptical for 3D effect

                    // Line to center
                    ctx.beginPath()
                    ctx.moveTo(cx, cy)
                    ctx.lineTo(x, y)
                    ctx.strokeStyle = ring.color + '10'
                    ctx.lineWidth = 0.5
                    ctx.stroke()

                    // Dot
                    ctx.beginPath()
                    ctx.arc(x, y, 3, 0, Math.PI * 2)
                    ctx.fillStyle = ring.color
                    ctx.globalAlpha = 0.6
                    ctx.fill()
                    ctx.globalAlpha = 1
                }

                // Ring outline
                ctx.beginPath()
                ctx.ellipse(cx, cy, ring.radius, ring.radius * 0.6, 0, 0, Math.PI * 2)
                ctx.strokeStyle = ring.color + '15'
                ctx.lineWidth = 0.5
                ctx.stroke()
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <div className="relative w-full h-[500px] bg-white rounded-2xl overflow-hidden border border-black/10">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'transparent' }}
            />
            <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-black/50 text-xs uppercase tracking-widest">Interactive 3D Pricing Engine</p>
            </div>
        </div>
    )
}
