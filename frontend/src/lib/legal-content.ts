export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

const p = (text: string): LegalBlock => ({ type: "p", text });
const h3 = (text: string): LegalBlock => ({ type: "h3", text });
const ul = (...items: string[]): LegalBlock => ({ type: "ul", items });

export const termsIntro =
  "These Terms & Conditions govern the use of HYRUX services and the engagement between HYRUX and its clients for digital products, software development, websites, analytics, AI/ML, automation, and related services.";

export const termsSections: LegalSection[] = [
  {
    id: "services",
    title: "Services",
    blocks: [
      p("HYRUX is a Digital Product & Technology Studio. Depending on the engagement, HYRUX may provide services including:"),
      ul(
        "Website development",
        "Full-stack development",
        "Custom software",
        "SaaS development",
        "UI/UX implementation",
        "AI/ML solutions",
        "Data analytics",
        "Business analysis",
        "Automation",
        "API integrations",
        "Maintenance and technical support, where separately agreed",
      ),
      p(
        "The exact scope of each project is defined in the project proposal, quotation, statement of work, agreement, or other written confirmation accepted by both parties.",
      ),
    ],
  },
  {
    id: "project-scope",
    title: "Project Scope",
    blocks: [
      p("The project scope is based on the requirements agreed between HYRUX and the client."),
      p("Changes to the original scope may affect:"),
      ul("Cost", "Timeline", "Deliverables", "Development effort"),
      p(
        "Additional features or substantial changes may require a separate quotation or change request. Client requests should preferably be documented through email, project management software, or another agreed communication channel.",
      ),
    ],
  },
  {
    id: "payment-structure",
    title: "Payment Structure",
    blocks: [
      p("Unless a different arrangement is agreed in writing, HYRUX generally follows this payment structure:"),
      h3("40% — Project Initiation"),
      p(
        "The initial 40% advance must be received before HYRUX begins project work. This payment covers project initiation, planning, setup, scheduling, and allocation of development resources.",
      ),
      h3("40% — Development Milestone"),
      p(
        "The second 40% payment becomes due at the agreed development milestone, such as approval of the prototype or design, or completion of the defined milestone.",
      ),
      h3("20% — Final Delivery"),
      p(
        "The final 20% payment is due before final delivery, production handover, deployment, transfer of agreed source files or assets, or other final deliverables, as specified in the project agreement.",
      ),
      p("Payment schedules may be modified for specific projects if agreed in writing before work begins."),
    ],
  },
  {
    id: "work-start-condition",
    title: "Work Start Condition",
    blocks: [
      p(
        "HYRUX will begin active project development only after the required initial advance has been received and the project scope has been confirmed.",
      ),
      p(
        "A proposal, quotation, discussion, prototype, or preliminary concept does not automatically constitute project commencement.",
      ),
    ],
  },
  {
    id: "prototypes-and-initial-concepts",
    title: "Prototypes and Initial Concepts",
    blocks: [
      p(
        "Any basic website, mockup, wireframe, design concept, reference implementation, or prototype provided during the proposal or early discussion stage may be intended only to demonstrate the proposed direction, structure, style, or functionality.",
      ),
      p("A prototype is not necessarily the final production website."),
      p(
        "The final product may be redesigned, refined, optimized, expanded, or technically restructured during development based on the agreed project scope. HYRUX does not promise that a prototype will become the exact final design.",
      ),
    ],
  },
  {
    id: "design-references-and-feedback",
    title: "Design References and Client Feedback",
    blocks: [
      p("Clients may provide materials to communicate the direction they want, including:"),
      ul(
        "Website references",
        "Screenshots",
        "Images",
        "Design examples",
        "Brand references",
        "Competitor examples",
        "Layout ideas",
        "Feature requirements",
      ),
      p(
        "HYRUX will use these references to understand the desired direction. References do not mean HYRUX will copy another website or any third-party intellectual property. HYRUX will create an original implementation based on the agreed direction.",
      ),
    ],
  },
  {
    id: "meetings-and-communication",
    title: "Meetings and Communication",
    blocks: [
      p("Clients may request reasonable project meetings or review calls during the project. Meetings may be used to:"),
      ul(
        "Review progress",
        "Discuss requirements",
        "Review designs",
        "Provide feedback",
        "Clarify functionality",
        "Make project decisions",
      ),
      p("Meeting frequency and duration may depend on the project scope."),
      p(
        "The client is encouraged to communicate important decisions and approvals in writing so there is a clear project record.",
      ),
    ],
  },
  {
    id: "revisions-and-changes",
    title: "Revisions and Changes",
    blocks: [
      p("Reasonable revisions within the agreed project scope are included according to the project agreement."),
      p("Requests that materially change the original scope may be treated as additional work. Examples include:"),
      ul(
        "New pages",
        "New modules",
        "Major redesigns",
        "New integrations",
        "New platforms",
        "Additional functionality",
        "Significant changes after approval",
      ),
      p("Additional work may require additional fees and timeline adjustments."),
    ],
  },
  {
    id: "client-responsibilities",
    title: "Client Responsibilities",
    blocks: [
      p("The client is responsible for providing the information and materials required for the project, including where applicable:"),
      ul(
        "Logo",
        "Brand assets",
        "Text and content",
        "Images",
        "Product information",
        "Business information",
        "Access credentials",
        "API credentials",
        "Approvals",
        "Feedback",
      ),
      p("Delays in receiving required information or approvals may affect the project timeline."),
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    blocks: [
      p(
        "Client approval of a design, prototype, milestone, or feature indicates acceptance of that stage and allows HYRUX to proceed.",
      ),
      p(
        "Where possible, approvals should be documented through email, project software, or another written communication channel.",
      ),
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation",
    blocks: [
      p("Clients may request cancellation of a project at any stage."),
      p("If a client cancels after work has started, the refundable amount, if any, will depend on:"),
      ul(
        "Work already completed",
        "Milestones completed",
        "Development and design effort already invested",
        "Third-party costs",
        "Non-refundable services or resources",
        "Project-specific expenses",
        "Any other agreed contractual obligations",
      ),
      p("Cancellation does not entitle the client to an automatic full refund."),
    ],
  },
  {
    id: "advance-and-refund-policy",
    title: "Advance and Refund Policy",
    blocks: [
      p(
        "Where a project is cancelled after an advance has been paid, HYRUX may refund a portion of the eligible advance based on the amount of work completed and non-recoverable project costs.",
      ),
      p(
        "For eligible cancellations, the refund may generally fall within a range of approximately 50% to 70% of the applicable advance, depending on the stage of the project and work already completed.",
      ),
      p(
        "This range is not an unconditional refund guarantee. The final refund amount is determined according to the project agreement, the work completed, third-party and non-refundable costs, and applicable law. Completed and accepted deliverables may be excluded from refundable amounts.",
      ),
    ],
  },
  {
    id: "timelines",
    title: "Timelines",
    blocks: [
      p("Project timelines depend on:"),
      ul(
        "Scope",
        "Client feedback",
        "Availability of required materials",
        "Approvals",
        "Third-party services",
        "Technical complexity",
      ),
      p(
        "HYRUX will make reasonable efforts to meet agreed timelines. Delays caused by the client, such as late feedback, approvals, or materials, may extend delivery timelines.",
      ),
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    blocks: [
      p("Projects may depend on third-party services such as:"),
      ul(
        "Hosting",
        "Domains",
        "Payment gateways",
        "APIs",
        "Cloud services",
        "Email providers",
        "Analytics platforms",
        "AI APIs",
      ),
      p("Third-party fees are generally separate unless explicitly included in the project quotation."),
      p("HYRUX cannot guarantee the availability, pricing, policies, or performance of third-party services."),
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    blocks: [
      p(
        "The final ownership or licensing of project-specific deliverables follows the individual project agreement. Unless otherwise agreed:",
      ),
      ul(
        "HYRUX retains ownership of its pre-existing tools, frameworks, reusable components, internal systems, libraries, processes, and know-how.",
        "Client-specific deliverables may be transferred or licensed to the client according to the agreed payment and contract terms.",
        "Third-party libraries and services remain subject to their own licenses.",
      ),
      p("Source code does not automatically become the property of the client unless the project agreement says so."),
    ],
  },
  {
    id: "content-and-client-materials",
    title: "Content and Client Materials",
    blocks: [
      p("The client confirms that they have the necessary rights to provide materials such as:"),
      ul("Images", "Logos", "Text", "Videos", "Data", "Documents"),
      p("The client is responsible for any third-party intellectual-property rights in materials they provide."),
    ],
  },
  {
    id: "launch-and-handover",
    title: "Website Launch and Handover",
    blocks: [
      p(
        "Final deployment, source-code handover, credentials, production access, or transfer of project assets may be subject to:",
      ),
      ul("Final payment", "Completion of agreed deliverables", "Completion of required approvals"),
      p("The exact handover process will be specified in the project agreement where necessary."),
    ],
  },
  {
    id: "maintenance-and-support",
    title: "Maintenance and Support",
    blocks: [
      p(
        "Post-launch maintenance, hosting, support, bug fixes, feature development, and ongoing management are included only when explicitly stated in the project agreement.",
      ),
      p("New features are not automatically included as free maintenance."),
    ],
  },
  {
    id: "warranties-and-limitation",
    title: "Warranties and Limitation",
    blocks: [
      p("HYRUX will make reasonable efforts to deliver services according to the agreed scope."),
      p("HYRUX does not guarantee:"),
      ul(
        "Specific revenue",
        "Number of customers",
        "Search-engine rankings",
        "Conversion rates",
        "Business success",
        "Third-party platform performance",
      ),
      p(
        "To the extent permitted by applicable law, HYRUX's liability in connection with a project is limited as set out in the project agreement.",
      ),
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    blocks: [
      p(
        "Clients must not request HYRUX to build, or assist with, unlawful, fraudulent, malicious, or abusive systems. HYRUX may decline or stop work that conflicts with this section.",
      ),
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    blocks: [
      p(
        "HYRUX may update these Terms & Conditions when necessary. The latest version will be published on the website with an updated effective date.",
      ),
    ],
  },
  {
    id: "contact",
    title: "Contact",
    blocks: [p("For questions about these Terms, contact: [CONTACT EMAIL]")],
  },
];

export const privacyIntro =
  "This Privacy Policy explains how HYRUX collects, uses, stores, and protects information submitted through the HYRUX website and services.";

export const privacySections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      p("Depending on how you interact with HYRUX, we may collect the following information."),
      h3("Contact information"),
      ul("Name", "Email address", "Phone number"),
      h3("Business information"),
      ul("Company name", "Business or project type"),
      h3("Project information"),
      ul("Project description and requirements", "Budget range", "Any additional message you send us"),
      h3("Technical information"),
      ul(
        "IP address",
        "Browser type",
        "Device information",
        "Pages visited, as recorded in standard server or hosting logs",
      ),
      p(
        "We collect only the information the website actually uses. If you contact us by email, we also receive the information you include in that email.",
      ),
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    blocks: [
      p("We may use information to:"),
      ul(
        "Respond to inquiries",
        "Discuss projects",
        "Prepare proposals",
        "Deliver services",
        "Communicate with clients",
        "Improve the website",
        "Maintain security",
        "Meet legal obligations",
      ),
    ],
  },
  {
    id: "project-inquiries",
    title: "Project Inquiries",
    blocks: [
      p(
        "Information submitted through the contact or project inquiry form may be stored in the HYRUX administrative system so authorized HYRUX personnel can review and respond to inquiries.",
      ),
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    blocks: [
      p("HYRUX does not sell personal information."),
      p(
        "Information may be shared with trusted service providers only when necessary to operate the website or deliver services. Categories of providers may include:",
      ),
      ul("Hosting providers", "Database providers", "Email services", "Cloud storage"),
      p("Providers currently used by HYRUX: [LIST OF SERVICE PROVIDERS]"),
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    blocks: [
      p(
        "Cookies and similar technologies may be used for essential website functionality, remembering preferences, and security. HYRUX will describe only the cookies it actually uses: [COOKIE DETAILS]",
      ),
      p(
        "If analytics or other non-essential cookies are introduced, HYRUX will provide appropriate consent controls where required by applicable law.",
      ),
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    blocks: [
      p(
        "HYRUX uses reasonable technical and organizational safeguards to protect personal information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
      ),
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    blocks: [
      p("Information may be retained for as long as reasonably necessary for:"),
      ul(
        "Providing services",
        "Managing business relationships",
        "Handling inquiries",
        "Legal and accounting requirements",
        "Resolving disputes",
      ),
    ],
  },
  {
    id: "user-rights",
    title: "Your Rights",
    blocks: [
      p("Depending on applicable law, individuals may have rights regarding their personal information, which may include:"),
      ul("Access", "Correction", "Deletion", "Restriction", "Objection", "Withdrawal of consent, where applicable"),
      p(
        "Which rights apply depends on your location and the law that governs the processing. To make a request, contact [CONTACT EMAIL].",
      ),
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    blocks: [
      p(
        "The HYRUX website may link to third-party websites. HYRUX is not responsible for the privacy practices of external websites, and we encourage you to review their privacy policies.",
      ),
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    blocks: [
      p(
        "HYRUX does not intentionally collect personal information from children where prohibited by applicable law.",
      ),
    ],
  },
  {
    id: "policy-updates",
    title: "Policy Updates",
    blocks: [
      p(
        "HYRUX may update this Privacy Policy when necessary. The latest effective date is displayed at the top of this page.",
      ),
    ],
  },
  {
    id: "contact",
    title: "Contact",
    blocks: [p("Privacy questions can be sent to: [CONTACT EMAIL]")],
  },
];
