import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { CheckCircle2, Users, Leaf, ShieldCheck } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-black min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
            {/* Hero Section */}
            <section className="container mx-auto px-5 md:px-4 mb-16 md:mb-24">
                <RevealOnScroll>
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-3 md:mb-4">About Us</p>
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-5 md:mb-6 leading-tight">
                            Canada&apos;s Most Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC107]">Cleaning Crew</span>
                        </h1>
                        <p className="text-white/40 text-base md:text-lg lg:text-xl leading-relaxed">
                            The Clean Up Crew was built on a single, uncompromising standard: deliver crystal-clear perfection using eco-conscious technology. From prestigious commercial storefronts to luxury residential estates across Canada, we restore your pristine view.
                        </p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Stats/Values Grid */}
            <section className="container mx-auto px-5 md:px-4 mb-20 md:mb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <RevealOnScroll delay={0.1}>
                        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#FFD700]/30 transition-all duration-500">
                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-5 md:mb-6">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                            </div>
                            <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-2 md:mb-3">Expert Team</h3>
                            <p className="text-white/40 text-sm">Every crew member is rigorously trained, background-checked, and committed to excellence.</p>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll delay={0.2}>
                        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#22C55E]/30 transition-all duration-500">
                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center mb-5 md:mb-6">
                                <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#22C55E]" />
                            </div>
                            <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-2 md:mb-3">Eco-Friendly</h3>
                            <p className="text-white/40 text-sm">We use 100% pure deionized water systems that leave zero chemical residue on your property.</p>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll delay={0.3}>
                        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#FFD700]/30 transition-all duration-500">
                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-5 md:mb-6">
                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                            </div>
                            <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-2 md:mb-3">Fully Insured</h3>
                            <p className="text-white/40 text-sm">Comprehensive liability insurance and WSIB compliance for your complete peace of mind.</p>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll delay={0.4}>
                        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#A855F7]/30 transition-all duration-500">
                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#A855F7]/10 flex items-center justify-center mb-5 md:mb-6">
                                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#A855F7]" />
                            </div>
                            <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-2 md:mb-3">Guaranteed</h3>
                            <p className="text-white/40 text-sm">If you spot a streak or smudge within 48 hours of our service, we&apos;ll re-clean it for free.</p>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Story Section */}
            <section className="container mx-auto px-5 md:px-4">
                <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <RevealOnScroll direction="right" className="p-6 py-10 md:p-16 flex flex-col justify-center">
                            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 md:mb-6">Our Story</h2>
                            <div className="space-y-4 text-white/40 text-sm md:text-base">
                                <p>
                                    We started with a squeegee and a vision: to elevate the standard of property maintenance across Canada. We noticed that high-end homes and commercial storefronts were often neglected by &quot;splash and dash&quot; services.
                                </p>
                                <p>
                                    Today, The Clean Up Crew employs state-of-the-art water-fed pole technology, allowing us to safely reach up to 5 stories from the ground without ladders, delivering a superior, safer, and faster clean.
                                </p>
                                <p>
                                    Whether it&apos;s a multi-million-dollar residential estate or a bustling retail location, we bring the same level of white-glove service and obsessive attention to detail.
                                </p>
                            </div>
                            <div className="mt-8 md:mt-10">
                                <p className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">The Clean Up Crew</p>
                                <p className="text-sm font-bold tracking-widest text-[#FFD700] uppercase">Canada&apos;s Finest</p>
                            </div>
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.2} direction="left" className="relative min-h-[280px] md:min-h-[400px] lg:min-h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] to-transparent z-10 hidden lg:block"></div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584820927498-cafe8c1c9641?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>
        </div>
    )
}
