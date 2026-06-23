document.addEventListener('DOMContentLoaded', () => {
    // When running locally, use localhost. When you deploy the backend, change this to your live API URL
    const API_URL = 'http://localhost:5000/api/portfolio/data';

    const projectsContainer = document.getElementById('dynamic-projects-target');
    const experienceContainer = document.getElementById('dynamic-experience-target');
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    async function loadPortfolioPayload() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP network error: Status ${response.status}`);
            
            const payload = await response.json();
            
            if (payload.success && payload.data) {
                renderProjects(payload.data.projects);
                renderExperience(payload.data.experience);
            } else {
                displayFailureUI();
            }
        } catch (error) {
            console.error('Frontend Exception:', error);
            displayFailureUI();
        }
    }

    function renderProjects(projects) {
        if (!projects || projects.length === 0) {
            projectsContainer.innerHTML = `<p class="loading-state">No portfolio projects found.</p>`;
            return;
        }

        projectsContainer.innerHTML = projects.map(proj => `
            <div class="project-card">
                <div>
                    <span class="badge">${proj.category || 'System'}</span>
                    <h4 class="project-title" style="margin-top: 0.6rem;">${proj.title}</h4>
                    <div style="margin: 0.6rem 0 0.4rem 0;">
                        ${(proj.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <ul class="feature-list">
                        ${(proj.features || []).map(feat => `<li>${feat}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-links">
                    ${proj.github_url ? `<a href="${proj.github_url}" target="_blank"><i class='bx bxl-github'></i> Codebase</a>` : ''}
                    ${proj.live_url ? `<a href="${proj.live_url}" target="_blank"><i class='bx bx-link-external'></i> Live Demo</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    function renderExperience(experience) {
        if (!experience || experience.length === 0) {
            experienceContainer.innerHTML = `<p class="loading-state">No engineering history found.</p>`;
            return;
        }

        experienceContainer.innerHTML = experience.map(exp => `
            <div class="timeline-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
                    <h4 style="font-weight: 600; color: var(--text-primary); font-size: 1.1rem;">${exp.role}</h4>
                    <span class="meta-date">${exp.duration}</span>
                </div>
                <p class="meta-org" style="margin: 0.15rem 0 0.5rem 0;">${exp.organization}</p>
                <ul class="feature-list">
                    ${(exp.responsibilities || []).map(resp => `<li>${resp}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    function displayFailureUI() {
        projectsContainer.innerHTML = `
            <div style="color: #ef4444; font-size: 0.95rem; border: 1px dashed #ef4444; padding: 1rem; border-radius: 8px; grid-column: 1 / -1;">
                <i class='bx bx-error-circle'></i> Connection Error: Could not load data from the Node.js API server. Make sure your backend project is running on port 5000.
            </div>
        `;
    }

    loadPortfolioPayload();
});