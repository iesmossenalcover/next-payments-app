import { useState } from "react";
import { MarkResult } from "@/lib/hooks/useEventPeople";

interface PasteSelectorProps {
    onApply: (references: string[], checked: boolean) => MarkResult,
}

const placeholder = "11111111\n22222222\n33333333\n...";

const PasteSelector = ({ onApply }: PasteSelectorProps) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [result, setResult] = useState<MarkResult | undefined>(undefined);

    const apply = (checked: boolean) => {
        const references = text.split("\n").map(x => x.trim()).filter(x => x.length > 0);
        if (references.length === 0) return;

        const applied = onApply(references, checked);
        setResult(applied);
        // Deixam dins el quadre només el que no s'ha trobat, per poder-ho corregir.
        setText(applied.notFound.join("\n"));
    }

    const onTextChange = (value: string) => {
        setText(value);
        setResult(undefined);
    }

    return (
        <div className="card mb-6 overflow-hidden">
            <button
                className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                onClick={() => setOpen(!open)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="ml-2">Enganxar llista d&apos;expedients o documents d&apos;identitat</span>
            </button>
            {open &&
                <div className="border-t border-slate-100 p-4">
                    <textarea
                        id="academicRecordSelector"
                        rows={8}
                        value={text}
                        onChange={e => onTextChange(e.target.value)}
                        className="form-input font-mono"
                        placeholder={placeholder}></textarea>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => apply(true)}>Marcar</button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => apply(false)}>Desmarcar</button>
                        {result &&
                            <span className="text-sm">
                                <span className="font-medium text-emerald-700">{result.matched} persones aplicades.</span>
                                {result.notFound.length > 0 &&
                                    <span className="ml-2 text-red-600">
                                        {result.notFound.length} no trobades (queden al quadre): {result.notFound.slice(0, 5).join(", ")}{result.notFound.length > 5 ? "…" : ""}
                                    </span>
                                }
                            </span>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default PasteSelector;
