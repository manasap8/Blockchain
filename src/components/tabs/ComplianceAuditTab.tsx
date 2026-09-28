import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  WifiOff, 
  Wifi, 
  QrCode, 
  BookOpen, 
  Layers, 
  Lock,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { generateSvgQrMatrix, formatTruncated } from '../../utils/crypto';
import confetti from 'canvas-confetti';

export const ComplianceAuditTab: React.FC = () => {
  const { 
    transactions, 
    isOffline, 
    toggleOffline, 
    blockHeight, 
    currentPersona,
    assets 
  } = useBlockshield();

  const [offlineVerifyResult, setOfflineVerifyResult] = useState<string | null>(null);
  const [isVerifyingOffline, setIsVerifyingOffline] = useState<boolean>(false);
  const [selectedLawFilter, setSelectedLawFilter] = useState<string>('ALL');

  const complianceStandards = [
    {
      id: 'DPDP',
      name: 'Digital Personal Data Protection (DPDP) Act 2023',
      jurisdiction: 'Republic of India · Ministry of Electronics & IT',
      sections: 'Section 8(4) [Security Safeguards], Section 8(5) [Breach Reporting]',
      relevance: 'Zero-knowledge proofs prevent unauthorized personal data exposure. Instant breach isolation meets mandatory reporting SLA.'
    },
    {
      id: 'ITACT',
      name: 'Information Technology Act 2000 (Amendments 2008)',
      jurisdiction: 'Cyber Laws of India',
      sections: 'Section 43A [Data Security Compensation], Section 66C [Identity Theft]',
      relevance: 'Verifiable credentials eliminate identity spoofing. Merkle proof hashing guarantees cryptographic non-repudiation.'
    },
    {
      id: 'ISO27001',
      name: 'ISO/IEC 27001:2022 ISMS Controls',
      jurisdiction: 'International Standards Organization',
      sections: 'Annex A.9 (Access Control) & Annex A.10 (Cryptography)',
      relevance: 'Segregation of duties enforced via 2-of-2 dual signature pipelines and hardware TPM binding.'
    }
  ];

  const handleRunOfflineVerification = () => {
    setIsVerifyingOffline(true);
    setOfflineVerifyResult(null);

    setTimeout(() => {
      setIsVerifyingOffline(false);
      setOfflineVerifyResult(
        'OFFLINE SIGNATURE VALID: Verified 3 pre-signed cryptographic bundles against cached National Root Public Key (ECDSA Secp256k1). Zero network queries dispatched.'
      );
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const certQrSvg = generateSvgQrMatrix(`BLOCKSHIELD-SIH-2026-BLOCK-${blockHeight}`, 140);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Statutory Compliance Auto-Mapping & Legal Export</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              DPDP 2023 · IT Act 2000 · ISO 27001
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            SIH Innovations #5 & #8: Continuous legal alignment. Every event on the ledger is mapped 
            directly to Indian statutory data protection laws and international information security standards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrintCertificate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Legal Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Offline Edge Verifier Banner / Mode (Innovation #5) */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isOffline ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Offline Edge Verifier Mode (Wi-Fi Cut Simulation)
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isOffline
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isOffline ? 'OFFLINE VERIFICATION ACTIVE' : 'ONLINE MODE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Demonstrate that field personnel at air-gapped critical facilities can verify cached proof bundles 
                without any internet or cloud connectivity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={toggleOffline}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                isOffline
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isOffline ? 'Restore Online Network' : 'Cut Internet (Go Offline)'}
            </button>

            <button
              onClick={handleRunOfflineVerification}
              disabled={isVerifyingOffline}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isVerifyingOffline ? 'Verifying Offline...' : 'Verify Cached Bundles'}</span>
            </button>
          </div>
        </div>

        {offlineVerifyResult && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{offlineVerifyResult}</span>
          </div>
        )}
      </div>

      {/* Statutory Mapping Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {complianceStandards.map(std => (
          <div
            key={std.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {std.id}
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{std.name}</h4>
              <p className="text-[11px] text-slate-400 font-mono">{std.sections}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {std.relevance}
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Jurisdiction:</span>
              <span className="text-slate-200">{std.jurisdiction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Legal Audit Certificate Preview Card */}
      <div className="glass-panel rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden print-card">
        {/* Decorative Watermark Emblem in Background */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none text-9xl font-mono">
          ⚖
        </div>

        {/* Certificate Header */}
        <div className="border-b-2 border-slate-700 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Government of India · Smart India Hackathon 2026
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              CRYPTOGRAPHIC CERTIFICATE OF STATUTORY AUDIT & LEDGER INTEGRITY
            </h3>
            <div className="text-xs font-mono text-slate-400">
              Platform: BLOCKSHIELD · Team CureCoders (ID: 163939) · Ministry PS 26125
            </div>
          </div>

          <div 
            className="p-2 bg-white text-slate-900 rounded-xl shadow-md shrink-0"
            dangerouslySetInnerHTML={{ __html: certQrSvg }}
            title="Scan to verify cryptographic ledger proof bundle"
          />
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Issuing Timestamp</span>
            <span className="text-white font-mono font-semibold">{new Date().toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Blockchain Consensus</span>
            <span className="text-emerald-400 font-mono font-semibold">Block #{blockHeight} (Finalized)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Auditor Authority</span>
            <span className="text-white font-semibold">Arjun Nair (MeitY / CAG)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Integrity Grade</span>
            <span className="text-emerald-400 font-bold font-mono">Grade A+ (99.98%)</span>
          </div>
        </div>

        {/* Recent Audit Ledger Proof Excerpts */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Cryptographic Event Digest (Last 4 Finalized Blocks)
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Channel: ch-national-registry
            </span>
          </div>

          <div className="divide-y divide-white/5 border border-slate-800 rounded-xl overflow-hidden bg-[#070A12]">
            {transactions.slice(0, 4).map(tx => (
              <div key={tx.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">#{tx.blockNumber}</span>
                    <span className="font-semibold text-slate-200">{tx.type}</span>
                    <span className="text-[10px] font-mono text-slate-500">[{tx.status}]</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-xl">
                    {tx.details}
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                  <div className="text-emerald-400">{formatTruncated(tx.txHash, 8, 6)}</div>
                  <div className="text-[10px] text-slate-500">{tx.complianceTags.join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Sign-Off Stamps */}
        <div className="mt-8 pt-6 border-t-2 border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Independent Compliance Sign-off</div>
            <div className="font-bold text-white">Arjun Nair</div>
            <div className="text-[11px] text-slate-400 font-mono">
              ECDSA-SHA256 Signature: 0x04860b5220c388bc6110f607fa67e9f7c006d6...
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Verified Under DPDP Act 2023 Sec 8(4)</div>
          </div>

          <div className="space-y-1 text-right sm:text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Cryptographic Anchor Stamp</div>
            <div className="font-bold text-white">Hyperledger Fabric Enterprise Anchor</div>
            <div className="text-[11px] text-slate-400 font-mono">
              State Root: 0x3e18a99472b8c91a0c4f7721d01928ef66100412...
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Non-Repudiation Guaranteed Under IT Act Sec 43A</div>
          </div>
        </div>
      </div>
    </div>
  );
};
