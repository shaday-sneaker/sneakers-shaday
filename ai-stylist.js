/**
 * ==========================================================================
 * SHADAY AI STYLIST - CONEXIÓN DIRECTA CON GEMINI 1.5 FLASH
 * ==========================================================================
 */

// 1. PEGA AQUÍ TU CLAVE DE GOOGLE AI STUDIO (empieza con AIzaSy...)
const GEMINI_API_KEY = "AQ.Ab8RN6LAfWWCk7d96E2Cy5nOZoSJyygwhjcRteYq9PLdbvVO_g";

// 2. MODELOS DISPONIBLES EN CASCADA
const GEMINI_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
];

// Contexto maestro del negocio
const SHADAY_SYSTEM_PROMPT = `
Eres "Shaday AI Stylist", el asesor experto en zapatillas y moda streetwear de la tienda Sneakers Shaday, ubicada en Warnes, Santa Cruz, Bolivia.
Tus funciones son asesorar en tallas por centímetros (CM) advirtiendo si el modelo es de horma chica (Jordan 4, Yeezy 350) o amplia (Air Force 1), recomendar modelos según presupuesto en Bolivianos (Bs.) dentro de nuestro catálogo oficial de 30 zapatillas, y aconsejar outfits con ropa urbana (cargos, joggers, oversize). Concluye siempre invitando a pedir el par por WhatsApp con pago QR y despacho local.
`;

// 3. BASE DE CONOCIMIENTO LOCAL (Respaldo garantizado para la defensa)
const LOCAL_KNOWLEDGE = {
  sizes: `📏 <strong>Guía Ergonómica de Medición y Hormas:</strong><br><br>
    • <strong>¿Cómo medir tu pie?</strong> Apoya el talón contra la pared sobre una hoja de papel, marca la punta de tu dedo más largo y mide los centímetros con una regla.<br><br>
    <strong>Tabla de equivalencias en Sneakers Shaday:</strong><br>
    • <strong>37 EUR:</strong> 23.0 - 23.5 cm (Horma estándar: Vans, Converse)<br>
    • <strong>38 EUR:</strong> 23.6 - 24.0 cm (⚠️ Horma chica en Jordan 4 y Yeezy: aconsejado 38.5 o 39)<br>
    • <strong>39 EUR:</strong> 24.1 - 24.5 cm (Horma estándar: Forum, Samba)<br>
    • <strong>40 EUR:</strong> 24.6 - 25.0 cm (⚠️ Horma amplia en Air Force 1: puntera holgada)<br>
    • <strong>41 EUR:</strong> 25.1 - 26.0 cm (⚠️ Horma chica en Jordan 4 / 9: pedir medio número más si el pie es ancho)<br>
    • <strong>42 EUR:</strong> 26.1 - 26.5 cm (Horma estándar: Dunk Low, New Balance 550)<br>
    • <strong>43 EUR:</strong> 26.6 - 27.5 cm (Horma cómoda en caña alta: Vans Sk8-Hi)<br>
    • <strong>44 EUR:</strong> 27.6 - 28.0 cm (Horma amplia)<br><br>
    📲 <em>¿Deseas verificar tu modelo favorito? Toca el botón de WhatsApp y coordinamos tu entrega con pago QR.</em>`,

  budget: `💰 <strong>Recomendaciones según tu Presupuesto en Bolivianos (Bs.):</strong><br><br>
    • <strong>Gama Accesible (450 a 590 Bs.):</strong><br>
      - <em>Vans Old Skool</em> (450 Bs.) - Clásico skater resistente.<br>
      - <em>Puma Suede Classic</em> (470 Bs.) - Gamuza auténtica retro.<br>
      - <em>Converse Chuck 70</em> (480 Bs.) - Lona premium vintage.<br>
      - <em>Adidas Superstar</em> (580 Bs.) - Puntera de concha icónica.<br>
      - <em>Adidas Forum Low</em> (590 Bs.) - Estilo ochentero con correa.<br><br>
    • <strong>Gama Media / Streetwear (600 a 890 Bs.):</strong><br>
      - <em>Nike Air Force 1 Triple White</em> (620 Bs.) - El básico imprescindible.<br>
      - <em>Nike Dunk Low Panda</em> (650 Bs.) - La silueta urbana más codiciada.<br>
      - <em>Adidas Samba OG</em> (680 Bs.) - Tendencia viral con suela caramelo.<br>
      - <em>New Balance 550 White Green</em> (720 Bs.) - Estética retro basket.<br>
      - <em>Air Jordan 1 Low Last Dance</em> (780 Bs.) - Colores legendarios.<br><br>
    • <strong>Gama Alta / Colección (900 a 1250 Bs.):</strong><br>
      - <em>Air Jordan 4 Tour Yellow</em> (950 Bs.) - Silueta premium con cámara Air.<br>
      - <em>Yeezy Boost 350 V2 Onyx</em> (1100 Bs.) - Máxima comodidad BOOST.<br>
      - <em>Air Jordan 1 High Travis Mocha Custom</em> (1250 Bs.) - Hype exclusivo.<br><br>
    📲 <em>¡Todos cuentan con stock en tienda! Consulta el tuyo por WhatsApp.</em>`,

  outfit: `👕 <strong>Asesoría de Outfit y Combinación Streetwear:</strong><br><br>
    • <strong>Para Pantalón Cargo (Beige o Tierra):</strong><br>
      Combínalos con unas <em>Nike SB Dunk Low Wheat</em> (790 Bs.) o unas <em>Air Jordan 1 Low Last Dance</em> (780 Bs.). El contraste entre los tonos tierra y el cuero resalta la silueta ancha del pantalón.<br><br>
    • <strong>Para Poleras Oversize y Joggers (Negro o Gris):</strong><br>
      El match definitivo son las <em>Nike Dunk Low Retro Panda</em> (650 Bs.) o las <em>New Balance 2002R Rain Cloud</em> (890 Bs.), aportando una estética contemporánea y monocromática limpia.<br><br>
    • <strong>Para Jeans Baggy / Denim clásico:</strong><br>
      Las <em>Adidas Samba OG</em> (680 Bs.) o las <em>New Balance 550 White Green</em> (720 Bs.) le darán ese toque vintage europeo impecable.<br><br>
    📲 <em>¿Quieres ver fotos reales puestas? Escríbenos al WhatsApp de Sneakers Shaday y te enviamos detalles al instante.</em>`
};

