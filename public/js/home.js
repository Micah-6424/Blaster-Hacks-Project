let logged_in = document.getElementById("btn-primary") == null;

if(!logged_in){
    // dont add event listener

} else { //if logged in
    document.getElementById("sign-out").addEventListener("click", async () => {
        let response = await fetch("/logout", {
            method: "POST"
        });
        
        if (response.status === 200) {
            // refresh the page
            window.location.href = "/";
        }
    });

    document.getElementById("receive-help").addEventListener("click", async () => {
        window.location.href = "/help";
    });
}




console.log(logged_in ? "logged in" : "not logged in");


