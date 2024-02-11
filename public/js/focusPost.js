document.querySelectorAll(".donate_button").forEach(button => button.addEventListener("click", async () => {
    let post_id= window.location.href.split("/").pop();
    let amount_donate = button.value;

        let response = await fetch("/donate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({post_id, amount_donate})
    });
    alert("Donation successful! Thank you for your contribution!");
    window.location.href = "/feed";
}));