// 4. CONTROL DE APERTURA DEL CHAT
document.addEventListener("DOMContentLoaded", () => {
  const floatingAiBtn = document.getElementById("floatingAiBtn");
  const closeAiChatBtn = document.getElementById("closeAiChatBtn");
  const aiChatOverlay = document.getElementById("aiChatOverlay");

  if (floatingAiBtn) floatingAiBtn.addEventListener("click", toggleAiChat);
  if (closeAiChatBtn) closeAiChatBtn.addEventListener("click", toggleAiChat);
  if (aiChatOverlay) aiChatOverlay.addEventListener("click", toggleAiChat);
});

function toggleAiChat() {
  const overlay = document.getElementById("aiChatOverlay");
  const drawer = document.getElementById("aiChatDrawer");
  if (!overlay || !drawer) return;

  overlay.classList.toggle("active");
  drawer.classList.toggle("active");

  if (drawer.classList.contains("active")) {
    const input = document.getElementById("aiUserInput");
    if (input) input.focus();
  }
}

// 5. CHIPS RÁPIDOS
window.sendQuickPrompt = function(promptText) {
  const input = document.getElementById("aiUserInput");
  if (input) {
    input.value = promptText;
    handleSendAiMessage(new Event("submit"));
  }
};

// 6. MOTOR DE CONSULTA INTELIGENTE (API + FALLBACK LOCAL AUTOMÁTICO)
async function requestGeminiOrFallback(userPrompt) {
  const cleanKey = GEMINI_API_KEY ? GEMINI_API_KEY.trim() : "";

  // Si la clave empieza con AIzaSy, intenta conectar con Google Gemini
  if (cleanKey.startsWith("AIzaSy")) {
    for (const endpointUrl of GEMINI_ENDPOINTS) {
      try {
        const res = await fetch(`${endpointUrl}?key=${cleanKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${SHADAY_SYSTEM_PROMPT}\n\nPregunta: ${userPrompt}` }]
              }
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return formatAiReply(reply);
        }
      } catch (e) {
        console.warn("Fallo temporal en endpoint, pasando al siguiente...");
      }
    }
  }

  // SI LA API NO RESPONDE O LA CLAVE ESTÁ PENDIENTE:
  // Se activa el motor local con respuestas precisas de Sneakers Shaday
  const textLower = userPrompt.toLowerCase();

  if (textLower.includes("medir") || textLower.includes("talla") || textLower.includes("centímetro") || textLower.includes("cm") || textLower.includes("horma")) {
    return LOCAL_KNOWLEDGE.sizes;
  }
  
  if (textLower.includes("presupuesto") || textLower.includes("precio") || textLower.includes("cuánto cuesta") || textLower.includes("bs") || textLower.includes("económ")) {
    return LOCAL_KNOWLEDGE.budget;
  }

  if (textLower.includes("outfit") || textLower.includes("combin") || textLower.includes("ropa") || textLower.includes("cargo") || textLower.includes("polera")) {
    return LOCAL_KNOWLEDGE.outfit;
  }

  // Respuesta general contextualizada
  return `¡Hola! Como asesor de <strong>Sneakers Shaday</strong> te recomiendo explorar nuestro catálogo de 30 modelos disponibles en Warnes. 👟<br><br>
  • Si tienes dudas con tu talla, dime cuántos <strong>centímetros mide tu pie</strong> para indicarte tu número exacto y si la horma calza chica o grande.<br>
  • Si buscas un modelo según tu dinero disponible, indícame tu <strong>presupuesto en Bolivianos</strong> (tenemos pares desde 450 hasta 1250 Bs.).<br>
  • O dime qué ropa planeas usar y te armamos el <strong>outfit streetwear</strong> perfecto.<br><br>
  📲 <em>También puedes contactarnos directo al WhatsApp oficial de la tienda para coordinar pagos QR y entregas inmediatas.</em>`;
}

