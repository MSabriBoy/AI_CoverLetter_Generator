const form = document.getElementById("cover-form")
const candidateName = document.getElementById("candidate-name");
const jobRole = document.getElementById("job-role");
const companyName = document.getElementById("company-name");
const keySkills = document.getElementById("key-skills");
const suggestions = document.getElementById("suggestions-list");
const skillsContainer = document.getElementById("skills-container");
const generateBtn = document.getElementById("generate-btn");
const outputBox = document.getElementById("output-box");
const copyBtn = document.getElementById("copy-btn");

const popularSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Java",
    "MongoDB",
    "CSS",
    "HTML",
    "Next.js"
];


let selectedSkills = [];

const prompt = `Write a professional cover letter for:

Candidate Name: ${candidateName.value}
Job Role: ${jobRole.value}
Company Name: ${companyName.value}
Key Skills: ${selectedSkills.join(", ")}

Tone: Professional, confident, concise.`;

keySkills.addEventListener("input", () => {
    const keySkillsInput = keySkills.value.toLowerCase();
    suggestions.innerHTML = "";

    if (!keySkillsInput) return;

    const matches = popularSkills.filter(
        skill => skill.toLowerCase().includes(keySkillsInput) && !selectedSkills.includes(skill)
    );

    matches.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;

        li.onclick = () => addSkill(skill);

        suggestions.appendChild(li);
    });
});

keySkills.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && keySkills.value.trim()) {
        e.preventDefault();
        addSkill(keySkills.value.trim());
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
   
    const candidateNameInput = candidateName.value.trim();
    const jobRoleInput = jobRole.value.trim();
    const comapnyNameInput = companyName.value.trim();

    generateBtn.innerText = "Generating...";
generateBtn.disabled = true;
generateBtn.classList.add("loading");


try{
const res = await fetch("http://localhost:5000/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: candidateNameInput,
    role: jobRoleInput,
    company: comapnyNameInput,
    skills: selectedSkills
  })
});

const data = await res.json();

outputBox.innerText =
  data.coverLetter || "AI did not return text. Please try again.";

    document.querySelector(".output-container").classList.remove("hidden");
    copyBtn.style.display = "block";
} catch(error){
    console.log(error);
    alert("Something went wrong while generating>");
}


generateBtn.innerText = "Generate Cover Letter ⚡";
generateBtn.disabled = false;
generateBtn.classList.remove("loading");


});

copyBtn.addEventListener("click", async()=>{
    const text = outputBox.innerText;

    if(!text) return;

    try{
        await navigator.clipboard.writeText(text);
        copyBtn.innerText="Copied!";
        setTimeout(()=>{
            copyBtn.innerText= `Copy to clipboard`
        },1500);
        
    }catch(error){
        alert("Copy Failed", error)
    }

});

function mockApiCall({ candidateNameInput, jobRoleInput, comapnyNameInput, selectedSkills }) {
    return `
    Hello dear I am <b>"${candidateNameInput}"</b>,
    I want you apply in your company <b>"${comapnyNameInput}"</b>
    for <b>"${jobRoleInput}"</b> job role,
    i have many skills <b>"${selectedSkills.join(', ')}"</b>
    Thankyou for your time.
    `;

}

function addSkill(skill) {
    if (selectedSkills.includes(skill)) return;

    selectedSkills.push(skill);

    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerHTML = `${skill} <span>x</span>`;

    tag.querySelector('span').onclick = () => {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        tag.remove();
    };
    updateSkillRequirement();

    skillsContainer.appendChild(tag);

    keySkills.value = "";
    suggestions.innerHTML = "";
}

function updateSkillRequirement() {
  if (selectedSkills.length > 0) {
    keySkills.removeAttribute("required");
  } else {
    keySkills.setAttribute("required", "true");
  }
}
