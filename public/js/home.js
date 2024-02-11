document.getElementById("sign-out").addEventListener("click", async () => {
    let response = await fetch("/logout", {
        method: "POST"
    });
    
    if (response.status === 200) {
        // refresh the page
        window.location.href = "/";
    }
});


document.getElementById(""