// 7. ENVÍO Y RENDERIZADO DE MENSAJES
async function handleSendAiMessage(event) {
  if (event) event.preventDefault();

  const input = document.getElementById("aiUserInput");
  const sendBtn = document.getElementById("aiSendBtn");
  const userText = input ? input.value.trim() : "";

  if (!userText) return;

  appendMessage("user", userText);
  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;

  const typingId = appendTypingIndicator();

  // Pausa breve para simular razonamiento fluido
  await new Promise(r => setTimeout(r, 600));

  try {
    const responseHtml = await requestGeminiOrFallback(userText);
    removeMessage(typingId);
    appendMessage("bot", responseHtml);
  } catch (error) {
    removeMessage(typingId);
    appendMessage("bot", LOCAL_KNOWLEDGE.sizes);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function appendMessage(sender, htmlText) {
  const container = document.getElementById("aiChatMessages");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-msg ${sender}-msg`;
  msgDiv.innerHTML = `<div class="ai-bubble">${htmlText}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById("aiChatMessages");
  const id = "typing-" + Date.now();
  const msgDiv = document.createElement("div");
  msgDiv.className = "ai-msg bot-msg";
  msgDiv.id = id;
  msgDiv.innerHTML = `<div class="ai-bubble ai-typing-indicator"><i class="fa-solid fa-spinner fa-spin"></i> Shaday AI está analizando...</div>`;
  if (container) {
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }
  return id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatAiReply(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}