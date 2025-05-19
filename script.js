document.addEventListener('DOMContentLoaded', function() {
    let resumeData = {};
    let originalData = {};
    let isEditMode = false;

    // Load data from JSON file
    async function loadResumeData() {
        try {
            const response = await fetch('resume-data.json');
            if (!response.ok) throw new Error('Failed to load resume data');
            resumeData = await response.json();
            originalData = JSON.parse(JSON.stringify(resumeData));
            initializeResume();
        } catch (error) {
            console.error('Error loading resume data:', error);
            // Fallback to default data
            resumeData = {
                profile: {
                    name: "MANSUMA GARAYEVA",
                    profession: "Student",
                    image: "pikachuuuu.png"
                },
                contact: [
                    { icon: "📞", text: "+994993574655", type: "phone" },
                    { icon: "🌐", text: "qarayeva240720@gmail.com", type: "email" },
                    { icon: "📍", text: "Azerbaijan<br>Baku", type: "address" }
                ],
                references: [],
                skills: [],
                about: "",
                education: [],
                experience: []
            };
            originalData = JSON.parse(JSON.stringify(resumeData));
            initializeResume();
        }
    }

    function initializeResume() {
        loadSavedData();
        renderResume();
        addGlobalButtons();
        setupEventListeners();
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            Object.assign(resumeData, JSON.parse(savedData));
        }
    }

    function renderResume() {
        renderProfile();
        renderContact();
        renderReferences();
        renderSkills();
        renderAbout();
        renderEducation();
        renderExperience();
        updateEditModeUI();
    }

    function renderProfile() {
        document.querySelector('.profile-section h1').textContent = resumeData.profile.name;
        document.querySelector('.profession').textContent = resumeData.profile.profession;
        document.querySelector('.profile-img').src = resumeData.profile.image;
    }

    function renderContact() {
        const contactList = document.querySelector('.contact-list');
        contactList.innerHTML = '';
        resumeData.contact.forEach(contact => {
            const li = document.createElement('li');
            li.className = 'editable-field';
            li.innerHTML = `
                <span class="contact-icon">${contact.icon}</span>
                <span contenteditable="true">${contact.text}</span>
            `;
            contactList.appendChild(li);
        });
    }

    function renderReferences() {
        const refContainer = document.querySelector('.reference-item');
        refContainer.innerHTML = '';
        resumeData.references.forEach((ref, index) => {
            const refDiv = document.createElement('div');
            refDiv.className = 'reference-entry';
            refDiv.innerHTML = `
                <h3 class="ref-name">${ref.name}</h3>
                <p class="ref-address">${ref.address}</p>
                <p class="ref-phone">${ref.phone}</p>
                <p class="ref-email">${ref.email}</p>
            `;
            refContainer.appendChild(refDiv);
        });
    }

    function renderSkills() {
        const skillsList = document.querySelector('.skills-list');
        skillsList.innerHTML = '';
        resumeData.skills.forEach(skill => {
            const li = document.createElement('li');
            li.className = 'editable-field';
            li.innerHTML = `
                <span contenteditable="true">${skill}</span>
            `;
            skillsList.appendChild(li);
        });
    }
    function renderAbout() {
        document.querySelector('.about-text').textContent = resumeData.about;
    }

    function renderEducation() {
        const eduContainer = document.querySelector('.education-item');
        eduContainer.innerHTML = '';
        resumeData.education.forEach(edu => {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-entry';
            eduDiv.innerHTML = `
                <h3 class="edu-institution">${edu.institution}</h3>
                <p class="edu-degree">${edu.degree}</p>
                <p class="edu-duration">${edu.duration}</p>
            `;
            eduContainer.appendChild(eduDiv);
        });
    }

    function renderExperience() {
        const expContainer = document.querySelector('.experience-item');
        expContainer.innerHTML = '';
        resumeData.experience.forEach(exp => {
            const expDiv = document.createElement('div');
            expDiv.className = 'experience-entry';
            expDiv.innerHTML = `
                <h3 class="exp-title">${exp.title}</h3>
                <p class="exp-period">${exp.period}</p>
                <p class="exp-company">${exp.company}</p>
                <p class="exp-description">${exp.description}</p>
            `;
            expContainer.appendChild(expDiv);
        });
    }

    function addGlobalButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'global-buttons';
        buttonContainer.innerHTML = `
            <button id="toggleEditBtn" class="edit-mode-btn">✏️ Edit Mode</button>
            <button id="saveResumeBtn" class="save-btn">💾 Save</button>
            <button id="resetResumeBtn" class="reset-btn">🔄 Reset</button>
        `;
        document.body.insertBefore(buttonContainer, document.querySelector('.resume-container'));
    }

    function setupEventListeners() {
        document.getElementById('toggleEditBtn').addEventListener('click', toggleEditMode);
        document.getElementById('saveResumeBtn').addEventListener('click', saveResume);
        document.getElementById('resetResumeBtn').addEventListener('click', resetResume);
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        updateEditModeUI();
        
        if (isEditMode) {
            enableEditMode();
        } else {
            disableEditMode();
        }
    }

    function updateEditModeUI() {
        const editBtn = document.getElementById('toggleEditBtn');
        editBtn.textContent = isEditMode ? '👀 View Mode' : '✏️ Edit Mode';
        editBtn.style.backgroundColor = isEditMode ? '#f39c12' : '#3498db';
    }

    function enableEditMode() {
        // Profile
        document.querySelector('.profile-section h1').innerHTML = `
            <input type="text" value="${resumeData.profile.name}" data-field="profile.name">
        `;
        document.querySelector('.profession').innerHTML = `
            <input type="text" value="${resumeData.profile.profession}" data-field="profile.profession">
        `;

        // Contact
        const contactList = document.querySelector('.contact-list');
        contactList.innerHTML = '';
        resumeData.contact.forEach((contact, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="contact-icon">${contact.icon}</span>
                <input type="text" value="${contact.text}" data-field="contact.${index}.text">
            `;
            contactList.appendChild(li);
        });

        // References
        const refContainer = document.querySelector('.reference-item');
        refContainer.innerHTML = '';
        resumeData.references.forEach((ref, index) => {
            const refDiv = document.createElement('div');
            refDiv.className = 'reference-entry';
            refDiv.innerHTML = `
                <input type="text" value="${ref.name}" data-field="references.${index}.name">
                <input type="text" value="${ref.address}" data-field="references.${index}.address">
                <input type="text" value="${ref.phone}" data-field="references.${index}.phone">
                <input type="text" value="${ref.email}" data-field="references.${index}.email">
                <button class="remove-btn" data-type="references" data-index="${index}">Remove</button>
            `;
            refContainer.appendChild(refDiv);
        });

        // Add Reference button
        const addRefBtn = document.createElement('button');
        addRefBtn.className = 'add-btn';
        addRefBtn.textContent = '+ Add Reference';
        addRefBtn.onclick = addNewReference;
        refContainer.appendChild(addRefBtn);

        // Skills
        const skillsList = document.querySelector('.skills-list');
        skillsList.innerHTML = '';
        resumeData.skills.forEach((skill, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="text" value="${skill}" data-field="skills.${index}">
                <button class="remove-btn" data-type="skills" data-index="${index}">Remove</button>
            `;
            skillsList.appendChild(li);
        });

        // Add Skill button
        const addSkillBtn = document.createElement('button');
        addSkillBtn.className = 'add-btn';
        addSkillBtn.textContent = '+ Add Skill';
        addSkillBtn.onclick = addNewSkill;
        skillsList.appendChild(addSkillBtn);

        // About
        document.querySelector('.about-text').innerHTML = `
            <textarea data-field="about">${resumeData.about}</textarea>
        `;

        // Education
        const eduContainer = document.querySelector('.education-item');
        eduContainer.innerHTML = '';
        resumeData.education.forEach((edu, index) => {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-entry';
            eduDiv.innerHTML = `
                <input type="text" value="${edu.institution}" data-field="education.${index}.institution">
                <input type="text" value="${edu.degree}" data-field="education.${index}.degree">
                <input type="text" value="${edu.duration}" data-field="education.${index}.duration">
                <button class="remove-btn" data-type="education" data-index="${index}">Remove</button>
            `;
            eduContainer.appendChild(eduDiv);
        });

        // Add Education button
        const addEduBtn = document.createElement('button');
        addEduBtn.className = 'add-btn';
        addEduBtn.textContent = '+ Add Education';
        addEduBtn.onclick = addNewEducation;
        eduContainer.appendChild(addEduBtn);

        // Experience
        const expContainer = document.querySelector('.experience-item');
        expContainer.innerHTML = '';
        resumeData.experience.forEach((exp, index) => {
            const expDiv = document.createElement('div');
            expDiv.className = 'experience-entry';
            expDiv.innerHTML = `
                <input type="text" value="${exp.title}" data-field="experience.${index}.title">
                <input type="text" value="${exp.period}" data-field="experience.${index}.period">
                <input type="text" value="${exp.company}" data-field="experience.${index}.company">
                <textarea data-field="experience.${index}.description">${exp.description}</textarea>
                <button class="remove-btn" data-type="experience" data-index="${index}">Remove</button>
            `;
            expContainer.appendChild(expDiv);
        });

        // Add Experience button
        const addExpBtn = document.createElement('button');
        addExpBtn.className = 'add-btn';
        addExpBtn.textContent = '+ Add Experience';
        addExpBtn.onclick = addNewExperience;
        expContainer.appendChild(addExpBtn);

        // Setup remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const index = parseInt(this.dataset.index);
                resumeData[type].splice(index, 1);
                enableEditMode(); // Refresh edit view
            });
        });
    }

    function disableEditMode() {
        updateDataFromInputs();
        renderResume();
    }

    function updateDataFromInputs() {
        // Profile
        const nameInput = document.querySelector('input[data-field="profile.name"]');
        const professionInput = document.querySelector('input[data-field="profile.profession"]');
        if (nameInput) resumeData.profile.name = nameInput.value;
        if (professionInput) resumeData.profile.profession = professionInput.value;

        // Contact
        document.querySelectorAll('.contact-list input').forEach((input, index) => {
            if (resumeData.contact[index]) {
                resumeData.contact[index].text = input.value;
            }
        });

        // References
        document.querySelectorAll('.reference-entry').forEach((entry, index) => {
            if (!resumeData.references[index]) return;
            const inputs = entry.querySelectorAll('input');
            resumeData.references[index].name = inputs[0].value;
            resumeData.references[index].address = inputs[1].value;
            resumeData.references[index].phone = inputs[2].value;
            resumeData.references[index].email = inputs[3].value;
        });

        // Skills
        resumeData.skills = [];
        document.querySelectorAll('.skills-list input').forEach(input => {
            resumeData.skills.push(input.value);
        });

        // About
        const aboutTextarea = document.querySelector('textarea[data-field="about"]');
        if (aboutTextarea) {
            resumeData.about = aboutTextarea.value;
        }

        // Education
        resumeData.education = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            resumeData.education.push({
                institution: inputs[0].value,
                degree: inputs[1].value,
                duration: inputs[2].value
            });
        });

        // Experience
        resumeData.experience = [];
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            const textarea = entry.querySelector('textarea');
            resumeData.experience.push({
                title: inputs[0].value,
                period: inputs[1].value,
                company: inputs[2].value,
                description: textarea.value
            });
        });
    }

    function addNewReference() {
        resumeData.references.push({
            name: "New Reference",
            address: "",
            phone: "",
            email: ""
        });
        enableEditMode();
    }

    function addNewSkill() {
        resumeData.skills.push("New Skill");
        enableEditMode();
    }

    function addNewEducation() {
        resumeData.education.push({
            institution: "New Institution",
            degree: "",
            duration: ""
        });
        enableEditMode();
    }

    function addNewExperience() {
        resumeData.experience.push({
            title: "New Position",
            period: "",
            company: "",
            description: ""
        });
        enableEditMode();
    }

    function saveResume() {
        if (isEditMode) {
            updateDataFromInputs();
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            originalData = JSON.parse(JSON.stringify(resumeData));
            alert('Resume saved successfully!');
            toggleEditMode();
        } else {
            alert('Please enable edit mode to make changes.');
        }
    }

    function resetResume() {
        if (confirm('Are you sure you want to reset all changes?')) {
            resumeData = JSON.parse(JSON.stringify(originalData));
            renderResume();
            if (isEditMode) {
                toggleEditMode();
            }
        }
    }

    // Start the application
    loadResumeData();
});