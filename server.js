import express from "express";
import crypto from "crypto";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();


app.use(express.static("public"));



app.set("view engine", "ejs");


app.get("/", (req, res)=>{
   res.render("index");
});

app.get("/devTesting/loading", (req, res)=>{
   res.render("loading");
});

app.get('/character/:characterName', async (req, res)=>{
   res.render("character", {
      name: req.params.characterName
   });
   
});


app.get('/character/id/:id', async (req, res)=>{
   res.render("character_id", {
      id: req.params.id
   });
   
});

app.get("/api/getCharacterByName/:characterName", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${req.params.characterName}&ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});

app.get("/api/getSeriesByCharacter/:characterID", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/characters/${req.params.characterID}/series?ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});



app.get("/api/getEventsByCharacter/:characterID", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/characters/${req.params.characterID}/events?ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});

app.get("/api/getComicsByCharacter/:characterID", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/characters/${req.params.characterID}/comics?ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});

app.get("/api/getEventByID/:ID", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/events/${req.params.ID}?ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});

app.get("/api/characters", async (req, res)=>{
   let timestamp = new Date().getTime();
   let hashString = `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
   let hash = crypto.createHash("md5").update(hashString).digest("hex");
   let data = await fetch(`http://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hash}`);
   data = await data.json();
   res.send(data);
});


app.listen(3000);