import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Phone, 
  RefreshCw, 
  ArrowLeft, 
  Calculator, 
  Building2, 
  Truck, 
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Grid3X3,
  Network
} from 'lucide-react';
import { STORE_PHONE, STORE_WA_NUMBER, STORE_TAGLINE, STORE_BRANCHES } from '../data/storeData';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AiPageProps {
  onBackToPreview: () => void;
  onOpenDiagram: () => void;
  onOpenCalculator: () => void;
}

const FREQUENT_QUESTIONS = [
  'Apa bedanya Keramik BS dengan Keramik Kardusan KW A?',
  'Berapa dus ubin 40x40 cm untuk ruangan kamar 3 x 4 meter?',
  'Berapa dus ubin 60x60 cm untuk ruang tamu 5 x 6 meter?',
  'Rekomendasi jenis batu alam untuk dinding pilar pagar depan',
  'Di mana alamat UD. Khrisna Sakti dan Surya Anugrah Keramik?',
  'Berapa kapasitas muat mobil pick-up dan truk toko?',
  'Apa fungsi dan kelebihan pelapis batu alam (coating)?',
  'Apakah ada pilihan kloset duduk hemat air dan tangki tandon anti lumut?',
];

export const AiPage: React.FC<AiPageProps> = ({
  onBackToPreview,
  onOpenDiagram,
  onOpenCalculator,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Selamat datang di **Tanya AI Surya Anugrah Keramik & UD. Khrisna Sakti** 🏢✨\n\nSaya asisten virtual cerdas yang siap membantu Anda dalam:\n1. **Memilih ubin keramik & granit** (ukuran 25x25 s/d 80x80, Glossy vs Matte, Cutting vs Non-Cutting).\n2. **Memahami perbedaan kualitas**: Keramik BS vs Kardusan KW A, KW B, KW C.\n3. **Menghitung estimasi kebutuhan dus** ruangan & cadangan potongan ubin.\n4. **Rekomendasi batu alam & sanitary**: Wall cladding, andesit RTM/RTA, koral hias taman, tandon air, kloset, dan sink.\n5. **Informasi pengiriman armada toko** ke wilayah Anda di Jombang.\n\nApa yang ingin Anda tanyakan hari ini?`,
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
    scrollToBottom();
  }, [messages]);

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
        text: `Mohon maaf, saat ini sedang terjadi antrean layanan. Anda dapat langsung bertanya pada staf toko kami di WhatsApp **${STORE_PHONE}** atau datang langsung ke cabang **UD. Khrisna Sakti (Perak)** & **Surya Anugrah Keramik (Diwek)**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen py-8 sm:py-10 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-300">
          <button
            onClick={onBackToPreview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold transition-all self-start shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>Kembali ke Preview & Katalog Produk</span>
          </button>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenDiagram}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold transition-all shadow"
            >
              <Network className="w-4 h-4 text-amber-400" />
              <span>Buka Halaman Bagan</span>
            </button>

            <a
              href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20tanya%20harga`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chat CS Toko ({STORE_PHONE})</span>
            </a>
          </div>
        </div>

        {/* Main AI Chat Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Panel: Prompt Ideas & Store Info (4 cols) */}
          <div className="lg:col-span-4 bg-stone-900 text-stone-100 p-5 sm:p-6 space-y-6 flex flex-col justify-between border-r border-stone-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Tanya AI Surya Keramik
                  </h3>
                  <span className="text-[10px] text-amber-400 font-medium">
                    Didukung Katalog Resmi & Spesifikasi Toko
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                Tanyakan apa saja seputar pemilihan ubin keramik, marmer granit, batu alam, sanitair, atau hitung perkiraan dus untuk ruangan Anda.
              </p>

              {/* Prompt Suggestions */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
                  Contoh Pertanyaan Populer:
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {FREQUENT_QUESTIONS.slice(0, 5).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isLoading}
                      className="w-full text-left p-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-[11px] text-stone-200 hover:text-white border border-stone-700/80 transition-colors flex items-start gap-2"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Store Physical Info */}
            <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                2 Toko Fisik di Jombang:
              </span>
              <div className="space-y-1 text-[11px] text-stone-300">
                <p>• <b>UD. Khrisna Sakti</b> - Temuwulan, Perak</p>
                <p>• <b>Surya Anugrah Keramik</b> - Balongbesuk, Diwek</p>
                <p>• <b>Armada Mandiri</b>: Truk & Pick-Up toko</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Stream & Input (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-stone-50 h-[640px]">
            
            {/* Top Toolbar */}
            <div className="p-3.5 px-5 bg-white border-b border-stone-200 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Asisten AI Siap Menjawab
              </span>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'model',
                      text: `Percakapan telah direset. Silakan tanyakan hal lain seputar kebutuhan keramik atau bangunan Anda!`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Chat Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-amber-600 text-white rounded-br-none'
                          : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line space-y-1.5">
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                      <span
                        className={`block text-[10px] mt-2 ${
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
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2.5 text-xs text-stone-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>AI sedang menyusun jawaban berdasarkan katalog produk...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="p-4 bg-white border-t border-stone-200 space-y-2">
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
                  placeholder="Ketik pertanyaan Anda di sini... (contoh: beda KW A dan KW B)"
                  disabled={isLoading}
                  className="flex-1 bg-stone-100 border border-stone-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isLoading}
                  className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 pt-1">
                <span>Ingin konsultasi langsung dengan pemilik toko?</span>
                <a
                  href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20konsultasi%20langsung`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-extrabold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp: {STORE_PHONE}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
