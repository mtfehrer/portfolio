/* ==========================================================================
   MINIMALIST SOFTWARE ENGINEER PORTFOLIO JAVASCRIPT
   Pure HTML/CSS/JS with ambient canvas, typing animation, filter logic,
   project detail modals, and an interactive terminal CLI shell.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initTypingEffect();
    initNavToggle();
    initScrollSpy();
    initSkillFilters();
    initProjectFilters();
    initCLI();
    initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Ambient Canvas Animation (Constellation / Grid Matrix in White on Black)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Create dynamic particles
    const particleCount = Math.min(Math.floor(width * 0.04), 60);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 1.5 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby points with white lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.lineWidth = 1 - dist / 120;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. Hero Typing Animation
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const titleElement = document.getElementById('typing-title');
    if (!titleElement) return;

    const titles = [
        "Software Engineer & Systems Architect",
        "Full-Stack Web Developer",
        "Open-Source Contributor",
        "Problem Solver & Tech Lead"
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            titleElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            titleElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2200; // Pause at full sentence
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initNavToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        navToggle.textContent = navLinks.classList.contains('mobile-open') ? '[CLOSE]' : '[MENU]';
    });

    // Close mobile nav when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            navToggle.textContent = '[MENU]';
        });
    });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy (Active Section Highlighting)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   5. Technical Skills Filtering
   -------------------------------------------------------------------------- */
