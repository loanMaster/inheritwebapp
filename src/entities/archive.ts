export interface FileInfo {
  ipfs: boolean;
  size: number;
  id: string;
  location: string;
}

export interface Archive {
  id: string;
  iv: string;
  archiveName?: string;
  creationDate: number;
  accessCode: string;
  lastModified: number;
  file: FileInfo;
}
