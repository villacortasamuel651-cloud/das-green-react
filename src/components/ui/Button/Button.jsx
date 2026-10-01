import "./Button.css";

export default function Button({ href = "#", children, arrow = true, className = "", ...props }) {
  return (
    <a href={href} className={`primary-button ${className}`} {...props}>
      {children}
      {arrow && <span>→</span>}
    </a>
  );
}