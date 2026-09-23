import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { X, Download, ExternalLink, Code2, Copy, Check, FileText } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'readme'>('html');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [jsContent, setJsContent] = useState<string>('');
  const [readmeContent, setReadmeContent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Fetch files from /standalone/
      fetch('/standalone/index.html')
        .then((r) => r.text())
        .then((t) => setHtmlContent(t))
        .catch(() => {});

      fetch('/standalone/style.css')
        .then((r) => r.text())
        .then((t) => setCssContent(t))
        .catch(() => {});

      fetch('/standalone/script.js')
        .then((r) => r.text())
        .then((t) => setJsContent(t))
        .catch(() => {});

      fetch('/standalone/README.md')
        .then((r) => r.text())
        .then((t) => setReadmeContent(t))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCode =
    activeTab === 'html'
      ? htmlContent
      : activeTab === 'css'
      ? cssContent
      : activeTab === 'js'
      ? jsContent
      : readmeContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();
      zip.file('index.html', htmlContent || '<!-- MINI Standalone -->');
      zip.file('style.css', cssContent || '/* MINI Styles */');
      zip.file('script.js', jsContent || '// MINI Scripts');
      zip.file('README.md', readmeContent || '# MINI Standalone');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MINI-Global-Flagship-Standalone.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111215] text-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 my-8 flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C2D6] text-black flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-white">
                  Standalone Pure Web Edition
                </h3>
                <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  Zero NPM Dependencies
                </span>
              </div>
              <p className="text-xs text-white/60">
                100% pure HTML5, CSS3, and Vanilla JavaScript. Runs directly in any web browser.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close export modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                activeTab === 'html' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                activeTab === 'css' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                activeTab === 'js' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              script.js
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                activeTab === 'readme' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              README.md
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>

            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#00C2D6] hover:bg-[#00ADC0] text-black flex items-center gap-1.5 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating ZIP...' : 'Export ZIP Bundle'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#0A0B0E] font-mono text-xs text-white/90">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed selection:bg-[#00C2D6] selection:text-black">
            <code>{currentCode || 'Loading standalone source...'}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
          <span>Target Directory: /public/standalone/</span>
          <span>Tested for Safari, Chrome, Edge, and Firefox</span>
        </div>
      </div>
    </div>
  );
};
