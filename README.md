# ACC Project - Advanced Computer Classes

A modern Next.js application for Advanced Computer Classes (ACC) offering Hindi & English Typing, CPCT, SSC Stenographer, and Government Exam preparation courses.

## Project Structure

\`\`\`
acc-project/
├── app/
│   ├── layout.tsx              # Root layout with Navbar & Footer
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── blog/
│   │   └── page.tsx            # Blog listing page
│   ├── courses/
│   │   └── page.tsx            # Courses page
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   └── typing/
│       ├── english/
│       │   └── page.tsx        # English typing practice
│       └── hindi/
│           └── page.tsx        # Hindi typing practice
├── components/
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer component
│   ├── theme-provider.tsx      # Theme configuration
│   ├── home/
│   │   ├── slider.tsx          # Image carousel
│   │   ├── home-marquee.tsx    # Marquee banner
│   │   ├── latest-course.tsx   # Course showcase
│   │   ├── our-features.tsx    # Features section
│   │   ├── counter.tsx         # Statistics counter
│   │   ├── student-review.tsx  # Testimonials
│   │   └── app-section.tsx     # Mobile app section
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notifications
├── lib/
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── styles/                     # Additional stylesheets
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies
└── components.json             # shadcn components registry
\`\`\`

## Features

- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support with next-themes
- ✅ Smooth animations with Framer Motion
- ✅ Image carousel with Embla
- ✅ Icon library with Lucide React & React Icons
- ✅ Form handling with React Hook Form
- ✅ Toast notifications with Sonner
- ✅ Type-safe with TypeScript
- ✅ SEO optimized with Next.js metadata
- ✅ Analytics with Vercel Analytics

## Getting Started

### Prerequisites
- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd acc-project
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Technologies

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Carousel**: Embla Carousel
- **Themes**: next-themes
- **Notifications**: Sonner
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Pages

- **Home** (`/`) - Landing page with hero, features, courses, testimonials, and CTA
- **Courses** (`/courses`) - Available courses and programs
- **Blog** (`/blog`) - Latest articles and updates
- **English Typing** (`/typing/english`) - English typing practice
- **Hindi Typing** (`/typing/hindi`) - Hindi typing practice
- **Contact** (`/contact`) - Contact form and information

## Components

### Home Page Components
- **Slider** - Image carousel showcasing courses
- **Marquee** - Scrolling banner with announcements
- **Latest Courses** - Featured course carousel
- **Features** - Key features/benefits section
- **Counter** - Statistics display
- **Student Reviews** - Testimonials carousel
- **App Section** - Mobile app promotion

### Layout Components
- **Navbar** - Responsive navigation with dropdown menus
- **Footer** - Footer with links, social media, and contact info

## Customization

### Colors & Theming
Edit `app/globals.css` to customize the design tokens:
\`\`\`css
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #1f2937;
  /* ... more tokens ... */
}
\`\`\`

### Adding New Pages
Create a new folder in `app/` with a `page.tsx` file:
\`\`\`
app/new-page/page.tsx
\`\`\`

### Adding New Components
Create a new file in `components/`:
\`\`\`
components/new-component.tsx
\`\`\`

## Environment Variables

Create a `.env.local` file in the root directory:
\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Railway
- etc.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Image optimization with `next/image`
- Code splitting and lazy loading
- Optimized bundle with tree-shaking
- CSS-in-JS with Tailwind CSS

## Security

- XSS protection with React
- CSRF protection ready
- Secure headers configuration
- Input validation with Zod

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@accproject.com or create an issue in the repository.

## Roadmap

- [ ] User authentication
- [ ] Payment integration
- [ ] Student progress tracking
- [ ] Mobile app
- [ ] Video lessons
- [ ] Live classes
- [ ] Certificate generation

---

**ACC Project** - Advanced Computer Classes | Hindi & English Typing | CPCT & Government Exams
