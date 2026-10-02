// Resize + recompress an image in the browser before upload so event photos stay
// sharp but light (max width/height, WebP at high quality). Falls back to the
// original file if the browser can't decode/encode it.
export function resizeImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.86 } = {}) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (!blob || blob.type !== 'image/webp') return resolve(file);
        const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
        resolve(blob.size < file.size || scale < 1 ? new File([blob], name, { type: 'image/webp' }) : file);
      }, 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}
