const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

let allData = {};

// استقبال بيانات من ESP32
app.post("/data", (req, res) => {
  const { username, ...deviceData } = req.body;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  allData[username] = deviceData;
  allData[username].lastUpdated = new Date().toISOString();

  console.log(`Received from ${username}:`, allData[username]);
  res.send("Data received");
});

// إرسال البيانات المطلوبة حسب اسم المستخدم
app.get("/data", (req, res) => {
  const username = req.query.username;

  if (username) {
    if (allData[username]) {
      res.json(allData[username]);
    } else {
      res.status(404).send("No data found for this username");
    }
  } else {
    res.json(allData);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
