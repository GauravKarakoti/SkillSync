# SkillSync: Your Verifiable Career Passport

> This project was built for the Moca Network Proof of Build Hackathon.

## 🚀 Inspiration
The inspiration for SkillSync comes from the inefficiencies and lack of trust in modern professional networking and recruitment. We wanted to empower individuals to own their professional narrative and give organizations a tool for instant, trustworthy verification.

## 💡 What it does
SkillSync is a dApp that allows users to build a portable, verifiable record of their skills and career achievements. Users can request verifiable credentials from employers, clients, and educational platforms. They can then share proof of these qualifications with anyone, without compromising their underlying personal data, using zero-knowledge proofs powered by Moca Network.

## 🛠️ How we built it
- **Frontend:** Built with Next.js and Tailwind CSS for a responsive UI.
- **Moca AIR Kit:** Integrated for user login (Account Services) and issuing/verifying credentials (Credential Services).
- **Smart Contracts:** Deployed on the Moca Chain testnet to handle the status of verifiable credentials.
- **Zero-Knowledge Proofs:** Leveraged Moca's zkProof infrastructure to allow for private verification.
- **Storage:** Used IPFS to store credential metadata pointers.

## 🔧 Technologies Used
- Moca AIR Kit SDK
- Moca Chain (Testnet)
- Solidity
- Next.js
- IPFS
- Node.js

## 🧗 Challenges we ran into
- **Onboarding Issuers:** Designing a simple flow for organizations to become credential issuers was challenging.
- **ZK Abstraction:** Abstracting the complexity of ZKPs into a single-click verification for the end-user required careful design and iteration.

## 🏆 Accomplishments that we're proud of
- Successfully creating a seamless user experience for a product based on complex cryptography.
- Building a fully functional demo that issues and verifies credentials on the Moca testnet.
- Designing a system that has a clear path to real-world adoption.

## 📚 What we learned
- The power of Moca's AIR Kit in abstracting Web3 complexity for both developers and users.
- How to design schemas for verifiable credentials that are both flexible and standardized.
- The importance of user experience (UX) as a critical success factor for Web3 adoption.

## 🚀 What's next for SkillSync
- Onboard our first pilot partners from the Web3 ecosystem (DAOs, hackathons).
- Develop and launch the recruiter dashboard.
- Explore the creation of a SkillSync "Reputation Oracle" that can be queried by other dApps.

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- A Moca Chain testnet wallet

### Installation
1.  Clone the repo: `git clone https://github.com/GauravKarakoti/SkillSync`
2.  Install dependencies: `npm install`
3.  Set up environment variables: Create a `.env` file and add your Moca AIR Kit configuration.
4.  Run the development server: `npm run dev`
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎥 Demo
- **Live Demo:** [Link to your live demo, e.g., on Vercel]
- **Demo Video:** [Link to your video explanation on Loom or YouTube]

## 👥 Team
- [Gaurav Karakoti] ([[@GauravKarakoti](https://t.me/GauravKarakoti)], [[@GauravKara_Koti](https://x.com/GauravKara_Koti)])
