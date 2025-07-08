document.getElementById("simplify").onclick = () => {
    chrome.runtime.sendMessage({ action: "simplify" });
  };
  
  document.getElementById("report").onclick = () => {
    alert("Merci. Nous avons bien reçu votre message.");
  };
  
  document.getElementById("stars").onclick = (e) => {
    const rating = [...e.target.parentNode.textContent].indexOf(e.target.textContent) + 1;
    alert("Merci. Vous avez mis " + rating + " étoile(s).");
  };
  