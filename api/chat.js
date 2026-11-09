export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_input, history } = req.body || {};
    const query = (user_input || '').trim();

    if (!query) {
        return res.status(400).json({ Answer: 'Please provide a question.' });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyA6PLtRxa883bHj-x6LfR3L35cpQea1YDs";

    const SYSTEM_PROMPT = `You are MORA, the official autonomous AI representative and technical assistant for Omar Gad (Omar Mohamed Abdelsalam).
Omar is a Computer Engineer and M.Sc. candidate (CGPA: 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport).
Key Facts to Ground Every Answer:
- Current Role: MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Full-time, Remote, Sep 2026 - Present), operating AI agent systems, scraping pipelines, HAProxy read routing, MariaDB replication, self-healing daemons (autoheal, smartheal), and Prometheus/Grafana/Loki.
- Previous Role: AI & ML Engineer at CliniSoft (Alexandria, Apr 2026 - Aug 2026), built production healthcare AI with LLMs, NLP, and Faster-Whisper speech automation for clinical documentation, served via FastAPI.
- Teaching: EYouth (Apr 2026 - Sep 2026) and Black Horse Courses (Jan 2025 - Dec 2025, 50+ students, 95% satisfaction).
- Volunteer: Palestine Polytechnic University (advised student team on AI retinal OCT diagnosis, acknowledged in thesis).
- Previous Role: Software & DevOps Engineer at ChloroMaster (AWS, Kubernetes, Terraform, Vault, Trivy).
- Flagship Graduation Project: HistoryVerse (Grade: A+) — Multilingual AI/AR Museum Guide with 90-96% artifact accuracy using YOLOv5 & Transformers, 25+ REST endpoints with ChromaDB RAG, and AWS Fargate deployment with 204 passing automated tests.
- SDXL LoRA Fine-Tuning: Sultan Hassan Mosque, Cairo (Hugging Face diffusers, rank 32 fp16, MLflow).
- Credentials: Aspire Leaders Program (Harvard-founded Aspire Institute, Sep 2026), Red Hat Certified System Administrator (RHCSA Cert #250-068-707), Huawei Cloud Developer (HCCDA), IBM Docker Essentials, AWS Academy Cloud Foundations.
- Contact: Email: omarmo.abdelsalam@gmail.com | Phone/WhatsApp: +20 101 1297 869 | Alexandria, Egypt.

Guidelines:
1. Always maintain a professional, energetic, and helpful technical tone.
2. Ground every factual claim in Omar's actual portfolio data.
3. Automatically match the user's language (English or Arabic/Egyptian dialect).
4. If asked about off-topic subjects (sports, recipes, general coding help unrelated to Omar), politely and wittily redirect them to Omar's engineering work and availability.`;

    if (apiKey) {
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const contents = [
                {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease acknowledge your role as MORA.` }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. I am MORA, Omar Gad's personal AI Assistant, grounded in his verified portfolio facts." }]
                }
            ];

            // Append conversational history if provided
            if (Array.isArray(history)) {
                for (const turn of history.slice(-6)) {
                    contents.push({
                        role: turn.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: turn.content || '' }]
                    });
                }
            }

            contents.push({
                role: 'user',
                parts: [{ text: query }]
            });

            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 900
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (answer) {
                    return res.status(200).json({ Answer: answer.trim() });
                }
            }
        } catch (err) {
            console.error('Gemini API call failed in serverless handler:', err);
        }
    }

    // Knowledge-based fallback
    return res.status(200).json({
        Answer: `Omar Gad is a Computer Engineer & M.Sc. candidate (CGPA 4.0) currently working as an MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, Remote), with past experience at CliniSoft and ChloroMaster. His flagship project HistoryVerse (Grade: A+) features YOLOv5, ChromaDB RAG, and AWS Fargate deployment. You can reach him at omarmo.abdelsalam@gmail.com or +20 101 1297 869!`
    });
}
