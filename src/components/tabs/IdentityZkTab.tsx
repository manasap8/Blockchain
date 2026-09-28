import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  EyeOff, 
  Copy, 
  Check, 
  Smartphone, 
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { generateSimulatedZkProof, formatTruncated, generateSvgQrMatrix } from '../../utils/crypto';
import { ZkProofArtifact } from '../../types';
import confetti from 'canvas-confetti';

export const IdentityZkTab: React.FC = () => {
  const { currentPersona, addTransaction, setIsWalletModalOpen } = useBlockshield();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingZk, setIsGeneratingZk] = useState(false);
  const [zkStep, setZkStep] = useState<number>(0);
  const [zkProof, setZkProof] = useState<ZkProofArtifact | null>(null);

  // ZK Playground inputs
  const [proofRole, setProofRole] = useState<'Finance' | 'CyberDefense' | 'Operations'>('Finance');
  const [hideSalary, setHideSalary] = useState(true);
  const [hideEmployeeId, setHideEmployeeId] = useState(true);
  const [hideAddress, setHideAddress] = useState(true);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateProof = () => {
    setIsGeneratingZk(true);
    setZkProof(null);
    setZkStep(1);

    // Multi-phase circuit simulation
    setTimeout(() => setZkStep(2), 500);
    setTimeout(() => setZkStep(3), 1100);
    setTimeout(() => {
      setZkStep(4);
      const isFin = proofRole === 'Finance';
      const proof = generateSimulatedZkProof({
        isFinanceManager: isFin,
        department: proofRole,
        minimumClearanceMet: true
      });
      setZkProof(proof);
      setIsGeneratingZk(false);

      if (proof.verificationStatus === 'VALID') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });

        addTransaction({
          type: 'ZKProofAnchor',
          initiatorDid: currentPersona.did,
          initiatorName: currentPersona.name,
          status: 'COMMITTED',
          gasSavedPercent: 92,
          details: `Groth16 zk-SNARK verification confirmed: Role = ${proofRole} Manager verified without disclosing salary, identity, or private credentials.`,
          complianceTags: ['DPDP 2023 Sec 8(5)', 'Zero-Knowledge Selective Disclosure']
        });
      }
    }, 1800);
  };

  const didQr = generateSvgQrMatrix(currentPersona.did, 120);

  return (
    <div className="space-y-6">
      {/* Header Description */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Decentralized Identity (DID) & Zero-Knowledge Proofs</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              W3C DID + Circom
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            SIH Innovations #3 & #6: Self-sovereign cryptographic identities anchored on Hyperledger Fabric. 
            Prove membership and clearance tier without revealing sensitive PII, salary, or employee identifiers.
          </p>
        </div>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>Launch Mobile Wallet</span>
        </button>
      </div>

      {/* Grid: Verifiable Credential Card + ZK Proof Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Verifiable Credential Display Card */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                W3C Verifiable Credential
              </span>
              <h3 className="text-xl font-bold text-white">{currentPersona.name}</h3>
              <p className="text-xs text-slate-400">{currentPersona.roleTitle}</p>
            </div>

            <div 
              className="p-1.5 bg-white text-slate-900 rounded-lg shadow-md shrink-0"
              dangerouslySetInnerHTML={{ __html: didQr }}
            />
          </div>

          {/* Credential Details Box */}
          <div className="space-y-3 bg-[#070A12] p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                <span>Subject DID</span>
                <button
                  onClick={() => copyToClipboard(currentPersona.did, 'did')}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[10px] font-mono cursor-pointer"
                >
                  {copiedKey === 'did' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'did' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-300 break-all select-all">
                {currentPersona.did}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                <span>Secp256k1 Public Key</span>
                <button
                  onClick={() => copyToClipboard(currentPersona.publicKey, 'pubkey')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-[10px] font-mono cursor-pointer"
                >
                  {copiedKey === 'pubkey' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'pubkey' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-indigo-300 break-all select-all">
                {formatTruncated(currentPersona.publicKey, 16, 12)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">Department</span>
                <span className="text-slate-200 font-semibold">{currentPersona.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">Clearance Tier</span>
                <span className="text-emerald-400 font-semibold font-mono">{currentPersona.clearanceLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-[10px] text-slate-500 block">Issued</span>
                <span>{new Date(currentPersona.issuedAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Expires</span>
                <span>{new Date(currentPersona.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Signed by National Root Authority</span>
            </div>
            <span className="font-mono text-[11px]">ECDSA-SHA256</span>
          </div>
        </div>

        {/* Right: Zero-Knowledge Selective Disclosure Sandbox */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-indigo-400" />
                <span>Zero-Knowledge Proof Sandbox</span>
              </h3>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded">
                snarkjs · Groth16
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demonstrate mathematical proof of department membership without exposing private attributes 
              (salary, Aadhaar, internal employee index).
            </p>
          </div>

          {/* Interactive Parameters */}
          <div className="space-y-3 bg-[#070A12] p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Claim to Prove via ZK Circuit:</label>
              <select
                value={proofRole}
                onChange={e => setProofRole(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="Finance">Prove: User is Manager in Finance Department</option>
                <option value="CyberDefense">Prove: User holds Tier-3 Secret Cyber Clearance</option>
                <option value="Operations">Prove: User is Certified Power Grid Maintenance Engineer</option>
              </select>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-slate-400 font-medium">Protected (Zero-Disclosed) Fields:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">Salary Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">Emp ID Hidden</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">PII Sealed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Execution Animation or Generated Proof */}
          {isGeneratingZk ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                <Cpu className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Executing Circom R1CS Circuit...</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <div className={zkStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}>
                  ✓ Stage 1: Compiling constraint system & witness generation
                </div>
                <div className={zkStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}>
                  {zkStep >= 2 ? '✓' : '○'} Stage 2: QAP Polynomial Reduction (BN128 pairing)
                </div>
                <div className={zkStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}>
                  {zkStep >= 3 ? '✓' : '○'} Stage 3: Computing Groth16 Prover commitments
                </div>
              </div>
            </div>
          ) : zkProof ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ZK PROOF VALID: Verified on-chain without data exposure</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Protocol: {zkProof.protocol}
                </span>
              </div>

              {/* Proof Artifact Preview */}
              <div className="bg-black/60 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                <div><span className="text-indigo-400">pi_a:</span> [{zkProof.pi_a[0].slice(0, 14)}..., {zkProof.pi_a[1].slice(0, 14)}...]</div>
                <div><span className="text-indigo-400">pi_b:</span> [[{zkProof.pi_b[0][0].slice(0, 10)}...], [{zkProof.pi_b[1][0].slice(0, 10)}...]]</div>
                <div><span className="text-indigo-400">publicSignals:</span> [{zkProof.publicSignals.join(', ')}]</div>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-500 font-mono bg-slate-900/40 rounded-xl border border-slate-800">
              Click below to execute zero-knowledge circuit and generate mathematical proof artifact.
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerateProof}
            disabled={isGeneratingZk}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isGeneratingZk
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingZk ? 'Generating zk-SNARK Proof...' : 'Generate zk-SNARK Proof'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
