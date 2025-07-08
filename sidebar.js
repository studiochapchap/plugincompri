document.getElementById("simplifyButton").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, async (results) => {
      const text = results[0].result;
  
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "fL49PPfnFJtj0sq8fGie85xk7v9wZj3q"
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            {
              role: "system",
              content: "Tu es un assistant qui simplifie les textes selon les règles du langage clair."
            },
            {
              role: "user",
              content: `Simplifie ce texte : ${text}`
            }
          ],
          temperature: 0.5
        })
      });
  
      const data = await response.json();
      const simplifiedText = data.choices?.[0]?.message?.content || "Erreur dans la réponse.";
  
      document.getElementById("simplifiedText").innerText = simplifiedText;
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