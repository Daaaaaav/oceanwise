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
        const yearlyPlastic = plasticItems * 365;
        const lifetimePlastic = yearlyPlastic * 75;

        fetch('/submit_plastic_tracker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plastic_items: plasticItems,
                yearly_plastic: yearlyPlastic,
                lifetime_plastic: lifetimePlastic
            })
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

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
const firebaseConfig = {
    apiKey: "AIzaSyCACLE2MjchrHpw5uXf19IIa_9b6e-k7as",
    authDomain: "oceanwise-748e2.firebaseapp.com",
    projectId: "oceanwise-748e2",
    storageBucket: "oceanwise-748e2.firebasestorage.app",
    messagingSenderId: "132943118250",
    appId: "1:132943118250:web:63af36a11fa381944035d3",
    measurementId: "G-2HD2NTX6R3"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebase.firestore();

db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
})

.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})

.catch((error) => {
    console.error("Error adding document! ", error);
});