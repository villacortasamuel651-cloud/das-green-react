import { site } from "../../../config/site";
import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo({ href = "#inicio", to, className = "", onClick }) {
  const content = <><span>{site.brand.main}</span><small>{site.brand.sub}</small></>;
  if (to) return <Link to={to} className={`logo ${className}`} onClick={onClick}>{content}</Link>;
  return (
    <a href={href} className={`logo ${className}`} onClick={onClick}>{content}</a>
  );
}
