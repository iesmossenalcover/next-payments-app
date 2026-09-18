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
        <div className="border border-gray-200 rounded-lg mb-6">
            <button
                className="w-full flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700"
                onClick={() => setOpen(!open)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="ml-2">Enganxar llista d&apos;expedients o documents d&apos;identitat</span>
            </button>
            {open &&
                <div className="px-3 pb-3">
                    <textarea
                        id="academicRecordSelector"
                        rows={8}
                        value={text}
                        onChange={e => onTextChange(e.target.value)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={placeholder}></textarea>
                    <div className="flex items-center mt-3">
                        <button
                            className="text-white bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                            onClick={() => apply(true)}>Marcar</button>
                        <button
                            className="ml-3 text-gray-600 border border-gray-300 hover:bg-gray-50 font-bold py-2 px-4 rounded"
                            onClick={() => apply(false)}>Desmarcar</button>
                        {result &&
                            <span className="ml-4 text-sm">
                                <span className="text-green-700">{result.matched} persones aplicades.</span>
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
