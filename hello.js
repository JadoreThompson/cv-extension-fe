document.addEventListener("DOMContentLoaded", function() {
    const signUpScreen = document.getElementById("signUpScreen");
    const signUpLink = document.getElementById("signUpLink");
    const signUpSubmit = document.getElementById("signUpSubmit");

    const loginScreen = document.getElementById("loginScreen");
    const loginLink = document.getElementById("loginLink");
    const loginSubmit = document.getElementById("loginSubmit");

    const addCVScreen = document.getElementById("addCVScreen");
    const cvSubmit = document.getElementById("cvSubmit");

    const coverLetterScreen = document.getElementById("coverLetterScreen");

    const loadScreen = document.getElementById("loadingScreen");

    const footer = document.getElementById("footer");
    footer.style.visibility = "hidden";

    const googleSignUpButton = document.getElementById("googleSignIn");
    const googleLogInButton = document.getElementById("googleLogIn");

    googleSignUpButton.addEventListener("click", async function() {
        chrome.identity.getAuthToken({ interactive: true }, async function(token) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            showAlert("Failed to authenticate with Google");
            return;
          }

          // Use the token to get user information
          try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
            const data = await response.json();
            await handleGoogleSignUp(data);

          } catch (error) {
            showAlert(error);
          }
        });
    });

    googleLogInButton.addEventListener("click", async function() {
        chrome.identity.getAuthToken({ interactive: true }, async function(token) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            showAlert("Failed to authenticate with Google");
            return;
          }

          // Use the token to get user information
          try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
            const data = await response.json();
            await handleGoogleLogIn(data);

          } catch (error) {
            showAlert(error);
          }
        });
    });

    async function handleGoogleSignUp(userData) {
        try {
            const response = await fetch("http://localhost:8000/google-signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: userData.email, name: userData.name})
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            showAlert("Successfully Sign Up");

            signUpScreen.style.display = "none";
            addCVScreen.style.display = "block";
            footer.style.visibility = "visible";

        } catch (error) {
            showAlert(error);
        }
    }

    async function handleGoogleLogIn(userData) {
        try {
            const response = await fetch("http://localhost:8000/google-login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: userData.email, name: userData.name})
            });

            if (!response.ok) {
                throw new Error("Login Endpoint Failed");
            }

            const data = await response.json();
            showAlert("Successfully logged In");

            loginScreen.style.display = "none";
            addCVScreen.style.display = "block";
            footer.style.visibility = "visible";

        } catch (error) {
            showAlert(error);
        }
    }

