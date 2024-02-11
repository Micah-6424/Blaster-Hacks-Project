let title = document.getElementById("title");
let description = document.getElementById("description");
let submit = document.getElementById("submit");
let tag = document.getElementById("tag")


submit.addEventListener("click", async () => {
    if(title.value === "" || description.value === "" || selectedAmount == 0){
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
        asking_price: selectedAmount,
        tag: tag.value
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

// for clicking amount buttons
let selectedAmount = 0;

document.querySelectorAll(".amount").forEach((button) => {
    // add event listener to each button to see if it was clicked, if it was, add the class "selected" to it and remove the class from the other buttons
    button.addEventListener("click", () => {
        selectedAmount = button.value;
        document.querySelectorAll(".amount").forEach((button) => {
            button.classList.remove("button_clicked");
        });
        button.classList.add("button_clicked");
        selectedAmount = Number.parseInt(button.value);
    });
});