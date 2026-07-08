const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pliki statyczne
app.use(express.static(path.join(__dirname, "public")));

// Strona główna
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pierwsza_próba_home.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server działa na porcie ${PORT}`);
});