//    if(localStorage.getItem("user_id")) {
//        loginScreen.style.display = "none";
//        coverLetterScreen.style.display = "block";
//        footer.style.visibility = "visible";
//    }


    // Authentication
    signUpLink.addEventListener("click", function(){
        loginScreen.style.display = "none";
        signUpScreen.style.display = "block";
    });
    signUpSubmit.addEventListener("click", async function(){
        const name = document.querySelector("#signUpScreen .auth-card .card-body .form-group input[type='text']").value;
        const email = document.querySelector("#signUpScreen .auth-card .card-body .form-group input[type='email']").value;
        const password = document.querySelector("#signUpScreen .auth-card .card-body .form-group input[type='password']").value;

        try {
            const response = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password, name: name})
            });

            if (!response.ok) {
                throw new Error("Error signing up");
            }

             const data = await response.json();
             console.log("Success Signing Up: ", data.detail);

             showAlert("Successfully sign up");
             signUpScreen.style.display = "none";
             coverLetterScreen.style.display = "block";
             footer.style.visibility = "visible";
        } catch (error) {
            console.log("Error");
        }
    });

    loginLink.addEventListener("click", function(){
        signUpScreen.style.display = "none";
        loginScreen.style.display = "block";
    });
    loginSubmit.addEventListener("click", async function(){
        const email = document.querySelector("#loginScreen .auth-card .card-body input[type='email']").value;
        const password = document.querySelector("#loginScreen .auth-card .card-body input[type='password']").value;

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            });

            if (!response.ok) {
                throw new Error("Error logging in");
            }

            const data = await response.json();
            console.log("Success logging in");
            localStorage.setItem("user_id", data.user_id);
            showAlert("Successfully logged In")

            loginScreen.style.display = "none";
            coverLetterScreen.style.display = "block";
            footer.style.visibility = "visible";
        } catch (error) {
            console.log("Had to catch an error");
        }
    });

    // Saving CV
    if (localStorage.getItem("cv")) {
        const cv = localStorage.getItem("cv");
        console.log("CV: ", cv);
        const fileDisplayName = document.querySelector(".inner-container h4");
        fileDisplayName.textContent = cv;
    }

    const submitter = document.getElementById("cvSubmitter");
    submitter.addEventListener("click", function() {
        const fileInput = document.querySelector(".cv-submit").click();
    });

    const cvInputBox = document.querySelector(".cv-submit");
    cvInputBox.addEventListener("change", function(event){
        const file = event.target.files[0];
        if (file) {
            const fileDisplayName = document.querySelector(".inner-container h4");
            fileDisplayName.textContent = file.name;
        }
    });

    cvSubmit.addEventListener("click", async function(){
        addCVScreen.style.display = "none";
        loadingScreen.style.display = "flex";

        const fileInput = document.querySelector(".cv-submit");
        const cv = fileInput.files[0];
        const userId = 1;

        const formData = new FormData();
        formData.append("cv", cv);
        formData.append("user_id", userId);

        try {
            const response = await fetch("http://localhost:8000/upload-cv", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                showAlert("Error saving CV");
            }

            const data = await response.json();
            localStorage.setItem("cv", cv.name);
            showAlert("CV Saved");

        } catch (error) {
            showAlert("Error saving CV");
        } finally {
            loadScreen.style.display = "none";
            addCVScreen.style.display = "block";
        }
    });

    // Generating Cover Letter
    const jobDescBox = document.getElementById("jobDescBox");
    jobDescBox.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("jobDescSubmit").click();
        }
    });

    const jobDescSubmit = document.getElementById("jobDescSubmit");
    let originalColor = jobDescSubmit.style.color;
    jobDescSubmit.addEventListener("mousedown", function() {
        jobDescSubmit.style.color = "blue";
    });

    jobDescSubmit.addEventListener("mouseup", function() {
        jobDescSubmit.style.color = originalColor;
    });

    jobDescSubmit.addEventListener("click", async function() {
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
                    await showAlert("failed");
                    console.log("Monkey");
                }

                const data = await response.json();
                console.log("Success: ", data.cover_letter);

                const container = document.querySelector(".card-body ul");
                const li = document.createElement("li");
                const div = document.createElement("div");
                const span = document.createElement("span");
                const span2 = document.createElement("span");

                span.classList.add("copy-button");
                div.classList.add("cover-letter-container");

                span2.textContent = "Copy";
                span.appendChild(span2);
                div.appendChild(span);
                const paragraphs = data.cover_letter.split("\n\n");
                paragraphs.forEach(paragraph => {
                    const p = document.createElement("p");
                    p.textContent = paragraph.trim();
                    div.appendChild(p);
                });

                li.appendChild(div);
                container.appendChild(li);

            } catch (error) {
                console.error("Error:", error);
                showAlert("Failed to generate application");
            }
        } else {
            showAlert("Job description is empty");
        }
    });

    const copyButton = document.querySelector(".copy-button");
    originalColor = copyButton.style.backgroundColor;
    copyButton.addEventListener("mousedown", function() {
        copyButton.style.backgroundColor = "#fdfbf7";
    });
    copyButton.addEventListener("mouseup", function() {
        copyButton.style.backgroundColor = originalColor;
    });

    copyButton.addEventListener("click", function() {
        const div = this.closest(".cover-letter-container");
        const p = div.querySelector('p');
        navigator.clipboard.writeText(p.textContent);
        showAlert("Copied CV!");
    });

    // Extension Alert
    function showAlert(message) {
        const alertBox = document.getElementById('customAlert');
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = message; // Set the alert message
        alertBox.classList.remove('inactive');
        alertBox.classList.add('active');

        // Auto-close after 3 seconds
        setTimeout(() => {
            alertBox.classList.add('inactive');
            alertBox.classList.remove('active');
        }, 3000);
    }

    // Footer
    const icons = document.querySelectorAll('#footer .icon-container i');
    console.log("icons: ", icons);

    function handleMouseDown(event) {
        event.target.style.color = '#6db2fd';
    }

    function handleMouseUp(event) {
        event.target.style.color = '';
    }

    icons.forEach(icon => {
        icon.addEventListener('mousedown', handleMouseDown);
        icon.addEventListener('mouseup', handleMouseUp);
    });

    const addCVIcon = document.getElementById("addCVIcon");
    const getCoverLetterIcon = document.getElementById("getCoverLetterIcon");

    addCVIcon.addEventListener("click", function() {
        coverLetterScreen.style.display = "none";
        addCVScreen.style.display = "block";
    });

    getCoverLetterIcon.addEventListener("click", function(){
        addCVScreen.style.display = "none";
        coverLetterScreen.style.display = "block";
    });
});