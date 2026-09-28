import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Database, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  Flame,
  FileCheck
} from 'lucide-react';
import { useBlockshield } from '../../context/BlockshieldContext';
import { computeSha256, formatTruncated } from '../../utils/crypto';
import { DigitalAsset } from '../../types';

export const AssetVaultTab: React.FC = () => {
  const { 
    assets, 
    addAsset, 
    tamperAsset, 
    restoreAsset, 
    tamperedAssetId, 
    currentPersona,
    blockHeight 
  } = useBlockshield();

  const [isHashing, setIsHashing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    hash: string;
  } | null>(null);

  // Hybrid physical proof inputs
  const [physicalSerial, setPhysicalSerial] = useState('SRN-DEL-HQ-2026-99');
  const [hardwareUid, setHardwareUid] = useState('TPM2.0-FIPS-SECURE-MODULE');
  const [assetCategory, setAssetCategory] = useState<'Infrastructure' | 'Defence' | 'Financial' | 'Governance'>('Infrastructure');
  const [classification, setClassification] = useState<'Confidential' | 'Secret' | 'Top Secret'>('Secret');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsHashing(true);
    try {
      const buffer = await file.arrayBuffer();
      // Real Web Crypto SHA-256
      const hash = await computeSha256(buffer);
      setUploadedFile({
        name: file.name,
        size: file.size,
        hash
      });
    } catch (err) {
      console.error('Hashing failed', err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleAnchorAsset = () => {
    if (!uploadedFile) return;

    const newAsset: DigitalAsset = {
      id: `asset-${Date.now()}`,
      name: uploadedFile.name,
      category: assetCategory,
      classification,
      sizeBytes: uploadedFile.size,
      sha256Hash: uploadedFile.hash,
      originalHash: uploadedFile.hash,
      isTampered: false,
      ipfsCid: `ipfs://Qm${uploadedFile.hash.slice(2, 46)}`,
      ownerDid: currentPersona.did,
      ownerName: currentPersona.name,
      registeredBlock: blockHeight + 1,
      createdAt: new Date().toISOString(),
      physicalProof: {
        serialNumber: physicalSerial,
        hardwareUid: hardwareUid,
        tamperSealHash: `0xseal_${uploadedFile.hash.slice(2, 16)}`
      }
    };

    addAsset(newAsset);
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Flashing Integrity Breach Banner if any asset is corrupted */}
      {tamperedAssetId && (
        <div className="p-4 rounded-2xl bg-red-950/80 border-2 border-red-500/80 shadow-2xl glass-glow-crimson animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-200 uppercase font-mono tracking-wide">
                CRITICAL INTEGRITY BREACH: Stored Hash does not match Recalculated Hash!
              </h3>
              <p className="text-xs text-red-300/90 mt-0.5">
                Asset ID: {tamperedAssetId} — Off-chain data byte tampering detected by Hash Oracle. Asset quarantined and frozen on-chain.
              </p>
            </div>
          </div>

          <button
            onClick={() => restoreAsset(tamperedAssetId)}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-red-500/30 cursor-pointer shrink-0"
          >
            Restore Verified Hash
          </button>
        </div>
      )}

      {/* Top Upload & Hybrid Physical Proof Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag & Drop Real Web Crypto Uploader */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Real Web Crypto SHA-256 Asset Hashing</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                crypto.subtle.digest
              </span>
            </div>
            <p className="text-xs text-slate-400">
              SIH Innovation #5 & #11: Client-side cryptographic anchoring. Compute real SHA-256 digests in-browser and bind with IPFS off-chain storage.
            </p>
          </div>

          {/* Drag & Drop File Input Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center transition-all bg-slate-900/40 relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                {isHashing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {isHashing ? 'Computing In-Browser SHA-256 Digest...' : 'Drag & drop any file here, or click to browse'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Supports PDF, DOCX, SCADA DAT, PEM Keys, or Media (Processed locally, never uploaded externally)
              </div>
            </div>
          </div>

          {/* Uploaded File Result Box */}
          {uploadedFile && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{uploadedFile.name}</span>
                <span className="font-mono text-slate-400">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-mono mb-0.5">Calculated SHA-256 Digest:</div>
                <div className="p-2 rounded bg-black/60 font-mono text-xs text-emerald-300 break-all select-all border border-emerald-500/20">
                  {uploadedFile.hash}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setUploadedFile(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnchorAsset}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Anchor Asset to Blockchain</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Hybrid Physical + Hardware Seal Form */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Hybrid Physical/Digital Proof</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bind physical hardware serials and HSM tamper seals to the digital asset token.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Physical Device Serial Number</label>
              <input
                type="text"
                value={physicalSerial}
                onChange={e => setPhysicalSerial(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Hardware TPM / HSM Seal UID</label>
              <input
                type="text"
                value={hardwareUid}
                onChange={e => setHardwareUid(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Sector Category</label>
                <select
                  value={assetCategory}
                  onChange={e => setAssetCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Defence">Defence</option>
                  <option value="Financial">Financial</option>
                  <option value="Governance">Governance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Clearance Level</label>
                <select
                  value={classification}
                  onChange={e => setClassification(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Secret">Secret</option>
                  <option value="Top Secret">Top Secret</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
            Anchored alongside owner DID:
            <div className="text-emerald-400 truncate mt-0.5">{currentPersona.did}</div>
          </div>
        </div>
      </div>

      {/* Asset Vault Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Immutable Digital Asset Registry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Off-chain encrypted content anchored with cryptographic SHA-256 Merkle proofs
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            {assets.length} Assets Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-white/5 font-mono text-[11px]">
              <tr>
                <th className="p-4">Asset Name</th>
                <th className="p-4">Category & Tier</th>
                <th className="p-4">Cryptographic SHA-256</th>
                <th className="p-4">IPFS Storage CID</th>
                <th className="p-4">Anchored Block</th>
                <th className="p-4 text-right">Integrity Test Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map(asset => {
                const isCorrupted = asset.isTampered;
                return (
                  <tr
                    key={asset.id}
                    className={`transition-colors ${
                      isCorrupted ? 'bg-red-950/30' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCorrupted
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{asset.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {(asset.sizeBytes / 1024).toFixed(1)} KB · Owner: {asset.ownerName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-300 block">{asset.category}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          asset.classification === 'Top Secret'
                            ? 'bg-red-950 text-red-300 border border-red-500/30'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {asset.classification}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs ${isCorrupted ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                          {formatTruncated(asset.sha256Hash, 10, 6)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(asset.sha256Hash, asset.id)}
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                          title="Copy SHA-256"
                        >
                          {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      {isCorrupted && (
                        <div className="text-[10px] text-red-400 font-bold mt-0.5">
                          HASH MISMATCH!
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      <div className="truncate max-w-[140px]" title={asset.ipfsCid}>
                        {asset.ipfsCid}
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-300">
                      #{asset.registeredBlock}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isCorrupted ? (
                          <button
                            onClick={() => restoreAsset(asset.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => tamperAsset(asset.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            title="Simulate 1-byte file corruption to trigger immediate hash collision rejection"
                          >
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span>Corrupt Asset Data</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
