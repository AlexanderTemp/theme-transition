"use client";

import type { Variants } from "motion/react";
import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Variants() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const cambio = theme === "light" ? "dark" : "light";
    setTheme(cambio);
  };

  return (
    <div>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        style={nav}
      >
        <motion.div style={background} variants={sidebarVariants} />
        <MenuToggle
          toggle={() => {
            toggleTheme();
            setIsOpen(!isOpen);
          }}
        />
      </motion.nav>
    </div>
  );
}

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 0px 0px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 0px 0px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <Button variant="outline" size="icon" onClick={toggle}>
    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
);
/**
 * ==============   Styles   ================
 */

const nav: React.CSSProperties = {
  width: 300,
};

const background: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  position: "absolute",
  zIndex: -1,
  top: 0,
  left: 0,
  bottom: 0,
  // Esto te dice hasta cuanto máximo va a alcanzar el width
  width: "100%",
};

/**
 * ==============   Utils   ================
 */

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
