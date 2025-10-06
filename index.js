import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend
app.use(express.static("./"));

// Proxy endpoint
app.get("/proxy", async (req, res) => {
const target = req.query.url;
if (!target) return res.status(400).send("Missing URL parameter.");

try {
const response = await fetch(target);
const data = await response.text();

```
res.set("Content-Type", "text/html");
res.send(data);
```

} catch (err) {
console.error(err);
res.status(500).send("Error fetching target URL.");
}
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
