import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ExternalLink,
  Copy,
  Check,
  Coffee,
  Wifi,
  QrCode as QrCodeIcon,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableItem } from '../../types';
import { generateQrDataUrl, generateTableUrl, downloadQrDataUrl } from '../../utils/qrCode';

interface TableQrModalProps {
  initialTable?: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerView?: (tableNumber: number) => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({
  initialTable,
  isOpen,
  onClose,
  onOpenCustomerView
}) => {
  const { tables, businessProfile } = useApp();
  const [selectedTableId, setSelectedTableId] = useState<string>(
    initialTable?.id || (tables[0]?.id ?? '')
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printAllMode, setPrintAllMode] = useState(false);
  const [allQrUrls, setAllQrUrls] = useState<Record<string, string>>({});
  const printContainerRef = useRef<HTMLDivElement>(null);

  const currentTable = tables.find(t => t.id === selectedTableId) || tables[0];

  useEffect(() => {
    if (initialTable) {
      setSelectedTableId(initialTable.id);
    } else if (tables.length > 0 && !selectedTableId) {
      setSelectedTableId(tables[0].id);
    }
  }, [initialTable, tables]);

  // Generate QR for single table
  useEffect(() => {
    if (!currentTable) return;
    setIsGenerating(true);
    const tableUrl = generateTableUrl(currentTable.number);

    generateQrDataUrl(tableUrl, {
      width: 380,
      margin: 2,
      color: { dark: '#1e1b4b', light: '#ffffff' }
    })
      .then(url => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
        setIsGenerating(false);
      });
  }, [currentTable?.id, currentTable?.number]);

  // Pre-generate all QR codes for bulk printing
  useEffect(() => {
    if (!isOpen) return;
    const generateAll = async () => {
      const map: Record<string, string> = {};
      for (const tbl of tables) {
        try {
          const url = generateTableUrl(tbl.number);
          const dataUrl = await generateQrDataUrl(url, {
            width: 320,
            margin: 2,
            color: { dark: '#111827', light: '#ffffff' }
          });
          map[tbl.id] = dataUrl;
        } catch (e) {
          console.error('Failed to generate for table', tbl.number, e);
        }
      }
      setAllQrUrls(map);
    };
    generateAll();
  }, [isOpen, tables]);

  if (!isOpen || !currentTable) return null;

