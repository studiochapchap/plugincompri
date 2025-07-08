// sidebar.js
document.addEventListener("DOMContentLoaded", () => {
    const simplifyButton = document.getElementById("simplifyButton");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const simplifiedTextDiv = document.getElementById("simplifiedText");
    const stars = document.querySelectorAll("#stars .star");
    const ratingResult = document.getElementById("rating-result");
  
    // Cacher le bouton PDF tant qu'il n'y a pas de texte
    downloadPdfBtn.style.display = "none";
  
    simplifyButton.addEventListener("click", async () => {
      // Exemple simple pour récupérer tout le texte de la page
      const articleText = document.body.innerText;
  
      simplifiedTextDiv.textContent = "Simplification en cours...";
  
      try {
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer mistral-jlPDNHSCtVlfnOpzeVZdLaxSunbzwowS"
          },
          body: JSON.stringify({
            model: "mistral-large-latest", // ou mistral-small-latest
            messages: [
              {
                role: "system",
                content: "Tu es un assistant qui simplifie les textes en FALC (Facile à Lire et à Comprendre)."
              },
              {
                role: "user",
                content: "Simplifie ce texte en FALC : " + articleText
              }
            ],
            temperature: 0.3,
            max_tokens: 1024
          })
        });
      
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status} - ${await response.text()}`);
        }
      
        const data = await response.json();
        console.log(data);
      
        // Par exemple, extraire le texte simplifié :
        const simplifiedText = data.choices[0].message.content;
        // Utilise simplifiedText comme tu veux
      
        const simplified = data.choices?.[0]?.message?.content || "Erreur : pas de contenu renvoyé.";
  
        simplifiedTextDiv.textContent = simplified;
        downloadPdfBtn.style.display = "inline-block";
      } catch (error) {
        console.error("Erreur lors de la simplification:", error);
        simplifiedTextDiv.textContent = "Erreur lors de la simplification.";
      }
    });
  
    downloadPdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const text = simplifiedTextDiv.textContent || "Aucun texte simplifié.";
      doc.text(text, 10, 10);
      doc.save("texte_simplifie.pdf");
    });
  
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = star.getAttribute("data-value");
        ratingResult.textContent = `Merci pour votre note : ${rating} étoile(s).`;
      });
    });
  });