import Userfront from "@userfront/core";
import { Settings } from "@/entities/settings";
import { Archive } from "@/entities/archive";
import { AccessArchiveResponse } from "@/entities/access-archive.response";

export class SettingsService {
  settings?: Settings;

  private get settingsCopy(): Settings {
    return JSON.parse(JSON.stringify(this.settings));
  }

  private getStandardRequestInit(): RequestInit {
    return {
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Userfront.tokens?.accessToken,
      },
    };
  }

  private async handleError(
    response: Response,
    defaultErrorMsg = "An error occurred."
  ) {
    if (!response.ok) {
      const error = await response.json();
      throw Error("⚠ " + (error.error || defaultErrorMsg));
    }
  }

  async fetchSettings(): Promise<Settings> {
    if (this.settings) {
      return this.settingsCopy;
    }
    const response = await fetch(`/api/settings`, {
      ...this.getStandardRequestInit(),
      method: "GET",
    });
    await this.handleError(response, "Error fetching data.");
    this.settings = await response.json();
    return this.settingsCopy;
  }

  async updateServiceSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await fetch(`/api/settings`, {
      ...this.getStandardRequestInit(),
      method: "PUT",
      body: JSON.stringify({ settings, idToken: Userfront.tokens.idToken }),
    });
    await this.handleError(response, "Error updating service settings.");
    this.settings = await response.json();
    return this.settingsCopy;
  }

  async updateArchive(archive: Partial<Archive>): Promise<Settings> {
    const response = await fetch(`/api/archives`, {
      ...this.getStandardRequestInit(),
      method: "PUT",
      body: JSON.stringify({ archive }),
    });
    await this.handleError(response, "Error updating archive.");
    this.settings = await response.json();
    return this.settingsCopy;
  }

  async deleteArchive(msgId: string): Promise<Settings> {
    const response = await fetch(`/api/archives/${msgId}`, {
      ...this.getStandardRequestInit(),
      method: "DELETE",
    });
    await this.handleError(response, "Error deleting archive.");
    this.settings = await response.json();
    return this.settingsCopy;
  }

  async triggerHealthCheck(code: string): Promise<AccessArchiveResponse> {
    const response = await fetch(`/api/settings/health-check-trigger/${code}`, {
      ...this.getStandardRequestInit(),
      method: "PUT",
    });
    await this.handleError(response, "Error triggering health check.");
    const accessArchiveResponse: AccessArchiveResponse = await response.json();
    if (this.settings && this.settings.email === accessArchiveResponse.email) {
      this.settings.dueDate = accessArchiveResponse.dueDate as number;
      this.settings.triggerOnce = accessArchiveResponse.triggerOnce as boolean;
    }
    return accessArchiveResponse;
  }

  async uploadFile(
    file: Blob,
    iv: string,
    archiveName: string
  ): Promise<{ settings: Settings; archiveId: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("idToken", Userfront.tokens.idToken);
    formData.append("archiveName", archiveName);
    formData.append("iv", iv);
    const response = await fetch(`/api/archives`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: "Bearer " + Userfront.tokens?.accessToken,
      },
      body: formData,
    });
    await this.handleError(response, "Error uploading file.");
    const { entry, archiveId } = await response.json();
    this.settings = entry;
    return { settings: this.settingsCopy, archiveId };
  }
}
