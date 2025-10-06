import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow cross-origin requests
app.use(cors());

// Serve frontend files
app.use(express.static("./"));

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  let target = req.query.url;
  if (!target) return res.status(400).send("Missing URL parameter.");
  if (!/^https?:\/\//i.test(target)) target = "https://" + target;

  try {
    const response = await fetch(target);
    const data = await response.text();
    res.set("Content-Type", response.headers.get("content-type") || "text/html");
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching target URL.");
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
