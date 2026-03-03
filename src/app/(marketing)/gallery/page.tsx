import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const projects = [
    {
        title: 'Downtown Toronto Office Tower',
        category: 'Commercial',
        description: 'Full exterior cleaning of 12-story commercial building in the Financial District.',
        result: '240 windows cleaned in one day',
    },
    {
        title: 'Mississauga Luxury Estate',
        category: 'Residential',
        description: 'Complete window and eavestrough cleaning for a 6,000 sq ft lakeside property.',
        result: 'Streak-free crystal clear finish',
    },
    {
        title: 'Vaughan Retail Plaza',
        category: 'Commercial',
        description: 'Quarterly maintenance contract for 8-unit retail plaza storefront windows.',
        result: '100% tenant satisfaction rate',
    },
    {
        title: 'Oakville Heritage Home',
        category: 'Residential',
        description: 'Delicate cleaning of heritage stained glass and traditional sash windows.',
        result: 'Zero damage, pristine results',
    },
    {
        title: 'Brampton Condo Complex',
        category: 'Commercial',
        description: 'Eavestrough and downspout cleaning for 3-building residential complex.',
        result: 'Full debris removal & flush',
    },
    {
        title: 'Vancouver Waterfront Penthouse',
        category: 'Residential',
        description: 'High-rise penthouse window cleaning using water-fed pole technology.',
        result: 'Spotless panoramic views restored',
    },
]

export default function GalleryPage() {
    return (
        <div className="bg-black min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
            <section className="container mx-auto px-5 md:px-4 mb-10 md:mb-16">
                <RevealOnScroll>
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-3 md:mb-4">Our Portfolio</p>
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-5 md:mb-6 leading-tight">
                            Work That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC107]">Speaks</span> For Itself
                        </h1>
                        <p className="text-white/40 text-base md:text-lg lg:text-xl leading-relaxed">
                            From luxury estates to commercial towers — see what crystal clear results look like across Canada.
                        </p>
                    </div>
                </RevealOnScroll>
            </section>

            <section className="container mx-auto px-5 md:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {projects.map((project, i) => (
                        <RevealOnScroll key={i} delay={i * 0.1}>
                            <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#FFD700]/20 transition-all duration-500">
                                {/* Image placeholder with gradient */}
                                <div className="h-40 md:h-48 bg-gradient-to-br from-[#111111] to-[#1a1a1a] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10" />
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                                        <span className="px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] text-xs font-semibold uppercase tracking-wider rounded-full border border-[#FFD700]/20">
                                            {project.category}
                                        </span>
                                    </div>
                                    {/* Abstract pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#FFD700]/30 rounded-full" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full" />
                                    </div>
                                </div>

                                <div className="p-5 md:p-6">
                                    <h3 className="font-heading font-bold text-base md:text-lg text-white mb-2">{project.title}</h3>
                                    <p className="text-white/40 text-sm mb-3 md:mb-4">{project.description}</p>
                                    <div className="flex items-center gap-2 text-[#FFD700] text-sm font-semibold">
                                        <Star className="w-4 h-4 fill-[#FFD700] shrink-0" />
                                        {project.result}
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-5 md:px-4 mt-16 md:mt-24">
                <RevealOnScroll>
                    <div className="text-center">
                        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Want Results Like These?</h2>
                        <p className="text-white/40 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">Get a free, no-obligation quote and join hundreds of happy Canadian homeowners and businesses.</p>
                        <Link href="/quote" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#FFD700] text-black font-bold rounded-full hover:bg-white transition-all hover:scale-105 uppercase tracking-wider text-sm">
                            Get Your Free Quote
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </RevealOnScroll>
            </section>
        </div>
    )
}
