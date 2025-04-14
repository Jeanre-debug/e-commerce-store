// Sample product data
const products = [
    {
        id: 1,
        title: "Minimalist Ceramic Vase",
        price: 34.99,
        oldPrice: 49.99,
        image: "vase.jpeg",
        badge: "Sale",
        description: "Elegant ceramic vase with a modern design. Perfect for fresh or dried flowers. Each piece is handcrafted with attention to detail.",
        options: {
            color: ["White", "Black", "Terracotta"],
            size: ["Small", "Medium", "Large"]
        }
    },
    {
        id: 2,
        title: "Nordic Wall Clock",
        price: 79.99,
        oldPrice: null,
        image: "clock.jpeg",
        badge: "New",
        description: "Silent quartz movement wall clock with a Scandinavian design. Made from sustainable materials with a smooth sweeping hand.",
        options: {
            color: ["Natural Wood", "Black", "White"]
        }
    },
    {
        id: 3,
        title: "Wooden Serving Bowl",
        price: 45.99,
        oldPrice: 59.99,
        image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=500&auto=format&fit=crop",
        badge: "Sale",
        description: "Beautiful wooden serving bowl made from sustainably sourced acacia wood. Each bowl features a unique grain pattern.",
        options: {
            size: ["Medium", "Large"]
        }
    },
    {
        id: 4,
        title: "Linen Table Runner",
        price: 29.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?q=80&w=500&auto=format&fit=crop",
        badge: null,
        description: "100% pure linen table runner with hand-stitched edges. Adds an elegant touch to any dining table.",
        options: {
            color: ["Natural", "Sage", "Terracotta", "Navy"]
        }
    }
];

// Cart state
let cart = [];

// DOM elements
let cartToggle, cartSidebar, cartClose, overlay, cartItems, cartEmpty;
let subtotalAmount, checkoutBtn, cartCount, continueShoppingBtn;
let productModal, modalClose, modalProduct;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing shop");
    
    // Initialize DOM elements for cart and modal
    initializeElements();
    
    // Hide loader after page loads
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }
    
    // Render products
    renderProducts();
    
    // Setup basic event listeners
    setupEventListeners();
    
    // Update collection images
    updateCollectionImages();
    
    // Load cart from localStorage
    loadCart();
    
    // Add animations
    addAnimationStyles();
});

// Initialize elements
function initializeElements() {
    // Cart elements
    cartToggle = document.querySelector('.cart-toggle');
    cartSidebar = document.querySelector('.cart-sidebar');
    cartClose = document.querySelector('.cart-close');
    overlay = document.querySelector('.overlay');
    cartItems = document.querySelector('.cart-items');
    cartEmpty = document.querySelector('.cart-empty');
    subtotalAmount = document.querySelector('.subtotal-amount');
    checkoutBtn = document.querySelector('.checkout-btn');
    cartCount = document.querySelector('.cart-count');
    continueShoppingBtn = document.querySelector('.continue-shopping');
    
    // Modal elements
    productModal = document.querySelector('.product-modal');
    modalClose = document.querySelector('.modal-close');
    modalProduct = document.querySelector('.modal-product');
}

// Add animation styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.3s ease-in-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Render products function
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    if (!productsGrid) {
        console.error("Products grid not found in DOM");
        return;
    }
    
    console.log("Rendering products to grid...");
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">R${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">R${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        // Add event listener for "Add to Cart" button
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(addToCartBtn.dataset.id);
                const productToAdd = products.find(p => p.id === productId);
                if (productToAdd) {
                    addToCart(productToAdd, 1);
                }
            });
        }
        
        // Add event listener for "Quick View" button
        const quickViewBtn = productCard.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(quickViewBtn.dataset.id);
                openQuickView(productId);
            });
        }
        
        // Make the whole card clickable for quick view (except the actions)
        productCard.addEventListener('click', (e) => {
            // Only if they didn't click the actions area
            if (!e.target.closest('.product-actions')) {
                const productId = parseInt(product.id);
                openQuickView(productId);
            }
        });
    });
    
    console.log(`${products.length} products rendered successfully`);
}

