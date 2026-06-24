document.addEventListener('DOMContentLoaded', () => {
    
    // سلة المشتريات التخزينية (State Area)
    let cart = [];

    // العناصر البرمجية
    const cartSidebar = document.getElementById('cart-sidebar');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const completePaymentBtn = document.getElementById('complete-payment-btn');
    const searchInput = document.getElementById('store-search');
    const toast = document.getElementById('action-toast');

    // --- 1. فتح وإغلاق عربة التسوق الجانبية ---
    openCartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // --- 2. إدارة عملية إضافة الألعاب للسلة ---
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const price = parseFloat(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');

        // التحقق من عدم تكرار اللعبة في السلة
        const exists = cart.find(item => item.id === id);
        if (exists) {
            triggerToast("Game already added to vault bag!");
            return;
        }

        cart.push({ id, title, price, img });
        updateCartUI();
        triggerToast(`Added: ${title}`);
    });

    // --- 3. تحديث واجهة السلة حسابياً وبصرياً ---
    function updateCartUI() {
        cartCountBadge.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
            cartTotalPriceElement.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <i class="fa-solid fa-trash-can remove-item-btn" data-index="${index}"></i>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalPriceElement.textContent = `$${total.toFixed(2)}`;
    }

    // --- 4. حذف الألعاب من السلة ---
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateCartUI();
        }
    });

    // --- 5. نظام التشيك أوت والنافذة المنبثقة للدفع الوهمي ---
    checkoutBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        paymentModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => paymentModal.classList.remove('open'));

    // تفاعل تبديل طرق الدفع الوهمية
    const payMethods = document.querySelectorAll('.pay-method');
    payMethods.forEach(method => {
        method.addEventListener('click', () => {
            payMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });

  // --- التعديل الذكي للتحقق من بيانات الدفع الوهمي ---
completePaymentBtn.addEventListener('click', (e) => {
    // الحصول على الفورم نفسه
    const paymentForm = document.getElementById('mock-payment-form');
    
    // التحقق من أن جميع المدخلات المطلوبة (required) تم ملؤها بشكل صحيح
    if (!paymentForm.checkValidity()) {
        // إذا كانت هناك حقول فارغة، اجبر المتصفح على إظهار رسائل الخطأ الافتراضية
        paymentForm.reportValidity();
        return; // أوقف العملية فوراً ولا تسمح بإتمام الدفع
    }

    // إذا كانت البيانات مكتوبة، نفذ الدفع بنجاح
    paymentModal.classList.remove('open');
    alert("🎮 Simulation Successful!\n\nYour fake transaction has been authorized.\nThe game titles have been appended to your library instantly.");
    cart = [];
    updateCartUI();
});
    // --- 6. محرك بحث الكتالوج الفوري ---
    searchInput.addEventListener('keyup', (e) => {
        const value = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('#catalog-grid-wrapper .store-card');

        cards.forEach(card => {
            const title = card.getAttribute('data-title');
            if (title.includes(value)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // سكريبت الإشعارات السفلي السريع
    function triggerToast(msg) {
        toast.textContent = msg;
        toast.classList.add('reveal');
        setTimeout(() => toast.classList.remove('reveal'), 2500);
    }
});