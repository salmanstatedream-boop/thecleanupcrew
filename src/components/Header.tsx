'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PhoneCall } from 'lucide-react'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    const toggleMenu = useCallback(() => {
        setMobileMenuOpen(prev => {
            const next = !prev
            if (next) {
                document.body.classList.add('menu-open')
            } else {
                document.body.classList.remove('menu-open')
            }
            return next
        })
    }, [])

    const closeMenu = useCallback(() => {
        setMobileMenuOpen(false)
        document.body.classList.remove('menu-open')
    }, [])

    // Close menu on route change
    useEffect(() => {
        closeMenu()
    }, [pathname, closeMenu])

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-[#F8F6F0]/90 backdrop-blur-xl border-b border-black/10 py-2.5 md:py-3'
                : 'bg-transparent py-3.5 md:py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group relative z-50">
                    <Image
                        src="/images/logo.png"
                        alt="The Clean Up Crew - Canada's Premium Cleaning Service"
                        width={200}
                        height={60}
                        className="h-9 md:h-12 w-auto drop-shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all group-hover:drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex flex-1 justify-center items-center space-x-10">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative text-sm font-semibold uppercase tracking-widest transition-colors py-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFD700] to-[#FFC107] rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Desktop CTAs */}
                <div className="hidden lg:flex items-center gap-5">
                    <a href="tel:440985298" className="flex items-center gap-2 text-sm font-bold text-foreground/80 hover:text-foreground transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                            <PhoneCall className="w-3.5 h-3.5 text-[#FFD700]" />
                        </div>
                        +440-98-5298
                    </a>
                    <Link
                        href="/login"
                        className="text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link href="/quote">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#FFD700] hover:bg-white text-black font-bold text-sm px-7 py-3 rounded-full animate-pulse-glow transition-all uppercase tracking-wider"
                        >
                            Get Free Quote
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-foreground p-2.5 relative z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    onClick={toggleMenu}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Menu className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Fullscreen Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 top-0 bg-[#F8F6F0]/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col"
                    >
                        <div className="flex-1 flex flex-col justify-center items-center px-8 gap-2">
                            {navLinks.map((link, i) => {
                                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`block text-center text-2xl font-bold uppercase tracking-widest py-3.5 transition-colors ${isActive ? 'text-[#FFD700]' : 'text-muted-foreground active:text-foreground'}`}
                                            onClick={closeMenu}
                                        >
                                            {link.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="mobileActiveIndicator"
                                                    className="w-8 h-0.5 bg-[#FFD700] mx-auto mt-1.5 rounded-full"
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Bottom CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.4 }}
                            className="px-6 pb-10 space-y-3"
                        >
                            <a href="tel:440985298" className="flex items-center justify-center gap-3 text-foreground bg-white/80 border border-black/10 py-4 rounded-2xl font-medium text-base">
                                <PhoneCall className="w-5 h-5 text-[#FFD700]" />
                                +440-98-5298
                            </a>
                            <Link href="/login" onClick={closeMenu}>
                                <div className="w-full text-center bg-white/80 border border-black/10 text-foreground font-bold py-4 rounded-2xl uppercase tracking-wider text-base">
                                    Sign In
                                </div>
                            </Link>
                            <Link href="/quote" onClick={closeMenu}>
                                <div className="w-full text-center bg-[#FFD700] text-black font-bold py-4 rounded-2xl uppercase tracking-wider text-base mt-3">
                                    Get Free Quote
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

