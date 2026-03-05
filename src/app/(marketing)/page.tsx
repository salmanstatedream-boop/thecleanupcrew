'use client'

import HeroScene from '@/components/spline/HeroScene'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ParallaxLayer } from '@/components/ui/ParallaxLayer'
import { ArrowRight, Droplets, Building2, Waves, Sparkles, Star, Shield, Leaf, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO — High-End Spline-Style Fluid Mesh */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <HeroScene />
          {/* Subtle noise/vignette overlay for text contract */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505] z-10 pointer-events-none" />
          {/* Gradient to smooth out the bottom transition into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-5 md:px-4 min-h-screen flex flex-col justify-center items-center text-center pt-24 pb-16">
          <ParallaxLayer speed={-0.25} fadeOut className="flex flex-col items-center">
            <RevealOnScroll delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-6 md:mb-8 shadow-xl">
                <span className="flex h-2 w-2 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]"></span>
                <span className="text-xs md:text-sm font-semibold text-white uppercase tracking-widest drop-shadow-md">Canada&apos;s #1 Rated</span>
              </div>
            </RevealOnScroll>
          </ParallaxLayer>

          <ParallaxLayer speed={-0.45} fadeOut className="flex flex-col items-center">
            <RevealOnScroll delay={0.4}>
              <h1 className="font-heading font-bold text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] tracking-tight text-white mb-5 md:mb-6 leading-[1.1] md:leading-[1.05] px-2 sm:px-0 drop-shadow-lg">
                We Make Your Property
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFE033] to-[#FFD700] drop-shadow-xl animate-gradient-text filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  Absolutely Spotless.
                </span>
              </h1>
            </RevealOnScroll>
          </ParallaxLayer>

          <ParallaxLayer speed={-0.65} fadeOut className="flex flex-col items-center w-full">
            <RevealOnScroll delay={0.6}>
              <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed px-2 sm:px-0 drop-shadow-md font-medium">
                Professional window cleaning, eavestrough maintenance, and commercial exteriors for Canadian homeowners and businesses. Eco-friendly. Fully insured. Satisfaction guaranteed.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-center justify-center w-full sm:w-auto px-2 sm:px-0">
                <Link href="/quote" className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#FFD700] hover:bg-white text-black font-bold rounded-full transition-all hover:scale-105 animate-pulse-glow uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  Get Your Free Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-white font-semibold hover:bg-white/10 hover:text-white transition-colors rounded-full border border-white/30 hover:border-white/60 uppercase tracking-wider text-sm backdrop-blur-sm shadow-lg">
                  Our Services
                </Link>
              </div>
            </RevealOnScroll>
          </ParallaxLayer>

          {/* Trust bar — fastest parallax */}
          <ParallaxLayer speed={-0.9} fadeOut className="w-full">
            <RevealOnScroll delay={1.0}>
              <div className="mt-12 md:mt-16 grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/90 text-sm sm:text-base font-medium drop-shadow-md">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-[#22C55E] shrink-0 drop-shadow-sm" />
                  <span>WSIB Compliant</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Leaf className="w-5 h-5 text-[#22C55E] shrink-0 drop-shadow-sm" />
                  <span>Eco-Friendly</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700] shrink-0 drop-shadow-sm" />
                  <span>4.9★ Rating</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FFD700] shrink-0 drop-shadow-sm" />
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </RevealOnScroll>
          </ParallaxLayer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STATS — Bold numbers, pure black */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-16 bg-[#F8F6F0] border-y border-black/10">
        <div className="container mx-auto px-5 md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-1 md:mb-2">15K<span className="text-[#FFD700]">+</span></h3>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">Windows Cleaned</p>
            </div>
            <div>
              <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-1 md:mb-2">4.9<span className="text-[#FFD700]">★</span></h3>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">Google Rating</p>
            </div>
            <div>
              <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-1 md:mb-2">500<span className="text-[#FFD700]">+</span></h3>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">Happy Clients</p>
            </div>
            <div>
              <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-1 md:mb-2">8<span className="text-[#22C55E]">+</span></h3>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SERVICES — Bento Grid, pure black cards */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32 bg-[#F8F6F0] relative overflow-hidden" id="services">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700]/3 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-5 md:px-4 relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-3 md:mb-4">What We Do</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-4 md:mb-6">Services That<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC107]">Speak For Themselves</span></h2>
              <p className="text-muted-foreground text-base md:text-lg">Premium exterior care for Canadian homes and businesses.</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

            {/* Window Cleaning */}
            <RevealOnScroll delay={0.1} className="lg:col-span-2 group relative rounded-2xl overflow-hidden bg-white border border-black/10 hover:border-[#FFD700]/30 transition-all duration-500 min-h-[320px] md:min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F0]/80 via-[#F8F6F0]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('/images/window-hero.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"></div>
              <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#FFD700] transition-all duration-300">
                  <Droplets className="w-6 h-6 md:w-7 md:h-7 text-[#FFD700] group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-[#1A1A1A] mb-2 md:mb-3">Window Cleaning</h3>
                <p className="text-muted-foreground mb-4 md:mb-5 max-w-md text-sm md:text-base">Pure-water technology for streak-free, crystal-clear windows. Safe for all heights up to 5 stories.</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base md:text-lg text-[#1A1A1A]">From <span className="text-[#FFD700]">$6.50</span>/pane</span>
                  <Link href="/services/window-cleaning" className="text-[#FFD700] hover:text-foreground font-semibold flex items-center gap-1 text-xs md:text-sm uppercase tracking-wider">Learn More <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            </RevealOnScroll>

            {/* Commercial */}
            <RevealOnScroll delay={0.2} className="group relative rounded-2xl overflow-hidden bg-white border border-black/10 p-6 md:p-8 flex flex-col hover:border-[#FFD700]/30 transition-all duration-500 min-h-[280px] md:min-h-[400px]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black/5 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#FFD700]/10 transition-all">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1A1A1A] mb-2 md:mb-3">Commercial Cleaning</h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-6 flex-grow">Storefronts, offices, and mid-rise buildings. Flexible scheduling for Canadian businesses.</p>
              <span className="font-bold text-[#1A1A1A] mb-3 md:mb-4">Custom Quote</span>
              <Link href="/services/commercial-cleaning" className="mt-auto inline-flex w-fit items-center text-sm font-semibold text-[#FFD700] hover:text-foreground transition-colors uppercase tracking-wider">
                View Packages
              </Link>
            </RevealOnScroll>

            {/* Eavestrough */}
            <RevealOnScroll delay={0.3} className="group relative rounded-2xl overflow-hidden bg-white border border-black/10 p-6 md:p-8 flex flex-col hover:border-[#FFD700]/30 transition-all duration-500 min-h-[280px] md:min-h-[400px]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black/5 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#FFD700]/10 transition-all">
                <Waves className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1A1A1A] mb-2 md:mb-3">Eavestrough Cleaning</h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-6 flex-grow">Protect your foundation from Canada&apos;s harsh weather. Full debris removal and downspout flushing.</p>
              <span className="font-bold text-[#1A1A1A] mb-3 md:mb-4">From <span className="text-[#FFD700]">$149</span></span>
              <Link href="/services/eavestrough-cleaning" className="mt-auto inline-flex w-fit items-center text-sm font-semibold text-[#FFD700] hover:text-foreground transition-colors uppercase tracking-wider">
                View Details
              </Link>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS — 3-step process */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32 bg-[#F8F6F0] relative">
        <div className="container mx-auto px-5 md:px-4">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-3 md:mb-4">How It Works</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A]">Sparkling Clean<br />In <span className="text-[#FFD700]">3 Easy Steps</span></h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <RevealOnScroll delay={0.1}>
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-white border border-black/10 flex items-center justify-center group-hover:border-[#FFD700]/30 group-hover:glow-cyan transition-all duration-500">
                  <span className="text-2xl md:text-3xl font-heading font-bold text-[#FFD700]">01</span>
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-2 md:mb-3">Get Your Free Quote</h3>
                <p className="text-muted-foreground text-sm">Use our instant online calculator or call us. No obligation, no hidden fees.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-white border border-black/10 flex items-center justify-center group-hover:border-[#FFD700]/30 group-hover:glow-cyan transition-all duration-500">
                  <span className="text-2xl md:text-3xl font-heading font-bold text-[#FFD700]">02</span>
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-2 md:mb-3">We Do The Work</h3>
                <p className="text-muted-foreground text-sm">Our WSIB-certified crew arrives on time with pure-water eco-tech. Sit back and relax.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-white border border-black/10 flex items-center justify-center group-hover:border-[#FFD700]/30 group-hover:glow-cyan transition-all duration-500">
                  <span className="text-2xl md:text-3xl font-heading font-bold text-[#FFD700]">03</span>
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-2 md:mb-3">Enjoy Crystal Clear</h3>
                <p className="text-muted-foreground text-sm">Love the results or we&apos;ll re-clean for free. 48-hour satisfaction guarantee.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS — Social proof like KingKong */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32 bg-[#F2EEDF] relative overflow-hidden">
        <div className="container mx-auto px-5 md:px-4 relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-3 md:mb-4">Don't Take Our Word For It</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-3 md:mb-4">What Our <span className="text-[#FFD700]">Canadian</span><br />Customers Say</h2>
              <div className="flex items-center justify-center gap-1 mt-3 md:mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700] fill-[#FFD700]" />
                ))}
                <span className="ml-2 md:ml-3 text-muted-foreground text-xs md:text-sm">4.9 out of 5 from 200+ reviews</span>
              </div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Sarah M.', location: 'Toronto, ON', text: "Absolutely incredible service. They cleaned every single window in our 3-story home and left them spotless. The pure-water system is amazing — no soap residue, no streaks. Will definitely book again!", rating: 5 },
              { name: 'James K.', location: 'Mississauga, ON', text: "We use The Clean Up Crew for our office building quarterly. They're always on time, professional, and the results are consistently excellent. Best commercial cleaners we've ever hired.", rating: 5 },
              { name: 'Linda P.', location: 'Vancouver, BC', text: "Our eavestroughs were completely clogged after fall. These guys cleared everything, flushed the downspouts, and even sent us before/after photos. Top-notch service at a fair price.", rating: 5 },
            ].map((review, i) => (
              <RevealOnScroll key={i} delay={i * 0.15}>
                <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 h-full flex flex-col hover:border-[#FFD700]/20 transition-all duration-500">
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FFD700] fill-[#FFD700]" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-5 md:mb-6">&quot;{review.text}&quot;</p>
                  <div className="border-t border-black/10 pt-3 md:pt-4">
                    <p className="font-semibold text-[#1A1A1A] text-sm md:text-base">{review.name}</p>
                    <p className="text-muted-foreground text-xs">{review.location}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA — Call to action, phone-focused */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-[#F8F6F0]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-5 md:px-4 relative z-10 text-center">
          <RevealOnScroll>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1A1A1A] mb-4 md:mb-6">
              Ready For A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC107]">Brighter</span> View?
            </h2>
            <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12">Get an instant estimate in seconds. No hidden fees, no commitment. Just crystal clear pricing for crystal clear results.</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center px-2 sm:px-0">
              <Link href="/quote" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-[#FFD700] text-black hover:bg-white font-bold rounded-full transition-all hover:scale-105 animate-pulse-glow uppercase tracking-wider text-sm">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:440985298" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border border-black/10 hover:border-black/30 text-foreground/80 hover:text-foreground font-semibold rounded-full transition-all uppercase tracking-wider text-sm">
                Or Call +440-98-5298
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}


