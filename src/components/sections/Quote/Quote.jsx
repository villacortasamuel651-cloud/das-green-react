import { quote } from "../../../data/quote";
import useContent from "../../../hooks/useContent";
import "./Quote.css";

export default function Quote() {
  const q = { ...quote, ...(useContent("quote") ?? {}) };

  return (
    <section className="quote-section">
      <div className="container quote-content">
        <span className="quote-symbol">“</span>
        <blockquote>{q.text}</blockquote>
        — {q.author}
      </div>
    </section>
  );
}