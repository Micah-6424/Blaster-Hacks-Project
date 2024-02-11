let logged_in = document.getElementById("btn-primary") == null;

if(!logged_in){
    //    hide the elements that are only for logged in users
} else { //if logged in
    // remove the hidden class from all the elements that have it
    document.querySelectorAll(".noneee").forEach((element) => {
        console.log("here!");
        element.classList.remove("noneee");
    });
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

    document.getElementById("donate").addEventListener("click", async () => {
        window.location.href = "/feed";
    });
}




console.log(logged_in ? "logged in" : "not logged in");


