"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  id: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

export function Select({ id, value, options, placeholder, onChange, invalid, describedBy }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = () => {
    setCursor(Math.max(options.indexOf(value), 0));
    setOpen((v) => !v);
  };

  const pick = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return toggle();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setCursor((c) => (c + step + options.length) % options.length);
    }
    if ((e.key === "Enter" || e.key === " ") && open && cursor >= 0) {
      e.preventDefault();
      pick(options[cursor]);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-stone-50 px-4 py-3 text-left text-sm outline-none transition",
          "focus-visible:border-primary-green focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(37,211,102,0.12)]",
          invalid ? "border-red-400" : open ? "border-primary-green bg-white" : "border-stone-200 hover:border-stone-300",
          value ? "text-charcoal" : "text-stone-400"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-stone-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(17,24,39,0.18)]"
          >
            {options.map((opt, i) => {
              const selected = opt === value;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => pick(opt)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                    cursor === i ? "bg-stone-100" : "",
                    selected ? "font-semibold text-deep-green" : "text-stone-700"
                  )}
                >
                  <span>{opt}</span>
                  {selected && <Check className="h-4 w-4" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
