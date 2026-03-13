import { Badge } from "@/components/ui/badge";

interface CurrencyBadgeProps {
  currency: string;
  amount: string;
}

export function CurrencyBadge({ currency, amount }: CurrencyBadgeProps) {
  const formatted = new Intl.NumberFormat(
    currency === "MXN" ? "es-MX" : "en-US",
    { style: "currency", currency }
  ).format(parseFloat(amount));

  return (
    <Badge variant={currency === "USD" ? "default" : "secondary"}>
      {formatted}
    </Badge>
  );
}
