interface FormErrorProps {
  error?: string;
  className?: string;
  showError?: boolean;
  id?: string;
}

export function FormError({
  error,
  className = "",
  showError = true,
  id,
}: FormErrorProps) {
  if (!error || !showError) return null;

  return (
    <p
      id={id}
      className={`text-sm text-red-500 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {error}
    </p>
  );
}
