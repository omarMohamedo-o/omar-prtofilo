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

    // Intelligent knowledge-based fallback engine (Arabic & English supported)
    const isArabic = /[\u0600-\u06FF]/.test(query);
    const normalized = query.toLowerCase()
        .replace(/[\u0617-\u061A\u064B-\u0652\u0670\u0640]/g, '')
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');

    // Out-of-domain guardrail
    if (/(football|soccer|كورة|ماتش|طبخة|recipe|cooking|weather|طقس|crypto|bitcoin)/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "أنا **MORA**، المساعد الذكي الخاص بالمهندس **عمر جاد**. أنا هنا للإجابة عن مشاريعه (مثل **HistoryVerse** و **SDXL LoRA**)، خبراته في **PlayerHub.GG** و **CliniSoft**، مهاراته في MLOps و Cloud، وفرص العمل والتعاون. يسعدني الإجابة عن أي سؤال في هذه المجالات! 🚀"
            });
        }
        return res.status(200).json({
            Answer: "I am **MORA**, Omar Gad's personal AI representative. I specialize in answering questions about Omar's engineering career, AI projects (like **HistoryVerse** and **SDXL LoRA**), cloud/MLOps infrastructure, and job opportunities. How can I help you regarding Omar's work?"
        });
    }

    // PlayerHub.GG
    if (/playerhub|بلاير|دبي|dubai|scraping|ha\s*proxy|mariadb/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**PlayerHub.GG [دبي، الإمارات · عن بُعد · سبتمبر 2026 – الآن]:**\nيعمل عمر كـ **MLOps & AI Infrastructure Engineer**، حيث يتولى:\n• إدارة ونشر أنظمة وكلاء الذكاء الاصطناعي (AI agents) وخطوط سحب البيانات (scraping pipelines) عبر بيئات الإنتاج والتطوير.\n• تصميم بنية تحتية عالية التوافر (HA) باستخدام HAProxy و MariaDB replication و Docker و Kubernetes.\n• تنفيذ آليات التعافي التلقائي (self-healing workloads مثل autoheal و smartheal).\n• بناء خطوط CI/CD مؤتمتة بـ GitHub Actions ومراقبة متكاملة بـ Prometheus و Grafana و Loki."
            });
        }
        return res.status(200).json({
            Answer: "**PlayerHub.GG [Dubai, UAE · Remote · Sep 2026 – Present]:**\nOmar works as an **MLOps & AI Infrastructure Engineer**:\n• Owns deployment and operations for AI agent systems, scraping pipelines, and production/dev/test environments (Docker, Kubernetes, hybrid cloud).\n• Engineered high-availability architecture with HAProxy read routing, MariaDB replication, and self-healing workloads (autoheal, smartheal).\n• Built end-to-end GitHub Actions CI/CD pipelines and centralized logging and monitoring with Prometheus, Grafana, and Loki."
        });
    }

    // CliniSoft
    if (/clinisoft|كلينيسوفت|طبي|health|clinical|faster-whisper/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**CliniSoft [الإسكندرية، مصر · دوام كامل · أبريل 2026 – أغسطس 2026]:**\nعمل عمر كـ **AI & ML Engineer**:\n• طوّر أنظمة ذكاء اصطناعي للرعاية الصحية مستخدماً LLMs و NLP و Faster-Whisper لأتمتة التوثيق السريري وتفريغ الاستشارات الطبية صوتياً.\n• صمم واجهات برمجية عالية الأداء بـ FastAPI ونشرها وفق أفضل ممارسات MLOps السحابية."
            });
        }
        return res.status(200).json({
            Answer: "**CliniSoft [Alexandria, Egypt · Apr 2026 – Aug 2026]:**\nOmar served as an **AI & ML Engineer**:\n• Developed production healthcare AI utilizing LLMs, NLP, and Faster-Whisper speech models to automate clinical documentation and medical consultations.\n• Served microservices via FastAPI and deployed them using cloud MLOps best practices."
        });
    }

    // HistoryVerse
    if (/historyverse|تخرج|graduation|museum|متحف|yolo|arcore|fargate|chromadb/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**مشروع التخرج: HistoryVerse [الدرجة: +A · موثق]:**\nمرشد متاحف تفاعلي بالذكاء الاصطناعي والواقع المعزز (AI/AR):\n• **الرؤية الحاسوبية:** دقة 90–96% في التعرف على الآثار بـ YOLOv5 و Vision Transformers.\n• **منصة وكلاء متعددين و RAG:** أكثر من 25 REST endpoint عبر ChromaDB وتوجيه ذكي بين النماذج (Gemini, OpenAI, Llama, Ollama).\n• **صوت وواقع معزز:** تفاعل صوتي فوري (Faster-Whisper, Google TTS) ونماذج ثلاثية الأبعاد بـ ARCore.\n• **الموثوقية السحابية:** مخرجات محققة بـ Pydantic، وتتبع Langfuse، وتقييم Ragas مع 204 اختبارات مؤتمتة ناجحة ونشر على **AWS Fargate** بـ Terraform."
            });
        }
        return res.status(200).json({
            Answer: "**HistoryVerse — Multilingual AI/AR Museum Guide [Graduation Project, Grade: A+]:**\n• **Computer Vision:** 90–96% artifact recognition accuracy using YOLOv5 and Transformers.\n• **Multi-Agent RAG Platform:** 25+ REST endpoints, RAG over ChromaDB, and model-agnostic LLM routing (Gemini, OpenAI, Llama, Ollama).\n• **Voice & AR:** Multilingual voice conversation (Faster-Whisper, Google TTS) and interactive 3D reconstructions with ARCore and Jetpack Compose.\n• **Enterprise Reliability:** Pydantic validation, Langfuse distributed tracing, Ragas evaluation, 204 passing automated tests, deployed to **AWS Fargate** with modular Terraform."
        });
    }

    // SDXL LoRA
    if (/sdxl|lora|diffusers|sultan|مسجد|سلطان حسن|diffusion/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**SDXL LoRA Fine-Tuning Pipeline – مسجد السلطان حسن بالقاهرة:**\n• تنظيم وتسمية مجموعة بيانات صور معمارية دقيقة.\n• تدريب Stable Diffusion XL LoRA عبر Hugging Face Diffusers (rank 32, fp16).\n• تتبع كامل لمنحنيات الخسارة وتجارب التعلم بـ **MLflow** داخل بيئة Docker Compose قابلة للتكرار بالكامل."
            });
        }
        return res.status(200).json({
            Answer: "**SDXL LoRA Fine-Tuning Pipeline – Sultan Hassan Mosque, Cairo:**\n• Dataset curation, captioning, and Stable Diffusion XL LoRA training using Hugging Face Diffusers (rank 32, fp16 precision).\n• Tracked hyperparameter optimization and loss convergence with **MLflow** in a fully reproducible Docker Compose pipeline."
        });
    }

    // Contact / Hire
    if (/contact|email|phone|whatsapp|hire|reach|ايميل|تواصل|تليفون|رقم|واتس|توظيف/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**معلومات التواصل مع عمر جاد:**\n• **البريد الإلكتروني:** omarmo.abdelsalam@gmail.com\n• **الهاتف / واتساب:** +20 101 1297 869\n• **لينكد إن:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)\n• **جيت هاب:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)\n• **الموقع:** الإسكندرية، مصر (متاح للعمل عن بُعد ولعقود واستشارات AI/MLOps)."
            });
        }
        return res.status(200).json({
            Answer: "**Contact Omar Gad:**\n• **Email:** omarmo.abdelsalam@gmail.com\n• **Phone / WhatsApp:** +20 101 1297 869\n• **LinkedIn:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)\n• **GitHub:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)\n• **Location:** Alexandria, Egypt (Open to remote roles, full-time opportunities, and AI/MLOps consulting)."
        });
    }

    // Certifications & Education
    if (/cert|rhcsa|redhat|aspire|degree|education|msc|master|gpa|جامع|شهادات|تعليم/i.test(normalized)) {
        if (isArabic) {
            return res.status(200).json({
                Answer: "**التعليم والشهادات الاحترافية:**\n• **ماجستير هندسة الحاسب:** الأكاديمية العربية للعلوم والتكنولوجيا (CGPA: 4.0 / 4.0 · فبراير 2026 – الآن).\n• **برنامج Aspire Leaders:** برعاية خريجي جامعة هارفارد (سبتمبر 2026).\n• **RHCSA:** مهندس نظم معتمد من ريد هات (Red Hat Certified System Administrator #250-068-707).\n• **دبلومة هندسة البرمجيات:** معهد تكنولوجيا المعلومات (ITI · أغسطس 2025).\n• **بكالوريوس هندسة الحاسب:** معهد الإسكندرية العالي للهندسة والتكنولوجيا (جيد جداً مع مرتبة الشرف، 3.2 / 4.0)."
            });
        }
        return res.status(200).json({
            Answer: "**Education & Professional Certifications:**\n• **M.Sc. in Computer Engineering:** Arab Academy for Science, Technology and Maritime Transport (CGPA: 4.0 / 4.0 · Feb 2026 – Present).\n• **Aspire Leaders Program:** Harvard-founded Aspire Institute (Sep 2026).\n• **RHCSA:** Red Hat Certified System Administrator (Cert #250-068-707).\n• **Software Engineering Diploma:** Information Technology Institute (ITI · Intensive Code Camp, Aug 2025).\n• **B.Eng. in Computer Engineering:** Higher Institute of Engineering & Technology (BHI · CGPA: 3.2 / 4.0, Very Good B+)."
        });
    }

    // General Summary Fallback
    if (isArabic) {
        return res.status(200).json({
            Answer: "عمر جاد مهندس حاسب وباحث ماجستير (معدل 4.0) متخصص في **الذكاء الاصطناعي (LLMs & RAG)** وهندسة **MLOps والبنية السحابية**. يعمل حالياً في **PlayerHub.GG** (دبي)، وسبق له العمل في **CliniSoft** و **ChloroMaster**. من أبرز مشاريعه **HistoryVerse** (+A) و **SDXL LoRA**. للتواصل: omarmo.abdelsalam@gmail.com أو +20 101 1297 869."
        });
    }

    return res.status(200).json({
        Answer: "Omar Gad is a Computer Engineer & M.Sc. candidate (CGPA 4.0) specializing in **AI & Machine Learning (LLMs, RAG, NLP)** and **MLOps & Cloud Infrastructure**. Currently an MLOps Engineer at **PlayerHub.GG** (Dubai, Remote), previously at **CliniSoft** and **ChloroMaster**. Flagship projects: **HistoryVerse** (A+) and **SDXL LoRA**. Contact him at omarmo.abdelsalam@gmail.com or +20 101 1297 869!"
    });
}
