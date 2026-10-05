"use client";

import { useMemo, useState } from "react";

// The email's HTML is untrusted. It renders in an iframe that cannot run
// scripts or submit forms (sandbox without allow-scripts / allow-forms), and a
// CSP inside the frame blocks everything it could load except inline styles.
// allow-same-origin only lets this component measure the frame's height.
function frame(html: string, showImages: boolean): string {
  const csp = `default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:${
    showImages ? " https: http:" : ""
  }`;
  return (
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<meta http-equiv="Content-Security-Policy" content="${csp}">` +
    // links open in a new tab instead of navigating the frame, without a referrer
    `<meta name="referrer" content="no-referrer"><base target="_blank">` +
    `<style>html,body{margin:0}body{padding:16px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111;background:#fff;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{max-width:100%}blockquote{margin:0 0 0 .8ex;border-left:1px solid #ccc;padding-left:1ex}</style>` +
    `</head><body>${html}</body></html>`
  );
}

export function MessageBody({ html, text }: { html: string; text: string }) {
  const [showImages, setShowImages] = useState(false);
  const [height, setHeight] = useState(160);
  const srcDoc = useMemo(() => frame(html, showImages), [html, showImages]);

  if (!html) {
    return text ? (
      <div className="text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">{text}</div>
    ) : (
      <p className="text-sm text-muted-foreground">No message body.</p>
    );
  }

  const hasRemoteImages = /(<img[^>]+src\s*=\s*["']?|url\(\s*["']?)https?:/i.test(html);

  return (
    <div>
      {hasRemoteImages && !showImages && (
        <p className="mb-2 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          Images are hidden so the sender cannot tell you opened this.
          <button
            type="button"
            className="font-medium text-foreground underline underline-offset-2"
            onClick={() => setShowImages(true)}
          >
            Show images
          </button>
        </p>
      )}
      <iframe
        title="Email body"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        srcDoc={srcDoc}
        style={{ height }}
        className="w-full rounded-md border bg-white"
        onLoad={(event) => {
          const doc = event.currentTarget.contentDocument;
          if (!doc) return;
          const measure = () => setHeight(doc.documentElement.scrollHeight);
          measure();
          // images and fonts change the height after load
          new ResizeObserver(measure).observe(doc.body);
        }}
      />
    </div>
  );
}
