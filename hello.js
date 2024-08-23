document.addEventListener("DOMContentLoaded", function() {
    /* TODO:
            - Save user_id in local storage, check to see if auth is necessary
            - Add phone number for registering. Let the user know that
                the email and phone number will be used in the cover letter
                as points of contact
            - Possible features:
                - Bookmark cover letters to a list (users can save their most liked
                    cover letters)
    */

    const signUpScreen = document.getElementById("signUpScreen");
    const signUpLink = document.getElementById("signUpLink");
    const signUpSubmit = document.getElementById("signUpSubmit");

    const loginScreen = document.getElementById("loginScreen");
    const loginLink = document.getElementById("loginLink");
    const loginSubmit = document.getElementById("loginSubmit");

    const addCVScreen = document.getElementById("addCVScreen");
    const addCVForm = document.querySelector("#adCVScreen .auth-container .form-group input[type='submit']")

    // Authentication
    signUpLink.addEventListener("click", function(){
        loginScreen.style.display = "none";
        signUpScreen.style.display = "block";
    });
    signUpSubmit.addEventListener("click", function(){
//        const name = document.querySelector("#signUpScreen .auth-container input[type='text']");
//        const email = document.querySelector("#signUpScreen .auth-container input[type='email']");
//        const password = document.querySelector("#signUpScreen .auth-container input[type='password']");
//
//        fetch(link, {
//            method: "POST",
//            headers: {"Content-Type": "application/json"},
//            body: JSON.stringify({}) // TODO: Fill this out with the necessary structure specified
//        })
//        .then(response => {
//            if (response.status == 200){
//                console.log("Success");
//            }return response.json()
//        })
//        .then(data => {
//            // TODO: Build this out to process the response
//            addCVScreen.style.display = "block";
//        })
//        .catch(error => {
//            console.log("Error");
//        })
        signUpSubmit.style.display = "none";
        addCVScreen.style.display = "block";
    });

    loginLink.addEventListener("click", function(){
        signUpScreen.style.display = "none";
        loginScreen.style.display = "block";
    });
    loginSubmit.addEventListener("click", function(){
        const email = document.querySelector("#loginScreen .auth-container input[type='email']");
        const password = document.querySelector("#loginScreen .auth-container input[type='password']");

//        fetch(link, {
//            method: "POST",
//            headers: {"Content-Type": "application/json"},
//            body: JSON.stringify({}) // TODO: Fill this out with the necessary structure specified
//        })
//        .then(response => {
//            if (response.status == 200){
//                console.log("Success");
//            }return response.json()
//        })
//        .then(data => {
//            // TODO: Build this out to process the response
//            addCVScreen.style.display = "block";
//        })
//        .catch(error => {
//            console.log("Error");
//        })
        loginScreen.style.display = "none";
        addCVScreen.style.display = "block";
    });

    // Saving CV
    // TODO: handle the CV being added

    // Generating Cover Letter
    // TODO: Generate the response from the necessary API calls for generation
});