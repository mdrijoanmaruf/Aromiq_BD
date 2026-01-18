// Cart functionality - Premium Design
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const cartData = localStorage.getItem('aromiqCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        localStorage.setItem('aromiqCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addItem(item) {
        const existingItem = this.cart.find(cartItem => 
            cartItem.name === item.name && cartItem.size === item.size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }

        this.saveCart();
        this.showNotification(`${item.name} (${item.size}) added!`);
    }

    removeItem(name, size) {
        this.cart = this.cart.filter(item => !(item.name === name && item.size === size));
        this.saveCart();
    }

    updateQuantity(name, size, quantity) {
        const item = this.cart.find(cartItem => cartItem.name === name && cartItem.size === size);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(name, size);
            } else {
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

    showNotification(message) {
        const existing = document.querySelector('.cart-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `<span class="toast-icon">✓</span><span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    showCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            this.renderCart();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    hideCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    renderCart() {
        const container = document.getElementById('cartItems');
        const totalEl = document.getElementById('cartTotal');
        const countEl = document.getElementById('cartItemCount');
        
        if (!container) return;

        const count = this.getItemCount();
        if (countEl) countEl.textContent = count;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <span>Add fragrances to get started</span>
                </div>`;
            totalEl.textContent = '0';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-left">
                    <div class="item-name">${item.name}</div>
                    <div class="item-meta"><span class="item-size">${item.size}</span> • <span class="item-unit">৳${item.price}</span></div>
                </div>
                <div class="item-right">
                    <div class="qty-box">
                        <button onclick="cart.updateQuantity('${item.name}', '${item.size}', ${item.quantity - 1}); cart.renderCart();">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.name}', '${item.size}', ${item.quantity + 1}); cart.renderCart();">+</button>
                    </div>
                    <div class="item-total">৳${item.price * item.quantity}</div>
                    <button class="del-btn" onclick="cart.removeItem('${item.name}', '${item.size}'); cart.renderCart();">×</button>
                </div>
            </div>
        `).join('');

        totalEl.textContent = this.getTotal();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart function
function addToCart(name, size, price) {
    cart.addItem({ name, size, price });
}

// DOM Ready - Inject styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Toast */
        .cart-toast {
            position: fixed;
            top: 15px;
            right: 15px;
            background: #1a1a2e;
            color: #fff;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 6px 24px rgba(0,0,0,0.3);
            z-index: 10001;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .cart-toast .toast-icon {
            background: #27ae60;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        .cart-toast.show { transform: translateX(0); }

        /* Badge */
        .cart-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #e74c3c;
            color: #fff;
            border-radius: 50%;
            min-width: 18px;
            height: 18px;
            font-size: 10px;
            font-weight: 700;
            margin-left: 4px;
        }

        /* Modal Overlay */
        #cartModal {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0);
            z-index: 9999;
            pointer-events: none;
            transition: background 0.25s;
        }
        #cartModal.open {
            background: rgba(0,0,0,0.5);
            pointer-events: auto;
        }

        /* Drawer */
        .cart-drawer {
            position: absolute;
            right: 0;
            top: 0;
            width: 340px;
            max-width: 100%;
            height: 100%;
            background: #fff;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: -4px 0 20px rgba(0,0,0,0.1);
        }
        #cartModal.open .cart-drawer { transform: translateX(0); }

        /* Header */
        .cart-header {
            padding: 14px 16px;
            background: #1a1a2e;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-header h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cart-header h3::before { content: '🛒'; font-size: 16px; }
        .cart-header .item-count {
            background: rgba(255,255,255,0.2);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-left: 6px;
        }
        .close-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }

        /* Body */
        .cart-body {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }
        .cart-body::-webkit-scrollbar { width: 3px; }
        .cart-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

        /* Empty */
        .cart-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #999;
            text-align: center;
            padding: 20px;
        }
        .cart-empty .empty-icon { font-size: 40px; opacity: 0.3; margin-bottom: 10px; }
        .cart-empty p { margin: 0; font-weight: 600; color: #555; font-size: 14px; }
        .cart-empty span { font-size: 12px; margin-top: 4px; }

        /* Items */
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            gap: 10px;
        }
        .cart-item:hover { background: #fafafa; }
        .item-left { flex: 1; min-width: 0; }
        .item-name {
            font-weight: 600;
            font-size: 13px;
            color: #333;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .item-meta { font-size: 11px; color: #888; margin-top: 2px; }
        .item-right { display: flex; align-items: center; gap: 8px; }
        
        /* Qty */
        .qty-box {
            display: flex;
            align-items: center;
            background: #f0f0f0;
            border-radius: 6px;
        }
        .qty-box button {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            transition: background 0.15s;
        }
        .qty-box button:hover { background: #e0e0e0; }
        .qty-box span {
            width: 22px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
        }
        
        .item-total { font-weight: 700; font-size: 13px; color: #6c5ce7; min-width: 50px; text-align: right; }
        
        .del-btn {
            width: 22px;
            height: 22px;
            border: none;
            background: #fee;
            color: #e74c3c;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.15s;
        }
        .del-btn:hover { background: #e74c3c; color: #fff; }

        /* Footer */
        .cart-footer {
            padding: 14px 16px;
            background: #f8f8f8;
            border-top: 1px solid #eee;
        }
        .cart-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .cart-total-row span:first-child { font-size: 13px; color: #666; }
        .cart-total-row .total-amount { font-size: 20px; font-weight: 700; color: #27ae60; }
        
        .checkout-btn {
            width: 100%;
            padding: 11px;
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,92,231,0.4); }
        .checkout-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
        
        .continue-link {
            display: block;
            text-align: center;
            margin-top: 8px;
            color: #888;
            font-size: 11px;
            text-decoration: none;
        }
        .continue-link:hover { color: #6c5ce7; }

        @media (max-width: 380px) {
            .cart-drawer { width: 100%; }
            .cart-item { padding: 10px 12px; }
        }
    `;
    document.head.appendChild(style);
});
