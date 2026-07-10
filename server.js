const pool = require("./db");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pierwsza_próba_home.html"));
});
app.post("/register", async (req, res) => {

    const { imie, nazwisko, email, haslo } = req.body;

    try {

        await pool.query(
            `INSERT INTO users (imie, nazwisko, email, haslo)
             VALUES ($1, $2, $3, $4)`,
            [imie, nazwisko, email, haslo]
        );

        res.json({
            message: "Konto zostało utworzone!"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Błąd podczas zapisu do bazy."
        });
    }

});
const PORT = process.env.PORT || 3000;

async function initDB() {
    try {

        // Sprawdzenie połączenia
        const res = await pool.query("SELECT NOW()");
        console.log("Połączono z bazą!");
        console.log(res.rows);

        // Tworzenie tabeli
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                imie VARCHAR(50) NOT NULL,
                nazwisko VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                haslo TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tabela users gotowa.");

    } catch(err){
        console.error(err);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server działa na porcie ${PORT}`);
    });
});