  const tableUrl = generateTableUrl(currentTable.number);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      downloadQrDataUrl(qrDataUrl, `table-${currentTable.number}-qr-stand`);
    }
  };

  const handlePrint = (all = false) => {
    setPrintAllMode(all);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <QrCodeIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base leading-tight">
                Table QR Stand & Digital Menu
              </h2>
              <p className="text-[11px] text-slate-400">
                Customers scan this table tent to view menu, see live order & pay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Table Switcher Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-600">Select Table:</label>
              <select
                value={selectedTableId}
                onChange={e => setSelectedTableId(e.target.value)}
                className="bg-slate-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {tables.map(tbl => (
                  <option key={tbl.id} value={tbl.id}>
                    Table {tbl.number} ({tbl.name} - {tbl.floor || 'Main'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied URL!' : 'Copy Table Link'}</span>
              </button>

              {onOpenCustomerView && (
                <button
                  type="button"
                  onClick={() => onOpenCustomerView(currentTable.number)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Customer View</span>
                </button>
              )}
            </div>
          </div>

          {/* Realistic Acrylic Stand Preview Card */}
          <div className="flex justify-center">
            <div
              id="printable-table-stand"
              className="w-full max-w-xs bg-linear-to-b from-white via-white to-amber-50/40 rounded-2xl border-2 border-slate-800 p-5 shadow-lg text-center flex flex-col items-center justify-between relative overflow-hidden"
              style={{ minHeight: '440px' }}
            >
              {/* Stand Top Bar Indicator */}
              <div className="w-16 h-1 bg-slate-800 rounded-full mb-3" />

              {/* Cafe Branding */}
              <div className="space-y-0.5">
                <div className="inline-flex items-center justify-center gap-1 text-orange-600 font-black text-sm uppercase tracking-wider">
                  <Coffee className="w-4 h-4" />
                  <span>{businessProfile.name}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">
                  {businessProfile.tagline || 'Cafe & Quick Bites'}
                </p>
              </div>

              {/* Table Big Number Badge */}
              <div className="my-2.5 px-4 py-1.5 bg-slate-900 text-white rounded-xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 block">
                  Dine-In
                </span>
                <span className="text-2xl font-black tracking-tight leading-none text-amber-400">
                  TABLE {currentTable.number}
                </span>
              </div>

              {/* High Quality Scannable QR Code */}
              <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-900 shadow-sm relative group my-1">
                {isGenerating || !qrDataUrl ? (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-400 animate-pulse">
                      Generating QR...
                    </span>
                  </div>
                ) : (
                  <img
                    src={qrDataUrl}
                    alt={`Table ${currentTable.number} QR Code`}
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Instruction */}
              <div className="space-y-1 mt-1">
                <div className="inline-flex items-center gap-1 text-xs font-black text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Scan to View Menu & Live Bill</span>
                </div>
                <p className="text-[10px] text-gray-500 max-w-[220px] leading-tight">
                  Point your phone camera to order, see active dishes & pay with UPI
                </p>
              </div>

              {/* Stand Footer: WiFi info & UPI */}
              <div className="w-full mt-3 pt-2.5 border-t border-dashed border-gray-300 text-[10px] text-gray-600 space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-gray-800">
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>WiFi: SYS-CAFE-GUEST</span>
                  <span className="text-gray-400">·</span>
                  <span className="font-mono text-gray-600">syscafe@123</span>
                </div>
                {businessProfile.upiId && (
                  <div className="text-[9px] font-mono text-gray-500">
                    UPI: {businessProfile.upiId}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stand Size & Printing Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2 no-print">
            <span className="font-black text-amber-700 text-xs">💡 Tip:</span>
            <span>
              Print these table tents onto 4x6" cardstock or slip them into clear acrylic table stands. Customers can scan directly with their phone camera to browse the live menu without downloading any app!
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 no-print shrink-0">
          <button
            type="button"
            onClick={() => handlePrint(false)}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print This Stand</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint(true)}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            title="Prints stand cards for all tables in one document"
          >
            <Layers className="w-4 h-4 text-orange-500" />
            <span>Print All ({tables.length}) Stands</span>
          </button>
        </div>
      </div>

      {/* Hidden Print Container for All Tables Bulk Printing */}
      {printAllMode && (
        <div
          ref={printContainerRef}
          className="hidden print:block fixed inset-0 bg-white z-9999 p-6"
        >
          <div className="grid grid-cols-2 gap-6">
            {tables.map(tbl => (
              <div
                key={tbl.id}
                className="w-full bg-white border-2 border-slate-900 rounded-2xl p-5 text-center flex flex-col items-center justify-between page-break-inside-avoid"
                style={{ height: '440px' }}
              >
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900 uppercase">
                    {businessProfile.name}
                  </h3>
                  <p className="text-[10px] text-gray-500">{businessProfile.tagline}</p>
                </div>

                <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl my-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">
                    Dine-In
                  </span>
                  <span className="text-2xl font-black text-amber-400">TABLE {tbl.number}</span>
                </div>

                {allQrUrls[tbl.id] && (
                  <img
                    src={allQrUrls[tbl.id]}
                    alt={`Table ${tbl.number} QR`}
                    className="w-44 h-44 object-contain rounded-lg border border-slate-900 p-2"
                  />
                )}

                <div className="mt-2 text-center">
                  <div className="text-xs font-black text-slate-900">Scan to View Menu & Bill</div>
                  <p className="text-[10px] text-gray-600 mt-1">WiFi: SYS-CAFE-GUEST / syscafe@123</p>
                  <p className="text-[9px] font-mono text-gray-500 mt-0.5">UPI: {businessProfile.upiId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
