const search = document.querySelector(".nav").querySelector("form");

search.addEventListener("submit", (e)=>{
   e.preventDefault();
   window.location.assign(`character/${document.getElementById("nav-search").value}`)
});


document.addEventListener("DOMContentLoaded", loaded);

async function loaded() {
   let res = await fetch("/api/characters");
   let jsonRes = await res.json();
   let characters = jsonRes.data.results;

   const mainDiv = document.createElement("div");
   mainDiv.id = "mainDiv"
   let attribution = jsonRes.attributionHTML;
   mainDiv.innerHTML = attribution;
   var cache = [];

   for (let i = 0; i < characters.length; i++) {
      const element = characters[i];
      cache.push(element);

      const a = document.createElement("a");
      a.href = `/character/id/${element.id}`
      
      let wikiHtml = "";
      for (let i = 0; i < element.urls.length; i++) {
         const url = element.urls[i];
         if (url.type === "wiki") {
            wikiHtml = `<a class="wiki-link" href="${url.url}">wiki</a>`
         }
      }
      a.innerHTML = `
         <img src="${element.thumbnail.path + "." + element.thumbnail.extension}" />
            <div>
            <h2>${element.name || ""}</h2>
            <p>${element.description || ""}</p>
            ${wikiHtml}
         </div>
      `;
      mainDiv.appendChild(a);
   }

   

   document.querySelector(".loading-container").remove();
   document.querySelector("body").appendChild(mainDiv);

   let characterCache = localStorage.getItem("characterCache");
   if (characterCache){
      characterCache = JSON.parse(characterCache);
   }
   else {
      characterCache = [];
   }
   characterCache = [...cache];
   characterCache = JSON.stringify(characterCache)

   localStorage.setItem("characterCache", characterCache)

}
