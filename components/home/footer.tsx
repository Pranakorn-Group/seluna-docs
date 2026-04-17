"use client";

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="relative border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12 md:py-16 mt-20 overflow-hidden">
            {/* Background glowing effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
                <div className="absolute -top-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-500/10 via-indigo-500/10 to-blue-500/10 blur-[100px] opacity-70 dark:opacity-30 rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto">
                    
                    {/* Brand / Logo */}
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src="/android-chrome-192x192.png" 
                            alt="Seluna Logo" 
                            className="h-14 w-14 object-contain rounded-2xl"
                        />
                        <h3 className="text-xl font-bold text-foreground">
                            Seluna
                        </h3>
                    </div>

                    {/* Credits */}
                    <div className="space-y-4">
                        <p className="text-sm sm:text-base text-muted-foreground font-medium flex items-center justify-center gap-1.5 flex-wrap">
                            Crafted with passion by
                            <Link 
                                href="https://sirayuth.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-600 transition-colors"
                            >
                                Sirayuth
                            </Link>
                            <span className="text-muted-foreground/50">&amp;</span>
                            <Link 
                                href="https://phattaradit.dev/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-pink-500 dark:text-pink-400 font-semibold hover:text-pink-600 transition-colors"
                            >
                                Nongdrream
                            </Link>
                        </p>
                        
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />

                        <p className="text-muted-foreground text-xs sm:text-sm flex flex-col sm:flex-row items-center gap-1">
                            <span>Copyright © {new Date().getFullYear()}</span>
                            <span className="hidden sm:inline-block text-muted-foreground/30">•</span>
                            <span>
                                <Link 
                                    href="https://pranakorn.in.th" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-foreground font-semibold hover:underline decoration-border underline-offset-4 transition-all hover:text-pink-500"
                                >
                                    Pranakorn
                                </Link>
                                {" "}All rights reserved.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
