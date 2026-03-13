interface CurrencyBadgeProps {
  currency: string;
  amount: string;
  size?: "sm" | "md" | "lg";
}

export function CurrencyBadge({ currency, amount, size = "md" }: CurrencyBadgeProps) {
  const numAmount = parseFloat(amount);
  const isNegative = numAmount < 0;

  const formatted = new Intl.NumberFormat(
    currency === "MXN" ? "es-MX" : "en-US",
    { style: "currency", currency, minimumFractionDigits: 2 }
  ).format(Math.abs(numAmount));

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const currencyColors = {
    USD: "bg-[#c8a24e]/10 text-[#dbb668] border-[#c8a24e]/20",
    MXN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const colorClass = currencyColors[currency as keyof typeof currencyColors] || "bg-white/5 text-[#a1a1aa] border-white/10";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono-numbers ${sizeClasses[size]} ${colorClass}`}
    >
      {isNegative && <span className="text-red-400">−</span>}
      <span>{formatted}</span>
      <span className="text-[10px] opacity-50 uppercase">{currency}</span>
    </span>
  );
}
