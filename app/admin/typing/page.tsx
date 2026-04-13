// app/admin/typing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Paragraph = {
  _id: string;
  language: "english" | "hindi";
  title: string;
  text: string;
  createdAt?: string;
};

type ParagraphForm = {
  language: "english" | "hindi";
  title: string;
  text: string;
};

const emptyParagraphForm: ParagraphForm = {
  language: "english",
  title: "",
  text: "",
};

export default function AdminTypingPage() {
  const [filterLang, setFilterLang] = useState<"all" | "english" | "hindi">(
    "all"
  );
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState(true);

  const [paraForm, setParaForm] = useState<ParagraphForm>(emptyParagraphForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // load paragraphs
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterLang !== "all") params.set("language", filterLang);

        const res = await fetch(`/api/typing?${params.toString()}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load paragraphs");
        }
        setParagraphs(json.data || []);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Error loading paragraphs");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filterLang]);

  function handleParagraphChange<K extends keyof ParagraphForm>(
    field: K,
    value: ParagraphForm[K]
  ) {
    setParaForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setParaForm(emptyParagraphForm);
    setEditingId(null);
  }

  async function handleParagraphSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!paraForm.title || !paraForm.text) {
      toast.error("Title and paragraph text are required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          language: paraForm.language,
          title: paraForm.title,
          text: paraForm.text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save paragraph");
      } else {
        const saved: Paragraph = data.data;
        if (editingId) {
          setParagraphs((prev) =>
            prev.map((p) => (p._id === editingId ? saved : p))
          );
          toast.success("Paragraph updated");
        } else {
          setParagraphs((prev) => [saved, ...prev]);
          toast.success("Paragraph created");
        }
        resetForm();
      }
    } catch {
      toast.error("Error saving paragraph");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p: Paragraph) {
    setEditingId(p._id);
    setParaForm({
      language: p.language,
      title: p.title,
      text: p.text,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this paragraph?")) return;

    try {
      const res = await fetch(`/api/typing/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete paragraph");
      } else {
        setParagraphs((prev) => prev.filter((p) => p._id !== id));
        toast.success("Paragraph deleted");
        if (editingId === id) resetForm();
      }
    } catch {
      toast.error("Error deleting paragraph");
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Typing Paragraphs (Admin)</h1>

        {/* Create / Edit Hindi / English typing paragraph */}
        <section className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Paragraph" : "Add Typing Paragraph"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs sm:text-sm text-gray-600 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleParagraphSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Language
                </label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={paraForm.language}
                  onChange={(e) =>
                    handleParagraphChange(
                      "language",
                      e.target.value as "english" | "hindi"
                    )
                  }
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={paraForm.title}
                  onChange={(e) =>
                    handleParagraphChange("title", e.target.value)
                  }
                  placeholder="Typing test title (e.g., English Paragraph 1)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Paragraph Text
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm min-h-[140px]"
                value={paraForm.text}
                onChange={(e) =>
                  handleParagraphChange("text", e.target.value)
                }
                placeholder="Enter the Hindi / English paragraph to be used in typing test..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-1 w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Paragraph"
                : "Create Paragraph"}
            </button>
          </form>
        </section>

        {/* Filter + paragraphs list */}
        <section className="space-y-4">
          <div className="flex gap-3 mb-2">
            <button
              onClick={() => setFilterLang("all")}
              className={`px-4 py-2 rounded ${
                filterLang === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterLang("english")}
              className={`px-4 py-2 rounded ${
                filterLang === "english"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setFilterLang("hindi")}
              className={`px-4 py-2 rounded ${
                filterLang === "hindi"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              Hindi
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : paragraphs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No paragraphs found for this filter.
            </p>
          ) : (
            <div className="space-y-3">
              {paragraphs.map((p) => (
                <article
                  key={p._id}
                  className="bg-white rounded-lg shadow px-4 py-3 flex flex-col gap-2"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <p className="text-xs text-gray-500 capitalize">
                        {p.language}
                      </p>
                      <h3 className="font-semibold text-sm sm:text-base">
                        {p.title}
                      </h3>
                      {p.createdAt && (
                        <p className="text-[11px] text-gray-400">
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-2 py-1 text-[11px] sm:text-xs rounded-md border text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-2 py-1 text-[11px] sm:text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                    {p.text}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}