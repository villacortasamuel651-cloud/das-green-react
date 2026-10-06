function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("No se pudo convertir la imagen."));

    reader.readAsDataURL(blob);
  });
}

async function prepareImage(
  file,
  {
    maxWidth = 800,
    aspect,
    quality = 0.68,
  } = {}
) {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;

  // Recorte opcional para mantener una proporción determinada
  if (aspect) {
    const currentAspect = sw / sh;

    if (currentAspect > aspect) {
      // Imagen demasiado ancha
      sw = Math.round(sh * aspect);
      sx = Math.round((bitmap.width - sw) / 2);
    } else if (currentAspect < aspect) {
      // Imagen demasiado alta
      sh = Math.round(sw / aspect);
      sy = Math.round((bitmap.height - sh) / 2);
    }
  }

  const width = Math.min(maxWidth, sw);
  const height = Math.round(width * (sh / sw));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close?.();
    throw new Error("No se pudo preparar la imagen.");
  }

  context.drawImage(
    bitmap,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    width,
    height
  );

  bitmap.close?.();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export async function uploadImage(
  file,
  {
    folder = "general",
    maxWidth = 800,
    aspect,
    quality = 0.68,
  } = {}
) {
  // folder se mantiene para no romper los editores existentes.
  // Ya no se utiliza porque no estamos usando Firebase Storage.
  void folder;

  if (!file) {
    throw new Error("No se seleccionó ninguna imagen.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  const blob = await prepareImage(file, {
    maxWidth,
    aspect,
    quality,
  });

  // Límite preventivo para evitar imágenes demasiado grandes.
  // 250 KB por imagen como primera protección.
  const MAX_BYTES = 250 * 1024;

  if (blob.size > MAX_BYTES) {
    throw new Error(
      "La imagen sigue siendo demasiado pesada. Selecciona otra imagen o una de menor resolución."
    );
  }

  return blobToDataUrl(blob);
}