function initSkillFilters() {
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            skillCategories.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   6. Projects Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects-filter .proj-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   7. Project Detail Modal Data & Handler
   -------------------------------------------------------------------------- */
const projectDetailsData = {
    project1: {
        title: "[PROJECT_NAME_1] - Analytics Engine",
        type: "Web Application / Real-time Engine",
        status: "Production v2.4.0",
        description: "[PLACEHOLDER_DETAILS: Detailed architectural breakdown of Project 1. Engineered with high-concurrency event loops, Redis cache layer, and responsive real-time monitoring charts.]",
        architecture: [
            "Frontend: Vanilla JS / HTML5 / CSS3 canvas charts",
            "Backend: Node.js / Express microservices",
            "Data Layer: Redis pub/sub and PostgreSQL time-series database",
            "DevOps: Docker containers deployed on AWS ECS with auto-scaling"
        ],
        github: "https://github.com",
        demo: "https://example.com"
    },
    project2: {
        title: "[PROJECT_NAME_2] - Distributed KV Store",
        type: "Systems / Storage Engine",
        status: "Experimental v0.9.1",
        description: "[PLACEHOLDER_DETAILS: In-depth technical specs for Project 2. Custom implementation of the Raft Consensus algorithm in Rust with optimized log storage and network heartbeats.]",
        architecture: [
            "Core: Pure Rust using Tokio async runtime",
            "Protocols: gRPC / Protocol Buffers for inter-node communication",
            "Storage: LSM-tree storage engine with WAL (Write-Ahead Logging)",
            "Benchmarking: 100k+ ops/sec throughput under simulated packet drop tests"
        ],
        github: "https://github.com",
        demo: "https://example.com"
    },
    project3: {
        title: "[PROJECT_NAME_3] - Security CLI Scanner",
        type: "CLI Tooling / Security Automation",
        status: "Stable v1.2.0",
        description: "[PLACEHOLDER_DETAILS: Overview of Project 3. Command-line utility written in Go to parse codebase dependency graphs and generate vulnerability reports in real time.]",
        architecture: [
            "Language: Go (Golang) compiled to static binary",
            "Features: Parallel worker pool for fast file parsing",
            "Integrations: GitHub Actions CI/CD runner plugin",
            "Outputs: Support for JSON, GFM Markdown, and ANSI terminal rendering"
        ],
        github: "https://github.com",
        demo: "https://example.com"
    },
    project4: {
        title: "[PROJECT_NAME_4] - Developer Workflow Hub",
        type: "Full-Stack Web App",
        status: "Production v1.0.0",
        description: "[PLACEHOLDER_DETAILS: Project 4 walkthrough. Collaborative workspace for engineering teams featuring code snippet sharing, schema validation, and webhooks.]",
        architecture: [
            "Frontend: React + Single-page Monospace UI design system",
            "Backend: Python FastAPI with Async SQLAlchemy ORM",
            "Auth: JWT authentication with OAuth2 GitHub provider",
            "Testing: 95%+ coverage with PyTest and Playwright end-to-end"
        ],
        github: "https://github.com",
        demo: "https://example.com"
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const data = projectDetailsData[projectId] || {
        title: "[PROJECT_DETAILS]",
        type: "Software System",
        status: "Active",
        description: "[Placeholder information for this project. Replace with your custom project notes.]",
        architecture: ["Component A", "Component B"],
        github: "https://github.com",
        demo: "https://example.com"
    };

    modalTitle.textContent = data.title;
    
    let archItems = data.architecture.map(item => `<li>&gt; ${item}</li>`).join('');

    modalBody.innerHTML = `
        <div style="margin-bottom: 15px; border-bottom: 1px solid var(--border-dim); padding-bottom: 10px;">
            <div style="font-size: 0.85rem; opacity: 0.8;">[ TYPE: ${data.type} | STATUS: ${data.status} ]</div>
        </div>
        <p style="margin-bottom: 20px; line-height: 1.6;">${data.description}</p>
        <h4 style="margin-bottom: 10px; font-size: 1rem;">/// ARCHITECTURAL_HIGHLIGHTS</h4>
        <ul style="list-style: none; margin-bottom: 25px;">${archItems}</ul>
        <div style="display: flex; gap: 15px;">
            <a href="${data.demo}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem;">[ LIVE_DEMO ]</a>
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size: 0.85rem;">[ SOURCE_CODE ]</a>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

/* --------------------------------------------------------------------------
   8. Interactive Terminal / CLI Shell
   -------------------------------------------------------------------------- */
function initCLI() {
    const input = document.getElementById('cli-input');
    const output = document.getElementById('cli-output');

    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const commandText = input.value.trim();
            if (commandText.length === 0) return;

            // Log entered command line
            appendCLILine(`guest@portfolio:~$ ${escapeHTML(commandText)}`, 'user-cmd');
            
            // Process command
            processCLICommand(commandText.toLowerCase());

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });
}

function appendCLILine(text, type = 'output') {
    const output = document.getElementById('cli-output');
    const line = document.createElement('div');
    line.className = 'cli-line';
    if (type === 'user-cmd') {
        line.style.fontWeight = 'bold';
    }
    line.innerHTML = text;
    output.appendChild(line);
}

function processCLICommand(cmd) {
    const args = cmd.split(' ');
    const mainCmd = args[0];

    switch (mainCmd) {
        case 'help':
            appendCLILine(`
                AVAILABLE COMMANDS:<br>
                - <span class="cmd-highlight">whoami</span>      : Display developer overview<br>
                - <span class="cmd-highlight">skills</span>      : List technical stack &amp; languages<br>
                - <span class="cmd-highlight">projects</span>    : List featured software projects<br>
                - <span class="cmd-highlight">experience</span>  : View work history<br>
                - <span class="cmd-highlight">contact</span>     : Display contact information<br>
                - <span class="cmd-highlight">clear</span>       : Clear terminal window<br>
                - <span class="cmd-highlight">date</span>        : Show current UTC date/time<br>
                - <span class="cmd-highlight">sudo hire</span>   : Grant full developer access!
            `);
            break;

        case 'whoami':
            appendCLILine(`&gt; USER: [YOUR_NAME] | ROLE: Software Engineer | LOCATION: [YOUR_LOCATION]`);
            break;

        case 'skills':
            appendCLILine(`&gt; LANGUAGES: JavaScript, TypeScript, Python, C++, Go, Rust, SQL<br>&gt; TECH STACK: React, Node.js, Express, Docker, Kubernetes, AWS, PostgreSQL, Redis`);
            break;

        case 'projects':
            appendCLILine(`
                &gt; [PROJECT_NAME_1] - Real-Time Analytics Engine<br>
                &gt; [PROJECT_NAME_2] - Distributed KV Store in Rust<br>
                &gt; [PROJECT_NAME_3] - Security CLI Scanner<br>
                &gt; [PROJECT_NAME_4] - Developer Workflow Hub
            `);
            break;

        case 'experience':
            appendCLILine(`
                &gt; [2024 - PRES] Senior Software Engineer @ [COMPANY_NAME_1]<br>
                &gt; [2022 - 2024] Software Engineer @ [COMPANY_NAME_2]<br>
                &gt; [2021 - 2022] Junior Engineer @ [COMPANY_NAME_3]
            `);
            break;

        case 'contact':
            appendCLILine(`&gt; EMAIL: [YOUR.EMAIL@EXAMPLE.COM]<br>&gt; GITHUB: https://github.com<br>&gt; LINKEDIN: https://linkedin.com`);
            break;

        case 'clear':
            document.getElementById('cli-output').innerHTML = '';
            break;

        case 'date':
            appendCLILine(`&gt; CURRENT_STAMP: ${new Date().toUTCString()}`);
            break;

        case 'sudo':
            if (args[1] === 'hire') {
                appendCLILine(`&gt; [ACCESS GRANTED]: Offer letter received! Opening email client...`);
                setTimeout(() => {
                    window.location.href = '#contact';
                }, 1000);
            } else {
                appendCLILine(`&gt; sudo: '${args.slice(1).join(' ')}' permission denied. Try 'sudo hire'.`);
            }
            break;

        default:
            appendCLILine(`&gt; Command not recognized: '${escapeHTML(cmd)}'. Type <span class="cmd-highlight">'help'</span> for list of commands.`);
            break;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/* --------------------------------------------------------------------------
   9. Direct Contact Form Submission Handler
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
        status.innerHTML = `<span style="color: #ffffff;">[!] ERROR: Please fill in all required fields.</span>`;
        return;
    }

    submitBtn.textContent = "[ TRANSMITTING... ]";
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = "[ TRANSMIT_MESSAGE ]";
        submitBtn.disabled = false;
        status.innerHTML = `<span style="color: #ffffff;">[+] SUCCESS: Message transmitted! Placeholder response logged.</span>`;
        document.getElementById('contact-form').reset();

        setTimeout(() => {
            status.innerHTML = '';
        }, 5000);
    }, 1200);
}

/* --------------------------------------------------------------------------
   10. Current Year Auto-Updater
   -------------------------------------------------------------------------- */
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
