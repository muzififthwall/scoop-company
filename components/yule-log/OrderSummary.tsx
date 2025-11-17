import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";

export interface CartItem {
  id: string;
  flavour: string;
  sauces: string[];
  toppings: string[];
  quantity: number;
}

interface OrderSummaryProps {
  cart: CartItem[];
  onEditItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onCheckout: () => void;
}

const BASE_PRICE = 29.99;

export function OrderSummary({
  cart,
  onEditItem,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}: OrderSummaryProps) {
  const cartTotal = cart.reduce((total, item) => {
    const itemPrice = BASE_PRICE * item.quantity;
    return total + itemPrice;
  }, 0);

  const isCartEmpty = cart.length === 0;

  return (
    <Card className="p-6 bg-white border-2 border-[#E3C565]/30 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5 text-[#E3C565]" />
        <h3 className="text-[#3D2B1F] font-semibold text-lg">Your Cart</h3>
      </div>

      {isCartEmpty ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🎄</div>
          <p className="text-[#3D2B1F]/60 mb-2">Your cart is empty</p>
          <p className="text-sm text-[#3D2B1F]/40">Build your Yule Log and add it to cart!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {cart.map((item, index) => {
              const itemPrice = BASE_PRICE * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-[#FFF8FB] rounded-xl p-4 border border-[#E3C565]/20 animate-slide-in-left"
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-[#3D2B1F] font-medium">
                        Yule Log #{index + 1}
                      </p>
                      <p className="text-sm text-[#3D2B1F]/60">{item.flavour}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditItem(item.id)}
                        className="h-8 w-8 text-[#3D2B1F]/60 hover:text-[#3D2B1F] hover:bg-[#E3C565]/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-8 w-8 text-[#F8AFC8] hover:text-[#F8AFC8]/80 hover:bg-[#F8AFC8]/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Details */}
                  {(item.sauces.length > 0 || item.toppings.length > 0) && (
                    <div className="text-xs text-[#3D2B1F]/60 mb-3 space-y-1">
                      {item.sauces.length > 0 && (
                        <p>Sauces: {item.sauces.join(", ")}</p>
                      )}
                      {item.toppings.length > 0 && (
                        <p>Toppings: {item.toppings.join(", ")}</p>
                      )}
                    </div>
                  )}

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 rounded-md border-[#E3C565]/30"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-[#3D2B1F] w-6 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="h-7 w-7 rounded-md border-[#E3C565]/30"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-[#2E4E3F] font-semibold">
                      £{itemPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-[#E3C565]/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#3D2B1F] font-semibold">Total</span>
              <span className="text-2xl text-[#2E4E3F] font-bold">
                £{cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={onCheckout}
              disabled={isCartEmpty}
              className="w-full bg-[#F8AFC8] hover:bg-[#F8AFC8]/90 text-[#3D2B1F] py-6 rounded-xl shadow-lg font-semibold"
            >
              Proceed to Checkout 🎄
            </Button>

            <p className="text-xs text-center text-[#3D2B1F]/50 mt-2">
              Please allow 72 hours&apos; notice for collection.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
