# 🚀 دليل النشر - Deployment Guide

## 📋 قبل النشر

### 1. تأكد من كل حاجة شغالة
```bash
npm run build
npm run preview
```

### 2. حدث المعلومات الشخصية
- [ ] GitHub username في `ProjectsSection.jsx`
- [ ] Email في `ContactSection.jsx`
- [ ] Social links في `App.jsx` و `ContactSection.jsx`
- [ ] SEO meta tags في `index.html`
- [ ] Domain في `SEO.jsx`

### 3. أضف الصور
- [ ] Blog images في `public/images/`
- [ ] OG image في `public/og-image.jpg`
- [ ] Testimonial images (optional)

## 🌐 النشر على Vercel (موصى به)

### الطريقة الأولى: من الـ Dashboard

1. اذهب إلى [Vercel](https://vercel.com/)
2. اضغط "New Project"
3. Import من GitHub
4. اختار الـ repository
5. Framework Preset: **Vite**
6. اضغط "Deploy"

### الطريقة الثانية: من الـ CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# النشر للـ production
vercel --prod
```

### Environment Variables (لو محتاج)
```
# في Vercel Dashboard → Settings → Environment Variables
VITE_API_URL=your_api_url
VITE_GITHUB_TOKEN=your_github_token
```

## 🔷 النشر على Netlify

### الطريقة الأولى: من الـ Dashboard

1. اذهب إلى [Netlify](https://www.netlify.com/)
2. اضغط "Add new site" → "Import an existing project"
3. Connect to Git provider
4. اختار الـ repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. اضغط "Deploy site"

### الطريقة الثانية: من الـ CLI

```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# تسجيل الدخول
netlify login

# بناء المشروع
npm run build

# النشر
netlify deploy

# النشر للـ production
netlify deploy --prod --dir=dist
```

### إعدادات إضافية

أنشئ ملف `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📄 النشر على GitHub Pages

### 1. تثبيت gh-pages
```bash
npm install --save-dev gh-pages
```

### 2. حدث package.json
```json
{
  "homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. حدث vite.config.js
```js
export default defineConfig({
  base: '/YOUR-REPO-NAME/',
  plugins: [react()],
})
```

### 4. انشر
```bash
npm run deploy
```

### 5. فعّل GitHub Pages
- اذهب إلى Settings → Pages
- Source: `gh-pages` branch
- اضغط Save

## 🐳 النشر باستخدام Docker

### 1. أنشئ Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. أنشئ .dockerignore
```
node_modules
dist
.git
.env
```

### 3. Build & Run
```bash
# Build
docker build -t portfolio .

# Run
docker run -p 80:80 portfolio
```

## ☁️ النشر على AWS S3 + CloudFront

### 1. Build المشروع
```bash
npm run build
```

### 2. أنشئ S3 Bucket
```bash
aws s3 mb s3://your-portfolio-bucket
```

### 3. ارفع الملفات
```bash
aws s3 sync dist/ s3://your-portfolio-bucket --delete
```

### 4. فعّل Static Website Hosting
```bash
aws s3 website s3://your-portfolio-bucket \
  --index-document index.html \
  --error-document index.html
```

### 5. أنشئ CloudFront Distribution
- Origin: S3 bucket
- Default Root Object: index.html
- Error Pages: 404 → /index.html

## 🔧 إعدادات مهمة بعد النشر

### 1. Custom Domain

#### Vercel:
- Settings → Domains → Add Domain
- أضف DNS records عند domain provider

#### Netlify:
- Domain settings → Add custom domain
- Configure DNS

### 2. SSL Certificate
- Vercel و Netlify بيوفروا SSL تلقائياً
- لو بتستخدم custom domain، هيتم تفعيل SSL تلقائياً

### 3. Analytics

#### Google Analytics:
أضف في `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Vercel Analytics:
```bash
npm i @vercel/analytics
```

في `App.jsx`:
```jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 4. Performance Monitoring

#### Vercel Speed Insights:
```bash
npm i @vercel/speed-insights
```

```jsx
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

## 🔍 SEO بعد النشر

### 1. Google Search Console
- اذهب إلى [Google Search Console](https://search.google.com/search-console)
- أضف property
- Verify ownership
- Submit sitemap: `https://your-domain.com/sitemap.xml`

### 2. Bing Webmaster Tools
- اذهب إلى [Bing Webmaster](https://www.bing.com/webmasters)
- أضف site
- Submit sitemap

### 3. Social Media
- شارك الموقع على LinkedIn, Twitter, Facebook
- تأكد من OG image بيظهر صح

## 📊 Monitoring

### 1. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) - مجاني
- [Pingdom](https://www.pingdom.com/)

### 2. Performance
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 3. Lighthouse
```bash
npm i -g lighthouse
lighthouse https://your-domain.com
```

## 🐛 Troubleshooting

### المشكلة: 404 على refresh
**الحل**: أضف redirect rules

**Vercel** - أنشئ `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** - أنشئ `public/_redirects`:
```
/*    /index.html   200
```

### المشكلة: Slow loading
**الحل**:
- استخدم WebP للصور
- Enable compression
- Use CDN
- Lazy load images

### المشكلة: Custom cursor مش شغال
**الحل**:
- تأكد من CSS loaded
- Check browser console
- Disable على mobile

## ✅ Checklist قبل النشر

- [ ] Build بدون errors
- [ ] كل الـ links شغالة
- [ ] الصور محمّلة
- [ ] SEO meta tags محدثة
- [ ] GitHub username صحيح
- [ ] Contact info صحيح
- [ ] Analytics مضاف
- [ ] Custom domain configured (optional)
- [ ] SSL enabled
- [ ] Sitemap submitted
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Cross-browser tested

## 🎉 بعد النشر

1. شارك الموقع على Social Media
2. أضفه في GitHub profile README
3. أضفه في LinkedIn
4. Monitor analytics
5. Update content regularly

---

Good luck! 🚀
