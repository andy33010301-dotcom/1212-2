import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Utensils, Coffee, IceCream, ChefHat, X, CheckCircle } from 'lucide-react';

// 模擬菜單資料 (已更新穩定圖源)
const MENU_CATEGORIES = [
  { id: 'all', name: '全部餐點', icon: <ChefHat size={18} /> },
  { id: 'main', name: '主食系列', icon: <Utensils size={18} /> },
  { id: 'snack', name: '精緻小點', icon: <IceCream size={18} /> },
  { id: 'drink', name: '特調飲品', icon: <Coffee size={18} /> },
];

const MENU_ITEMS = [
  {
    id: 1,
    category: 'main',
    name: '招牌紅燒牛肉麵',
    price: 180,
    description: '慢火燉煮牛腱心，搭配手工拉麵。',
    // 更新為更穩定的牛肉麵圖片
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    category: 'main',
    name: '日式厚切炸豬排飯',
    price: 160,
    description: '酥脆多汁豬排，淋上特製豬排醬。',
    // 更新為炸豬排類圖片
    image: 'https://images.unsplash.com/photo-1599354607490-64213978351f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    category: 'main',
    name: '泰式綠咖哩雞肉飯',
    price: 150,
    description: '微辣椰奶風味，搭配香米飯。',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    category: 'snack',
    name: '酥炸黃金豆腐',
    price: 60,
    description: '外酥內嫩，搭配蒜蓉醬油膏。',
    // 更新圖片
    image: 'https://plus.unsplash.com/premium_photo-1664478291780-0c66f5569990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    category: 'snack',
    name: '現炸脆薯',
    price: 50,
    description: '美式粗薯條，撒上特製香料。',
    // 更新為薯條圖片
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    category: 'snack',
    name: '韓式泡菜',
    price: 45,
    description: '爽口開胃，解膩首選。',
    // 再次更新韓式泡菜圖片，改用更穩定的來源
    image: 'https://images.unsplash.com/photo-1709650085810-70f90059c948?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    category: 'drink',
    name: '珍珠奶茶',
    price: 65,
    description: 'Q彈珍珠搭配濃郁奶香。',
    // 再次更換珍珠奶茶圖片，改用經典奶茶樣式
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    category: 'drink',
    name: '鮮檸檬紅茶',
    price: 55,
    description: '新鮮檸檬切片，酸甜清爽。',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

interface CartItem {
  id: number;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

export default function OrderingSystem() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null); 
  const [animateCartIcon, setAnimateCartIcon] = useState(false); 

  // 根據分類篩選菜單
  const filteredItems = activeCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  // 顯示 Toast 訊息
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // 加入購物車
  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    
    // 觸發反饋
    showToast(`已加入 ${item.name}`);
    setAnimateCartIcon(true);
    setTimeout(() => setAnimateCartIcon(false), 300);
  };

  // 更新數量
  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
    });
  };

  // 移除項目
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 計算總價
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 送出訂單
  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    setShowOrderSuccess(true);
    // 模擬 API 呼叫
    setTimeout(() => {
      setCart([]);
      setShowOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  // 圖片載入失敗處理函式
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // 防止無限迴圈
    // 使用一個灰底加上文字的圖片作為替代
    target.src = "https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* --- 左側/主畫面：菜單區 --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white shadow-sm z-10 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              <ChefHat className="text-orange-600" />
              美味食堂
            </h1>
            <p className="text-xs text-gray-500 mt-1">線上點餐，美味即享</p>
          </div>
          
          {/* Mobile Cart Trigger */}
          <button 
            className={`md:hidden relative p-2 bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 transition transform ${animateCartIcon ? 'scale-125' : ''}`}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce-short">
                {totalItems}
              </span>
            )}
          </button>
        </header>

        {/* Categories Tab */}
        <div className="bg-white border-b overflow-x-auto whitespace-nowrap px-4 py-3 scrollbar-hide">
          <div className="flex space-x-2">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
                <div className="h-48 overflow-hidden relative group bg-gray-100 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={handleImageError}
                  />
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <span className="bg-orange-100 text-orange-700 text-sm font-bold px-2 py-1 rounded-lg">
                      ${item.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 active:scale-95 transform"
                  >
                    <Plus size={18} />
                    加入購物車
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <Utensils size={48} className="mb-4 opacity-50" />
               <p>此分類暫無餐點</p>
             </div>
          )}
        </div>
      </div>

      {/* --- 右側/遮罩：購物車區 --- */}
      
      {/* 遮罩背景 (Mobile only) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* 購物車面板 */}
      <div className={`fixed md:relative inset-y-0 right-0 z-30 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} flex flex-col h-full border-l border-gray-200`}>
        
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className={`text-orange-600 transition-transform ${animateCartIcon ? 'scale-125' : ''}`} />
            <h2 className="text-lg font-bold text-gray-800">您的餐點</h2>
            <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {totalItems}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p>購物車是空的</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="md:hidden text-orange-600 font-medium"
              >
                去點餐
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                   <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={handleImageError}
                      />
                   </div>
                   <div className="flex-1 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                       <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                       <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                     <div className="flex justify-between items-end">
                       <div className="text-orange-600 font-bold">${item.price * item.quantity}</div>
                       <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-gray-200 rounded-l-lg text-gray-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-gray-200 rounded-r-lg text-gray-600"
                          >
                            <Plus size={14} />
                          </button>
                       </div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部結帳區 */}
        <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>小計</span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>總計</span>
              <span className="text-orange-600">${totalAmount}</span>
            </div>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={handleSubmitOrder}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              cart.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200'
            }`}
          >
            {cart.length === 0 ? '請先選擇餐點' : '送出訂單'}
          </button>
        </div>
      </div>

      {/* Toast Notification (新增) */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 md:top-auto md:bottom-8 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up flex items-center gap-3">
          <CheckCircle size={20} className="text-green-400" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* 訂單成功 Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">訂單已送出！</h3>
            <p className="text-gray-500 mb-6">廚房正在為您準備美味餐點，請耐心等候。</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 animate-progress-bar w-full origin-left" style={{animationDuration: '3s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-bar {
          animation-name: progress-bar;
          animation-timing-function: linear;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out 1;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}