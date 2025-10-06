import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h2>Bünker Proxy Launcher</h2>
    <button onclick="start()">Open Site</button>
    <script>
      function start() {
        const url = prompt("Enter a site URL:");
        if (!url) return;

        const proxyUrl = "/proxy?url=" + encodeURIComponent(url);
        const win = window.open("about:blank", "_blank");

        fetch(proxyUrl)
          .then(res => res.text())
          .then(html => {
            win.document.open();
            win.document.write(html);
            win.document.close();
          })
          .catch(err => {
            win.document.write("<h1>Failed: " + err + "</h1>");
          });
      }
    </script>
  `);
});

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing url");

  try {
    const response = await fetch(url);
    let body = await response.text();

    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Frame-Options", "");
    res.setHeader("Content-Security-Policy", "");

    res.send(body);
  } catch (err) {
    res.status(500).send("Failed to fetch: " + err.message);
  }
});

app.listen(PORT, () => console.log("Proxy running on port " + PORT));
