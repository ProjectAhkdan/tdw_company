'use client'

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        pill: "relative overflow-hidden rounded-full font-semibold text-[16px] leading-none uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-[18px] h-[42px] bg-[#120F17] text-white border-0",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Pill button with GSAP circle-expand hover animation (ported from PillNav)
function PillButton({
  className,
  children,
  pillColor = "#120F17",
  textColor = "#fff",
  hoverCircleColor = "#fff",
  hoverTextColor = "#120F17",
  ease = "power3.out",
  ...props
}: React.ComponentProps<"button"> & {
  pillColor?: string
  textColor?: string
  hoverCircleColor?: string
  hoverTextColor?: string
  ease?: string
}) {
  const pillRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const pill = pillRef.current
    const circle = circleRef.current
    if (!pill || !circle) return

    const layout = () => {
      const { width: w, height: h } = pill.getBoundingClientRect()
      const R = ((w * w) / 4 + h * h) / (2 * h)
      const D = Math.ceil(2 * R) + 2
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
      const originY = D - delta

      circle.style.width = `${D}px`
      circle.style.height = `${D}px`
      circle.style.bottom = `-${delta}px`

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

      const label = pill.querySelector<HTMLElement>(".pill-label")
      const labelHover = pill.querySelector<HTMLElement>(".pill-label-hover")

      if (label) gsap.set(label, { y: 0 })
      if (labelHover) gsap.set(labelHover, { y: h + 12, opacity: 0 })

      tlRef.current?.kill()
      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease }, 0)
      if (label) tl.to(label, { y: -(h + 8), duration: 0.6, ease }, 0)
      if (labelHover) {
        gsap.set(labelHover, { y: Math.ceil(h + 100), opacity: 0 })
        tl.to(labelHover, { y: 0, opacity: 1, duration: 0.6, ease }, 0)
      }
      tlRef.current = tl
    }

    layout()
    window.addEventListener("resize", layout)
    return () => window.removeEventListener("resize", layout)
  }, [ease])

  const handleEnter = () => {
    const tl = tlRef.current
    if (!tl) return
    tweenRef.current?.kill()
    tweenRef.current = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: "auto" })
  }

  const handleLeave = () => {
    const tl = tlRef.current
    if (!tl) return
    tweenRef.current?.kill()
    tweenRef.current = tl.tweenTo(0, { duration: 0.2, ease, overwrite: "auto" })
  }

  return (
    <button
      ref={pillRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "relative overflow-hidden flex items-center justify-center rounded-full font-semibold text-[16px] leading-none uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-[18px] h-[42px] border-0 outline-none",
        className
      )}
      style={{ background: pillColor, color: textColor }}
      {...props}
    >
      {/* hover circle */}
      <span
        ref={circleRef}
        className="absolute left-1/2 bottom-0 rounded-full z-[1] pointer-events-none"
        style={{ background: hoverCircleColor, willChange: "transform" }}
        aria-hidden="true"
      />
      {/* label stack */}
      <span className="relative inline-block leading-none z-[2]">
        <span className="pill-label relative z-[2] inline-block leading-none" style={{ willChange: "transform" }}>
          {children}
        </span>
        <span
          className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
          style={{ color: hoverTextColor, willChange: "transform, opacity" }}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    </button>
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, PillButton, buttonVariants }


