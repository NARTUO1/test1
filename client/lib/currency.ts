export function formatPrice(price: number): string {
  // Format the price in Indian Rupee format (prices are already in INR)
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPriceRange(min: number, max: number): string {
  return `₹${min.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} - ₹${max.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// Convert USD price to INR
export function usdToInr(usdPrice: number): number {
  return Math.round(usdPrice * 83);
}
