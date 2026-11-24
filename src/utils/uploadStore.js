const DB_NAME = "3d-models-gallery";
const STORE = "uploads";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function modelFromRecord(record) {
  const blob = record.blob;
  const sourceFile =
    blob instanceof File
      ? blob
      : new File([blob], record.fileName, { type: blob.type || "model/gltf-binary" });

  return {
    id: record.id,
    name: record.name,
    description: "Added on this site. Open the card to inspect it in 3D, or download the original file.",
    category: "Upload",
    formats: [record.fileName.split(".").pop()?.toUpperCase() || "GLB"],
    file: URL.createObjectURL(sourceFile),
    fileName: record.fileName,
    sourceFile,
    uploaded: true,
  };
}

export async function loadUploads() {
  const db = await openDb();
  const records = await new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return records
    .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))
    .map(modelFromRecord);
}

export async function saveUpload(file) {
  const id = `upload-${crypto.randomUUID()}`;
  const record = {
    id,
    name: file.name.replace(/\.[^.]+$/, "") || file.name,
    fileName: file.name,
    blob: file,
    addedAt: Date.now(),
  };
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
  return modelFromRecord(record);
}

export async function deleteUpload(id) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}
