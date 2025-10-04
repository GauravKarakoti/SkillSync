import { CredentialWallet } from '@/components/CredentialWallet';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillSync
          </h1>
          <p className="text-xl text-gray-600">
            Your Verifiable Career Passport
          </p>
          <p className="text-gray-500 mt-2">
            Prove your skills, not your data
          </p>
        </div>
        <CredentialWallet />
      </div>
    </main>
  );
}