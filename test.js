const userId = ''
const url = "http://localhost:8080/api/books";
const options = {
  headers: {
    Authorization: `Bearer ${userId}`,
  },
};
const app = async () => {
  const res = await fetch(url, options);
  const data = await res.json();
  console.log(data);
};
app();
// const http = require("http");
// const fs = require ("fs")
// const server = http.createServer((req, res)=>{
//   if(req.url === "/tv" && req.method === "GET"){
//     fs.existsSync("./video/mp4", (exist)=>{
//       if(exist){
//         res.writeHead(200, {"Content-Type": "video/mp4"});
//         const vid = fs.createReadStream("./video/mp4");
//         vid.
//       }
//     })
//   }
// })
