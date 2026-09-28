import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Key, 
  ArrowRight,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { USER_PERSONAS } from '../../data/initialData';
import { formatTruncated } from '../../utils/crypto';
import confetti from 'canvas-confetti';

export const MultiSigTransferTab: React.FC = () => {
  const { 
    currentPersona, 
    assets, 
    transferRequests, 
    createTransferRequest, 
    signTransferRequest,
    switchPersona 
  } = useBlockshield();

  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [targetUserKey, setTargetUserKey] = useState('operations');
  const [transferMemo, setTransferMemo] = useState('Critical SCADA Grid Relocation Authorization Batch #26125');

  const targetUser = USER_PERSONAS[targetUserKey] || USER_PERSONAS.operations;
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    createTransferRequest({
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      toDid: targetUser.did,
      toName: targetUser.name,
      amountOrValue: transferMemo
    });
  };

  const handleSign = (requestId: string) => {
    signTransferRequest(requestId);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Multi-Party Dual-Signature Approval Pipeline</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              2-of-2 Threshold
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            SIH Access Control: Segregation of duties prevents unilateral insider compromise. 
            High-consequence assets require co-signatures from both Department Lead and Independent Compliance Auditor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Initiate New High-Risk Transfer */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>Initiate Asset Transfer</span>
          </h3>

          <form onSubmit={handleInitiate} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Asset to Transfer</label>
              <select
                value={selectedAssetId}
                onChange={e => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} [{a.classification}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Recipient Subject DID</label>
              <select
                value={targetUserKey}
                onChange={e => setTargetUserKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                {Object.entries(USER_PERSONAS).map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Transfer Purpose & Memo</label>
              <textarea
                value={transferMemo}
                onChange={e => setTransferMemo(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div>Initiating as: <strong className="text-white">{currentPersona.name}</strong></div>
              <div>Requirement: <span className="text-indigo-400">Signature 1 (Initiator) + Signature 2 (Auditor)</span></div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Sign & Broadcast Transfer Request</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Active Multi-Sig Transfer Pipeline */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Multi-Signature Pipelines in Flight</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              {transferRequests.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {transferRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No transfer requests currently pending signatures.
              </div>
            ) : (
              transferRequests.map(req => {
                const isComplete = req.status === 'COMPLETED';
                const hasCurrentPersonaSigned = req.signaturesCollected.some(s => s.signerDid === currentPersona.did);
                const isAuditor = currentPersona.id === 'auditor';

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            isComplete
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}>
                            {isComplete ? 'EXECUTED ON-CHAIN' : 'WAITING FOR 2ND SIGNATURE'}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {req.assetName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {req.amountOrValue}
                        </p>
                      </div>

                      <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                        From: {req.fromName} ➔ To: {req.toName}
                      </div>
                    </div>

                    {/* Step-by-Step Signature Progress Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Step 1 Box */}
                      <div className="p-3.5 rounded-xl bg-[#070A12] border border-emerald-500/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          ✓
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-emerald-300">
                            Signature 1/2: Initiator Signed
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {req.signaturesCollected[0]?.signerName || req.fromName} ({req.signaturesCollected[0]?.role})
                          </div>
                        </div>
                      </div>

                      {/* Step 2 Box */}
                      <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                        isComplete
                          ? 'bg-[#070A12] border-emerald-500/30'
                          : 'bg-slate-900/60 border-amber-500/30'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isComplete
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {isComplete ? '✓' : '2'}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold ${isComplete ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {isComplete ? 'Signature 2/2: Auditor Signed' : 'Signature 2/2: Waiting for Auditor'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {isComplete
                              ? `${req.signaturesCollected[1]?.signerName} (${req.signaturesCollected[1]?.role})`
                              : 'Requires Independent Auditor (Arjun Nair)'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    {!isComplete && (
                      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-400 font-mono">
                          Current Persona: <strong className="text-white">{currentPersona.name}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isAuditor && (
                            <button
                              type="button"
                              onClick={() => switchPersona('auditor')}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer"
                            >
                              Switch to Arjun Nair (Auditor)
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSign(req.id)}
                            disabled={hasCurrentPersonaSigned}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              hasCurrentPersonaSigned
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                            }`}
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>{hasCurrentPersonaSigned ? 'Already Signed' : 'Sign & Complete Transfer'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
