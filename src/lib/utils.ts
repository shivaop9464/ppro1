import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatPriceSimple(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export const ageGroups = [
  { id: '0-2', label: '0-2 Years', description: 'Infants & Toddlers' },
  { id: '2-4', label: '2-4 Years', description: 'Preschoolers' },
  { id: '4-6', label: '4-6 Years', description: 'Early Elementary' },
  { id: '6+', label: '6+ Years', description: 'School Age' }
];

export const categories = [
  'Educational',
  'Creative',
  'STEM',
  'Role Play',
  'Musical',
  'Vehicles',
  'Games',
  'Construction',
  'Comfort'
];