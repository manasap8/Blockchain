import { 
  UserPersona, 
  DigitalAsset, 
  DepartmentCompliance, 
  LedgerTransaction, 
  DemoStep 
} from '../types';

export const USER_PERSONAS: Record<string, UserPersona> = {
  ciso: {
    id: 'ciso',
    name: 'Dr. Rajesh Sharma',
    roleTitle: 'Enterprise CISO & Super Admin',
    department: 'Cyber Defense & Security Ops',
    clearanceLevel: 'Tier-3 Secret',
    did: 'did:blockshield:eth:0x89C4e81B34752cE4D4fFe9A296D8b92b678B319a',
    publicKey: '0x04e6c981b2a37f59d4c20786961cfb36e8976b92f72dc6d67b360212008ebec9935f9921b7e4a30e70ec4a9e4034870f249d9703',
    email: 'rajesh.sharma@cert-in.gov.in',
    issuedAt: '2026-01-10T08:00:00Z',
    expiresAt: '2027-01-10T08:00:00Z'
  },
  finance: {
    id: 'finance',
    name: 'Priya Verma',
    roleTitle: 'Finance Director & Treasury Signer',
    department: 'Finance & Treasury',
    clearanceLevel: 'Tier-2 Confidential',
    did: 'did:blockshield:eth:0x41E29aB34720eB99042bC7F3A59103Cee87D25c4',
    publicKey: '0x044bc19dfb40a5a3152be351b6920436d50730b6531959779df5c8b7c7b8ad3f6f1947b2c01994e6bf542df986221c607ec',
    email: 'priya.verma@nic.gov.in',
    issuedAt: '2026-02-15T09:30:00Z',
    expiresAt: '2027-02-15T09:30:00Z'
  },
  operations: {
    id: 'operations',
    name: 'Rohan Mehta',
    roleTitle: 'Operations & Maintenance Officer',
    department: 'Field Operations',
    clearanceLevel: 'Tier-1 Restricted',
    did: 'did:blockshield:eth:0x93F16c4B3992dE82046835aF5429B8c8861E52B7',
    publicKey: '0x045bfd3369b7f5ccbb28c117dcf643f8e582845c4be4602f3a2283cb73898860b8686cfbb8d56c4c51480b001a14f44766f',
    email: 'rohan.mehta@grid-controller.in',
    issuedAt: '2026-03-01T11:00:00Z',
    expiresAt: '2027-03-01T11:00:00Z'
  },
  auditor: {
    id: 'auditor',
    name: 'Arjun Nair',
    roleTitle: 'Independent Compliance Auditor (CAG / MeitY)',
    department: 'National Audit & Oversight',
    clearanceLevel: 'Tier-3 Auditor',
    did: 'did:blockshield:eth:0x7B28c03975001A84358aFE42871b8602E9B4208e',
    publicKey: '0x04860b5220c388bc6110f607fa67e9f7c006d6e279a0b925bce8df47623a9b1cfa6b0ff21200155b9e73ef596f21beeb7ba',
    email: 'arjun.nair@meity.gov.in',
    issuedAt: '2026-01-05T06:00:00Z',
    expiresAt: '2027-01-05T06:00:00Z'
  }
};

