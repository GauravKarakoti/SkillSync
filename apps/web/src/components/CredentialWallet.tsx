"use client";

import { useEffect, useState } from "react";
import AirKitService from "../moca-integration/air-kit-service";
import { Credential } from "@/types/credential";

export default function CredentialWallet() {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const fetchedCredentials = await AirKitService.getCredentials();
        setCredentials(fetchedCredentials);
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    }
    fetchCredentials();
  }, []);

  return (
    <div>
      {/* Render the list of credentials */}
      {credentials.map((cred) => (
        <div key={cred.id}>{/* Display credential details */}</div>
      ))}
    </div>
  );
}