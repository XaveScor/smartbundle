import { join } from "node:path";

// It needs for VSCode. It cannot resolve the import/export if it has no extension

const importExportRegex =
  /(?:import|export)\s*(?:type\s*)?(?:(?:{\s*.+?\s*}|\*|[^{}\s]+)\s*from\s*)?["'](.+)["']/g;
const dynamicImportRegex = /import\(["'](.+)["']\)/g;

export type FileExists = (path: string) => boolean;

function addExtension(
  content: string,
  regex: RegExp,
  ext: string,
  fileExists: FileExists,
) {
  return content.replace(regex, (match, p1) => {
    if (!p1.startsWith(".")) {
      return match;
    }

    if (!p1.endsWith(".cjs") && !p1.endsWith(".mjs") && !p1.endsWith(".js")) {
      const file = `${p1}${ext}`;
      if (fileExists(file)) return match.replace(p1, file);
      const indexFile = "./" + join(p1, `index${ext}`);
      if (fileExists(indexFile)) return match.replace(p1, indexFile);

      return match;
    }
    return match;
  });
}

export function inlineExtensionsMjs(content: string, fileExists: FileExists) {
  content = addExtension(content, importExportRegex, ".mjs", fileExists);
  content = addExtension(content, dynamicImportRegex, ".mjs", fileExists);
  return content;
}

export function inlineExtensionsCjs(content: string, fileExists: FileExists) {
  content = addExtension(content, importExportRegex, ".js", fileExists);
  content = addExtension(content, dynamicImportRegex, ".js", fileExists);
  return content;
}
