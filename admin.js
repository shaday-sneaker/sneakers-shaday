/**
 * ==========================================================================
 * SNEAKERS SHADAY - ADMIN.JS CON GESTIÓN Y ALERTA DE STOCK EN TIEMPO REAL
 * ==========================================================================
 */

// 1. CREDENCIALES SUPABASE (Opcionales)
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const SUPABASE_ANON_KEY = "tu-clave-anon-aqui";

let sbClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function' && SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 20) {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  sbClient = null;
}

// 2. CUENTAS MAESTRAS
const MASTER_USERS = [
  { id: "usr-admin-1", nombre: "Dueño de Tienda", email: "admin@shaday.com", password: "admin123", rol: "admin" },
  { id: "usr-admin-2", nombre: "Jhasmani Colque", email: "jhasmani@shaday.com", password: "shaday2026", rol: "admin" },
  { id: "usr-admin-3", nombre: "Iván Mamani", email: "ivan@shaday.com", password: "shaday2026", rol: "admin" },
  { id: "usr-vend-1", nombre: "Vendedor Tienda", email: "vendedor@shaday.com", password: "vendedor123", rol: "vendedor" }
];

// LÍMITE DE ALERTA DE STOCK BAJO (<= 4 pares dispara la advertencia)
const LOW_STOCK_LIMIT = 4;

