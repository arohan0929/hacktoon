async function characterFetch() {
   let cache = localStorage.getItem("characterCache");
   cache = JSON.parse(cache);
   let character;
   for (let i = 0; i < cache.length; i++) {
      const element = cache[i];
      if (element.id == characterID) {
         character = element;
         break;
      }
   }

   

   const mainDiv = document.createElement("div");
   mainDiv.id = "mainDiv"
   let attribution = `<a href="http://marvel.com">Data provided by Marvel. © 2022 MARVEL</a>`;
   mainDiv.innerHTML = attribution;
   document.querySelector(".loading-container").remove();
   document.querySelector("body").appendChild(mainDiv);

   let wikiHtml = "";
   for (let i = 0; i < character.urls.length; i++) {
      const url = character.urls[i];
      if (url.type === "wiki") {
         wikiHtml = `<a class="wiki-link" href="${url.url}">wiki</a>`
      }
   }

   let characterIntro = document.createElement("div");
   characterIntro.classList.add("character-intro");
   characterIntro.innerHTML = `
      <img load="lazy" src="${character.thumbnail.path + "." + character.thumbnail.extension}" />
      <div>
         <h1>${character.name}</h1>
         <p>${character.description}</p>
         ${wikiHtml}
      </div>
   `;
   document.getElementById("mainDiv").appendChild(characterIntro);


   const comicsDiv = document.createElement("div");
   comicsDiv.classList.add("comics-div");
   const comicsH2 = document.createElement("h2");
   comicsH2.textContent = "Comics"

   document.getElementById("mainDiv").appendChild(comicsH2);


   let comicsRes = await fetch("/api/getComicsByCharacter/" + characterID);
   let comics = await comicsRes.json();



   for (let i = 0; i < comics.data.results.length; i++) {
      const element = comics.data.results[i];
      let div = document.createElement("div");
      div.innerHTML = `
         <img load="lazy" src="${element.thumbnail.path + "." + element.thumbnail.extension}" />
         <h3>${element.title || ""}</h3>
         <p>${element.description || ""}</p>
      `;
      comicsDiv.appendChild(div)
   }

   document.getElementById("mainDiv").appendChild(comicsDiv);


   let seriesRes = await fetch("/api/getSeriesByCharacter/" + characterID);
   let series = await seriesRes.json();


   const seriesDiv = document.createElement("div");
   seriesDiv.classList.add("series-div");
   const seriesH2 = document.createElement("h2");
   seriesH2.textContent = "Series"

   document.getElementById("mainDiv").appendChild(seriesH2);

   for (let i = 0; i < series.data.results.length; i++) {
      const element = series.data.results[i];
      let div = document.createElement("div");
      div.innerHTML = `
         <img load="lazy" src="${element.thumbnail.path + "." + element.thumbnail.extension}" />
         <h3>${element.title || ""}</h3>
         <p>${element.description || ""}</p>
      `;
      seriesDiv.appendChild(div)
   }

   document.getElementById("mainDiv").appendChild(seriesDiv);




   const eventsDiv = document.createElement("div");
   eventsDiv.classList.add("events-div");
   const eventsH2 = document.createElement("h2");
   eventsH2.textContent = "Events"

   document.getElementById("mainDiv").appendChild(eventsH2);

   let eventsRes = await fetch("/api/getEventsByCharacter/" + characterID);
   let events = await eventsRes.json();



   for (let i = 0; i < events.data.results.length; i++) {
      const element = events.data.results[i];
      let div = document.createElement("div");


      div.innerHTML = `
         <img load="lazy" src="${element.thumbnail.path + "." + element.thumbnail.extension}" />
         <h3>${element.title || ""}</h3>
         <p>${element.description || ""}</p>
         <button onClick="openTimeline(${element.id})">Timeline</button>
      `;
      eventsDiv.appendChild(div)
   }

   document.getElementById("mainDiv").appendChild(eventsDiv);



}










document.addEventListener("DOMContentLoaded", load);

function load() {
   characterFetch();
}


function closeTimeline() {
   document.querySelector(".timeline-full").remove();
   document.getElementById("span-timeline-cover").classList.toggle("timeline-cover");
}

async function nextTimeline(eventId) {

   document.getElementById("timeline-content").style.filter = "blur(7px)"


   let eventsRes = await fetch("/api/getEventByID/" + eventId);
   let events = await eventsRes.json();
   events = events.data.results[0];

   let nextData = events.next.resourceURI;
   nextData = nextData.split("/");
   nextData = nextData[nextData.length - 1];
   let previousData = events.previous.resourceURI;
   previousData = previousData.split("/");
   previousData = previousData[previousData.length - 1];

   document.getElementById("timeline-content").querySelector("img").src = events.thumbnail.path + "." + events.thumbnail.extension;
   document.getElementById("timeline-content").querySelector("h3").textContent = events.title || "";
   document.getElementById("timeline-content").querySelector("p").textContent = events.description || "";

   document.getElementById("timeline-content").style.filter = "blur(0)"


   document.getElementById("next-timeline").setAttribute("onClick", `nextTimeline(${nextData})`)
   document.getElementById("previous-timeline").setAttribute("onClick", `previousTimeline(${previousData})`)


}

