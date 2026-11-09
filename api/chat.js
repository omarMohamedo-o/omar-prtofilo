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

    const { user_input } = req.body || {};
    const query = (user_input || '').trim();

    if (!query) {
        return res.status(400).json({ Answer: 'Please provide a question.' });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyA6PLtRxa883bHj-x6LfR3L35cpQea1YDs";

    const SYSTEM_PROMPT = `You are MORA, the personal AI assistant for Omar Gad (Omar Mohamed Abdelsalam), an outstanding Computer Engineer specialized in AI, LLMs & RAG, and MLOps & Cloud.
Omar is currently an M.Sc. candidate in Computer Engineering with a perfect 4.0 / 4.0 CGPA at the Arab Academy for Science, Technology and Maritime Transport.
He works as an MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Full-time, Remote), managing autonomous AI agent systems, scraping pipelines, and high-availability multi-cloud infrastructure.
He was previously an AI & ML Engineer at CliniSoft (Alexandria), developing production healthcare AI for clinical documentation, and a Software & DevOps Engineer at ChloroMaster.
His graduation project, HistoryVerse, achieved an A+ grade, featuring 90-96% artifact recognition accuracy with YOLOv5 and Vision Transformers, 25+ REST endpoints with ChromaDB RAG, and deployment to AWS Fargate with modular Terraform.
He holds the Red Hat Certified System Administrator (RHCSA), Huawei Cloud Developer (HCCDA), and completed the Aspire Leaders Program.
Always respond warmly, clearly, accurately, and informatively. Match the user's language (English or Arabic).`;

    if (apiKey) {
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: `${SYSTEM_PROMPT}\n\nUser Question: ${query}` }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
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
