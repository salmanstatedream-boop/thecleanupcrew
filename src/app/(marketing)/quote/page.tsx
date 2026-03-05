'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Building2, Home, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

type FormStep = 1 | 2 | 3 | 4

export default function QuotePage() {
    const [step, setStep] = useState<FormStep>(1)
    const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | null>(null)
    const [details, setDetails] = useState({ windows: 10, floors: 1, addOns: [] as string[] })
    const [contact, setContact] = useState({ name: '', email: '', phone: '' })
    const [isCalculating, setIsCalculating] = useState(false)
    const [quoteResult, setQuoteResult] = useState<{ estimate: number, currency: string } | null>(null)

    const handleNext = () => setStep((s) => Math.min(s + 1, 4) as FormStep)
    const handleBack = () => setStep((s) => Math.max(s - 1, 1) as FormStep)

    const toggleAddOn = (id: string) => {
        setDetails(prev => ({
            ...prev,
            addOns: prev.addOns.includes(id) ? prev.addOns.filter(a => a !== id) : [...prev.addOns, id]
        }))
    }

    const submitQuote = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCalculating(true)

        try {
            // Direct call to edge function (mocked behavior if function not yet deployed)
            const mockCalculate = () => {
                let baseRate = propertyType === 'residential' ? 6.50 : 4.00
                let multiplier = details.floors > 2 ? 1.2 : 1.0
                let total = (details.windows * baseRate * multiplier)
                if (details.addOns.includes('screens')) total += (details.windows * 2)
                if (details.addOns.includes('tracks')) total += 45
                return Number(total.toFixed(2))
            }

            // Simulate network delay
            await new Promise(r => setTimeout(r, 1500))

            setQuoteResult({
                estimate: mockCalculate(),
                currency: 'CAD'
            })
            setStep(4)
        } catch (err) {
            console.error(err)
        } finally {
            setIsCalculating(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh)] bg-[#F8F6F0] py-24 md:py-32 relative overflow-hidden flex flex-col items-center">
            {/* Background glow elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFC107]/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-5 md:px-4 max-w-3xl relative z-10 w-full">
                <div className="mb-8 md:mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#1A1A1A] mb-3 md:mb-4">Your Instant Estimate</h1>
                    <p className="text-muted-foreground text-sm md:text-base">Answer a few simple questions to get your crystal clear price.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 md:mb-12 relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#FFD700] to-[#FFC107]"
                        initial={{ width: '25%' }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </div>

                <div className="bg-white/85 backdrop-blur-xl border border-black/10 rounded-2xl md:rounded-3xl p-5 md:p-12 shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: PROPERTY TYPE */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-5 md:gap-6"
                            >
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1A1A1A] text-center mb-2 md:mb-6">What type of property?</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setPropertyType('residential'); handleNext() }}
                                        className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 transition-all group ${propertyType === 'residential' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-black/10 hover:border-black/30 bg-white'}`}
                                    >
                                        <Home className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 transition-colors ${propertyType === 'residential' ? 'text-[#FFD700]' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                        <span className={`text-base md:text-lg font-bold transition-colors ${propertyType === 'residential' ? 'text-[#1A1A1A]' : 'text-muted-foreground group-hover:text-foreground'}`}>Residential Home</span>
                                    </button>

                                    <button
                                        onClick={() => { setPropertyType('commercial'); handleNext() }}
                                        className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 transition-all group ${propertyType === 'commercial' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-black/10 hover:border-black/30 bg-white'}`}
                                    >
                                        <Building2 className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 transition-colors ${propertyType === 'commercial' ? 'text-[#FFD700]' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                        <span className={`text-base md:text-lg font-bold transition-colors ${propertyType === 'commercial' ? 'text-[#1A1A1A]' : 'text-muted-foreground group-hover:text-foreground'}`}>Commercial/Office</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1A1A1A] text-center mb-6 md:mb-8">Property Details</h2>

                                <div className="space-y-6 md:space-y-8">
                                    <div>
                                        <div className="flex justify-between text-[#1A1A1A] mb-3 md:mb-4">
                                            <label className="font-medium text-sm md:text-base">Number of Windows (approx)</label>
                                            <span className="font-accent text-[#FFD700] text-lg md:text-xl font-bold">{details.windows}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5" max="100" step="5"
                                            value={details.windows}
                                            onChange={(e) => setDetails({ ...details, windows: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[#1A1A1A] mb-3 md:mb-4">
                                            <label className="font-medium text-sm md:text-base">Highest Floor to Clean</label>
                                            <span className="font-accent text-[#FFD700] text-lg md:text-xl font-bold">{details.floors}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max={propertyType === 'residential' ? 4 : 20} step="1"
                                            value={details.floors}
                                            onChange={(e) => setDetails({ ...details, floors: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2 text-right">Above 2 floors incurs a minor high-reach fee.</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-[#1A1A1A] mb-3 md:mb-4 block text-sm md:text-base">Recommended Add-Ons</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div
                                                onClick={() => toggleAddOn('screens')}
                                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors min-h-[52px] ${details.addOns.includes('screens') ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#1A1A1A]' : 'bg-white border-black/10 text-muted-foreground hover:border-black/30'}`}
                                            >
                                                <span className="text-sm md:text-base">Screen Cleaning</span>
                                                {details.addOns.includes('screens') && <Check className="w-5 h-5 text-[#FFD700]" />}
                                            </div>
                                            <div
                                                onClick={() => toggleAddOn('tracks')}
                                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors min-h-[52px] ${details.addOns.includes('tracks') ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#1A1A1A]' : 'bg-white border-black/10 text-muted-foreground hover:border-black/30'}`}
                                            >
                                                <span className="text-sm md:text-base">Deep Track Cleaning</span>
                                                {details.addOns.includes('tracks') && <Check className="w-5 h-5 text-[#FFD700]" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 md:mt-12 gap-3">
                                    <button onClick={handleBack} className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-3 sm:py-0">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button onClick={handleNext} className="flex items-center justify-center gap-2 bg-white text-[#0A1628] px-6 py-3 rounded-full font-bold hover:bg-[#FFD700] transition-colors w-full sm:w-auto">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CONTACT & CALCULATE */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1A1A1A] text-center mb-1 md:mb-2">Where to send the estimate?</h2>
                                <p className="text-muted-foreground text-center text-sm mb-6 md:mb-8">We won&apos;t spam you. Promise.</p>

                                <form onSubmit={submitQuote} className="space-y-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground block mb-1">Full Name</label>
                                        <input
                                            required type="text"
                                            value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })}
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] transition-colors"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground block mb-1">Email</label>
                                            <input
                                                required type="email"
                                                value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] transition-colors"
                                                placeholder="jane@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground block mb-1">Phone</label>
                                            <input
                                                required type="tel"
                                                value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })}
                                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] transition-colors"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 md:mt-12 items-center gap-3">
                                        <button type="button" onClick={handleBack} className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-3 sm:py-0 w-full sm:w-auto">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isCalculating}
                                            className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFC107] text-[#0A1628] px-8 py-3.5 rounded-full font-bold transition-colors disabled:opacity-50 w-full sm:w-auto sm:min-w-[200px] justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                                        >
                                            {isCalculating ? (
                                                <div className="w-5 h-5 border-2 border-[#0A1628] border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>Reveal Estimate <Sparkles className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 4: SUCCESS / RESULT */}
                        {step === 4 && quoteResult && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4 md:py-8"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6">
                                    <Check className="w-8 h-8 md:w-10 md:h-10 text-[#22C55E]" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Estimate Ready</h2>
                                <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">A copy has been sent to {contact.email}</p>

                                <div className="bg-[#F8F6F0] border border-black/10 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 inline-block w-full sm:w-auto sm:min-w-[300px]">
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Estimated Total</p>
                                    <div className="flex items-start justify-center text-[#1A1A1A]">
                                        <span className="text-xl md:text-2xl font-bold mt-1 mr-1">$</span>
                                        <span className="text-4xl md:text-6xl font-accent font-bold tracking-tighter">{quoteResult.estimate.toFixed(2)}</span>
                                        <span className="text-base md:text-xl font-medium mt-3 md:mt-6 ml-2 text-muted-foreground">{quoteResult.currency}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 md:mt-4">*Final price confirmed upon on-site inspection.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                    <Link href="/contact" className="bg-[#FFD700] hover:bg-white text-black px-8 py-3.5 rounded-full font-bold transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] text-center">
                                        Book An Appointment
                                    </Link>
                                    <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground font-medium px-8 py-3 transition-colors">
                                        Recalculate
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}


