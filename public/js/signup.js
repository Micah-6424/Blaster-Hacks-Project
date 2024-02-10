let name = document.getElementById("name");
let user_name = document.getElementById("user_name");

let email = document.getElementById("email");
let password = document.getElementById("password");
let submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
   if(name.value === "" || user_name.value === "" || email.value === "" || password.value === ""){
       alert("All fields are required");
       return;
   }

   if(password.value.length < 6){
       alert("Password must be at least 6 characters long");
       return;
   }

   if(!email.value.includes("@")){
       alert("Email is not valid");
       return;
   }

    let data = {
         name: name.value,
         user_name: user_name.value,
         email: email.value,
         password: password.value
    };

    let response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
});