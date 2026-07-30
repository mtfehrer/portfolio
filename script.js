/* ==========================================================================
   MINIMALIST SOFTWARE ENGINEER PORTFOLIO JAVASCRIPT
   Michael Fehrer - Portfolio Logic
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
        "Software Engineer",
        "CS Master's Student @ Binghamton",
        "Full-Stack Web Developer",
        "Robotics & Systems Researcher"
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
   7. Project Detail Modal Data & Handler (Populated from Resume)
   -------------------------------------------------------------------------- */
const projectDetailsData = {
    project1: {
        title: "Autonomous UAV Collision Avoidance & SLAM",
        type: "Research Project / Autonomous Systems",
        status: "May – August 2025",
        description: "Developed a 3D LiDAR drone simulation using the PyBullet physics engine to evaluate spatial mapping and A* pathfinding within a voxel grid environment, monitored via a custom TCP server. Modified ORB-SLAM C++ source code to continuously export point cloud and camera position data into a custom C++ program rendering live occupancy grid updates.",
        architecture: [
            "3D LiDAR simulation in PyBullet physics engine evaluating voxel grid spatial mapping & A* pathfinding",
            "Custom C++ occupancy grid mapper continuously ingesting ORB-SLAM point clouds & camera positions",
            "Live real-time 3D grid rendering via custom PyVista Python visualization scripts",
            "Containerized ROS environments via Docker on NVIDIA Jetson embedded hardware with automated RGBD & rosbag scripts"
        ],
        github: "https://github.com/mtfehrer",
        demo: "#"
    },
    project2: {
        title: "Volunteer Opportunities Platform",
        type: "Group Project / Hackathon Winner",
        status: "HackBU 2023 - 3rd Place Civic Engagement",
        description: "Developed a platform for users to create and share volunteering opportunities. Built the frontend using Vue.js for displaying community activities scraped via a Python API, with Spring Boot and MySQL backend components containerized using Docker Compose.",
        architecture: [
            "Vue.js interactive frontend displaying local volunteering events and community initiatives",
            "Python web scraper API extracting real-time local event data",
            "Spring Boot RESTful microservices architecture",
            "MySQL database containerized with Docker Compose for local development & deployment"
        ],
        github: "https://github.com/mtfehrer",
        demo: "#"
    },
    project3: {
        title: "Course Scheduler System",
        type: "Course Project / C++ System",
        status: "February 2023",
        description: "Designed a command-line course scheduling application in C++ that manages student enrollment and course rosters. Utilized dynamic memory allocation to handle student and course objects implemented using OOP principles, with an automated Makefile build system.",
        architecture: [
            "C++ Command-Line Application with dynamic student & roster management",
            "Object-Oriented Programming (OOP) design with custom memory allocation/cleanup",
            "Automated Makefile script for compilation, binary packaging, and workspace cleanup"
        ],
        github: "https://github.com/mtfehrer",
        demo: "#"
    },
    project4: {
        title: "Full Stack Forum Web Application",
        type: "Independent Project",
        status: "July – August 2022",
        description: "Built a full stack web application to create and share public posts with user accounts using React.js and Node.js. Implemented a REST API for managing data transfer between client and server, integrated with JWT authentication and MongoDB ORM.",
        architecture: [
            "React.js Single-Page Application (SPA) frontend with dynamic post feeds",
            "Node.js & Express RESTful API backend handling post CRUD operations",
            "JSON Web Token (JWT) authentication for secure user registration & login",
            "MongoDB database with ORM data modeling"
        ],
        github: "https://github.com/mtfehrer",
        demo: "#"
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const data = projectDetailsData[projectId] || {
        title: "Project Details",
        type: "Software System",
        status: "Active",
        description: "Project details from Michael Fehrer's resume.",
        architecture: ["Component A", "Component B"],
        github: "https://github.com/mtfehrer",
        demo: "#"
    };

    modalTitle.textContent = data.title;
    
    let archItems = data.architecture.map(item => `<li>&gt; ${item}</li>`).join('');

    modalBody.innerHTML = `
        <div style="margin-bottom: 15px; border-bottom: 1px solid var(--border-dim); padding-bottom: 10px;">
            <div style="font-size: 0.85rem; opacity: 0.8;">[ TYPE: ${data.type} | DATES: ${data.status} ]</div>
        </div>
        <p style="margin-bottom: 20px; line-height: 1.6;">${data.description}</p>
        <h4 style="margin-bottom: 10px; font-size: 1rem;">/// TECHNICAL_HIGHLIGHTS</h4>
        <ul style="list-style: none; margin-bottom: 25px;">${archItems}</ul>
        <div style="display: flex; gap: 15px;">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem;">[ VIEW_GITHUB ]</a>
            <button onclick="closeProjectModal()" class="btn btn-secondary" style="font-size: 0.85rem;">[ CLOSE ]</button>
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
                - <span class="cmd-highlight">experience</span>  : View work history &amp; internships<br>
                - <span class="cmd-highlight">contact</span>     : Display contact information<br>
                - <span class="cmd-highlight">clear</span>       : Clear terminal window<br>
                - <span class="cmd-highlight">date</span>        : Show current UTC date/time<br>
                - <span class="cmd-highlight">sudo hire</span>   : Send direct message / contact prompt
            `);
            break;

        case 'whoami':
            appendCLILine(`&gt; USER: Michael Fehrer | ROLE: Software Engineer | EDUCATION: MS in CS @ Binghamton University (GPA: 3.8)`);
            break;

        case 'skills':
            appendCLILine(`&gt; LANGUAGES: Python, JavaScript, TypeScript, Java, C++, C, HTML, CSS, SQL<br>&gt; FRAMEWORKS: React.js, Next.js, Express.js, Vue.js, Flask, Angular, Spring Boot<br>&gt; DEVOPS/TOOLS: Linux, Git, Docker, AWS, OpenShift, Pytest, MySQL, MongoDB, ROS`);
            break;

        case 'projects':
            appendCLILine(`
                &gt; 1. Autonomous UAV Collision Avoidance &amp; SLAM (PyBullet, ORB-SLAM C++, ROS)<br>
                &gt; 2. Volunteer Opportunities Platform (Vue.js, Python, Spring Boot, MySQL, Docker)<br>
                &gt; 3. Course Scheduler System (C++, OOP, Dynamic Memory, Makefile)<br>
                &gt; 4. Full Stack Forum Web App (React.js, Node.js, Express, MongoDB, JWT)
            `);
            break;

        case 'experience':
            appendCLILine(`
                &gt; [2024] Software Engineer Intern @ Broadridge Financial Solutions<br>
                &gt; [2023] Full Stack Web Developer Intern @ Red Hat<br>
                &gt; [2025] Autonomous UAV Software Researcher @ Binghamton University
            `);
            break;

        case 'contact':
            appendCLILine(`&gt; EMAIL: mtfehrer@gmail.com<br>&gt; PHONE: (607) 422-4595<br>&gt; LINKEDIN: https://www.linkedin.com/in/michael-fehrer/<br>&gt; GITHUB: https://github.com/mtfehrer`);
            break;

        case 'clear':
            document.getElementById('cli-output').innerHTML = '';
            break;

        case 'date':
            appendCLILine(`&gt; CURRENT_STAMP: ${new Date().toUTCString()}`);
            break;

        case 'sudo':
            if (args[1] === 'hire') {
                appendCLILine(`&gt; [ACCESS GRANTED]: Initiating contact sequence... Redirecting to contact section.`);
                setTimeout(() => {
                    window.location.href = '#contact';
                }, 800);
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
        status.innerHTML = `<span style="color: #ffffff;">[+] SUCCESS: Message transmitted to mtfehrer@gmail.com</span>`;
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
