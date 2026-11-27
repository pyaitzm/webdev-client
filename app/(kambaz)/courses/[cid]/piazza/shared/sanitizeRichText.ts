/** Browser-only HTML sanitization for posts and answers. */
/**
 * Sanitize editor HTML and convert Quill 2 list markup into semantic lists.
 * Only allow a small set of presentation tags and safe link protocols.
 */
export function sanitizePostDetails(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h1",
    "h2",
    "li",
    "a",
    "blockquote",
    "span",
  ]);
  const discardedTags = new Set([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "svg",
    "math",
    "form",
    "input",
    "button",
    "template",
    "noscript",
  ]);

  function clean(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    if (discardedTags.has(tag)) return null;

    if (tag === "ol" || tag === "ul") {
      return cleanList(element, tag);
    }

    // Quill's list UI span is decorative; semantic lists provide the markers.
    if (tag === "span" && element.classList.contains("ql-ui")) return null;

    const result = document.createElement(allowedTags.has(tag) ? tag : "span");
    if (tag === "a") {
      const href = (element.getAttribute("href") ?? "").trim();
      if (/^(https?:\/\/|mailto:)/i.test(href)) {
        result.setAttribute("href", href);
        result.setAttribute("rel", "noopener noreferrer");
        result.setAttribute("target", "_blank");
        result.setAttribute("style", "color:#1d4ed8;text-decoration:underline");
      }
    }
    if (tag === "h1")
      result.setAttribute("style", "font-size:1.5rem;font-weight:700");
    if (tag === "h2")
      result.setAttribute("style", "font-size:1.25rem;font-weight:700");
    if (tag === "blockquote") {
      result.setAttribute(
        "style",
        "border-left:3px solid #d1d5db;padding-left:1rem",
      );
    }

    for (const child of Array.from(element.childNodes)) {
      const cleaned = clean(child);
      if (cleaned) result.appendChild(cleaned);
    }
    return result;
  }

  function makeList(kind: "ol" | "ul"): HTMLOListElement | HTMLUListElement {
    const list = document.createElement(kind);
    list.setAttribute(
      "style",
      `list-style-type:${kind === "ul" ? "disc" : "decimal"};padding-left:1.5rem`,
    );
    return list;
  }

  function cleanList(
    element: Element,
    outerKind: "ol" | "ul",
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    // The stack tracks actual nesting, rather than visual margins on flat items.
    const stack: Array<{
      kind: "ol" | "ul";
      list: HTMLOListElement | HTMLUListElement;
      lastItem: HTMLLIElement | null;
    }> = [];

    for (const item of Array.from(element.children)) {
      if (item.tagName.toLowerCase() !== "li") continue;
      const dataList = item.getAttribute("data-list");
      const kind: "ol" | "ul" =
        dataList === "bullet"
          ? "ul"
          : dataList === "ordered"
            ? "ol"
            : outerKind;
      const indentMatch = Array.from(item.classList)
        .map((name) => /^ql-indent-([1-8])$/.exec(name))
        .find((match) => match !== null);
      const requestedDepth = indentMatch ? Number(indentMatch[1]) : 0;
      // A nested level needs a parent item. Clamp malformed input safely.
      const depth = Math.min(requestedDepth, stack.length);

      while (stack.length > depth + 1) stack.pop();
      if (stack.length === depth + 1 && stack[depth].kind !== kind) stack.pop();

      if (stack.length <= depth) {
        const list = makeList(kind);
        if (depth === 0) {
          fragment.appendChild(list);
        } else {
          stack[depth - 1].lastItem?.appendChild(list);
        }
        stack.push({ kind, list, lastItem: null });
      }

      const cleanedItem = document.createElement("li");
      for (const child of Array.from(item.childNodes)) {
        const cleaned = clean(child);
        if (cleaned) cleanedItem.appendChild(cleaned);
      }
      stack[depth].list.appendChild(cleanedItem);
      stack[depth].lastItem = cleanedItem;
    }
    return fragment;
  }

  const container = document.createElement("div");
  for (const node of Array.from(document.body.childNodes)) {
    const cleaned = clean(node);
    if (cleaned) container.appendChild(cleaned);
  }
  return container.innerHTML;
}
