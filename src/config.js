/**
 * ค่าเริ่มต้นข้อมูลร้านค้า Pattancute (Pattancute.shop)
 * สามารถแก้ไขได้ทั้งหมดจากแดชบอร์ดหลังบ้าน (Admin Panel)
 */
export const defaultSettings = {
  // 1. Store Identity & Hero Section
  shopName: "Pattancute",
  shopSubtitle: "Pattancute.shop",
  welcomeChip: "ศูนย์รวมรีวิวและเครดิตร้าน Pattancute",
  welcomeBubble: "ยินดีต้อนรับน้า~ ✨",
  heroTitle: "Pattancute",
  heroSubtitle: "รวมความประทับใจและเครดิตจากลูกค้าตัวจริง 100% 🌸",
  heroCtaText: "ให้เครดิตร้าน Pattancute ✨",
  badgeTrust1: "เปิดรับรีวิวแรกจากคุณอยู่น้า~",
  badgeTrust2: "ร้านค้าปลอดภัย เชื่อถือได้",

  // คำพูดน้องลิงเมื่อถูกแตะ
  mascotQuotes: [
    "ยินดีต้อนรับน้า~ ✨",
    "งื้ออ จิ้มน้องลิงแล้วแก้มแดงเลย 💖",
    "ขอให้วันนี้เป็นวันที่น่ารักและสดใสค่ะ 🌸",
    "ส่งพลังใจให้ +100 ดวงเลยยย 🐒✨",
    "กล้วยอร่อยจังงั่มๆ 🍌 ขอบคุณที่แวะมาหาน้า",
    "ร้าน Pattancute ยินดีให้บริการเสมอนะคะ 🎀",
    "แตะอีกทีสิคะ น้องลิงชอบรอยยิ้มของคุณนะ 🥰",
    "รักลูกค้าทุกคนที่สุดในโลกเลยยย 🎉💖",
  ],

  // 2. Logo URL (defaults to /logo.png)
  logoUrl: "/logo.png",

  // 3. Background Music (YouTube / MP3)
  music: {
    enabled: true,
    youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    src: "/music/bg.mp3",
    defaultVolume: 0.4, // 0.0 - 1.0
    autoplay: true,
    title: "เพลงพื้นหลัง Pattancute",
  },

  // 4. Bento Grid Guarantee & Thank you notes
  bento: {
    showGuarantee: false,
    guaranteeTitle: "การันตีความน่าเชื่อถือ ตรวจสอบได้จริง",
    guaranteeDesc: "ทุกรีวิวส่งตรงจากลูกค้าผู้มีอุปการคุณของ Pattancute ปลอดภัยและโปร่งใส 100%",
    thankYouTitle: "ขอบคุณทุกท่านน้า~",
    thankYouDesc: "ทุกคะแนนและคำติชมคือกำลังใจสำคัญที่ทำให้ร้านพัฒนาอย่างต่อเนื่องค่ะ ✨",
  },

  // 5. Contact Channels & Social Media
  contacts: {
    badgeText: "แอดมินใจดี ยินดีให้บริการตอบแชท",
    line: {
      enabled: true,
      label: "แชท LINE @078yzbej",
      id: "@078yzbej",
      url: "https://line.me/R/ti/p/@078yzbej",
    },
    instagram: {
      enabled: false,
      label: "Instagram",
      handle: "@pattancute",
      url: "",
    },
    facebook: {
      enabled: false,
      label: "Facebook Page",
      handle: "Pattancute",
      url: "",
    },
    tiktok: {
      enabled: false,
      label: "TikTok",
      handle: "@pattancute",
      url: "",
    },
  },
};

export const siteConfig = defaultSettings;
