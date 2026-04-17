"use client";

import Link from 'next/link';


export function Footer() {

    return (
        <footer className="p-6 border-t">
            <div className="flex flex-col items-center gap-6">
                {/* <div className="rounded-2xl border bg-card p-6 flex flex-col items-center gap-5 w-full max-w-sm shadow-sm"> */}
                    <div className="text-center space-y-1">
                        <h2 className="text-base sm:text-lg font-medium tracking-tight">
                            Made with 🌙 by{" "}
                            <Link href="https://sirayuth.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                Sirayuth
                            </Link>{},{" "}
                            <Link href="https://phattaradit.dev/" target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">
                                NongDrraeam
                            </Link>
                        </h2>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Copyright © 2022–2026{" "}
                            <Link href="https://pranakorn.in.th" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium underline">
                                Pranakorn
                            </Link>
                            . All rights reserved.
                        </p>
                    {/* </div> */}

                   
                </div>
            </div>
        </footer>
    );
}
