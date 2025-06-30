// Default data for static site - overrides localStorage for production
export const STATIC_HERO_SLIDES = [
  {
    id: 1,
    title: "Ankara'nın En Güvenilir",
    subtitle: "Kombi ve Klima Servisi",
    description: "25 yıllık deneyimle ev ve işyerlerinizde konfor yaratıyor, enerji tasarrufu sağlıyoruz. 7/24 servis hizmeti.",
    backgroundImage: "/images/kombi-montaj-hero.jpg",
    stats: [
      { value: "25+", label: "Yıl Deneyim" },
      { value: "10,000+", label: "Mutlu Müşteri" },
      { value: "7/24", label: "Servis Hizmeti" },
      { value: "%98", label: "Müşteri Memnuniyeti" }
    ],
    primaryCTA: {
      text: "Ücretsiz Keşif",
      href: "/iletisim"
    },
    secondaryCTA: {
      text: "Ürünlerimiz",
      href: "/urunler"
    },
    isActive: true
  },
  {
    id: 2,
    title: "Profesyonel Kombi",
    subtitle: "Montaj ve Servis Hizmeti",
    description: "Uzman ekibimizle en kaliteli markaların montajını yapıyor, düzenli bakım hizmeti sunuyoruz.",
    backgroundImage: "/images/kombi-montaj-hero.jpg",
    stats: [
      { value: "5,000+", label: "Kombi Montajı" },
      { value: "24", label: "Saat Servis" },
      { value: "15", label: "Marka Yetkili" },
      { value: "2", label: "Yıl Garanti" }
    ],
    primaryCTA: {
      text: "Teklif Al",
      href: "/iletisim"
    },
    secondaryCTA: {
      text: "Markalar",
      href: "/urunler"
    },
    isActive: true
  }
];

export const STATIC_SERVICES = [
  {
    id: 1,
    title: "Kombi Montajı",
    description: "Profesyonel ekibimizle tüm marka kombilerin montajını gerçekleştiriyoruz.",
    icon: "fire",
    features: ["Uzman Montaj", "2 Yıl Garanti", "Ücretsiz Keşif"],
    isActive: true
  },
  {
    id: 2,
    title: "Kombi Servisi",
    description: "7/24 kombi arıza servisi ile acil durumlarınızda yanınızdayız.",
    icon: "wrench",
    features: ["7/24 Servis", "Hızlı Müdahale", "Orijinal Yedek Parça"],
    isActive: true
  },
  {
    id: 3,
    title: "Klima Montajı",
    description: "Split, multi split ve VRF klima sistemlerinin profesyonel montajı.",
    icon: "snowflake",
    features: ["Tüm Markalar", "Profesyonel Montaj", "Garanti"],
    isActive: true
  }
];

// NO STATIC PRODUCTS - All product data comes from D1 database
export const STATIC_PRODUCTS: any[] = [];

// Helper function to get static data based on environment
export function getStaticData(key: string) {
  // Only return static data for production domains
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isProduction = hostname === 'ozmevsim.com' || hostname.includes('ozmevsim-website.pages.dev');
    
    if (isProduction) {
      switch (key) {
        case 'ozmevsim_hero_slides':
          return STATIC_HERO_SLIDES;
        case 'ozmevsim_services':
          return STATIC_SERVICES;
        case 'ozmevsim_products':
          return STATIC_PRODUCTS; // Empty array - use D1 instead
        default:
          return null;
      }
    }
  }
  
  return null;
} 