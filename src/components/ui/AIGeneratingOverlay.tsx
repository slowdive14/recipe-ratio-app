'use client';

interface AIGeneratingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function AIGeneratingOverlay({
  isVisible,
  message = 'AI 셰프가 요리 중...',
}: AIGeneratingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center animate-bounce-in">
        {/* Cooking Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Pan */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-gray-700 rounded-b-full">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-3 bg-gray-600 rounded-l-full" />
          </div>
          {/* Steam animations */}
          <div className="absolute bottom-10 left-1/4 w-2 h-6 bg-gray-300/60 rounded-full animate-steam-1" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2 h-8 bg-gray-300/60 rounded-full animate-steam-2" />
          <div className="absolute bottom-10 right-1/4 w-2 h-5 bg-gray-300/60 rounded-full animate-steam-3" />
          {/* Food emoji bouncing */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
            🍳
          </div>
        </div>

        {/* Message */}
        <p className="text-xl font-['Jua'] text-[#333333] mb-2">{message}</p>
        <p className="text-sm font-['Gowun_Dodum'] text-gray-500">
          맛있는 이미지를 만들고 있어요
        </p>

        {/* Loading dots */}
        <div className="flex justify-center gap-1 mt-4">
          <span className="w-2 h-2 bg-[#E67E22] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#E67E22] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#E67E22] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes steam-1 {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.6; transform: translateY(-20px) scale(1.2); }
        }
        @keyframes steam-2 {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.6; transform: translateY(-25px) scale(1.3); }
        }
        @keyframes steam-3 {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.6; transform: translateY(-18px) scale(1.1); }
        }
        .animate-steam-1 { animation: steam-1 2s ease-in-out infinite; }
        .animate-steam-2 { animation: steam-2 2.3s ease-in-out infinite 0.3s; }
        .animate-steam-3 { animation: steam-3 1.8s ease-in-out infinite 0.6s; }
      `}</style>
    </div>
  );
}
