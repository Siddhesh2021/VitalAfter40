I want you to FIRST inspect the existing app structure, routes, components, data, assessment flow, PWA, checkout and admin dashboard.

Do NOT throw away the current functionality.

Do NOT rebuild a generic healthcare template.

Do NOT produce a visually pretty but disconnected mockup.

Your job is to transform the current VitalAfter40 interface from a typical "vibe-coded React app" into a polished, premium, modern health-tech product inspired by the level of UX sophistication seen in FITTR.

==================================================
CURRENT REPOSITORY
==================================================

The repo currently contains:

- src/App.tsx
- src/Admin.tsx
- src/Assessment.tsx
- src/Checkout.tsx
- src/PWA.tsx
- src/data.ts
- src/index.css

There is already:

- public website
- assessment
- processing state
- personalized results
- programs
- Pilates
- professionals
- checkout
- confirmation
- PWA
- admin
- users
- assessments
- programs
- CMS
- analytics
- WhatsApp
- translations
- login
- English/Marathi content

Preserve these concepts.

==================================================
CURRENT DESIGN PROBLEM
==================================================

The existing application is functional but visually feels:

- overly template-like
- too "AI generated"
- too many conventional cards
- predictable rounded buttons
- standard Tailwind layouts
- weak visual hierarchy
- insufficient editorial composition
- insufficient storytelling
- limited animation
- limited interaction depth
- not premium enough
- not distinctive enough
- does not yet feel like a serious health-tech brand

DO NOT merely change colors.

The redesign must change:

- layout composition
- typography hierarchy
- spacing
- visual rhythm
- section transitions
- card behavior
- imagery
- motion
- interaction design
- navigation
- mobile UX
- assessment UX
- dashboard UX
- admin UX

==================================================
REFERENCE DIRECTION
==================================================

Use FITTR as the primary benchmark for:

- premium health-tech feel
- strong visual storytelling
- dark editorial sections
- large typography
- image-led storytelling
- floating information cards
- premium cards
- health category presentation
- assessment storytelling
- personalized plan presentation
- progressive visual transitions
- modern mobile UX

Use Traya only as a reference for:

- guided assessment
- one-question-at-a-time interaction
- progressive completion
- personalized results
- recommendation UI
- plan-building experience

DO NOT clone either product.

Create an original VitalAfter40 visual identity.

==================================================
BRAND DIRECTION
==================================================

The product is:

Doctor-led health, fitness, wellness and longevity for people 40+.

The doctor is the main face of the brand.

This should NOT look like:

- hospital software
- traditional clinic website
- gym landing page
- generic Pilates website
- basic booking system

It should feel like:

- premium
- confident
- intelligent
- calm
- aspirational
- sophisticated
- modern
- human
- trustworthy

The visual tone should say:

"Serious health expertise, presented beautifully."

==================================================
DO NOT OVERDO THE GEN-Z STYLE
==================================================

The target audience is 40+.

Modern does NOT mean childish.

Use modern interactions and motion, not childish visual gimmicks.

Do not use:

- excessive neon
- loud gradients
- excessive blobs
- gaming aesthetics
- excessive glassmorphism
- cartoonish icons
- over-rounding everything
- unnecessary floating widgets everywhere

==================================================
DESIGN SYSTEM
==================================================

Audit the existing color system rather than blindly replacing it.

Current base direction includes:

- sage green
- warm cream
- charcoal
- warm neutrals
- off-white
- Noto Sans Devanagari

Maintain the general wellness character but refine it into a more premium palette.

Create:

Primary
Secondary
Accent
Surface
Background
Elevated surface
Muted
Border
Success
Warning
Error
Info

Use dark and light compositions strategically.

Do not make every section white.

Use contrast between:

- dark cinematic sections
- warm editorial sections
- clean product sections
- functional dashboard sections

==================================================
TYPOGRAPHY
==================================================

Current project uses:

