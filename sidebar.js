document.addEventListener("DOMContentLoaded", () => {
    // Scroll avec les flèches du clavier
    const container = document.getElementById("container");
    if (container) {
      container.setAttribute("tabindex", "0");
      container.focus();
      container.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") container.scrollBy(0, 40);
        if (e.key === "ArrowUp") container.scrollBy(0, -40);
      });
    }
  
    // Simplification du texte
    document.getElementById("simplifyBtn").addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => document.body.innerText
        },
        async (results) => {
          const pageText = results[0].result;
          const prompt = `
  Tu es un expert en langage clair.
  
  Transforme le texte suivant en version simple et accessible.
  
  Règles :
  - Titres en **gras**
  - Pas de répétitions
  - Pas de notes de bas de page
  - Phrases courtes
  - Mots simples
  - Si un mot est difficile : ajoute une définition entre parenthèses
  - Voix active, pas de passif
  - Pas de métaphores
  - Pas d’abréviations ni sigles (ou explique-les)
  - Pas de tournures négatives
  - Chiffres écrits en chiffres
  - Pas de pourcentages ni de grands chiffres
  - Pas de caractères spéciaux ni de chiffres romains
  - Ponctuation simple
  
  Mise en page :
  - Texte en taille 16
  - Police unique
  - Une seule colonne
  - Aligné à gauche
  - Contraste élevé
  - Marges larges
  - Nouvelle phrase = nouvelle ligne
  - Listes à puces si mots séparés par des virgules
  - Texte structuré pour pouvoir descendre avec les flèches
  
  Texte à simplifier :
  ${pageText}
  `;
  
          try {
            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer fL49PPfnFJtj0sq8fGie85xk7v9wZj3q"
              },
              body: JSON.stringify({
                model: "mistral-tiny",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
              })
            });
  
            const data = await response.json();
            const simplifiedText = data.choices?.[0]?.message?.content || "Erreur lors de la simplification.";
            document.getElementById("simplifiedText").innerText = simplifiedText;
          } catch (error) {
            document.getElementById("simplifiedText").innerText = "Erreur de communication avec Mistral.";
          }
        }
      );
    });
  
    // Télécharger le texte en PDF
    document.getElementById("downloadPdfBtn").addEventListener("click", () => {
      const text = document.getElementById("simplifiedText").innerText;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const lines = doc.splitTextToSize(text, pageWidth);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(16);
      doc.text(lines, margin, 20);
      doc.save("texte_simplifie.pdf");
    });
  
    // Notation par étoiles
    document.querySelectorAll(".star").forEach((star, index) => {
      star.addEventListener("click", async () => {
        const rating = index + 1;
        document.querySelectorAll(".star").forEach((s, i) => {
          s.style.color = i < rating ? "gold" : "black";
        });
  
        document.getElementById("rating-result").textContent = `Tu as mis ${rating} étoile(s). Merci !`;
  
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url;
        const now = new Date().toISOString();
  
        await fetch("https://v1.nocodeapi.com/andreachap/google_sheets/BBLtDyGukeFuaZYK?tabId=Feuille1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [[now, url, rating]]
          })
        });
      });
    });
  });
  