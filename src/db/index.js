// ================================================================
// FOUNDERMATCH — CENTRALIZED DATABASE
// All state lives here as plain JS. Replace each method with
// real fetch() calls to connect to a backend.
// ================================================================

// ── SEED DATA ─────────────────────────────────────────────────

let _users = [
  {
    id:'u1', initials:'SK', avClass:'av-blue',
    name:'Siva Krishnan', email:'siva@fm.in', password:'siva123',
    role:'Product Builder', city:'Chennai',
    bio:'Building next-gen B2B SaaS for Indian SMBs. Ex-Flipkart PM. Passionate about vernacular tech and Bharat-first products.',
    skills:['Product Management','B2B SaaS','Strategy','Fundraising'],
    lookingFor:['Tech CTO','Growth Marketer','AI Engineer'],
    stage:'MVP', accentColor:'#5b7fff', theme:'blue',
    loginHistory:['2026-03-01','2026-03-03','2026-03-05','2026-03-07','2026-03-10','2026-03-12','2026-03-14','2026-03-15','2026-03-17','2026-03-19','2026-03-20','2026-03-21','2026-03-22','2026-03-23'],
    profileViews:[40,55,45,80,60,50,90,65,55,72,100,78,60,55,45,88,70,62,58,95,80,68,74,85,70,66,72,92,78,75],
  },
  {
    id:'u2', initials:'PK', avClass:'av-purple',
    name:'Priya Krishnamurthy', email:'priya@fm.in', password:'priya123',
    role:'Full-Stack Engineer', city:'Bengaluru',
    bio:'Full-stack engineer with 5 years in SaaS. 2 startup exits. Building for Bharat with a focus on rural health and education.',
    skills:['React','Node.js','MongoDB','AWS','System Design'],
    lookingFor:['Product Manager','Sales Lead','Domain Expert'],
    stage:'Ideation', accentColor:'#a78bfa', theme:'purple',
    loginHistory:['2026-03-02','2026-03-04','2026-03-06','2026-03-08','2026-03-11','2026-03-13','2026-03-15','2026-03-16','2026-03-18','2026-03-20','2026-03-21','2026-03-22','2026-03-23'],
    profileViews:[30,45,55,48,62,70,58,75,68,80,72,88,76,82,90,85,78,92,88,95,82,90,98,88,95,100,92,96,100,94],
  },
  {
    id:'u3', initials:'VK', avClass:'av-green',
    name:'Vikram Kapoor', email:'vikram@fm.in', password:'vikram123',
    role:'Backend Engineer & Entrepreneur', city:'Hyderabad',
    bio:'3x founder. Backend infra specialist. Raised ₹2Cr seed. Building India\'s first neo-bank for gig workers. Ex-Ola, IIT Bombay.',
    skills:['Python','AWS','Microservices','FinTech','Product Strategy'],
    lookingFor:['UX Designer','Digital Marketer','CFO','Legal Expert'],
    stage:'Seed', accentColor:'#34d399', theme:'green',
    loginHistory:['2026-03-01','2026-03-02','2026-03-05','2026-03-09','2026-03-10','2026-03-12','2026-03-14','2026-03-16','2026-03-18','2026-03-19','2026-03-21','2026-03-22','2026-03-23'],
    profileViews:[55,70,65,80,75,90,82,95,88,100,92,88,96,100,90,95,88,100,92,98,95,100,88,96,100,94,98,100,96,100],
  },
  {
    id:'u4', initials:'RJ', avClass:'av-amber',
    name:'Ravi Jain', email:'ravi@fm.in', password:'ravi123',
    role:'AI Researcher', city:'Delhi',
    bio:'PhD in AI from IIT Delhi. 10+ papers on NLP. Building AI for Indian languages and education.',
    skills:['Machine Learning','NLP','Python','TensorFlow','Research'],
    lookingFor:['Product Manager','Frontend Engineer','Business Developer'],
    stage:'Ideation', accentColor:'#f59e0b', theme:'amber',
    loginHistory:['2026-03-03','2026-03-05','2026-03-07','2026-03-09','2026-03-11','2026-03-13','2026-03-15','2026-03-17','2026-03-19','2026-03-21','2026-03-23'],
    profileViews:[25,40,50,35,60,45,70,55,75,65,80,70,85,75,90],
  },
  {
    id:'u5', initials:'AS', avClass:'av-teal',
    name:'Ananya Sharma', email:'ananya@fm.in', password:'ananya123',
    role:'UX Designer', city:'Pune',
    bio:'UX designer with 4 years in product design. Ex-Myntra. Passionate about inclusive design for Indian users.',
    skills:['Figma','User Research','Prototyping','Design Systems','Mobile UX'],
    lookingFor:['Full-Stack Engineer','Product Manager','Marketing Specialist'],
    stage:'MVP', accentColor:'#14b8a6', theme:'teal',
    loginHistory:['2026-03-04','2026-03-06','2026-03-08','2026-03-10','2026-03-12','2026-03-14','2026-03-16','2026-03-18','2026-03-20','2026-03-22'],
    profileViews:[35,50,45,65,55,75,60,80,70,85,75,90,80,95,85],
  },
  {
    id:'u6', initials:'MK', avClass:'av-coral',
    name:'Mohan Kumar', email:'mohan@fm.in', password:'mohan123',
    role:'Sales & Marketing', city:'Mumbai',
    bio:'Enterprise sales with 8 years in B2B SaaS. Built sales teams from scratch. Ex-Zoho, now building for Indian SMBs.',
    skills:['Enterprise Sales','CRM','Go-to-Market','Lead Generation','Negotiation'],
    lookingFor:['Product Engineer','UX Designer','Operations Lead'],
    stage:'Seed', accentColor:'#fb7185', theme:'coral',
    loginHistory:['2026-03-01','2026-03-03','2026-03-05','2026-03-07','2026-03-09','2026-03-11','2026-03-13','2026-03-15','2026-03-17','2026-03-19','2026-03-21','2026-03-23'],
    profileViews:[45,60,55,75,65,85,70,90,80,95,85,100,90,95,100],
  },
];

