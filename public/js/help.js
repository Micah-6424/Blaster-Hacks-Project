let title = document.getElementById("title");
let description = document.getElementById("description");
let asking_price = document.getElementById("asking_price");
let submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
    if(title.value === "" || description.value === "" || asking_price.value === ""){
        alert("All fields are required");
        return;
    }

    if(title.value.length <10){
        alert("Title must be at least 10 characters long");
        return;
    }

    if(title.value.length > 50){
        alert("Title must be at most 50 characters long");
        return;
    }

    if(description.value.length < 30){
        alert("Description must be at least 30 characters long");
        return;
    }

    if(description.value.length > 500){
        alert("Description must be at most 500 characters long");
        return;
    }
    
    let data = {
        title: title.value,
        description: description.value,
        asking_price: asking_price.value
    };

    let response = await fetch("/help", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if(response.status === 200){
        window.location.href = "/";
    } else {
        alert("Error creating help request");
    }
});