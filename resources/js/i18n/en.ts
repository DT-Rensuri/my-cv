export default {
    nav: {
        about: 'About',
        education: 'Education',
        experience: 'Experience',
        skills: 'Skills',
        contact: 'Contact',
        contactCta: 'CONTACT',
        language: 'Select language',
        projectsCta: 'PROJECTS',
    },
    hero: {
        ready: 'READY TO QUEST',
        tagline: '> Building efficient, smart and scalable web systems — combining optimization thinking and AI automation.',
        contactMe: 'CONTACT ME',
        downloadCv: 'DOWNLOAD CV',
        character: 'CHARACTER',
        exp: 'EXP',
        expValue: '2+ YRS',
        projects: 'PROJECTS',
        stack: 'STACK',
        status: 'STATUS',
        alive: 'ALIVE',
        pressScroll: 'PRESS SCROLL',
    },
    about: {
        title: 'Career Objective',
        devLabel: 'DEV:',
        classLabel: '[AI AUTOMATION MAGE]',
        dialogue: 'DIALOGUE 1/1',
        continue: '▼ CONTINUE',
    },
    education: {
        title: 'Education',
        record: 'EDUCATION RECORD',
        degree: 'DEGREE',
        period: 'PERIOD',
        rank: 'RANK',
    },
    experience: {
        title: 'Work Experience',
        active: 'ACTIVE',
    },
    skills: {
        title: 'Skills',
    },
    contact: {
        heading: 'Contact',
        subtitle: '> I am always ready to discuss Fullstack opportunities, AI projects and automation. Feel free to reach out!',
        phone: 'Phone',
        address: 'Address',
        sendEmail: 'SEND EMAIL',
        builtWith: 'BUILT WITH VUE & TAILWIND',
        backToTop: 'Back to top',
    },
    chatbot: {
        greeting:
            '> Hello! I am **Suri** — {name}\'s smart AI assistant.\n> Ask me anything you care about! **(⁠ ⁠╹⁠▽⁠╹⁠ ⁠)**',
        suggestions: [
            'How do I change the theme?',
            'What are {name}\'s skills?',
            'How to contact?',
        ],
        inputPlaceholder: '> Type your question...',
        send: 'Send',
        close: 'Close chat',
        openTooltip: 'Click to open chat',
        header: 'BOT:',
        headerName: 'SURI',
        online: '[ONLINE] LV.',
        thinking: 'Thinking',
        fallback: {
            experience: '> {name} is a Fullstack Developer at ZOTEK 8 (10/2023 — present). Completed 5 projects: Survey System, Data Collection Tool, Multi-Platform CMS, Enterprise Invoice CMS, and E-Learning Platform.',
            skills: '> Backend: Laravel, Express.js, Next.js | Frontend: Vue.js, React.js, Blade, TailwindCSS, Bootstrap | AI: AI assistant & Automation Tools, Vibe coding | Other: Embedded Systems, API & Automation.',
            contact: '> Phone: {phone} | Email: {email} | GitHub: {github} | Address: {address}',
            education: '> {name} graduated with {degree} from UTT (10/2020 — 08/2025). Rank: Good.',
            objective: '> Objective: Build efficient, smart and scalable web systems. Integrate AI to optimize UX and operations in the next 2 years.',
            who: '> I am **Suri** — {name}\'s smart AI assistant — Fullstack Developer & AI Automation Mage (LV. {level}).',
            cv: '> You can download the CV via the "DOWNLOAD CV" button at the top of the page, or contact directly via email: {email}',
            hello: '> Hello! Ask me about {name}\'s experience, skills, education, or contact!',
            unknown: '> I don\'t understand that question. Try asking about: experience, skills, education, contact, or career objective!',
        },
    },
    cv: {
        profile: {
            name: 'Do Thanh Cao',
            title: 'Fullstack Developer',
            class: 'Fullstack Developer',
            address: 'No. 28, An Tho, An Khanh, Hoai Duc, Hanoi',
            objective:
                'As a Fullstack Developer focused on optimization and AI automation, I aim to build efficient, smart and scalable web systems. In the next 2 years, my goal is to enhance AI integration into products to optimize user experience and operational workflows.',
        },
        education: {
            school: 'University of Transport Technology (UTT)',
            degree: 'Bachelor of Information Technology',
            time: '10/2020 — 08/2025',
            achievement:
                'Graduated with: <span class="ml-1 inline-block px-2 py-0.5 bg-success text-background font-pixel text-px-16">GOOD</span>',
        },
        experiences: [
            {
                role: 'Fullstack Developer',
                company: 'ZOTEK 8 Technology and Trading Joint Stock Company',
                time: '10/2023 — Present',
                current: true,
                summary:
                    'Develop and operate enterprise-scale fullstack web systems, optimizing performance, security and user experience for domestic and international clients.',
                projects: [
                    {
                        name: 'Customer Survey System',
                        points: [
                            'Developed a survey platform for HondaCars Sapporo (Japan) to collect and analyze customer feedback.',
                            'Designed system architecture optimized for high traffic and concurrent users.',
                            'Achieved stable performance handling thousands of simultaneous responses.',
                        ],
                        highlights: ['Worked for an international client (Japan)'],
                    },
                    {
                        name: 'Automated Data Collection Tool',
                        points: [
                            'Built an automated system to collect data from Facebook, Instagram, TikTok.',
                            'Integrated API, crawling and scheduled data processing.',
                        ],
                        highlights: ['Fully automated data collection pipeline'],
                    },
                    {
                        name: 'Multi-Platform CMS',
                        points: [
                            'Developed a CMS to publish, manage and analyze content across multiple platforms.',
                            'Integrated user management, permissions and engagement tracking.',
                        ],
                    },
                    {
                        name: 'Enterprise Invoice CMS',
                        points: [
                            'Built a centralized system to manage invoices, customers and financial data.',
                            'Supported authentication, authorization, logging and real-time revenue statistics.',
                        ],
                        highlights: ['Handles sensitive financial data with security'],
                    },
                    {
                        name: 'E-Learning WordPress Platform',
                        points: [
                            'Developed a WordPress + LearnPress system to manage courses, students and payments.',
                            'Optimized UI, performance and learning progress reporting.',
                        ],
                    },
                ],
            },
            {
                role: 'Intern',
                company: 'University of Transport Technology',
                time: '06/2023 — 12/2023',
                summary:
                    'Learned and researched data center operations and basic network system administration configuration.',
            },
        ],
        skillGroups: [
            { label: 'Backend Development', icon: 'server', skills: ['Laravel', 'Express.js', 'Next.js'] },
            {
                label: 'Frontend Development',
                icon: 'layout',
                skills: ['Vue.js', 'React.js', 'Blade Template', 'TailwindCSS', 'Bootstrap'],
            },
            {
                label: 'AI & Automation',
                icon: 'sparkles',
                skills: ['AI assistant & Automation Tools', 'Vibe coding'],
            },
            {
                label: 'Other Technical Skills',
                icon: 'cpu',
                skills: [
                    'Embedded Systems (Arduino, ESP32, sensor communication, IoT integration)',
                    'API & Automation Tools',
                ],
            },
        ],
        highlights: [
            {
                title: 'International experience',
                detail: 'Developed a survey system for HondaCars Sapporo (Japan).',
            },
            {
                title: 'Fullstack & AI',
                detail: 'Master Laravel (backend) + Vue/React (frontend) and integrate AI into products.',
            },
            {
                title: 'Automation',
                detail: 'Built automated tools to collect and process data from social networks.',
            },
            {
                title: 'Solid foundation',
                detail: 'Graduated with a Good degree in IT Engineering from UTT.',
            },
        ],
        navLinks: [
            { label: 'About', href: '#about' },
            { label: 'Education', href: '#education' },
            { label: 'Experience', href: '#experience' },
            { label: 'Skills', href: '#skills' },
            { label: 'Contact', href: '#contact' },
        ],
    },
    projects: {
        aimettingVoiceRecorder: {
            badge: 'AI MEETING RECORDER',
            title: 'Voice Recorder',
            rec: '● REC',
            source: 'Recording source / SOURCE',
            mic: 'Microphone',
            micDesc: 'Record from mic',
            tab: 'Tab / Screen',
            tabDesc: 'Record tab audio',
            ready: 'Ready to record',
            recording: 'RECORDING…',
            start: '▶ Start',
            stop: '■ Stop',
            download: '↓ Download',
            clear: '✕ Clear',
            aiSummaryBtn: '✦ Summarize',
            aiSummaryLoading: 'Summarizing...',
            playback: 'RECORDING / PLAYBACK',
            size: 'Size:',
            aiSummary: 'AI SUMMARY',
            aiSummaryDesc: 'Automatic meeting summary',
            aiSummaryText: 'After recording, AI will summarize the meeting content, extract action items and key points.',
            footer: 'AI MEETING RECORDER · SURISUITE',
            original: 'Original',
            summary: 'Summary',
        },
    },
};