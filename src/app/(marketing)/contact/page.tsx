"use client";

import { useState } from "react";
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    function update(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                phone: form.phone,
                subject: form.service,
                message: form.message,
            }),
        });

        if (res.ok) {
            setStatus("success");
            setForm({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
        } else {
            const data = await res.json();
            setErrorMsg(data.error ?? "Something went wrong. Please try again.");
            setStatus("error");
        }
    }

    return (
        <div className="bg-[#F8F6F0] min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-5 md:px-4 relative z-10">
                <RevealOnScroll>
                    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#1A1A1A] mb-4 md:mb-6 leading-tight">Get In Touch</h1>
                        <p className="text-muted-foreground text-base md:text-lg">Ready for a cleaner space? Whether it&apos;s a luxury residence or a commercial property, our team is ready to help.</p>
                    </div>
                </RevealOnScroll>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <RevealOnScroll delay={0.1}>
                            <div className="bg-white border border-black/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex items-start gap-4 md:gap-6 hover:border-[#FFD700]/30 transition-colors">
                                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-1 md:mb-2">Call Us</h3>
                                    <p className="text-muted-foreground text-sm mb-3 md:mb-4">Fastest way to reach us.</p>
                                    <a href="tel:+14165550123" className="text-lg md:text-xl font-accent font-bold text-[#1A1A1A] hover:text-[#FFD700] transition-colors">+1 (416) 555-0123</a>
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.2}>
                            <div className="bg-white border border-black/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex items-start gap-4 md:gap-6 hover:border-[#FFD700]/30 transition-colors">
                                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-1 md:mb-2">Email Us</h3>
                                    <p className="text-muted-foreground text-sm mb-3 md:mb-4">We aim to reply within 24 hours.</p>
                                    <a href="mailto:info@thecleanupcrew.ca" className="text-base md:text-lg font-medium text-[#1A1A1A] hover:text-[#FFD700] transition-colors break-all">info@thecleanupcrew.ca</a>
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.3}>
                            <div className="bg-white border border-black/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col gap-5 md:gap-6 hover:border-[#FFD700]/30 transition-colors">
                                <div className="flex items-start gap-4 md:gap-6">
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1A1A] mb-1 md:mb-2">Service Areas</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">Toronto, Mississauga, Brampton,<br />Vaughan, Oakville & more</p>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-black/10"></div>
                                <div className="flex items-start gap-4 md:gap-6">
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-base md:text-lg text-[#1A1A1A] mb-1 md:mb-2">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">Monday – Saturday<br />8:00 AM – 7:45 PM</p>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Contact Form */}
                    <RevealOnScroll delay={0.4} className="lg:col-span-3">
                        <div className="bg-white/85 backdrop-blur-md border border-black/10 rounded-2xl md:rounded-3xl p-6 md:p-12 h-full">
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Send a Message</h2>
                            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">Fill out the form below and we&apos;ll get back to you shortly.</p>

                            {status === "success" ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                    <CheckCircle2 className="w-12 h-12 text-[#FFD700]" />
                                    <h3 className="text-xl font-bold text-[#1A1A1A]">Message Sent!</h3>
                                    <p className="text-muted-foreground">We&apos;ll be in touch within 24 hours.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-4 text-sm text-[#FFD700] underline underline-offset-2"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.firstName}
                                                onChange={(e) => update("firstName", e.target.value)}
                                                className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                                placeholder="Jane"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.lastName}
                                                onChange={(e) => update("lastName", e.target.value)}
                                                className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => update("email", e.target.value)}
                                                className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                                placeholder="jane@example.com"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => update("phone", e.target.value)}
                                                className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                                placeholder="(416) 555-0123"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Service of Interest</label>
                                        <select
                                            value={form.service}
                                            onChange={(e) => update("service", e.target.value)}
                                            className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base appearance-none focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                        >
                                            <option value="">Select a service...</option>
                                            <option value="residential">Residential Window Cleaning</option>
                                            <option value="commercial">Commercial Window Cleaning</option>
                                            <option value="eavestrough">Eavestrough Cleaning</option>
                                            <option value="carpet">Carpet Cleaning</option>
                                            <option value="other">Other Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Message</label>
                                        <textarea
                                            rows={4}
                                            required
                                            value={form.message}
                                            onChange={(e) => update("message", e.target.value)}
                                            className="w-full bg-[#F8F6F0] border border-black/10 rounded-xl px-4 py-3.5 md:py-3 text-[#1A1A1A] text-base focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all resize-none"
                                            placeholder="Tell us about your property and what you need help with..."
                                        ></textarea>
                                    </div>

                                    {status === "error" && (
                                        <p className="text-red-400 text-sm">{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="w-full flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#FFC107] disabled:opacity-60 text-[#0A1628] px-8 py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] group mt-4 md:mt-8 text-base"
                                    >
                                        {status === "sending" ? "Sending…" : "Send Message"}
                                        {status !== "sending" && (
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
}