// Setup basic event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-close');
    
    if (menuToggle && mobileMenu && mobileClose && overlay) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        mobileClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Cart toggle
    if (cartToggle && cartSidebar && cartClose && overlay) {
        cartToggle.addEventListener('click', function() {
            cartSidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
    }
    
    // Search toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle && searchOverlay && searchClose) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Modal close
    if (modalClose && productModal) {
        modalClose.addEventListener('click', closeQuickView);
    }
    
    // Overlay click (close all)
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (productModal) productModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
}

// Update collection images
function updateCollectionImages() {
    try {
        // Hero image
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1920&auto=format&fit=crop')";
        }
        
        // Collection images
        const collectionImages = [
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556910096-6f5e72db6803?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626753846051-29b992a20448?q=80&w=500&auto=format&fit=crop"
        ];
        
        const collectionItems = document.querySelectorAll('.collection-item img');
        collectionItems.forEach((img, index) => {
            if (index < collectionImages.length) {
                img.src = collectionImages[index];
            }
        });
    } catch (error) {
        console.error("Error updating collection images:", error);
    }
}

// Open quick view modal
function openQuickView(productId) {
    try {
        if (!productModal || !modalProduct || !overlay) {
            console.error("Product modal elements not found");
            return;
        }
        
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error("Product not found:", productId);
            return;
        }
        
        console.log("Opening quick view for:", product.title);
        
        renderProductModal(product);
        
        productModal.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    } catch (error) {
        console.error("Error opening quick view:", error);
    }
}

// Close quick view modal
function closeQuickView() {
    if (productModal && overlay) {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Render product modal
function renderProductModal(product) {
    if (!modalProduct) return;
    
    try {
        modalProduct.innerHTML = `
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-product-info">
                <h2 class="modal-product-title">${product.title}</h2>
                <div class="modal-product-price">
                    <span class="modal-current-price">R${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="modal-old-price">R${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <p class="modal-product-description">${product.description}</p>
                
                <div class="product-options">
                    ${Object.entries(product.options).map(([optionName, values]) => `
                        <div class="product-option">
                            <label class="option-label">${optionName.charAt(0).toUpperCase() + optionName.slice(1)}</label>
                            <div class="options-buttons" data-option="${optionName}">
                                ${values.map((value, index) => `
                                    <button class="option-btn ${index === 0 ? 'selected' : ''}" data-value="${value}">${value}</button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="product-quantity">
                    <label class="option-label">Quantity</label>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn quantity-decrease">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="10">
                        <button class="quantity-btn quantity-increase">+</button>
                    </div>
                </div>
                
                <button class="btn btn-primary modal-add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn btn-outline continue-shopping">Continue Shopping</button>
            </div>
        `;
        
        // Add event listeners for option buttons
        const optionButtons = modalProduct.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all buttons in this option group
                const optionGroup = button.closest('.options-buttons');
                optionGroup.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Add selected class to clicked button
                button.classList.add('selected');
            });
        });
        
        // Add event listeners for quantity buttons
        const quantityInput = modalProduct.querySelector('.quantity-input');
        const decreaseBtn = modalProduct.querySelector('.quantity-decrease');
        const increaseBtn = modalProduct.querySelector('.quantity-increase');
        
        if (decreaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });
        }
        
        if (increaseBtn && quantityInput) {
            increaseBtn.addEventListener('click', () => {
                if (quantityInput.value < 10) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                }
            });
        }
        
        // "Continue Shopping" button
        const continueShoppingBtn = modalProduct.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', closeQuickView);
        }
        
        // "Add to Cart" button
        const addToCartBtn = modalProduct.querySelector('.modal-add-to-cart');
        if (addToCartBtn && quantityInput) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                
                // Get selected options
                const selectedOptions = {};
                Object.keys(product.options).forEach(optionName => {
                    const selectedButton = modalProduct.querySelector(`.options-buttons[data-option="${optionName}"] .option-btn.selected`);
                    if (selectedButton) {
                        selectedOptions[optionName] = selectedButton.dataset.value;
                    }
                });
                
                addToCart(product, quantity, selectedOptions);
                closeQuickView();
            });
        }
        
        // Set up image zoom effect
        setupImageZoom();
    } catch (error) {
        console.error("Error rendering product modal:", error);
    }
}

