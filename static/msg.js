$(document).ready(function () {
    $("#textForm").submit(function (e) {
        e.preventDefault();
        const userMessage = $("#text").val().trim();
        if (userMessage === "") return;
        $("#messageContainer").append(`<div class="user-message">${userMessage}</div>`);
        $("#text").val(""); 

        $.ajax({
            type: "POST",
            url: "/get_text_response",
            contentType: "application/json",
            data: JSON.stringify({ message: userMessage }),
            success: function (response) {
                $("#messageContainer").append(`<div class="bot-message">${response.response}</div>`);
            },
            error: function () {
                $("#messageContainer").append(`<div class="bot-message">Sorry, there was an error processing your request!</div>`);
            }
        });
    });

    $("#plastic-tracker-form").submit(function (e) {
        e.preventDefault();
        const plasticItems = parseInt($("#plastic-items").val(), 10);
        if (isNaN(plasticItems) || plasticItems < 0) {
            $("#plastic-response").text("Please enter a valid number of plastic items!");
            return;
        }

        fetch('/submit_plastic_tracker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plastic_items: plasticItems })
        })
            .then(response => response.json())
            .then(data => {
                $("#plastic-response").text(data.message);
            })
            .catch(() => {
                $("#plastic-response").text("Error submitting plastic usage data! Please try again.");
            });
    });
});