let _coFounders = [
  { id:'cf1',initials:'MS',avClass:'av-teal',  name:'Mehul Shah',          role:'Growth & Marketing',     city:'Mumbai',   email:'mehul@fm.in', bio:'Growth hacker with 1 exit. SEO, content, B2B outbound. Built 0→₹50K MRR. Advisor to 3 early-stage startups.', skills:['Growth Hacking','SEO','B2B Marketing','Content','LinkedIn Outreach'], tags:['Growth','SEO','B2B'],            tagClasses:['tag-amber','tag-green','tag-gray'], experience:'5 yrs',  prevStartups:1, openToEquity:true, partTime:true,  match:{u1:88,u2:72,u3:91,u4:65,u5:78,u6:85}, online:false, featured:false, linkedIn:'https://linkedin.com', github:null },
  { id:'cf2',initials:'RN',avClass:'av-amber', name:'Ritika Nair',         role:'Finance & Operations',   city:'Chennai',  email:'ritika@fm.in', bio:'IIM Ahmedabad. CFO-track with ₹50L investor network. Helped 3 startups raise seed & Series A. Cap table expert.', skills:['CFO','Fundraising','FinTech','Operations','Financial Modeling'],  tags:['CFO track','Fundraising','FinTech'], tagClasses:['tag-coral','tag-gray','tag-gray'], experience:'7 yrs',  prevStartups:3, openToEquity:true, partTime:false, match:{u1:81,u2:85,u3:76,u4:70,u5:82,u6:88}, online:true,  featured:false, linkedIn:'https://linkedin.com', github:null },
  { id:'cf3',initials:'SA',avClass:'av-coral', name:'Sneha Agarwal',       role:'UX/UI Designer',         city:'Pune',     email:'sneha@fm.in', bio:'YC fellow. Ex-Zomato design lead. Built design systems for 3 funded startups. Figma expert across B2C and B2B.', skills:['Figma','Design Systems','B2C','User Research','Prototyping'],     tags:['Figma','Design Systems','B2C'],      tagClasses:['tag-coral','tag-teal','tag-amber'], experience:'4 yrs',  prevStartups:3, openToEquity:true, partTime:false, match:{u1:74,u2:90,u3:88,u4:85,u5:95,u6:70}, online:true,  featured:false, linkedIn:'https://linkedin.com', github:null },
  { id:'cf4',initials:'DM',avClass:'av-blue',  name:'Dev Malhotra',        role:'AI/ML Engineer',         city:'Delhi',    email:'dev@fm.in',   bio:'IIT Delhi. 2 NLP research papers. Built AI features at Ola. Core believer in AI-first products for Bharat.', skills:['PyTorch','LLMs','NLP','MLOps','Data Science'],                    tags:['PyTorch','LLMs','NLP'],             tagClasses:['tag-blue','tag-purple','tag-green'], experience:'6 yrs',  prevStartups:1, openToEquity:true, partTime:false, match:{u1:70,u2:82,u3:78,u4:92,u5:75,u6:68}, online:false, featured:false, linkedIn:'https://linkedin.com', github:'https://github.com' },
  { id:'cf5',initials:'AK',avClass:'av-teal',  name:'Arjun Kumar',         role:'Sales & Business Dev',   city:'Bengaluru',email:'arjun@fm.in', bio:'Enterprise sales with ₹10Cr+ ARR experience. Built inside sales teams at 2 B2B SaaS companies. GTM expert.', skills:['Enterprise Sales','BD','CRM','SaaS GTM','Channel Partnerships'],  tags:['Sales','BD','SaaS'],                tagClasses:['tag-teal','tag-blue','tag-gray'], experience:'8 yrs',  prevStartups:2, openToEquity:true, partTime:false, match:{u1:92,u2:68,u3:80,u4:60,u5:72,u6:90}, online:true,  featured:true,  linkedIn:'https://linkedin.com', github:null },
  { id:'cf6',initials:'NP',avClass:'av-purple',name:'Neha Pillai',         role:'Legal & Compliance',     city:'Mumbai',   email:'neha@fm.in',  bio:'Corporate lawyer specializing in startups. 15+ funding rounds. ESOP, cap tables, RBI FinTech compliance expert.', skills:['Corporate Law','ESOP','Compliance','Term Sheets','RBI Regulation'], tags:['Legal','ESOP','Compliance'],         tagClasses:['tag-purple','tag-amber','tag-coral'], experience:'10 yrs', prevStartups:0, openToEquity:false,partTime:true,  match:{u1:65,u2:70,u3:85,u4:55,u5:60,u6:75}, online:false, featured:false, linkedIn:'https://linkedin.com', github:null },
  { id:'cf7',initials:'RP',avClass:'av-green', name:'Rohit Patel',         role:'Full-Stack Developer',   city:'Ahmedabad',email:'rohit@fm.in', bio:'MERN stack expert. Built 5 MVPs. Ex-Infosys. Loves building scalable web apps for Indian markets.', skills:['React','Node.js','MongoDB','Express','JavaScript'],               tags:['MERN','Full-Stack','Scalable'],     tagClasses:['tag-green','tag-blue','tag-teal'], experience:'6 yrs',  prevStartups:2, openToEquity:true, partTime:false, match:{u1:78,u2:85,u3:70,u4:80,u5:88,u6:75}, online:true,  featured:false, linkedIn:'https://linkedin.com', github:'https://github.com' },
  { id:'cf8',initials:'KS',avClass:'av-amber', name:'Kavita Singh',        role:'Data Scientist',         city:'Kolkata',  email:'kavita@fm.in',bio:'Data science lead at 2 fintech startups. ML models for credit scoring and fraud detection. IIT Kharagpur alum.', skills:['Python','Machine Learning','Data Analysis','SQL','Tableau'],       tags:['Data Science','ML','FinTech'],      tagClasses:['tag-amber','tag-purple','tag-gray'], experience:'5 yrs',  prevStartups:1, openToEquity:true, partTime:true,  match:{u1:72,u2:78,u3:85,u4:90,u5:70,u6:65}, online:false, featured:false, linkedIn:'https://linkedin.com', github:'https://github.com' },
  { id:'cf9',initials:'VS',avClass:'av-coral', name:'Vishal Sharma',       role:'DevOps Engineer',        city:'Jaipur',   email:'vishal@fm.in',bio:'DevOps specialist. AWS certified. Built CI/CD pipelines for 10+ startups. Containerization and cloud infra expert.', skills:['AWS','Docker','Kubernetes','CI/CD','Terraform'],                 tags:['DevOps','AWS','Cloud'],            tagClasses:['tag-coral','tag-green','tag-blue'], experience:'7 yrs',  prevStartups:0, openToEquity:true, partTime:false, match:{u1:80,u2:75,u3:88,u4:70,u5:65,u6:78}, online:true,  featured:false, linkedIn:'https://linkedin.com', github:'https://github.com' },
  { id:'cf10',initials:'AM',avClass:'av-blue', name:'Anjali Mehta',        role:'Content Marketer',       city:'Indore',   email:'anjali@fm.in',bio:'Content strategist. Built organic traffic from 0 to 100K monthly. SEO, social media, and brand storytelling for B2B.', skills:['SEO','Content Marketing','Social Media','Copywriting','Analytics'], tags:['Content','SEO','Marketing'],       tagClasses:['tag-blue','tag-amber','tag-teal'], experience:'4 yrs',  prevStartups:1, openToEquity:true, partTime:true,  match:{u1:85,u2:70,u3:75,u4:60,u5:80,u6:88}, online:false, featured:false, linkedIn:'https://linkedin.com', github:null },
];

