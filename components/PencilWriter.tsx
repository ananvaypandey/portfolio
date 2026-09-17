"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const roles = [
  "AI × Software × Hardware",
  "Technology Builder",
  "AI × Robotics × MedTech",
  "Product Builder",
];

function PencilIcon() {
  return (
    <svg viewBox="0 0 30 12" width="100%" height="100%" aria-hidden>
      <rect x="0" y="1.2" width="4.4" height="9.6" rx="2" fill="#e11d48" />
      <rect x="4.4" y="0.2" width="2.8" height="11.6" fill="#d4d4d8" />
      <line x1="5.2" y1="0.2" x2="5.2" y2="11.8" stroke="#a1a1aa" strokeWidth="0.5" />
      <rect
        x="7.2"
        y="0.4"
        width="15.2"
        height="11.2"
        rx="2"
        fill="#f5c518"
        stroke="#b8900f"
        strokeWidth="0.7"
      />
      <line x1="9.4" y1="0.6" x2="9.4" y2="11.4" stroke="#b8900f" strokeWidth="0.5" opacity="0.5" />
      <rect x="10.4" y="0.6" width="2.6" height="10.8" fill="#fde047" opacity="0.6" />
      <path d="M22.4 2 30 6 22.4 10Z" fill="#211f1a" />
      <path d="M26.4 3.4 29 5.1 26.2 7Z" fill="#f6f1e3" opacity="0.85" />
    </svg>
  );
}

export default function PencilWriter() {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = roles[index % roles.length];
  const typed = current.slice(0, count);
  const writing = !deleting && count < current.length;

  useEffect(() => {
    let delay = deleting ? 28 : 90;
    if (!deleting && count === current.length) delay = 1600;

    const t = setTimeout(() => {
      if (!deleting && count === current.length) {
        setDeleting(true);
      } else if (deleting && count === 0) {
        setDeleting(false);
        setIndex((v) => v + 1);
      } else {
        setCount((c) => c + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(t);
  }, [count, deleting, current.length, index]);

  return (
    <span className="relative inline-block align-baseline">
      <span className="invisible whitespace-nowrap">{current}</span>
      <span className="absolute left-0 top-0 flex whitespace-nowrap text-accent">
        {typed.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 7, scale: 0.4, rotate: -8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-full left-full z-20 h-3 w-7 -translate-x-1/2 -rotate-[35deg]"
          animate={writing ? { y: [0, -2.5, 0] } : { y: 0 }}
          transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
        >
          <PencilIcon />
        </motion.span>
        <span className="inline-block w-[3px] animate-blink text-accent">|</span>
      </span>
    </span>
  );
}