export interface Archive {
  id: string;
  ipfsHash: string;
  iv: string;
  archiveName?: string;
  creationDate: number;
  size: number;
  accessCode: string;
}
