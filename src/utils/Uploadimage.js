async function prepareImage(
  file,
  {
    maxWidth = 800,
    aspect,
    quality = 0.82,
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
      "image/webp",
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
    quality = 0.82,
  } = {}
) {
  // folder se mantiene para no romper los editores existentes.
  void folder;

  if (!file) {
    throw new Error("No se seleccionó ninguna imagen.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  const blob = await prepareImage(file, { maxWidth, aspect, quality });
  const body = new FormData();
  body.append("kind", "image");
  body.append("file", blob, `${file.name.replace(/\.[^.]+$/, "")}.webp`);
  const response = await fetch("/api/media", { method: "POST", credentials: "include", body });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "No se pudo guardar la imagen.");
  return result.url;
}

export async function uploadVideo(file) {
  if (!file || !["video/mp4", "video/webm"].includes(file.type)) {
    throw new Error("Selecciona un video MP4 o WebM.");
  }
  const body = new FormData();
  body.append("kind", "video");
  body.append("file", file, file.name);
  const response = await fetch("/api/media", { method: "POST", credentials: "include", body });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "No se pudo guardar el video.");
  return result;
}