export const INITIAL_ASSETS: DigitalAsset[] = [
  {
    id: 'asset-grid-01',
    name: 'National_Critical_Power_Grid_Topology.enc',
    category: 'Infrastructure',
    classification: 'Top Secret',
    sizeBytes: 4280590,
    sha256Hash: '0x7e88c03998b11a9f074a38260bfa201889c2560b388d0111ef8490a78912ef04',
    originalHash: '0x7e88c03998b11a9f074a38260bfa201889c2560b388d0111ef8490a78912ef04',
    isTampered: false,
    ipfsCid: 'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    ownerDid: USER_PERSONAS.ciso.did,
    ownerName: USER_PERSONAS.ciso.name,
    registeredBlock: 489201,
    createdAt: '2026-09-15T14:32:00Z',
    physicalProof: {
      serialNumber: 'SRN-GRID-DELHI-0091',
      hardwareUid: 'TPM2.0-INF-991204-IND',
      tamperSealHash: '0x4f82a93c78b111...seal99'
    }
  },
  {
    id: 'asset-defence-02',
    name: 'Defence_Procurement_Spec_v3.pdf',
    category: 'Defence',
    classification: 'Secret',
    sizeBytes: 1845120,
    sha256Hash: '0x3b1947b2c01994e6bf542df986221c607ec531959779df5c8b7c7b8ad3f6f194',
    originalHash: '0x3b1947b2c01994e6bf542df986221c607ec531959779df5c8b7c7b8ad3f6f194',
    isTampered: false,
    ipfsCid: 'ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    ownerDid: USER_PERSONAS.ciso.did,
    ownerName: USER_PERSONAS.ciso.name,
    registeredBlock: 489240,
    createdAt: '2026-09-20T09:12:00Z',
    physicalProof: {
      serialNumber: 'MOD-PROC-2026-891',
      hardwareUid: 'HSM-THALES-LUNA-331',
      tamperSealHash: '0x99a38f72c01...rfid65'
    }
  },
  {
    id: 'asset-treasury-03',
    name: 'Q3_Treasury_Disbursement.dat',
    category: 'Financial',
    classification: 'Confidential',
    sizeBytes: 892400,
    sha256Hash: '0x9a88c20188ef0411a9f074a38260bfa201889c2560b388d0111ef8490a787e88',
    originalHash: '0x9a88c20188ef0411a9f074a38260bfa201889c2560b388d0111ef8490a787e88',
    isTampered: false,
    ipfsCid: 'ipfs://QmZtmD2qt8fJpq3CLDHytTNZVCmpqqn3NacVgz3cwMgMa8',
    ownerDid: USER_PERSONAS.finance.did,
    ownerName: USER_PERSONAS.finance.name,
    registeredBlock: 489312,
    createdAt: '2026-09-26T18:04:00Z',
    physicalProof: {
      serialNumber: 'RBI-DISBURSE-BATCH-77',
      hardwareUid: 'YUBIKEY-FIPS-5C-0912',
      tamperSealHash: '0x22c98d0199a...token81'
    }
  }
];

