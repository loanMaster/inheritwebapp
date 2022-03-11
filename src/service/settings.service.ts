import { Settings } from "@/entities/settings";
import { HealthCheckResponse } from "@/entities/health-check.response";
import { CreateArchiveDto } from "@/entities/create.archive.dto";
import { UpdateArchiveDto } from "@/entities/update.archive.dto";
import { mapError } from "@/util/map.error";

export class SettingsService {
  private getStandardRequestInit(): RequestInit {
    return {
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  async fetchSettings(): Promise<Settings> {
    const response = await fetch(`/api/settings`, {
      ...this.getStandardRequestInit(),
      method: "GET",
    });
    await mapError(response, "Error fetching data.");
    return response.json();
  }

  async updateServiceSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await fetch(`/api/settings`, {
      ...this.getStandardRequestInit(),
      method: "PUT",
      body: JSON.stringify(settings),
    });
    await mapError(response, "Error updating service settings.");
    return response.json();
  }

  async deleteArchive(msgId: string): Promise<Settings> {
    const response = await fetch(`/api/archives/${msgId}`, {
      ...this.getStandardRequestInit(),
      method: "DELETE",
    });
    await mapError(response, "Error deleting archive.");
    return response.json();
  }

  async triggerHealthCheck(code: string): Promise<HealthCheckResponse> {
    const response = await fetch(`/api/settings/health-check-trigger/${code}`, {
      ...this.getStandardRequestInit(),
      method: "PUT",
    });
    await mapError(response, "Error triggering health check.");
    return response.json();
  }

  async updateArchive(
    updateArchiveDto: UpdateArchiveDto
  ): Promise<{ settings: Settings; archiveId: string }> {
    const formData = new FormData();
    formData.append("archiveName", updateArchiveDto.archiveName);
    if (updateArchiveDto.blob) {
      formData.append("file", updateArchiveDto.blob);
    }
    if (updateArchiveDto.iv) {
      formData.append("iv", updateArchiveDto.iv);
    }
    formData.append("accessCode", updateArchiveDto.accessCode);
    formData.append("archiveId", updateArchiveDto.id);
    const response = await fetch(`/api/archives`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      body: formData,
    });
    await mapError(response, "Error uploading file.");
    return response.json();
  }

  async createArchive(
    creatArchiveDto: CreateArchiveDto
  ): Promise<{ settings: Settings; archiveId: string }> {
    const formData = new FormData();
    formData.append("archiveName", creatArchiveDto.archiveName);
    formData.append("file", creatArchiveDto.blob);
    if (creatArchiveDto.ipfs) {
      formData.append("ipfs", "true");
    }
    formData.append("iv", creatArchiveDto.iv);
    const response = await fetch(`/api/archives`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: formData,
    });
    await mapError(response, "Error uploading file.");
    return response.json();
  }
}
