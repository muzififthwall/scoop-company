interface YuleLogPreviewProps {
  selectedFlavour: string | null;
  selectedSauces: string[];
  selectedToppings: string[];
}

const flavourColors: Record<string, string> = {
  "Milk Chocolate": "#8B4513",
  "Dark Chocolate": "#3E2723",
  "Sticky Toffee": "#C4915B",
  "Oreo": "#2B2B2B",
  "Candy Cane": "#E8E8E8",
  "Pistachio": "#87B896",
  "Christmas Pudding": "#4A3427"
};

const sauceColors: Record<string, string> = {
  "Strawberry": "#FF6B9D",
  "Biscoff": "#C19A6B",
  "Cherry": "#DC143C",
  "Nutella": "#6B4423",
  "Luxury White Chocolate": "#F5F5DC",
  "Classic Chocolate": "#654321",
  "Bubblegum": "#FF69B4",
  "Raspberry": "#E30B5D",
  "Bueno": "#D4A574",
  "Lemon Curd": "#F4D03F",
  "Caramel": "#D4A574",
  "Pistachio Cream": "#93C572",
  "Luxury Milk Chocolate": "#8B4513"
};

const toppingStyles: Record<string, { color: string; size: string; pattern: string }> = {
  "Cheesecake Crumb": { color: "#F5E6D3", size: "small", pattern: "crumb" },
  "Seasonal Sprinkles": { color: "#FF6B9D", size: "tiny", pattern: "sprinkle" },
  "Biscoff Crumb": { color: "#C19A6B", size: "small", pattern: "crumb" },
  "Caramelised Nuts": { color: "#D4A574", size: "medium", pattern: "nut" },
  "Unicorn Poop": { color: "#FF69B4", size: "tiny", pattern: "sprinkle" },
  "Mixed Nuts": { color: "#8B7355", size: "medium", pattern: "nut" },
  "Oreo Crumb": { color: "#2B2B2B", size: "small", pattern: "crumb" },
  "Cadbury Pieces": { color: "#7B3F00", size: "medium", pattern: "chunk" },
  "Honeycomb Bites": { color: "#F4D03F", size: "medium", pattern: "chunk" }
};

export function YuleLogPreview({ selectedFlavour, selectedSauces, selectedToppings }: YuleLogPreviewProps) {
  const baseColor = selectedFlavour ? flavourColors[selectedFlavour] : "#D4A574";

  const getToppingElements = () => {
    const elements: JSX.Element[] = [];

    selectedToppings.forEach((topping, toppingIndex) => {
      const style = toppingStyles[topping];
      if (!style) return;

      // Number of pieces to show for this topping
      const pieceCount = style.pattern === "sprinkle" ? 8 : style.pattern === "crumb" ? 6 : 4;

      for (let i = 0; i < pieceCount; i++) {
        const baseOffset = toppingIndex * 50; // Spread different toppings across the log
        const randomOffset = Math.random() * 40 - 20;
        const position = baseOffset + randomOffset + (i * (100 / pieceCount));
        const delay = toppingIndex * 0.2 + i * 0.05;

        elements.push(
          <div
            key={`${topping}-${i}`}
            className="absolute animate-topping-appear"
            style={{
              left: `${Math.min(Math.max(position, 10), 90)}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${delay}s`
            }}
          >
            {style.pattern === "sprinkle" && (
              <div
                className="rounded-full"
                style={{
                  width: "4px",
                  height: "8px",
                  backgroundColor: style.color,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}
              />
            )}
            {style.pattern === "crumb" && (
              <div
                className="rounded-sm"
                style={{
                  width: `${6 + Math.random() * 4}px`,
                  height: `${6 + Math.random() * 4}px`,
                  backgroundColor: style.color,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                }}
              />
            )}
            {style.pattern === "nut" && (
              <div
                className="rounded-full"
                style={{
                  width: `${8 + Math.random() * 4}px`,
                  height: `${6 + Math.random() * 3}px`,
                  backgroundColor: style.color,
                  border: "1px solid rgba(0,0,0,0.2)",
                  transform: `rotate(${Math.random() * 360}deg)`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}
              />
            )}
            {style.pattern === "chunk" && (
              <div
                className="rounded"
                style={{
                  width: `${8 + Math.random() * 4}px`,
                  height: `${8 + Math.random() * 4}px`,
                  backgroundColor: style.color,
                  transform: `rotate(${Math.random() * 45}deg)`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.4)"
                }}
              />
            )}
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-8">
      <div className="relative animate-fade-in-up">
        {/* Plate */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-gradient-to-b from-[#E3C565]/20 to-transparent rounded-full blur-sm" />

        {/* Yule Log Body */}
        <div
          className="relative h-32 rounded-full shadow-xl overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: baseColor }}
        >
          {/* Wood texture effect */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-white"
                style={{ left: `${i * 12.5}%` }}
              />
            ))}
          </div>

          {/* Sauce drizzles - now with actual sauce colors */}
          {selectedSauces.length > 0 && (
            <>
              {selectedSauces.map((sauce, i) => (
                <div
                  key={sauce}
                  className="absolute inset-0 animate-sauce-drizzle"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Drizzle pattern - zigzag across the log */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 300 128"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M 0 ${40 + i * 20} Q 40 ${35 + i * 20}, 75 ${45 + i * 20} T 150 ${40 + i * 20} T 225 ${48 + i * 20} T 300 ${42 + i * 20}`}
                      stroke={sauceColors[sauce] || "#E3C565"}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d={`M 5 ${43 + i * 20} Q 45 ${38 + i * 20}, 80 ${48 + i * 20} T 155 ${43 + i * 20} T 230 ${51 + i * 20} T 300 ${45 + i * 20}`}
                      stroke={sauceColors[sauce] || "#E3C565"}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* Center cream swirl */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#FFF8FB] opacity-90 shadow-inner" />

          {/* Toppings - now with actual topping styles */}
          {selectedToppings.length > 0 && (
            <div className="absolute inset-0">
              {getToppingElements()}
            </div>
          )}
        </div>

        {/* Decorative sparkles */}
        <div className="absolute -top-6 -right-6 text-3xl animate-spin-slow">
          ✨
        </div>
        <div className="absolute -bottom-6 -left-6 text-2xl animate-spin-reverse">
          🎄
        </div>
      </div>
    </div>
  );
}
