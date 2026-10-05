import useContent from "./useContent";

// Devuelve la lista final que debe pintar una sección tipo lista.
//
//   const items = useListContent("news", newsItems);
//
// - Mientras carga, o si Firebase no tiene datos, devuelve los datos locales.
// - Si hay datos en Firebase, usa esos textos y recupera de los datos locales lo que
//   el cliente no edita (imagen, enlaces...) buscando por id ("local-<posición>").
// - Los elementos nuevos que cree el cliente no tienen imagen: el componente debe
//   mostrar un ImagePlaceholder (o nada) cuando `item.image` sea undefined.
// - Usa `item.id` como key al hacer .map().
export default function useListContent(sectionId, localItems) {
  const content = useContent(sectionId);
  const local = localItems.map((item, i) => ({ ...item, id: `local-${i}` }));

  if (!Array.isArray(content?.items)) return local;

  return content.items.map((remote) => {
    const base = local.find((l) => l.id === remote.id);
    return { ...base, ...remote };
  });
}
