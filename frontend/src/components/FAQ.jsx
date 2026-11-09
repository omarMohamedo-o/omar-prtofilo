import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

export const FAQ_ITEMS = [
  {
    question: "What software engineering projects and technical solutions are showcased in Omar's portfolio?",
    answer: "Omar's portfolio highlights production-grade systems across AI/ML, LLMs, and Cloud Infrastructure:\n\n• **HistoryVerse (Graduation Project, Grade: A+):** Multilingual AI and Augmented Reality museum guide deployed on AWS Fargate. Achieved 90–96% artifact recognition accuracy with YOLOv5 and Vision Transformers, 25+ REST endpoints with ChromaDB RAG, and 204 passing automated tests.\n• **PlayerHub.GG Infrastructure:** Production gaming platform infrastructure engineered with Docker, Kubernetes, HAProxy read routing, MariaDB primary-replica replication, Redis caching, and Prometheus/Grafana/Loki observability.\n• **CliniSoft Healthcare AI:** Clinical documentation and speech AI system utilizing LLMs, NLP, and Faster-Whisper to automate medical transcriptions, served via FastAPI.\n• **SDXL LoRA Fine-Tuning Pipeline:** Architectural image fine-tuning for Sultan Hassan Mosque using Hugging Face Diffusers (rank 32, fp16) and MLflow tracking in Docker Compose.\n• **ChloroMaster Cloud Platform:** Enterprise microservices deployed to AWS Kubernetes with modular Terraform, HashiCorp Vault secrets, and Trivy security scanning."
  },
  {
    question: "What technologies, frameworks, and tools are utilized in the development of Omar's portfolio applications?",
    answer: "Omar's core technical stack spans deep learning, conversational AI, and cloud operations:\n\n• **LLMs & Generative AI:** RAG architectures, Multi-Agent Systems, MCP (Model Context Protocol), LangChain, ChromaDB, FAISS, LoRA fine-tuning, GPTQ quantization, Gemini API, Llama 3 / Ollama.\n• **Machine Learning & NLP:** PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, Diffusers, spaCy, YOLOv5, Faster-Whisper, Google TTS.\n• **MLOps, Cloud & DevOps:** FastAPI, Docker, Kubernetes, Helm, Terraform, Ansible, AWS (Fargate, S3, EC2), Azure, GCP, HashiCorp Vault, Trivy.\n• **Observability & Testing:** Prometheus, Grafana, Loki/Promtail, Langfuse distributed tracing, Ragas evaluation, Pydantic, pytest.\n• **Languages & Databases:** Python, C++, Java, Bash · PostgreSQL, MariaDB, Redis, MongoDB · Linux (RHEL, Ubuntu), Git."
  },
  {
    question: "How can I contact Omar or review his professional background and deployed solutions?",
    answer: "You can connect with Omar Mohamed (Omar Gad) directly through multiple channels:\n\n• **Email:** omarmo.abdelsalam@gmail.com\n• **Phone & WhatsApp:** +20 101 1297 869\n• **LinkedIn:** linkedin.com/in/omar-mohamedo-o\n• **GitHub Repositories:** github.com/omarMohamedo-o\n• **Verified Badges:** credly.com/users/omar-mohamedo-o/badges\n• **Discovery Form:** Submit a direct project or interview inquiry through the 'Book a Discovery Call' section on this portfolio.\n• **Live MORA AI Assistant:** Chat directly using the bot widget in the bottom-right corner for instant answers about his experience and availability."
  },
  {
    question: "Are there any live deployments or interactive demos available for the systems featured in Omar's portfolio?",
    answer: "Yes, multiple live platforms and interactive demos are accessible:\n\n• **PlayerHub.GG:** Live production platform accessible at https://www.playerhub.gg/en with dedicated infrastructure tooling in the GitHub repo.\n• **MORA Portfolio AI Assistant:** Fully functional conversational agent integrated into this website featuring text chat, voice transcription, and portfolio RAG.\n• **Open-Source Repositories:** Live source code and Terraform/Kubernetes manifests available at github.com/omarMohamedo-o for HistoryVerse, PlayerHub Infrastructure, and ChloroMaster."
  },
  {
    question: "How do the architecture and design patterns in Omar's portfolio projects scale for production environments?",
    answer: "Omar's systems are built with production resilience and scalability at their core:\n\n• **High Availability & Load Balancing:** HAProxy intelligent read routing balances database queries across replicas; Redis clusters minimize query latency.\n• **Self-Healing & Chaos Engineering:** Workloads utilize autoheal and smartheal daemons for automatic restarts, with toxiproxy chaos testing verifying fault tolerance.\n• **Zero-Downtime CI/CD:** GitHub Actions pipelines with rolling deployment strategies ensure continuous delivery without user disruption.\n• **Security & Observability:** HashiCorp Vault manages secrets with strict RBAC; Trivy scans containers for vulnerabilities; Prometheus and Grafana provide 24/7 alerting."
  }
];

function FAQ({ isVisible, themeColor = 'cyan' }) {
  const [openIndex, setOpenIndex] = useState(0);
  const isMobile = useIsMobile();

  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
  const activeBorder = themeColor === 'purple' ? 'border-purple-500/60' : 'border-cyan-500/60';

  const toggleFAQ = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  return (
    <motion.section
      id="faq"
      className="py-16 sm:py-20 lg:py-24 ds-section scroll-mt-20"
      initial="hidden"
      whileInView="show"
      viewport={viewportOptions}
    >
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div variants={titleVariant} className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="text-surface">Key Inquiries &</span> <span className="highlight">Direct Answers</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Structured answers regarding technical systems, engineering architecture, and collaboration opportunities.
          </p>
        </motion.div>

        <motion.div variants={containerVariant} className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={getOrbitalItemVariant(index, isMobile)}
                className={`ds-card rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? `${activeBorder} bg-[#0c1024]/90 shadow-lg shadow-cyan-500/10` : 'border-gray-800 bg-[#080b18]/70 hover:border-gray-700'
                } ${borderHover}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-white flex items-start gap-2.5">
                    <span className={`${textColor} font-bold mt-0.5 flex-shrink-0`}>Q{index + 1}.</span>
                    <span>{item.question}</span>
                  </span>
                  <div className={`p-1.5 rounded-lg bg-gray-800/80 text-gray-300 transition-transform duration-300 flex-shrink-0 mt-0.5 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-gray-800/60 text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {item.answer.split('\n\n').map((paragraph, pIdx) => (
                          <div key={pIdx} className="mb-3 last:mb-0">
                            {paragraph.split('\n').map((line, lIdx) => {
                              const trimmed = line.trim();
                              if (trimmed.startsWith('•')) {
                                const parts = trimmed.substring(1).trim().split(/(\*\*.*?\*\*)/g);
                                return (
                                  <div key={lIdx} className="flex items-start gap-2 pl-2 mb-1.5 text-gray-300">
                                    <CheckCircle2 size={14} className={`${textColor} flex-shrink-0 mt-0.5`} />
                                    <div>
                                      {parts.map((part, partIdx) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          return <strong key={partIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                                        }
                                        return part;
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              return <p key={lIdx} className="text-gray-300">{line}</p>;
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(FAQ);
