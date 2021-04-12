const http = require('http');
const fs = require('fs');

const artists = JSON.parse(fs.readFileSync('./seeds/artists.json'));
const albums = JSON.parse(fs.readFileSync('./seeds/albums.json'));
const songs = JSON.parse(fs.readFileSync('./seeds/songs.json'));

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      switch(req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    // GET /artists
    if (req.method === "GET" && req.url === "/artists") {
      const resBody = JSON.stringify(Object.values(artists));
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(resBody);
      return res.end();
    }

    // Route handlers here

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write("Endpoint not found");
    return res.end();
  });
});

const port = 3000;

server.listen(port, () => console.log('Server is listening on port', port));