let _ideas = [
  { id:'idea1',postedBy:'u1',emoji:'⚖️',title:'AI Legal Assistant for Indian Startups',        shortDesc:'Contract review and legal Q&A for startups at 1/10th the cost.',       fullDesc:'India has 80M+ SMBs that cannot afford legal counsel for every contract. Our AI platform provides instant contract review, legal Q&A, compliance checklists, and MSME-specific guidance in English and Hindi.',          problem:'Indian startups lose ₹5-50L annually due to poorly reviewed contracts.',        solution:'AI that reads contracts, flags risky clauses, and answers legal questions 24/7 at ₹999/month.', market:'₹2.4 Lakh Cr legal services market. 80M SMBs, 100K+ startups.', traction:'200 waitlist signups. 3 pilot customers at ₹999/month.', lookingFor:['Legal Tech Engineer','Legal Advisor','Growth Marketer'], stage:'MVP',      tag:'LegalTech', tagClass:'tag-blue',   looking:3, saves:24, views:180, createdAt:'2026-02-15' },
  { id:'idea2',postedBy:'u2',emoji:'🚚',title:'Supply Chain Visibility SaaS for D2C Brands',  shortDesc:'Real-time multi-warehouse ops dashboard for 50,000+ D2C brands.',          fullDesc:'D2C brands in India operate across 5-20 warehouses with zero real-time visibility. Our SaaS integrates with Unicommerce, ShipRocket, and ERPs to give a unified ops dashboard.',                                         problem:'D2C brands lose 15-25% revenue due to stockouts and poor warehouse coordination.', solution:'Unified SaaS: real-time inventory, predictive reordering, return analytics.', market:'India D2C market: ₹4.5L Cr by 2027. 50,000+ D2C brands.', traction:'10 paid beta users. ₹1.5L MRR. 4 platform integrations.', lookingFor:['Logistics Domain Expert','Backend Engineer','Enterprise Sales'], stage:'Beta',     tag:'LogisTech', tagClass:'tag-teal',   looking:5, saves:31, views:220, createdAt:'2026-02-20' },
  { id:'idea3',postedBy:'u3',emoji:'🧩',title:'Micro-SaaS Aggregator for Indian SMBs',        shortDesc:'Bundle 20+ productivity tools into one ₹999/month SMB subscription.',      fullDesc:'Indian SMBs pay for 8-15 different tools. We bundle 20+ best-in-class micro-SaaS tools into one subscription at ₹999/month, with GST compliance and vernacular UI.',                                                      problem:'SMBs overpay and underuse fragmented software. ₹15K/month wasted on unused tools.', solution:'Single subscription for all business tools. Simple, vernacular, affordable.', market:'India SMB SaaS market: $50B by 2030.', traction:'500 free trial signups. 45 paying customers.', lookingFor:['Product Designer','Partner Manager','Marketing Lead'], stage:'Ideation', tag:'SaaS',      tagClass:'tag-purple', looking:2, saves:18, views:145, createdAt:'2026-03-01' },
  { id:'idea4',postedBy:'u1',emoji:'📚',title:'Vernacular EdTech for Tier 2/3 Cities',        shortDesc:'Bite-sized skill courses in Tamil, Telugu, Bengali, Hindi with placement.', fullDesc:'75% of India\'s employable population speaks no English. We build skill courses in 4 regional languages covering coding, finance, and trades. Video-first, offline-first.',                                                     problem:'English-only edtech excludes 900M Indians from quality upskilling.',            solution:'Bite-sized vernacular courses + AI tutor + direct job placement pipeline.', market:'India EdTech: $30B by 2031. 200M potential vernacular learners.', traction:'1,200 paid learners. ₹12L revenue. 3 placement partners.', lookingFor:['Regional Content Creator','Mobile Engineer','EdTech Ops Lead'], stage:'Seed',     tag:'EdTech',    tagClass:'tag-amber',  looking:7, saves:45, views:310, createdAt:'2026-02-10' },
  { id:'idea5',postedBy:'u2',emoji:'🏥',title:'Rural HealthTech — Telemedicine + Diagnostics', shortDesc:'AI triage + telemedicine + diagnostics for 700M rural Indians.',           fullDesc:'700M rural Indians have 1 doctor per 11,000 people. Our platform connects them to specialists via video consultation, at-home diagnostics, and AI triage — all in local languages at <₹200/consultation.',               problem:'Rural India: 1 doctor per 11,000 people. Nearest diagnostic lab 50km away.',   solution:'Telemedicine + last-mile diagnostics + AI triage in Tamil, Telugu, Hindi.', market:'India HealthTech: $21B by 2025. Rural segment massively underserved.', traction:'5,000 consultations completed. 8 diagnostic lab partnerships. NPS: 72.', lookingFor:['Medical Domain Expert','Mobile Developer','Rural Distribution Partner'], stage:'MVP', tag:'HealthTech',tagClass:'tag-coral',  looking:4, saves:38, views:275, createdAt:'2026-02-25' },
  { id:'idea6',postedBy:'u3',emoji:'💳',title:'Neo-Bank for India\'s Gig Economy Workers',    shortDesc:'Instant credit, micro-insurance, savings for 50M gig workers via WhatsApp.', fullDesc:'50M gig workers have no credit history, no savings, and no insurance. Our neo-bank offers UPI-linked salary advances, micro-insurance at ₹50/month, and goal savings — all via WhatsApp with zero app download.', problem:'50M gig workers are invisible to traditional banks. No credit, no safety net.', solution:'WhatsApp-first neo-bank: instant credit, ₹50/month insurance, goal savings.', market:'India gig economy: ₹1.5L Cr growing at 25% YoY. 50M workers.', traction:'8,000 registered gig workers. ₹45L credit disbursed. Swiggy partnership.', lookingFor:['RBI Compliance Expert','WhatsApp Bot Engineer','Partnership Manager'], stage:'Seed', tag:'FinTech',    tagClass:'tag-green',  looking:6, saves:52, views:390, createdAt:'2026-02-05' },
  { id:'idea7',postedBy:'u4',emoji:'🧠',title:'AI-Powered Job Matching for Blue-Collar Workers', shortDesc:'AI matches 50M blue-collar workers to jobs using skills assessment.',       fullDesc:'India\'s blue-collar job market is fragmented. Our AI assesses skills via video interviews, matches workers to jobs, and connects them to employers — reducing unemployment and skill gaps.',                                     problem:'50M blue-collar workers unemployed due to poor job matching.',                solution:'AI skill assessment + job matching platform for blue-collar jobs.', market:'India blue-collar market: ₹10L Cr. 50M workers, 2M employers.', traction:'2,000 skill assessments. 500 job matches. 85% retention rate.', lookingFor:['Product Manager','Frontend Engineer','Business Developer'], stage:'Ideation', tag:'AI',        tagClass:'tag-purple', looking:3, saves:28, views:200, createdAt:'2026-03-05' },
  { id:'idea8',postedBy:'u5',emoji:'🎨',title:'Design Collaboration Tool for Remote Teams',   shortDesc:'Real-time design collaboration with version control and feedback.',         fullDesc:'Remote design teams struggle with collaboration. Our tool offers real-time editing, version control, integrated feedback, and client approvals — all in one platform.',                                                       problem:'Remote design collaboration is inefficient and error-prone.',                  solution:'Integrated design collaboration platform with real-time features.', market:'Global design tools market: $5B. 10M+ designers.', traction:'1,000 beta users. 200 paying teams.', lookingFor:['Full-Stack Engineer','Product Manager','Marketing Specialist'], stage:'MVP', tag:'Design',    tagClass:'tag-teal',   looking:3, saves:22, views:160, createdAt:'2026-03-10' },
  { id:'idea9',postedBy:'u6',emoji:'📈',title:'SaaS Sales Automation for Indian SMBs',        shortDesc:'Automate lead generation and sales outreach for B2B SaaS companies.',       fullDesc:'SMB SaaS companies spend too much on manual sales. Our platform automates lead gen, email sequences, and CRM integration — tailored for Indian markets.',                                                         problem:'Manual sales processes limit SMB SaaS growth.',                             solution:'Automated sales platform for SMB SaaS.', market:'India SaaS market: $10B. 50K+ SMB SaaS companies.', traction:'50 beta customers. ₹2L MRR.', lookingFor:['Product Engineer','UX Designer','Operations Lead'], stage:'Seed', tag:'Sales',     tagClass:'tag-amber',  looking:3, saves:35, views:250, createdAt:'2026-03-15' },
];

