import React from 'react';
import { BlockshieldProvider, useBlockshield } from './context/BlockshieldContext';
import { HeaderHUD } from './components/HeaderHUD';
import { GuidedTourBanner } from './components/GuidedTourBanner';
import { TransactionModal } from './components/TransactionModal';
import { MobileWalletModal } from './components/MobileWalletModal';

// Tab Views
import { CommandCenterTab } from './components/tabs/CommandCenterTab';
import { IdentityZkTab } from './components/tabs/IdentityZkTab';
import { AssetVaultTab } from './components/tabs/AssetVaultTab';
import { PolicyEngineTab } from './components/tabs/PolicyEngineTab';
import { MultiSigTransferTab } from './components/tabs/MultiSigTransferTab';
import { DuressModeTab } from './components/tabs/DuressModeTab';
import { RedTeamSimulatorTab } from './components/tabs/RedTeamSimulatorTab';
import { ComplianceAuditTab } from './components/tabs/ComplianceAuditTab';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    inspectingTx, 
    setInspectingTx, 
    isWalletModalOpen, 
    setIsWalletModalOpen 
  } = useBlockshield();

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col bg-grid-pattern relative selection:bg-emerald-500/30 selection:text-emerald-200 pb-28">
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Top Navigation HUD */}
      <HeaderHUD />

      {/* Main Viewport */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 py-6">
        {activeTab === 'command-center' && <CommandCenterTab />}
        {activeTab === 'identity-zk' && <IdentityZkTab />}
        {activeTab === 'asset-vault' && <AssetVaultTab />}
        {activeTab === 'policy-engine' && <PolicyEngineTab />}
        {activeTab === 'multisig-transfer' && <MultiSigTransferTab />}
        {activeTab === 'duress-mode' && <DuressModeTab />}
        {activeTab === 'redteam-simulator' && <RedTeamSimulatorTab />}
        {activeTab === 'compliance-audit' && <ComplianceAuditTab />}
      </main>

      {/* Guided Tour Banner (12-Minute SIH Demo Script) */}
      <GuidedTourBanner />

      {/* Cryptographic Transaction Inspector Modal */}
      <TransactionModal
        tx={inspectingTx}
        onClose={() => setInspectingTx(null)}
      />

      {/* Companion Mobile Wallet Modal */}
      <MobileWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BlockshieldProvider>
      <AppContent />
    </BlockshieldProvider>
  );
}
