import { Credential } from "@/types/credential";

class AirKitService {
  private static apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  static async getCredentials(): Promise<Credential[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/credentials`);
      if (!response.ok) {
        throw new Error("Failed to fetch credentials");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching credentials:", error);
      return [];
    }
  }
}

export default AirKitService;