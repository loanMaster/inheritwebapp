export interface Archive {
  id: string;
  recipients: { email: string }[];
  ipfsHash: string;
  iv: string;
  archiveName?: string;
  creationDate: number;
  size: number;
}
