"use client";

import React, { useState } from 'react';

interface MenuItemData {
  link: string;
  text: string;
  image: string;
  marqueeText?: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  bgColor = '#120F17',
  borderColor = 'rgba(217,242,93,0.25)',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full space-y-3" style={{ backgroundColor: 'transparent' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
            className="rounded-2xl border overflow-hidden transition-all"
            style={{ borderColor, backgroundColor: bgColor }}
          >
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <span>{item.text}</span>
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-300"
                style={{
                  borderColor,
                  color: '#D9F25D',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? '400px' : '0px' }}
            >
              <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.01 60)' }}>
                {item.marqueeText || item.text}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FlowingMenu;


