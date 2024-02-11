let username = document.getElementById("username");
let password = document.getElementById("password");
let submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
    if(username.value === "" || password.value === ""){
        alert("All fields are required");
        return;
    }


    let data = {
        username: username.value,
        password: password.value
    };

    let response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if(response.status === 200){
        window.location.href = "/";
    } else {
        alert("Invalid username or password"); 
    }
});