// Product image zoom effect on quick view
function setupImageZoom() {
    const productImage = document.querySelector('.modal-product-image img');
    if (productImage) {
        productImage.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = productImage.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            
            productImage.style.transformOrigin = `${x}% ${y}%`;
            productImage.style.transform = 'scale(1.5)';
        });
        
        productImage.addEventListener('mouseleave', () => {
            productImage.style.transform = 'scale(1)';
        });
    }
}

// Add to cart function
function addToCart(product, quantity = 1, selectedOptions = {}) {
    try {
        console.log(`Adding to cart: ${product.title}, quantity: ${quantity}`);
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => {
            if (item.id !== product.id) return false;
            
            // Check if options match
            if (Object.keys(selectedOptions).length === 0 && Object.keys(item.selectedOptions || {}).length === 0) {
                return true;
            }
            
            const optionsMatch = Object.keys(selectedOptions).every(key => 
                item.selectedOptions[key] === selectedOptions[key]
            );
            
            return optionsMatch;
        });

        if (existingItemIndex !== -1) {
            // Update quantity if product already in cart
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity,
                selectedOptions: selectedOptions || {}
            });
        }

        // Save cart to localStorage
        saveCart();
        
        // Update cart UI
        updateCartUI();
        
        // Show cart
        if (cartSidebar && overlay) {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        }
        
        // Add animation to cart icon
        if (cartToggle) {
            cartToggle.classList.add('shake');
            setTimeout(() => {
                cartToggle.classList.remove('shake');
            }, 500);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

// Update cart UI
function updateCartUI() {
    try {
        if (!cartCount || !cartEmpty || !cartItems || !subtotalAmount || !checkoutBtn) {
            console.error("Cart UI elements not found");
            return;
        }
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items display
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            cartItems.innerHTML = '';
            subtotalAmount.textContent = 'R0.00';
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Checkout • R0.00';
        } else {
            cartEmpty.style.display = 'none';
            cartItems.style.display = 'block';
            
            // Render cart items
            renderCartItems();
            
            // Update totals
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            subtotalAmount.textContent = `R${subtotal.toFixed(2)}`;
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = `Checkout • R${subtotal.toFixed(2)}`;
        }
    } catch (error) {
        console.error("Error updating cart UI:", error);
    }
}

// Render cart items
function renderCartItems() {
    if (!cartItems) {
        console.error("Cart items element not found");
        return;
    }
    
    try {
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // Format selected options
            const optionsText = Object.entries(item.selectedOptions || {})
                .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                .join(', ');
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    ${optionsText ? `<p class="cart-item-options">${optionsText}</p>` : ''}
                    <p class="cart-item-price">R${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn quantity-decrease" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-index="${index}">
                        <button class="quantity-btn quantity-increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        cartItems.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    updateCartUI();
                }
            });
        });
        
        cartItems.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (cart[index].quantity < 10) {
                    cart[index].quantity++;
                    saveCart();
                    updateCartUI();
                }
            });
        });
        
        cartItems.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const index = parseInt(input.dataset.index);
                const value = parseInt(input.value);
                
                if (value >= 1 && value <= 10) {
                    cart[index].quantity = value;
                } else if (value < 1) {
                    cart[index].quantity = 1;
                    input.value = 1;
                } else if (value > 10) {
                    cart[index].quantity = 10;
                    input.value = 10;
                }
                
                saveCart();
                updateCartUI();
            });
        });
        
        cartItems.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart.splice(index, 1);
                saveCart();
                updateCartUI();
            });
        });
    } catch (error) {
        console.error("Error rendering cart items:", error);
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('jeansCart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('jeansCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        // Reset cart if there's an error
        cart = [];
        updateCartUI();
    }
}