import React, { useState } from 'react';
import { 
  Swords, 
  ShieldCheck, 
  Terminal, 
  Play, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Zap,
  Cpu,
  Layers
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';

export const RedTeamSimulatorTab: React.FC = () => {
  const { executeAttackSimulation, attackLogs, setActiveTab } = useBlockshield();
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const handleRunAttack = (type: 'NONCE_REPLAY' | 'PRIVILEGE_ESCALATION' | 'OFFCHAIN_TAMPER') => {
    setActiveSimulation(type);
    setTimeout(() => {
      executeAttackSimulation(type);
      setActiveSimulation(null);
    }, 700);
  };

  const handleRunAll = async () => {
    handleRunAttack('NONCE_REPLAY');
    setTimeout(() => handleRunAttack('PRIVILEGE_ESCALATION'), 1200);
    setTimeout(() => handleRunAttack('OFFCHAIN_TAMPER'), 2400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-panel border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            <span>Red-Team Adversarial Attack Sandbox</span>
            <span className="text-xs font-mono text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded">
              SIH Innovation #12 · 90-Second Hook
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate live adversary vectors against BLOCKSHIELD's smart contracts, cryptographic hash oracles, 
            and zero-trust policy engine. Watch real-time consensus defense execution.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={activeSimulation !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-500/30 transition-all cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Run All 3 Attacks Sequentially</span>
        </button>
      </div>

      {/* 3 Attack Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attack 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Vector 01
              </span>
              <span className="text-xs font-mono text-slate-500">Replay Attack</span>
            </div>
            <h4 className="text-sm font-bold text-white">Nonce / Token Replay</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adversary captures a previously signed authorization token from memory and replays it to siphon assets.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Target Nonce:</span> 0x4F92A
              <br />
              <span className="text-emerald-400">Defense:</span> State Nonce Validator
            </div>

            <button
              onClick={() => handleRunAttack('NONCE_REPLAY')}
              disabled={activeSimulation !== null}
              className="w-full py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Nonce Replay</span>
            </button>
          </div>
        </div>

        {/* Attack 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Vector 02
              </span>
              <span className="text-xs font-mono text-slate-500">ABAC Escalation</span>
            </div>
            <h4 className="text-sm font-bold text-white">Privilege Escalation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Junior field engineer (Rohan Mehta, Tier-1) attempts forged contract call to read Top Secret Defence specifications.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Target:</span> Defence_Procurement_Spec
              <br />
              <span className="text-emerald-400">Defense:</span> Smart Contract ABAC Tier Gate
            </div>

            <button
              onClick={() => handleRunAttack('PRIVILEGE_ESCALATION')}
              disabled={activeSimulation !== null}
              className="w-full py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Escalation</span>
            </button>
          </div>
        </div>

        {/* Attack 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Vector 03
              </span>
              <span className="text-xs font-mono text-slate-500">Off-Chain Tampering</span>
            </div>
            <h4 className="text-sm font-bold text-white">Off-Chain IPFS Tamper</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compromised IPFS peer alters bytes inside the off-chain encrypted file. Hash oracle detects collision mismatch.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Target:</span> IPFS Storage Node #4
              <br />
              <span className="text-emerald-400">Defense:</span> SHA-256 On-Chain Anchor
            </div>

            <button
              onClick={() => handleRunAttack('OFFCHAIN_TAMPER')}
              disabled={activeSimulation !== null}
              className="w-full py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Tampering</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Scrolling Cyber-Defense Terminal */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200">
              BLOCKSHIELD_DEFENSE_DAEMON_v2.6 // CONSENSUS_AUDIT_LOGS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE MONITORING
          </span>
        </div>

        <div className="p-5 bg-black/90 font-mono text-xs text-slate-300 space-y-3 min-h-[300px] max-h-[460px] overflow-y-auto">
          {attackLogs.length === 0 ? (
            <div className="text-slate-500 space-y-1">
              <div>[SYSTEM READY] Listening for simulated adversarial intrusions on channel ch-national-registry...</div>
              <div>[INFO] Monotonic sequence counter: OK. SHA-256 Hash Oracle: OK. ABAC Gates: ARMED.</div>
              <div>[HINT] Click any "Launch Attack" button above to witness cryptographic neutralization in real-time.</div>
            </div>
          ) : (
            attackLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="text-red-400 font-bold">
                    [{new Date(log.timestamp).toLocaleTimeString()}] INTRUSION ATTEMPT: {log.attackType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/30">
                    {log.status}
                  </span>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-500">Attacker Identity:</span>{' '}
                  <span className="text-amber-300">{log.attackerDid}</span>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-500">Target Resource:</span>{' '}
                  <span>{log.targetResource}</span>
                </div>

                <div className="bg-black/60 p-2 rounded text-[11px] text-slate-400 overflow-x-auto border border-white/5">
                  <span className="text-slate-500">Payload:</span> {log.rawPayload}
                </div>

                <div className="text-emerald-400">
                  <span className="text-slate-500">Active Defense:</span> {log.defenseMechanism}
                </div>

                <div className="text-red-300 font-bold">
                  ➔ {log.contractResponse}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
