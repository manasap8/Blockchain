import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserPersona, 
  DigitalAsset, 
  LedgerTransaction, 
  TransferRequest, 
  DuressAlert, 
  AttackSimulationLog 
} from '../types';
import { 
  USER_PERSONAS, 
  INITIAL_ASSETS, 
  INITIAL_LEDGER_TRANSACTIONS 
} from '../data/initialData';
import { computeMerkleRoot, generateRandomHex } from '../utils/crypto';

interface BlockshieldContextType {
  currentPersona: UserPersona;
  currentRoleId: string;
  switchPersona: (roleId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  toggleOffline: () => void;
  blockHeight: number;
  assets: DigitalAsset[];
  tamperedAssetId: string | null;
  addAsset: (asset: DigitalAsset) => void;
  tamperAsset: (assetId: string) => void;
  restoreAsset: (assetId: string) => void;
  transactions: LedgerTransaction[];
  addTransaction: (tx: {
    type: LedgerTransaction['type'];
    initiatorDid: string;
    initiatorName: string;
    assetId?: string;
    assetName?: string;
    status: LedgerTransaction['status'];
    gasSavedPercent?: number;
    details: string;
    complianceTags: string[];
  }) => LedgerTransaction;
  inspectingTx: LedgerTransaction | null;
  setInspectingTx: (tx: LedgerTransaction | null) => void;
  transferRequests: TransferRequest[];
  createTransferRequest: (req: {
    assetId: string;
    assetName: string;
    toDid: string;
    toName: string;
    amountOrValue: string;
  }) => TransferRequest;
  signTransferRequest: (requestId: string) => void;
  duressAlerts: DuressAlert[];
  triggerDuressDecoy: (pin: string, attemptedAsset: string) => { isDecoy: boolean };
  acknowledgeDuressAlert: (alertId: string) => void;
  attackLogs: AttackSimulationLog[];
  executeAttackSimulation: (type: 'NONCE_REPLAY' | 'PRIVILEGE_ESCALATION' | 'OFFCHAIN_TAMPER') => AttackSimulationLog;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  activeDemoStep: number;
  setDemoStep: (step: number) => void;
  resetAllState: () => void;
}

const BlockshieldContext = createContext<BlockshieldContextType | null>(null);

const STORAGE_KEYS = {
  PERSONA: 'blockshield_persona_id',
  ASSETS: 'blockshield_assets_v2',
  TXS: 'blockshield_txs_v2',
  TRANSFERS: 'blockshield_transfers_v2',
  DURESS: 'blockshield_duress_v2',
  ATTACK_LOGS: 'blockshield_attack_logs_v2',
  BLOCK_HEIGHT: 'blockshield_block_height_v2',
  DEMO_STEP: 'blockshield_demo_step_v2',
};

export const BlockshieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoleId, setCurrentRoleId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PERSONA) || 'ciso';
  });

  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [inspectingTx, setInspectingTx] = useState<LedgerTransaction | null>(null);

  const [blockHeight, setBlockHeight] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOCK_HEIGHT);
    return saved ? parseInt(saved, 10) : 489316;
  });

  const [activeDemoStep, setActiveDemoStep] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMO_STEP);
    return saved ? parseInt(saved, 10) : 1;
  });

  const [assets, setAssets] = useState<DigitalAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ASSETS;
  });

  const [tamperedAssetId, setTamperedAssetId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TXS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEDGER_TRANSACTIONS;
  });

  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'req-001',
        assetId: 'asset-grid-01',
        assetName: 'National_Critical_Power_Grid_Topology.enc',
        fromDid: USER_PERSONAS.ciso.did,
        fromName: USER_PERSONAS.ciso.name,
        toDid: USER_PERSONAS.operations.did,
        toName: USER_PERSONAS.operations.name,
        amountOrValue: 'Grid Substation SCADA Encryption Keys (Batch 4)',
        status: 'PENDING_SIG_2',
        requiredSignatures: 2,
        signaturesCollected: [
          {
            signerDid: USER_PERSONAS.ciso.did,
            signerName: USER_PERSONAS.ciso.name,
            signedAt: '2026-09-27T14:10:00Z',
            role: 'Enterprise CISO'
          }
        ],
        initiatedAt: '2026-09-27T14:05:00Z'
      }
    ];
  });

  const [duressAlerts, setDuressAlerts] = useState<DuressAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DURESS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [attackLogs, setAttackLogs] = useState<AttackSimulationLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTACK_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Increment block height periodically to simulate active Hyperledger Fabric consensus
  useEffect(() => {
    if (isOffline) return;
    const interval = setInterval(() => {
      setBlockHeight(prev => {
        const next = prev + 1;
        localStorage.setItem(STORAGE_KEYS.BLOCK_HEIGHT, next.toString());
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isOffline]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONA, currentRoleId);
  }, [currentRoleId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transferRequests));
  }, [transferRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DURESS, JSON.stringify(duressAlerts));
  }, [duressAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTACK_LOGS, JSON.stringify(attackLogs));
  }, [attackLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_STEP, activeDemoStep.toString());
  }, [activeDemoStep]);

  const currentPersona = USER_PERSONAS[currentRoleId] || USER_PERSONAS.ciso;

  const switchPersona = (roleId: string) => {
    if (USER_PERSONAS[roleId]) {
      setCurrentRoleId(roleId);
    }
  };

  const toggleOffline = () => {
    setIsOffline(prev => !prev);
  };

  const addAsset = (asset: DigitalAsset) => {
    setAssets(prev => [asset, ...prev]);
    addTransaction({
      type: 'AssetRegistered',
      initiatorDid: currentPersona.did,
      initiatorName: currentPersona.name,
      assetId: asset.id,
      assetName: asset.name,
      status: 'COMMITTED',
      gasSavedPercent: 86,
      details: `Asset anchored on-chain with IPFS CID ${asset.ipfsCid} and SHA-256 digest ${asset.sha256Hash.slice(0, 18)}...`,
      complianceTags: ['DPDP 2023 Sec 8(4)', 'ISO 27001 A.10']
    });
  };

  const tamperAsset = (assetId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        // Corrupt 1 hex byte in the hash
        const corrupted = a.sha256Hash.slice(0, 10) + 'bad0' + a.sha256Hash.slice(14);
        return {
          ...a,
          sha256Hash: corrupted,
          isTampered: true
        };
      }
      return a;
    }));
    setTamperedAssetId(assetId);

    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      addTransaction({
        type: 'TamperDetected',
        initiatorDid: currentPersona.did,
        initiatorName: currentPersona.name,
        assetId: asset.id,
        assetName: asset.name,
        status: 'REVERTED',
        details: `INTEGRITY VIOLATION DETECTED: Asset ${asset.name} SHA-256 oracle mismatch. Off-chain payload altered. Asset quarantined immediately.`,
        complianceTags: ['IT Act Sec 43A', 'DPDP 2023 Sec 8(5)']
      });
    }
  };

  const restoreAsset = (assetId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          sha256Hash: a.originalHash,
          isTampered: false
        };
      }
      return a;
    }));
    if (tamperedAssetId === assetId) {
      setTamperedAssetId(null);
    }
  };

  const addTransaction = (tx: {
    type: LedgerTransaction['type'];
    initiatorDid: string;
    initiatorName: string;
    assetId?: string;
    assetName?: string;
    status: LedgerTransaction['status'];
    gasSavedPercent?: number;
    details: string;
    complianceTags: string[];
  }): LedgerTransaction => {
    const txHash = generateRandomHex(32);
    const signature = generateRandomHex(20);
    const newBlock = blockHeight + 1;
    setBlockHeight(newBlock);

    const allHashes = [txHash, ...transactions.map(t => t.txHash)];
    const merkleRoot = computeMerkleRoot(allHashes);

    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: newBlock,
      timestamp: new Date().toISOString(),
      type: tx.type,
      initiatorDid: tx.initiatorDid,
      initiatorName: tx.initiatorName,
      assetId: tx.assetId,
      assetName: tx.assetName,
      status: tx.status,
      gasSavedPercent: tx.gasSavedPercent || 85,
      merkleRoot,
      signature,
      details: tx.details,
      complianceTags: tx.complianceTags
    };

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const createTransferRequest = (req: {
    assetId: string;
    assetName: string;
    toDid: string;
    toName: string;
    amountOrValue: string;
  }): TransferRequest => {
    const newReq: TransferRequest = {
      id: `req-${Date.now()}`,
      assetId: req.assetId,
      assetName: req.assetName,
      fromDid: currentPersona.did,
      fromName: currentPersona.name,
      toDid: req.toDid,
      toName: req.toName,
      amountOrValue: req.amountOrValue,
      status: 'PENDING_SIG_2',
      requiredSignatures: 2,
      signaturesCollected: [
        {
          signerDid: currentPersona.did,
          signerName: currentPersona.name,
          signedAt: new Date().toISOString(),
          role: currentPersona.roleTitle
        }
      ],
      initiatedAt: new Date().toISOString()
    };

    setTransferRequests(prev => [newReq, ...prev]);

    addTransaction({
      type: 'MultiSigApproval',
      initiatorDid: currentPersona.did,
      initiatorName: currentPersona.name,
      assetId: req.assetId,
      assetName: req.assetName,
      status: 'COMMITTED',
      details: `Dual-Signature Transfer Initiated (Signature 1/2 provided by ${currentPersona.name}). Awaiting Tier-3 Auditor signature.`,
      complianceTags: ['ISO 27001 A.9', 'Segregation of Duties']
    });

    return newReq;
  };

  const signTransferRequest = (requestId: string) => {
    setTransferRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const alreadySigned = req.signaturesCollected.some(s => s.signerDid === currentPersona.did);
        if (alreadySigned) return req;

        const updatedSigs = [
          ...req.signaturesCollected,
          {
            signerDid: currentPersona.did,
            signerName: currentPersona.name,
            signedAt: new Date().toISOString(),
            role: currentPersona.roleTitle
          }
        ];

        const isFullySigned = updatedSigs.length >= req.requiredSignatures;

        addTransaction({
          type: 'OwnershipTransfer',
          initiatorDid: currentPersona.did,
          initiatorName: currentPersona.name,
          assetId: req.assetId,
          assetName: req.assetName,
          status: 'COMMITTED',
          details: `Dual-Signature Transfer Approved (Signature ${updatedSigs.length}/${req.requiredSignatures} signed by ${currentPersona.name}). Asset transfer executed on-chain.`,
          complianceTags: ['ISO 27001 A.9', 'Statutory Audit Trail']
        });

        return {
          ...req,
          signaturesCollected: updatedSigs,
          status: isFullySigned ? 'COMPLETED' : 'PENDING_SIG_2'
        };
      }
      return req;
    }));
  };

  const triggerDuressDecoy = (pin: string, attemptedAsset: string) => {
    const isDecoy = pin === '9999';

    if (isDecoy) {
      // Create isolated duress alert
      const newAlert: DuressAlert = {
        id: `duress-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userDid: currentPersona.did,
        userName: currentPersona.name,
        simulatedGeo: {
          lat: 28.6139,
          lng: 77.2090,
          locationName: 'North Block, Central Secretariat, New Delhi, India'
        },
        attemptedAsset,
        decoyPinEntered: '9999',
        status: 'SILENT_ACTIVE',
        audioBeaconSimulated: true
      };

      setDuressAlerts(prev => [newAlert, ...prev]);

      // Emit transaction exclusively to isolated DuressRegistry
      addTransaction({
        type: 'DuressAlert',
        initiatorDid: currentPersona.did,
        initiatorName: currentPersona.name,
        status: 'SILENT_FLAGGED',
        details: `[ISOLATED NAMESPACE: DuressRegistry] Silent emergency beacon emitted. Coercion PIN 9999 used by ${currentPersona.name}. Fake transaction rendered to attacker; real transfer neutralized.`,
        complianceTags: ['IT Act Sec 66C', 'Physical Coercion Defense']
      });

      return { isDecoy: true };
    }

    return { isDecoy: false };
  };

  const acknowledgeDuressAlert = (alertId: string) => {
    setDuressAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'CONTAINED' } : a));
  };

  const executeAttackSimulation = (type: 'NONCE_REPLAY' | 'PRIVILEGE_ESCALATION' | 'OFFCHAIN_TAMPER'): AttackSimulationLog => {
    let log: AttackSimulationLog;

    if (type === 'NONCE_REPLAY') {
      log = {
        id: `atk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        attackType: 'NONCE_REPLAY',
        attackerDid: 'did:blockshield:eth:0xMaliciousAgent4891b0129a00',
        targetResource: 'Contract Endpoint: /transferFundsAndAsset',
        rawPayload: '{"nonce": "0x4F92A", "amount": 1000000, "signature": "0x89ab...validExpired"}',
        defenseMechanism: 'Hyperledger State Nonce Validator & Merkle Monotonic Sequence Guard',
        contractResponse: 'FATAL: Revert opcode 0xFD. Nonce 0x4F92A already permanently marked as consumed in block 489290.',
        status: 'BLOCKED'
      };
      addTransaction({
        type: 'PolicyEvaluated',
        initiatorDid: log.attackerDid,
        initiatorName: 'Malicious Replay Node',
        status: 'REVERTED',
        details: 'REPLAY ATTACK THWARTED: Duplicate nonce 0x4F92A rejected by consensus layer.',
        complianceTags: ['IT Act Sec 66C', 'ISO 27001 A.10']
      });
    } else if (type === 'PRIVILEGE_ESCALATION') {
      log = {
        id: `atk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        attackType: 'PRIVILEGE_ESCALATION',
        attackerDid: USER_PERSONAS.operations.did,
        targetResource: 'Asset: Defence_Procurement_Spec_v3.pdf',
        rawPayload: '{"action": "READ", "claimedClearance": "Tier-3", "caller": "Rohan Mehta"}',
        defenseMechanism: 'Decentralized Verifiable Credential Resolver & Cryptographic ABAC Tier Gate',
        contractResponse: 'REVERTED: Caller credential validation failed. Tier-1 cannot elevate to Tier-3 Secret without dual-auditor multisig.',
        status: 'BLOCKED'
      };
      addTransaction({
        type: 'PolicyEvaluated',
        initiatorDid: USER_PERSONAS.operations.did,
        initiatorName: USER_PERSONAS.operations.name,
        status: 'REVERTED',
        details: 'PRIVILEGE ESCALATION INTERCEPTED: Caller attempted unauthorized elevation to Tier-3 asset.',
        complianceTags: ['ISO 27001 A.9', 'Zero Trust Principle']
      });
    } else {
      log = {
        id: `atk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        attackType: 'OFFCHAIN_TAMPER',
        attackerDid: 'did:blockshield:eth:0xRogueStorageNode88812',
        targetResource: 'IPFS CID: ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        rawPayload: '{"byteOffset": 4096, "modifiedContent": "0xFF 0x00 ... modified payload"}',
        defenseMechanism: 'Cryptographic SHA-256 On-Chain Anchor & Hash Oracle Verifier',
        contractResponse: 'ALERT: Hash mismatch. Calculated: 0x99a... != Anchored: 0x3b1947b2c01994e6bf542df986221c607ec531959779df5c8b7c7b8ad3f6f194. Asset automatically frozen.',
        status: 'FLAGGED'
      };
      tamperAsset('asset-defence-02');
    }

    setAttackLogs(prev => [log, ...prev]);
    return log;
  };

  const setDemoStep = (step: number) => {
    setActiveDemoStep(step);
    // Find matching tab from DEMO_SCRIPT_STEPS
    const stepObj = [
      { step: 1, tab: 'command-center' },
      { step: 2, tab: 'identity-zk' },
      { step: 3, tab: 'identity-zk' },
      { step: 4, tab: 'asset-vault' },
      { step: 5, tab: 'asset-vault' },
      { step: 6, tab: 'policy-engine' },
      { step: 7, tab: 'multisig-transfer' },
      { step: 8, tab: 'duress-mode' },
      { step: 9, tab: 'redteam-simulator' },
      { step: 10, tab: 'redteam-simulator' },
      { step: 11, tab: 'compliance-audit' },
      { step: 12, tab: 'compliance-audit' },
    ].find(s => s.step === step);
    if (stepObj) {
      setActiveTab(stepObj.tab);
    }
  };

  const resetAllState = () => {
    localStorage.clear();
    setAssets(INITIAL_ASSETS);
    setTransactions(INITIAL_LEDGER_TRANSACTIONS);
    setCurrentRoleId('ciso');
    setActiveTab('command-center');
    setIsOffline(false);
    setDuressAlerts([]);
    setAttackLogs([]);
    setTamperedAssetId(null);
    setBlockHeight(489316);
    setActiveDemoStep(1);
  };

  return (
    <BlockshieldContext.Provider
      value={{
        currentPersona,
        currentRoleId,
        switchPersona,
        activeTab,
        setActiveTab,
        isOffline,
        toggleOffline,
        blockHeight,
        assets,
        tamperedAssetId,
        addAsset,
        tamperAsset,
        restoreAsset,
        transactions,
        addTransaction,
        inspectingTx,
        setInspectingTx,
        transferRequests,
        createTransferRequest,
        signTransferRequest,
        duressAlerts,
        triggerDuressDecoy,
        acknowledgeDuressAlert,
        attackLogs,
        executeAttackSimulation,
        isWalletModalOpen,
        setIsWalletModalOpen,
        activeDemoStep,
        setDemoStep,
        resetAllState,
      }}
    >
      {children}
    </BlockshieldContext.Provider>
  );
};

export const useBlockshield = () => {
  const context = useContext(BlockshieldContext);
  if (!context) {
    throw new Error('useBlockshield must be used within a BlockshieldProvider');
  }
  return context;
};
