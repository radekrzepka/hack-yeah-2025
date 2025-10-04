interface FormErrorProps {
  error?: string;
  className?: string;
  showError?: boolean;
}

export function FormError({
  error,
  className = "",
  showError = true,
}: FormErrorProps) {
  if (!error || !showError) return null;

  return <p className={`text-sm text-red-500 ${className}`}>{error}</p>;
}
