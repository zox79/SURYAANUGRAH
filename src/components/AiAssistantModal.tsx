import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Phone, 
  RefreshCw, 
  Calculator, 
  Building2, 
  Truck, 
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { STORE_PHONE, STORE_WA_NUMBER, STORE_TAGLINE } from '../data/storeData';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculator?: () => void;
  onOpenDiagram?: () => void;
}

const QUICK_PROMPTS = [
  'Apa perbedaan Keramik BS dan Kardusan KW A?',
  'Hitungkan kebutuhan keramik 60x60 untuk ruang 4x6 meter',
  'Rekomendasi batu alam untuk dinding pagar depan',
  'Di mana alamat UD. Khrisna Sakti & Surya Anugrah Keramik?',
  'Apakah ada armada pengiriman toko ke kecamatan saya?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenCalculator,
  onOpenDiagram,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Saya Asisten Virtual **Surya Anugrah Keramik** & **UD. Khrisna Sakti** 👋\n\nAda yang bisa saya bantu terkait pemilihan ukuran keramik, perbedaan grade (KW A/B/C), batu alam, sanitary, atau estimasi armada pengiriman ke lokasi Anda di Jombang?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyPayload,
        }),
      });

      const data = await res.json().catch(() => null);
      const replyText = data?.reply || 
        `Terima kasih atas pertanyaan Anda. Untuk informasi stok dan harga terbaik saat ini, silakan hubungi WhatsApp CS kami di **${STORE_PHONE}** atau kunjungi cabang kami di **Perak & Diwek, Jombang**.`;

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.warn('Network issue calling AI endpoint:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Mohon maaf, saat ini sedang terjadi antrean layanan. Anda dapat langsung bertanya pada staf toko kami di WhatsApp **${STORE_PHONE}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[700px] flex flex-col overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-bold shadow-md ring-2 ring-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Tanya AI Surya Anugrah Keramik
                </h3>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Konsultasi produk keramik, hitung dus, batu alam, & info toko Jombang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome',
                    role: 'model',
                    text: `Percakapan telah direset. Silakan tanyakan seputar ubin keramik, granit, batu alam, sanitair, atau lokasi toko.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-amber-100 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2 text-xs text-stone-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>AI sedang menganalisis katalog & spesifikasi...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-white border-t border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] font-semibold bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-stone-200 transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tanya ukuran keramik, granit, batu alam, atau hitung dus..."
              disabled={isLoading}
              className="flex-1 bg-stone-100 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>

          {/* Quick Footer inside Modal */}
          <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-stone-500">
            <span>Perlu konfirmasi fisik?</span>
            <a
              href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20tanya%20stok%20langsung`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Chat CS Toko ({STORE_PHONE})</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
