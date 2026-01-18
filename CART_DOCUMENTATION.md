# Shopping Cart System Documentation

## Overview
The Aromiq BD website now features a complete shopping cart system with localStorage integration, checkout process, and WhatsApp order confirmation.

## Features Implemented

### 1. Shopping Cart Functionality
- **Add to Cart**: All "BUY" buttons have been converted to "ADD TO CART" buttons
- **LocalStorage**: Cart data persists across page refreshes
- **Cart Counter**: Real-time cart item count badge in navigation
- **Cart Modal**: Slide-in cart view from the right side

### 2. Cart Modal Features
- View all cart items
- Adjust quantity for each item
- Remove items from cart
- See real-time total
- Proceed to checkout button
- Continue shopping button

### 3. Checkout Page (checkout.html)
Complete checkout form with:
- **Customer Name** (Required)
- **Phone Number** (Required)
- **Email** (Optional)
- **Delivery Address** (Required)
- **Location Selection** (Required):
  - Inside Dhaka: 70 Tk shipping
  - Outside Dhaka: 120 Tk shipping

### 4. Order Processing
- Real-time total calculation with shipping costs
- Order saved to localStorage
- WhatsApp integration for order confirmation
- Automatic cart clearing after order placement
- Order details sent to WhatsApp number: 01641843473

## Product Pricing

### 10 ML Spray Bottles
- Vampire Blood: 349 Tk
- Versace Eros: 349 Tk
- Bleu de Chanel: 349 Tk
- SRK Blend: 349 Tk
- Black Opium: 300 Tk
- Acqua Di Gio: 300 Tk
- Vas Souvage: 300 Tk

### 6 ML Spray Collections
- Vampire Blood: 249 Tk
- Versace Eros: 249 Tk
- SRK Blend: 249 Tk
- Bleu de Chanel: 249 Tk
- Black Opium: 230 Tk
- Acqua Di Gio: 230 Tk
- Vas Souvage: 230 Tk

### 3.5 ML Attor Collections
All fragrances: 149 Tk

## Shipping Costs
- **Inside Dhaka**: 70 Tk
- **Outside Dhaka**: 120 Tk

## Technical Details

### Files Modified/Created
1. **assets/js/cart.js** (NEW)
   - Shopping cart class
   - LocalStorage management
   - Cart operations (add, remove, update)
   - UI updates

2. **checkout.html** (UPDATED)
   - Complete checkout form
   - Order summary
   - Shipping calculation
   - WhatsApp integration

3. **index.html** (UPDATED)
   - Cart modal HTML
   - Updated all BUY buttons to ADD TO CART
   - Cart count badge in navigation
   - Cart script integration

### LocalStorage Keys
- `aromiqCart`: Stores cart items
- `aromiqOrders`: Stores completed orders

### Cart Data Structure
```javascript
{
  name: "Product Name",
  size: "10 ML",
  price: 349,
  quantity: 1
}
```

## How to Use

### For Customers
1. Browse products and click "ADD TO CART"
2. View cart by clicking the cart button in navigation
3. Adjust quantities or remove items in cart modal
4. Click "Proceed to Checkout"
5. Fill in delivery details
6. Select location (Inside/Outside Dhaka)
7. Review total with shipping
8. Click "Place Order"
9. Confirm order via WhatsApp

### For Development
- Cart state is managed in `assets/js/cart.js`
- To modify WhatsApp number, update `checkout.html` line with `whatsappNumber`
- To add new products, use the `addToCart()` function with product details

## Browser Compatibility
- Works on all modern browsers with localStorage support
- Mobile responsive design
- Cart modal slides in from right on all devices

## Future Enhancements (Optional)
- Payment gateway integration
- Email order confirmations
- Order tracking system
- Admin dashboard for order management
- Discount code functionality
