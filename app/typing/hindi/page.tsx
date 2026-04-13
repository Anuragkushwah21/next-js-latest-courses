"use client";

import { useEffect, useState, useMemo, JSX } from "react";
import { useSession } from "next-auth/react";

type TypingParagraph = {
  _id: string;
  language: "english" | "hindi";
  title: string;
  text: string;
  createdAt: string;
};

type TypingStats = {
  wpm: number;
  accuracy: number;
  duration: number; // seconds
};

export default function HindiTypingPage() {
  const [paragraphs, setParagraphs] = useState<TypingParagraph[]>([]);
  const [selected, setSelected] = useState<TypingParagraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [hasError, setHasError] = useState(false); // wrong key press indicator

  const { data: session } = useSession();

  const userId = (session?.user as any)?._id || (session?.user as any)?.id;
  const userName = session?.user?.name || "Guest";

  // 1) Hindi paragraphs fetch
  useEffect(() => {
    async function fetchParagraphs() {
      try {
        setLoading(true);
        const res = await fetch("/api/typing?language=hindi");
        if (!res.ok) throw new Error("Failed to load Hindi paragraphs");
        const result = await res.json();
        const list: TypingParagraph[] = result.data || [];
        setParagraphs(list);
        setSelected(list[0] || null);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchParagraphs();
  }, []);

  // 2) Typing stats calculation helper
  function calculateStats(
    paragraphText: string,
    typedText: string,
    start: number
  ): TypingStats {
    const now = Date.now();
    const durationSeconds = (now - start) / 1000;

    const totalChars = typedText.length;
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === paragraphText[i]) {
        correctChars++;
      }
    }

    const accuracy =
      totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

    // WPM: (correct chars / 5) per minute
    const words = correctChars / 5;
    const minutes = durationSeconds / 60;
    const wpm = minutes === 0 ? 0 : Math.round(words / minutes);

    return {
      wpm,
      accuracy,
      duration: Math.max(1, Math.round(durationSeconds)),
    };
  }

  // 3) Typing change handler (strict: only next correct char allowed)
  function handleChange(newValue: string) {
    if (!selected) return;

    const para = selected.text;
    const prev = input;

    // Backspace allow (shorter length)
    if (newValue.length < prev.length) {
      setInput(newValue);
      setHasError(false);
      if (startedAt && newValue.length > 0) {
        setStats(calculateStats(para, newValue, startedAt));
      } else {
        setStats(null);
        setFinished(false);
      }
      return;
    }

    // New character typed
    const nextIndex = prev.length; // index jahan next char expected hai
    const expectedChar = para[nextIndex] ?? "";
    const typedChar = newValue[newValue.length - 1]; // last char

    if (typedChar === expectedChar) {
      // correct → accept
      if (!startedAt) {
        setStartedAt(Date.now());
        setSaveMessage("");
      }

      const updated = prev + typedChar;
      setInput(updated);
      setHasError(false);

      if (startedAt) {
        const newStats = calculateStats(para, updated, startedAt);
        setStats(newStats);

        if (updated.length >= para.length) {
          setFinished(true);
        } else {
          setFinished(false);
        }
      }
    } else {
      // wrong → ignore character, mark error
      setHasError(true);
      // input ko prev hi rehne do
    }
  }

  function resetTest() {
    setInput("");
    setStartedAt(null);
    setFinished(false);
    setStats(null);
    setSaveMessage("");
    setHasError(false);
  }

  // 4) Save record to backend (TypingRecord)
  async function handleSaveResult() {
    if (!selected || !stats) return;

    try {
      setSaving(true);
      setSaveMessage("");

      const res = await fetch("/api/admin/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          language: "hindi",
          title: selected.title,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          duration: stats.duration,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setSaveMessage(result.message || "Failed to save record");
      } else {
        setSaveMessage("Result saved successfully!");
      }
    } catch {
      setSaveMessage("Error saving result");
    } finally {
      setSaving(false);
    }
  }

  // 5) Live highlighting: correct = green, wrong position = red bg, remaining = gray
  const highlightedParagraph = useMemo(() => {
    if (!selected) return null;

    const para = selected.text;
    const typed = input;
    const elements: JSX.Element[] = [];

    // Correct typed part
    for (let i = 0; i < typed.length; i++) {
      const expectedChar = para[i] ?? "";
      const isCorrect = typed[i] === expectedChar;

      elements.push(
        <span
          key={`char-${i}`}
          className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        >
          {expectedChar}
        </span>
      );
    }

    // Remaining part
    if (typed.length < para.length) {
      const remaining = para.slice(typed.length);
      elements.push(
        <span
          key="remaining"
          className={hasError ? "bg-red-50 text-red-700" : "text-gray-500"}
        >
          {remaining}
        </span>
      );
    }

    return elements;
  }, [selected, input, hasError]);

  if (loading) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Hindi Typing</h1>
          <p className="text-gray-600">Loading Hindi typing paragraphs...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Hindi Typing</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!selected) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Hindi Typing</h1>
          <p className="text-lg text-gray-600">No Hindi paragraphs available.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-2">Hindi Typing Practice</h1>
          <p className="text-gray-600">
            Sirf wahi key accept hogi jo paragraph me next hai. Galat key dabane par input nahi badlega
            aur remaining text red ho jayega.
          </p>
        </header>

        {/* Paragraph selector */}
        {paragraphs.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {paragraphs.map((p) => (
              <button
                key={p._id}
                onClick={() => {
                  setSelected(p);
                  resetTest();
                }}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selected._id === p._id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Paragraph display with highlighting */}
        <section className="bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{selected.title}</h2>
          <p className="text-sm text-gray-500 mb-3">
            {new Date(selected.createdAt).toLocaleString()}
          </p>
          <p className="text-[15px] leading-relaxed whitespace-pre-line font-normal">
            {highlightedParagraph}
          </p>
        </section>

        {/* Typing area */}
        <section className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Status:{" "}
              {finished
                ? "Completed"
                : startedAt
                ? "In progress..."
                : "Not started"}
            </span>
            {stats && (
              <span>
                WPM: <b>{stats.wpm}</b> | Accuracy: <b>{stats.accuracy}%</b> | Time:{" "}
                <b>{stats.duration}s</b>
              </span>
            )}
          </div>

          <textarea
            className={
              "w-full rounded-md border px-3 py-2 text-sm min-h-[160px] focus:outline-none focus:ring-2 " +
              (hasError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500")
            }
            placeholder="Yahan paragraph type karna shuru karo..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetTest}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSaveResult}
              disabled={!stats || saving}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Result"}
            </button>
          </div>

          {hasError && (
            <p className="text-xs text-red-600">
              Galat key dabayi hai. Sahi character type karo aage badhne ke liye.
            </p>
          )}

          {saveMessage && (
            <p className="text-sm text-gray-700 mt-1">{saveMessage}</p>
          )}
        </section>
      </div>
    </main>
  );
}