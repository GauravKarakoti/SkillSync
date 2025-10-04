import { CredentialWizard } from '@/components/CredentialWizard';

export default function IssuerPortal() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillSync Issuer Portal
          </h1>
          <p className="text-xl text-gray-600">
            Issue verifiable credentials to your community
          </p>
        </div>
        <CredentialWizard />
      </div>
    </main>
  );
}