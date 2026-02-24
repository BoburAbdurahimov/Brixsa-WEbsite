import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, Search, MapPin, Home, Tag, ArrowRight,
  ChevronDown, Bed, Bath, Square, Facebook, Twitter,
  Linkedin, Instagram, Phone, Mail, MapPinned, Quote,
  MessageSquare, Calendar, Check, ArrowLeft,
  Heart, Share2, Printer, Car, Wind, Thermometer, Droplets,
  Compass, Building2, Trees, Waves,
  Clock, User, Edit, Trash2, Plus, LayoutDashboard, FileText, Users as UsersIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

// Language Context
type Language = 'en' | 'uz' | 'ru';

interface Translations {
  [key: string]: {
    en: string;
    uz: string;
    ru: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', uz: 'Bosh sahifa', ru: 'Главная' },
  about: { en: 'About', uz: 'Biz haqimizda', ru: 'О нас' },
  property: { en: 'Property', uz: 'Ko\'chmas mulk', ru: 'Недвижимость' },
  agents: { en: 'Agents', uz: 'Agentlar', ru: 'Агенты' },
  blog: { en: 'Blog', uz: 'Blog', ru: 'Блог' },
  contact: { en: 'Contact', uz: 'Aloqa', ru: 'Контакты' },
  faq: { en: 'FAQ', uz: 'TSS', ru: 'FAQ' },
  contactUs: { en: 'Contact Us', uz: 'Biz bilan bog\'laning', ru: 'Связаться' },
  search: { en: 'Search', uz: 'Qidirish', ru: 'Поиск' },
  location: { en: 'Location', uz: 'Joylashuv', ru: 'Локация' },
  category: { en: 'Category', uz: 'Toifa', ru: 'Категория' },
  type: { en: 'Type', uz: 'Turi', ru: 'Тип' },
  buy: { en: 'Buy', uz: 'Sotib olish', ru: 'Купить' },
  rent: { en: 'Rent', uz: 'Ijaraga olish', ru: 'Аренда' },
  sell: { en: 'Sell', uz: 'Sotish', ru: 'Продать' },
  viewAll: { en: 'View all', uz: 'Barchasini ko\'rish', ru: 'Смотреть все' },
  viewAllProperty: { en: 'View all Property', uz: 'Bar. e\'lonlarni ko\'rish', ru: 'Вся недвижимость' },
  viewAllAgents: { en: 'View all agents', uz: 'Barcha agentlar', ru: 'Все агенты' },
  viewAllBlogs: { en: 'View all Blogs', uz: 'Barcha maqolalar', ru: 'Все блоги' },
  scrollToExplore: { en: 'Scroll to explore', uz: 'Kashf qilish uchun pastga suring', ru: 'Прокрутите для просмотра' },
  moreThanProperties: { en: 'More Than Properties We Deliver Prestige', uz: 'Biz shunchaki uy emas, nufuz taqdim etamiz', ru: 'Мы предлагаем не просто недвижимость, а престиж' },
  tailoredSolutions: { en: 'Tailored Solutions For Every Move', uz: 'Har bir qadam uchun maxsus yechimlar', ru: 'Индивидуальные решения для каждого шага' },
  startBuying: { en: 'Start Buying', uz: 'Xaridni boshlash', ru: 'Начать покупку' },
  startSelling: { en: 'Start Selling', uz: 'Sotuvni boshlash', ru: 'Начать продажу' },
  startRenting: { en: 'Start Renting', uz: 'Ijaraga olish', ru: 'Начать аренду' },
  exploreProperties: { en: 'Explore Properties', uz: 'Uylarni ko\'rish', ru: 'Смотреть объекты' },
  getValuation: { en: 'Get Valuation', uz: 'Baholatish', ru: 'Получить оценку' },
  viewRentals: { en: 'View Rentals', uz: 'Ijaradagi uylar', ru: 'Смотреть аренду' },
  weCreate: { en: 'We Create Remarkable Communities That Blend Outdoor Beauty With Indoor Comfort', uz: 'Biz tashqi go\'zallik va ichki qulaylikni o\'zida mujassam etgan ajoyib hududlarni bunyod etamiz', ru: 'Мы создаем замечательные сообщества, сочетающие внешнюю красоту с внутренним комфортом' },
  weCreateDesc: { en: 'Our communities are crafted to seamlessly integrate the serenity of nature with the elegance of modern interiors.', uz: 'Bizning loyihalarimiz tabiat osoyishtaligi va zamonaviy interyer nafisligini uzviy birlashtirish uchun yaratilgan.', ru: 'Наши сообщества созданы для гармоничного сочетания спокойствия природы с элегантностью современных интерьеров.' },
  happyClients: { en: 'Happy Clients Served', uz: 'Mamnun mijozlar', ru: 'Довольных клиентов' },
  totalSales: { en: 'Total Property Sales', uz: 'Jami savdolar', ru: 'Всего продаж недвижимости' },

  featuredListings: { en: 'Featured Listings', uz: 'Saralangan e\'lonlar', ru: 'Избранные объявления' },
  ourAgents: { en: 'Our Agents', uz: 'Bizning agentlar', ru: 'Наши агенты' },
  ourJournal: { en: 'Our Journal', uz: 'Bizning blog', ru: 'Наш журнал' },
  interested: { en: 'Interested?', uz: 'Qiziqasizmi?', ru: 'Интересно?' },
  lookingToBuy: { en: 'Are You Looking To Buy Or Rent A Property?', uz: 'Uy sotib olmoqchimisiz yoki ijaraga?', ru: 'Вы хотите купить или арендовать недвижимость?' },
  getInTouch: { en: 'Get in touch', uz: 'Bog\'lanish', ru: 'Связаться' },
  navigation: { en: 'Navigation', uz: 'Navigatsiya', ru: 'Навигация' },
  template: { en: 'Template', uz: 'Shablon', ru: 'Шаблон' },
  allRightsReserved: { en: 'All rights reserved. Flowive.', uz: 'Barcha huquqlar himoyalangan. Flowive.', ru: 'Все права защищены. Flowive.' },
  poweredBy: { en: 'Powered by Kimi', uz: 'Kimi tomonidan ishlangan', ru: 'Создано с помощью Kimi' },
  exploreLocations: { en: 'Explore Our Locations', uz: 'Hududlar bilan tanishing', ru: 'Исследуйте наши локации' },
  frequentlyAsked: { en: 'Frequently Asked Question', uz: 'Tez-tez so\'raladigan savollar', ru: 'Часто задаваемые вопросы' },
  shareYourInterest: { en: 'Share Your Interest With Us', uz: 'Qiziqishlaringiz haqida bizga xabar bering', ru: 'Поделитесь своим интересом с нами' },
  haveQuestions: { en: 'Have questions for us? Fill out the form and an agent will reach out to you.', uz: 'Savollaringiz bormi? Formani to\'ldiring va agent siz bilan bog\'lanadi.', ru: 'Есть вопросы? Заполните форму, и агент свяжется с вами.' },
  firstName: { en: 'First Name', uz: 'Ism', ru: 'Имя' },
  lastName: { en: 'Last Name', uz: 'Familiya', ru: 'Фамилия' },
  emailAddress: { en: 'Email Address', uz: 'Elektron pochta', ru: 'Email' },
  phoneNumber: { en: 'Phone Number', uz: 'Telefon raqami', ru: 'Номер телефона' },
  message: { en: 'Message', uz: 'Xabar', ru: 'Сообщение' },
  submit: { en: 'Submit', uz: 'Yuborish', ru: 'Отправить' },
  thankYou: { en: 'Thank You!', uz: 'Rahmat!', ru: 'Спасибо!' },
  getBackSoon: { en: 'We\'ll get back to you soon.', uz: 'Tez orada siz bilan bog\'lanamiz.', ru: 'Мы скоро свяжемся с вами.' },
  backToHome: { en: 'Back to Home', uz: 'Bosh sahifaga qaytish', ru: 'На главную' },
  backToListings: { en: 'Back to Listings', uz: 'Ro\'yxatga qaytish', ru: 'К списку' },
  scheduleTour: { en: 'Schedule Tour', uz: 'Ko\'rikni rejalashtirish', ru: 'Записаться на просмотр' },
  save: { en: 'Save', uz: 'Saqlash', ru: 'Сохранить' },
  callAgent: { en: 'Call Agent', uz: 'Agentga qo\'ng\'iroq', ru: 'Позвонить агенту' },
  propertyDetails: { en: 'Property Details', uz: 'Uy tafsilotlari', ru: 'Детали объекта' },
  description: { en: 'Description', uz: 'Tavsif', ru: 'Описание' },
  amenities: { en: 'Amenities', uz: 'Qulayliklar', ru: 'Удобства' },
  contactAgent: { en: 'Contact Agent', uz: 'Agent bilan bog\'lanish', ru: 'Связаться с агентом' },
  referenceId: { en: 'Reference ID', uz: 'ID raqami', ru: 'Референс ID' },
  requestTour: { en: 'Request Tour', uz: 'Ko\'rik so\'rovi', ru: 'Запросить просмотр' },
  bedrooms: { en: 'Bedrooms', uz: 'Yotoqxonalar', ru: 'Спальни' },
  bathrooms: { en: 'Bathrooms', uz: 'Hammomlar', ru: 'Ванные' },
  sqFt: { en: 'Sq Ft', uz: 'Kv. fut', ru: 'Кв. фут' },
  yearBuilt: { en: 'Year Built', uz: 'Qurilgan yili', ru: 'Год постройки' },
  readMore: { en: 'Read More', uz: 'Batafsil', ru: 'Читать далее' },
  exploreLearn: { en: 'Explore. Learn. Innovate.', uz: 'Kashf eting. O\'rganing. Yarating.', ru: 'Исследуйте. Учитесь. Инновируйте.' },
  residential: { en: 'Residential', uz: 'Turar-joy', ru: 'Жилая' },
  commercial: { en: 'Commercial', uz: 'Tijorat', ru: 'Коммерческая' },
  luxury: { en: 'Luxury', uz: 'Hashamatli', ru: 'Элитная' },
  serviceBuyingDesc: { en: 'Find your dream property with our expert guidance', uz: 'Ekspert ko\'magida orzuingizdagi uyni toping', ru: 'Найдите дом мечты с нашей помощью' },
  serviceSellingDesc: { en: 'Get the best value for your property', uz: 'Mulkingiz uchun eng yaxshi narxni oling', ru: 'Получите лучшую цену за вашу недвижимость' },
  serviceRentingDesc: { en: 'Discover rental properties that fit your lifestyle', uz: 'Hayot tarzingizga mos ijara uylarini kashf eting', ru: 'Найдите аренду, соответствующую вашему стилю жизни' },
  footerDesc: { en: 'Built for showcasing luxury real estate listings with elegance.', uz: 'Hashamatli ko\'chmas mulkni nafislik bilan namoyish etish uchun yaratilgan.', ru: 'Создано для элегантной демонстрации элитной недвижимости.' },
  blogDesc: { en: 'Discover insights, tips, and expert advice on real estate, home buying, selling, and property investment.', uz: 'Ko\'chmas mulk, uy sotib olish, sotish va investitsiya qilish bo\'yicha maslahatlar va ekspert fikrlarini kashf eting.', ru: 'Узнайте идеи, советы и экспертные мнения о недвижимости, покупке, продаже и инвестициях.' },
  faqDesc: { en: 'Find answers to commonly asked questions about our services, properties, and the buying process.', uz: 'Xizmatlarimiz, mulk va sotib olish jarayoni haqidagi umumiy savollarga javob toping.', ru: 'Найдите ответы на часто задаваемые вопросы о наших услугах, недвижимости и процессе покупки.' },
  stillHaveQuestions: { en: 'Still have questions?', uz: 'Yana savollaringiz bormi?', ru: 'Остались вопросы?' },
  minRead: { en: 'min read', uz: 'daq o\'qish', ru: 'мин чтения' },
  garage: { en: 'Car Garage', uz: 'Avtogaraj', ru: 'Гараж' },
  airConditioning: { en: 'Air Conditioning', uz: 'Konditsioner', ru: 'Кондиционер' },
  heating: { en: 'Heating', uz: 'Isitish tizimi', ru: 'Отопление' },
  swimmingPool: { en: 'Swimming Pool', uz: 'Basseyn', ru: 'Бассейн' },
  gardenView: { en: 'Garden View', uz: 'Bog\' manzarasi', ru: 'Вид на сад' },
  securitySystem: { en: 'Security System', uz: 'Xavfsizlik tizimi', ru: 'Система безопасности' },
  privateGarden: { en: 'Private Garden', uz: 'Shaxsiy bog\'', ru: 'Частный сад' },
  waterfront: { en: 'Waterfront', uz: 'Suv bo\'yi', ru: 'Береговая линия' },
  investments: { en: 'Investments', uz: 'Investitsiyalar', ru: 'Инвестиции' },
  renovations: { en: 'Renovations', uz: 'Ta\'mirlash', ru: 'Ремонт' },
  marketTrends: { en: 'Market Trends', uz: 'Bozor tendensiyalari', ru: 'Тенденции рынка' },
  propertyManagement: { en: 'Property Management', uz: 'Mulkni boshqarish', ru: 'Управление недвижимостью' },
  // Features
  whyChooseUs: { en: 'Why Choose Us', uz: 'Nega Bizni Tanlaysiz?', ru: 'Почему Выбирают Нас' },
  smoothClosings: { en: 'Smooth Closings', uz: 'Oson Bitimlar', ru: 'Гладкие Сделки' },
  smoothClosingsDesc: { en: 'A seamless process from start to finish.', uz: 'Boshidan oxirigacha muammosiz jarayon.', ru: 'Бесшовный процесс от начала до конца.' },
  localExperts: { en: 'Local Experts', uz: 'Mahalliy Ekspertlar', ru: 'Местные Эксперты' },
  localExpertsDesc: { en: 'Agents who know the market inside out.', uz: 'Bozorni hammadan yaxshi biladigan agentlar.', ru: 'Агенты, которые знают рынок изнутри.' },
  verifiedListings: { en: 'Verified Listings', uz: 'Tasdiqlangan E\'lonlar', ru: 'Проверенные Объявления' },
  verifiedListingsDesc: { en: 'Every property vetted for authenticity.', uz: 'Har bir mulk haqiqiyligi tekshirilgan.', ru: 'Каждый объект проверен на подлинность.' },
  support247: { en: '24/7 Support', uz: '24/7 Qo\'llab-quvvatlash', ru: 'Поддержка 24/7' },
  support247Desc: { en: 'Always here to help you every step.', uz: 'Har qadamda yordam berishga doim tayyormiz.', ru: 'Всегда готовы помочь на каждом этапе.' },
  // Hero
  heroExperience: { en: 'Experience', uz: 'Hashamatdan', ru: 'Почувствуйте' },
  heroLiving: { en: 'Living', uz: 'Yuksalgan', ru: 'Жизнь' },
  heroBeyond: { en: 'Beyond', uz: 'Hayotni', ru: 'За Пределами' },
  heroLuxury: { en: 'Luxury', uz: 'His Eting', ru: 'Роскоши' },
  // Cities
  cityChicago: { en: 'Chicago', uz: 'Chikago', ru: 'Чикаго' },
  cityNewYork: { en: 'New York', uz: 'Nyu-York', ru: 'Нью-Йорк' },
  cityLosAngeles: { en: 'Los Angeles', uz: 'Los-Anjelas', ru: 'Лос-Анджелес' },
  cityMiami: { en: 'Miami', uz: 'Mayami', ru: 'Майами' },
  // Footer
  styleGuide: { en: 'Style Guide', uz: 'Uslub qo\'llanmasi', ru: 'Руководство по стилю' },
  licenses: { en: 'Licenses', uz: 'Litsenziyalar', ru: 'Лицензии' },
  changelog: { en: 'Changelog', uz: 'O\'zgarishlar', ru: 'Журнал изменений' },
  gsapInstructions: { en: 'GSAP Instructions', uz: 'GSAP ko\'rsatmalari', ru: 'Инструкции GSAP' },
  page404: { en: '404', uz: '404', ru: '404' },
  // Properties
  familyHome: { en: 'Family Friendly Home', uz: 'Oilaviy shinam uy', ru: 'Семейный уютный дом' },
  elegantCondo: { en: 'Elegant Condo Living', uz: 'Hashamatli kondo-kvartira', ru: 'Элегантная квартира' },
  palmMansion: { en: 'Palm Grove Mansion', uz: 'Palm Grove qasri', ru: 'Особняк Палм Гроув' },
  urbanLoft: { en: 'Urban Loft Space', uz: 'Shahar loft uslubidagi makon', ru: 'Городской лофт' },
  modernTownhouse: { en: 'Modern Townhouse', uz: 'Zamonaviy taunxaus', ru: 'Современный таунхаус' },
  rusticFarmhouse: { en: 'Rustic Farmhouse Charm', uz: 'Qishloq uyi jozibasi', ru: 'Деревенский шарм' },
  contemporaryHome: { en: 'Contemporary Home Design', uz: 'Zamonaviy uy dizayni', ru: 'Современный дизайн дома' },
  // Locations
  birmingham: { en: 'Birmingham', uz: 'Birmingem', ru: 'Бирмингем' },
  sanFrancisco: { en: 'San Francisco', uz: 'San-Fransisko', ru: 'Сан-Франциско' },
  miami: { en: 'Miami', uz: 'Mayami', ru: 'Майами' },
  chicago: { en: 'Chicago', uz: 'Chikago', ru: 'Чикаго' },
  losAngeles: { en: 'Los Angeles', uz: 'Los-Anjelos', ru: 'Лос-Анджелес' },
  nyc: { en: 'New York City', uz: 'Nyu-York shahri', ru: 'Нью-Йорк' },
  // Roles
  ceoFounder: { en: 'CEO, Founder', uz: 'Bosh direktor, Asoschisi', ru: 'CEO, Основатель' },
  cfo: { en: 'CFO', uz: 'Moliya direktori', ru: 'CFO' },
  coo: { en: 'COO', uz: 'Ijrochi direktor', ru: 'COO' },
  realEstateAgent: { en: 'Real Estate Agent', uz: 'Ko\'chmas mulk agenti', ru: 'Агент по недвижимости' },
  seniorAgent: { en: 'Senior Agent', uz: 'Katta agent', ru: 'Старший агент' },
  // Testimonial
  testimonialQuote: { en: '"Your real estate team made the process enjoyable and professional. We\'re thrilled with our new home!"', uz: '"Sizning jamoangiz jarayonni yoqimli va professional qildi. Biz yangi uyimizdan juda mamnunmiz!"', ru: '"Ваша команда сделала процесс приятным и профессиональным. Мы в восторге от нашего нового дома!"' },
  homeowner: { en: 'Homeowner', uz: 'Uy egasi', ru: 'Домовладелец' },
  // Blogs
  blogInspection: { en: 'The Importance Of Home Inspections', uz: 'Uy inspektsiyasining ahamiyati', ru: 'Важность осмотра дома' },
  blogTerminology: { en: 'Understanding Real Estate Terminology', uz: 'Ko\'chmas mulk terminologiyasini tushunish', ru: 'Понимание терминологии недвижимости' },
  blogFinancing: { en: 'Financing Options For Home Buyers', uz: 'Uy sotib oluvchilar uchun moliyalashtirish', ru: 'Варианты финансирования' },
  // FAQs
  faq1Q: { en: 'What services do you offer?', uz: 'Qanday xizmatlarni taklif qilasiz?', ru: 'Какие услуги вы предлагаете?' },
  faq1A: { en: 'We offer property listings, buyer representation, and property management.', uz: 'Biz mulk ro\'yxatga olish, xaridor vakilligi va mulk boshqaruvini taklif etamiz.', ru: 'Мы предлагаем листинг недвижимости и управление собственностью.' },
  faq2Q: { en: 'How do I list my property?', uz: 'Mulkimni qanday ro\'yxatga olaman?', ru: 'Как разместить мою недвижимость?' },
  faq2A: { en: 'Contact our team via the "List Your Property" button.', uz: '"Mulkingizni joylashtirish" tugmasi orqali jamoamiz bilan bog\'laning.', ru: 'Свяжитесь с нами через кнопку "Разместить недвижимость".' },
  faq3Q: { en: 'Do you charge listing fees?', uz: 'Ro\'yxatga olish uchun to\'lov bormi?', ru: 'Взимаете ли вы плату за размещение?' },
  faq3A: { en: 'Competitive commission rates. No hidden fees.', uz: 'Raqobatbardosh komissiya stavkalari. Yashirin to\'lovlar yo\'q.', ru: 'Конкурентные комиссионные ставки. Никаких скрытых платежей.' },
  faq4Q: { en: 'How do I schedule a visit?', uz: 'Tashrifni qanday rejalashtirishim mumkin?', ru: 'Как запланировать визит?' },
  faq4A: { en: 'Click "Schedule a Visit" on the property page.', uz: 'Mulk sahifasidagi "Tashrifni rejalashtirish" tugmasini bosing.', ru: 'Нажмите "Запланировать визит" на странице недвижимости.' },
  faq5Q: { en: 'Can you help with financing?', uz: 'Moliyalashtirishda yordam bera olasizmi?', ru: 'Можете ли вы помочь с финансированием?' },
  faq5A: { en: 'Yes, we work with trusted mortgage lenders.', uz: 'Ha, biz ishonchli ipoteka kreditorlari bilan ishlaymiz.', ru: 'Да, мы работаем с надежными ипотечными кредиторами.' },
  faq6Q: { en: 'Is property available?', uz: 'Mulk mavjudmi?', ru: 'Недвижимость доступна?' },
  faq6A: { en: 'Listings are updated in real-time.', uz: 'Ro\'yxatlar real vaqtda yangilanadi.', ru: 'Списки обновляются в реальном времени.' },
  faq7Q: { en: 'Are agents licensed?', uz: 'Agentlar litsenziyaga egami?', ru: 'Имеют ли агенты лицензию?' },
  faq7A: { en: 'Yes, all agents are fully licensed.', uz: 'Ha, barcha agentlar to\'liq litsenziyaga ega.', ru: 'Да, все агенты имеют лицензию.' },
  faq8Q: { en: 'Where do you operate?', uz: 'Qayerda faoliyat yuritasiz?', ru: 'Где вы работаете?' },
  faq8A: { en: 'Sim City, Birmingham, Miami, NYC, etc.', uz: 'Sim City, Birmingem, Mayami, Nyu-York va boshqalar.', ru: 'Сим-Сити, Бирмингем, Майами, Нью-Йорк и др.' },
  // Property Types
  villa: { en: 'Villa', uz: 'Villa', ru: 'Вилла' },
  house: { en: 'House', uz: 'Hovli uy', ru: 'Дом' },
  loft: { en: 'Loft', uz: 'Loft', ru: 'Лофт' },
  condo: { en: 'Condo', uz: 'Kvartira', ru: 'Квартира' },
  mansion: { en: 'Mansion', uz: 'Qasr', ru: 'Особняк' },
  townhouse: { en: 'Townhouse', uz: 'Taunxaus', ru: 'Таунхаус' },
  // Description Template
  propertyDescriptionTemplate: {
    en: 'This stunning {type} offers the perfect blend of luxury and comfort. Featuring {beds} spacious bedrooms and {baths} modern bathrooms, this property spans {sqft} square feet of meticulously designed living space. The open-concept layout maximizes natural light and creates an inviting atmosphere perfect for both entertaining and everyday living. Located in the heart of {location}, you\'ll enjoy easy access to premium amenities, excellent schools, and vibrant community life.',
    uz: 'Ushbu ajoyib {type} hashamat va qulaylikning mukammal uyg\'unligini taklif etadi. {beds} ta keng yotoqxona va {baths} ta zamonaviy hammomni o\'z ichiga olgan ushbu mulk {sqft} kvadrat fut maydonga ega. Ochiq reja tabiiy yorug\'likni maksimal darajada oshiradi va ham mehmonlarni kutib olish, ham kundalik hayot uchun qulay muhit yaratadi. {location} markazida joylashgan bo\'lib, siz yuqori darajadagi qulayliklar, a\'lo maktablar va jo\'shqin jamoat hayotidan bahramand bo\'lasiz.',
    ru: 'Этот потрясающий {type} предлагает идеальное сочетание роскоши и комфорта. Включает {beds} просторных спальни и {baths} современные ванные комнаты, общая площадь составляет {sqft} квадратных футов. Открытая планировка максимизирует естественное освещение и создает уютную атмосферу. Расположенный в сердце {location}, вы получите легкий доступ к премиальным удобствам, отличным школам и яркой общественной жизни.'
  },
  // Reviews
  reviewQuote1: { en: "The service was impeccable. Found my dream home in weeks!", uz: "Xizmat a'lo darajada edi. Orzuyimdagi uyni bir necha hafta ichida topdim!", ru: "Сервис был безупречен. Нашел дом своей мечты за считанные недели!" },
  reviewName1: { en: "Sarah Johnson", uz: "Sara Jonson", ru: "Сара Джонсон" },
  reviewRole1: { en: "Homeowner", uz: "Uy egasi", ru: "Владелец дома" },
  reviewQuote2: { en: "Professional, dedicated, and knowledgeable. Highly recommended.", uz: "Professional, fidoyi va bilimli. Tavsiya qilaman.", ru: "Профессиональный, преданный делу и знающий. Настоятельно рекомендую." },
  reviewName2: { en: "Michael Chen", uz: "Maykl Chen", ru: "Майкл Чен" },
  reviewRole2: { en: "Investor", uz: "Investor", ru: "Инвестор" },
  reviewQuote3: { en: "Made the selling process so easy. Fast and efficient.", uz: "Sotish jarayonini juda osonlashtirdi. Tez va samarali.", ru: "Сделал процесс продажи таким легким. Быстро и эффективно." },
  reviewName3: { en: "Emma Davis", uz: "Emma Devis", ru: "Эмма Дэвис" },
  reviewRole3: { en: "First-time Buyer", uz: "Birinchi marta xaridor", ru: "Покупатель-новичок" },
  reviewQuote4: { en: "Great advice on investment properties. Returns are great.", uz: "Investitsiya mulk bo'yicha ajoyib maslahatlar. Daromadlar ajoyib.", ru: "Отличный совет по инвестиционной недвижимости. Доходность отличная." },
  reviewName4: { en: "James Wilson", uz: "Jeyms Uilson", ru: "Джеймс Уилсон" },
  reviewRole4: { en: "Seller", uz: "Sotuvchi", ru: "Продавец" },
  reviewQuote5: { en: "Friendly team that really cares about your needs.", uz: "Ehtiyojlaringiz haqida chin dildan qayg'uradigan do'stona jamoa.", ru: "Дружелюбная команда, которая действительно заботится о ваших потребностях." },
  reviewName5: { en: "Sofia Rodriguez", uz: "Sofiya Rodriges", ru: "София Родригес" },
  reviewRole5: { en: "Renter", uz: "Ijarachi", ru: "Арендатор" },
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}>({ lang: 'en', setLang: () => { }, t: (key: string) => key });

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key as keyof typeof translations]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}


