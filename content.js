chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "simplify") {
      const elements = document.querySelectorAll("p, li, h1, h2, h3");
  
      elements.forEach(el => {
        // Mise en forme visuelle
        el.style.fontSize = "16px";
        el.style.lineHeight = "2";
        el.style.fontFamily = "Arial, sans-serif";
        el.style.color = "black";
        el.style.backgroundColor = "white";
        el.style.textAlign = "left";
        el.style.margin = "10px 0";
        el.style.padding = "8px";
        el.style.borderRadius = "5px";
  
        // Forçage retour à la ligne entre chaque phrase
        const sentences = el.textContent.split(/(?<=\.)\s+/);
        el.innerHTML = sentences.map(s => `<div>${s}</div>`).join("");
      });
  
      // Corps de page : marges larges et page aérée
      document.body.style.margin = "40px";
      document.body.style.padding = "0";
      document.body.style.backgroundColor = "#fefefe";
      document.body.style.fontSize = "16px";
      document.body.style.fontFamily = "Arial, sans-serif";
      document.body.style.lineHeight = "2";
      document.body.style.color = "black";
  
      // Empêche le contenu trop dense
      document.body.style.maxWidth = "800px";
    }
  });
  