Fraunces
DM Sans
Noto Sans Devanagari

Do NOT discard the typography without reason.

Instead:

- keep a strong editorial display typeface
- use a clean neutral sans-serif for interface content
- use Noto Sans Devanagari for Marathi
- create a more disciplined typography scale

Improve:

- display size
- heading hierarchy
- paragraph width
- line height
- label styling
- number/stat styling
- CTA hierarchy

Marathi layouts must be treated as first-class compositions.

==================================================
LAYOUT PHILOSOPHY
==================================================

Move away from:

"section + centered heading + 3 cards"

as the default layout.

Use:

- asymmetric compositions
- large image blocks
- split layouts
- editorial grids
- full bleed sections
- layered cards
- floating metadata
- offset content
- overlapping imagery
- large numeric stats
- scroll storytelling
- sticky content sections
- horizontal scrolling cards on mobile where useful

The page should feel art-directed.

==================================================
HOMEPAGE REDESIGN
==================================================

Redesign the homepage heavily.

Hero:

Use a cinematic doctor-led visual.

The hero should feel closer to a premium health-tech campaign than a SaaS landing page.

Suggested direction:

Large statement:

"Your best years aren't behind you.
They're stronger ahead."

Supporting copy:

"Doctor-led health, fitness and wellness programs designed around your body, your goals and your life after 40."

Primary CTA:

Take Your Health Assessment

Secondary:

Explore Programs

Hero interactions:

- subtle image movement
- subtle text reveal
- layered metadata card
- subtle parallax
- elegant entrance sequence

Do not overanimate.

==================================================
SCROLL STORYTELLING
==================================================

Introduce a strong narrative:

01
Discover

02
Assess

03
Personalize

04
Transform

Instead of four boring cards, create a visual progression.

As user scrolls:

- active step changes
- typography shifts
- visual changes
- imagery changes
- progress indicator moves
- supporting copy changes

This should be one of the visual signatures of the site.

==================================================
HEALTH ECOSYSTEM
==================================================

Redesign the current services section.

Services:

Pilates
Strength
Nutrition
Physiotherapy
Doctor-led Care
Hormonal Wellness
Sexual Wellness
Healthy Ageing

Do NOT show them as identical cards in a grid.

Create visual hierarchy.

Example:

Large feature:
Pilates

Secondary:
Strength
Physiotherapy

Smaller:
Nutrition
Doctor
Hormonal Wellness
Sexual Wellness
Healthy Ageing

Use photography, typography and subtle interaction.

==================================================
DOCTOR SECTION
==================================================

Make the doctor visually central.

Current code makes the doctor appear as a card.

That is not enough.

Instead:

large portrait / video composition

copy beside or overlaid:

"Led by a doctor.
Built around you."

Show:

qualification
experience
specializations
philosophy

Add subtle:

- image reveal
- text reveal
- floating qualification tags
- scroll interaction

==================================================
ASSESSMENT REDESIGN
==================================================

This is a flagship experience.

The current Assessment.tsx should be visually redesigned, not replaced functionally.

Make it feel premium.

Top:

Previous
Progress
Percentage
Exit

Large question.

Large answer tiles.

Smooth transition between questions.

When changing questions:

- current content exits vertically/horizontally
- new question enters smoothly
- progress animates
- answer state animates

Use spring-like or smooth easing.

Do NOT make it feel like a form.

==================================================
ASSESSMENT QUESTION UI
==================================================

Answer cards should have:

- selected state
- subtle scale feedback
- border movement
- icon/visual when useful
- supporting text
- large touch area

On mobile:

one or two column max.

No cramped layouts.

==================================================
ASSESSMENT PROCESSING
==================================================

Create a premium processing screen.

"Building your personalised wellness plan..."

Animate:

Reviewing your goals
Understanding your lifestyle
Mapping your fitness needs
Matching you with the right experts
Building your recommendations

Use visual progress.

Do not use a generic circular spinner only.

