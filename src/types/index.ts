export type UserRole = 'ciso' | 'finance' | 'operations' | 'auditor';

export interface UserPersona {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  clearanceLevel: 'Tier-1 Restricted' | 'Tier-2 Confidential' | 'Tier-3 Secret' | 'Tier-3 Auditor';
  did: string;
  publicKey: string;
  avatarUrl?: string;
  email: string;
  issuedAt: string;
  expiresAt: string;
}

export type TransactionType = 
  | 'AssetRegistered'
  | 'PolicyEvaluated'
  | 'ZKProofAnchor'
  | 'OwnershipTransfer'
  | 'MultiSigApproval'
  | 'DuressAlert'
  | 'TamperDetected'
  | 'AccessRevoked';

export interface LedgerTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  type: TransactionType;
  initiatorDid: string;
  initiatorName: string;
  assetId?: string;
  assetName?: string;
  status: 'COMMITTED' | 'REVERTED' | 'SILENT_FLAGGED';
  gasSavedPercent: number;
  merkleRoot: string;
  signature: string;
  details: string;
  complianceTags: string[];
}

export interface DigitalAsset {
  id: string;
  name: string;
  category: 'Defence' | 'Infrastructure' | 'Financial' | 'Governance' | 'Healthcare';
  classification: 'Confidential' | 'Secret' | 'Top Secret';
  sizeBytes: number;
  sha256Hash: string;
  originalHash: string; // for tamper detection
  isTampered: boolean;
  ipfsCid: string;
  ownerDid: string;
  ownerName: string;
  registeredBlock: number;
  createdAt: string;
  physicalProof?: {
    serialNumber: string;
    hardwareUid: string;
    tamperSealHash: string;
  };
}

export interface DepartmentCompliance {
  department: string;
  score: number;
  revokedOnTimePercent: number;
  mfaAdoptionPercent: number;
  staleAccessIndex: number; // lower is better
  activeDids: number;
  auditGrade: 'A+' | 'A' | 'B+' | 'B';
}

export interface ZkProofArtifact {
  circuit: string;
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
  publicSignals: string[];
  protocol: 'Groth16 / BN128';
  verificationStatus: 'VALID' | 'INVALID' | 'UNVERIFIED';
  verifiedAt?: string;
}

export interface AccessEvaluationResult {
  decision: 'ALLOW' | 'STEP_UP_MFA' | 'DENY';
  riskScore: number;
  riskBreakdown: {
    timeScore: number;
    deviceScore: number;
    locationScore: number;
    patternScore: number;
  };
  policyId: string;
  policyName: string;
  policyClause: string;
  reasoningPath: string[];
  evaluatedAt: string;
}

export interface TransferRequest {
  id: string;
  assetId: string;
  assetName: string;
  fromDid: string;
  fromName: string;
  toDid: string;
  toName: string;
  amountOrValue: string;
  status: 'PENDING_SIG_1' | 'PENDING_SIG_2' | 'COMPLETED' | 'QUARANTINED_DURESS';
  requiredSignatures: number;
  signaturesCollected: {
    signerDid: string;
    signerName: string;
    signedAt: string;
    role: string;
  }[];
  initiatedAt: string;
  isDuressDecoy?: boolean;
}

export interface DuressAlert {
  id: string;
  timestamp: string;
  userDid: string;
  userName: string;
  simulatedGeo: {
    lat: number;
    lng: number;
    locationName: string;
  };
  attemptedAsset: string;
  decoyPinEntered: string;
  status: 'SILENT_ACTIVE' | 'ACKNOWLEDGED' | 'CONTAINED';
  audioBeaconSimulated: boolean;
}

export interface AttackSimulationLog {
  id: string;
  timestamp: string;
  attackType: 'NONCE_REPLAY' | 'PRIVILEGE_ESCALATION' | 'OFFCHAIN_TAMPER';
  attackerDid: string;
  targetResource: string;
  rawPayload: string;
  defenseMechanism: string;
  contractResponse: string;
  status: 'BLOCKED' | 'FLAGGED';
}

export interface DemoStep {
  step: number;
  title: string;
  targetTab: string;
  description: string;
  judgeHighlight: string;
}
