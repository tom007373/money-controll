const bcrypt = require("bcrypt");
const pool = require("./db");
const express = require("express");
const path = require("path");

const app = express();

function sprawdzHaslo(haslo) {

    if (haslo.length < 8) {
        return "Hasło musi mieć co najmniej 8 znaków.";
    }

    if (!/[A-Z]/.test(haslo)) {
        return "Hasło musi zawierać dużą literę.";
    }

    if (!/[a-z]/.test(haslo)) {
        return "Hasło musi zawierać małą literę.";
    }

    if (!/[0-9]/.test(haslo)) {
        return "Hasło musi zawierać cyfrę.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(haslo)) {
        return "Hasło musi zawierać znak specjalny.";
    }

    return null;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pierwsza_próba_home.html"));
});
app.post("/register", async (req, res) => {

    const { imie, nazwisko, email, haslo } = req.body;

    const bladHasla = sprawdzHaslo(haslo);

    if (bladHasla) {
        return res.status(400).json({
            message: bladHasla
        });
    }

    if (!imie || !nazwisko || !email || !haslo || !haslo_powt) {
    return res.status(400).json({
        message: "Uzupełnij wszystkie pola."
    });
}
    
    try {
        const istnieje = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (istnieje.rows.length > 0) {
            return res.status(400).json({
                message: "Konto z takim adresem e-mail już istnieje."
            });
        } 
        const zahashowaneHaslo = await bcrypt.hash(haslo, 10);

        await pool.query(
            `INSERT INTO users(imie,nazwisko,email,haslo)
            VALUES($1,$2,$3,$4)`,
            [imie, nazwisko, email, zahashowaneHaslo]
        );

        res.json({
            message: "Konto zostało utworzone!"
        });

        } 
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Błąd podczas zapisu do bazy."
        });
    }

});
app.post("/login", async (req, res) => {

    console.log("Ktoś próbuje się zalogować");

    const { email, haslo } = req.body;

    console.log(email);
    console.log(haslo);

    const { email, haslo } = req.body;

    const wynik = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    if (wynik.rows.length === 0) {
        return res.status(404).json({
            message: "Nie znaleziono użytkownika."
        });
    } 
    console.log(wynik.rows[0]);

    res.json({
        message: "Użytkownik znaleziony."
});
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