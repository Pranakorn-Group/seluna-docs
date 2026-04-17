"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/ui/magicui/gradient-text";
import { Spotlight } from "@/components/ui/spotlight";
import { Rocket, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
export default function Home() {
    const { resolvedTheme } = useTheme();
    const [heroHeight, setHeroHeight] = useState(800);

    useEffect(() => {
        const update = () => {
            setHeroHeight(window.innerHeight);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // ใช้ global scrollY แทน target ref → ทำงานถูกต้องกับ fixed element ใน Chrome/Edge
    const { scrollY } = useScroll();
    const backgroundOpacity = useTransform(scrollY, [0, heroHeight * 0.5, heroHeight], [0.08, 0.02, 0]);
    const backgroundScale = useTransform(scrollY, [0, heroHeight], [1, 1.08]);

    return (
        <main className="flex flex-col">
            <div className="relative isolate min-h-screen flex items-center justify-center px-6 overflow-hidden gap-10">
                <div className="absolute inset-0 -z-10 w-full h-full">
                    {/* <StarryBackground /> */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0"
                        style={{ opacity: backgroundOpacity }}
                    >
                        <motion.img
                            src="/banner/pranakorn-doodle.png"
                            alt="background"
                            className="h-full w-full object-cover grayscale"
                            style={{
                                scale: backgroundScale,
                            }}
                            loading="eager"
                            fetchPriority="high"
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 via-[18%] to-transparent dark:from-[#030303] dark:via-[#030303]/82 dark:via-[20%] dark:to-transparent" /> */}
                    </motion.div>
                </div>

                <Spotlight
                    className="-top-20 -left-12 lg:left-80 lg:-top-30"
                    fill={resolvedTheme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(99,102,241,0.4)"}
                />

                <div className="text-center max-w-2xl z-2">
                    <AnimatedGradientText className="flex items-center gap-2 px-3">
                        <Badge variant="secondary" className="rounded-full">
                            Announcement
                        </Badge>
                        Released v1.1
                    </AnimatedGradientText>
                    <h1 className="mt-6 text-4xl sm:text-5xl md:text-5xl font-bold leading-[1.1]">
                        คู่มือการใช้งาน{" "}
                        <span className="animate-text-gradient bg-gradient-to-r from-indigo-400 via-blue-500 to-blue-600 bg-clip-text text-transparent text-[50px] ">
                            Seluna Cloud
                        </span>
                    </h1>
                    <p className="mt-6 text-[17px] md:text-md bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent flex flex-col items-center">
                        <span className="w-full md:max-w-[500px]">
                            {" "}
                            ศูนย์รวมคู่มือการใช้งาน Seluna Cloud ที่ออกแบบมาอย่างครบถ้วน ครอบคลุมทั้งฝั่งผู้ดูแลระบบ
                            ผู้ใช้งาน และการจัดการหลังบ้านอย่างเป็นระบบ
                        </span>
                        {/* <span className="w-full md:max-w-[500px]">A modern Discord framework engineered for scalability, without sacrificing developer experience.</span> */}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-5">
                        <Link href="/guide" target="_blank">
                            <Button className="font-medium cursor-pointer text-base gap-3">
                                เริ่มต้นใช้งาน
                                <Rocket className="size-5" />
                            </Button>
                        </Link>
                        <Link
                            href="/guide/%E0%B9%81%E0%B8%AD%E0%B8%94%E0%B8%A1%E0%B8%B4%E0%B8%99/settings"
                            target="_blank"
                        >
                            <Button variant="outline" className="font-medium cursor-pointer text-base gap-3">
                                การตั้งค่าร้านค้า
                                <Users className="size-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* <div className="mx-auto max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mt-8 relative space-y-16">
                <HomeSections />
            </div> */}
        </main>
    );
}
