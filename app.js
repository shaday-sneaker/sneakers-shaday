/**
 * ==========================================================================
 * SNEAKERS SHADAY - LÓGICA DE TIENDA PÚBLICA (BOTÓN FLOTANTE & 30 MODELOS)
 * ==========================================================================
 */

const STORE_CONFIG = {
  storeName: "Sneakers Shaday",
  whatsappNumber: "59169576123", // Número de WhatsApp oficial en Bolivia
  currency: "Bs."
};

// BASE DE DATOS DE LOS 30 MODELOS OFICIALES
const OFFICIAL_30_SNEAKERS = [
  { id: 'snk-001', nombre: 'Air Jordan 4 Retro Tour Yellow', marca: 'Jordan', precio: 950, tallas: [39,40,41,42,43], badge: 'Más Vendido', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Silueta icónica con acabado en cuero sintético y malla transpirable. Amortiguación Air-Sole.' },
  { id: 'snk-002', nombre: 'Air Jordan 1 Retro Low OG Last Dance', marca: 'Jordan', precio: 780, tallas: [38,39,40,41,42], badge: 'Tendencia', imagen_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=700&q=80', descripcion: 'Perfil bajo con mezcla de tonos negros, blancos y rojos legendarios. Suela de goma resistente.' },
  { id: 'snk-003', nombre: 'Nike Dunk Low Retro Panda', marca: 'Nike', precio: 650, tallas: [38,39,40,41,42,43], badge: 'Drop Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80', descripcion: 'El par streetwear más popular a nivel mundial. Contraste blanco y negro limpio.' },
  { id: 'snk-004', nombre: 'Nike Air Bakin Varsity Royal', marca: 'Nike', precio: 890, tallas: [40,41,42,43], badge: 'Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', descripcion: 'Líneas fluidas y cámara de aire visible en azul eléctrico. Estilo retro basket urbano.' },
  { id: 'snk-005', nombre: 'Adidas Forum Low Classic White', marca: 'Adidas', precio: 590, tallas: [38,39,40,41,42], badge: 'Clásico', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Inspirada en el basketball de los años 80, equipada con correa en el tobillo.' },
  { id: 'snk-006', nombre: 'Adidas Yeezy Boost 350 V2 Onyx', marca: 'Adidas', precio: 1100, tallas: [39,40,41,42], badge: 'Premium', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Tecnología Primeknit con entresuela traslúcida que envuelve el sistema BOOST.' },
  { id: 'snk-007', nombre: 'New Balance 550 White Green', marca: 'New Balance', precio: 720, tallas: [39,40,41,42,43], badge: 'Retro Trend', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'El regreso de un clásico de 1989. Estética vintage y logotipo N en verde bosque.' },
  { id: 'snk-008', nombre: 'Air Jordan 9 Retro Space Jam', marca: 'Jordan', precio: 1050, tallas: [40,41,42,43], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=700&q=80', descripcion: 'Edición conmemorativa con grabado multilingüe en la suela y soporte de tobillo.' },
  { id: 'snk-009', nombre: 'Nike Air Force 1 07 Triple White', marca: 'Nike', precio: 620, tallas: [37,38,39,40,41,42,43,44], badge: 'Básico Esencial', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'El clásico absoluto en blanco impoluto con amortiguación Nike Air encapsulada.' },
  { id: 'snk-010', nombre: 'Nike SB Dunk Low Pro Wheat', marca: 'Nike', precio: 790, tallas: [39,40,41,42], badge: 'Skate Culture', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza marrón premium con suela de goma antiadherente de máxima durabilidad.' },
  { id: 'snk-011', nombre: 'Air Jordan 1 High Travis Mocha Custom', marca: 'Jordan', precio: 1250, tallas: [40,41,42,43], badge: 'Ultra Hype', imagen_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=80', descripcion: 'Detalle de Swoosh invertido y tonos café mocha con gamuza suave de alta calidad.' },
  { id: 'snk-012', nombre: 'Adidas Samba OG Cloud White', marca: 'Adidas', precio: 680, tallas: [38,39,40,41,42,43], badge: 'Top Ventas', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera en T de ante con suela de caramelo flexible. La silueta viral más codiciada.' },
  { id: 'snk-013', nombre: 'Adidas Gazelle Indoor Bold Blue', marca: 'Adidas', precio: 640, tallas: [38,39,40,41,42], badge: 'Vintage', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza azul cobalto vibrante con las 3 franjas dentadas en contraste.' },
  { id: 'snk-014', nombre: 'New Balance 2002R Protection Pack Rain Cloud', marca: 'New Balance', precio: 890, tallas: [40,41,42,43], badge: 'Destacado', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Efecto deconstruido con capas de ante grisáceo y tecnología N-ergy.' },
  { id: 'snk-015', nombre: 'New Balance 9060 Sea Salt Cherry', marca: 'New Balance', precio: 920, tallas: [38,39,40,41,42], badge: 'Futurista', imagen_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño audaz con entresuela de cápsulas esculpidas y absorción ABZORB.' },
  { id: 'snk-016', nombre: 'Nike Air Max 1 86 Big Bubble', marca: 'Nike', precio: 820, tallas: [39,40,41,42,43], badge: 'Edición Especial', imagen_url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=700&q=80', descripcion: 'Recreación exacta del lanzamiento original con cámara de aire visible ampliada.' },
  { id: 'snk-017', nombre: 'Air Jordan 3 Retro White Cement', marca: 'Jordan', precio: 1150, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=700&q=80', descripcion: 'Estampado Elephant Print original, cuero granulado y logotipo Nike Air vintage.' },
  { id: 'snk-018', nombre: 'Air Jordan 11 Retro Jubilee 25th', marca: 'Jordan', precio: 1200, tallas: [40,41,42,43], badge: 'Edición Limitada', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Charol negro brillante de corte alto con fibra de carbono en la placa media.' },
  { id: 'snk-019', nombre: 'Adidas Campus 00s Core Black', marca: 'Adidas', precio: 610, tallas: [37,38,39,40,41,42], badge: 'Streetwear', imagen_url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=80', descripcion: 'Estilo skate de los años 2000 con lengüeta acolchada y cordones extra anchos.' },
  { id: 'snk-020', nombre: 'Vans Old Skool Classic Black White', marca: 'Vans', precio: 450, tallas: [37,38,39,40,41,42,43], badge: 'Clásico Skater', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona resistente combinada con ante y suela waffle de goma vulcanizada duradera.' },
  { id: 'snk-021', nombre: 'Vans Sk8-Hi Pro Black White', marca: 'Vans', precio: 490, tallas: [38,39,40,41,42], badge: 'Caña Alta', imagen_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80', descripcion: 'Bota acolchada con refuerzo en la puntera para mayor soporte y durabilidad.' },
  { id: 'snk-022', nombre: 'Converse Chuck 70 High Vintage Black', marca: 'Converse', precio: 480, tallas: [37,38,39,40,41,42,43], badge: 'Económico', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona premium de 12 oz, costuras vintage y plantilla OrthoLite acolchada.' },
  { id: 'snk-023', nombre: 'Puma Suede Classic XXI Negro', marca: 'Puma', precio: 470, tallas: [38,39,40,41,42], badge: 'Urbano Retro', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza auténtica, raya Formstrip distintiva y diseño clásico vigente desde 1968.' },
  { id: 'snk-024', nombre: 'Puma Slipstream Bball Heritage', marca: 'Puma', precio: 540, tallas: [39,40,41,42,43], badge: 'Novedad', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Reinvención del calzado de baloncesto con inserciones geométricas de cuero.' },
  { id: 'snk-025', nombre: 'Air Jordan 1 Mid Chicago Toe', marca: 'Jordan', precio: 850, tallas: [39,40,41,42,43], badge: 'Popular', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Colores legendarios Chicago Bulls en corte medio para uso diario con estilo.' },
  { id: 'snk-026', nombre: 'Nike Cortez Classic Leather White Red', marca: 'Nike', precio: 560, tallas: [38,39,40,41,42], badge: 'Vintage Run', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño liviano de perfil bajo con entresuela de EVA acolchada.' },
  { id: 'snk-027', nombre: 'ASICS GEL-Kayano 14 Metallic Silver', marca: 'ASICS', precio: 860, tallas: [39,40,41,42,43], badge: 'Tendencia Y2K', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Estética plateada running con amortiguación de tecnología GEL.' },
  { id: 'snk-028', nombre: 'New Balance 1906R Castlerock', marca: 'New Balance', precio: 880, tallas: [40,41,42,43], badge: 'Tech Runner', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'Estructura técnica con soporte de arco N-lock y absorción superior.' },
  { id: 'snk-029', nombre: 'Adidas Superstar 82 Core White Black', marca: 'Adidas', precio: 580, tallas: [38,39,40,41,42,43], badge: 'Leyenda Urbana', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera de concha clásica con tres franjas dentadas en negro.' },
  { id: 'snk-030', nombre: 'Air Jordan 5 Retro Fire Red Silver', marca: 'Jordan', precio: 1100, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Lengüeta reflectante 3M y suela con dientes de tiburón inspirados en aviones caza.' }
];

let allSneakers = [];
let selectedCategory = "todos";
let selectedSizeFilter = "";
let currentSearchTerm = "";
let currentSortOrder = "default";
let selectedModalProduct = null;
let selectedModalSize = null;
let shoppingCart = JSON.parse(localStorage.getItem("shaday_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("shaday_current_user")) || null;

document.addEventListener("DOMContentLoaded", () => {
  initStore();
  renderAuthHeader();
  setupEventListeners();
});

function initStore() {
  const stored = JSON.parse(localStorage.getItem("shaday_admin_products"));
  if (stored && stored.length > 0) {
    allSneakers = stored;
  } else {
    allSneakers = [...OFFICIAL_30_SNEAKERS];
    localStorage.setItem("shaday_admin_products", JSON.stringify(allSneakers));
  }

  renderProducts();
  updateCartBadge();
}

/**
 * ==========================================================================
 * SNEAKERS SHADAY - RENDER AUTH HEADER LIMPIO (RESPONSIVE)
 * ==========================================================================
 */

function renderAuthHeader() {
  const container = document.getElementById("authHeaderContainer");
  if (!container) return;

  if (currentUser) {
    const isAdmin = currentUser.rol === "admin" || currentUser.rol === "vendedor";
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        ${isAdmin ? `
          <a href="admin.html" class="header-icon-btn admin-btn" title="Panel de Administración">
            <i class="fa-solid fa-gauge-high"></i>
          </a>
        ` : ''}
        <button class="header-icon-btn logout-btn" onclick="handleLogout()" title="Cerrar sesión (${currentUser.nombre})">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="header-icon-btn" onclick="openAuthModal()" title="Iniciar Sesión">
        <i class="fa-solid fa-user"></i>
      </button>
    `;
  }
}

window.openAuthModal = () => document.getElementById("authModal").classList.add("active");
window.closeAuthModal = () => document.getElementById("authModal").classList.remove("active");

window.switchAuthTab = function(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLoginBtn");
  const tabReg = document.getElementById("tabRegisterBtn");

  if (tab === 'login') {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    tabLogin.classList.add("active");
    tabReg.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    tabReg.classList.add("active");
    tabLogin.classList.remove("active");
  }
};

window.handleLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (email === "admin@shaday.com" && password === "admin123") {
    currentUser = { id: "usr-admin-master", nombre: "Administrador Shaday", email: email, rol: "admin" };
    localStorage.setItem("shaday_current_user", JSON.stringify(currentUser));
    alert("¡Bienvenido al Panel de Control de Sneakers Shaday!");
    window.location.href = "admin.html";
    return;
  }

  const usersList = JSON.parse(localStorage.getItem("shaday_users_list")) || [];
  const found = usersList.find(u => u.email === email && u.password === password);

  if (found) {
    currentUser = { id: found.id, nombre: found.nombre, email: found.email, rol: found.rol };
    localStorage.setItem("shaday_current_user", JSON.stringify(currentUser));
    alert(`¡Hola de nuevo, ${found.nombre}!`);
    closeAuthModal();
    renderAuthHeader();
    if (found.rol === "admin" || found.rol === "vendedor") {
      window.location.href = "admin.html";
    }
    return;
  }

  alert("Credenciales incorrectas.\n\nPara acceder como Administrador usa:\nCorreo: admin@shaday.com\nContraseña: admin123");
};

window.handleRegister = function(e) {
  e.preventDefault();
  const nombre = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;

  let usersList = JSON.parse(localStorage.getItem("shaday_users_list")) || [];
  if (usersList.some(u => u.email === email)) {
    alert("Este correo ya se encuentra registrado.");
    return;
  }

  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    nombre: nombre,
    email: email,
    password: password,
    rol: "cliente",
    fecha: new Date().toLocaleDateString("es-BO")
  };

  usersList.push(newUser);
  localStorage.setItem("shaday_users_list", JSON.stringify(usersList));
  currentUser = { id: newUser.id, nombre: newUser.nombre, email: newUser.email, rol: newUser.rol };
  localStorage.setItem("shaday_current_user", JSON.stringify(currentUser));

  alert(`¡Cuenta creada con éxito! Bienvenido, ${nombre}.`);
  closeAuthModal();
  renderAuthHeader();
};

window.handleLogout = function() {
  if (confirm("¿Deseas cerrar tu sesión?")) {
    localStorage.removeItem("shaday_current_user");
    currentUser = null;
    renderAuthHeader();
  }
};

function renderProducts() {
  const productsGrid = document.getElementById("productsGrid");
  const resultsCount = document.getElementById("resultsCount");

  let filtered = allSneakers.filter(item => {
    const matchesCategory = (selectedCategory === "todos") || 
      (item.marca.toLowerCase() === selectedCategory.toLowerCase());

    const query = currentSearchTerm.toLowerCase();
    const matchesSearch = item.nombre.toLowerCase().includes(query) || 
                          item.marca.toLowerCase().includes(query);

    const tallasArray = Array.isArray(item.tallas) ? item.tallas : [];
    const matchesSize = (selectedSizeFilter === "") || tallasArray.includes(parseInt(selectedSizeFilter));

    return matchesCategory && matchesSearch && matchesSize;
  });

  if (currentSortOrder === "price-asc") filtered.sort((a, b) => a.precio - b.precio);
  else if (currentSortOrder === "price-desc") filtered.sort((a, b) => b.precio - a.precio);

  resultsCount.textContent = `Mostrando ${filtered.length} modelos`;

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 16px; color: var(--color-text-muted);">
        <i class="fa-solid fa-shoe-prints" style="font-size: 2.2rem; margin-bottom: 10px; display: block; opacity: 0.4;"></i>
        <h3>No se encontraron resultados</h3>
        <p style="font-size: 0.85rem;">Prueba buscando otra marca o limpiando los filtros.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(item => {
    const tallasArray = Array.isArray(item.tallas) ? item.tallas : [];
    return `
      <article class="product-card">
        <span class="product-badge">${item.badge || 'Stock'}</span>
        <div class="card-img-box" onclick="openProductModal('${item.id}')">
          <img src="${item.imagen_url}" alt="${item.nombre}" loading="lazy" />
        </div>
        <div class="card-info">
          <span class="brand-label">${item.marca}</span>
          <h3 class="product-title" onclick="openProductModal('${item.id}')">${item.nombre}</h3>
          
          <div class="sizes-preview">
            ${tallasArray.slice(0, 4).map(s => `<span class="size-mini-tag">T:${s}</span>`).join("")}
          </div>

          <div class="card-bottom">
            <div>
              <span class="price-label">Precio</span>
              <span class="product-price">${item.precio} ${STORE_CONFIG.currency}</span>
            </div>
            <div class="card-actions">
              <button class="btn-card-details" onclick="openProductModal('${item.id}')" title="Ver detalles">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-card-add" onclick="quickAddToCart('${item.id}')" title="Añadir">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setupEventListeners() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    currentSearchTerm = e.target.value.trim();
    renderProducts();
  });

  document.querySelectorAll(".category-pills .pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".category-pills .pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedCategory = pill.dataset.category;
      renderProducts();
    });
  });

  document.getElementById("sizeFilter").addEventListener("change", (e) => {
    selectedSizeFilter = e.target.value;
    renderProducts();
  });

  document.getElementById("sortFilter").addEventListener("change", (e) => {
    currentSortOrder = e.target.value;
    renderProducts();
  });

  document.getElementById("closeModal").addEventListener("click", closeProductModal);
  document.getElementById("productModal").addEventListener("click", (e) => {
    if (e.target.id === "productModal") closeProductModal();
  });

  // Eventos para abrir el carrito (desde la cabecera O desde el botón flotante)
  const cartBtnHeader = document.getElementById("cartBtn");
  if (cartBtnHeader) cartBtnHeader.addEventListener("click", openCart);

  const floatingCartBtn = document.getElementById("floatingCartBtn");
  if (floatingCartBtn) floatingCartBtn.addEventListener("click", openCart);

  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("clearCartBtn").addEventListener("click", clearCart);
  document.getElementById("checkoutBtn").addEventListener("click", checkoutWhatsAppCart);
}

// Modal de Detalles
window.openProductModal = function(productId) {
  const product = allSneakers.find(p => p.id === productId);
  if (!product) return;

  selectedModalProduct = product;
  const tallasArray = Array.isArray(product.tallas) ? product.tallas : [];
  selectedModalSize = tallasArray[0] || 40;

  document.getElementById("modalProductDetails").innerHTML = `
    <div class="modal-grid">
      <div class="modal-img-col">
        <img src="${product.imagen_url}" alt="${product.nombre}" />
      </div>
      <div class="modal-info-col">
        <span class="modal-brand">${product.marca} - Colección Urbana</span>
        <h2 class="modal-title">${product.nombre}</h2>
        <div class="modal-price">${product.precio} ${STORE_CONFIG.currency}</div>
        <p class="modal-desc">${product.descripcion || 'Calzado urbano exclusivo de máxima comodidad y diseño.'}</p>

        <div class="size-selector-title">
          <span>Selecciona tu Talla Disponible:</span>
        </div>

        <div class="modal-sizes-grid">
          ${tallasArray.map((size, idx) => `
            <button class="size-btn ${idx === 0 ? 'selected' : ''}" onclick="selectModalSize(${size}, this)">
              ${size}
            </button>
          `).join("")}
        </div>

        <div class="modal-actions">
          <button class="btn-modal-whatsapp" onclick="orderSingleProductWhatsApp()">
            <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp
          </button>
          <button class="btn-modal-cart" onclick="addModalProductToCart()">
            <i class="fa-solid fa-bag-shopping"></i> Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("productModal").classList.add("active");
};

window.selectModalSize = (size, btn) => {
  selectedModalSize = size;
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
};

function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
}

window.orderSingleProductWhatsApp = function() {
  if (!selectedModalProduct || !selectedModalSize) return;
  const msg = `¡Hola *${STORE_CONFIG.storeName}*! 👋👟\n` +
    `Estoy interesado en adquirir este sneaker de su catálogo:\n\n` +
    `📌 *Modelo:* ${selectedModalProduct.nombre}\n` +
    `🏷️ *Marca:* ${selectedModalProduct.marca}\n` +
    `📏 *Talla:* ${selectedModalSize}\n` +
    `💰 *Precio:* ${selectedModalProduct.precio} ${STORE_CONFIG.currency}\n\n` +
    `¿Tienen disponibilidad para entrega o envío? ¡Muchas gracias!`;
  window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
};

window.quickAddToCart = (id) => {
  const prod = allSneakers.find(p => p.id === id);
  if (prod) addToCartLogic(prod, prod.tallas[0] || 40);
};

window.addModalProductToCart = () => {
  if (selectedModalProduct) {
    addToCartLogic(selectedModalProduct, selectedModalSize);
    closeProductModal();
    openCart();
  }
};

function addToCartLogic(product, size) {
  const existing = shoppingCart.find(i => i.id === product.id && i.size === size);
  if (existing) existing.qty += 1;
  else shoppingCart.push({ id: product.id, name: product.nombre, price: product.precio, image: product.imagen_url, size, qty: 1 });
  
  localStorage.setItem("shaday_cart", JSON.stringify(shoppingCart));
  updateCartBadge();
}

function updateCartBadge() {
  const count = shoppingCart.reduce((a, c) => a + c.qty, 0);
  
  // Actualiza badge de cabecera si existe
  const headerBadge = document.getElementById("cartCount");
  if (headerBadge) headerBadge.textContent = count;

  // Actualiza badge del botón flotante
  const floatingBadge = document.getElementById("floatingCartCount");
  if (floatingBadge) floatingBadge.textContent = count;
}

function openCart() {
  renderCartDrawer();
  document.getElementById("cartOverlay").classList.add("active");
  document.getElementById("cartDrawer").classList.add("active");
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("active");
  document.getElementById("cartDrawer").classList.remove("active");
}

function renderCartDrawer() {
  const list = document.getElementById("cartItemsList");
  let total = 0;
  if (shoppingCart.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:36px 10px; color:var(--color-text-muted);"><i class="fa-solid fa-bag-shopping" style="font-size:2.2rem; margin-bottom:8px; opacity:0.4;"></i><p style="font-size:0.88rem;">Tu carrito está vacío</p></div>`;
    document.getElementById("cartTotalPrice").textContent = "0 Bs.";
    return;
  }
  list.innerHTML = shoppingCart.map((item, idx) => {
    const sub = item.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <img src="${item.image}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Talla: <strong>${item.size}</strong> | Cant: ${item.qty}</p>
          <strong style="color:var(--color-text-main); font-size:0.88rem;">${sub} ${STORE_CONFIG.currency}</strong>
        </div>
        <button class="cart-item-remove" onclick="removeCart(${idx})" title="Quitar">&times;</button>
      </div>
    `;
  }).join("");
  document.getElementById("cartTotalPrice").textContent = `${total} ${STORE_CONFIG.currency}`;
}

window.removeCart = (idx) => {
  shoppingCart.splice(idx, 1);
  localStorage.setItem("shaday_cart", JSON.stringify(shoppingCart));
  updateCartBadge();
  renderCartDrawer();
};

function clearCart() {
  if (shoppingCart.length === 0) return;
  if (confirm("¿Deseas vaciar el carrito?")) {
    shoppingCart = [];
    localStorage.setItem("shaday_cart", JSON.stringify(shoppingCart));
    updateCartBadge();
    renderCartDrawer();
  }
}

function checkoutWhatsAppCart() {
  if (shoppingCart.length === 0) return;
  let text = "";
  let total = 0;
  shoppingCart.forEach((it, i) => {
    const s = it.price * it.qty;
    total += s;
    text += `${i+1}. *${it.name}* (Talla: ${it.size}) x ${it.qty} = ${s} Bs.\n`;
  });
  const msg = `¡Hola *${STORE_CONFIG.storeName}*! 🛒👟\n` +
    `Deseo realizar este pedido desde su sitio web:\n\n` +
    `${text}\n` +
    `💵 *TOTAL:* ${total} ${STORE_CONFIG.currency}\n\n` +
    `Por favor me envían el código QR para transferir y coordinar entrega.`;
  window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
}