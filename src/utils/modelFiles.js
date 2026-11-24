const MAX_BYTES = 80 * 1024 * 1024;
const ACCEPTED = ["glb", "gltf"];

export function fileExtension(name = "") {
  return name.split(".").pop()?.toLowerCase() || "";
}

export function fileNameFromPath(file = "") {
  const path = file.split("?")[0].split("#")[0];
  try {
    return decodeURIComponent(path.split("/").pop() || "model.glb");
  } catch {
    return path.split("/").pop() || "model.glb";
  }
}

export function resolveModelUrl(file) {
  if (!file) return file;
  if (/^(blob:|data:|https?:)/i.test(file)) return file;
  const clean = file.replace(/^(\.\.\/)+public\//, "").replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}

export function validateModelFile(file) {
  const extension = fileExtension(file.name);
  if (!ACCEPTED.includes(extension)) {
    return "Only .glb and .gltf files can be viewed.";
  }
  if (file.size > MAX_BYTES) {
    return "That file is larger than 80 MB.";
  }
  return "";
}

export function prepareModel(model) {
  const fileName = model.fileName || fileNameFromPath(model.file);
  const extension = fileExtension(fileName).toUpperCase();
  return {
    ...model,
    file: resolveModelUrl(model.file),
    fileName,
    formats: model.formats?.length ? model.formats : extension ? [extension] : ["GLB"],
    category: model.category || model.type,
  };
}

export function downloadModel(model) {
  const name = model.fileName || fileNameFromPath(model.file);
  const temporaryUrl = model.sourceFile ? URL.createObjectURL(model.sourceFile) : "";
  const link = document.createElement("a");
  link.href = temporaryUrl || resolveModelUrl(model.file);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
}