export const INITIAL_LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'tx-001',
    txHash: '0x8f4d1e2a9b34720eb99042bc7f3a59103cee87d25c48b2a37f59d4c20786961c',
    blockNumber: 489312,
    timestamp: '2026-09-26T18:04:22Z',
    type: 'AssetRegistered',
    initiatorDid: USER_PERSONAS.finance.did,
    initiatorName: USER_PERSONAS.finance.name,
    assetId: 'asset-treasury-03',
    assetName: 'Q3_Treasury_Disbursement.dat',
    status: 'COMMITTED',
    gasSavedPercent: 88,
    merkleRoot: '0x3e18a99472b8c91a0c4f7721d01928ef6610041289ae5c329188f01bcae84192',
    signature: '0x1b44c82b99478f7e2a0b1c99021948ba994c9210',
    details: 'Anchored cryptographic SHA-256 and physical HSM seal on Hyperledger channel ch-national-registry.',
    complianceTags: ['DPDP 2023 Sec 8(4)', 'ISO 27001 A.10']
  },
  {
    id: 'tx-002',
    txHash: '0x4a92c819dfb40a5a3152be351b6920436d50730b6531959779df5c8b7c7b8ad3',
    blockNumber: 489313,
    timestamp: '2026-09-26T19:40:11Z',
    type: 'PolicyEvaluated',
    initiatorDid: USER_PERSONAS.ciso.did,
    initiatorName: USER_PERSONAS.ciso.name,
    assetId: 'asset-grid-01',
    assetName: 'National_Critical_Power_Grid_Topology.enc',
    status: 'COMMITTED',
    gasSavedPercent: 84,
    merkleRoot: '0x4f92e01b34752ce4d4ffe9a296d8b92b678b319ae89c2560b388d0111ef8490a',
    signature: '0x2c55d93c00589a8f3b1c2d00132059cb005d0321',
    details: 'Access evaluation passed: Tier-3 CISO access granted from secure perimeter IP range.',
    complianceTags: ['ISO 27001 A.9', 'IT Act 43A']
  },
  {
    id: 'tx-003',
    txHash: '0x7b33d0188ef0411a9f074a38260bfa201889c2560b388d0111ef8490a787e88c',
    blockNumber: 489314,
    timestamp: '2026-09-27T03:15:44Z',
    type: 'ZKProofAnchor',
    initiatorDid: USER_PERSONAS.finance.did,
    initiatorName: USER_PERSONAS.finance.name,
    status: 'COMMITTED',
    gasSavedPercent: 91,
    merkleRoot: '0x5c8b7c7b8ad3f6f1947b2c01994e6bf542df986221c607ec531959779df5c8b7',
    signature: '0x3d66e04d11690b9f4c2d3e11243160dc116e1432',
    details: 'Groth16 zk-SNARK proof validated on-chain without disclosing employee ID or salary.',
    complianceTags: ['DPDP 2023 Sec 8(5)', 'Zero Knowledge Privacy']
  },
  {
    id: 'tx-004',
    txHash: '0x1f2e3d4c5b6a708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809',
    blockNumber: 489315,
    timestamp: '2026-09-27T10:14:02Z',
    type: 'PolicyEvaluated',
    initiatorDid: USER_PERSONAS.operations.did,
    initiatorName: USER_PERSONAS.operations.name,
    assetId: 'asset-defence-02',
    assetName: 'Defence_Procurement_Spec_v3.pdf',
    status: 'REVERTED',
    gasSavedPercent: 78,
    merkleRoot: '0x6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d',
    signature: '0x4e77f15e22701c0f5d3e4f22354271ed227f2543',
    details: 'Contract Revert: Rohan Mehta (Tier-1) attempted unauthorized read on Tier-3 asset.',
    complianceTags: ['IT Act Sec 66C', 'ISO 27001 A.9']
  }
];

export const DEPARTMENT_COMPLIANCE: DepartmentCompliance[] = [
  {
    department: 'Finance & Treasury',
    score: 98.4,
    revokedOnTimePercent: 100,
    mfaAdoptionPercent: 99.2,
    staleAccessIndex: 1.2,
    activeDids: 14,
    auditGrade: 'A+'
  },
  {
    department: 'Cyber Defense & Security Ops',
    score: 99.8,
    revokedOnTimePercent: 100,
    mfaAdoptionPercent: 100,
    staleAccessIndex: 0.4,
    activeDids: 8,
    auditGrade: 'A+'
  },
  {
    department: 'Field Operations & Power Grid',
    score: 92.1,
    revokedOnTimePercent: 94.5,
    mfaAdoptionPercent: 96.0,
    staleAccessIndex: 4.8,
    activeDids: 18,
    auditGrade: 'A'
  },
  {
    department: 'National Healthcare Registry',
    score: 95.7,
    revokedOnTimePercent: 97.2,
    mfaAdoptionPercent: 98.4,
    staleAccessIndex: 2.9,
    activeDids: 12,
    auditGrade: 'A'
  }
];

