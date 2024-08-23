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
    const cvSubmit = document.querySelector("#addCVScreen .auth-container .form-group input[type='submit']");

    const coverLetterScreen = document.getElementById("coverLetterScreen");

    if(localStorage.getItem("user_id")) {
        loginScreen.style.display = "none";
        coverLetterScreen.style.display = "block";
    }

    // Authentication
    signUpLink.addEventListener("click", function(){
        loginScreen.style.display = "none";
        signUpScreen.style.display = "block";
    });
    signUpSubmit.addEventListener("click", function(){
        const name = document.querySelector("#signUpScreen .auth-container input[type='text']").value;
        const email = document.querySelector("#signUpScreen .auth-container input[type='email']").value;
        const password = document.querySelector("#signUpScreen .auth-container input[type='password']").value;

        fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password, name: name})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            return response.json();
        })
        .then(data => {
            console.log("Success:", data.message);
            signUpScreen.style.display = "none";
            addCVScreen.style.display = "block";
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error (e.g., display error message to user)
        });
    });

    loginLink.addEventListener("click", function(){
        signUpScreen.style.display = "none";
        loginScreen.style.display = "block";
    });
    loginSubmit.addEventListener("click", function(){
        const email = document.querySelector("#loginScreen .auth-container input[type='email']").value;
        const password = document.querySelector("#loginScreen .auth-container input[type='password']").value;

        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Signup Failed");
            }
            return response.json()
        })
        .then(data => {
            localStorage.setItem("user_id", data.user_id);
            console.log("Success: ", data.user_id);
            loginScreen.style.display = "none";
            addCVScreen.style.display = "block";
        })
        .catch(error => {
            console.error("Error: ", error);
        });
    });

    // Saving CV
    // TODO: handle the CV being added
    cvSubmit.addEventListener("click", function(){
        const fileInput = document.querySelector("#addCVScreen .auth-container .form-group input[type='file']");
        const cv = fileInput.files[0];
        const userId = 1;

        const formData = new FormData();
        formData.append("cv", cv);
        formData.append("user_id", userId);

        fetch("http://localhost:8000/upload-cv", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error");
            } return response.json()
        })
        .then(data => {
            addCVScreen.style.display = "none";
            coverLetterScreen.style.display = "block";
        });
    });

    // Generating Cover Letter
    // TODO: Generate the response from the necessary API calls for generation
    const jobDescSubmit = document.querySelector(".job-description input[type='submit']");
    jobDescSubmit.addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent form submission

        const jobDesc = document.getElementById("jobDescBox").value;
        const user_id = localStorage.getItem("user_id");

        if (jobDesc && user_id) {
            try {
                const response = await fetch("http://localhost:8000/cover-letter", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({job_description: jobDesc, user_id: parseInt(user_id)})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Success: ", data.cover_letter);

                // TODO: Handle the response data (e.g., display the generated cover letter)
                const container = document.querySelector(".cover-container ul");
                const li = document.createElement("li");
                const div = document.createElement("div")
                div.classList.add("cover-letter");
                const p = document.createElement("p");

                p.textContent = data.cover_letter;
                div.appendChild(p);
                li.appendChild(div);
                container.appendChild(li);

            } catch (error) {
                console.error("Error:", error);
                // TODO: Handle errors (e.g., display error message to user)
            }
        } else {
            console.error("Job description is empty");
            // TODO: Inform the user that job description is required
        }
    });

});