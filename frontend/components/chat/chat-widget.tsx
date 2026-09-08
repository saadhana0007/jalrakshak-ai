"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, Globe, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { chatApi } from "@/lib/api";
import type { ChatMessage } from "@/types";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
];

const SAMPLE_QUERIES = [
  "Should I irrigate today?",
  "Why should I delay irrigation?",
  "How much water can I save?",
];

function mockReply(query: string, lang: string): string {
  const q = query.toLowerCase();
  const responses: Record<string, Record<string, string>> = {
    irrigate: {
      en: "Based on current soil moisture (38%) and a 21mm rainfall forecast in the next 14 hours, I recommend delaying irrigation. This can save approximately 14,200 litres of water with 92% confidence.",
      hi: "वर्तमान मिट्टी की नमी (38%) और अगले 14 घंटों में 21mm वर्षा के पूर्वानुमान के आधार पर, मैं सिंचाई में देरी की सलाह देता हूं। इससे लगभग 14,200 लीटर पानी की बचत हो सकती है (92% विश्वास)।",
      ta: "தற்போதைய மண் ஈரப்பதம் (38%) மற்றும் அடுத்த 14 மணி நேரத்தில் 21mm மழை பொழிவு கணிப்பின் அடிப்படையில், பாசனத்தை தாமதப்படுத்த பரிந்துரைக்கிறேன். இது சுமார் 14,200 லிட்டர் தண்ணீரை மிச்சப்படுத்தும் (92% நம்பகத்தன்மை).",
    },
    delay: {
      en: "Delaying irrigation is recommended because rainfall is expected soon, soil moisture is still above the critical threshold (25%), and irrigating now would waste water and increase runoff risk.",
      hi: "सिंचाई में देरी की सिफारिश की जाती है क्योंकि जल्द ही वर्षा होने की उम्मीद है, मिट्टी की नमी अभी भी महत्वपूर्ण सीमा (25%) से ऊपर है, और अभी सिंचाई करने से पानी बर्बाद होगा।",
      ta: "விரைவில் மழை எதிர்பார்க்கப்படுவதால், மண் ஈரப்பதம் இன்னும் முக்கியமான வரம்பிற்கு (25%) மேல் இருப்பதால் பாசனத்தை தாமதப்படுத்த பரிந்துரைக்கப்படுகிறது.",
    },
    save: {
      en: "Farms using JalRakshak's Smart Irrigation Advisor save an average of 22% water per season — roughly 14,200 litres per delayed irrigation event, and up to 1.2 lakh litres per acre annually.",
      hi: "जलरक्षक के स्मार्ट सिंचाई सलाहकार का उपयोग करने वाले खेत प्रति सीजन औसतन 22% पानी बचाते हैं — प्रति विलंबित सिंचाई घटना लगभग 14,200 लीटर।",
      ta: "ஜல்ரக்ஷக்கின் ஸ்மார்ட் பாசன ஆலோசகரைப் பயன்படுத்தும் பண்ணைகள் ஒரு பருவத்திற்கு சராசரியாக 22% தண்ணீரை மிச்சப்படுத்துகின்றன.",
    },
    default: {
      en: "I can help you decide when to irrigate, explain climate alerts, and suggest water-saving measures. Try asking: \"Should I irrigate today?\" or \"How much water can I save?\"",
      hi: "मैं आपको यह तय करने में मदद कर सकता हूं कि कब सिंचाई करनी है, जलवायु अलर्ट समझा सकता हूं, और जल-बचत उपाय सुझा सकता हूं।",
      ta: "எப்போது பாசனம் செய்வது என்பதை முடிவு செய்ய உதவ முடியும், காலநிலை எச்சரிக்கைகளை விளக்க முடியும்.",
    },
  };
  let key = "default";
  if (q.includes("irrigate") && q.includes("today")) key = "irrigate";
  else if (q.includes("delay") || q.includes("why")) key = "delay";
  else if (q.includes("save") || q.includes("how much")) key = "save";
  return responses[key][lang] ?? responses[key]["en"];
}

export default function ChatWidget() {
  const theme = useAppStore((s) => s.theme);
  const themeClass = theme === "dark" ? "dark" : "";
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Namaste! I'm the JalRakshak Assistant. Ask me about irrigation timing, water savings, or climate alerts.",
      timestamp: "now",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const token = useAppStore((s) => s.token);

  async function send(text?: string) {
    const q = text ?? input;
    if (!q.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: q, timestamp: "now" };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    let replyText: string;
    try {
      if (!token) throw new Error("no token");
      const res = await chatApi(token, q, lang);
      replyText = res.reply;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      replyText = mockReply(q, lang);
    }
    const reply: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: replyText, timestamp: "now" };
    setMessages((m) => [...m, reply]);
  }

  function toggleVoice() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      send("Should I irrigate today?");
    }, 1400);
  }

  return (
    <div className={themeClass}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-gradient-to-br from-primary-500 to-accent-500 text-white hover:scale-105"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">JalRakshak Assistant</p>
                <p className="text-[10px] text-white/80">AI water advisor · online</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLangMenu((s) => !s)}
                className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
              >
                <Globe className="h-3.5 w-3.5" />
                {LANGS.find((l) => l.code === lang)?.label}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-8 w-28 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangMenu(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950/50">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary-600 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 p-2 dark:border-slate-800">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleVoice}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                  listening
                    ? "animate-pulse-slow border-red-300 bg-red-50 text-red-500 dark:border-red-500/40 dark:bg-red-500/10"
                    : "border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-800"
                )}
              >
                <Mic className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about irrigation, alerts…"
                className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
              <button
                onClick={() => send()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