let _readMessages = {}; // userId -> Set of read message IDs

let _threads = {
  'u1_cf5':[{id:'m1',from:'cf5',text:'Hey Siva! Reviewed your FounderOS pitch — love the B2B ops angle. Market sizing is solid.',ts:'09:15'},{id:'m2',from:'u1',text:'Thanks Arjun! Your enterprise sales background is exactly what we need. Can we discuss equity?',ts:'09:18'},{id:'m3',from:'cf5',text:'Absolutely. I\'m thinking 15-20% equity + sales co-founder title. Free Thursday evening?',ts:'09:22'}],
  'u1_cf2':[{id:'m1',from:'cf2',text:'Siva, saw your FounderOS progress — impressive MVP traction for this early!',ts:'11:00'},{id:'m2',from:'u1',text:'Thanks Ritika! Need help structuring our ₹1.5Cr seed fundraise. Can you advise?',ts:'11:05'},{id:'m3',from:'cf2',text:'Let\'s build a proper financial model first. Share your current MRR and burn rate.',ts:'11:08'}],
  'u2_cf3':[{id:'m1',from:'u2',text:'Sneha! Building RuralMed and need a design co-founder. Your Zomato work is incredible.',ts:'14:00'},{id:'m2',from:'cf3',text:'Hi Priya! I checked your GitHub — clean architecture. Tell me more about the rural health vision.',ts:'14:10'},{id:'m3',from:'u2',text:'Rural telemedicine + AI triage. Need someone to own the entire UX.',ts:'14:15'},{id:'m4',from:'cf3',text:'This is exactly the impact work I want to do. Discovery call this week?',ts:'14:20'}],
  'u2_cf4':[{id:'m1',from:'cf4',text:'Priya, saw your open-source AI triage model — impressive work!',ts:'10:00'},{id:'m2',from:'u2',text:'Yes! AI-powered diagnostics for rural health. Need an ML co-founder.',ts:'10:05'},{id:'m3',from:'cf4',text:'I\'ve worked on medical NLP at Ola. Send me the problem statement.',ts:'10:12'}],
  'u3_cf1':[{id:'m1',from:'u3',text:'Mehul! Your FinTech growth experience is perfect for GigBank.',ts:'08:30'},{id:'m2',from:'cf1',text:'Hey Vikram! Traction looks real — 8K users already?',ts:'08:35'},{id:'m3',from:'u3',text:'Yes! Looking to scale 10x. Founding Growth Co-founder at 12% equity?',ts:'08:40'},{id:'m4',from:'cf1',text:'Let\'s start with Zomato delivery partners GTM. I\'m in for a call.',ts:'08:45'}],
  'u3_cf6':[{id:'m1',from:'cf6',text:'Vikram, your neo-bank will need the RBI prepaid instruments license.',ts:'16:00'},{id:'m2',from:'u3',text:'Neha! Perfect timing. Can you guide the application?',ts:'16:05'},{id:'m3',from:'cf6',text:'Yes, handled 3 PI applications. 6-8 months timeline. Retainer or equity?',ts:'16:10'}],
};

