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

    const rawKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyA6PLtRxa883bHj-x6LfR3L35cpQea1YDs";
    const apiKey = rawKey ? rawKey.replace(/["'\s]/g, '').trim() : '';

    const SYSTEM_PROMPT = `You are MORA, the warm, intelligent, and authentic AI teammate and representative for Omar Mohamed (Omar Mohamed Abdelsalam).

Persona & Behavior:
- You speak like a real human engineer and friendly colleague—approachable, genuine, articulate, and thoughtful.
- Never sound robotic, pre-scripted, or like a corporate marketing brochure.
- STRICT RULE: Answer ONLY the specific question asked. Do NOT dump Omar's full biography, resume, or unrelated project details unless explicitly requested.
- If asked a brief question, give a concise, direct, helpful answer.
- If asked an everyday question (greetings, time, how you are doing), respond naturally and conversationally.
- Match the user's language and tone seamlessly: If they speak Egyptian Arabic (عامية مصرية), reply in natural, friendly Egyptian Arabic. If Modern Standard Arabic, reply in MSA. If English, reply in natural conversational English.
- If asked about an unrelated topic (sports, cooking, crypto, movies), respond with warmth and a brief human touch, then gently bring the focus back to Omar's engineering work and availability.

Verified Facts about Omar Mohamed:
- Current Role: MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Full-time, Remote, Sep 2026 - Present). Manages autonomous AI agent systems, high-throughput scraping pipelines, HAProxy read routing, MariaDB replication (primary-replica), self-healing daemons (autoheal, smartheal), and centralized observability (Prometheus, Grafana, Loki/Promtail).
- Previous Role: AI & ML Engineer at CliniSoft (Alexandria, Apr 2026 - Aug 2026). Developed healthcare AI using LLMs, NLP, and Faster-Whisper clinical speech transcription served via FastAPI microservices.
- Previous Role: Software & DevOps Engineer at ChloroMaster (Alexandria/Remote, Jun 2025 - Apr 2026). Built full cloud platform on AWS with Kubernetes, Terraform, HashiCorp Vault secrets, Trivy security, and GitHub Actions CI/CD.
- Teaching: Instructor at EYouth (Apr 2026 - Sep 2026) and Black Horse Courses (Jan 2025 - Dec 2025, trained 50+ students in Python & ML with 95% satisfaction).
- Volunteer: Palestine Polytechnic University (advised student team on AI retinal OCT diagnosis).
- Academics: Master of Science (M.Sc.) candidate in Computer Engineering with CGPA 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport (AASTMT, Feb 2026 - Present). B.Sc. in Computer Engineering from BHI (CGPA: 3.2 / 4.0, Very Good B+, Sep 2019 - Jul 2024). ITI Software Engineering Diploma (Aug 2025).
- Flagship Project: HistoryVerse (Grade: A+) — Multilingual AI/AR Museum Guide with 90-96% artifact recognition accuracy using YOLOv5 & Vision Transformers, 25+ REST endpoints with ChromaDB RAG, multi-agent LLM routing, and AWS Fargate deployment with 204 automated tests.
- Generative AI Project: SDXL LoRA Fine-Tuning for Sultan Hassan Mosque architecture using Hugging Face Diffusers (rank 32, fp16) and MLflow experiment tracking.
- Credentials: Aspire Leaders Program (Harvard-founded Aspire Institute, Sep 2026), Red Hat Certified System Administrator (RHCSA #250-068-707), Huawei Cloud Developer (HCCDA), IBM Docker Essentials, AWS Academy Cloud Foundations.
- Contact: Email: omarmo.abdelsalam@gmail.com | Phone/WhatsApp: +20 101 1297 869 | Location: Alexandria, Egypt (Open for full-time, remote, hybrid, and consultancy roles worldwide).`;

    if (apiKey) {
        const candidateModels = [
            process.env.GEMINI_MODEL,
            'gemini-2.0-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest'
        ].filter(Boolean);

        const contents = [
            {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease acknowledge your role as MORA and follow the strict rule: answer ONLY what the user asks, naturally and conversationally.` }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood! I'm MORA. I will answer only the specific question asked in a warm, direct, human conversational tone." }]
            }
        ];

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

        for (const modelName of candidateModels) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
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
            } catch (modelErr) {
                console.warn(`Model ${modelName} call failed, trying next...`, modelErr?.message);
            }
        }
    }

    // Dynamic, human conversational response engine (No hardcoded bio dumps!)
    const humanAnswer = generateNaturalAnswer(query);
    return res.status(200).json({ Answer: humanAnswer });
}

function generateNaturalAnswer(query = '') {
    const isArabic = /[\u0600-\u06FF]/.test(query);
    const normalized = query.toLowerCase()
        .replace(/[\u0617-\u061A\u064B-\u0652\u0670\u0640]/g, '')
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .trim();

    // 1. Natural greetings
    if (/^(hi|hello|hey|yo|howdy|sup|good\s*morning|good\s*evening|greetings|ازيك|مرحبا|سلام|اهلا|صباح الخير|مساء الخير|هاي|هلو)[\s!.]*$/i.test(normalized)) {
        if (isArabic) {
            return "أهلاً بك! أنا مورا (MORA)، المساعد الذكي للمهندس عمر محمد. يسعدني جداً التحدث معك، كيف يمكنني مساعدتك اليوم؟";
        }
        return "Hey there! I'm MORA, Omar Mohamed's AI assistant. Great to chat with you! How can I help you today?";
    }

    // 2. Real-time time & date
    if (/(time|date|clock|current\s*time|what\s*time|ساع[ةه]|الوقت|تاريخ|نهار[ده])/i.test(normalized)) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' });
        const dateStr = now.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Cairo' });
        if (isArabic) {
            return `الساعة الآن **${timeStr}** بتوقيت مصر (${dateStr}). هل هناك أي شيء أستطيع مساعدتك به؟`;
        }
        return `Right now it's **${timeStr}** (Egypt Time / UTC+2) on **${dateStr}**. What's on your mind?`;
    }

    // 3. How are you / check-in
    if (/(how\s*are\s*you|how\s*is\s*it\s*going|how\s*do\s*you\s*do|whats\s*up|عامل ايه|اخبارك|ازيك ايه الاخبار|كيف حالك)/i.test(normalized)) {
        if (isArabic) {
            return "أنا ممتاز وبأفضل حال، شكراً لسؤالك! جاهز لمساعدتك في أي استفسار يخص عمل ومشاريع المهندس عمر. حابب تسأل عن إيه؟";
        }
        return "I'm doing great, thank you for asking! Ready to help you with anything regarding Omar's engineering work, projects, or background. What would you like to explore?";
    }

    // 4. Identity
    if (/(who\s*are\s*you|what\s*is\s*your\s*name|tell\s*me\s*about\s*yourself|انت مين|اسمك ايه|عرف نفسك|مين انت)/i.test(normalized)) {
        if (isArabic) {
            return "أنا **مورا (MORA)**، المساعد التقني الذكي للمهندس **عمر محمد** (Omar Mohamed). أنا هنا للإجابة عن أسئلتك حول مشاريعه، تقنياته، وخبراته في الذكاء الاصطناعي وهندسة البنية التحتية، أو لمساعدتك في التواصل معه مباشرة!";
        }
        return "I'm **MORA**, the AI representative and technical assistant for **Omar Mohamed**. Think of me as his digital co-pilot here to answer questions about his AI & MLOps engineering work, past projects, or help you connect with him directly!";
    }

    // 5. Capabilities / What can you do
    if (/(what\s*can\s*you\s*do|help\s*me|capabilities|تقدر تعمل ايه|بتعمل ايه|مساعده)/i.test(normalized)) {
        if (isArabic) {
            return "أستطيع مساعدتك في:\n• الإجابة عن مشاريع عمر وخبراته العملية في PlayerHub.GG و CliniSoft.\n• شرح تفاصيل مشروع تخرجه HistoryVerse (+A) وتدريب SDXL LoRA.\n• استعراض مهاراته في MLOps، Docker، Kubernetes، و LLMs.\n• تزويدك ببيانات التواصل المباشر أو التوظيف.";
        }
        return "Here is what I can help you with:\n• Discuss Omar's production engineering work at **PlayerHub.GG** and **CliniSoft**.\n• Deep dive into flagship projects like **HistoryVerse (A+)** and **SDXL LoRA fine-tuning**.\n• Share details on his tech stack: Docker, Kubernetes, Terraform, PyTorch, and LLMs/RAG.\n• Provide direct contact and hiring details.";
    }

    // 6. Thanks
    if (/(thank\s*you|thanks|thx|شكرا|تسلم|جزاك الله خيرا|الف شكر)/i.test(normalized)) {
        if (isArabic) {
            return "العفو، على الرحب والسعة دائماً! لو عندك أي سؤال تاني أنا في الخدمة 🚀";
        }
        return "You're very welcome! Feel free to ask if there is anything else you'd like to know 🚀";
    }

    // 7. Goodbyes
    if (/(bye|goodbye|see\s*you|مع السلامة|باي|اشوفك بعدين)/i.test(normalized)) {
        if (isArabic) {
            return "مع السلامة! سعدت بالحديث معك، وأتمنى لك يوماً رائعاً. يمكنك دائماً العودة أو مراسلة عمر مباشرة!";
        }
        return "Goodbye! It was a pleasure chatting. Feel free to come back anytime or reach out to Omar directly!";
    }

    // 8. Off-topic queries (football, cooking, weather, crypto, etc.)
    if (/(football|soccer|كورة|ماتش|طبخة|recipe|cooking|weather|طقس|crypto|bitcoin|btc)/i.test(normalized)) {
        if (isArabic) {
            return "يبدو موضوعاً ممتعاً، لكن تخصصي الأساسي هو مساعدة زوار موقع المهندس عمر محمد والإجابة عن مشاريعه في الذكاء الاصطناعي، وخبراته في MLOps و Cloud، وفرص التعاون والتوظيف. حابب تسأل عن أي من هذه المجالات؟";
        }
        return "That sounds interesting, but my main focus is helping people learn about Omar Mohamed's engineering background—his AI projects, MLOps/cloud infrastructure, and availability for new opportunities. Is there anything about his work you'd like to check out?";
    }

    // 9. Current Role & Job (PlayerHub.GG)
    if (/playerhub|بلاير|دبي|dubai|scraping|ha\s*proxy|mariadb|شغال\s*فين|بيشتغل\s*فين|وظيفته|شغله|current\s*role|where\s*does\s*he\s*work/i.test(normalized)) {
        if (isArabic) {
            return "يعمل عمر حالياً كـ **MLOps & AI Infrastructure Engineer** في شركة **PlayerHub.GG** (دبي، الإمارات · عن بُعد منذ سبتمبر 2026)، حيث يدير أنظمة وكلاء الذكاء الاصطناعي (AI agents)، وخطوط سحب البيانات، والبنية التحتية التلقائية التعافي (autoheal/smartheal) ومراقبة الأنظمة بـ Prometheus و Grafana.";
        }
        return "Omar currently works as an **MLOps & AI Infrastructure Engineer** at **PlayerHub.GG** (Dubai, Remote · Sep 2026 – Present). He manages autonomous AI agent deployments, high-throughput scraping pipelines, HAProxy read routing, MariaDB replication, self-healing daemons, and Prometheus/Grafana observability.";
    }

    // 10. CliniSoft
    if (/clinisoft|كلينيسوفت|طبي|health|clinical|faster-whisper/i.test(normalized)) {
        if (isArabic) {
            return "في **CliniSoft**، عمل عمر كـ **AI & ML Engineer** حيث بنى أنظمة ذكاء اصطناعي للرعاية الصحية مستخدماً LLMs و NLP ونماذج Faster-Whisper لأتمتة التوثيق السريري وتفريغ الاستشارات الطبية عبر خدمات مصغرة بـ FastAPI.";
        }
        return "At **CliniSoft**, Omar worked as an **AI & ML Engineer**, building production healthcare AI using LLMs, NLP, and Faster-Whisper speech models to automate clinical documentation through high-throughput FastAPI services.";
    }

    // 11. HistoryVerse / Graduation Project
    if (/historyverse|تخرج|graduation|museum|متحف|yolo|arcore|fargate|chromadb/i.test(normalized)) {
        if (isArabic) {
            return "مشروع تخرج عمر هو **HistoryVerse** (وحصل على امتياز مرتفع **+A**). وهو مرشد متاحف تفاعلي بالذكاء الاصطناعي والواقع المعزز، يتعرف على الآثار بدقة 90-96% بـ YOLOv5 و Transformers، ويحتوي على منصة RAG عبر ChromaDB ونشر كامل على AWS Fargate مع 204 اختبارات مؤتمتة ناجحة.";
        }
        return "Omar's graduation project is **HistoryVerse** (graded **A+**)—an interactive multilingual AI/AR museum guide featuring 90–96% artifact recognition accuracy with YOLOv5 & Vision Transformers, ChromaDB RAG, and automated deployment on AWS Fargate with 204 passing tests.";
    }

    // 12. SDXL LoRA Fine-Tuning
    if (/sdxl|lora|diffusers|sultan|مسجد|سلطان حسن|diffusion/i.test(normalized)) {
        if (isArabic) {
            return "قام عمر بتدريب وتخصيص نموذج **Stable Diffusion XL (SDXL) LoRA** على العمارة التاريخية لمسجد السلطان حسن بالقاهرة، باستخدام Hugging Face Diffusers (rank 32, fp16) وتتبع التجارب بالكامل عبر **MLflow** داخل بيئة Docker قابلة للتكرار.";
        }
        return "Omar engineered an **SDXL LoRA fine-tuning pipeline** for Sultan Hassan Mosque's architectural heritage using Hugging Face Diffusers (rank 32, fp16 precision), tracking loss convergence and hyperparameters with **MLflow** in Docker.";
    }

    // 13. Docker & Kubernetes / Container stack
    if (/docker|kubernetes|k8s|container|دوكر|كوبيرنيتيس/i.test(normalized)) {
        if (isArabic) {
            return "يملك عمر خبرة قوية في الحاويات والأوركسترا: يستخدم Docker و Kubernetes يومياً في إدارة أنظمة AI وكلاء PlayerHub.GG، وبنى بنية تحتية سحابية كاملة بـ K8s في ChloroMaster، وهو حاصل على شهادة **IBM Docker Essentials** و **RHCSA** في إدارة نظم لينكس.";
        }
        return "Omar has hands-on production experience with **Docker & Kubernetes**: managing containerized AI agents and scraping pipelines at PlayerHub.GG, architecting AWS EKS/K8s environments at ChloroMaster, and holds the **IBM Docker Essentials** and **RHCSA** credentials.";
    }

    // 14. Contact / Hire / Availability
    if (/contact|email|phone|whatsapp|hire|reach|ايميل|تواصل|تليفون|رقم|واتس|توظيف|متاح/i.test(normalized)) {
        if (isArabic) {
            return "يمكنك التواصل مباشرة مع المهندس عمر:\n• **البريد:** omarmo.abdelsalam@gmail.com\n• **واتساب / هاتف:** +20 101 1297 869\n• **لينكد إن:** linkedin.com/in/omar-mohamedo-o\nوهو متاح للفرص بدوام كامل والتعاقدات والاستشارات في MLOps و AI.";
        }
        return "You can reach Omar directly at:\n• **Email:** omarmo.abdelsalam@gmail.com\n• **Phone / WhatsApp:** +20 101 1297 869\n• **LinkedIn:** linkedin.com/in/omar-mohamedo-o\nHe is currently open to full-time engineering roles, contract MLOps architecture, and AI consulting worldwide.";
    }

    // 15. Education & GPA
    if (/cert|rhcsa|redhat|aspire|degree|education|msc|master|gpa|جامع|شهادات|تعليم/i.test(normalized)) {
        if (isArabic) {
            return "المؤهلات الأكاديمية والشهادات لعمر:\n• باحث ماجستير هندسة الحاسب بالأكاديمية العربية (AASTMT) بمعدل ممتاز **4.0 / 4.0**.\n• خريج برنامج **Aspire Leaders** (برعاية خريجي جامعة هارفارد).\n• مهندس نظم معتمد من ريد هات (**RHCSA #250-068-707**).\n• مطور سحابي معتمد من هواوي (**HCCDA**) ومعهد ITI.";
        }
        return "Omar's academic credentials and certifications:\n• **M.Sc. in Computer Engineering** at AASTMT with a perfect **4.0 / 4.0 CGPA**.\n• **Aspire Leaders Program** (Harvard-founded Aspire Institute, Sep 2026).\n• **Red Hat Certified System Administrator (RHCSA #250-068-707)**.\n• **Huawei Cloud Developer (HCCDA)** and ITI Software Engineering Diploma.";
    }

    // 16. Location / Where is Omar
    if (/where|location|based|egypt|alexandria|فين|مكان|عايش|مقيم/i.test(normalized)) {
        if (isArabic) {
            return "المهندس عمر مقيم في **الإسكندرية، مصر**، ويعمل عن بُعد مع فرق عمل عالمية (حالياً مع PlayerHub.GG في دبي)، وهو متاح للعمل عن بُعد ولفرص الانتقال الدولية.";
        }
        return "Omar is based in **Alexandria, Egypt**, working remotely with international teams (currently with PlayerHub.GG in Dubai), and is open to remote roles as well as global relocation.";
    }

    // 17. Who is Omar / General Overview (Concise, human, not a massive wall of text)
    if (/who\s*is\s*omar|tell\s*me\s*about\s*omar|مين\s+(هو\s+)?عمر|من\s+(هو\s+)?عمر|نبذة\s*عن\s*عمر/i.test(normalized)) {
        if (isArabic) {
            return "عمر محمد هو مهندس حاسب وباحث ماجستير (معدل 4.0) متخصص في **الذكاء الاصطناعي (LLMs & RAG)** وهندسة **MLOps والبنية السحابية**. يعمل حالياً كمهندس MLOps في شركة **PlayerHub.GG** (دبي، عن بُعد)، ولديه مشروعات متميزة مثل **HistoryVerse** (+A) و **SDXL LoRA**.";
        }
        return "Omar Mohamed is a Computer Engineer and M.Sc. candidate (CGPA 4.0) specializing in **AI/LLMs, RAG, and MLOps/Cloud Infrastructure**. He currently works as an MLOps & AI Infrastructure Engineer at **PlayerHub.GG** (Dubai, Remote) and has built production systems across healthcare, gaming, and cloud automation.";
    }

    // 18. Conversational Fallback - Friendly, human, answers naturally without dumping static bio!
    if (isArabic) {
        return "يسعدني جداً التحدث معك! بصفتي المساعد الذكي لعمر، أقدر أجاوبك بالتفصيل عن أي جانب في مسيرته الهندسية—سواء مشاريعه (مثل HistoryVerse و SDXL LoRA)، خبراته في PlayerHub.GG و CliniSoft، مهاراته في MLOps و Docker و LLMs، أو كيفية التواصل معه وتوظيفه. تحب تسأل عن إيه بالتحديد؟";
    }

    return "I'd be glad to help with that! As Omar's AI teammate, I can answer anything specific about his engineering work—such as his systems at PlayerHub.GG, his healthcare AI at CliniSoft, projects like HistoryVerse (A+), his MLOps/LLM stack, or how to get in touch. What specific area would you like to explore?";
}
