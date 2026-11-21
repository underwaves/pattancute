/**
 * ค่าเริ่มต้นข้อมูลร้านค้า Pattancute (Pattancute.shop)
 * สามารถแก้ไขได้ทั้งหมดจากแดชบอร์ดหลังบ้าน (Admin Panel)
 */
export const defaultSettings = {
  // 1. Store Identity & Hero Section
  shopName: "Pattancute",
  shopSubtitle: "pattancute.wo-nad.workers.dev",
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

  // 6. App Pricing Packages (เรทราคาแยกเป็นแอพ)
  pricing: [
    {
      id: "netflix",
      name: "Netflix",
      category: "ภาพยนตร์ & ซีรีส์",
      icon: "🍿",
      color: "#E50914",
      badge: "ยอดนิยม 🔥",
      description: "ภาพยนตร์ ซีรีส์ อนิเมะ พากย์ไทย คมชัดระดับ 4K Ultra HD",
      plans: [
        {
          id: "nf-7d",
          name: "7 วัน จอหาร (Ultra HD 4K)",
          price: "39",
          period: "7 วัน",
          badge: "ทดลองดู",
          features: ["ความชัดระดับ Ultra HD 4K", "ระบบเสียง Spatial Audio", "ดูได้ทุกอุปกรณ์ มือถือ/ทีวี/ไอแพด", "ประกันดูแลตลอด 7 วัน"],
        },
        {
          id: "nf-30d-shared",
          name: "30 วัน จอหาร (Ultra HD 4K)",
          price: "119",
          originalPrice: "149",
          period: "30 วัน",
          badge: "ขายดีสุด 🔥",
          features: ["ความชัดระดับ Ultra HD 4K", "มีโปรไฟล์ส่วนตัว ใส่รหัส PIN ได้", "ดูได้ทุกอุปกรณ์ ไม่ชนจอ", "เคลมไว มีประกันตลอด 30 วัน"],
        },
        {
          id: "nf-30d-private",
          name: "30 วัน จอส่วนตัว (ไม่หารใคร)",
          price: "149",
          originalPrice: "189",
          period: "30 วัน",
          badge: "จอส่วนตัว 👑",
          features: ["จอเดี่ยวส่วนตัว 100% ไม่ชนจอ", "ความชัดระดับ 4K HDR", "ตั้งชื่อและรูปรหัส PIN เองได้", "รับประกันตลอด 30 วันเต็ม"],
        },
      ],
    },
    {
      id: "youtube",
      name: "YouTube Premium",
      category: "สตรีมมิ่ง & เพลง",
      icon: "▶️",
      color: "#FF0000",
      badge: "เมลเดิม 🎧",
      description: "ดูคลิปไม่มีโฆษณาคั่น เล่นเบื้องหลังขณะล็อกจอ พร้อมฟัง YouTube Music",
      plans: [
        {
          id: "yt-30d",
          name: "30 วัน พรีเมียม (ต่อเมลเดิม)",
          price: "49",
          originalPrice: "69",
          period: "30 วัน",
          badge: "เมลเดิม สะดวก",
          features: ["ไม่มีโฆษณาคั่น 100%", "เล่นวิดีโอขณะล็อกหน้าจอได้", "ฟัง YouTube Music Premium ฟรี", "ไม่ต้องเปลี่ยนเมล ใช้เมลเดิมได้เลย"],
        },
        {
          id: "yt-90d",
          name: "90 วัน (3 เดือนสุดคุ้ม)",
          price: "139",
          originalPrice: "179",
          period: "3 เดือน",
          badge: "สุดคุ้ม ⭐",
          features: ["ต่อเมลเดิม ไม่ต้องเปลี่ยนเมล", "ไม่มีโฆษณากวนใจ 90 วันเต็ม", "ดาวน์โหลดคลิปดูออฟไลน์ได้", "ประกันยาวตลอด 3 เดือน"],
        },
        {
          id: "yt-365d",
          name: "365 วัน (1 ปีเต็ม ยาวๆ)",
          price: "499",
          originalPrice: "650",
          period: "1 ปี",
          badge: "ประหยัดสุด 💰",
          features: ["ใช้ยาว 1 ปีเต็ม ไม่ต้องต่อบ่อย", "เมลเดิมของลูกค้าเอง ปลอดภัย", "ฟังเพลงและดูคลิปไม่มีสะดุด", "ประกันดูแลตลอดอายุการใช้งาน"],
        },
      ],
    },
    {
      id: "disney",
      name: "Disney+ Hotstar",
      category: "ภาพยนตร์ & มาร์เวล",
      icon: "🏰",
      color: "#113CCF",
      badge: "มาร์เวล / ดิสนีย์",
      description: "รวมภาพยนตร์ฟอร์มยักษ์ Marvel, Disney, Pixar, Star Wars และซีรีส์เอเชีย",
      plans: [
        {
          id: "dn-30d-shared",
          name: "30 วัน พรีเมียม 4K จอหาร",
          price: "79",
          originalPrice: "99",
          period: "30 วัน",
          badge: "ยอดนิยม 🎬",
          features: ["ความชัด 4K Ultra HD + Dolby Vision", "รองรับเสียงพากย์ไทย/ซับไทยครบ", "ดูได้ทั้งทีวี มือถือ แท็บเล็ต", "มีประกันเคลมไวตลอด 30 วัน"],
        },
        {
          id: "dn-30d-private",
          name: "30 วัน จอส่วนตัว พรีเมียม",
          price: "129",
          originalPrice: "159",
          period: "30 วัน",
          badge: "จอส่วนตัว ✨",
          features: ["จอส่วนตัว ไม่ชนใคร", "ความคมชัดสูงสุด 4K", "ดูหนังฟอร์มยักษ์ชนโรงก่อนใคร", "รับประกันตลอด 30 วัน"],
        },
      ],
    },
    {
      id: "spotify",
      name: "Spotify Premium",
      category: "เพลง & พอดแคสต์",
      icon: "🎧",
      color: "#1DB954",
      badge: "เสียงคมชัด 🎵",
      description: "ฟังเพลงไม่อั้น ไม่มีโฆษณา ข้ามเพลงได้ไม่จำกัด ดาวน์โหลดฟังออฟไลน์",
      plans: [
        {
          id: "sp-30d",
          name: "30 วัน Family Plan (เมลเดิม)",
          price: "45",
          originalPrice: "65",
          period: "30 วัน",
          badge: "เมลเดิม 🎧",
          features: ["ต่อเมลเดิม เพลย์ลิสต์ไม่หาย", "ฟังเพลงไม่มีโฆษณาคั่น", "ข้ามเพลงได้ไม่จำกัด", "คุณภาพเสียงระดับสูงสุด Very High"],
        },
        {
          id: "sp-90d",
          name: "90 วัน (3 เดือน เมลเดิม)",
          price: "125",
          originalPrice: "169",
          period: "3 เดือน",
          badge: "คุ้มค่า 💖",
          features: ["ฟังยาวๆ 3 เดือนเต็ม", "ใช้เมลเดิม เพลย์ลิสต์เดิม", "ดาวน์โหลดฟังเพลงแบบออฟไลน์", "ประกันดูแลตลอด 3 เดือน"],
        },
      ],
    },
    {
      id: "viu",
      name: "VIU Premium",
      category: "ซีรีส์เกาหลี",
      icon: "💛",
      color: "#F5A623",
      badge: "พากย์ไทยเร็วสุด ⚡",
      description: "ซีรีส์เกาหลี ซีรีส์จีน วาไรตี้ อัปเดตไวสุดพร้อมพากย์ไทยและซับไทย Full HD",
      plans: [
        {
          id: "viu-30d",
          name: "30 วัน พรีเมียม Full HD",
          price: "35",
          originalPrice: "55",
          period: "30 วัน",
          badge: "ยอดฮิต 📺",
          features: ["ดูซีรีส์ตอนใหม่พร้อมเกาหลี", "พากย์ไทย / ซับไทย คมชัด Full HD", "ไม่มีโฆษณาคั่นตลอดการรับชม", "มีประกันตลอด 30 วัน"],
        },
        {
          id: "viu-90d",
          name: "90 วัน พรีเมียมสุดคุ้ม",
          price: "89",
          originalPrice: "120",
          period: "90 วัน",
          badge: "สายซีรีส์ต้องมี ⭐",
          features: ["ดูฟินๆ 3 เดือนเต็ม", "ดาวน์โหลดไว้ดูตอนเดินทางได้", "ภาพคมชัด 1080p เสียงชัดแจ๋ว", "รับประกันตลอดการใช้งาน"],
        },
      ],
    },
    {
      id: "canva",
      name: "Canva Pro",
      category: "กราฟิก & ตกแต่งภาพ",
      icon: "🎨",
      color: "#00C4CC",
      badge: "ปลดล็อกทุกอย่าง 🚀",
      description: "ปลดล็อกเทมเพลต รูปภาพ กราฟิก และฟังก์ชัน AI พรีเมียมทั้งหมด",
      plans: [
        {
          id: "canva-30d",
          name: "30 วัน โปรทีม (เมลเดิม)",
          price: "39",
          originalPrice: "69",
          period: "30 วัน",
          badge: "เมลเดิม 🖌️",
          features: ["ต่อเมลเดิม งานเก่าไม่หาย", "ปลดล็อกเทมเพลต Pro ทั้งหมด", "ลบพื้นหลังรูปและวิดีโอ 1 คลิก", "ใช้ฟอนต์และกราฟิก Pro ได้ไม่อั้น"],
        },
        {
          id: "canva-365d",
          name: "365 วัน (1 ปีเต็ม งานไม่สะดุด)",
          price: "159",
          originalPrice: "290",
          period: "1 ปี",
          badge: "คุ้มสุดแห่งปี 🔥",
          features: ["ใช้ยาว 1 ปีเต็ม สบายใจ", "เมลเดิมของลูกค้าเอง", "คลาวด์เก็บงานไม่จำกัด", "มีประกันดูแลตลอด 1 ปีเต็ม"],
        },
      ],
    },
    {
      id: "prime",
      name: "Prime Video",
      category: "ภาพยนตร์ & ซีรีส์ฟอร์มยักษ์",
      icon: "📦",
      color: "#00A8E1",
      badge: "ซีรีส์ดังระดับโลก 🌍",
      description: "The Boys, Rings of Power, Fallout และหนังดังระดับฮอลลีวูด",
      plans: [
        {
          id: "prime-30d",
          name: "30 วัน จอหาร Ultra HD 4K",
          price: "49",
          originalPrice: "79",
          period: "30 วัน",
          badge: "ราคาประหยัด 🎬",
          features: ["ความชัดระดับ 4K HDR", "มีซับไทย พากย์ไทย", "ดูได้ทุกอุปกรณ์", "รับประกันตลอด 30 วัน"],
        },
      ],
    },
  ],
};

export const defaultPricing = defaultSettings.pricing;
export const siteConfig = defaultSettings;
