import { Check } from "lucide-react";

interface FlavourCardProps {
  emoji?: string;
  image?: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  color?: string;
  textColor?: string;
}

export function FlavourCard({ emoji, image, name, isSelected, onClick, color, textColor = "text-[#3D2B1F]" }: FlavourCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-2xl transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-98 ${
        isSelected
          ? `bg-gradient-to-br ${color} shadow-2xl border-4 border-[#F8AFC8]`
          : `bg-gradient-to-br ${color} shadow-lg hover:shadow-xl border-2 border-white/20 opacity-80 hover:opacity-100`
      }`}
    >
      {isSelected && (
        <div
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-[#F8AFC8] flex items-center justify-center shadow-lg border-2 border-white animate-scale-in"
        >
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        {image ? (
          <div className="w-16 h-16 flex items-center justify-center">
            <img src={image} alt={name} className="w-full h-full object-contain" />
          </div>
        ) : null}
        <span className={`text-center ${textColor} ${isSelected ? 'font-medium' : ''}`}>
          {name}
        </span>
      </div>
    </button>
  );
}
