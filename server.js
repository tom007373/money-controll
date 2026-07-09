const pool = require("./db");
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

pool.query("SELECT NOW()")
    .then(res => {
        console.log("Połączono z bazą!");
        console.log(res.rows);
    })
    .catch(err => {
        console.error(err);
    });

app.listen(PORT, () => {
    console.log(`Server działa na porcie ${PORT}`);
});