let _startups = [
  { id:'s1',ownerId:'u1',name:'FounderOS',  tagline:'The OS for Indian Startups',        desc:'B2B SaaS platform for startup operations — cap table, hiring, milestones, investor updates in one unified workspace.', stage:'MVP',      stageClass:'tag-blue',  team:['u1','cf5'], coFounders:['cf5'], progress:60, fundingTarget:'₹1.5 Cr',fundingRaised:'₹0',   lookingForFunding:true, lookingForCoFounders:true,  neededRoles:['CTO','Growth Lead'],    posts:[{id:'p1',text:'Just hit 50 waitlist signups in 10 days! 🚀 Shipping MVP by end of March. DM if you want early access.',author:'Siva Ramesh',ts:'2026-03-20',likes:12},{id:'p2',text:'Demo day feedback: investors loved the cap table feature. Iterating on onboarding UX this sprint.',author:'Siva Ramesh',ts:'2026-03-15',likes:8}], workflows:[{id:'wf1',name:'Product Sprint',status:'active'},{id:'wf2',name:'Investor Outreach',status:'planned'},{id:'wf3',name:'Team Hiring',status:'planned'}], website:'https://founderos.in', createdAt:'2026-01-15' },
  { id:'s2',ownerId:'u1',name:'VernacAI',   tagline:'AI that speaks your language',      desc:'Vernacular AI assistant for Tier 2/3 India — voice-first in 10 Indian languages for SMBs and everyday users.', stage:'Ideation', stageClass:'tag-amber', team:['u1'],       coFounders:[],     progress:15, fundingTarget:'₹50 L',  fundingRaised:'₹0',   lookingForFunding:false,lookingForCoFounders:true,  neededRoles:['NLP Engineer','Content Lead'], posts:[], workflows:[{id:'wf1',name:'Market Research',status:'active'}], website:null, createdAt:'2026-03-01' },
  { id:'s3',ownerId:'u2',name:'RuralMed',   tagline:'Healthcare for every Indian',       desc:'Telemedicine + diagnostics for rural India. AI-powered triage, regional language support, last-mile at-home diagnostics.', stage:'MVP', stageClass:'tag-blue', team:['u2','cf3','cf4'], coFounders:['cf3','cf4'], progress:45, fundingTarget:'₹2 Cr', fundingRaised:'₹25 L', lookingForFunding:true, lookingForCoFounders:false, neededRoles:[], posts:[{id:'p1',text:'5,000 consultations completed! NPS score: 72. Grateful for this incredible team 💚',author:'Priya Krishnamurthy',ts:'2026-03-18',likes:22}], workflows:[{id:'wf1',name:'MVP Development',status:'done'},{id:'wf2',name:'Pilot Launch',status:'active'},{id:'wf3',name:'Seed Fundraise',status:'planned'}], website:'https://ruralmed.health', createdAt:'2025-12-01' },
  { id:'s4',ownerId:'u3',name:'GigBank',    tagline:'Banking for India\'s gig workers',  desc:'Neo-bank for 50M gig economy workers — instant credit, micro-insurance, and goal savings delivered via WhatsApp.', stage:'Seed', stageClass:'tag-green', team:['u3','cf1','cf6'], coFounders:['cf1','cf6'], progress:75, fundingTarget:'₹3 Cr', fundingRaised:'₹1 Cr', lookingForFunding:true, lookingForCoFounders:false, neededRoles:[], posts:[{id:'p1',text:'Closed ₹1Cr pre-seed from 2 angels! 🎉 Scaling to 50K gig workers by June.',author:'Vikram Kapoor',ts:'2026-03-22',likes:41},{id:'p2',text:'Partnership signed with Swiggy for gig worker onboarding. 15,000 delivery partners incoming!',author:'Vikram Kapoor',ts:'2026-03-10',likes:28}], workflows:[{id:'wf1',name:'Product Build',status:'done'},{id:'wf2',name:'Pilot — Delivery Partners',status:'done'},{id:'wf3',name:'Seed Round',status:'active'},{id:'wf4',name:'Scale to 50K users',status:'planned'}], website:'https://gigbank.in', createdAt:'2025-09-01' },
];

let _tasks = {
  u1:[{id:'t1',done:true, text:'Finalize authentication flow',          priority:'high',  dueDate:'2026-03-10',startupId:'s1'},{id:'t2',done:true, text:'Write API documentation v0.1',          priority:'medium',dueDate:'2026-03-12',startupId:'s1'},{id:'t3',done:false,text:'Complete onboarding UX with Sneha',       priority:'high',  dueDate:'2026-03-25',startupId:'s1'},{id:'t4',done:false,text:'Set up MongoDB Atlas production cluster',  priority:'high',  dueDate:'2026-03-28',startupId:'s1'},{id:'t5',done:false,text:'Draft investor outreach — 10 VCs',         priority:'medium',dueDate:'2026-03-30',startupId:'s1'}],
  u2:[{id:'t1',done:true, text:'Design onboarding for rural users',     priority:'high',  dueDate:'2026-03-08',startupId:'s3'},{id:'t2',done:true, text:'Integrate 4 diagnostic labs API',         priority:'high',  dueDate:'2026-03-15',startupId:'s3'},{id:'t3',done:false,text:'Train AI triage model v2',               priority:'high',  dueDate:'2026-03-26',startupId:'s3'},{id:'t4',done:false,text:'Hindi UI translation — 20 screens',       priority:'medium',dueDate:'2026-03-28',startupId:'s3'},{id:'t5',done:false,text:'Prepare pitch deck for seed round',        priority:'high',  dueDate:'2026-04-01',startupId:'s3'}],
  u3:[{id:'t1',done:true, text:'Close pre-seed round legal documents',  priority:'high',  dueDate:'2026-03-05',startupId:'s4'},{id:'t2',done:true, text:'Sign Swiggy partnership MOU',           priority:'high',  dueDate:'2026-03-10',startupId:'s4'},{id:'t3',done:true, text:'Launch credit product — 500 pilots',    priority:'high',  dueDate:'2026-03-15',startupId:'s4'},{id:'t4',done:false,text:'File RBI prepaid instruments license',    priority:'high',  dueDate:'2026-03-30',startupId:'s4'},{id:'t5',done:false,text:'Scale to 10K Swiggy delivery partners',   priority:'high',  dueDate:'2026-04-15',startupId:'s4'}],
};

