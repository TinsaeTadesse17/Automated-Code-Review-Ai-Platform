import React from 'react';
import { Copy, Play } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function CodeEditor({
  code,
  language,
  onChange,
  onLanguageChange,
  onAnalyze,
  isAnalyzing
}: CodeEditorProps) {
  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-gray-400 hover:text-gray-200 p-1"
            title="Copy code"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !code.trim()}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${
              isAnalyzing || !code.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Play size={16} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 bg-gray-900 text-gray-100 p-4 font-mono text-sm focus:outline-none"
        placeholder="Paste your code here..."
      />
    </div>
  );
}