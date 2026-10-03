import Modal from "../../ui/Modal/Modal";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";

export default function NewsArticleModal({ item, onClose }) {
  return (
    <Modal onClose={onClose} titleId="news-article-title" className="news-article-modal">
      <article className="news-article">
        <div className="news-article-image">
          <ImagePlaceholder src={item.image} alt={item.title} />
        </div>

        <div className="news-article-body">
          <span className="news-article-eyebrow">{item.article.eyebrow}</span>
          <p className="news-article-date">{item.date}</p>
          <h2 id="news-article-title">{item.title}</h2>

          <div className="news-article-copy">
            {item.article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <ul className="news-article-tags" aria-label="Temas de la noticia">
            {item.article.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>

          {item.url && item.url !== "#" && (
            <a className="news-source-link" href={item.url} target="_blank" rel="noreferrer">
              Ver publicación original en LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </article>
    </Modal>
  );
}
