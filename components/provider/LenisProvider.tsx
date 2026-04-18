"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EDGE_SNAP_PX = 6;

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      overscroll: false,
      anchors: true,
    });

    const clampEdgeScroll = () => {
      if (
        lenis.scroll <= EDGE_SNAP_PX &&
        lenis.targetScroll <= EDGE_SNAP_PX
      ) {
        lenis.scrollTo(0, { immediate: true, force: true });
        return;
      }

      if (
        lenis.limit > 0 &&
        lenis.limit - lenis.scroll <= EDGE_SNAP_PX &&
        lenis.limit - lenis.targetScroll <= EDGE_SNAP_PX
      ) {
        lenis.scrollTo(lenis.limit, { immediate: true, force: true });
      }
    };

    const handleScroll = () => {
      clampEdgeScroll();
      ScrollTrigger.update();
    };

    const unsubscribeScroll = lenis.on("scroll", handleScroll);

    const syncLockState = () => {
      const isScrollLocked =
        document.body.hasAttribute("data-scroll-locked") ||
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden";

      if (isScrollLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const handleRefreshInit = () => {
      lenis.resize();
    };

    const observer = new MutationObserver(syncLockState);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked", "style", "class"],
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

    syncLockState();

    requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
      handleScroll();
    });

    return () => {
      observer.disconnect();
      ScrollTrigger.removeEventListener("refreshInit", handleRefreshInit);
      unsubscribeScroll();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
