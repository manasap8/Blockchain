import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Users, 
  Layers, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Filter,
  ArrowUpRight,
  Award
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { DEPARTMENT_COMPLIANCE } from '../../data/initialData';
import { formatTruncated } from '../../utils/crypto';

export const CommandCenterTab: React.FC = () => {
  const { 
    transactions, 
    setInspectingTx, 
    blockHeight,
    assets,
    duressAlerts
  } = useBlockshield();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTxs = transactions.filter(tx => {
    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.txHash.toLowerCase().includes(q) ||
        tx.initiatorName.toLowerCase().includes(q) ||
        (tx.assetName && tx.assetName.toLowerCase().includes(q)) ||
        tx.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Data Integrity Assurance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">99.98%</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>0 Unresolved Hashes</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{assets.length} Assets Anchored</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Fraud Attempts Prevented</span>
            <AlertTriangle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">1,428</div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-2 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Data Leakage Recorded</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Gas / Storage Optimization</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">84%</div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-2 font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Merkle-Tree Batch Anchoring</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Active Enterprise DIDs</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">42 Nodes</div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400 mt-2 font-mono">
            <span>Block #{blockHeight} Consensus</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Merkle Ledger Feed + Departmental Compliance Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Ledger Feed */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          {/* Header & Filter Controls */}
          <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Immutable Blockchain Event Ledger</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Live Feed
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time cryptographic audit trail validated on Hyperledger Fabric consensus
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
              {['ALL', 'AssetRegistered', 'PolicyEvaluated', 'ZKProofAnchor', 'OwnershipTransfer'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    filterType === t
                      ? 'bg-slate-800 text-emerald-300 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'ALL' ? 'All' : t.replace('Registered', '').replace('Evaluated', '').replace('Anchor', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-5 py-2.5 bg-slate-900/40 border-b border-white/5 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Tx Hash, Asset Name, Signer, or Clause..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Transaction Stream List */}
          <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
            {filteredTxs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No matching blockchain transactions recorded.
              </div>
            ) : (
              filteredTxs.map(tx => (
                <div
                  key={tx.id}
                  onClick={() => setInspectingTx(tx)}
                  className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        tx.status === 'COMMITTED'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'REVERTED'
                          ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Block #{tx.blockNumber}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {tx.initiatorName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed truncate">
                      {tx.details}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono flex-wrap">
                      <span className="text-emerald-400/90 font-semibold group-hover:text-emerald-300 transition-colors">
                        Tx: {formatTruncated(tx.txHash, 10, 6)}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span>Gas Saved: {tx.gasSavedPercent}%</span>
                      <span className="text-slate-600">·</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-slate-500 group-hover:text-emerald-400 transition-colors text-xs font-mono">
                    <span className="hidden sm:inline">Inspect</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Departmental Compliance Leaderboard (Innovation #7) */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Department Compliance</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                SIH Innovation #7: Continuous statutory audit score
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              ISO 27001
            </span>
          </div>

          <div className="space-y-3">
            {DEPARTMENT_COMPLIANCE.map((dept, index) => (
              <div
                key={dept.department}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      0{index + 1}.
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {dept.department}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    dept.auditGrade.includes('+')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {dept.auditGrade} ({dept.score}%)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500">MFA Adoption</span>
                    <span className="text-slate-200 font-semibold">{dept.mfaAdoptionPercent}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Revoked Time</span>
                    <span className="text-slate-200 font-semibold">{dept.revokedOnTimePercent}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Stale Index</span>
                    <span className="text-emerald-400 font-semibold">{dept.staleAccessIndex}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed font-mono">
            <strong>Automated Scoring Rule:</strong> Departments falling below 90% score are automatically placed on stepped-up dual-authorization for all Tier-2/3 access.
          </div>
        </div>
      </div>
    </div>
  );
};