const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'grey' | 'warm';
  setTheme: (theme: 'light' | 'dark' | 'grey' | 'warm') => void;
}>({ theme: 'warm', setTheme: () => { } });

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'grey' | 'warm'>('warm');

  useEffect(() => {
    document.documentElement.className = theme;
    // We can also set data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Define dynamic background/text based on theme for the main app wrapper
  // This will be used by the App component div
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

function useLanguage() {
  return useContext(LanguageContext);
}

// --- Data Management ---

interface Listing {
  id: number;
  images: string[];
  titleKey?: string;
  title?: string;
  locationKey?: string;
  location?: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  featured: boolean;
  category: string;
  city: string;
  type: 'rent' | 'sale' | 'buy';
  year?: number;
}

interface Blog {
  id: number;
  images: string[];
  category: string;
  titleKey?: string;
  title?: string;
  date: string;
  readTime: number;
  author?: string;
  content?: string;
  links?: { label: string, url: string }[];
}

interface Agent {
  id: number;
  image: string;
  name: string;
  roleKey?: string;
  role?: string;
  phone: string;
  email?: string;
}

interface DataContextType {
  listings: Listing[];
  blogs: Blog[];
  agents: Agent[];
  addListing: (item: Omit<Listing, 'id'>) => void;
  updateListing: (id: number, item: Partial<Listing>) => void;
  deleteListing: (id: number) => void;
  addBlog: (item: Omit<Blog, 'id'>) => void;
  updateBlog: (id: number, item: Partial<Blog>) => void;
  deleteBlog: (id: number) => void;
  addAgent: (item: Omit<Agent, 'id'>) => void;
  updateAgent: (id: number, item: Partial<Agent>) => void;
  deleteAgent: (id: number) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

function DataProvider({ children }: { children: React.ReactNode }) {
  // Initial Data (Moved from components)
  const initialListings: Listing[] = Array.from({ length: 50 }, (_, i) => {
    const cities = ['birmingham', 'san-francisco', 'miami', 'chicago', 'los-angeles', 'new-york'];
    const namesKey = ['familyHome', 'elegantCondo', 'palmMansion', 'urbanLoft', 'modernTownhouse', 'rusticFarmhouse', 'contemporaryHome'];
    const categories = ['residential', 'luxury', 'commercial'];
    const types = ['rent', 'sale', 'buy'] as const;
    const city = cities[i % cities.length];
    const category = categories[i % categories.length];
    const type = types[i % types.length];
    const titleKey = namesKey[i % namesKey.length];
    const price = 3000 + (i * 150);
    const locationKey = city === 'new-york' ? 'nyc' : city === 'san-francisco' ? 'sanFrancisco' : city === 'los-angeles' ? 'losAngeles' : city;
    const mainImg = `/featured-${(i % 5) + 1}.jpg`;

    return {
      id: i + 1,
      images: [mainImg, `/property-1.jpg`, `/property-2.jpg`, `/property-3.jpg`, `/featured-1.jpg`],
      titleKey: titleKey,
      locationKey: locationKey,
      price: `$${price}`,
      beds: 1 + (i % 5),
      baths: 1 + (i % 3),
      sqft: 1000 + (i * 50),
      featured: i % 7 === 0,
      category: category,
      city: city,
      type: type
    };
  });

  const initialBlogs: Blog[] = [
    { id: 1, images: ['/blog-1.jpg', '/blog-2.jpg', '/blog-3.jpg'], category: 'Investments', titleKey: 'blogInspection', date: 'Jan 15, 2026', readTime: 5, author: 'Sarah Johnson' },
    { id: 2, images: ['/blog-2.jpg', '/blog-3.jpg', '/blog-1.jpg'], category: 'Renovations', titleKey: 'blogTerminology', date: 'Jan 12, 2026', readTime: 4, author: 'Mike Smith' },
    { id: 3, images: ['/blog-3.jpg', '/blog-1.jpg', '/blog-2.jpg'], category: 'Market Trends', titleKey: 'blogFinancing', date: 'Jan 10, 2026', readTime: 6, author: 'Anna Lee' },
    { id: 4, images: ['/property-4.jpg'], category: 'Property Management', titleKey: 'blogInspection', date: 'Jan 8, 2026', readTime: 5 },
    { id: 5, images: ['/property-5.jpg'], category: 'Market Trends', titleKey: 'blogTerminology', date: 'Jan 5, 2026', readTime: 4 },
  ];

  const initialAgents: Agent[] = [
    { id: 1, image: '/agent-1.jpg', name: 'James Smith', roleKey: 'ceoFounder', phone: '+1 (555) 123-4567' },
    { id: 2, image: '/agent-2.jpg', name: 'David Johnson', roleKey: 'cfo', phone: '+1 (555) 234-5678' },
    { id: 3, image: '/agent-3.jpg', name: 'Michael Brown', roleKey: 'coo', phone: '+1 (555) 345-6789' },
    { id: 4, image: '/agent-4.jpg', name: 'Matt Dymon', roleKey: 'realEstateAgent', phone: '+1 (555) 456-7890' },
    { id: 5, image: '/agent-5.jpg', name: 'Sarah Chen', roleKey: 'realEstateAgent', phone: '+1 (555) 567-8901' },
    { id: 6, image: '/agent-6.jpg', name: 'Robert Wilson', roleKey: 'seniorAgent', phone: '+1 (555) 678-9012' },
  ];

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('listings');
      return saved ? JSON.parse(saved) : initialListings;
    } catch { return initialListings; }
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    try {
      const saved = localStorage.getItem('blogs');
      return saved ? JSON.parse(saved) : initialBlogs;
    } catch { return initialBlogs; }
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem('agents');
      return saved ? JSON.parse(saved) : initialAgents;
    } catch { return initialAgents; }
  });

  useEffect(() => { localStorage.setItem('listings', JSON.stringify(listings)); }, [listings]);
  useEffect(() => { localStorage.setItem('blogs', JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem('agents', JSON.stringify(agents)); }, [agents]);

  const addListing = (item: Omit<Listing, 'id'>) => {
    setListings(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateListing = (id: number, item: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...item } : l));
  };
  const deleteListing = (id: number) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const addBlog = (item: Omit<Blog, 'id'>) => {
    setBlogs(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateBlog = (id: number, item: Partial<Blog>) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...item } : b));
  };
  const deleteBlog = (id: number) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const addAgent = (item: Omit<Agent, 'id'>) => {
    setAgents(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateAgent = (id: number, item: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));
  };
  const deleteAgent = (id: number) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider value={{
      listings, blogs, agents,
      addListing, updateListing, deleteListing,
      addBlog, updateBlog, deleteBlog,
      addAgent, updateAgent, deleteAgent
    }}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  return useContext(DataContext);
}

