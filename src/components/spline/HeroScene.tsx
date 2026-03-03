'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function HeroScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef(0)

    // Track scroll position for parallax
    const handleScroll = useCallback(() => {
        scrollRef.current = window.scrollY
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let mouseX = 0
        let mouseY = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const handleMouse = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }
        window.addEventListener('mousemove', handleMouse)

        // Handle touch for mobile
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX
                mouseY = e.touches[0].clientY
            }
        }
        window.addEventListener('touchmove', handleTouch, { passive: true })

        // === MULTI-LAYER PARTICLE SYSTEM ===
        // 3 depth layers for parallax: far (slow), mid, near (fast)
        interface Particle {
            x: number; y: number; baseX: number; baseY: number
            vx: number; vy: number; radius: number; opacity: number
            layer: number // 0=far, 1=mid, 2=near
            parallaxFactor: number
        }

        const particles: Particle[] = []
        const layerConfig = [
            { count: 25, radiusMin: 0.3, radiusMax: 0.8, opacityMin: 0.05, opacityMax: 0.15, speedFactor: 0.15, parallaxFactor: 0.1 },  // far - tiny, dim, slow
            { count: 25, radiusMin: 0.5, radiusMax: 1.2, opacityMin: 0.1, opacityMax: 0.3, speedFactor: 0.25, parallaxFactor: 0.3 },   // mid
            { count: 15, radiusMin: 1.0, radiusMax: 2.0, opacityMin: 0.2, opacityMax: 0.5, speedFactor: 0.4, parallaxFactor: 0.6 },    // near - larger, brighter, faster
        ]

        layerConfig.forEach((config, layerIndex) => {
            for (let i = 0; i < config.count; i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                particles.push({
                    x, y, baseX: x, baseY: y,
                    vx: (Math.random() - 0.5) * config.speedFactor,
                    vy: (Math.random() - 0.5) * config.speedFactor,
                    radius: Math.random() * (config.radiusMax - config.radiusMin) + config.radiusMin,
                    opacity: Math.random() * (config.opacityMax - config.opacityMin) + config.opacityMin,
                    layer: layerIndex,
                    parallaxFactor: config.parallaxFactor,
                })
            }
        })

        // Floating light streaks (like lens flares)
        const streaks = Array.from({ length: 4 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 80 + 40,
            angle: Math.random() * Math.PI * 2,
            speed: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.04 + 0.01,
            parallaxFactor: 0.2 + Math.random() * 0.3,
        }))

        let time = 0

        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            time += 0.003

            const scroll = scrollRef.current
            const maxScroll = canvas.height // normalize: 0-1 over one viewport

            // === AMBIENT NEBULA ORBS (parallax-aware) ===
            const orbs = [
                { x: 0.2, y: 0.3, r: 280, opacity: 0.035, parallax: 0.15 },
                { x: 0.8, y: 0.6, r: 220, opacity: 0.025, parallax: 0.25 },
                { x: 0.5, y: 0.15, r: 320, opacity: 0.02, parallax: 0.1 },
                { x: 0.7, y: 0.8, r: 180, opacity: 0.02, parallax: 0.35 },
            ]
            orbs.forEach((orb, i) => {
                const parallaxOffset = scroll * orb.parallax
                const ox = orb.x * canvas.width + Math.sin(time + i * 1.8) * 60
                const oy = orb.y * canvas.height + Math.cos(time * 0.7 + i * 1.8) * 50 - parallaxOffset
                const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r)
                grad.addColorStop(0, `rgba(255, 215, 0, ${orb.opacity})`)
                grad.addColorStop(0.5, `rgba(255, 190, 0, ${orb.opacity * 0.3})`)
                grad.addColorStop(1, 'transparent')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(ox, oy, orb.r, 0, Math.PI * 2)
                ctx.fill()
            })

            // === FLOATING LIGHT STREAKS ===
            streaks.forEach(s => {
                const parallaxOffset = scroll * s.parallaxFactor
                s.angle += s.speed * 0.01
                const sx = s.x + Math.sin(time * 0.5 + s.angle) * 100
                const sy = s.y + Math.cos(time * 0.3 + s.angle) * 60 - parallaxOffset

                ctx.save()
                ctx.translate(sx, sy)
                ctx.rotate(s.angle + time * 0.2)

                const streakGrad = ctx.createLinearGradient(-s.length / 2, 0, s.length / 2, 0)
                streakGrad.addColorStop(0, 'transparent')
                streakGrad.addColorStop(0.5, `rgba(255, 215, 0, ${s.opacity})`)
                streakGrad.addColorStop(1, 'transparent')
                ctx.strokeStyle = streakGrad
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(-s.length / 2, 0)
                ctx.lineTo(s.length / 2, 0)
                ctx.stroke()

                ctx.restore()
            })

            // === PARTICLES WITH PARALLAX OFFSET ===
            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy

                // Parallax offset based on scroll
                const parallaxOffset = scroll * p.parallaxFactor

                // Gentle mouse interaction (stronger for near particles)
                const mouseFactor = 0.002 + p.layer * 0.002
                const dx = mouseX - p.x
                const dy = mouseY - (p.y - parallaxOffset)
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 250) {
                    p.x -= dx * mouseFactor
                    p.y -= dy * mouseFactor
                }

                // Wrap around
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10
                if (p.y < -10) p.y = canvas.height + 10
                if (p.y > canvas.height + 10) p.y = -10

                // Draw particle at parallax-adjusted position
                const drawY = p.y - parallaxOffset

                // Only draw if visible
                if (drawY > -20 && drawY < canvas.height + 20) {
                    ctx.beginPath()
                    ctx.arc(p.x, drawY, p.radius, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`
                    ctx.fill()

                    // Subtle glow for larger near particles
                    if (p.layer === 2 && p.radius > 1.5) {
                        const glow = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.radius * 4)
                        glow.addColorStop(0, `rgba(255, 215, 0, ${p.opacity * 0.3})`)
                        glow.addColorStop(1, 'transparent')
                        ctx.fillStyle = glow
                        ctx.beginPath()
                        ctx.arc(p.x, drawY, p.radius * 4, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            })

            // === DEPTH-AWARE CONNECTIONS (only same-layer particles) ===
            for (let layer = 0; layer < 3; layer++) {
                const layerParticles = particles.filter(p => p.layer === layer)
                const maxDist = 100 + layer * 30 // near particles connect at longer range
                const lineOpacity = 0.03 + layer * 0.02

                for (let i = 0; i < layerParticles.length; i++) {
                    const parallaxOffA = scroll * layerParticles[i].parallaxFactor
                    for (let j = i + 1; j < layerParticles.length; j++) {
                        const parallaxOffB = scroll * layerParticles[j].parallaxFactor
                        const dx = layerParticles[i].x - layerParticles[j].x
                        const dy = (layerParticles[i].y - parallaxOffA) - (layerParticles[j].y - parallaxOffB)
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        if (dist < maxDist) {
                            ctx.beginPath()
                            ctx.strokeStyle = `rgba(255, 215, 0, ${lineOpacity * (1 - dist / maxDist)})`
                            ctx.lineWidth = layer === 2 ? 0.8 : 0.4
                            ctx.moveTo(layerParticles[i].x, layerParticles[i].y - parallaxOffA)
                            ctx.lineTo(layerParticles[j].x, layerParticles[j].y - parallaxOffB)
                            ctx.stroke()
                        }
                    }
                }
            }

            // === CENTRAL PULSING CORE ===
            const cx = canvas.width / 2
            const cy = canvas.height / 2 - scroll * 0.2
            const pulseSize = 180 + Math.sin(time * 1.5) * 40
            const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize)
            centerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.04)')
            centerGlow.addColorStop(0.4, 'rgba(255, 200, 0, 0.015)')
            centerGlow.addColorStop(1, 'transparent')
            ctx.fillStyle = centerGlow
            ctx.beginPath()
            ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2)
            ctx.fill()

            // === SCROLL-FADING VIGNETTE ===
            const fadeProgress = Math.min(scroll / maxScroll, 1)
            if (fadeProgress > 0) {
                ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress * 0.4})`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouse)
            window.removeEventListener('touchmove', handleTouch)
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    )
}
