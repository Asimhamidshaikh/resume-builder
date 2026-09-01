// Mapping Form Inputs to Output Document Elements
const fieldMap = [
  { in: 'in-name', out: 'out-name', default: 'Alex Smith' },
  { in: 'in-title', out: 'out-title', default: 'Full-Stack Developer & Student' },
  { in: 'in-contact', out: 'out-contact', default: 'alex@example.com | Karachi, PK' },
  { in: 'in-summary', out: 'out-summary', default: 'Professional summary text...' },
  { in: 'in-p1-title', out: 'out-p1-title', default: 'Project 1 Title' },
  { in: 'in-p1-desc', out: 'out-p1-desc', default: 'Project 1 Description...' },
  { in: 'in-p2-title', out: 'out-p2-title', default: 'Project 2 Title' },
  { in: 'in-p2-desc', out: 'out-p2-desc', default: 'Project 2 Description...' }
];

const inSkills = document.getElementById('in-skills');
const outSkills = document.getElementById('out-skills');
const themeSelect = document.getElementById('theme-select');
const resumeSheet = document.getElementById('resume-document');
const btnPrint = document.getElementById('btn-print');

// Initialize Event Listeners & State
function initSync() {
  fieldMap.forEach(item => {
    const inputEl = document.getElementById(item.in);
    const outputEl = document.getElementById(item.out);

    if (inputEl && outputEl) {
      inputEl.addEventListener('input', () => {
        outputEl.textContent = inputEl.value.trim() || item.default;
        saveState();
      });
    }
  });

  inSkills.addEventListener('input', updateSkills);
  themeSelect.addEventListener('change', updateTheme);
  btnPrint.addEventListener('click', () => window.print());

  loadState();
  updateSkills();
}

// Render Skill Badges
function updateSkills() {
  outSkills.innerHTML = '';
  const skills = inSkills.value.split(',');

  skills.forEach(skill => {
    const trimmed = skill.trim();
    if (trimmed) {
      const pill = document.createElement('span');
      pill.className = 'skill-pill';
      pill.textContent = trimmed;
      outSkills.appendChild(pill);
    }
  });
  saveState();
}

// Update Theme Class
function updateTheme() {
  resumeSheet.className = `resume-sheet ${themeSelect.value}`;
  saveState();
}

// LocalStorage Management
function saveState() {
  const data = {
    theme: themeSelect.value,
    skills: inSkills.value
  };

  fieldMap.forEach(item => {
    const inputEl = document.getElementById(item.in);
    if (inputEl) data[item.in] = inputEl.value;
  });

  localStorage.setItem('resume_engine_data', JSON.stringify(data));
}

function loadState() {
  const saved = localStorage.getItem('resume_engine_data');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    if (data.theme) {
      themeSelect.value = data.theme;
      updateTheme();
    }

    if (data.skills) inSkills.value = data.skills;

    fieldMap.forEach(item => {
      if (data[item.in] !== undefined) {
        const inputEl = document.getElementById(item.in);
        const outputEl = document.getElementById(item.out);
        if (inputEl && outputEl) {
          inputEl.value = data[item.in];
          outputEl.textContent = data[item.in].trim() || item.default;
        }
      }
    });
  } catch (err) {
    console.error('Failed to load saved state:', err);
  }
}

initSync();