// 3. BASE DE DATOS OFICIAL DE LOS 30 SNEAKERS CON CANTIDADES DE STOCK
const OFFICIAL_30_SNEAKERS = [
  { id: 'snk-001', nombre: 'Air Jordan 4 Retro Tour Yellow', marca: 'Jordan', precio: 950, stock: 3, tallas: [39,40,41,42,43], badge: 'Más Vendido', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Silueta icónica con acabado en cuero sintético y amortiguación Air-Sole.' },
  { id: 'snk-002', nombre: 'Air Jordan 1 Retro Low OG Last Dance', marca: 'Jordan', precio: 780, stock: 8, tallas: [38,39,40,41,42], badge: 'Tendencia', imagen_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=700&q=80', descripcion: 'Perfil bajo con mezcla de tonos negros, blancos y rojos legendarios.' },
  { id: 'snk-003', nombre: 'Nike Dunk Low Retro Panda', marca: 'Nike', precio: 650, stock: 2, tallas: [38,39,40,41,42,43], badge: 'Drop Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80', descripcion: 'El par streetwear más popular en blanco y negro.' },
  { id: 'snk-004', nombre: 'Nike Air Bakin Varsity Royal', marca: 'Nike', precio: 890, stock: 10, tallas: [40,41,42,43], badge: 'Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', descripcion: 'Líneas fluidas y cámara de aire visible en azul eléctrico.' },
  { id: 'snk-005', nombre: 'Adidas Forum Low Classic White', marca: 'Adidas', precio: 590, stock: 12, tallas: [38,39,40,41,42], badge: 'Clásico', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Inspirada en el basketball de los años 80.' },
  { id: 'snk-006', nombre: 'Adidas Yeezy Boost 350 V2 Onyx', marca: 'Adidas', precio: 1100, stock: 4, tallas: [39,40,41,42], badge: 'Premium', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Tecnología Primeknit con entresuela BOOST ultracómoda.' },
  { id: 'snk-007', nombre: 'New Balance 550 White Green', marca: 'New Balance', precio: 720, stock: 7, tallas: [39,40,41,42,43], badge: 'Retro Trend', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'El regreso de un clásico vintage de 1989 en verde bosque.' },
  { id: 'snk-008', nombre: 'Air Jordan 9 Retro Space Jam', marca: 'Jordan', precio: 1050, stock: 6, tallas: [40,41,42,43], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=700&q=80', descripcion: 'Edición conmemorativa con grabado multilingüe en la suela.' },
  { id: 'snk-009', nombre: 'Nike Air Force 1 07 Triple White', marca: 'Nike', precio: 620, stock: 15, tallas: [37,38,39,40,41,42,43,44], badge: 'Básico Esencial', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'El clásico blanco absoluto con cámara Nike Air encapsulada.' },
  { id: 'snk-010', nombre: 'Nike SB Dunk Low Pro Wheat', marca: 'Nike', precio: 790, stock: 3, tallas: [39,40,41,42], badge: 'Skate Culture', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza marrón suave con suela de goma antiadherente.' },
  { id: 'snk-011', nombre: 'Air Jordan 1 High Travis Mocha Custom', marca: 'Jordan', precio: 1250, stock: 1, tallas: [40,41,42,43], badge: 'Ultra Hype', imagen_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=80', descripcion: 'Swoosh invertido con tonos café mocha y gamuza prémium.' },
  { id: 'snk-012', nombre: 'Adidas Samba OG Cloud White', marca: 'Adidas', precio: 680, stock: 9, tallas: [38,39,40,41,42,43], badge: 'Top Ventas', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera en T de ante con suela de caramelo flexible.' },
  { id: 'snk-013', nombre: 'Adidas Gazelle Indoor Bold Blue', marca: 'Adidas', precio: 640, stock: 8, tallas: [38,39,40,41,42], badge: 'Vintage', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza azul vibrante con las tres franjas dentadas en contraste.' },
  { id: 'snk-014', nombre: 'New Balance 2002R Protection Pack Rain Cloud', marca: 'New Balance', precio: 890, stock: 5, tallas: [40,41,42,43], badge: 'Destacado', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Efecto deconstruido con amortiguación N-ergy prémium.' },
  { id: 'snk-015', nombre: 'New Balance 9060 Sea Salt Cherry', marca: 'New Balance', precio: 920, stock: 6, tallas: [38,39,40,41,42], badge: 'Futurista', imagen_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño esculpido audaz con tecnología ABZORB.' },
  { id: 'snk-016', nombre: 'Nike Air Max 1 86 Big Bubble', marca: 'Nike', precio: 820, stock: 7, tallas: [39,40,41,42,43], badge: 'Edición Especial', imagen_url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=700&q=80', descripcion: 'Recreación exacta del lanzamiento original de 1986.' },
  { id: 'snk-017', nombre: 'Air Jordan 3 Retro White Cement', marca: 'Jordan', precio: 1150, stock: 4, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=700&q=80', descripcion: 'Estampado Elephant Print original con cuero granulado.' },
  { id: 'snk-018', nombre: 'Air Jordan 11 Retro Jubilee 25th', marca: 'Jordan', precio: 1200, stock: 2, tallas: [40,41,42,43], badge: 'Edición Limitada', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Charol negro brillante con placa media de fibra de carbono.' },
  { id: 'snk-019', nombre: 'Adidas Campus 00s Core Black', marca: 'Adidas', precio: 610, stock: 11, tallas: [37,38,39,40,41,42], badge: 'Streetwear', imagen_url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=80', descripcion: 'Estilo skate de los años 2000 con cordones extra anchos.' },
  { id: 'snk-020', nombre: 'Vans Old Skool Classic Black White', marca: 'Vans', precio: 450, stock: 14, tallas: [37,38,39,40,41,42,43], badge: 'Clásico Skater', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona resistente con ante y suela waffle de goma duradera.' },
  { id: 'snk-021', nombre: 'Vans Sk8-Hi Pro Black White', marca: 'Vans', precio: 490, stock: 6, tallas: [38,39,40,41,42], badge: 'Caña Alta', imagen_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80', descripcion: 'Bota acolchada con refuerzo para mayor protección al tobillo.' },
  { id: 'snk-022', nombre: 'Converse Chuck 70 High Vintage Black', marca: 'Converse', precio: 480, stock: 8, tallas: [37,38,39,40,41,42,43], badge: 'Económico', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona gruesa de 12 oz y plantilla acolchada OrthoLite.' },
  { id: 'snk-023', nombre: 'Puma Suede Classic XXI Negro', marca: 'Puma', precio: 470, stock: 9, tallas: [38,39,40,41,42], badge: 'Urbano Retro', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza auténtica con la raya Formstrip clásica desde 1968.' },
  { id: 'snk-024', nombre: 'Puma Slipstream Bball Heritage', marca: 'Puma', precio: 540, stock: 5, tallas: [39,40,41,42,43], badge: 'Novedad', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Silueta clásica de básquetbol con inserciones de cuero.' },
  { id: 'snk-025', nombre: 'Air Jordan 1 Mid Chicago Toe', marca: 'Jordan', precio: 850, stock: 3, tallas: [39,40,41,42,43], badge: 'Popular', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Colores icónicos Chicago Bulls en corte medio para uso diario.' },
  { id: 'snk-026', nombre: 'Nike Cortez Classic Leather White Red', marca: 'Nike', precio: 560, stock: 10, tallas: [38,39,40,41,42], badge: 'Vintage Run', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño liviano de perfil bajo con entresuela de cuña de EVA.' },
  { id: 'snk-027', nombre: 'ASICS GEL-Kayano 14 Metallic Silver', marca: 'ASICS', precio: 860, stock: 4, tallas: [39,40,41,42,43], badge: 'Tendencia Y2K', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Estética plateada running con tecnología de absorción GEL.' },
  { id: 'snk-028', nombre: 'New Balance 1906R Castlerock', marca: 'New Balance', precio: 880, stock: 7, tallas: [40,41,42,43], badge: 'Tech Runner', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'Estructura técnica de alto rendimiento con soporte de arco N-lock.' },
  { id: 'snk-029', nombre: 'Adidas Superstar 82 Core White Black', marca: 'Adidas', precio: 580, stock: 13, tallas: [38,39,40,41,42,43], badge: 'Leyenda Urbana', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera de concha clásica con tres franjas dentadas en negro.' },
  { id: 'snk-030', nombre: 'Air Jordan 5 Retro Fire Red Silver', marca: 'Jordan', precio: 1100, stock: 2, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Lengüeta reflectante 3M con suela de dientes de tiburón.' }
];

let dbProducts = [];
let dbPurchases = JSON.parse(localStorage.getItem("shaday_admin_purchases")) || [];
let dbSales = JSON.parse(localStorage.getItem("shaday_admin_sales")) || [];
let dbProviders = JSON.parse(localStorage.getItem("shaday_admin_providers")) || [
  { id: "prov-1", name: "Importaciones Falabella Chile", phone: "+56 9 8492 1102", city: "Santiago / Iquique", brands: "Nike, Jordan, Adidas" },
  { id: "prov-2", name: "Mayorista Kicks Miami", phone: "+1 305 782 9912", city: "Miami - USA", brands: "Jordan Retro, Yeezy" },
  { id: "prov-3", name: "Distribuidora Streetwear Santa Cruz", phone: "+591 69576123", city: "Santa Cruz de la Sierra", brands: "Vans, Converse, Puma" }
];

let dbUsers = JSON.parse(localStorage.getItem("shaday_users_list")) || [...MASTER_USERS];
let selectedImageDataUrl = "";

// 4. FUNCIONES GLOBALES DE NAVEGACIÓN
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarMobileOverlay");
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains("mobile-open");
  if (isOpen) {
    sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("active");
  } else {
    sidebar.classList.add("mobile-open");
    if (overlay) overlay.classList.add("active");
  }
};

window.switchTab = function(tabName) {
  const panes = document.querySelectorAll(".tab-pane");
  const navItems = document.querySelectorAll(".admin-sidebar .nav-item");
  const modPills = document.querySelectorAll(".mobile-module-nav .mod-pill");
  const pageTitle = document.getElementById("pageTitle");

  const titles = {
    dashboard: "Resumen General",
    productos: "Catálogo de Productos",
    compras: "Ingreso de Compras",
    ventas: "Ventas Realizadas",
    proveedores: "Directorio de Proveedores",
    usuarios: "Personal & Vendedores"
  };

  panes.forEach(p => p.classList.remove("active"));
  navItems.forEach(b => b.classList.remove("active"));
  modPills.forEach(p => p.classList.remove("active"));

  const targetPane = document.getElementById(`pane-${tabName}`);
  if (targetPane) targetPane.classList.add("active");

  const targetNav = document.querySelector(`.admin-sidebar .nav-item[data-tab="${tabName}"]`);
  if (targetNav) targetNav.classList.add("active");

  const targetPill = document.querySelector(`.mobile-module-nav .mod-pill[data-mod="${tabName}"]`);
  if (targetPill) targetPill.classList.add("active");

  if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarMobileOverlay");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (overlay) overlay.classList.remove("active");
};

// Control de modales
window.openNewProductModal = function() {
  const m = document.getElementById("modalProduct");
  if (m) m.classList.add("active");
};

window.openNewPurchaseModal = function() {
  populateDropdowns();
  const m = document.getElementById("modalPurchase");
  if (m) m.classList.add("active");
};

window.openNewSaleModal = function() {
  populateDropdowns();
  const m = document.getElementById("modalSale");
  if (m) m.classList.add("active");
};

window.openNewProviderModal = function() {
  const m = document.getElementById("modalProvider");
  if (m) m.classList.add("active");
};

window.openNewUserModal = function() {
  const m = document.getElementById("modalUser");
  if (m) m.classList.add("active");
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("active");
};

window.logoutAdmin = function() {
  if (confirm("¿Deseas cerrar sesión del panel administrativo?")) {
    localStorage.removeItem("shaday_current_user");
    window.location.href = "index.html";
  }
};

// 5. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  try {
    let sessionUser = JSON.parse(localStorage.getItem("shaday_current_user"));
    if (!sessionUser || (sessionUser.rol !== "admin" && sessionUser.rol !== "vendedor")) {
      sessionUser = MASTER_USERS[0];
      localStorage.setItem("shaday_current_user", JSON.stringify(sessionUser));
    }

    const userNameEl = document.getElementById("adminUserName");
    const userRoleEl = document.getElementById("adminUserRole");
    if (userNameEl) userNameEl.textContent = sessionUser.nombre;
    if (userRoleEl) userRoleEl.textContent = sessionUser.rol === "admin" ? "Administrador" : "Vendedor";

    loadInitialProducts();

    MASTER_USERS.forEach(mu => {
      if (!dbUsers.some(u => u.email === mu.email)) dbUsers.push(mu);
    });
    localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));

    renderAllViews();

    const searchInput = document.getElementById("productSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderProductsTable(e.target.value.trim().toLowerCase());
      });
    }
  } catch (err) {
    console.error("Error al inicializar:", err);
  }
});

function loadInitialProducts() {
  // Versión 5 fuerza la carga del stock numérico
  const FORCE_KEY = "shaday_v5_stock_system";
  const stored = JSON.parse(localStorage.getItem("shaday_admin_products"));

  // Si no tienen la propiedad 'stock', forzar actualización inmediata
  const hasNumericalStock = stored && stored.length > 0 && typeof stored[0].stock === 'number';

  if (localStorage.getItem("shaday_data_version") !== FORCE_KEY || !stored || stored.length < 20 || !hasNumericalStock) {
    dbProducts = [...OFFICIAL_30_SNEAKERS];
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
    localStorage.setItem("shaday_data_version", FORCE_KEY);
  } else {
    dbProducts = stored;
  }
}

function renderAllViews() {
  renderDashboardKPIs();
  renderProductsTable();
  renderPurchasesTable();
  renderSalesTable();
  renderProvidersGrid();
  renderUsersTable();
  populateDropdowns();
}

// 6. RENDERIZADO DEL DASHBOARD Y ALERTA DE STOCK BAJO
function renderDashboardKPIs() {
  const kpiTotal = document.getElementById("kpiTotalProducts");
  const kpiLow = document.getElementById("kpiLowStock");
  const kpiSales = document.getElementById("kpiTotalSales");
  const kpiPurch = document.getElementById("kpiTotalPurchases");

  if (kpiTotal) kpiTotal.textContent = dbProducts.length;

  // Filtra productos con stock menor o igual a 4 pares
  const lowStockProducts = dbProducts.filter(p => (Number(p.stock) || 0) <= LOW_STOCK_LIMIT);
  if (kpiLow) kpiLow.textContent = lowStockProducts.length;

  const totalSales = dbSales.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
  if (kpiSales) kpiSales.textContent = `${totalSales.toLocaleString()} Bs.`;

  const totalPurchases = dbPurchases.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  if (kpiPurch) kpiPurch.textContent = `${totalPurchases.toLocaleString()} Bs.`;

  const dashSalesList = document.getElementById("dashSalesList");
  if (dashSalesList) {
    dashSalesList.innerHTML = dbSales.length === 0 
      ? `<tr><td colspan="4" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin ventas registradas</td></tr>`
      : dbSales.slice(-5).reverse().map(s => `
        <tr>
          <td>${s.date}</td>
          <td><strong>${s.productName}</strong></td>
          <td>Talla ${s.size}</td>
          <td><strong style="color:var(--admin-accent);">${s.price} Bs.</strong></td>
        </tr>
      `).join("");
  }

  // Lista de Estado de Stock en el Dashboard: Muestra primero los pares en alerta
  const dashStockList = document.getElementById("dashStockList");
  if (dashStockList) {
    const sortedByStock = [...dbProducts].sort((a, b) => (a.stock || 0) - (b.stock || 0));
    dashStockList.innerHTML = sortedByStock.slice(0, 6).map(p => {
      const stockNum = Number(p.stock) || 0;
      let badgeHtml = "";

      if (stockNum === 0) {
        badgeHtml = `<span class="stock-badge-out"><i class="fa-solid fa-circle-xmark"></i> Agotado (0)</span>`;
      } else if (stockNum <= LOW_STOCK_LIMIT) {
        badgeHtml = `<span class="stock-badge-alert"><i class="fa-solid fa-triangle-exclamation"></i> ⚠️ Alerta: Quedan ${stockNum} pares</span>`;
      } else {
        badgeHtml = `<span class="stock-badge-normal"><i class="fa-solid fa-circle-check"></i> Stock Normal (${stockNum} pares)</span>`;
      }

      return `
        <tr>
          <td><strong>${p.nombre}</strong></td>
          <td>${p.marca}</td>
          <td><strong>${stockNum} pares</strong></td>
          <td>${badgeHtml}</td>
        </tr>
      `;
    }).join("");
  }
}

// 7. RENDERIZADO DE PRODUCTOS CON CANTIDAD Y ALERTA VISIBLE
function renderProductsTable(query = "") {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  const filtered = dbProducts.filter(p => {
    const name = (p.nombre || "").toLowerCase();
    const brand = (p.marca || "").toLowerCase();
    const stockStr = String(p.stock || "");
    return name.includes(query) || brand.includes(query) || stockStr.includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center" style="padding:24px; color:var(--admin-text-muted);">No se encontraron modelos</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const stockNum = Number(p.stock) || 0;
    const tallasStr = Array.isArray(p.tallas) ? p.tallas.join(", ") : "38, 39, 40, 41";

    let stockTag = "";
    if (stockNum === 0) {
      stockTag = `<span class="stock-badge-out"><i class="fa-solid fa-circle-xmark"></i> Agotado (0)</span>`;
    } else if (stockNum <= LOW_STOCK_LIMIT) {
      stockTag = `<span class="stock-badge-alert"><i class="fa-solid fa-triangle-exclamation"></i> ⚠️ Alerta: ${stockNum} pares</span>`;
    } else {
      stockTag = `<span class="stock-badge-normal">Stock: ${stockNum} pares</span>`;
    }

    return `
      <tr>
        <td style="width: 50px;">
          <img src="${p.imagen_url}" class="table-img" alt="${p.nombre}" />
        </td>
        <td class="prod-detail-cell">
          <div class="prod-mobile-name">${p.nombre}</div>
          <div class="prod-mobile-meta">
            <span class="badge-tag">${p.marca}</span>
            <span class="prod-mobile-price">${p.precio} Bs.</span>
            ${stockTag}
            <span>Tallas: ${tallasStr}</span>
          </div>
        </td>
        <td style="text-align: right; width: 50px;">
          <button class="btn-icon-danger" onclick="deleteProduct('${p.id}')" title="Eliminar del Catálogo">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Subida de imagen
window.handleImagePreview = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageDataUrl = e.target.result;
    document.getElementById("imagePreview").src = selectedImageDataUrl;
    document.getElementById("previewContainer").style.display = "inline-block";
  };
  reader.readAsDataURL(file);
};

window.handleUrlImagePreview = function(url) {
  if (url.trim().startsWith("http")) {
    selectedImageDataUrl = url.trim();
    document.getElementById("imagePreview").src = selectedImageDataUrl;
    document.getElementById("previewContainer").style.display = "inline-block";
  }
};

window.removeSelectedImage = function() {
  selectedImageDataUrl = "";
  document.getElementById("imagePreview").src = "";
  document.getElementById("previewContainer").style.display = "none";
  document.getElementById("pImageFile").value = "";
  document.getElementById("pImageUrl").value = "";
};

// 8. GUARDAR NUEVO SNEAKER CON STOCK INICIAL
window.handleSaveProduct = function(e) {
  e.preventDefault();
  const selectedSizes = [];
  document.querySelectorAll('input[name="pSizes"]:checked').forEach(cb => selectedSizes.push(Number(cb.value)));
  if (selectedSizes.length === 0) return alert("Por favor selecciona al menos una talla disponible");

  const stockInput = Number(document.getElementById("pStock").value);
  const initialStock = isNaN(stockInput) || stockInput < 0 ? 5 : stockInput;

  const newSneaker = {
    id: `snk-${Date.now().toString().slice(-4)}`,
    nombre: document.getElementById("pName").value.trim(),
    marca: document.getElementById("pBrand").value,
    precio: Number(document.getElementById("pPrice").value),
    stock: initialStock, // Stock numérico
    tallas: selectedSizes,
    badge: document.getElementById("pBadge").value,
    imagen_url: selectedImageDataUrl || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80",
    descripcion: document.getElementById("pDesc").value.trim() || "Calzado urbano exclusivo."
  };

  dbProducts.unshift(newSneaker);
  localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));

  alert(`¡${newSneaker.nombre} añadido con éxito con un stock de ${initialStock} pares!`);
  closeModal("modalProduct");
  document.getElementById("productForm").reset();
  removeSelectedImage();
  renderAllViews();
};

window.deleteProduct = function(id) {
  if (confirm("¿Deseas eliminar este calzado del catálogo?")) {
    dbProducts = dbProducts.filter(p => p.id !== id);
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
    renderAllViews();
  }
};

// 9. COMPRAS: SUMAN AUTOMÁTICAMENTE AL STOCK
window.calcPurchaseTotal = function() {
  const qty = Number(document.getElementById("purQty").value) || 0;
  const cost = Number(document.getElementById("purCost").value) || 0;
  document.getElementById("purchaseTotalPreview").textContent = `${(qty * cost).toLocaleString()} Bs.`;
};

window.handleSavePurchase = function(e) {
  e.preventDefault();
  const provider = dbProviders.find(p => p.id === document.getElementById("purProvider").value);
  const prodId = document.getElementById("purProduct").value;
  const product = dbProducts.find(p => p.id === prodId);
  const qty = Number(document.getElementById("purQty").value);
  const cost = Number(document.getElementById("purCost").value);

  const purchase = {
    id: `COM-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("es-BO"),
    provider: provider ? provider.name : "Proveedor",
    productName: product ? product.nombre : "Sneaker",
    invoice: document.getElementById("purInvoice").value || "S/N",
    qty: qty,
    total: qty * cost
  };

  // SUMAR AL STOCK DEL PRODUCTO
  if (product) {
    product.stock = (Number(product.stock) || 0) + qty;
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
  }

  dbPurchases.unshift(purchase);
  localStorage.setItem("shaday_admin_purchases", JSON.stringify(dbPurchases));

  alert(`¡Compra registrada! Se añadieron +${qty} pares al stock de ${product ? product.nombre : 'este modelo'}.`);
  closeModal("modalPurchase");
  renderAllViews();
};

function renderPurchasesTable() {
  const tbody = document.getElementById("purchasesTableBody");
  if (!tbody) return;
  tbody.innerHTML = dbPurchases.length === 0 
    ? `<tr><td colspan="6" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin compras registradas</td></tr>`
    : dbPurchases.map(p => `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.date}</td>
        <td>${p.provider}</td>
        <td><span class="badge-tag">${p.invoice}</span></td>
        <td>+${p.qty} pares (${p.productName})</td>
        <td><strong>${p.total} Bs.</strong></td>
      </tr>
    `).join("");
}

// 10. VENTAS: RESTAN AUTOMÁTICAMENTE 1 PAR DEL STOCK
window.updateSalePriceAuto = function() {
  const prod = dbProducts.find(p => p.id === document.getElementById("saleProduct").value);
  if (prod) document.getElementById("salePrice").value = prod.precio;
};

window.handleSaveSale = function(e) {
  e.preventDefault();
  const prodId = document.getElementById("saleProduct").value;
  const prod = dbProducts.find(p => p.id === prodId);

  // Comprobar si hay stock disponible
  if (prod && (Number(prod.stock) || 0) <= 0) {
    if (!confirm("Este sneaker tiene stock 0 (Agotado). ¿Deseas registrar la venta igualmente?")) {
      return;
    }
  }

  const sale = {
    id: `VTA-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("es-BO"),
    customer: document.getElementById("saleCustomer").value.trim(),
    productName: prod ? prod.nombre : "Sneaker",
    size: document.getElementById("saleSize").value,
    method: document.getElementById("saleMethod").value,
    price: Number(document.getElementById("salePrice").value)
  };

  // RESTAR 1 PAR DEL STOCK
  if (prod) {
    prod.stock = Math.max(0, (Number(prod.stock) || 0) - 1);
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
  }

  dbSales.unshift(sale);
  localStorage.setItem("shaday_admin_sales", JSON.stringify(dbSales));

  alert(`¡Venta registrada! Se descontó 1 par del stock. Quedan ${prod ? prod.stock : 0} pares disponibles.`);
  closeModal("modalSale");
  renderAllViews();
};

function renderSalesTable() {
  const tbody = document.getElementById("salesTableBody");
  if (!tbody) return;
  tbody.innerHTML = dbSales.length === 0 
    ? `<tr><td colspan="6" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin ventas registradas</td></tr>`
    : dbSales.map(s => `
      <tr>
        <td>${s.date}</td>
        <td><strong>${s.customer}</strong></td>
        <td>${s.productName}</td>
        <td>Talla ${s.size}</td>
        <td><span class="badge-tag badge-success">${s.method}</span></td>
        <td><strong>${s.price} Bs.</strong></td>
      </tr>
    `).join("");
}

// Proveedores
function renderProvidersGrid() {
  const container = document.getElementById("providersGrid");
  if (!container) return;
  container.innerHTML = dbProviders.map(prov => `
    <div class="provider-card">
      <h4><i class="fa-solid fa-building"></i> ${prov.name}</h4>
      <p><i class="fa-brands fa-whatsapp"></i> ${prov.phone}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${prov.city}</p>
      <p><i class="fa-solid fa-tags"></i> ${prov.brands}</p>
    </div>
  `).join("");
}

window.handleSaveProvider = function(e) {
  e.preventDefault();
  dbProviders.push({
    id: `prov-${Date.now().toString().slice(-4)}`,
    name: document.getElementById("provName").value.trim(),
    phone: document.getElementById("provPhone").value.trim(),
    city: document.getElementById("provCity").value.trim(),
    brands: document.getElementById("provBrands").value.trim() || "Variadas"
  });
  localStorage.setItem("shaday_admin_providers", JSON.stringify(dbProviders));
  alert("Proveedor registrado.");
  closeModal("modalProvider");
  renderAllViews();
};

// Usuarios
function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;
  tbody.innerHTML = dbUsers.map((u, idx) => `
    <tr>
      <td><strong>${u.nombre}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-tag ${u.rol === 'admin' ? 'badge-danger' : 'badge-success'}">${(u.rol || 'admin').toUpperCase()}</span></td>
      <td><span class="badge-tag badge-success">Habilitado</span></td>
      <td style="text-align: right;">
        ${u.email !== "admin@shaday.com" ? `
          <button class="btn-icon-danger" onclick="deleteUser(${idx})" title="Quitar Usuario">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        ` : '<span style="font-size:0.75rem; color:var(--admin-text-muted);">Principal</span>'}
      </td>
    </tr>
  `).join("");
}

window.handleSaveUser = function(e) {
  e.preventDefault();
  const nombre = document.getElementById("uName").value.trim();
  const email = document.getElementById("uEmail").value.trim().toLowerCase();
  const rol = document.getElementById("uRole").value;
  const password = document.getElementById("uPassword").value;

  if (dbUsers.some(u => u.email === email)) {
    return alert("Este correo ya está registrado.");
  }

  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    nombre: nombre,
    email: email,
    rol: rol,
    password: password
  };

  dbUsers.push(newUser);
  localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));

  alert(`¡Cuenta creada con éxito!\n\nUsuario: ${nombre}\nEmail: ${email}\nRol: ${rol.toUpperCase()}`);
  closeModal("modalUser");
  document.getElementById("userForm").reset();
  renderUsersTable();
};

window.deleteUser = function(idx) {
  if (confirm("¿Deseas revocar el acceso a este usuario?")) {
    dbUsers.splice(idx, 1);
    localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));
    renderUsersTable();
  }
};

function populateDropdowns() {
  const purProv = document.getElementById("purProvider");
  const purProd = document.getElementById("purProduct");
  const saleProd = document.getElementById("saleProduct");

  if (purProv) purProv.innerHTML = dbProviders.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  
  const opts = dbProducts.map(p => {
    const s = Number(p.stock) || 0;
    return `<option value="${p.id}">${p.nombre} (Stock: ${s} pares) - ${p.precio} Bs.</option>`;
  }).join("");

  if (purProd) purProd.innerHTML = opts;
  if (saleProd) saleProd.innerHTML = opts;
  
  updateSalePriceAuto();
}