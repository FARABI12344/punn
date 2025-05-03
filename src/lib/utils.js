
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Function to validate page names (simple example)
export function isValidPageName(name) {
  // Allow letters, numbers, hyphens, underscores; disallow spaces and starting/ending with hyphen/underscore
  const regex = /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/;
  return regex.test(name);
}
  