"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, Menu, Search, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useAiChat } from "@/components/ui/ai-chat-provider";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 50;


function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[52px] h-[28px]" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDark ? "bg-muted" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm ring-0 transition-transform duration-200",
          isDark ? "translate-x-[24px]" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const { setOpenSearch } = useSearchContext();
  const { setOpen: setAiOpen } = useAiChat();
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
        "p-3 z-40 transition-all duration-1000 ease-out relative",
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
            <div className="flex items-center gap-2">
              <Image src={"/android-chrome-512x512.png"} alt="Logo" width={24} height={24} />
              <h1 className="text-2xl font-bold">Seluna</h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="md:hidden"
          >
            <Search className="w-5! h-5!" />
          </Button>
          <button
            onClick={() => setOpenSearch(true)}
            className="hidden md:inline-flex items-center gap-2 h-9 w-64 rounded-lg border bg-background/50 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">ค้นหา...</span>
            <div className="flex items-center gap-0.5">
              <kbd className="h-5 px-1.5 rounded border bg-background font-mono text-[10px] flex items-center">Ctrl</kbd>
              <kbd className="h-5 px-1.5 rounded border bg-background font-mono text-[10px] flex items-center">K</kbd>
            </div>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAiOpen(true)}
            aria-label="Seluna AI"
            className="text-muted-foreground hover:text-indigo-400 transition-colors"
          >
            <Sparkles className="!w-4.5 !h-4.5" />
          </Button>
          <div className="hidden md:inline-flex ">
          <ThemeToggle  />
          </div>

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
            <SheetContent side="right" className="w-64">
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
              <div className="px-4 pt-4 space-y-4">
                <NavMenu data-orientation="vertical" orientation="vertical" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Appearance</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