// Page State Management
type PageType = 'home' | 'contact' | 'property-detail' | 'blog' | 'blog-detail' | 'faq' | 'listings' | 'admin';




// Navigation Component
function Navigation({ onNavigate, currentPage }: { onNavigate: (page: PageType) => void, currentPage: PageType }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('home'), page: 'home' as PageType },
    { id: 'about', label: t('about'), page: 'contact' as PageType },
    { id: 'properties', label: t('property'), page: 'listings' as PageType },
    { id: 'agents', label: t('agents'), page: 'contact' as PageType },
    { id: 'blog', label: t('blog'), page: 'blog' as PageType },
  ];

  const scrollToSection = (id: string, page: PageType) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);

    if (page === 'home') {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'bg-card/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}>
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-1">
              <span className={`text-2xl font-bold font-['Playfair_Display'] ${isScrolled || currentPage !== 'home' ? 'text-black' : 'text-white'}`}>
                Brixsa
              </span>
              <span className={`text-xs ${isScrolled || currentPage !== 'home' ? 'text-black' : 'text-white'}`}>®</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id, link.page)}
                  className={`text-sm font-medium underline-animation ${isScrolled || currentPage !== 'home' ? 'text-foreground' : 'text-white'
                    } ${currentPage === link.page ? 'after:w-full' : ''}`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => onNavigate('faq')}
                className={`text-sm font-medium underline-animation ${isScrolled || currentPage !== 'home' ? 'text-foreground' : 'text-white'
                  }`}
              >
                {t('faq')}
              </button>
            </div>

            {/* Right Side - Language & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-black/10 rounded-full p-1">
                {(['en', 'uz', 'ru'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${lang === l
                      ? 'bg-primary text-white'
                      : isScrolled || currentPage !== 'home' ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/20'
                      }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="btn-primary text-sm"
              >
                {t('contactUs')}
              </button>

              {/* Theme Toggle - Simple Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    const el = document.getElementById('theme-dropdown');
                    if (el) el.classList.toggle('hidden');
                  }}
                  className={`w-[100px] h-9 flex items-center justify-center gap-2 rounded-full text-xs font-medium shadow-sm transition-colors border ${isScrolled || currentPage !== 'home'
                    ? 'bg-card border-border text-foreground hover:bg-muted'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    }`}
                >
                  <div className={`w-3 h-3 rounded-full border border-white/40 ${theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-gray-900' : theme === 'grey' ? 'bg-zinc-500' : 'bg-amber-300'}`} />
                  <span className="capitalize">{theme === 'warm' ? 'Day' : theme}</span>
                </button>
                <div id="theme-dropdown" className="hidden absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                  {(['warm', 'light', 'dark', 'grey'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        document.getElementById('theme-dropdown')?.classList.add('hidden');
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${theme === t ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-muted'
                        }`}
                    >
                      <div className={`w-3 h-3 rounded-full border border-border ${t === 'light' ? 'bg-white' : t === 'dark' ? 'bg-gray-900' : t === 'grey' ? 'bg-zinc-500' : 'bg-amber-300'}`} />
                      <span className="capitalize">{t === 'warm' ? 'Day' : t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${isScrolled || currentPage !== 'home' ? 'text-foreground' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-black/95 transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id, link.page)}
              className="text-2xl text-white font-medium hover:text-primary transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate('faq'); setIsMobileMenuOpen(false); }}
            className="text-2xl text-white font-medium hover:text-primary transition-colors"
          >
            {t('faq')}
          </button>

          {/* Mobile Language Selector */}
          <div className="flex items-center gap-2 mt-4">
            {(['en', 'uz', 'ru'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${lang === l
                  ? 'bg-primary text-white'
                  : 'text-white border border-white/30 hover:bg-card/10'
                  }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}
            className="btn-primary mt-4"
          >
            {t('contactUs')}
          </button>
        </div>
      </div>
    </>
  );
}

