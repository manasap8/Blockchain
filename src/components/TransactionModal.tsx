import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  GitCommit, 
  Layers, 
  Flame, 
  BookOpen 
} from 'lucide-react';
import { LedgerTransaction } from '../types';
import { formatTruncated, generateSvgQrMatrix } from '../utils/crypto';

interface TransactionModalProps {
  tx: LedgerTransaction | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!tx) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const qrSvg = generateSvgQrMatrix(tx.txHash, 110);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Cryptographic Transaction Inspector
              </h3>
              <div className="text-[11px] text-slate-400 font-mono">
                Block #{tx.blockNumber} · Channel ch-national-registry
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status & Summary Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  tx.status === 'COMMITTED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : tx.status === 'REVERTED'
                    ? 'bg-red-950 text-red-300 border border-red-500/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  {tx.status}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Type: <strong className="text-slate-200">{tx.type}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {tx.details}
              </p>
            </div>

            {/* Micro QR Proof Code */}
            <div 
              className="p-1.5 bg-white text-slate-900 rounded-lg shrink-0"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
              title="Deterministic cryptographic visual verification matrix"
            />
          </div>

          {/* Cryptographic Fields */}
          <div className="space-y-3">
            {/* Transaction Hash */}
            <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Transaction Hash (SHA-256)</span>
                <button
                  onClick={() => copyToClipboard(tx.txHash, 'txHash')}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {copiedKey === 'txHash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'txHash' ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-300 break-all select-all">
                {tx.txHash}
              </div>
            </div>

            {/* Merkle Root */}
            <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>State Merkle Root</span>
                </span>
                <button
                  onClick={() => copyToClipboard(tx.merkleRoot, 'merkleRoot')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {copiedKey === 'merkleRoot' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'merkleRoot' ? 'Copied' : 'Copy Root'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-indigo-300 break-all select-all">
                {tx.merkleRoot}
              </div>
            </div>

            {/* Signer DID & Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1">Initiator Identity</div>
                <div className="text-xs font-semibold text-white">{tx.initiatorName}</div>
                <div className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
                  {formatTruncated(tx.initiatorDid, 14, 8)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1">Timestamp & Consensus Gas</div>
                <div className="text-xs text-slate-300 font-mono">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>{tx.gasSavedPercent}% Gas Reduction (Merkle-Batched)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Compliance Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Compliance Citations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tx.complianceTags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Raw Payload Accordion */}
          <details className="group rounded-xl border border-slate-800 bg-[#070A12] overflow-hidden">
            <summary className="px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-between">
              <span>View Raw Ledger State JSON</span>
              <span className="text-[10px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <pre className="p-4 text-[11px] font-mono text-emerald-400/90 overflow-x-auto border-t border-slate-800 bg-black/60 max-h-48">
              {JSON.stringify(tx, null, 2)}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Valid Proof Anchor • Hyperledger Fabric Consensus</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