async function previousTimeline(eventId) {

   document.getElementById("timeline-content").style.filter = "blur(7px)"


   let eventsRes = await fetch("/api/getEventByID/" + eventId);
   let events = await eventsRes.json();
   events = events.data.results[0];

   let nextData = events.next.resourceURI;
   nextData = nextData.split("/");
   nextData = nextData[nextData.length - 1];
   let previousData = events.previous.resourceURI;
   previousData = previousData.split("/");
   previousData = previousData[previousData.length - 1];

   document.getElementById("timeline-content").querySelector("img").src = events.thumbnail.path + "." + events.thumbnail.extension;
   document.getElementById("timeline-content").querySelector("h3").textContent = events.title || "";
   document.getElementById("timeline-content").querySelector("p").textContent = events.description || "";

   document.getElementById("timeline-content").style.filter = "blur(0)"


   document.getElementById("next-timeline").setAttribute("onClick", `nextTimeline(${nextData})`)
   document.getElementById("previous-timeline").setAttribute("onClick", `previousTimeline(${previousData})`)


}

async function openTimeline(eventId) {
   let div = document.createElement("div");
   div.classList.add("timeline-full");
   let eventsRes = await fetch("/api/getEventByID/" + eventId);
   let events = await eventsRes.json();

   events = events.data.results[0];
   let nextData = events.next.resourceURI;
   nextData = nextData.split("/");
   nextData = nextData[nextData.length - 1];
   let previousData = events.previous.resourceURI;
   previousData = previousData.split("/");
   previousData = previousData[previousData.length - 1];

   div.innerHTML = `
         <div class="timeline-intro">
            <p>Timeline</p>
            <button onClick="closeTimeline()">
               <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 8.4L2.6 13.3C2.41667 13.4833 2.18334 13.575 1.9 13.575C1.61667 13.575 1.38334 13.4833 1.2 13.3C1.01667 13.1167 0.925003 12.8833 0.925003 12.6C0.925003 12.3167 1.01667 12.0833 1.2 11.9L6.1 7L1.2 2.1C1.01667 1.91667 0.925003 1.68333 0.925003 1.4C0.925003 1.11667 1.01667 0.883332 1.2 0.699999C1.38334 0.516666 1.61667 0.424999 1.9 0.424999C2.18334 0.424999 2.41667 0.516666 2.6 0.699999L7.5 5.6L12.4 0.699999C12.5833 0.516666 12.8167 0.424999 13.1 0.424999C13.3833 0.424999 13.6167 0.516666 13.8 0.699999C13.9833 0.883332 14.075 1.11667 14.075 1.4C14.075 1.68333 13.9833 1.91667 13.8 2.1L8.9 7L13.8 11.9C13.9833 12.0833 14.075 12.3167 14.075 12.6C14.075 12.8833 13.9833 13.1167 13.8 13.3C13.6167 13.4833 13.3833 13.575 13.1 13.575C12.8167 13.575 12.5833 13.4833 12.4 13.3L7.5 8.4Z" fill="#1C1B1F"/>
               </svg>
            </button>
         </div>
         <div class="timeline-main-content">
            <button onClick="previousTimeline(${previousData})" id="previous-timeline">
               <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.3 11.3L0.700003 6.7C0.600003 6.6 0.529336 6.49167 0.488003 6.375C0.446003 6.25833 0.425003 6.13333 0.425003 6C0.425003 5.86667 0.446003 5.74167 0.488003 5.625C0.529336 5.50833 0.600003 5.4 0.700003 5.3L5.3 0.699999C5.48334 0.516666 5.71667 0.424999 6 0.424999C6.28334 0.424999 6.51667 0.516666 6.7 0.699999C6.88334 0.883332 6.975 1.11667 6.975 1.4C6.975 1.68333 6.88334 1.91667 6.7 2.1L2.8 6L6.7 9.9C6.88334 10.0833 6.975 10.3167 6.975 10.6C6.975 10.8833 6.88334 11.1167 6.7 11.3C6.51667 11.4833 6.28334 11.575 6 11.575C5.71667 11.575 5.48334 11.4833 5.3 11.3Z" fill="#1C1B1F"/>
               </svg>
            </button>
            <div id="timeline-content">
               <img load="lazy" src="${events.thumbnail.path + "." + events.thumbnail.extension}" />
               <h3>${events.title || ""}</h3>
               <p>${events.description || ""}</p>
            </div>
            <button onClick="nextTimeline(${nextData})" id="next-timeline">
               <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.699987 11.3C0.516654 11.1167 0.424988 10.8833 0.424988 10.6C0.424988 10.3167 0.516654 10.0833 0.699987 9.9L4.59999 6L0.699987 2.1C0.516654 1.91667 0.424988 1.68334 0.424988 1.4C0.424988 1.11667 0.516654 0.883336 0.699987 0.700003C0.883321 0.516669 1.11665 0.425003 1.39999 0.425003C1.68332 0.425003 1.91665 0.516669 2.09999 0.700003L6.69999 5.3C6.79999 5.4 6.87099 5.50834 6.91299 5.625C6.95432 5.74167 6.97499 5.86667 6.97499 6C6.97499 6.13334 6.95432 6.25834 6.91299 6.375C6.87099 6.49167 6.79999 6.6 6.69999 6.7L2.09999 11.3C1.91665 11.4833 1.68332 11.575 1.39999 11.575C1.11665 11.575 0.883321 11.4833 0.699987 11.3Z" fill="#1C1B1F"/>
               </svg>               
            </button>
         </div>
      `;
   document.getElementById("span-timeline-cover").classList.toggle("timeline-cover");
   document.querySelector("body").appendChild(div);
}

const search = document.querySelector(".nav").querySelector("form");

search.addEventListener("submit", (e) => {
   e.preventDefault();
   window.location.assign(`../${document.getElementById("nav-search").value}`)
});