==================================================
RESULTS
==================================================

The current results should feel much more like a premium personalized report.

Headline:

"Your personalised 40+ wellness plan"

Then profile summary.

Show priority areas:

Movement
Strength
Nutrition
Recovery
Medical Wellness

Use visual hierarchy rather than identical cards.

Create:

High Priority
Recommended
Consider
Optional

Do not imply diagnosis.

==================================================
PLAN BUILDER
==================================================

Create an interactive "Build Your Plan" experience.

Users can select:

Pilates
Strength
Nutrition
Physiotherapy
Doctor consultation
Hormonal wellness

Allow:

Group
Individual
Recorded

Show:

selected
recommended
optional

Price total updates visually.

Use a sticky plan summary on desktop.

Use sticky bottom summary on mobile.

==================================================
PILATES
==================================================

Make Pilates the flagship product.

The page should feel premium.

Include:

- group sessions
- individual sessions
- recorded sessions
- trainer
- schedule
- batch
- price
- duration
- difficulty
- language
- availability

Create a sophisticated schedule/batch selector.

Show remaining seats elegantly.

==================================================
PWA REDESIGN
==================================================

The PWA should feel like a true health app.

Current PWA.tsx should become more polished.

Mobile navigation:

Home
Programs
Sessions
Progress
Profile

Create:

- sticky bottom nav
- active state with animated indicator
- swipe-like transitions where appropriate
- polished cards
- progress rings where useful
- session countdowns
- progress visualization
- upcoming appointment cards

Avoid making every metric a box.

Use strong hierarchy.

==================================================
SESSION UI
==================================================

For Zoom sessions:

Show:

trainer
session
time
countdown
join button
attendance
notes

Primary CTA should be visually dominant.

Add tasteful countdown animation.

==================================================
PROGRESS EXPERIENCE
==================================================

Show:

sessions completed
attendance
consistency
movement
strength
habits

Use:

- charts
- rings
- timeline
- streak
- milestone moments

Avoid giant dashboards with too many rectangular stat boxes.

==================================================
ADMIN REDESIGN
==================================================

Keep all current admin functionality.

Redesign Admin.tsx to feel like a professional health-tech operations platform.

It should not look like a default admin template.

Use:

- persistent sidebar
- polished top bar
- command/search interaction
- meaningful data hierarchy
- premium tables
- filters
- status badges
- contextual actions
- charts
- responsive side panels
- drawers
- modal flows

==================================================
ADMIN DASHBOARD
==================================================

Dashboard metrics:

Users
New Leads
Assessment Completions
Conversions
Revenue
Upcoming Sessions
Active Programs
WhatsApp Leads

Visualize:

Leads
Assessment funnel
Conversion funnel
Revenue
Popular services
Group vs Individual
English vs Marathi

Charts should feel intentional and premium.

==================================================
CMS
==================================================

Current CMS should become much more polished.

Programs
Services
Professionals
FAQs
Testimonials
Blogs
Videos
Batches
Pricing
Homepage content
Assessment content

Make editing feel like a real product.

Use:

- side drawers
- structured forms
- preview mode
- publishing state
- autosave indicator
- draft/published states
- bilingual editing

==================================================
BILINGUAL SYSTEM
==================================================

English + Marathi must remain dynamic.

Do NOT make Marathi an afterthought.

For every CMS content item:

English
Marathi

Create polished language editing UX.

Example:

English title
Marathi title

English description
Marathi description

Show:

Complete
Missing translation
Draft
Published

The public site should have a refined language toggle.

==================================================
MOTION SYSTEM
==================================================

This is one of the BIGGEST improvements.

The current CSS mostly uses basic fade/hover interactions.

Replace this with a coherent motion system.

Create animation principles:

1. Entrance
2. Reveal
3. Hover
4. Selection
5. Navigation
6. Loading
7. Progress
8. Success
9. Modal
10. Scroll

Use:

