document.getElementById("simplifyBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, async (results) => {
      const pageText = results[0].result;
      const prompt = `
  Simplifie le texte suivant selon les règles suivantes : 
  - Utilise des phrases courtes.
  - Explique les mots compliqués.
  - Pas de sigles, pas de métaphores.
  - Une seule colonne, bien lisible.
  Texte : ${pageText}
  `;
  
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "fL49PPfnFJtj0sq8fGie85xk7v9wZj3q"
        },
        body: JSON.stringify({
          model: "mistral-tiny", // ou mistral-small, mistral-medium selon ton plan
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
  
      const data = await response.json();
      const simplifiedText = data.choices[0].message.content;
  
      document.getElementById("simplifiedText").innerText = simplifiedText;
    });
  });
  
  // Notation étoilée (inchangée)
  document.querySelectorAll(".star").forEach((star, index) => {
    star.addEventListener("click", () => {
      document.querySelectorAll(".star").forEach((s, i) => {
        s.classList.toggle("star-filled", i <= index);
        s.classList.toggle("star-empty", i > index);
      });
  
      const rating = index + 1;
      document.getElementById("message").textContent = `Tu as mis ${rating} étoile(s). Merci !`;
  
      // Envoi vers Google Sheets via NoCodeAPI
      fetch("https://v1.nocodeapi.com/andreachap/google_sheets/BBLtDyGukeFuaZYK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [[new Date().toISOString(), rating]] })
      });
    });
  });
  
  // GESTION DE LA NOTATION PAR ÉTOILES + ENVOI VERS GOOGLE SHEETS
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', async () => {
      const rating = star.getAttribute('data-value');
      document.getElementById('rating-result').innerText = `Tu as mis ${rating} étoile(s). Merci !`;
  
      document.querySelectorAll('.star').forEach(s => s.style.color = 'black');
      for (let i = 0; i < rating; i++) {
        document.querySelectorAll('.star')[i].style.color = 'gold';
      }
  
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tab.url;
      const now = new Date().toISOString();
  
      await fetch("https://v1.nocodeapi.com/andreachap/google_sheets/BBLtDyGukeFuaZYK?tabId=Feuille1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            [now, url, rating]
          ]
        })
      });
    });
  });