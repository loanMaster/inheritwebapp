export interface CreateArchiveDto {
  archiveName: string;
  blob: Blob;
  iv: string;
  ipfs: boolean;
}
