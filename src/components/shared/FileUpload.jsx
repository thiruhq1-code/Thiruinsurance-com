import { useRef, useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";

export default function FileUpload({ label, onUploaded, uploaded, required }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    // Frontend-only preview: we don't send this anywhere.
    onUploaded({ name: file.name, size: file.size });
  }

  return (
    <div>
      <p className="text-sm font-medium text-navy-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {!uploaded ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            dragOver ? "border-emerald-400 bg-emerald-50/50" : "border-navy-200 hover:border-navy-300"
          }`}
        >
          <UploadCloud size={22} className="mx-auto text-navy-300 mb-2" />
          <p className="text-xs text-navy-500">
            Click to upload or drag & drop <br /> PDF, JPG or PNG (demo only, not sent anywhere)
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileCheck2 size={18} className="text-emerald-600 shrink-0" />
            <span className="text-sm text-navy-700 truncate">{uploaded.name}</span>
          </div>
          <button onClick={() => onUploaded(null)} className="text-navy-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
