document.getElementById("simplify").onclick = () => {
    chrome.runtime.sendMessage({ action: "simplify" });
  };
  
  document.getElementById("report").onclick = () => {
    alert("Merci. Nous avons bien reçu votre message.");
  };
  
  document.getElementById('rating').addEventListener('click', (event) => {
    if (event.target.classList.contains('star')) {
      const value = parseInt(event.target.dataset.value);
      document.querySelectorAll('.star').forEach((star, index) => {
        star.classList.toggle('selected', index < value);
      });
      alert(`Merci ! Vous avez noté ${value} étoile(s).`);
      // Tu peux remplacer alert() par une requête à une API ou stockage local
    }
  });