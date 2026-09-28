import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  Clock, 
  Laptop, 
  Globe, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { USER_PERSONAS } from '../../data/initialData';
import { AccessEvaluationResult } from '../../types';

export const PolicyEngineTab: React.FC = () => {
  const { assets, addTransaction } = useBlockshield();

  // Dynamic sandbox parameters
  const [selectedUserKey, setSelectedUserKey] = useState<string>('finance');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'asset-grid-01');
  const [requestedAction, setRequestedAction] = useState<'READ' | 'TRANSFER' | 'AUDIT'>('READ');

  // Sliders
  const [timeHour, setTimeHour] = useState<number>(14); // 14:00 (Business hours)
  const [deviceTrust, setDeviceTrust] = useState<number>(0.1); // 0.1: Company Laptop, 0.6: Unknown, 0.95: Rooted
  const [locationRisk, setLocationRisk] = useState<number>(0.1); // 0.1: HQ Intranet, 0.5: ISP, 0.95: Tor
  const [patternAnomaly, setPatternAnomaly] = useState<number>(0.15); // 0.15: Normal, 0.85: Spike

  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const selectedUser = USER_PERSONAS[selectedUserKey] || USER_PERSONAS.ciso;
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  // Calculate Time Risk: Business hours (9:00 - 18:00) = low risk, night = high risk
  const timeRiskScore = useMemo(() => {
    if (timeHour >= 9 && timeHour <= 18) return 0.1;
    if (timeHour >= 19 && timeHour <= 22) return 0.4;
    return 0.85; // Graveyard hours
  }, [timeHour]);

  // Overall Weighted Risk: (0.35 × Time) + (0.25 × Device) + (0.25 × Location) + (0.15 × Pattern)
  const totalRisk = useMemo(() => {
    const val = (0.35 * timeRiskScore) + (0.25 * deviceTrust) + (0.25 * locationRisk) + (0.15 * patternAnomaly);
    return Math.min(1, Math.max(0, Math.round(val * 100) / 100));
  }, [timeRiskScore, deviceTrust, locationRisk, patternAnomaly]);

  // Evaluate ABAC / Clearance rules
  const evaluation: AccessEvaluationResult = useMemo(() => {
    const isTopSecret = selectedAsset.classification === 'Top Secret';
    const isSecret = selectedAsset.classification === 'Secret';

    // CISO has Tier-3 Secret
    const hasTier3 = selectedUser.clearanceLevel.includes('Tier-3');
    const hasTier2 = selectedUser.clearanceLevel.includes('Tier-2') || hasTier3;

    let decision: 'ALLOW' | 'STEP_UP_MFA' | 'DENY' = 'ALLOW';
    let policyId = 'POL-ABAC-104';
    let policyName = 'Enterprise Dynamic Zero-Trust Clearance Rule';
    let policyClause = '';

    if (isTopSecret && !hasTier3) {
      decision = 'DENY';
      policyClause = `Statutory Rejection (Clause 4.1): Asset requires Tier-3 Clearance. User ${selectedUser.name} holds ${selectedUser.clearanceLevel}. Request rejected at smart contract layer.`;
    } else if (isSecret && !hasTier2) {
      decision = 'DENY';
      policyClause = `Clearance Insufficient (Clause 4.2): Asset requires Tier-2 or above. User clearance insufficient. Access denied.`;
    } else if (totalRisk > 0.65) {
      decision = 'DENY';
      policyClause = `Anomalous Risk Threshold Exceeded (Clause 9.3): Aggregate contextual risk score (${totalRisk.toFixed(2)} > 0.65). Off-perimeter unknown device or unusual night hour flagged as potential breach.`;
    } else if (totalRisk >= 0.35) {
      decision = 'STEP_UP_MFA';
      policyClause = `Elevated Context Risk (Clause 7.2): Risk score ${totalRisk.toFixed(2)} triggers mandatory Step-Up FIDO2 / WebAuthn Biometric confirmation before granting ephemeral read token.`;
    } else {
      decision = 'ALLOW';
      policyClause = `Nominal Context Clearance (Clause 1.4): User holds required clearance level. Context risk is within nominal parameters (${totalRisk.toFixed(2)} < 0.35). Access granted with immutable audit anchor.`;
    }

    return {
      decision,
      riskScore: totalRisk,
      riskBreakdown: {
        timeScore: timeRiskScore,
        deviceScore: deviceTrust,
        locationScore: locationRisk,
        patternScore: patternAnomaly
      },
      policyId,
      policyName,
      policyClause,
      reasoningPath: [
        `Subject Identity: ${selectedUser.name} (${selectedUser.clearanceLevel})`,
        `Target Object: ${selectedAsset.name} [${selectedAsset.classification}]`,
        `Contextual Risk Calculation: ${(totalRisk * 100).toFixed(0)}%`,
        `Policy Clause Evaluated: ${policyId}`,
        `Consensus Verdict: ${decision}`
      ],
      evaluatedAt: new Date().toISOString()
    };
  }, [selectedUser, selectedAsset, totalRisk, timeRiskScore, deviceTrust, locationRisk, patternAnomaly]);

  const handleCommitEvaluation = () => {
    addTransaction({
      type: 'PolicyEvaluated',
      initiatorDid: selectedUser.did,
      initiatorName: selectedUser.name,
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      status: evaluation.decision === 'ALLOW' ? 'COMMITTED' : evaluation.decision === 'STEP_UP_MFA' ? 'SILENT_FLAGGED' : 'REVERTED',
      details: `[XAI Engine] Evaluated ${requestedAction} request for ${selectedAsset.name}. Decision: ${evaluation.decision} (Risk: ${totalRisk.toFixed(2)}). ${evaluation.policyClause}`,
      complianceTags: ['ISO 27001 A.9', 'DPDP 2023 Sec 8(4)']
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Explainable AI (XAI) Access Control & Risk Engine</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              RBAC + ABAC + Risk
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            SIH Innovations #1 & #2: Real-time contextual risk scoring combined with smart-contract policy validation. 
            Every decision provides an explainable cryptographic reason chain ("Why?").
          </p>
        </div>

        <button
          onClick={() => setShowWhyModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-indigo-300" />
          <span>Explain Decision ("Why?")</span>
        </button>
      </div>

      {/* Dynamic Request Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Selectors */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300">
            1. Access Request Parameters
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Requesting Subject Persona</label>
            <select
              value={selectedUserKey}
              onChange={e => setSelectedUserKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              {Object.entries(USER_PERSONAS).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name} ({u.clearanceLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Digital Asset</label>
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
            <label className="text-xs text-slate-400 block mb-1">Requested Operation</label>
            <div className="grid grid-cols-3 gap-2">
              {(['READ', 'TRANSFER', 'AUDIT'] as const).map(act => (
                <button
                  key={act}
                  onClick={() => setRequestedAction(act)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    requestedAction === act
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 space-y-1 text-[11px] font-mono">
            <div className="text-slate-400">Caller DID:</div>
            <div className="text-emerald-400 truncate">{selectedUser.did}</div>
          </div>
        </div>

        {/* Center Column: Contextual Risk Sliders */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300">
            2. Dynamic Context Risk Sliders
          </h3>

          {/* Time Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Time of Access: {timeHour}:00 hrs</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {timeRiskScore <= 0.2 ? 'Business Hours (Low)' : timeRiskScore <= 0.5 ? 'Evening' : 'Graveyard (High)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={timeHour}
              onChange={e => setTimeHour(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Device Trust Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span>Device Trust Level</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {deviceTrust < 0.3 ? 'Managed Laptop' : deviceTrust < 0.7 ? 'BYOD Laptop' : 'Rooted / Unknown'}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={deviceTrust}
              onChange={e => setDeviceTrust(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* IP / Location Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Network Location Risk</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {locationRisk < 0.3 ? 'HQ Intranet' : locationRisk < 0.7 ? 'Domestic ISP' : 'Tor / Foreign Proxy'}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={locationRisk}
              onChange={e => setLocationRisk(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Pattern Anomaly Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Behavioral Spike Index</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {patternAnomaly < 0.4 ? 'Normal Rhythm' : 'High Frequency Burst'}
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={patternAnomaly}
              onChange={e => setPatternAnomaly(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-[10px] font-mono text-slate-400">
            Formula: Risk = 0.35(Time) + 0.25(Device) + 0.25(Loc) + 0.15(Pattern)
          </div>
        </div>

        {/* Right Column: Live Decision Outcome */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300 mb-3">
              3. Policy Consensus Outcome
            </h3>

            {/* Risk Gauge Bar */}
            <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Calculated Context Risk</span>
                <span className="font-mono font-bold text-base text-white">
                  {(totalRisk * 100).toFixed(0)}%
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    totalRisk < 0.35
                      ? 'bg-emerald-400'
                      : totalRisk < 0.65
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${totalRisk * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <span>0.00 (Low)</span>
                <span>0.35 (MFA)</span>
                <span>0.65 (Deny)</span>
                <span>1.00</span>
              </div>
            </div>

            {/* Verdict Box */}
            <div className={`mt-3 p-4 rounded-xl border text-center space-y-1.5 ${
              evaluation.decision === 'ALLOW'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : evaluation.decision === 'STEP_UP_MFA'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider">
                {evaluation.decision === 'ALLOW' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {evaluation.decision === 'STEP_UP_MFA' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {evaluation.decision === 'DENY' && <XCircle className="w-4 h-4 text-red-400" />}
                <span>DECISION: {evaluation.decision}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90 font-mono">
                {evaluation.policyClause}
              </p>
            </div>
          </div>

          {/* Commit to Ledger Button */}
          <button
            onClick={handleCommitEvaluation}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Commit Evaluation Event to Ledger</span>
          </button>
        </div>
      </div>

      {/* Visual Reasoning Node Chain (The "Why?" Inspector) */}
      <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Explainable Reasoning Graph (Node Chain Trace)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Execution ID: eval_{Date.now().toString().slice(-6)}
          </span>
        </div>

        {/* Node Chain visual cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Node 1: Subject */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-1 relative">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Node 1 · Subject</span>
            <div className="text-xs font-semibold text-slate-200">{selectedUser.name}</div>
            <div className="text-[10px] text-emerald-400 font-mono">{selectedUser.clearanceLevel}</div>
          </div>

          {/* Node 2: Context */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-1 relative">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Node 2 · Context Risk</span>
            <div className="text-xs font-semibold text-slate-200">Risk Factor: {(totalRisk * 100).toFixed(0)}%</div>
            <div className="text-[10px] text-indigo-400 font-mono">Time: {timeHour}:00 · Dev: {deviceTrust}</div>
          </div>

          {/* Node 3: Policy Rule */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-1 relative">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Node 3 · Policy Gate</span>
            <div className="text-xs font-semibold text-slate-200">{evaluation.policyId}</div>
            <div className="text-[10px] text-cyan-400 font-mono">Classification: {selectedAsset.classification}</div>
          </div>

          {/* Node 4: Decision */}
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            evaluation.decision === 'ALLOW'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : evaluation.decision === 'STEP_UP_MFA'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            <span className="text-[10px] font-mono opacity-80 uppercase">Node 4 · Verdict</span>
            <div className="text-xs font-bold uppercase">{evaluation.decision}</div>
            <div className="text-[10px] font-mono opacity-80">Anchored in Next Block</div>
          </div>
        </div>
      </div>

      {/* "Why?" Deep Explanation Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Explainable AI Reason Citation ("Why?")</span>
              </h3>
              <button
                onClick={() => setShowWhyModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 font-mono mb-1">
                  Evaluated Policy Clause:
                </div>
                <p className="leading-relaxed text-slate-200">
                  {evaluation.policyClause}
                </p>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-[#070A12] p-3 rounded-xl border border-slate-800">
                <div className="text-white font-semibold mb-1">Audit Trace Execution Pipeline:</div>
                {evaluation.reasoningPath.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-indigo-400">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Acknowledge Reasoning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
