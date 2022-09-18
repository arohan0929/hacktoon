async function characterFetch() {
   let res = await fetch(`/api/getCharacterByName/${characterName}`)
   let json = await res.json();
   let results = json.data.results;
   const mainDiv = document.createElement("div");
   mainDiv.id = "mainDiv";
   let attribution = json.attributionHTML;
   mainDiv.innerHTML = attribution;
   document.querySelector("body").appendChild(mainDiv);

   document.querySelector(".loading-container").remove();
   var cache = [];

   for (let i = 0; i < results.length; i++) {
      const element = results[i];

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
         <img load="lazy" src="${element.thumbnail.path + "." + element.thumbnail.extension}" />
         <div>
            <h2>${element.name || ""}</h2>
            <p>${element.description || ""}</p>
            ${wikiHtml}
         </div>
      `;
      document.getElementById("mainDiv").appendChild(a);



   }

   
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

document.addEventListener("DOMContentLoaded", characterFetch);





const search = document.querySelector(".nav").querySelector("form");

search.addEventListener("submit", (e)=>{
   e.preventDefault();
   window.location.assign(`../character/${document.getElementById("nav-search").value}`)
});
