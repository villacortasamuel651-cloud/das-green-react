import { site } from "../../../config/site";
import "./Quote.css";

export default function Quote() {
  return (
    <section className="quote-section">
      <div className="container quote-content">
        <span className="quote-symbol">“</span>
        <blockquote>{site.quote}</blockquote>
        — {site.name}
      </div>
    </section>
  );
}