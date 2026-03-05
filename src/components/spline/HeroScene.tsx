'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReducedMotion(mediaQuery.matches)

        const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
        mediaQuery.addEventListener('change', onChange)

        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    useEffect(() => {
        if (reducedMotion) {
            return
        }

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let width = 0
        let height = 0
        let dpr = 1
        let pointerX = 0
        let pointerY = 0

        type Particle = {
            x: number
            y: number
            vx: number
            vy: number
            radius: number
            alpha: number
        }

        const particles: Particle[] = []

        const createParticles = () => {
            particles.length = 0
            const count = Math.min(120, Math.max(60, Math.floor(width / 20)))
            for (let i = 0; i < count; i += 1) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: (Math.random() - 0.5) * 0.12,
                    radius: Math.random() * 1.5 + 0.3,
                    alpha: Math.random() * 0.25 + 0.05,
                })
            }
        }

        const resize = () => {
            dpr = window.devicePixelRatio || 1
            width = window.innerWidth
            height = window.innerHeight

            canvas.width = Math.floor(width * dpr)
            canvas.height = Math.floor(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            createParticles()
        }

        const onPointerMove = (event: MouseEvent) => {
            pointerX = event.clientX
            pointerY = event.clientY
        }

        const onTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
                pointerX = event.touches[0].clientX
                pointerY = event.touches[0].clientY
            }
        }

        resize()
        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', onPointerMove, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })

        let time = 0

        const animate = () => {
            time += 0.005

            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = '#050505'
            ctx.fillRect(0, 0, width, height)

            ctx.globalCompositeOperation = 'screen'

            // Golden Glow
            const x1 = width * 0.5 + Math.sin(time * 0.5) * width * 0.3 + (pointerX - width * 0.5) * 0.1
            const y1 = height * 0.5 + Math.cos(time * 0.3) * height * 0.3 + (pointerY - height * 0.5) * 0.1
            const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, Math.max(width, height) * 0.6)
            g1.addColorStop(0, 'rgba(255, 180, 0, 0.2)')
            g1.addColorStop(1, 'rgba(255, 180, 0, 0)')
            ctx.fillStyle = g1
            ctx.fillRect(0, 0, width, height)

            // Deep Azure/Cyan Glow
            const x2 = width * 0.5 + Math.cos(time * 0.4) * width * 0.25 - (pointerX - width * 0.5) * 0.08
            const y2 = height * 0.5 + Math.sin(time * 0.6) * height * 0.25 - (pointerY - height * 0.5) * 0.08
            const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, Math.max(width, height) * 0.7)
            g2.addColorStop(0, 'rgba(0, 220, 255, 0.15)')
            g2.addColorStop(1, 'rgba(0, 220, 255, 0)')
            ctx.fillStyle = g2
            ctx.fillRect(0, 0, width, height)

            // Indigo Mesh Glow
            const x3 = width * 0.5 + Math.sin(time * 0.2) * width * 0.4
            const y3 = height * 0.5 + Math.cos(time * 0.7) * height * 0.4
            const g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, Math.max(width, height) * 0.8)
            g3.addColorStop(0, 'rgba(60, 0, 255, 0.1)')
            g3.addColorStop(1, 'rgba(60, 0, 255, 0)')
            ctx.fillStyle = g3
            ctx.fillRect(0, 0, width, height)

            ctx.globalCompositeOperation = 'lighter'

            // Smooth interactive particles
            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i]
                p.x += p.vx
                p.y += p.vy

                if (p.x < -20) p.x = width + 20
                if (p.x > width + 20) p.x = -20
                if (p.y < -20) p.y = height + 20
                if (p.y > height + 20) p.y = -20

                const dx = pointerX - p.x
                const dy = pointerY - p.y
                const dist = Math.hypot(dx, dy)
                const proximity = dist < 250 ? (1 - dist / 250) * 0.6 : 0

                const color = i % 2 === 0
                    ? `rgba(255, 215, 0, ${p.alpha + proximity})` // Gold
                    : `rgba(0, 206, 255, ${p.alpha + proximity})` // Azure

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius + proximity * 2, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.fill()
            }

            ctx.globalCompositeOperation = 'source-over'

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', onPointerMove)
            window.removeEventListener('touchmove', onTouchMove)
        }
    }, [reducedMotion])

    return (
        <div className="absolute inset-0 h-full w-full bg-[#050505] -z-10">
            {!reducedMotion && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
            {/* Super premium subtle noise/texture overlay for the background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_120%)] pointer-events-none" />
        </div>
    )
}
