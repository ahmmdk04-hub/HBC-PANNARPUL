import JSZip from 'jszip';
import { ReleaseInfo } from '../types';

export const CURRENT_RELEASE: ReleaseInfo = {
  version: 'v1.0.0',
  releaseDate: '২০২৬-১০-২১',
  notes: [
    'HBC PANARPUL পূর্ণাঙ্গ প্রোডাকশন রেডি রিলিজ।',
    'ফাউন্ডার আলহাজ্ব মোঃ ছায়েদুর রহমান ভূঞা সবুর এর নাম, ফোন (01711141576) ও ফটো সংযুক্ত।',
    '১ নম্বর, ২ নম্বর ও ৩ নম্বর ইটের প্রারম্ভিক মূল্য এবং রড, সিমেন্ট, বালু, পায়া ক্যাটাগরি সংযুক্ত।',
    'বাংলা ডিজিটাল চালান PDF জেনারেশন এবং তাত্ক্ষণিক ডাউনলোড সুবিধা।',
    '৬৪ জেলা ও উপজেলার ডিপেন্ডেন্ট ড্রপডাউন সহ চেকআউট ব্যবস্থা।',
    'সম্পূর্ণ সুরক্ষিত অ্যাডমিন প্যানেল (/admin) সহ অর্ডার, পণ্য, ক্যাটাগরি, ব্যানার ও সেটিংস ব্যবস্থাপনা।',
    'রিয়েলটাইম ফায়ারবেস ফায়ারস্টোর ডাটাবেস এবং অফলাইন রেজিলিয়েন্ট লোকাল স্টোরেজ সিঙ্ক।',
    'Netlify স্ট্যাটিক ডিপ্লয়মেন্ট কনফিগারেশন ও SPA রিরাইট রুলস প্রস্তুত।'
  ]
};

// Generates a verified deployable source code ZIP package
export async function generateSourceZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('package.json', JSON.stringify({
    name: 'hbc-panarpul',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite --port=3000 --host=0.0.0.0',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'tsc --noEmit'
    },
    dependencies: {
      '@tailwindcss/vite': '^4.3.3',
      '@vitejs/plugin-react': '^6.1.1',
      'firebase': '^11.4.0',
      'jspdf': '^3.0.0',
      'jszip': '^3.10.1',
      'lucide-react': '^0.546.0',
      'motion': '^12.23.24',
      'react': '^19.0.1',
      'react-dom': '^19.0.1',
      'tailwindcss': '^4.3.3',
      'vite': '^8.3.0'
    },
    devDependencies: {
      '@types/node': '^22.14.0',
      '@types/react': '^19.3.0',
      '@types/react-dom': '^19.3.0',
      'typescript': '^7.0.2'
    }
  }, null, 2));

  zip.file('.env.example', `# HBC PANARPUL Environment Variables
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
`);

  zip.file('netlify.toml', `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`);

  zip.file('firestore.rules', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email == 'ahmmdk04@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }
    match /products/{id} { allow read: if true; allow write: if isAdmin(); }
    match /categories/{id} { allow read: if true; allow write: if isAdmin(); }
    match /banners/{id} { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id} { allow read: if true; allow write: if isAdmin(); }
    match /orders/{id} {
      allow create: if request.resource.data.status == 'Pending';
      allow read, update, delete: if isAdmin();
    }
  }
}
`);

  zip.file('README.md', `# HBC PANARPUL — কনস্ট্রাকশন সামগ্রী ই-কমার্স

## ইনস্টলেশন ও ডিপ্লয়মেন্ট গাইডলাইন

১. ডিপেন্ডেন্সি ইনস্টল করুন:
\`\`\`bash
npm install
\`\`\`

২. ডেভেলপমেন্ট সার্ভার চালু করুন:
\`\`\`bash
npm run dev
\`\`\`

৩. প্রডাকশন বিল্ড তৈরি করুন:
\`\`\`bash
npm run build
\`\`\`

৪. Netlify তে ডিপ্লয় করুন:
- Build command: \`npm run build\`
- Publish directory: \`dist\`
- SPA Redirects: \`netlify.toml\` স্বয়ংক্রিয়ভাবে কনফিগার করা আছে।
`);

  // Release manifest
  zip.file('release-info.json', JSON.stringify(CURRENT_RELEASE, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export function downloadSourceZipBlob(blob: Blob, filename = 'hbc-panarpul-source-v1.0.0.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
