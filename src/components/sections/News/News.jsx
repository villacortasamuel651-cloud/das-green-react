import { news, newsSection } from "../../../data/news";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./News.css";
import Reveal from "../../ui/Reveal/Reveal";


export default function News() {
  return (
    <section className="news-section" id="noticias">
      <div className="container">
        <SectionHeader
          dark
          label={newsSection.label}
          title={newsSection.title}
          text={newsSection.text}
        />

        <div className="news-grid">
          {news.map((item, i) => (
            <Reveal as="article" className="news-card" delay={i * 120} key={item.title}>
              <div className="news-image">
                <ImagePlaceholder src={item.image} alt={item.title} />
              </div>

              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.url}>Leer noticia →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}