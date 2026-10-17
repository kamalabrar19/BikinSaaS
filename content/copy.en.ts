import type { Copy } from "./schema";

/**
 * English copy. Written rather than translated word for word: the Indonesian
 * reads like someone talking, and a literal rendering would not.
 *
 * Prices are not restated here. They live once in content/catalog.ts and are
 * formatted per locale, so the two languages can never disagree about a
 * number. The old src/config/content.ts made exactly that mistake: its English
 * quoted "From IDR 1,500,000" for a landing page that actually costs 399,000.
 */
export const copyEn = {
  ui: {
    brand: {
      tagline: "Websites and digital systems for every kind of business",
      responseTime: "We reply within one working day.",
    },

    nav: {
      sections: {
        services: "Services",
        pricing: "Pricing",
        process: "How we work",
        work: "Work",
        ssb: "Football schools",
        faq: "Questions",
        contact: "Contact",
      },
      action: "Free consultation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      langLabel: "Choose a language",
      skipToContent: "Skip to main content",
    },

    hero: {
      statement: "Business websites. Prices published.",
      support:
        "From Rp399,000. For small businesses, local shops and football schools, explained without the jargon.",
      action: "Free consultation",
      secondaryAction: "See pricing",
    },

    sections: {
      services: {
        title: "What we build",
        lead: "From a single promotional page to a system that runs your daily operations.",
      },
      pricing: {
        title: "The prices are right here",
        lead: "Nine packages, with figures you can read now. Domain, hosting and third-party services are paid separately.",
      },
      process: {
        title: "Four steps from idea to live",
        lead: "You know what happens at each step, and what we need from you.",
      },
      work: {
        title: "Work and concepts",
        lead: "Two client systems we took over, and five concepts we built ourselves.",
      },
      ssb: {
        title: "Built for football schools",
        lead: "The one field we handle specifically, because what it needs differs from any other business.",
      },
      faq: {
        title: "Questions we get often",
      },
      contact: {
        title: "Tell us what you need",
        lead: "A short form. It opens WhatsApp with the message already laid out, ready for you to send.",
      },
    },

    services: {
      whatYouGet: "What you get",
      seeDetail: "See the detail",
      toPricing: "See the packages",
      toContact: "Ask about this",
    },

    pricing: {
      websiteTab: "Websites",
      webappTab: "Web applications",
      addOnsTab: "Add-ons",
      policyTab: "How we work with you",
      addOnsTitle: "Add-ons you can pick",
      addOnsLead: "Choose only what you need. The total adds up below.",
      maintenanceTitle: "Monthly care",
      maintenanceLead: "Optional. Useful if you want the site watched and fixed regularly.",
      from: "From",
      upTo: "up to",
      perMonth: "per month",
      popular: "Most often chosen",
      pick: "Choose this package",
      chosen: "{count} add-ons chosen",
      orderAddOns: "Send this selection",
      estimateTotal: "Estimated total",
      clearChoice: "Clear the selection",
    },

    work: {
      labelBefore: "The problem before",
      labelSolution: "What we did",
      labelResult: "The result",
      conceptNotice:
        "Five of the seven below are concepts we built ourselves, not client projects. Each card says which it is.",
      takeoverNotice: "A client project, shown without the name at their request.",
      categories: {
        all: "All",
        takeover: "Systems taken over",
        company: "Company profiles",
        saas: "SaaS products",
        ssb: "Football schools",
      },
      seeCaseStudy: "Read more",
      stackLabel: "Built with",
    },

    ssb: {
      title: "Player sign-ups on one page",
      body: "Stop answering the same question in chat one parent at a time. Let the website explain your football school and take the registrations.",
      action: "Build my football school site",
      noticeLead: "Worth knowing:",
      noticeBody:
        "this is a registration website, not a full internal system with attendance, finances or player reports. If you need an internal system, we discuss it as a separate project.",
    },

    mobile: {
      title: "Built for the phone first",
      body: "Most of your customers open a website on a phone, so the phone layout is what we get right first, not last.",
      points: [
        "Reads correctly at every screen size",
        "The WhatsApp button stays within thumb reach",
        "Dashboards remain usable from a phone",
      ],
    },

    contact: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      businessLabel: "Business name",
      businessPlaceholder: "Your business or organisation",
      serviceLabel: "What you need",
      servicePlaceholder: "Choose one",
      budgetLabel: "Budget range",
      budgetPlaceholder: "Choose a range",
      descriptionLabel: "Tell us about it",
      descriptionPlaceholder: "What does your business do, and what would you like built?",
      submit: "Send on WhatsApp",
      sending: "Preparing the message",
      doneTitle: "WhatsApp is open",
      doneBody: "Send the message we filled in so we can pick it up.",
      again: "Fill it in again",
      errName: "Please enter your name.",
      errService: "Please choose what you need.",
      errDescription: "Please describe what you need, at least 10 characters.",
      services: {
        "landing-page": "Landing page",
        "company-profile": "Company profile",
        "catalog-store": "Catalogue or online store",
        "web-app": "Web app or dashboard",
        "saas-mvp": "First version of a SaaS product",
        "custom-system": "Custom system (CRM, ERP)",
        "wa-automation": "WhatsApp automation",
        "ssb-site": "Football school website",
        takeover: "Take over an existing system",
      },
      budgets: {
        "under-1m": "Under Rp1 million",
        "1-2_5m": "Rp1 to 2.5 million",
        "2_5-5m": "Rp2.5 to 5 million",
        "over-5m": "Over Rp5 million",
        unsure: "Not sure yet, I need advice",
      },
    },

    order: {
      modalTitle: "Send your selection on WhatsApp",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      businessLabel: "Business name",
      businessPlaceholder: "Optional",
      noteLabel: "Note",
      notePlaceholder: "Anything you want to add?",
      submit: "Continue to WhatsApp",
      footnote: "Domain and hosting are paid separately, to the provider you choose.",
      errName: "Please enter your name.",
      estimate: "Estimated",
    },

    footer: {
      ctaTitle: "Ready to start?",
      ctaBody:
        "Tell us what you need and we will help map out a scope that makes sense, before you commit to anything.",
      actionChat: "Chat on WhatsApp",
      actionCall: "Arrange a call",
      tagline:
        "We build websites and digital systems for small businesses, local shops and football schools across Indonesia.",
      place: "Indonesia, working remotely",
      rights: "All rights reserved.",
      creditsLabel: "Photo credits",
      creditsNote:
        "The photographs on this page are openly licensed. Each creator and licence is named below.",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
    },

    fallback: {
      title: "No WhatsApp number is configured",
      body: "Please reach us by email for now. We reply within one working day.",
      copyEmail: "Copy the email address",
      copied: "Copied",
      close: "Close",
    },

    wa: {
      consult: "Hello BikinSaaS, I would like to talk about a website or system for my business.",
      scheduleCall: "Hello BikinSaaS, I would like to arrange a call to discuss what I need.",
      planIntro: "Hello BikinSaaS, I am interested in this package:",
      addOnIntro: "Hello BikinSaaS, I am interested in these add-ons:",
      maintenanceIntro: "Hello BikinSaaS, I am interested in this care package:",
      ssb: "Hello BikinSaaS, I run a football school and would like a registration website.",
      workSimilar: "Hello BikinSaaS, I need something similar to one of the examples in your work.",
      labelName: "Name",
      labelBusiness: "Business",
      labelService: "Needs",
      labelBudget: "Budget",
      labelNeed: "Details",
      labelNote: "Note",
      labelEstimate: "Estimated",
    },

    meta: {
      title: "BikinSaaS. Business websites with the prices published",
      description:
        "We build websites and digital systems for small businesses, local shops and football schools in Indonesia. Nine packages with published prices from Rp399,000, explained without the jargon.",
      ogImageAlt: "BikinSaaS, websites and digital systems with the prices published openly",
    },
  },

  services: {
    "branding-web-design": {
      title: "Branding and web design",
      summary:
        "A consistent visual identity and website, so your business looks credible from the first impression.",
      points: ["Logo, colour and type", "Responsive interface design", "Company profile"],
      detail:
        "We tidy up your visual identity and then apply it to the website: colour palette and type, interface components, and a company profile page ready to build a prospect's trust.",
      deliverables: [
        "Colour and type guidelines",
        "Responsive page designs",
        "Multi-page company profile",
        "Files ready for development",
      ],
    },
    "landing-page": {
      title: "Landing page",
      summary:
        "One page with a single job: getting the visitor to act, whether that is a promotion, a product or a sign-up.",
      points: ["Loads quickly", "Lead form and WhatsApp", "Ready to advertise against"],
      detail:
        "A landing page is built around one goal: getting the visitor to do something, whether that is contacting you, signing up or buying. The structure, the words and the buttons are arranged so the path is obvious.",
      deliverables: ["One page with full sections", "Contact or lead form", "WhatsApp button", "Basic SEO"],
    },
    "custom-system": {
      title: "Web apps and custom systems",
      summary:
        "A system that follows how you already work: CRM, stock, transactions, reports, and permissions per role. No more depending on a messy spreadsheet.",
      points: ["Dashboard and data management", "Stock, invoices and reports", "Permissions per role", "Take over an old system"],
      detail:
        "We map your business process first, then build a system to fit it, rather than the other way round. If you already have a system that is causing trouble, we can audit it and lay out the options: fix it in stages, redesign it, or rebuild it.",
      deliverables: [
        "A map of your workflow",
        "A web app with logins and roles",
        "Reports and data export",
        "Handover documentation",
      ],
    },
    "saas-mvp": {
      title: "First version of a SaaS product",
      summary:
        "Your product idea as a first version real users can try: multi-user, a dashboard, and a basic subscription flow.",
      points: ["Authentication and multi-tenant", "Admin dashboard", "Ready to iterate quickly"],
      detail:
        "A first version focuses on the core features that most need testing. We help set a realistic scope, build a foundation that can grow, and hand it over so you can start putting it in front of real users.",
      deliverables: [
        "Authentication and per-tenant data separation",
        "Admin dashboard",
        "Basic subscription flow",
        "A code base ready to build on",
      ],
    },
    "ai-wa-automation": {
      title: "WhatsApp automation",
      summary: "Answer customer questions, send notifications, and tidy up repeated work automatically.",
      points: ["Chatbot and auto-replies", "Scheduled broadcasts", "Connected to your system"],
      detail:
        "Automating conversations and repeated steps: auto-replies, order notifications, and a chatbot that answers the questions customers always ask. Third-party costs such as the WhatsApp API are paid separately to the provider.",
      deliverables: [
        "Automated conversation flows",
        "Notifications and scheduled broadcasts",
        "A connection to your system",
        "A usage guide for your team",
      ],
    },
  },

  process: {
    discovery: {
      title: "Listen first",
      subtitle: "Understand the need",
      body: "You tell us about the business, the target, and the problem you want solved. The first consultation is free.",
      points: ["Talk through the need", "Map the problem", "Examples and references"],
    },
    strategy: {
      title: "Set the scope",
      subtitle: "Proposal and quote",
      body: "We put together a recommendation, a scope of work, a time estimate and a clear cost, before you decide.",
      points: ["Recommended package", "Scope and timing", "A written quote"],
    },
    build: {
      title: "Build it",
      subtitle: "Design and development",
      body: "Design and development happen in stages, with regular progress updates.",
      points: ["Design and development", "Progress updates", "Tested across devices"],
    },
    launch: {
      title: "Hand it over",
      subtitle: "Review and go live",
      body: "You review the result, we revise, then it goes live. After that there is a 14-day bug warranty.",
      points: ["One round of revisions", "Go live", "14-day bug warranty"],
    },
  },

  plans: {
    "lp-starter": {
      name: "Landing Page Starter",
      tagline: "One simple page to get online.",
      features: ["1 landing page", "Responsive design", "WhatsApp button", "1 round of revisions"],
    },
    "lp-business": {
      name: "Landing Page Business",
      tagline: "A landing page built around converting.",
      features: ["1 page with full sections", "Contact or lead form", "Subtle motion", "Basic SEO", "1 round of revisions"],
    },
    "cp-basic": {
      name: "Company Profile Basic",
      tagline: "A tidy multi-page company profile.",
      features: ["Up to 5 pages", "Responsive design", "Gallery and contact", "Basic SEO", "1 round of revisions"],
    },
    "cp-plus": {
      name: "Company Profile Plus",
      tagline: "Fuller, with a blog and an integrated form.",
      features: ["Up to 8 pages", "Blog or articles", "Integrated contact form", "Basic SEO", "1 round of revisions"],
    },
    catalog: {
      name: "Online Catalogue",
      tagline: "A product catalogue that orders straight through WhatsApp.",
      features: ["Products and categories", "Search and filters", "Order via WhatsApp", "Simple product admin"],
    },
    store: {
      name: "Online Store",
      tagline: "An online shop with a cart and an order flow.",
      features: ["Cart and checkout", "Product and order management", "Payment options, where integrated", "Admin dashboard"],
    },
    "dash-basic": {
      name: "Dashboard Basic",
      tagline: "A simple data dashboard for daily operations.",
      features: ["User login", "Manage core data", "Tables and filters", "Basic data export"],
    },
    "biz-app": {
      name: "Business App",
      tagline: "A business app with several modules and roles.",
      features: ["Multiple user roles", "Connected modules", "Reports and charts", "Basic notifications"],
    },
    "saas-mvp-plan": {
      name: "SaaS MVP",
      tagline: "The first version of your SaaS product, ready for users to try.",
      features: ["Authentication and multi-tenant", "Admin dashboard", "Basic subscription flow", "Final price follows the scope"],
    },
  },

  addOns: {
    "extra-page": { name: "Extra page", body: "An additional page beyond the package allowance.", unit: "/page" },
    "design-custom": { name: "Custom design", body: "A bespoke design following your brand identity." },
    seo: { name: "Extended basic SEO", body: "Metadata, sitemap and speed work." },
    "multi-lang": { name: "Two languages", body: "Content in both Indonesian and English." },
    cms: { name: "Content management panel", body: "Edit the content yourself without touching code." },
    api: { name: "Third-party API integration", body: "A connection to another service." },
    payment: { name: "Payment gateway integration", body: "Take payments online." },
    "wa-auto": { name: "WhatsApp automation", body: "Notifications and auto-replies wired into the system." },
  },

  maintenance: {
    "mt-basic": {
      name: "Care Basic",
      features: ["Uptime monitoring", "Minor bug fixes", "Light content updates, limited"],
    },
    "mt-standard": {
      name: "Care Standard",
      features: ["Everything in Basic", "Security and dependency updates", "Regular backups", "Priority replies"],
    },
    "mt-pro": {
      name: "Care Pro",
      features: ["Everything in Standard", "Small feature adjustments", "Monthly report", "Highest priority"],
    },
  },

  policies: {
    dp: {
      title: "50% deposit",
      body: "Work begins once a 50% deposit is paid. The balance is settled before final handover or go-live.",
    },
    warranty: {
      title: "14-day bug warranty",
      body: "After go-live, bugs in features that were agreed are fixed at no cost for 14 days. New features outside that agreement are not covered.",
    },
    revision: {
      title: "One round of revisions",
      body: "One round means you gather all your feedback into a single list and we work through it together. Feedback arriving piece by piece counts as the next round.",
    },
    exclusion: {
      title: "Outside the package price",
      body: "Domain, hosting or server costs, and third-party services such as a paid WhatsApp API or a payment gateway, are not part of the package price and are paid separately to the provider.",
    },
  },

  work: {
    "takeover-inventori": {
      title: "Rescuing a distributor's inventory system",
      client: "An FMCG distributor, unnamed",
      before: "The old system was slow, the code undocumented, and the previous developer could no longer be reached.",
      solution: "A code audit, a map of the business flow, then staged repairs with documentation and full repository access.",
      result: "A stable system, tidier stock records, and a team with documentation for whatever comes next.",
      detail:
        "We started with a full audit: the database structure, the backend code, and the warehouse team's daily workflow. From there we set repair priorities, critical bugs first, then performance, then new features. Everything was done in stages so operations never stopped, and it was handed over complete with documentation and repository access.",
      stack: ["Next.js", "PostgreSQL", "REST API"],
    },
    "takeover-toko": {
      title: "Redesigning a small fashion retailer's store",
      client: "A small fashion business, unnamed",
      before: "The storefront looked dated, the checkout confused people, and it was hard to use on a phone.",
      solution: "A phone-first redesign, a simplified checkout, and the existing product data kept intact.",
      result: "Easier navigation, a shorter checkout, and a store that is comfortable to use on a phone.",
      detail:
        "Existing product and order data was migrated without losing any history. The interface was redrawn phone-first, with a larger product gallery and a checkout cut back to the steps that genuinely matter.",
      stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    "cp-kontraktor": {
      title: "Contractor company profile",
      client: "A concept for a construction firm",
      before: "The firm relied on a PDF brochure and struggled to show the projects it had completed.",
      solution: "A profile site with a project gallery, a service list, and a quote request form.",
      result: "Prospects can judge the firm's credibility and request a quote in one place.",
      detail:
        "This concept shows how a company profile can be structured for a service business: a strong opening, a service list, a filterable project gallery, and a quote request that connects straight to WhatsApp.",
      stack: ["Next.js", "Tailwind CSS"],
    },
    "cp-klinik": {
      title: "Beauty clinic profile",
      client: "A concept for a beauty clinic",
      before: "Treatment and price information was scattered across social media and hard to find.",
      solution: "A treatment catalogue, doctor profiles, and a booking button that opens WhatsApp.",
      result: "The information sits in one place and booking takes fewer steps.",
      detail:
        "A concept with grouped treatment pages, team profiles, a questions section, and a booking flow that opens WhatsApp with the message already formatted.",
      stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    "saas-broadcast": {
      title: "Multi-tenant WhatsApp broadcast platform",
      client: "A SaaS product concept",
      before: "Business owners sent bulk messages one at a time and could not track what happened next.",
      solution: "A multi-tenant dashboard for contacts, message templates, scheduling and delivery reports.",
      result: "A structured broadcast workflow, with each customer's data kept separate.",
      detail:
        "A SaaS architecture concept: authentication, per-tenant data separation, contact and template management, scheduling, and a reporting page. A reasonable picture of what a first version looks like.",
      stack: ["Next.js", "Firebase", "TypeScript"],
    },
    "saas-absensi": {
      title: "QR attendance dashboard",
      client: "A concept for a school or office",
      before: "Paper attendance took time and was easy to get wrong when totalling up.",
      solution: "QR-based attendance with automatic totals and exportable reports.",
      result: "Attendance totals that are faster to produce and easier to check.",
      detail:
        "The concept: a participant scans a QR code, the record lands on the dashboard straight away, and an administrator can export a daily or monthly summary.",
      stack: ["Next.js", "Firebase"],
    },
    "ssb-pendaftaran": {
      title: "Football school registration site",
      client: "A concept for a football school",
      before: "New players registered through private chat, and the records ended up scattered.",
      solution: "A site with the school's profile, age groups, training times, and an online registration form.",
      result: "Players and parents get the full picture and can register from one page.",
      detail:
        "A registration website concept: the school's profile, age groups, training schedule, a gallery, and a registration form that sends formatted details to whoever runs the school. This is not an internal management system.",
      stack: ["Next.js", "Tailwind CSS"],
    },
  },

  ssbFeatures: {
    profil: {
      title: "School profile",
      body: "History, aims, coaches and facilities, so a parent feels sure before signing their child up.",
    },
    ku: {
      title: "Age groups",
      body: "Age groups such as U-10, U-12 and U-14, each with its programme explained.",
    },
    jadwal: {
      title: "Training schedule",
      body: "The days, times and locations of training, always easy to find.",
    },
    daftar: {
      title: "Registration form",
      body: "Player details arrive in order, without chat threads scattered everywhere.",
    },
  },

  faqs: {
    "domain-hosting": {
      question: "Are domain and hosting included in the price?",
      answer:
        "No. Domain and hosting or server costs are paid separately to the provider you choose. We can help pick and set them up, and we explain the likely cost from the start.",
    },
    duration: {
      question: "How long does it take?",
      answer:
        "It depends on the scope. A landing page is usually quickest, a company profile or online store takes longer, and web apps and SaaS products take the longest. We give a firm estimate after the first conversation.",
    },
    revision: {
      question: "How do revisions work?",
      answer:
        "Every package includes an agreed number of revision rounds. One round means all your feedback is gathered into a single list and worked through together.",
    },
    warranty: {
      question: "What does the 14-day warranty cover?",
      answer:
        "After go-live, bugs in features that were agreed are fixed at no cost for 14 days. New features outside that agreement are not covered.",
    },
    maintenance: {
      question: "Is monthly care compulsory?",
      answer:
        "No. Care is useful if you want the site kept secure, watched and regularly fixed. Packages start at Rp150,000 per month.",
    },
    takeover: {
      question: "Can you take over my existing system?",
      answer:
        "Yes. We start with an audit of the state of the code and the data, then lay out the options: staged repairs, a redesign, or a rebuild, before you decide.",
    },
    payment: {
      question: "How does payment work?",
      answer: "A 50% deposit before work starts, and the balance before final handover or go-live.",
    },
  },
} satisfies Copy;
