document.addEventListener("DOMContentLoaded", function() {
    const jobDescArea = document.getElementById("jobDescription");
    const userCV = document.getElementById("userCV");
    const generateBtn = document.getElementById("generateButton");

    generateBtn.addEventListener("click", function() {
        const jobDesc = jobDescArea.value;
        const cv = userCV.files[0];
        console.log("Job desc", jobDesc);
        console.log("selected cv file", cv);

        function getCoverLetter(jobDesc) {
            fetch()
        }
    });
});

