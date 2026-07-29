import "./Logo.css";

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

export default function Logo({ size = "lg", className = "" }: Props) {
  return (
    <h1
      className={`kalma-logo kalma-logo--${size} ${className}`}
      aria-label="Dice of Kalma"
    >
      <span className="logo-word">Dice</span>
      <span className="logo-word">of</span>
      <span className="logo-word">Kalma</span>
    </h1>
  );
}