let _investors = [
  {id:'inv1',initials:'KH',avClass:'av-blue',  name:'Kalaari Capital',       type:'VC Fund',         focus:'SaaS · Consumer · FinTech',     stage:'Pre-seed / Seed',  ticketSize:'₹50L – ₹5Cr',  portfolio:['Cure.fit','Dream11','Unacademy'],contact:'pitch@kalaari.com',website:'https://kalaari.com', fit:{u1:92,u2:78,u3:85}, description:'Early-stage VC focused on tech-enabled businesses in India. Deep expertise in SaaS, FinTech, and consumer internet.', requirements:['Founding team domain expertise','Validated PMF','Market >₹1000 Cr'], investments:120,exits:18},
  {id:'inv2',initials:'BG',avClass:'av-purple',name:'Blume Ventures',         type:'VC Fund',         focus:'Deep Tech · B2B · EdTech',      stage:'Seed / Series A',  ticketSize:'₹1Cr – ₹10Cr', portfolio:['Dunzo','Slice','Servify'],      contact:'hello@blume.vc',   website:'https://blume.vc',    fit:{u1:85,u2:90,u3:72}, description:'Deep-conviction seed investors partnering with founders at the earliest stage. Love technical founders building for Bharat.', requirements:['Technical founding team','India-first vision','B2B or deep tech'], investments:85,exits:12},
  {id:'inv3',initials:'NB',avClass:'av-amber', name:'Nexus Venture Partners', type:'VC Fund',         focus:'Enterprise SaaS · Marketplace', stage:'Series A+',         ticketSize:'₹5Cr – ₹50Cr', portfolio:['Snapdeal','Delhivery','Druva'], contact:'info@nexusvp.com',  website:'https://nexusvp.com', fit:{u1:71,u2:65,u3:88}, description:'Growth-stage VC with deep expertise in enterprise and marketplace businesses. US and India offices.', requirements:['₹1Cr+ ARR for SaaS','Clear profitability path','Strong unit economics'], investments:60,exits:22},
  {id:'inv4',initials:'AC',avClass:'av-teal',  name:'Accel India',            type:'VC Fund',         focus:'Consumer · FinTech · Infra',    stage:'Seed to Series B', ticketSize:'₹2Cr – ₹30Cr', portfolio:['Flipkart','Swiggy','BrowserStack'],contact:'india@accel.com',website:'https://accel.com/india',fit:{u1:68,u2:82,u3:79}, description:'Most active VC in India from seed to Series B. Dedicated teams for consumer and B2B with 35 exits.', requirements:['Scalable business model','Strong distribution','India-scale opportunity'], investments:150,exits:35},
  {id:'inv5',initials:'SV',avClass:'av-coral', name:'Surge by Sequoia',       type:'Accelerator+Fund',focus:'Early-stage · All verticals',   stage:'Pre-seed',          ticketSize:'₹1Cr – ₹3Cr',  portfolio:['Khatabook','Bijak','Bukukas'], contact:'apply@surgeahead.com',website:'https://surgeahead.com',fit:{u1:55,u2:68,u3:60}, description:'Sequoia\'s rapid scale program for next-gen Indian startups. 16-week intensive program.', requirements:['Early-stage idea/MVP','Coachable founding team','India/SEA focus'], investments:300,exits:8},
  {id:'inv6',initials:'AM',avClass:'av-green', name:'Artha Venture Fund',     type:'Micro VC',        focus:'Impact · HealthTech · AgriTech',stage:'Pre-seed / Seed',  ticketSize:'₹25L – ₹2Cr',  portfolio:['Ninjacart','CropIn','Hesa'],   contact:'startups@arthaventure.com',website:'https://arthaventure.com',fit:{u1:60,u2:88,u3:65}, description:'Impact-first micro VC focused on HealthTech, AgriTech, and FinTech for underserved communities.', requirements:['Social impact mandate','Revenue + impact metrics','Bharat-focused product'], investments:45,exits:5},
];

let _pipeline = {
  s1:[{investorId:'inv1',status:'outreach_sent',note:'Sent cold email via mutual intro.',date:'2026-03-18'},{investorId:'inv2',status:'interested',note:'Intro call scheduled for March 28.',date:'2026-03-20'}],
  s3:[{investorId:'inv6',status:'term_sheet',note:'Term sheet received! ₹50L at 8% equity.',date:'2026-03-22'},{investorId:'inv4',status:'outreach_sent',note:'Sent pitch deck to Subrata Mitra.',date:'2026-03-19'}],
  s4:[{investorId:'inv3',status:'closed',note:'Committed ₹1Cr. Shareholder agreement signed.',date:'2026-03-01'},{investorId:'inv1',status:'in_discussion',note:'2nd meeting done. IC approval pending.',date:'2026-03-15'}],
};