export const DEMO_SCRIPT_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Platform Architecture & Live HUD',
    targetTab: 'command-center',
    description: 'Overview of Hyperledger Fabric block heights, gas optimization (84% via Merkle batching), and live event stream.',
    judgeHighlight: 'Note the real-time Merkle block incrementer and active node telemetry.'
  },
  {
    step: 2,
    title: 'Decentralized Identity (DID) & Mobile Wallet',
    targetTab: 'identity-zk',
    description: 'Inspect verifiable credentials, cryptographic public keys, and simulate smartphone WebAuthn biometric unlock.',
    judgeHighlight: 'Examine W3C DID specification compliance and dynamic TOTP rotation.'
  },
  {
    step: 3,
    title: 'Zero-Knowledge Proof Sandbox',
    targetTab: 'identity-zk',
    description: 'Prove "Role = Finance Manager" without revealing salary or employee ID using Groth16 zk-SNARKs.',
    judgeHighlight: 'Observe Circom circuit execution and generated pi_a, pi_b artifacts verified on-chain.'
  },
  {
    step: 4,
    title: 'Real SHA-256 Web Crypto Asset Anchoring',
    targetTab: 'asset-vault',
    description: 'Drop any live file. Watch client-side Web Crypto API calculate the SHA-256 hash and anchor to IPFS CID.',
    judgeHighlight: 'Real in-browser cryptographic hashing without external server dependencies.'
  },
  {
    step: 5,
    title: 'The Tamper Simulation Test (Break File)',
    targetTab: 'asset-vault',
    description: 'Click "Corrupt Asset Data" to modify 1 byte in the file. Watch immediate real-time hash collision rejection.',
    judgeHighlight: 'Flashing red integrity breach banner locks compromised asset instantly.'
  },
  {
    step: 6,
    title: 'Explainable AI (XAI) Access Control Engine',
    targetTab: 'policy-engine',
    description: 'Adjust risk sliders (Time, Device, Location). Watch weighted risk formula evaluate policy and explain "Why?".',
    judgeHighlight: 'Human-readable policy citation linked to dynamic contextual risk score.'
  },
  {
    step: 7,
    title: 'Dual-Signature High-Risk Transfer Flow',
    targetTab: 'multisig-transfer',
    description: 'Initiate a high-risk asset transfer. Witness Step 1/2 Manager sign and switch to Auditor for Step 2/2 sign-off.',
    judgeHighlight: 'Multi-party threshold cryptography prevents unilateral rogue actions.'
  },
  {
    step: 8,
    title: 'Coercion / Duress Panic Mode (PIN 9999)',
    targetTab: 'duress-mode',
    description: 'Enter decoy PIN 9999. The attacker sees "Success", but behind-the-scenes a silent alarm alerts the Auditor.',
    judgeHighlight: 'Social impact innovation safeguarding personnel under physical extortion.'
  },
  {
    step: 9,
    title: 'Red-Team Attack 1: Nonce Replay Defense',
    targetTab: 'redteam-simulator',
    description: 'Execute an intercepted replay attack. Watch the Hyperledger node reject the already-consumed nonce.',
    judgeHighlight: 'Instant defense terminal output showing cryptographic replay mitigation.'
  },
  {
    step: 10,
    title: 'Red-Team Attack 2: Privilege Escalation Revert',
    targetTab: 'redteam-simulator',
    description: 'Simulate junior officer requesting Top Secret Defence specs. Watch smart contract revert on clearance mismatch.',
    judgeHighlight: 'Deterministic smart-contract level ABAC enforcement.'
  },
  {
    step: 11,
    title: 'Offline Edge Verifier Mode (Wi-Fi Cut)',
    targetTab: 'compliance-audit',
    description: 'Toggle offline mode. Verify that pre-signed proof bundles can be verified at field borders without internet.',
    judgeHighlight: 'Edge verification with zero external API dependencies.'
  },
  {
    step: 12,
    title: 'Statutory Compliance Mapping & Legal Certificate',
    targetTab: 'compliance-audit',
    description: 'Examine automatic mapping to DPDP Act 2023, IT Act 2000, and ISO 27001. Generate printable legal audit PDF.',
    judgeHighlight: 'Complete chain of custody with embedded QR verification code.'
  }
];
