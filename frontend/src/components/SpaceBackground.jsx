import React, { useEffect, useRef, useMemo } from 'react'

// Generate static star positions for performance
const generateStars = (count, seed = 1) => {
    const stars = []
    for (let i = 0; i < count; i++) {
        const x = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * 100
        const y = ((seed * (i + 1) * 7621 + 17489) % 197280) / 197280 * 100
        const size = 1 + (i % 3)
        const opacity = 0.3 + (i % 7) * 0.1
        const delay = (i % 5) * 1.2
        stars.push({ x, y, size, opacity, delay })
    }
    return stars
}

// Generate cosmic dust particles
const generateDust = (count) => {
    const particles = []
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 15 + Math.random() * 25,
            delay: Math.random() * 10,
            opacity: 0.03 + Math.random() * 0.06
        })
    }
    return particles
}

export default function SpaceBackground({ themeColor = 'cyan' }) {
    const containerRef = useRef(null)
    const rafRef = useRef(null)
    const particlesRef = useRef(null)

    // Memoize stars and dust for performance
    const stars = useMemo(() => ({
        slow: generateStars(60, 1),
        mid: generateStars(45, 2),
        fast: generateStars(30, 3)
    }), [])

    const cosmicDust = useMemo(() => generateDust(20), [])

    // Theme-based colors
    const themeColors = themeColor === 'purple'
        ? { primary: '#a78bfa', secondary: '#ec4899', glow: 'rgba(167, 139, 250, 0.15)' }
        : { primary: '#7feaff', secondary: '#60a5fa', glow: 'rgba(127, 234, 255, 0.12)' }

    useEffect(() => {
        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const state = { mx: 0, my: 0, tx: 0, ty: 0, scrollY: 0, time: 0 }

        const onMouse = (e) => {
            state.mx = (e.clientX / window.innerWidth) - 0.5
            state.my = (e.clientY / window.innerHeight) - 0.5
        }

        const onScroll = () => { state.scrollY = window.scrollY }

        window.addEventListener('mousemove', onMouse, { passive: true })
        window.addEventListener('scroll', onScroll, { passive: true })

        const tick = (timestamp) => {
            state.time = timestamp / 1000

            // Smooth interpolation with easing
            state.tx += (state.mx * 50 - state.tx) * 0.06
            state.ty += (state.my * 40 - state.ty) * 0.06

            const el = containerRef.current
            if (el) {
                // Star layers parallax
                const slow = el.querySelector('.stars-slow')
                const mid = el.querySelector('.stars-mid')
                const fast = el.querySelector('.stars-fast')

                if (slow) slow.style.transform = `translate3d(${state.tx / 8}px, ${state.ty / 8 + state.scrollY * 0.015}px, 0)`
                if (mid) mid.style.transform = `translate3d(${state.tx / 4}px, ${state.ty / 4 + state.scrollY * 0.03}px, 0)`
                if (fast) fast.style.transform = `translate3d(${state.tx / 2}px, ${state.ty / 2 + state.scrollY * 0.06}px, 0)`

                // Nebula parallax with subtle rotation
                const nebula = el.querySelector('.nebula')
                if (nebula) {
                    const nebulaRotate = Math.sin(state.time * 0.1) * 2
                    nebula.style.transform = `translate3d(${state.tx / 10}px, ${state.ty / 10 + state.scrollY * 0.01}px, 0) rotate(${nebulaRotate}deg)`
                }

                // Shooting stars occasional trigger
                const shootingStars = el.querySelectorAll('.shooting-star')
                shootingStars.forEach((star, i) => {
                    const phase = (state.time + i * 7) % 15
                    if (phase < 0.8) {
                        star.style.opacity = Math.sin(phase / 0.8 * Math.PI)
                        star.style.transform = `translateX(${phase * 200}px) translateY(${phase * 100}px)`
                    } else {
                        star.style.opacity = 0
                    }
                })
            }

            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener('mousemove', onMouse)
            window.removeEventListener('scroll', onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <div ref={containerRef} aria-hidden className="space-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* Deep space gradient base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000008] via-[#050520] to-[#0a0a1a]" />

            {/* Nebula clouds */}
            <div className="nebula" />
            <div className="nebula nebula-2" />

            {/* Star layers with generated positions */}
            <div className="stars stars-slow">
                {stars.slow.map((star, i) => (
                    <div
                        key={i}
                        className="star star-twinkle"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}
            </div>
            <div className="stars stars-mid">
                {stars.mid.map((star, i) => (
                    <div
                        key={i}
                        className="star star-twinkle-fast"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}
            </div>
            <div className="stars stars-fast">
                {stars.fast.map((star, i) => (
                    <div
                        key={i}
                        className="star star-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size + 1}px`,
                            height: `${star.size + 1}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.delay}s`,
                            background: i % 5 === 0 ? themeColors.primary : '#fff'
                        }}
                    />
                ))}
            </div>

            {/* Cosmic dust particles */}
            <div ref={particlesRef} className="cosmic-dust">
                {cosmicDust.map((p, i) => (
                    <div
                        key={i}
                        className="dust-particle"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: p.opacity,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* Shooting stars */}
            <div className="shooting-stars">
                <div className="shooting-star shooting-star-1" />
                <div className="shooting-star shooting-star-2" />
                <div className="shooting-star shooting-star-3" />
            </div>

            {/* Network/Neural connection lines - DISABLED */}
        </div>
    )
}