const _milestones = {
  u1:[{state:'done',  n:'✓',title:'Idea Validation', desc:'100 user interviews — strong PMF signal confirmed'},{state:'done',  n:'✓',title:'Co-founder Found',desc:'Sales co-founder Arjun Kumar onboarded'},{state:'active',n:'→',title:'MVP Building',    desc:'Sprint 3 of 6 · 60% complete',progress:60},{state:'todo',  n:'4',title:'Beta Launch',     desc:'Target: May 2026 · 50 design partner users'},{state:'todo',  n:'5',title:'Seed Fundraise',  desc:'₹1.5Cr target · Pitch deck in final review'}],
  u2:[{state:'done',  n:'✓',title:'Idea Validation', desc:'Field visits to 20 rural PHCs in Maharashtra'},{state:'done',  n:'✓',title:'Team Assembly',   desc:'Design + AI co-founders Sneha & Dev onboarded'},{state:'done',  n:'✓',title:'MVP Build',       desc:'Core telemedicine + AI triage shipped'},{state:'active',n:'→',title:'Pilot Launch',    desc:'5,000 consultations · scaling to 20K',progress:45},{state:'todo',  n:'5',title:'Seed Round',      desc:'₹2Cr target · Term sheet from Artha Venture'}],
  u3:[{state:'done',  n:'✓',title:'PMF Validated',   desc:'8K gig workers onboarded, strong retention'},{state:'done',  n:'✓',title:'Pre-seed Closed', desc:'₹1Cr raised from 2 angel investors'},{state:'done',  n:'✓',title:'Partnership',     desc:'Swiggy partnership signed — 15K partners'},{state:'active',n:'→',title:'Seed Round',      desc:'₹3Cr target · 2 VCs in active diligence',progress:75},{state:'todo',  n:'5',title:'Series A Prep',   desc:'Target Q3 2026 · 100K users milestone needed'}],
};

const _analytics = {
  u1:{ metrics:{profileViews:1284,connects:47,ideaSaves:29,chatOpens:112}, trends:{profileViews:'+23%',connects:'+12%',ideaSaves:'+8%',chatOpens:'+31%'}, traffic:[['Direct search',38],['Skill search',26],['Idea listing',18],['Referrals',12],['Other',6]], completion:[['Bio & photo',100],['Skills & exp.',90],['Startup idea',80],['Work prefs',70],['Social links',60]], sparkData:[40,55,45,80,60,50,90,65,55,72,100,78,60,55,45,88,70,62,58,95,80,68,74,85,70,66,72,92,78,75], profileScore:82, loginDays:14, streakDays:7 },
  u2:{ metrics:{profileViews:980, connects:62,ideaSaves:41,chatOpens:88},  trends:{profileViews:'+15%',connects:'+28%',ideaSaves:'+18%',chatOpens:'+10%'}, traffic:[['Idea listing',42],['Direct search',30],['Referrals',15],['Skill search',8],['Other',5]],  completion:[['Bio & photo',100],['Skills & exp.',100],['Startup idea',90],['Work prefs',85],['Social links',80]], sparkData:[30,45,55,48,62,70,58,75,68,80,72,88,76,82,90,85,78,92,88,95,82,90,98,88,95,100,92,96,100,94], profileScore:91, loginDays:13, streakDays:5 },
  u3:{ metrics:{profileViews:1540,connects:85,ideaSaves:67,chatOpens:201}, trends:{profileViews:'+40%',connects:'+52%',ideaSaves:'+35%',chatOpens:'+65%'}, traffic:[['Direct search',45],['Skill search',22],['Referrals',20],['Idea listing',8],['Other',5]],  completion:[['Bio & photo',100],['Skills & exp.',100],['Startup idea',100],['Work prefs',90],['Social links',85]], sparkData:[55,70,65,80,75,90,82,95,88,100,92,88,96,100,90,95,88,100,92,98,95,100,88,96,100,94,98,100,96,100], profileScore:95, loginDays:12, streakDays:10 },
};

// ── SESSION ───────────────────────────────────────────────────
let _currentUser = null;
try { const s = sessionStorage.getItem('fm_user'); if(s) _currentUser = JSON.parse(s); } catch(e){}

