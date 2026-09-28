import React, { useState, useEffect } from 'react';
import { 
  X, 
  Fingerprint, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  RefreshCw, 
  CheckCircle2, 
  Key, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useBlockshield } from '../context/BlockshieldContext';
import { formatTruncated, generateSvgQrMatrix } from '../utils/crypto';
import confetti from 'canvas-confetti';

interface MobileWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileWalletModal: React.FC<MobileWalletModalProps> = ({ isOpen, onClose }) => {
  const { currentPersona } = useBlockshield();
  const [totpCode, setTotpCode] = useState('849 201');
  const [secondsRemaining, setSecondsRemaining] = useState(24);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'id' | 'totp' | 'auth'>('id');

  // Rotate TOTP periodically
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Generate new 6 digit code
          const newCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
          setTotpCode(newCode);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      setIsUnlocked(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 900);
  };

  const didQrSvg = generateSvgQrMatrix(currentPersona.did, 140);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm">
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Smartphone Hardware Frame */}
        <div className="w-full bg-[#0A0D14] rounded-[42px] border-4 border-slate-700 shadow-2xl overflow-hidden p-3 relative">
          {/* Top Speaker & Camera Notch */}
          <div className="w-28 h-5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            <div className="w-10 h-1.5 rounded-full bg-slate-800"></div>
          </div>

          {/* Screen Content */}
          <div className="bg-[#070A12] rounded-[32px] border border-white/5 p-4 min-h-[580px] flex flex-col justify-between text-slate-200">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>09:41</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>FIPS-140 HSM</span>
              </div>
            </div>

            {/* Wallet Header */}
            <div className="text-center mt-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-medium font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>BLOCKSHIELD WALLET</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{currentPersona.name}</h4>
              <p className="text-[11px] text-slate-400 font-mono">{currentPersona.roleTitle}</p>
            </div>

            {/* Sub-Nav Pill Controls inside Smartphone */}
            <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-medium mb-3">
              <button
                onClick={() => setActiveTab('id')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'id' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ID Card
              </button>
              <button
                onClick={() => setActiveTab('totp')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'totp' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TOTP MFA
              </button>
              <button
                onClick={() => setActiveTab('auth')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'auth' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Biometrics
              </button>
            </div>

            {/* Active Sub-Tab View */}
            <div className="flex-1 flex flex-col justify-center">
              {activeTab === 'id' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-indigo-500/20 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400">
                      Verifiable Credential
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {currentPersona.clearanceLevel}
                    </span>
                  </div>

                  <div className="flex justify-center py-2">
                    <div 
                      className="p-2 bg-white text-slate-900 rounded-xl shadow-lg"
                      dangerouslySetInnerHTML={{ __html: didQrSvg }}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">W3C Decentralized Identifier</div>
                    <div className="text-[11px] font-mono text-slate-200 break-all select-all bg-black/40 p-1.5 rounded border border-white/5">
                      {currentPersona.did}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'totp' && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
                  <div className="text-xs text-slate-400 font-medium">Rotating Time-based One-Time Token</div>
                  
                  <div className="text-3xl font-mono font-bold tracking-wider text-emerald-400 bg-black/50 py-3 rounded-xl border border-emerald-500/30">
                    {totpCode}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Regenerates in {secondsRemaining}s</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'auth' && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
                  <div className="text-xs text-slate-300 font-medium">
                    WebAuthn FIDO2 Biometric Sensor
                  </div>

                  <button
                    onClick={handleBiometricAuth}
                    disabled={isBiometricScanning}
                    className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400'
                        : isBiometricScanning
                        ? 'bg-indigo-500/20 border-2 border-indigo-400 text-indigo-400 animate-pulse'
                        : 'bg-slate-800 border-2 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-12 h-12" />
                    ) : (
                      <Fingerprint className="w-12 h-12" />
                    )}
                  </button>

                  <div className="text-xs font-mono text-slate-400">
                    {isUnlocked
                      ? 'Secure Enclave Biometrics Authenticated'
                      : isBiometricScanning
                      ? 'Scanning Hardware Biometrics...'
                      : 'Tap fingerprint sensor to authorize session'}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Safe Indicator */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Encrypted on Secure Enclave</span>
              <span>v2.6.1-SIH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
