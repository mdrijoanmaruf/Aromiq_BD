// Cart functionality
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
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification(`${item.name} (${item.size}) added to cart!`);
    }

    removeItem(name, size) {
        this.cart = this.cart.filter(item => 
            !(item.name === name && item.size === size)
        );
        this.saveCart();
    }

    updateQuantity(name, size, quantity) {
        const item = this.cart.find(cartItem => 
            cartItem.name === name && cartItem.size === size
        );
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
            el.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    showCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            this.renderCart();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
            cartTotal.textContent = '0';
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <div style="flex: 1;">
                    <h6 style="margin: 0 0 5px 0;">${item.name}</h6>
                    <small style="color: #666;">${item.size}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           class="form-control" 
                           style="width: 70px;"
                           onchange="cart.updateQuantity('${item.name}', '${item.size}', this.value)">
                    <span style="min-width: 80px; text-align: right;"><strong>${item.price * item.quantity} Tk</strong></span>
                    <button class="btn btn-sm btn-danger" 
                            onclick="cart.removeItem('${item.name}', '${item.size}'); cart.renderCart();">
                        ×
                    </button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = this.getTotal();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart function
function addToCart(name, size, price) {
    cart.addItem({ name, size, price });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .cart-count {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            padding: 2px 7px;
            font-size: 12px;
            margin-left: 5px;
            font-weight: bold;
        }
        #cartModal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .cart-modal-content {
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            max-width: 500px;
            height: 100%;
            background-color: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }
        .cart-modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }
        .cart-modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
});
