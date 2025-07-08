document.addEventListener("DOMContentLoaded", () => {
    // Bouton de simplification
    document.getElementById("simplifyBtn").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: () => document.body.innerText
            },
            async (results) => {
                if (!results || !results[0] || !results[0].result) {
                    console.error("Failed to retrieve page text from the active tab.");
                    document.getElementById("simplifiedText").innerText = "Erreur : Impossible de récupérer le texte de la page.";
                    return;
                }
                const pageText = results[0].result;
                const prompt = `
Tu es un expert en langage clair.

Tu vas transformer le texte suivant en une version simplifiée et accessible, selon les règles strictes suivantes :

## Mise en forme :
- Si un titre est présent, mets-le en **gras**.
- Supprime les répétitions.
- Ne mets **pas** de notes de bas de page.
- Chaque nouvelle phrase commence sur une **nouvelle ligne**.
- Le texte doit être en **taille 16**, avec **une seule police**, bien **aligné à gauche**, en **une seule colonne**.
- Utilise un **contraste élevé** (fond clair, texte foncé).
- Garde des **marges larges et aérées**.
- Ne charge pas trop une seule page : structure le texte pour qu’on puisse **faire défiler** (descendre) facilement.
- Quand il y a une **liste de mots séparés par des virgules**, transforme-la en **liste à puces**.

## Style d’écriture :
- Écris des **phrases courtes** et simples.
- Utilise des **mots simples** et concrets.
- Si un mot difficile apparaît, ajoute une **définition simple et courte** entre parenthèses.
- Utilise la **voix active**, évite la forme passive.
- Utilise une **ponctuation simple**.
- **Écris les chiffres en chiffres** (ex. : 2 et non deux).
- Supprime tous les **caractères spéciaux**.
- N’utilise **jamais de chiffres romains**.

## Ce que tu ne dois **pas** faire :
- **Pas de métaphores**.
- **Pas d’abréviations**.
- **Évite les tournures négatives**.
- **Évite les pourcentages ou grands chiffres** (utilise des exemples simples ou des comparaisons accessibles).
- **Pas de sigles**. Si tu en rencontres, **explique-les clairement** sans les utiliser dans la suite du texte.

Voici le texte à simplifier : 
${pageText}
`;

                try {
                    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer YOUR_API_KEY_HERE" // Replace with a secure method to store your API key
                        },
                        body: JSON.stringify({
                            model: "mistral-tiny",
                            messages: [{ role: "user", content: prompt }]
                        })
                    });

                    if (!response.ok) {
                        console.error("API call failed with status:", response.status);
                        document.getElementById("simplifiedText").innerText = "Erreur : La requête à l'API a échoué.";
                        return;
                    }

                    const data = await response.json();
                    const simplifiedText = data.choices?.[0]?.message?.content || "Erreur lors de la simplification.";
                    document.getElementById("simplifiedText").innerText = simplifiedText;
                } catch (error) {
                    console.error("Error during API call:", error);
                    document.getElementById("simplifiedText").innerText = "Erreur : Une erreur s'est produite lors de la requête.";
                }
            }
        );
    });

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
        doc.setFontSize(14);
        doc.text(lines, margin, 20);

        doc.save("texte_simplifie.pdf");
    });

    // Étoiles d'évaluation
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
                body: JSON.stringify({ data: [[now, url, rating]] })
            });
        });
    });
});
