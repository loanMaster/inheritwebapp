import { FileInfo } from "@/entities/archive";
import { mapError } from "@/util/map.error";

export class FileService {
  async download(file: FileInfo): Promise<ArrayBuffer> {
    const response = await fetch(file.location);
    await mapError(
      response,
      "Error downloading archive. Please verify the hash"
    );
    return await response.arrayBuffer();
  }
}
