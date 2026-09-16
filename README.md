# غزال (Ghazal)

**غزال** — یک وب‌سایت موسیقی فارسی مدرن و ریسپانسیو؛ مرجع شنیدنی‌های روز ایران و جهان.
**Ghazal** — a modern, responsive Persian music website; your destination for today's best Iranian and international music.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![FontAwesome](https://img.shields.io/badge/FontAwesome-528DD7?style=flat&logo=fontawesome&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=flat&logo=swiper&logoColor=white)

---

## فارسی | امکانات

### 🎵 پلیر حرفه‌ای
- پخش/توقف، قبلی/بعدی با **صف پخش (Queue)**
- **پخش تصادفی (Shuffle)** و **تکرار (Repeat)**
- نوار پیشرفت با رنگ سبز + نمایش زمان
- **ذخیره موقعیت پخش** — بعد از رفرش صفحه، از همون‌جا ادامه می‌دهد
- **اکولایزر متحرک** هنگام پخش
- کنترل با **کیبورد**: `Space` پخش/توقف، `←`/`→` قبلی/بعدی، `↑`/`↓` صدا

### 🎧 مدیریت آهنگ‌ها
- **جستجوی زنده** بر اساس نام آهنگ یا خواننده
- فیلترهای **«همه» / «محبوب‌ترین» / «پرفروش‌ترین»**
- **پخش همه** آهنگ‌ها به ترتیب
- **تاریخچه پخش** (۲۰ آهنگ آخر، ذخیره در localStorage)
- **امتیازدهی ⭐** به آهنگ‌ها (ذخیره دائمی)

### 👤 حساب کاربری
- **ورود / ثبت‌نام** با پنل زیبا و فارسی
- ذخیره کاربران در **localStorage**

### 🛒 فروشگاه
- **سبد خرید** با افزایش/کاهش تعداد و حذف
- **پرداخت دمو** با شماره کارت + **کد تخفیف** (GHAZAL10 = ۱۰٪، GHAZAL20 = ۲۰٪)
- **دانلود رایگان دمو** کنار هر آهنگ
- **اشتراک‌گذاری** آهنگ در تلگرام/واتساپ/کپی لینک

### 🎨 ظاهر
- تم **تیره/روشن** با یک کلیک (ذخیره انتخاب)
- **کاملاً ریسپانسیو** — موبایل، تبلت، دسکتاپ
- صفحه اختصاصی هر خواننده با آمار کامل
- فوتر حرفه‌ای با دسترسی سریع و خبرنامه

---

## English | Features

### 🎵 Professional Audio Player
- Play/Pause, Previous/Next with a **play Queue**
- **Shuffle** and **Repeat** modes
- Green progress bar with current/remaining time
- **Playback position persists** — resumes where you left off after a page refresh
- **Animated equalizer** while playing
- **Keyboard shortcuts**: `Space` play/pause, `←`/`→` previous/next, `↑`/`↓` volume

### 🎧 Song Management
- **Live search** by song name or artist
- Filters: **All / Most Popular / Best Selling**
- **Play All** songs in order
- **Play history** (last 20 tracks, saved in localStorage)
- **Star rating ⭐** per song (persistent)

### 👤 User Accounts
- **Login / Register** with a beautiful Persian UI
- Users stored in **localStorage**

### 🛒 Store
- **Shopping cart** with quantity +/− and remove
- **Demo checkout** with card number + **discount codes** (GHAZAL10 = 10%, GHAZAL20 = 20%)
- **Free demo download** next to each song
- **Share** songs via Telegram / WhatsApp / copy link

### 🎨 Appearance
- **Dark/Light theme** toggle (preference saved)
- **Fully responsive** — mobile, tablet, desktop
- Dedicated artist page with full stats
- Professional footer with quick links & newsletter

---

## 🚀 اجرا | How to Run

Simple — works with any static server (no backend needed):

### روش ۱ | Method 1: Python
```bash
cd Ghazal
python -m http.server 8234
# باز کردن | Open: http://localhost:8234
```

### روش ۲ | Method 2: Install dependencies
```bash
npm install
```

> **نکته | Note:** `node_modules` is used for FontAwesome & Bootstrap assets. You can also use CDN links instead.

---

## 📁 ساختار پروژه | Project Structure

```
Ghazal/
├── index.html              # صفحه اصلی | Main page
├── assets/
│   └── js/
│       ├── app.js          # منطق برنامه | App logic
│       └── data.js         # داده خواننده‌ها | Artists & songs data
├── public/
│   ├── css/style.css       # استایل‌ها | Styles
│   ├── fonts/              # فونت ایران‌سنس | IRANSansX font
│   ├── images/             # تصاویر خواننده‌ها و لوگو | Covers & logo
│   └── Music/              # فایل‌های صوتی | Audio files
└── package.json
```

---

## 🎧 خواننده‌ها | Artists

- **امیر تتلو | Amir Tataloo**
- **محمد رضا شایع | Mohammad Reza Shayea**
- **تیلور سویفت | Taylor Swift**
- **شادمهر عقیلی | Shadmehr Aghili**

---

## 🛠 تکنولوژی‌ها | Technologies

| تکنولوژی | کاربرد | Technology | Usage |
|-----------|--------|-----------|-------|
| **HTML5 + CSS3** | ساختار و استایل | | Structure & styling |
| **JavaScript (Vanilla)** | منطق کامل (بدون فریم‌ورک) | | Full logic (no framework) |
| **Bootstrap 5** | ریسپانسیو | | Responsive layout |
| **FontAwesome 6** | آیکون‌ها | | Icons |
| **Swiper 11** | اسلایدر خواننده‌ها | | Artist slider |
| **localStorage** | ذخیره داده‌ها (بدون بک‌اند) | | Data storage (no backend) |

---

## 📄 مجوز | License

این پروژه فقط برای **نمایش و آموزش** ساخته شده است. فایل‌های صوتی و تصویری متعلق به صاحبان اصلی خودشان هستند.
This project is created for **demonstration and educational purposes only**. Audio and image files belong to their respective owners.