- 150ms micro interactions
- 250–400ms UI transitions
- 500–800ms editorial reveals
- smooth easing
- subtle scale
- opacity
- translate
- clip-path where useful
- blur/fade combinations
- spring-style interaction where appropriate

Do not animate everything.

Motion should create hierarchy.

==================================================
HERO MOTION
==================================================

Use:

image parallax
text reveal
floating metadata
subtle scale
staggered CTA entrance

==================================================
CARD MOTION
==================================================

On hover:

- tiny translation
- image zoom
- metadata reveal
- subtle border change
- CTA movement

On mobile:

Use tap/press states instead of hover.

==================================================
SCROLL MOTION
==================================================

Use:

- reveal as section enters
- staggered cards
- sticky narrative sections
- image scale
- text transform
- progress indicators

Do not create motion that hurts readability.

==================================================
PAGE TRANSITIONS
==================================================

When moving between:

Home
Assessment
Results
Programs
Checkout
PWA

use smooth transitions.

Do NOT rely on abrupt page replacement.

==================================================
MOBILE
==================================================

The current design must be heavily optimized for mobile.

Primary width:

390px

Secondary:

360px

Use:

- large touch targets
- sticky bottom actions
- horizontally scrollable cards when appropriate
- fewer visible controls
- bottom sheets
- drawers
- compact navigation
- large typography

The mobile UI should feel intentionally designed, not like a shrunk desktop layout.

==================================================
IMAGE DIRECTION
==================================================

Stop relying on generic stock-image card layouts.

Use imagery intentionally.

Preferred visual themes:

- active adults 40+
- doctor interacting with patient
- Pilates movement
- strength training
- physiotherapy
- nutrition
- human lifestyle
- wellness
- recovery

Use consistent image treatment.

Images should support the story.

==================================================
ICONS
==================================================

Replace emoji-heavy visual language wherever it looks amateurish.

Use a consistent professional icon system.

Medical and wellness icons should be clean and minimal.

==================================================
COPY
==================================================

Use concise, premium, confident copy.

Avoid:

"Welcome to our amazing platform!"

Avoid AI-sounding filler.

Prefer:

"Build strength for the life you want."

"Move better. Recover better."

"Your health changes after 40. Your approach should too."

==================================================
ACCESSIBILITY
==================================================

Maintain:

- readable font sizes
- strong contrast
- focus states
- keyboard support
- 44px+ touch targets
- reduced motion support
- accessible forms

==================================================
IMPORTANT IMPLEMENTATION RULE
==================================================

DO NOT DESTROY THE EXISTING FUNCTIONAL INFORMATION ARCHITECTURE.

First:

AUDIT

Then:

REDESIGN

Then:

REFINE

The result must still support the existing product functionality.

Preserve:

assessment
results
programs
checkout
PWA
admin
CMS
analytics
WhatsApp
translations

Improve the UX and visuals substantially.

==================================================
FINAL VISUAL BENCHMARK
==================================================

When finished, compare the result mentally against:

Current VitalAfter40:
basic generated app

Target VitalAfter40:
premium health-tech startup

Target references:
FITTR-level polish
Traya-style assessment progression
modern editorial web design
high-end mobile UX

The final product should feel like something that could genuinely launch as a commercial health-tech startup.

It should make the user think:

"This is a serious platform."

NOT:

"This looks like a generated React template."

==================================================
FINAL CHECK
==================================================

Before considering the redesign complete:

Review every major route.

Review desktop.

Review mobile.

Review English.

Review Marathi.

Review assessment.

Review results.

Review checkout.

Review PWA.

Review admin.

Review CMS.

Review loading states.

Review empty states.

Review error states.

Review transitions.

Review hover states.

Review selected states.

Remove repetitive card grids.

Remove unnecessary rounded UI.

Remove generic template patterns.

Improve visual hierarchy.

Add intentional motion.

Make the product cohesive from homepage through dashboard.