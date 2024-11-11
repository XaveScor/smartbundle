// It needs for VSCode. It cannot resolve the import/export if it has no extension

const importExportRegex = /(?:import|export)\s*(?:type\s*)?(?:(?:{\s*.+?\s*}|\*|[^{}\s]+)\s*from\s*)?["'](.+)["']/g;
const dynamicImportRegex = /import\(["'](.+)["']\)/g;

function addExtension(content: string, regex: RegExp, ext: string) {
  return content.replace(regex, (match, p1) => {
    if (!p1.startsWith(".")) {
      return match;
    }
    if (!p1.endsWith(".cjs") && !p1.endsWith(".mjs") && !p1.endsWith(".js")) {
      return match.replace(p1, `${p1}${ext}`);
    }
    return match;
  });
}

export function inlineExtensionsMjs(content: string) {
  content = addExtension(content, importExportRegex, ".mjs");
  content = addExtension(content, dynamicImportRegex, ".mjs");
  return content;
}

export function inlineExtensionsCjs(content: string) {
  content = addExtension(content, importExportRegex, ".cjs");
  content = addExtension(content, dynamicImportRegex, ".cjs");
  return content;
}
