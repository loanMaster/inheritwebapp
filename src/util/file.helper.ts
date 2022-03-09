import JSZip from "jszip";

export const calculateTotalSize = (fileLists: { size: number }[][]): number => {
  return fileLists
    .map((fileList) => {
      return fileList.map((a) => a.size).reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
};

export const zip = async (
  files: { name: string; arrayBuffer: () => Promise<ArrayBuffer> }[]
): Promise<Blob> => {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, await file.arrayBuffer());
  }
  return zip.generateAsync({ type: "blob" });
};