// Hero Section
function HeroSection({ onSearch }: { onSearch: (filters: any) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState({
    city: '',
    category: '',
    type: '',
    query: ''
  });

  const handleSearch = () => {
    onSearch(localFilters);
    // Smooth scroll to properties
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ... previous animations ...
      gsap.fromTo('.hero-title span',
        { y: 80, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15, ease: 'expo.out', delay: 0.3 }
      );
      gsap.fromTo('.hero-search',
        { y: 100, opacity: 0, rotateX: 15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.8)', delay: 0.8 }
      );
      gsap.fromTo('.hero-scroll',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out', delay: 1.4 }
      );
      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        scale: 1.1,
        filter: 'blur(2px)',
      });
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
        y: -80,
        opacity: 0,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative h-screen overflow-hidden">
      <div className="hero-bg absolute inset-0 ken-burns">
        <img src="/hero-bg.jpg" alt="Luxury Home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="hero-content relative z-10 h-full flex flex-col justify-center items-center section-padding">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-['Playfair_Display'] leading-tight">
            <span className="inline-block">{t('heroExperience')}</span>{' '}
            <span className="inline-block">{t('heroLiving')}</span>
            <br />
            <span className="inline-block">{t('heroBeyond')}</span>{' '}
            <span className="inline-block">{t('heroLuxury')}</span>
          </h1>

          {/* Search Box - Matching Reference Design */}
          <div className="hero-search max-w-4xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Location / Category / Type - inline in one bar */}
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full">
                <Select onValueChange={(val) => setLocalFilters({ ...localFilters, city: val })}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none h-11 px-4 text-white data-[placeholder]:text-white/80 [&_svg]:text-white/60 focus-visible:ring-0">
                    <MapPin className="w-4 h-4 mr-1.5 text-white/70" />
                    <SelectValue placeholder={t('location')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birmingham">Birmingham</SelectItem>
                    <SelectItem value="san-francisco">San Francisco</SelectItem>
                    <SelectItem value="miami">{t('cityMiami')}</SelectItem>
                    <SelectItem value="chicago">{t('cityChicago')}</SelectItem>
                    <SelectItem value="los-angeles">{t('cityLosAngeles')}</SelectItem>
                    <SelectItem value="new-york">{t('cityNewYork')}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="w-px h-5 bg-white/30" />

                <Select onValueChange={(val) => setLocalFilters({ ...localFilters, category: val })}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none h-11 px-4 text-white data-[placeholder]:text-white/80 [&_svg]:text-white/60 focus-visible:ring-0">
                    <Home className="w-4 h-4 mr-1.5 text-white/70" />
                    <SelectValue placeholder={t('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">{t('residential')}</SelectItem>
                    <SelectItem value="commercial">{t('commercial')}</SelectItem>
                    <SelectItem value="luxury">{t('luxury')}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="w-px h-5 bg-white/30" />

                <Select onValueChange={(val) => setLocalFilters({ ...localFilters, type: val })}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none h-11 px-4 text-white data-[placeholder]:text-white/80 [&_svg]:text-white/60 focus-visible:ring-0">
                    <Tag className="w-4 h-4 mr-1.5 text-white/70" />
                    <SelectValue placeholder={t('type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">{t('buy')}</SelectItem>
                    <SelectItem value="rent">{t('rent')}</SelectItem>
                    <SelectItem value="sell">{t('sell')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input + Button - pill shaped */}
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full overflow-hidden">
                <div className="flex items-center pl-4 pr-2">
                  <Search className="w-4 h-4 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder={`${t('search')}...`}
                  className="bg-transparent border-0 outline-none h-11 px-2 text-white placeholder:text-white/60 text-sm w-[140px] sm:w-[180px]"
                  onChange={(e) => setLocalFilters({ ...localFilters, query: e.target.value })}
                />
                <button
                  onClick={handleSearch}
                  className="h-9 px-6 mr-1 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  {t('search')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-center">
          <p className="text-sm mb-2 opacity-80">{t('scrollToExplore')}</p>
          <ChevronDown className="w-6 h-6 mx-auto scroll-indicator" />
        </div>
      </div>
    </section>
  );
}

// Properties Section
function PropertiesSection({ onPropertyClick }: { onPropertyClick: (id: number) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { listings } = useData();
  const properties = listings.slice(0, 3); // Show first 3 listings

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.prop-title',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.prop-card',
        { y: 100, opacity: 0, rotateY: -10 },
        {
          y: 0, opacity: 1, rotateY: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: '.prop-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="prop-title text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] max-w-md">
            {t('moreThanProperties')}
          </h2>
          <button className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            {t('viewAllProperty')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="prop-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => onPropertyClick(property.id)}
              className="prop-card group bg-card rounded-lg overflow-hidden shadow-sm hover-lift cursor-pointer h-full"
            >
              <div className="img-zoom aspect-[4/3]">
                <img
                  src={property.images[0]}
                  alt={t(property.titleKey || '')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" /> {property.beds} {t('bedrooms')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" /> {property.baths} {t('bathrooms')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3 h-3" /> {property.sqft} {t('sqFt')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {property.title || (property.titleKey ? t(property.titleKey) : '')}
                </h3>
                <p className="text-muted-foreground text-sm">{property.location || (property.locationKey ? t(property.locationKey || '') : '')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.service-title',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.service-card',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: '.service-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      image: '/service-buying.jpg',
      title: t('startBuying'),
      description: t('serviceBuyingDesc'),
      cta: t('exploreProperties'),
    },
    {
      image: '/service-selling.jpg',
      title: t('startSelling'),
      description: t('serviceSellingDesc'),
      cta: t('getValuation'),
    },
    {
      image: '/service-renting.jpg',
      title: t('startRenting'),
      description: t('serviceRentingDesc'),
      cta: t('viewRentals'),
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="service-title text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] text-center mb-16">
          {t('tailoredSolutions')}
        </h2>

        <div className="service-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative rounded-lg overflow-hidden cursor-pointer"
              style={{ transform: `rotate(${index === 0 ? '-3' : index === 2 ? '3' : '0'}deg)` }}
            >
              <div className="aspect-[3/2] img-zoom">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm opacity-80 mb-4">{service.description}</p>
                <button className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  {service.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [clientsCount, setClientsCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-content',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo('.about-image',
        { x: 50, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        {
          x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      ScrollTrigger.create({
        trigger: '.about-stats',
        start: 'top 80%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 269,
            duration: 2,
            ease: 'expo.out',
            onUpdate: function () {
              setClientsCount(Math.floor(this.targets()[0].val));
            }
          });
          gsap.to({ val: 0 }, {
            val: 27,
            duration: 2,
            ease: 'expo.out',
            onUpdate: function () {
              setSalesCount(Math.floor(this.targets()[0].val));
            }
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="about-content">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-6 leading-tight">
              {t('weCreate')}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t('weCreateDesc')}
            </p>

            <div className="about-stats flex gap-12">
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-primary font-['Playfair_Display']">
                  {clientsCount}+
                </div>
                <p className="text-muted-foreground text-sm mt-2">{t('happyClients')}</p>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-primary font-['Playfair_Display']">
                  ${salesCount}M+
                </div>
                <p className="text-muted-foreground text-sm mt-2">{t('totalSales')}</p>
              </div>
            </div>
          </div>

          <div className="about-image relative">
            <img
              src="/about-image.jpg"
              alt="Luxury Property"
              className="w-full h-[500px] lg:h-[600px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { image: '/feature-1.jpg', title: t('smoothClosings'), description: t('smoothClosingsDesc') },
    { image: '/feature-2.jpg', title: t('localExperts'), description: t('localExpertsDesc') },
    { image: '/feature-3.jpg', title: t('verifiedListings'), description: t('verifiedListingsDesc') },
    { image: '/feature-4.jpg', title: t('support247'), description: t('support247Desc') },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] text-center mb-16">
          {t('whyChooseUs')}
        </h2>

        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={`feature-${index}`} className="feature-card group bg-card rounded-lg overflow-hidden shadow-sm hover-lift">
              <div className="aspect-[3/2] img-zoom">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Listings Section
function FeaturedListingsSection({
  onPropertyClick,
  filters,
  limit,
  pagination,
  onViewAll
}: {
  onPropertyClick: (id: number) => void,
  filters: any,
  limit?: number,
  pagination?: boolean,
  onViewAll?: () => void
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { listings } = useData();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.listing-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: '.listings-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filteredListings = listings.filter(item => {
    if (filters.city && item.city !== filters.city && filters.city !== 'all') return false;
    if (filters.category && item.category !== filters.category && filters.category !== 'all') return false;
    // Basic text search on title
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const title = (item.title || (item.titleKey ? t(item.titleKey) : '')).toLowerCase();
      if (!title.includes(q) && !item.price.includes(q)) return false;
    }
    return true;
  });

  let displayedListings = filteredListings;
  if (limit) {
    displayedListings = filteredListings.slice(0, limit);
  } else if (pagination) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    displayedListings = filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

  return (
    <section id="properties" ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display']">
            {t('featuredListings')}
          </h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="listings-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedListings.length > 0 ? displayedListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onPropertyClick(listing.id)}
              className={`listing-card group relative rounded-lg overflow-hidden cursor-pointer ${listing.featured ? 'md:row-span-2' : ''
                }`}
            >
              <div className={`img-zoom ${listing.featured ? 'h-full min-h-[400px]' : 'aspect-[4/3]'}`}>
                <img
                  src={listing.images[0]}
                  alt={t(listing.titleKey || '')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{listing.price}<span className="text-sm font-normal">/month</span></span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{listing.title || (listing.titleKey ? t(listing.titleKey) : '')}</h3>
                <p className="text-sm opacity-80 mb-2">{listing.location || (listing.locationKey ? t(listing.locationKey || '') : '')}</p>
                <div className="flex items-center gap-4 text-xs opacity-70">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" /> {listing.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" /> {listing.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3 h-3" /> {listing.sqft} {t('sqFt')}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-xl text-muted-foreground">{t('noResults') || 'No properties found matches your criteria.'}</p>
            </div>
          )}
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-lg bg-card text-muted-foreground hover:bg-muted disabled:opacity-50 flex items-center justify-center font-medium transition-colors"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${page === p ? 'bg-primary text-white' : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-lg bg-card text-muted-foreground hover:bg-muted disabled:opacity-50 flex items-center justify-center font-medium transition-colors"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}



// Agents Section - Updated with phone numbers
function AgentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { agents } = useData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.agent-card',
        { y: 60, opacity: 0, rotateY: 30 },
        {
          y: 0, opacity: 1, rotateY: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: '.agents-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="agents" ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display']">
            {t('ourAgents')}
          </h2>
          <button className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            {t('viewAllAgents')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="agents-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {agents.map((agent, index) => (
            <div key={index} className="agent-card group text-center">
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 img-zoom">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{agent.role || (agent.roleKey ? t(agent.roleKey) : '')}</p>
              <a
                href={`tel:${agent.phone}`}
                className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3" /> {agent.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [activeReview, setActiveReview] = useState(0);

  const reviews = [
    { id: 1, image: '/testimonial.jpg', quoteKey: 'reviewQuote1', nameKey: 'reviewName1', roleKey: 'reviewRole1' },
    { id: 2, image: '/agent-1.jpg', quoteKey: 'reviewQuote2', nameKey: 'reviewName2', roleKey: 'reviewRole2' },
    { id: 3, image: '/agent-2.jpg', quoteKey: 'reviewQuote3', nameKey: 'reviewName3', roleKey: 'reviewRole3' },
    { id: 4, image: '/agent-3.jpg', quoteKey: 'reviewQuote4', nameKey: 'reviewName4', roleKey: 'reviewRole4' },
    { id: 5, image: '/agent-5.jpg', quoteKey: 'reviewQuote5', nameKey: 'reviewName5', roleKey: 'reviewRole5' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-content',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);

    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [reviews.length]);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="testimonial-image relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            {reviews.map((review, index) => (
              <img
                key={review.id}
                src={review.image}
                alt="Happy Client"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === activeReview ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            ))}
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button
                onClick={() => setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                className="w-10 h-10 bg-card/90 hover:bg-card text-card-foreground rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveReview((prev) => (prev + 1) % reviews.length)}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-colors hover:opacity-90"
                aria-label="Next review"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="testimonial-content relative min-h-[300px] flex flex-col justify-center">
            <Quote className="w-16 h-16 text-primary/20 mb-6" />
            <div className="relative overflow-hidden">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`transition-all duration-700 absolute inset-0 ${index === activeReview
                    ? 'opacity-100 translate-y-0 relative'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                    }`}
                >
                  <blockquote className="text-2xl lg:text-3xl font-['Playfair_Display'] leading-relaxed mb-8">
                    "{t(review.quoteKey)}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-lg text-primary">{t(review.nameKey)}</p>
                    <p className="text-muted-foreground uppercase tracking-wide text-xs font-semibold">{t(review.roleKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReview(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeReview ? 'w-8 bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Blog Section (Homepage preview)
function BlogSection({ onViewAll }: { onViewAll: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { blogs } = useData();
  const articles = blogs.slice(0, 3); // Preview first 3

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.blog-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: '.blog-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="py-20 lg:py-32 section-padding bg-card relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">{t('ourJournal')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-6">
            Latest News & Trends
          </h2>
          <p className="text-muted-foreground">
            Stay informed with the latest insights, tips, and market trends from our real estate experts.
          </p>
        </div>

        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <div key={index} className="blog-card group cursor-pointer h-full flex flex-col">
              <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md aspect-[4/3]">
                <img
                  src={article.images[0]}
                  alt={t(article.titleKey || '')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-primary">
                  {article.category}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>5 min read</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {article.title || (article.titleKey ? t(article.titleKey) : '')}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                  Discover essential tips and strategies for {article.category.toLowerCase()} in today's dynamic real estate market.
                </p>
                <button className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wide hover:gap-3 transition-all mt-auto group/btn">
                  Read Article <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onViewAll}
            className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
          >
            {t('viewAllBlogs')}
          </button>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-20 lg:py-32">
      <div className="absolute inset-0">
        <img
          src="/cta-bg.jpg"
          alt="Luxury Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="cta-content max-w-3xl mx-auto text-center text-white">
          <p className="text-sm mb-4 opacity-80">{t('interested')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-8">
            {t('lookingToBuy')}
          </h2>
          <button
            onClick={() => onNavigate('contact')}
            className="btn-primary text-lg px-10 py-4"
          >
            {t('getInTouch')}
          </button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const footerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-col',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%' }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-background border-t border-border py-16 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="footer-col">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold font-['Playfair_Display']">Brixsa</span>
              <span className="text-xs">®</span>
            </button>
            <p className="text-muted-foreground text-sm mb-6">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="font-semibold mb-4">{t('navigation')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('home'), page: 'home' },
                { label: t('about'), page: 'home' },
                { label: t('property'), page: 'home' },
                { label: t('agents'), page: 'home' },
                { label: t('blog'), page: 'blog' },
                { label: t('contact'), page: 'contact' },
                { label: t('faq'), page: 'faq' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.page as PageType)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-gray-400 hover:text-primary transition-colors text-xs mt-4"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-semibold mb-4">{t('template')}</h4>
            <ul className="space-y-3">
              {['styleGuide', 'licenses', 'changelog', 'gsapInstructions', 'page404'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" /> (62) 1829017
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" /> hello@brixsa.com
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPinned className="w-4 h-4 mt-0.5" />
                2912 Meadowbrook Road,<br />Los Angeles, CA 90017
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">{t('allRightsReserved')}</p>
          <p className="text-muted-foreground text-sm">{t('poweredBy')}</p>
        </div>
      </div>
    </footer>
  );
}

// Blog Page - Full blog listing with Pagination
function BlogPage({ onNavigate, onBlogClick }: { onNavigate: (page: PageType) => void, onBlogClick: (id: number) => void }) {
  const { t } = useLanguage();
  const { blogs } = useData();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.blog-page-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
    );
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const displayedArticles = blogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="blog-page-content section-padding max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
        </button>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] mb-6 text-center">
          {t('ourJournal')}
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
          Insights, valueable information and news from real estate experts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => onBlogClick(article.id)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.images[0]}
                  alt={t(article.titleKey || '')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {t(article.titleKey || '')}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  Explore the key factors that influence property value and how you can maximize your investment returns.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-lg bg-card text-muted-foreground hover:bg-muted disabled:opacity-50 flex items-center justify-center font-medium transition-colors border"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors border ${page === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-lg bg-card text-muted-foreground hover:bg-muted disabled:opacity-50 flex items-center justify-center font-medium transition-colors border"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Blog Detail Page
function BlogDetailPage({ blogId, onNavigate }: { blogId: number, onNavigate: (page: PageType) => void }) {
  const { t } = useLanguage();
  const { blogs } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  const article = blogs.find(b => b.id === blogId) || blogs[0];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => onNavigate('blog')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('backToBlogs')}
        </button>

        <div className="mb-8 text-center">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-6 leading-tight">
            {article.title || (article.titleKey ? t(article.titleKey) : '')}
          </h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {article.readTime} min read</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12 rounded-2xl overflow-hidden">
          {article.images && article.images.length > 0 ? (
            <>
              <div className="col-span-2 aspect-[2/1]">
                <img src={article.images[0]} className="w-full h-full object-cover" alt="Main" />
              </div>
              {article.images[1] && (
                <div className="aspect-[4/3]">
                  <img src={article.images[1]} className="w-full h-full object-cover" alt="Detail 1" />
                </div>
              )}
              {article.images[2] && (
                <div className="aspect-[4/3]">
                  <img src={article.images[2]} className="w-full h-full object-cover" alt="Detail 2" />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-2 aspect-[2/1]">
              <img src={article.images && article.images[0] ? article.images[0] : '/blog-1.jpg'} className="w-full h-full object-cover" alt="Main" />
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none text-foreground/80 bg-card p-8 sm:p-12 rounded-2xl shadow-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Content coming soon...</p>' }} />
        </div>
      </article>
    </div>
  );
}

// FAQ Page
function FAQPage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.faq-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
    );
  }, []);

  const faqs = [
    { question: 'faq1Q', answer: 'faq1A' },
    { question: 'faq2Q', answer: 'faq2A' },
    { question: 'faq3Q', answer: 'faq3A' },
    { question: 'faq4Q', answer: 'faq4A' },
    { question: 'faq5Q', answer: 'faq5A' },
    { question: 'faq6Q', answer: 'faq6A' },
    { question: 'faq7Q', answer: 'faq7A' },
    { question: 'faq8Q', answer: 'faq8A' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="faq-content section-padding max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-4">
            {t('frequentlyAsked')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('faqDesc')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border-0 shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-5 text-left font-medium hover:no-underline hover:bg-muted transition-colors">
                {t(faq.question)}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-muted-foreground">
                {t(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">{t('stillHaveQuestions')}</p>
          <button
            onClick={() => onNavigate('contact')}
            className="btn-primary"
          >
            {t('contactUs')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Contact Page - Updated with design from screenshot
function ContactPage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = document.querySelector('.contact-content');
    if (el) {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="contact-content min-h-screen bg-background pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-6rem)]">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative">
          <img
            src="/service-buying.jpg"
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-8 left-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-white hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> {t('backToHome')}
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-primary text-white p-8 lg:p-16 flex flex-col justify-start overflow-y-auto">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> {t('backToHome')}
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-card/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">{t('thankYou')}</h3>
              <p className="text-white/80">{t('getBackSoon')}</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl lg:text-4xl font-bold font-['Playfair_Display'] mb-4 text-white">
                {t('shareYourInterest')}
              </h1>
              <p className="text-white/80 mb-8">
                {t('haveQuestions')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm mb-2 block text-white/80">{t('firstName')}</label>
                    <Input
                      placeholder={t('firstName')}
                      className="bg-card/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-white/80">{t('lastName')}</label>
                    <Input
                      placeholder={t('lastName')}
                      className="bg-card/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm mb-2 block text-white/80">{t('phoneNumber')}</label>
                    <Input
                      type="tel"
                      placeholder={t('phoneNumber')}
                      className="bg-card/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-white/80">{t('emailAddress')}</label>
                    <Input
                      type="email"
                      placeholder={t('emailAddress')}
                      className="bg-card/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block text-white/80">{t('message')}</label>
                  <Textarea
                    placeholder="Example Text"
                    className="bg-card/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="bg-card text-primary px-8 py-3 rounded font-medium hover:bg-card/90 transition-colors">
                  {t('submit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Property Detail Page
function PropertyDetailPage({ propertyId, onNavigate }: { propertyId: number, onNavigate: (page: PageType) => void }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { t } = useLanguage();
  const { listings } = useData();
  const property = listings.find(p => p.id === propertyId) || listings[0];
  const galleryImages = property.images && property.images.length > 0 ? property.images : ['/property-1.jpg', '/property-2.jpg', '/property-3.jpg', '/featured-1.jpg'];

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.property-detail',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
    );
  }, []);

  const amenities = [
    { icon: Car, label: t('garage') },
    { icon: Wind, label: t('airConditioning') },
    { icon: Thermometer, label: t('heating') },
    { icon: Droplets, label: t('swimmingPool') },
    { icon: Compass, label: t('gardenView') },
    { icon: Building2, label: t('securitySystem') },
    { icon: Trees, label: t('privateGarden') },
    { icon: Waves, label: t('waterfront') },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="property-detail section-padding max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToListings')}
        </button>

        {/* Gallery */}
        {/* Gallery */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-sm">
            <img
              src={galleryImages[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-['Playfair_Display'] mb-2">
                  {property.title}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {property.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{property.price}</p>
                <p className="text-sm text-muted-foreground">{property.price.includes('/') ? '/month' : ''}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <button
                onClick={() => setShowContactDialog(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> {t('scheduleTour')}
              </button>
              <button
                onClick={() => alert('Property saved to favorites!')}
                className="btn-secondary flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <Heart className="w-4 h-4" /> {t('save')}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="btn-secondary p-3 hover:bg-primary hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary p-3 hover:bg-primary hover:text-white transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="bg-card rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">{t('propertyDetails')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.beds}</p>
                  <p className="text-sm text-muted-foreground">{t('bedrooms')}</p>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.baths}</p>
                  <p className="text-sm text-muted-foreground">{t('bathrooms')}</p>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.sqft}</p>
                  <p className="text-sm text-muted-foreground">{t('sqFt')}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.year || 2024}</p>
                  <p className="text-sm text-muted-foreground">{t('yearBuilt')}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">{t('description')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {(t('propertyDescriptionTemplate') || 'Beautiful {type} in {location} with {beds} beds and {baths} baths.')
                  .replace('{type}', property.type ? property.type : 'Home')
                  .replace('{beds}', property.beds.toString())
                  .replace('{baths}', property.baths.toString())
                  .replace('{sqft}', property.sqft.toString())
                  .replace('{location}', property.location || 'Unknown')}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">{t('amenities')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <amenity.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Agent Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">{t('contactAgent')}</h3>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/agent-1.jpg"
                  alt="Agent"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">James Smith</p>
                  <p className="text-sm text-muted-foreground">Senior Real Estate Agent</p>
                  <a href="tel:+15551234567" className="text-xs text-primary flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactDialog(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> {t('message')}
                </button>
                <a
                  href="tel:+15551234567"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> {t('callAgent')}
                </a>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t('referenceId')}</p>
                <p className="font-mono text-sm">BRX-{property.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('scheduleTour')}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <Input placeholder={t('firstName')} />
            <Input type="email" placeholder={t('emailAddress')} />
            <Input type="tel" placeholder={t('phoneNumber')} />
            <Input type="date" />
            <Textarea placeholder={t('message')} />
            <button
              type="button"
              onClick={() => setShowContactDialog(false)}
              className="btn-primary w-full"
            >
              {t('requestTour')}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Home Page Component
function HomePage({
  onPropertyClick,
  onViewBlog,
  onSearch,
  filters,
  onViewAllListings
}: {
  onPropertyClick: (id: number) => void,
  onViewBlog: () => void,
  onSearch: (filters: any) => void,
  filters: any,
  onViewAllListings: () => void
}) {
  return (
    <>
      <HeroSection onSearch={onSearch} />
      <PropertiesSection onPropertyClick={onPropertyClick} />
      <ServicesSection />
      <AboutSection />
      <FeaturesSection />
      <FeaturedListingsSection
        onPropertyClick={onPropertyClick}
        filters={filters}
        limit={6}
        onViewAll={onViewAllListings}
      />

      <AgentsSection />
      <TestimonialsSection />
      <BlogSection onViewAll={onViewBlog} />
    </>
  );
}

// Image Array Input Helper
function ImageArrayInput({ images = [], onChange }: { images: string[], onChange: (images: string[]) => void }) {
  const [newItem, setNewItem] = useState('');
  const handleAdd = () => {
    if (newItem) {
      onChange([...images, newItem]);
      setNewItem('');
    }
  };
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input placeholder="Image URL" value={newItem} onChange={e => setNewItem(e.target.value)} />
        <button onClick={handleAdd} className="p-2 bg-gray-200 rounded hover:bg-gray-300"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative group w-20 h-20 bg-muted rounded overflow-hidden">
            <img src={img} className="w-full h-full object-cover" />
            <button onClick={() => handleRemove(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Page
function AdminPage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const { listings, blogs, agents, addListing, updateListing, deleteListing, addBlog, updateBlog, deleteBlog, addAgent, updateAgent, deleteAgent } = useData();
  const [activeTab, setActiveTab] = useState('listings');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ images: [], links: [] });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'listings') deleteListing(id);
      if (activeTab === 'blogs') deleteBlog(id);
      if (activeTab === 'agents') deleteAgent(id);
    }
  };

  const handleSave = () => {
    if (activeTab === 'listings') {
      const data = {
        ...formData,
        price: formData.price || '$0',
        beds: Number(formData.beds) || 0,
        baths: Number(formData.baths) || 0,
        sqft: Number(formData.sqft) || 0,
        featured: formData.featured || false,
        images: formData.images || ['/featured-1.jpg']
      };
      if (editingItem) updateListing(editingItem.id, data);
      else addListing(data);
    } else if (activeTab === 'blogs') {
      const data = {
        ...formData,
        readTime: Number(formData.readTime) || 5,
        images: formData.images || ['/blog-1.jpg'],
        date: formData.date || new Date().toLocaleDateString()
      };
      if (editingItem) updateBlog(editingItem.id, data);
      else addBlog(data);
    } else if (activeTab === 'agents') {
      const data = {
        ...formData,
        image: formData.image || '/agent-1.jpg'
      };
      if (editingItem) updateAgent(editingItem.id, data);
      else addAgent(data);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <AdminHeader onExit={() => onNavigate('home')} />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-card px-4 py-2 rounded-lg shadow-sm border">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
        </div>

        <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab} className="bg-card rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-muted p-1 rounded-lg">
              <TabsTrigger value="listings" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm"><LayoutDashboard className="w-4 h-4" /> Listings</TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm"><FileText className="w-4 h-4" /> Blogs</TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm"><UsersIcon className="w-4 h-4" /> Agents</TabsTrigger>
            </TabsList>
            <button onClick={handleCreate} className="bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          <TabsContent value="listings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(item => (
                <div key={item.id} className="border border-border rounded-xl p-4 flex gap-4 bg-card hover:shadow-lg transition-all duration-300 group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold truncate text-foreground mb-1">{item.title || item.titleKey}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="bg-muted px-2 py-0.5 rounded uppercase font-semibold tracking-wider">{item.type || 'Sale'}</span>
                      <span>{item.price}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blogs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(item => (
                <div key={item.id} className="border border-border rounded-xl p-4 flex gap-4 bg-card hover:shadow-lg transition-all duration-300 group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold truncate text-foreground mb-1">{item.title || item.titleKey}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(item => (
                <div key={item.id} className="border border-border rounded-xl p-4 flex gap-4 bg-card hover:shadow-lg transition-all duration-300 group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold truncate text-foreground mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.role}</p>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{editingItem ? 'Edit Item' : 'Create New Item'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 py-4">
              {activeTab === 'listings' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Property Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="Location" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input placeholder="Price (e.g. $4500)" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={formData.type || 'sale'} onValueChange={v => setFormData({ ...formData, type: v })}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="buy">Buy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Beds</label>
                      <Input type="number" placeholder="Beds" value={formData.beds || ''} onChange={e => setFormData({ ...formData, beds: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Baths</label>
                      <Input type="number" placeholder="Baths" value={formData.baths || ''} onChange={e => setFormData({ ...formData, baths: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sqft</label>
                      <Input type="number" placeholder="Sqft" value={formData.sqft || ''} onChange={e => setFormData({ ...formData, sqft: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Images (Max 5)</label>
                    <ImageArrayInput images={formData.images || []} onChange={imgs => setFormData({ ...formData, images: imgs })} />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="featured" className="w-4 h-4 text-primary rounded focus:ring-primary" checked={formData.featured || false} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                    <label htmlFor="featured" className="text-sm font-medium">Featured Listing</label>
                  </div>
                </>
              )}
              {activeTab === 'blogs' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Blog Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Investments">Investments</SelectItem>
                        <SelectItem value="Renovations">Renovations</SelectItem>
                        <SelectItem value="Market Trends">Market Trends</SelectItem>
                        <SelectItem value="Property Management">Property Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Images (Max 5)</label>
                    <ImageArrayInput images={formData.images || []} onChange={imgs => setFormData({ ...formData, images: imgs })} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Read Time (min)</label>
                    <Input type="number" placeholder="Read Time" value={formData.readTime || ''} onChange={e => setFormData({ ...formData, readTime: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea placeholder="Content (HTML or Text)" className="min-h-[200px]" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                  </div>
                </>
              )}
              {activeTab === 'agents' && (
                <>
                  <Input placeholder="Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <Input placeholder="Role" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                  <Input placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  <Input placeholder="Image URL" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border rounded text-muted-foreground hover:bg-muted">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium">Save Changes</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function AdminHeader({ onExit }: { onExit: () => void }) {
  // Suppress "unused" warning by using onExit conceptually or ignoring it if it was meant for future expansion
  // For now we just return null and don't render it, but use the prop in standard React pattern
  return (
    <div className="hidden">{onExit.toString()}</div>
  );
}

// Main App
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProperty, setSelectedProperty] = useState<number>(1);
  const [selectedBlog, setSelectedBlog] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState({});

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePropertyClick = (id: number) => {
    setSelectedProperty(id);
    setCurrentPage('property-detail');
  };

  const handleBlogClick = (id: number) => {
    setSelectedBlog(id);
    setCurrentPage('blog-detail');
  };

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  const handleViewAllListings = () => {
    setCurrentPage('listings');
    window.scrollTo(0, 0);
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <DataProvider>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />

            {currentPage === 'home' && (
              <>
                <HomePage
                  onPropertyClick={handlePropertyClick}
                  onViewBlog={() => handleNavigate('blog')}
                  onSearch={handleSearch}
                  filters={searchFilters}
                  onViewAllListings={handleViewAllListings}
                />
                <CTASection onNavigate={handleNavigate} />
                <Footer onNavigate={handleNavigate} />
              </>
            )}

            {currentPage === 'listings' && (
              <>
                <div className="pt-24 pb-8 bg-background">
                  <div className="section-padding max-w-7xl mx-auto">
                    <button
                      onClick={() => handleNavigate('home')}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                  </div>
                  <FeaturedListingsSection
                    onPropertyClick={handlePropertyClick}
                    filters={searchFilters}
                    pagination={true}
                  />
                </div>
                <Footer onNavigate={handleNavigate} />
              </>
            )}

            {currentPage === 'blog' && (
              <>
                <BlogPage onNavigate={handleNavigate} onBlogClick={handleBlogClick} />
                <Footer onNavigate={handleNavigate} />
              </>
            )}

            {currentPage === 'blog-detail' && (
              <>
                <BlogDetailPage blogId={selectedBlog} onNavigate={handleNavigate} />
                <Footer onNavigate={handleNavigate} />
              </>
            )}

            {currentPage === 'faq' && (
              <>
                <FAQPage onNavigate={handleNavigate} />
                <Footer onNavigate={handleNavigate} />
              </>
            )}

            {currentPage === 'contact' && (
              <ContactPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'property-detail' && (
              <PropertyDetailPage propertyId={selectedProperty} onNavigate={handleNavigate} />
            )}
            {currentPage === 'admin' && (
              <AdminPage onNavigate={handleNavigate} />
            )}

          </div>
        </DataProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
