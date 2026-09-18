import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 hover:brightness-110",
  secondary:
    "border border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800",
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95 ${VARIANTS[variant]} ${className}`}
    />
  );
}
