const paths = {
  overview: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  hero: "M3 4h18v16H3z M3 9h18 M7 6.5h.01 M10 6.5h.01 M10 12l5 3-5 3z",
  about: "M20 21v-2a7 7 0 0 0-14 0v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  timeline: "M7 3v18 M4 5h6 M4 12h6 M4 19h6 M14 5h6 M14 12h6 M14 19h6",
  experience: "M3 7h18v14H3z M8 7V3h8v4 M3 12h18 M10 12v3h4v-3",
  exhibitions: "M4 3h16v14H4z M8 21l4-4 4 4 M12 3V1 M8 8h8 M8 12h5",
  gallery: "M3 3h18v18H3z M3 16l5-5 5 5 3-3 5 5 M16 7h.01",
  news: "M4 3h16v18H4z M8 7h8 M8 11h8 M8 15h3 M8 18h8",
  courses: "M2 8l10-5 10 5-10 5z M6 10v7c4 3 8 3 12 0v-7 M22 8v8",
  testimonials: "M3 4h18v13H9l-6 4z M7 8h10 M7 12h7",
  quote: "M4 6h6v7H4z M10 13c0 4-2 5-5 5 M14 6h6v7h-6z M20 13c0 4-2 5-5 5",
  booking: "M3 5h18v16H3z M7 3v4 M17 3v4 M3 10h18 M8 14h3 M8 17h7",
  contact: "M3 5h18v14H3z M3 5l9 7 9-7",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  external: "M14 3h7v7 M21 3l-10 10 M10 3H3v18h18v-7",
  logout: "M9 3H3v18h6 M9 12h12 M16 7l5 5-5 5",
  lock: "M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  search: "M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0 M14.5 14.5L21 21",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M6 6l12 12 M18 6L6 18",
};

export default function AdminIcon({ name, className = "" }) {
  return (
    <svg className={`admin-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name] ?? paths.overview} />
    </svg>
  );
}