// ── PUBLIC DATABASE API ────────────────────────────────────────
const DB = {

  // AUTH
  login(email, pw) {
    const u = _users.find(u => u.email===email && u.password===pw);
    if(!u) return null;
    _currentUser = {...u};
    try { sessionStorage.setItem('fm_user', JSON.stringify(_currentUser)); } catch(e){}
    return {..._currentUser};
  },
  register(data) {
    // Check if email already exists
    const existing = _users.find(u => u.email === data.email);
    if (existing) return null;

    const newUser = {
      id: `u${Date.now()}`,
      initials: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      avClass: ['av-blue', 'av-purple', 'av-teal', 'av-amber', 'av-coral', 'av-green'][Math.floor(Math.random() * 6)],
      accentColor: '#5b7fff',
      loginHistory: [],
      metrics: { profileViews: 0, connects: 0, ideaSaves: 0, chatOpens: 0 },
      trends: { profileViews: '+0%', connects: '+0%', ideaSaves: '+0%', chatOpens: '+0%' },
      traffic: [['Direct search', 100], ['Other', 0]],
      completion: [['Bio & photo', 0], ['Skills & exp.', 0], ['Startup idea', 0], ['Work prefs', 0], ['Social links', 0]],
      sparkData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 10),
      profileScore: 0,
      loginDays: 0,
      streakDays: 0,
      ...data
    };

    _users = [..._users, newUser];
    _currentUser = { ...newUser };
    try { sessionStorage.setItem('fm_user', JSON.stringify(_currentUser)); } catch (e) {}
    return { ..._currentUser };
  },
  logout() {
    _currentUser = null;
    try { sessionStorage.removeItem('fm_user'); } catch(e){}
  },
  getUser() { return _currentUser ? {..._currentUser} : null; },
  updateUser(id, data) {
    _users = _users.map(u => u.id===id ? {...u,...data} : u);
    const updated = _users.find(u => u.id===id);
    _currentUser = {...updated};
    try { sessionStorage.setItem('fm_user', JSON.stringify(_currentUser)); } catch(e){}
    return {...updated};
  },
  getAllUsers() { return _users.map(u => ({...u})); },

  // CO-FOUNDERS
  getCoFounders() { return [..._coFounders]; },
  getCoFounder(id) { const f = _coFounders.find(c=>c.id===id); return f ? {...f} : null; },
  addCoFounder(data) {
    const cf = {
      id:`cf${Date.now()}`,
      initials: data.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),
      avClass: ['av-blue','av-purple','av-teal','av-amber','av-coral','av-green'][Math.floor(Math.random()*6)],
      match: { u1:Math.floor(Math.random()*25)+60, u2:Math.floor(Math.random()*25)+60, u3:Math.floor(Math.random()*25)+60 },
      online:false, featured:false,
      tags:(data.skills||[]).slice(0,3),
      tagClasses:['tag-blue','tag-teal','tag-amber'].slice(0,Math.min(3,(data.skills||[]).length)),
      ...data,
    };
    _coFounders = [..._coFounders, cf];
    return {...cf};
  },

  // IDEAS
  getIdeas() { return [..._ideas]; },
  getIdeasForUser(userId) { return _ideas.filter(i=>i.postedBy===userId).map(i=>({...i})); },
  getIdea(id) { const i = _ideas.find(i=>i.id===id); return i ? {...i} : null; },
  addIdea(data) {
    const idea = { id:`idea${Date.now()}`, saves:0, views:1, createdAt:new Date().toISOString().split('T')[0], ...data };
    _ideas = [idea, ..._ideas];
    return {...idea};
  },
  saveIdea(id) { _ideas = _ideas.map(i => i.id===id ? {...i,saves:i.saves+1} : i); },
  viewIdea(id) { _ideas = _ideas.map(i => i.id===id ? {...i,views:i.views+1} : i); },

  // CHAT
  getThreadsForUser(userId) {
    return Object.keys(_threads)
      .filter(k => k.startsWith(userId+'_'))
      .map(k => ({ key:k, cfId:k.replace(userId+'_',''), messages:[..._threads[k]] }));
  },
  getThread(key) { return [...(_threads[key]||[])]; },
  sendMessage(key, fromId, text) {
    const msg = { id:`m${Date.now()}`, from:fromId, text, ts:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    _threads[key] = [...(_threads[key]||[]), msg];
    return {...msg};
  },
  startThread(userId, cfId, text) {
    const key = `${userId}_${cfId}`;
    const msg = { id:`m${Date.now()}`, from:userId, text, ts:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    _threads[key] = [...(_threads[key]||[]), msg];
    return { key, msg:{...msg} };
  },
  markMessagesAsRead(userId, messageIds) {
    if (!_readMessages[userId]) _readMessages[userId] = new Set();
    messageIds.forEach(id => _readMessages[userId].add(id));
  },
  getUnreadCount(userId) {
    const userThreads = Object.keys(_threads).filter(k => k.startsWith(userId+'_'));
    let unreadCount = 0;
    const readMessages = _readMessages[userId] || new Set();
    
    userThreads.forEach(threadKey => {
      const messages = _threads[threadKey] || [];
      messages.forEach(msg => {
        if (msg.from !== userId && !readMessages.has(msg.id)) {
          unreadCount++;
        }
      });
    });
    
    return unreadCount;
  },

  // STARTUPS
  getStartupsForUser(userId) { return _startups.filter(s=>s.ownerId===userId||s.team.includes(userId)).map(s=>({...s})); },
  getAllStartups() { return _startups.map(s=>({...s})); },
  getStartup(id) { const s=_startups.find(s=>s.id===id); return s ? {...s} : null; },
  addStartup(data) {
    const stageCls = {Ideation:'tag-amber',MVP:'tag-blue',Beta:'tag-teal',Seed:'tag-green','Series A':'tag-purple'};
    const s = { id:`s${Date.now()}`, progress:0, team:[data.ownerId], coFounders:[], posts:[], workflows:[], fundingRaised:'₹0', stageClass:stageCls[data.stage]||'tag-gray', createdAt:new Date().toISOString().split('T')[0], ...data };
    _startups = [..._startups, s];
    return {...s};
  },
  updateStartup(id, data) {
    _startups = _startups.map(s => s.id===id ? {...s,...data} : s);
    return this.getStartup(id);
  },
  addPost(startupId, text, author) {
    const p = { id:`p${Date.now()}`, text, author, ts:new Date().toISOString().split('T')[0], likes:0 };
    _startups = _startups.map(s => s.id===startupId ? {...s,posts:[...s.posts,p]} : s);
    return {...p};
  },
  addWorkflow(startupId, name, status='planned') {
    const wf = { id:`wf${Date.now()}`, name, status };
    _startups = _startups.map(s => s.id===startupId ? {...s,workflows:[...s.workflows,wf]} : s);
    return {...wf};
  },
  updateWorkflow(startupId, wfId, data) {
    _startups = _startups.map(s => s.id===startupId ? {...s,workflows:s.workflows.map(w=>w.id===wfId?{...w,...data}:w)} : s);
  },
  deleteWorkflow(startupId, wfId) {
    _startups = _startups.map(s => s.id===startupId ? {...s,workflows:s.workflows.filter(w=>w.id!==wfId)} : s);
  },

  // TASKS
  getTasks(userId) { return [...(_tasks[userId]||[])]; },
  addTask(userId, data) {
    const t = { id:`t${Date.now()}`, done:false, ...data };
    _tasks[userId] = [...(_tasks[userId]||[]), t];
    return {...t};
  },
  updateTask(userId, taskId, data) {
    _tasks[userId] = (_tasks[userId]||[]).map(t=>t.id===taskId?{...t,...data}:t);
  },
  deleteTask(userId, taskId) {
    _tasks[userId] = (_tasks[userId]||[]).filter(t=>t.id!==taskId);
  },

  // INVESTORS
  getInvestors() { return [..._investors]; },
  getInvestor(id) { const i=_investors.find(i=>i.id===id); return i?{...i}:null; },
  addInvestor(data) {
    const inv = { id:`inv${Date.now()}`, initials:data.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(), avClass:'av-blue', fit:{u1:70,u2:70,u3:70}, investments:0, exits:0, portfolio:[], ...data };
    _investors = [..._investors, inv];
    return {...inv};
  },

  // PIPELINE
  getPipeline(startupId) { return [...(_pipeline[startupId]||[])]; },
  addToPipeline(startupId, investorId, note) {
    const m = { investorId, status:'outreach_sent', note, date:new Date().toISOString().split('T')[0] };
    _pipeline[startupId] = [...(_pipeline[startupId]||[]), m];
    return {...m};
  },
  updatePipeline(startupId, investorId, data) {
    _pipeline[startupId] = (_pipeline[startupId]||[]).map(m=>m.investorId===investorId?{...m,...data}:m);
  },
  removeFromPipeline(startupId, investorId) {
    _pipeline[startupId] = (_pipeline[startupId]||[]).filter(m=>m.investorId!==investorId);
  },

  // STATIC
  getMilestones(userId) { return _milestones[userId]||[]; },
  getAnalytics(userId) { return _analytics[userId]||_analytics.u1; },
};

export default DB;
