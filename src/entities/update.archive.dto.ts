export interface UpdateArchiveDto {
  archiveName: string;
  blob: Blob | undefined;
  iv: string | undefined;
  accessCode: string;
  id: string;
}
