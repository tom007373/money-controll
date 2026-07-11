let opt_vis = 0;
    let log_vis = 0;
    let rej_vis = 0;
    function opt(){
        if (opt_vis==0){
            document.getElementById("opt").style.right="0px";
            document.getElementById("opt_go").style.visibility="hidden"
            opt_vis=1;
        }
        else{
            document.getElementById("opt").style.right="-300px";
            document.getElementById("opt_go").style.visibility="visible"
            document.getElementById("log").style.visibility = "hidden";
            document.getElementById("rej").style.visibility = "hidden";
            rej_vis = 0;
            log_vis = 0;
            opt_vis=0;
        }
    }
    function log() {

        
        document.getElementById("rej").style.visibility = "hidden";
        rej_vis = 0;

        if (log_vis == 0) {
            document.getElementById("log").style.visibility = "visible";
            log_vis = 1;
        } else {
            document.getElementById("log").style.visibility = "hidden";
            log_vis = 0;
        }
    }
    
    function rej() {

        
        document.getElementById("log").style.visibility = "hidden";
        log_vis = 0;

        if (rej_vis == 0) {
            document.getElementById("rej").style.visibility = "visible";
            rej_vis = 1;
        } else {
            document.getElementById("rej").style.visibility = "hidden";
            rej_vis = 0;
        }
    }
        function pokazHaslo_log() {
        const haslo = document.getElementById("haslo_vis_log");

        if (haslo.type === "password") {
            haslo.type = "text";
        } else {
            haslo.type = "password";
        }
    }
    function pokazHaslo_rej_1() {
        const haslo = document.getElementById("haslo_vis_rej_1");

        if (haslo.type === "password") {
            haslo.type = "text";
        } else {
            haslo.type = "password";
        }
    }
    function pokazHaslo_rej_2() {
        const haslo = document.getElementById("haslo_vis_rej_2");

        if (haslo.type === "password") {
            haslo.type = "text";
        } else {
            haslo.type = "password";
        }
    }
    async function go_rej(event){
    
    alert("dziala")
    
    event.preventDefault();

    let imie = document.getElementById("imie").value;
    let nazwisko = document.getElementById("nazwisko").value;
    let email = document.getElementById("mail").value;
    let h1 = document.getElementById("haslo_vis_rej_1").value;
    let h2 = document.getElementById("haslo_vis_rej_2").value;

    if(h1 != h2){
        alert("Hasła muszą być takie same");
        return;
    }

    if(!sprawdzHaslo(h1)){
        return;
    }

    const odpowiedz = await fetch("/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            imie,
            nazwisko,
            email,
            haslo:h1
        })
    });

    const wynik = await odpowiedz.json();

    if (odpowiedz.ok) {
        
    } else {
        alert("Błąd: " + wynik.message);
    }
}
    function sprawdzHaslo(haslo) {

    if (haslo.length < 8) {
        alert("Hasło musi mieć co najmniej 8 znaków.");
        return false;
    }

    if (!/[A-Z]/.test(haslo)) {
        alert("Hasło musi zawierać dużą literę.");
        return false;
    }

    if (!/[a-z]/.test(haslo)) {
        alert("Hasło musi zawierać małą literę.");
        return false;
    }

    if (!/[0-9]/.test(haslo)) {
        alert("Hasło musi zawierać cyfrę.");
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(haslo)) {
        alert("Hasło musi zawierać znak specjalny.");
        return false;
    }

    return true;
}
document.getElementById("rejForm").addEventListener("submit", go_rej);