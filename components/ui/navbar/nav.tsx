"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SCROLL_THRESHOLD = 50;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="!w-5 !h-5" />
      ) : (
        <Moon className="!w-5 !h-5" />
      )}
    </Button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    checkScroll();
    setIsLoaded(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  if (!isLoaded) return null;

  return (
    <nav
      className={cn(
        "p-3 z-50 transition-all duration-1000 ease-out relative",
        "left-1/2 -translate-x-1/2",
        isHomePage ? "fixed" : "relative",
        isHomePage && isScrolled
          ? "w-[min(80rem,95vw)] top-3"
          : "w-full rounded-none top-0"
      )}
      style={{
        width: isHomePage && isScrolled ? "min(80rem,95vw)" : "100%",
      }}
      aria-label="Navigation bar"
    >
      <div
        className={cn(
          "backdrop-blur-xs bg-background/70 w-full h-full absolute top-0 left-0 -z-10",
          isHomePage && isScrolled ? "rounded-lg border" : "rounded-none border-b"
        )}
      />
      <div className="h-full flex items-center justify-between mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center">
              <Image src={"/android-chrome-512x512.png"} alt="Logo" width={32} height={32} />
              <h1 className="text-2xl font-bold">Seluna</h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="!w-5 !h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" onClick={() => setSheetOpen(false)}>
                    <div className="flex items-center gap-2">
                      <Image src={"/android-chrome-512x512.png"} alt="Logo" width={24} height={24} />
                      <span className="font-bold">Seluna</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="px-4 pt-4">
                <NavMenu data-orientation="vertical" orientation="vertical" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
