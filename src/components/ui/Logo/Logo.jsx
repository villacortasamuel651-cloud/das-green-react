import { site } from "../../../config/site";
import "./Logo.css";

export default function Logo({ href = "#inicio", className = "" }) {
  return (
    <a href={href} className={`logo ${className}`}>
      <span>{site.brand.main}</span>
      <small>{site.brand.sub}</small>
    </a>
  );
}