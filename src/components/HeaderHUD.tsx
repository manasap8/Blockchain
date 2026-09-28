import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Swords, 
  ChevronDown, 
  UserCheck, 
  Radio, 
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useBlockshield } from '../context/BlockshieldContext';
import { USER_PERSONAS } from '../data/initialData';

export const HeaderHUD: React.FC = () => {
  const { 
    currentPersona, 
    currentRoleId, 
    switchPersona, 
    activeTab, 
    setActiveTab, 
    isOffline, 
    toggleOffline, 
    blockHeight, 
    setIsWalletModalOpen,
    duressAlerts,
    resetAllState
  } = useBlockshield();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'command-center', label: 'Command Center' },
    { id: 'identity-zk', label: 'Identity & ZK' },
    { id: 'asset-vault', label: 'Asset Vault' },
    { id: 'policy-engine', label: 'Access & Risk' },
    { id: 'multisig-transfer', label: 'Multi-Sig Flow' },
    { id: 'duress-mode', label: 'Duress Defense' },
    { id: 'redteam-simulator', label: 'Red-Team Sandbox' },
    { id: 'compliance-audit', label: 'Audit & DPDP' },
  ];

  const activeDuressCount = duressAlerts.filter(a => a.status === 'SILENT_ACTIVE').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070A12]/90 backdrop-blur-xl">
      {/* Top Banner for SIH 2026 & Team Context */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-950/60 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SIH 2026 FINALS
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">Team CureCoders (ID: 163939)</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Problem Statement 26125 (Ministry / Govt. of India)</span>
        </div>

        <div className="flex items-center gap-4">
          {activeDuressCount > 0 && (
            <button
              onClick={() => setActiveTab('duress-mode')}
              className="flex items-center gap-1.5 text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded text-[11px] font-mono animate-pulse hover:bg-red-900/60 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DURESS BEACON ACTIVE ({activeDuressCount})</span>
            </button>
          )}

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Radio className={`w-3.5 h-3.5 ${isOffline ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>Hyperledger Fabric</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">ch-national-registry</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">Block #{blockHeight}</span>
          </div>

          <button
            onClick={resetAllState}
            title="Reset to clean baseline data"
            className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation HUD */}
      <div className="max-w-[1560px] mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <a href="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>BLOCKSHIELD</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                PROTOTYPE
              </span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs (8 Dedicated Modules) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 shadow-sm border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone: Role Switcher, Offline Mode, Red-Team Simulator, Mobile Wallet */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Offline Mode Toggle */}
          <button
            onClick={toggleOffline}
            title={isOffline ? 'Offline Edge Verifier Active' : 'Connected to National Registry'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              isOffline
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isOffline ? 'Edge Offline' : 'Online'}</span>
          </button>

          {/* Red-Team Attack Simulator Button */}
          <button
            onClick={() => setActiveTab('redteam-simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === 'redteam-simulator'
                ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-500/30'
                : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/50'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Red-Team Attack</span>
          </button>

          {/* Mobile Companion Wallet Button */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/60 text-indigo-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Open Mobile Companion Wallet Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">Mobile Wallet</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 border border-slate-700/70 hover:border-slate-500 text-slate-200 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px]">
                {currentPersona.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-slate-100 font-semibold leading-none">{currentPersona.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">{currentPersona.clearanceLevel}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Switch Active Persona (DID)
                </div>
                {Object.values(USER_PERSONAS).map(persona => {
                  const isSelected = currentRoleId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        switchPersona(persona.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{persona.name}</div>
                        <div className="text-[10px] text-slate-400">{persona.roleTitle}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{persona.clearanceLevel}</div>
                      </div>
                      {isSelected && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer row if on narrow screens */}
      <div className="lg:hidden border-t border-white/5 px-2 py-1.5 overflow-x-auto flex items-center gap-1 bg-[#0A0F1D]/80">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === item.id ? 'bg-slate-800 text-emerald-300 font-medium' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
