import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  PhoneCall,
  Eye,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';

export const DuressModeTab: React.FC = () => {
  const { 
    currentPersona, 
    duressAlerts, 
    triggerDuressDecoy, 
    acknowledgeDuressAlert,
    switchPersona 
  } = useBlockshield();

  const [enteredPin, setEnteredPin] = useState('');
  const [decoySuccessModal, setDecoySuccessModal] = useState(false);
  const [isAudioSimulating, setIsAudioSimulating] = useState(true);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === '9999') {
      triggerDuressDecoy('9999', 'National_Critical_Power_Grid_Topology.enc');
      setDecoySuccessModal(true);
      setEnteredPin('');
    } else {
      // Normal transaction simulation
      alert(`Normal PIN verified for ${currentPersona.name}. Standard operation executed.`);
      setEnteredPin('');
    }
  };

  const activeAlerts = duressAlerts.filter(a => a.status === 'SILENT_ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Coercion Defense & Silent Duress Protocol</span>
            <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded animate-pulse">
              Decoy PIN 9999
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            SIH Innovation #4 (Social Impact): When personnel are held under physical extortion, entering decoy PIN 9999 
            renders a completely genuine success confirmation to satisfy the attacker, while neutralizing the real transfer 
            and silently broadcasting GPS and audio telemetry to the isolated DuressRegistry.
          </p>
        </div>

        {activeAlerts.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950 border border-red-500/50 text-red-300 text-xs font-mono animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>{activeAlerts.length} SILENT ALARM(S) ACTIVE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Coercion PIN Sandbox */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Simulated Authorization Keypad</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Test normal PIN (<span className="text-slate-200 font-mono font-bold">1234</span>) vs. Coercion Duress PIN (<span className="text-red-400 font-mono font-bold">9999</span>).
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300 font-medium">
                Authorization Target: Transfer 5,000,000 INR from State Reserve to Emergency SCADA Node
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Enter Security PIN:</label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={enteredPin}
                    onChange={e => setEnteredPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-xl tracking-widest font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <button
                  type="button"
                  onClick={() => setEnteredPin('1234')}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                >
                  Fill Normal PIN (1234)
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredPin('9999')}
                  className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/60 cursor-pointer font-bold"
                >
                  Fill Coercion PIN (9999)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={enteredPin.length < 4}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                enteredPin.length < 4
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              Authorize Transaction
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <strong>Security Architecture:</strong> The decoy transaction generates a legitimate-looking client-side cryptographic receipt with faux block hashes so physical attackers have zero suspicion.
          </div>
        </div>

        {/* Right: National Auditor Silent Alarm Command Console */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Isolated DuressRegistry Surveillance</span>
            </h3>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded">
              Auditor Clearance Only
            </span>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="p-8 text-center space-y-2 bg-[#070A12] rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">
                All Enterprise Nodes Nominal
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                No active physical duress or coercion alarms detected on channel ch-national-registry.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" />
                      <span>COERCION BEACON EMITTED</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-slate-400">Compromised User:</span>{' '}
                      <strong className="text-white">{alert.userName}</strong>
                    </div>
                    <div className="font-mono text-[11px] text-slate-400 truncate">
                      DID: {alert.userDid}
                    </div>
                  </div>

                  {/* Simulated Geo Coordinates */}
                  <div className="p-3 rounded-lg bg-[#070A12] border border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Geo-Location Beacon:</span>
                    </div>
                    <div className="text-slate-200">
                      {alert.simulatedGeo.locationName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Coordinates: Lat {alert.simulatedGeo.lat.toFixed(4)}° N, Lon {alert.simulatedGeo.lng.toFixed(4)}° E
                    </div>
                  </div>

                  {/* Audio Beacon simulator */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-red-500/30 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2 text-red-300">
                      <Volume2 className="w-4 h-4 animate-pulse text-red-400" />
                      <span>Silent Ambient Mic Telemetry Active (256kbps AES)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">STREAMING</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => acknowledgeDuressAlert(alert.id)}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Dispatch Quick Reaction Force & Neutralize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 font-mono">
            <strong>Judges Note:</strong> The DuressRegistry namespace is isolated so compromised participants cannot query or cancel duress events.
          </div>
        </div>
      </div>

      {/* Attacker Decoy Success Modal */}
      {decoySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B1120] border-2 border-emerald-500/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Transfer Successful</h3>
              <p className="text-xs text-slate-300 font-mono">
                Asset & INR 5,000,000 Disbursement Authorized
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-xs space-y-1 text-slate-400">
              <div>Transaction ID: <span className="text-emerald-400">0x89c4...20194a</span></div>
              <div>Block Anchored: <span className="text-white">#489320</span></div>
              <div>Status: <span className="text-emerald-400 font-bold">COMMITTED</span></div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-[11px] font-mono text-red-200 text-left">
              <strong>Judge Behind-The-Scenes Insight:</strong> The attacker sees the green success message above, but the real ledger transfer was intercepted. The silent duress alarm is currently ringing in the Auditor dashboard!
            </div>

            <button
              onClick={() => setDecoySuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Decoy Confirmation Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
