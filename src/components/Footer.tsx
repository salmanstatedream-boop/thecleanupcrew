'use client'

import Link from 'next/link'
import { Facebook, Instagram, ShieldCheck, Award, Leaf, MapPin, Phone, Mail, Droplets } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-[#F8F6F0] overflow-hidden">
            {/* Top gradient divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

            {/* Giant brand watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
                <h2 className="font-heading text-[5rem] md:text-[14rem] lg:text-[18rem] font-bold text-black/5 whitespace-nowrap leading-none tracking-tighter">
                    CLEAN UP
                </h2>
            </div>

            <div className="container mx-auto px-5 md:px-6 pt-12 md:pt-16 pb-6 md:pb-8 relative z-10">

                {/* Main grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-16">

                    {/* Brand Col */}
                    <div className="space-y-5 md:space-y-6 col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block">
                            <span className="font-heading text-xl md:text-2xl font-bold text-foreground">
                                The Clean Up <span className="text-[#FFD700]">Crew</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Canada&apos;s premier window cleaning and exterior maintenance service. Eco-friendly, fully insured, and committed to crystal clear results.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#FFD700]/20 border border-black/10 hover:border-[#FFD700]/30 transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#FFD700]/20 border border-black/10 hover:border-[#FFD700]/30 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Services Col */}
                    <div>
                        <h4 className="font-heading font-bold text-foreground mb-4 md:mb-6 uppercase tracking-widest text-xs md:text-sm">Services</h4>
                        <ul className="space-y-2.5 md:space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/services" className="hover:text-[#FFD700] transition-colors flex items-center gap-2"><Droplets className="w-3 h-3 shrink-0" /> Window Cleaning</Link></li>
                            <li><Link href="/services" className="hover:text-[#FFD700] transition-colors flex items-center gap-2"><Droplets className="w-3 h-3 shrink-0" /> Commercial Cleaning</Link></li>
                            <li><Link href="/services" className="hover:text-[#FFD700] transition-colors flex items-center gap-2"><Droplets className="w-3 h-3 shrink-0" /> Eavestrough Cleaning</Link></li>
                            <li><Link href="/services" className="hover:text-[#FFD700] transition-colors flex items-center gap-2"><Droplets className="w-3 h-3 shrink-0" /> Carpet Cleaning</Link></li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h4 className="font-heading font-bold text-foreground mb-4 md:mb-6 uppercase tracking-widest text-xs md:text-sm">Get In Touch</h4>
                        <div className="space-y-3 md:space-y-4">
                            <a href="tel:440985298" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#FFD700] transition-colors">
                                <Phone className="w-4 h-4 text-[#FFD700] shrink-0" />
                                +440-98-5298
                            </a>
                            <a href="mailto:info@thecleanupcrew.ca" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#FFD700] transition-colors">
                                <Mail className="w-4 h-4 text-[#FFD700] shrink-0" />
                                <span className="break-all">info@thecleanupcrew.ca</span>
                            </a>
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                                <span>FVJR+J2Q, London<br />United Kingdom</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Col */}
                    <div>
                        <h4 className="font-heading font-bold text-foreground mb-4 md:mb-6 uppercase tracking-widest text-xs md:text-sm">Why Us</h4>
                        <div className="space-y-2.5 md:space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/[0.02] p-2.5 md:p-3 rounded-lg border border-black/10">
                                <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
                                <span>Fully Insured & WSIB</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/[0.02] p-2.5 md:p-3 rounded-lg border border-black/10">
                                <Award className="w-5 h-5 text-[#FFD700] shrink-0" />
                                <span>Top Rated on Google</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/[0.02] p-2.5 md:p-3 rounded-lg border border-black/10">
                                <Leaf className="w-5 h-5 text-[#22C55E] shrink-0" />
                                <span>100% Eco-Friendly</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Service areas */}
                <div className="border-t border-black/10 pt-6 md:pt-8 mb-6 md:mb-8">
                    <p className="text-center text-muted-foreground text-xs uppercase tracking-widest mb-3 md:mb-4">Proudly Serving</p>
                    <p className="text-center text-muted-foreground text-xs md:text-sm leading-relaxed">
                        Toronto · Mississauga · Brampton · Vaughan · Markham · Oakville · Hamilton · London · Ottawa · Vancouver
                    </p>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-black/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs text-muted-foreground">
                    <p>&copy; {currentYear} The Clean Up Crew. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/contact" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

