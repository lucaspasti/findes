import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// rodovia vermelho
// ferrovia verde
// hidrovia azul
// porto azul escuro
// aeroporto preto ou cinza