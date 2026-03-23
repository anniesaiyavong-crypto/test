export function formatLaoCurrency(amount: number): string {
  // Format to standard thousand separators and append ₭
  return new Intl.NumberFormat("lo-LA", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " ₭";
}
