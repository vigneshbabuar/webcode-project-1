const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const resultsDiv = document.querySelector("#results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultsDiv.innerHTML = "";
  const name = nameInput.value.trim();
  if (name.length === 0) {
    return;
  }
  try {
    const response = await fetch(
      `https://api.nationalize.io/?name=${encodeURIComponent(name)}`
    );
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const data = await response.json();
    if (!data.country || data.country.length === 0) {
      resultsDiv.innerHTML = "<p>No nationality data found</p>";
      return;
    }
    const topTwoCountries = data.country.slice(0, 2);
    const probability = Math.round(topTwoCountries[0].probability * 100);
    const resultList = document.createElement("ul");
    topTwoCountries.forEach((country) => {
      const listItem = document.createElement("li");
      const countryName = document.createTextNode(country.country_id);
      listItem.appendChild(countryName);
      const probabilityText = document.createTextNode(
        ` (${Math.round(country.probability * 100)}%)`
      );
      listItem.appendChild(probabilityText);
      resultList.appendChild(listItem);
    });
    const resultText = document.createElement("p");
    resultText.appendChild(document.createTextNode(`Top two countries: `));
    resultText.appendChild(resultList);
    resultText.appendChild(
      document.createTextNode(` (with ${probability}% probability)`)
    );
    resultsDiv.appendChild(resultText);
    highlightText(name);
  } catch (error) {
    resultsDiv.innerHTML = "<p>An error occurred</p>";
  }
});

function highlightText(text) {
  const textNodes = Array.from(resultsDiv.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
  );
  textNodes.forEach((node) => {
    const nodeText = node.textContent;
    const index = nodeText.indexOf(text);
    if (index !== -1) {
      const before = nodeText.slice(0, index);
      const after = nodeText.slice(index + text.length);
      const highlight = document.createElement("span");
      highlight.classList.add("highlight");
      highlight.appendChild(document.createTextNode(text));
      const parent = node.parentNode;
      parent.insertBefore(document.createTextNode(before), node);
      parent.insertBefore(highlight, node);
      parent.insertBefore(document.createTextNode(after), node);
      parent.removeChild(node);
    }
  });
}
