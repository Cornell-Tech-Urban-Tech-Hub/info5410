/*
 * Reader — foliate-js e-text reader for OCR-ed reading texts.
 * It reads the JSON island #reading-data, builds a single-section book
 * from the text, and opens it in a foliate-view element.
 * foliate-js is vendored in public/foliate-js. See wiki/readings.md.
 */

const escapeXML = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const textToXhtml = (title, text) => {
  const paragraphs = text
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeXML(p).replace(/\n/g, '<br/>')}</p>`)
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<title>${escapeXML(title)}</title>
<style>
html { background: transparent; }
body {
  margin: 0;
  font-family: 'parabolica-text', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
  color: #282728;
}
p { margin: 0 0 1em; }
</style>
</head>
<body>
${paragraphs}
</body>
</html>`;
};

const makeTextBook = (title, text) => {
  const xhtml = textToXhtml(title, text);
  const url = URL.createObjectURL(
    new Blob([xhtml], { type: 'application/xhtml+xml' })
  );
  return {
    metadata: { title, language: 'en' },
    dir: 'ltr',
    sections: [
      {
        id: 'text',
        load: () => url,
        createDocument: () =>
          new DOMParser().parseFromString(xhtml, 'application/xhtml+xml'),
        size: text.length,
        linear: 'yes',
      },
    ],
    toc: [],
    // The two hooks make foliate-js build its SectionProgress, which in
    // turn puts a whole-book fraction on the relocate event.
    splitTOCHref: () => ['text', null],
    getTOCFragment: (doc) => doc.body,
  };
};

const main = async () => {
  const dataElement = document.getElementById('reading-data');
  const root = document.getElementById('reader-root');
  if (!dataElement || !root) return;

  const { title, text } = JSON.parse(dataElement.textContent);

  await import(root.dataset.foliateUrl);

  const view = document.createElement('foliate-view');
  root.append(view);

  const progress = document.getElementById('reader-progress');
  view.addEventListener('relocate', (e) => {
    if (!progress) return;
    const fraction = e.detail?.fraction;
    if (typeof fraction !== 'number') return;
    progress.textContent = `${Math.round(fraction * 100)}%`;
  });

  await view.open(makeTextBook(title, text));
  await view.init({ showTextStart: true });

  const renderer = view.renderer;
  renderer.setAttribute('max-inline-size', '720');
  renderer.setAttribute('gap', '5');

  document
    .getElementById('reader-prev')
    ?.addEventListener('click', () => view.prev());
  document
    .getElementById('reader-next')
    ?.addEventListener('click', () => view.next());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') view.next();
    if (e.key === 'ArrowLeft') view.prev();
  });
};

main();
