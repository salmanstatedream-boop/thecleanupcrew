import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { Droplets, Building2, Waves, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
    {
        id: 'window-cleaning',
        title: 'Residential Window Cleaning',
        description: 'Spotless, streak-free windows using our 100% pure deionized water system. We clean frames, sills, and glass up to 4 stories high safely from the ground.',
        icon: Droplets,
        price: 'From $6.50/pane',
        features: ['Interior & Exterior', 'Screen Brushing', 'Track Vacuuming', 'Hard Water Stain Removal']
    },
    {
        id: 'commercial-cleaning',
        title: 'Commercial Cleaning',
        description: 'Keep your business looking its best. Perfect for retail storefronts, restaurants, office buildings, and mid-rise commercial properties.',
        icon: Building2,
        price: 'Custom Quote',
        features: ['Flexible Scheduling', 'Fully Insured (WSIB)', 'Multi-Location Packages', 'Post-Construction Cleanup']
    },
    {
        id: 'eavestrough-cleaning',
        title: 'Eavestrough & Gutter Cleaning',
        description: 'Protect your foundation and roof from water damage. We remove all debris and flush your downspouts to ensure proper flow.',
        icon: Waves,
        price: 'From $149',
        features: ['Debris Removal', 'Downspout Flushing', 'Before/After Photos', 'Minor Repair Options']
    },
    {
        id: 'carpet-cleaning',
        title: 'Carpet Cleaning',
        description: 'Deep extraction carpet cleaning that removes dirt, allergens, and tough stains, leaving your carpets fresh and revitalized.',
        icon: Sparkles,
        price: 'From $35/room',
        features: ['Hot Water Extraction', 'Pet Odor Neutralization', 'Stain Treatment', 'Quick Dry Process']
    }
]

export default function ServicesPage() {
    return (
        <div className="bg-black min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 relative">
            {/* Background elements */}
            <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <section className="container mx-auto px-5 md:px-4 mb-12 md:mb-20 relative z-10">
                <RevealOnScroll>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">Premium London Cleaning Services</h1>
                        <p className="text-white/40 text-base md:text-lg">Comprehensive exterior window and property maintenance tailored to the exact needs of London&apos;s residential and commercial properties.</p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Services List */}
            <section className="container mx-auto px-5 md:px-4 relative z-10 space-y-5 md:space-y-8">
                {services.map((service, index) => (
                    <RevealOnScroll key={service.id} delay={index * 0.1}>
                        <div className="bg-[#111111]/50 backdrop-blur-sm border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 hover:bg-[#111111] hover:border-[#FFD700]/30 transition-all group">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">

                                {/* Icon & Title */}
                                <div className="lg:col-span-4 flex flex-col items-start">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#FFD700] group-hover:scale-110 transition-all duration-300">
                                        <service.icon className="w-7 h-7 md:w-8 md:h-8 text-[#FFD700] group-hover:text-[#0A1628] transition-colors" />
                                    </div>
                                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{service.title}</h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#FFD700] font-medium font-accent text-sm">
                                        {service.price}
                                    </div>
                                </div>

                                {/* Description & Features */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                                    <div>
                                        <p className="text-white/40 text-base md:text-lg leading-relaxed mb-4 md:mb-6">{service.description}</p>
                                        <Link href={`/services/${service.id}`} className="inline-flex items-center gap-2 text-[#FFD700] hover:text-white font-medium transition-colors border-b border-[#FFD700]/30 hover:border-white pb-1 w-fit">
                                            View full details <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="bg-black/50 rounded-2xl p-5 md:p-6 border border-white/5">
                                        <h4 className="text-white font-medium mb-3 md:mb-4 text-sm md:text-base">What&apos;s Included:</h4>
                                        <ul className="space-y-2.5 md:space-y-3">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-white/40">
                                                    <div className="w-5 h-5 rounded-full bg-[#FFD700]/10 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"></div>
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                ))}
            </section>

            {/* Bottom CTA */}
            <section className="container mx-auto px-5 md:px-4 mt-16 md:mt-24">
                <RevealOnScroll>
                    <div className="bg-gradient-to-r from-[#1B2A4A] to-[#0A1628] border border-[#FFD700]/20 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-[0_0_50px_rgba(0,212,255,0.05)]">
                        <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">Not sure what you need?</h3>
                        <p className="text-white/40 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">Build a custom package and get an exact price estimate instantly using our smart quoting tool.</p>
                        <Link href="/quote" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#FFD700] hover:bg-[#FFC107] text-[#0A1628] font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                            Start Instant Quote
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </RevealOnScroll>
            </section>
        </div>
    )
}
