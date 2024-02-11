let username = document.getElementById("username");
let password = document.getElementById("password");
let email = document.getElementById("email");
let name = document.getElementById("name");
let submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
   if(username.value === ""  || password.value === "" || email.value === "" || name.value === ""){
       alert("All fields are required");
       return;
   }

   if(password.value.length < 6){
       alert("Password must be at least 6 characters long");
       return;
   }

   if(!validateEmail(email.value)){
       alert("Invalid email");
       return;
    }

    let data = {
         username: username.value,
         email: email.value,
         password: password.value,
        name: name.value
    };

    let response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if(response.status === 200){
        window.location.href = "/";
        return;
    }

    if(response.status === 404){
        alert("Error registering user");
        return;
    }
});


function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
