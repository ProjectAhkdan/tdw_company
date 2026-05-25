"use client"

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

interface MenuItemData {
  link: string
  text: string
  image: string
  marqueeText?: string
}

interface FlowingMenuProps {
  items?: MenuItemData[]
  speed?: number
  textColor?: string
  bgColor?: string
  marqueeBgColor?: string
  marqueeTextColor?: string
  borderColor?: string
}

interface MenuItemProps extends MenuItemData {
  speed: number
  textColor: string
  marqueeBgColor: string
  marqueeTextColor: string
  borderColor: string
  isFirst: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
  link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, isFirst, marqueeText
}) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(4)

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2)
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2)
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calc = () => {
      if (!marqueeInnerRef.current) return
      const part = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement
      if (!part) return
      const needed = Math.ceil(window.innerWidth / (part.offsetWidth || 1)) + 2
      setRepetitions(Math.max(4, needed))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [text])

  useEffect(() => {
    const setup = () => {
      if (!marqueeInnerRef.current) return
      const part = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement
      if (!part || part.offsetWidth === 0) return
      animationRef.current?.kill()
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -part.offsetWidth, duration: speed, ease: 'none', repeat: -1
      })
    }
    const t = setTimeout(setup, 50)
    return () => { clearTimeout(t); animationRef.current?.kill() }
  }, [text, repetitions, speed])

  const defaults = { duration: 0.6, ease: 'expo' }

  const onEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const r = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height)
    gsap.timeline({ defaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const onLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const r = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height)
    gsap.timeline({ defaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div ref={itemRef} className="flex-1 relative overflow-hidden text-center"
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}` }}>
      <a href={link} onMouseEnter={onEnter} onMouseLeave={onLeave}
        className="flex items-center justify-center h-full relative cursor-pointer no-underline font-medium text-[2.2vh] tracking-[0.08em]"
        style={{ color: textColor, fontFamily: 'var(--font-custom-sans), system-ui, sans-serif', letterSpacing: '0.06em' }}>
        {text}
      </a>
      <div ref={marqueeRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        style={{ backgroundColor: marqueeBgColor }}>
        <div ref={marqueeInnerRef} className="h-full w-fit flex">
          {[...Array(repetitions)].map((_, i) => (
            <div key={i} className="marquee-part flex items-center flex-shrink-0" style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap font-medium text-[2.2vh] leading-[1] px-[1vw] tracking-[0.06em]">
                {marqueeText || text}
              </span>
              <div className="w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] rounded-[50px] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#D9F25D',
  marqueeTextColor = '#0A0A0A',
  borderColor = 'rgba(217,242,93,0.25)',
}) => (
  <div className="w-full h-full overflow-hidden" style={{ backgroundColor: bgColor }}>
    <nav className="flex flex-col h-full m-0 p-0">
      {items.map((item, idx) => (
        <MenuItem key={idx} {...item} speed={speed} textColor={textColor}
          marqueeBgColor={marqueeBgColor} marqueeTextColor={marqueeTextColor}
          borderColor={borderColor} isFirst={idx === 0} />
      ))}
    </nav>
  </div>
)

export default FlowingMenu
