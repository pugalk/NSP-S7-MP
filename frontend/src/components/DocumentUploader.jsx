import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Eye,
  File 
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DocumentUploader({ documents, onUpload, onRemove, requiredDocs = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(requiredDocs[0] || 'Income Certificate');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(selectedCategory, file);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(selectedCategory, file);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Document Type to Upload
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select text-xs font-semibold sm:max-w-xs"
          >
            {requiredDocs.length > 0 ? (
              requiredDocs.map((doc, idx) => (
                <option key={idx} value={doc}>{doc}</option>
              ))
            ) : (
              <>
                <option value="Aadhaar / Identity Document">Aadhaar / Identity Document</option>
                <option value="Income Certificate">Income Certificate</option>
                <option value="Marksheet">Marksheet / Grade Card</option>
                <option value="Bonafide Certificate">College Bonafide Certificate</option>
                <option value="Community / Category Certificate">Community / Category Certificate</option>
                <option value="Bank Passbook">Bank Passbook / Cancelled Cheque</option>
                <option value="Passport-size Photograph">Passport-size Photograph</option>
                <option value="Disability Certificate">Disability Certificate</option>
                <option value="Sports Certificate">Sports Participation Certificate</option>
              </>
            )}
          </select>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer relative ${
              dragActive ? 'border-blue-600 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 bg-white'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
              <UploadCloud className="size-5 text-blue-900" />
              <span>
                <span className="font-semibold text-blue-900">Click to upload</span> or drag and drop certificate (PDF, JPG, PNG up to 10MB)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Uploaded Certificates &amp; Verification Status ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
            <File className="size-8 mx-auto text-slate-300 mb-2" />
            No documents uploaded yet. Upload your academic, domicile and income certificates to speed up application verification.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-900 shrink-0">
                    <FileCheck className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-sm block truncate">
                      {doc.name}
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </span>
                    {doc.remark && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Reviewer remark: {doc.remark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <StatusBadge status={doc.status} />
                  {doc.fileName && (
                    <a
                      href={`/uploads/${doc.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                      title="View Certificate"
                      onClick={(e) => {
                        if (!doc.fileName.includes('_')) {
                          e.preventDefault();
                          alert(`Certificate Details:\n• Document: ${doc.name}\n• File: ${doc.fileName}\n• Status: ${doc.status}\n• Remarks: ${doc.remark || 'Awaiting reviewer remarks'}`);
                        }
                      }}
                    >
                      <Eye className="size-4" />
                    </a>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-50 transition-colors"
                      title="Remove certificate"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
