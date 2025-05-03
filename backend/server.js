// --- ЯЗЫКОВЫЕ ДАННЫЕ (Дополнены) ---
const languages = {
    ru: {
        platform_title: "Jamoatchilik Qurilish - Гражданский Контроль",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Главная",
        nav_map: "Карта",
        nav_projects: "Проекты",
        nav_contractors: "Подрядчики",
        nav_public_reports: "Отчеты",
        nav_report: "Сообщить",
        landing_title: "Контролируйте строительство. Вместе.",
        landing_subtitle: "Платформа \"Jamoatchilik Qurilish\" — ваш инструмент для прозрачного мониторинга государственных инфраструктурных проектов в Узбекистане. Узнавайте бюджеты, следите за сроками и влияйте на качество.",
        landing_cta_projects: "Изучить проекты",
        landing_cta_report: "Сообщить о проблеме",
        landing_how_it_works_title: "Как это работает? Просто.",
        landing_how_step1_title: "Находите проекты",
        landing_how_step1_desc: "Используйте интерактивную карту или список для поиска строящихся или завершенных объектов рядом с вами.",
        landing_how_step2_title: "Изучайте детали",
        landing_how_step2_desc: "Получите доступ к информации о бюджете, сроках, подрядчике и официальной документации по каждому проекту.",
        landing_how_step3_title: "Делитесь наблюдениями",
        landing_how_step3_desc: "Заметили проблему? Отправьте фото или комментарий с геолокацией прямо через платформу.",
        landing_features_title: "Ключевые возможности",
        landing_feature1_title: "Полная прозрачность",
        landing_feature1_desc: "Вся информация о бюджетах, сроках, подрядчиках и документации в одном месте.",
        landing_feature2_title: "Гражданский мониторинг",
        landing_feature2_desc: "Возможность для каждого гражданина сообщать о реальном состоянии объектов.",
        landing_feature3_title: "AI-анализ отчетов",
        landing_feature3_desc: "Система анализирует данные от граждан и сравнивает их с официальными отчетами для выявления расхождений.",
        landing_feature4_title: "Рейтинг подрядчиков",
        landing_feature4_desc: "Публичный рейтинг компаний, основанный на качестве работ и отзывах граждан.",
        landing_benefits_title: "Польза для всех",
        landing_benefits_citizens_title: "Для Граждан",
        landing_benefits_citizens1: "Реальный контроль за расходованием бюджетных средств.",
        landing_benefits_citizens2: "Возможность влиять на качество инфраструктуры в своем городе.",
        landing_benefits_citizens3: "Удобный инструмент для обратной связи и сообщений о проблемах.",
        landing_benefits_gov_title: "Для Государства",
        landing_benefits_gov1: "Повышение эффективности расходования бюджетных средств.",
        landing_benefits_gov2: "Своевременное выявление проблемных объектов и недобросовестных подрядчиков.",
        landing_benefits_gov3: "Улучшение качества инфраструктуры и повышение доверия граждан.",
        landing_final_cta_title: "Присоединяйтесь к контролю!",
        landing_final_cta_desc: "Начните использовать платформу уже сегодня. Изучайте проекты в вашем районе или сообщите о проблеме, которую вы заметили.",
        landing_final_cta_map: "Посмотреть карту",
        landing_final_cta_report: "Сообщить о проблеме",
        map_title: "Интерактивная карта проектов",
        map_hint: "Нажмите на маркер для просмотра информации о проекте.",
        map_popup_status: "Статус",
        map_popup_budget: "Бюджет",
        map_popup_deadline: "Срок",
        map_popup_contractor: "Подрядчик",
        map_popup_docs: "Документация",
        map_popup_alert: "Внимание: Есть жалобы!",
        projects_title: "Список Инфраструктурных Проектов",
        projects_search_placeholder: "Поиск по названию или подрядчику...",
        projects_not_found: "Проекты не найдены.",
        project_status: "Статус",
        project_budget: "Бюджет",
        project_deadline: "Срок сдачи",
        project_contractor: "Подрядчик",
        project_rating: "Рейтинг",
        project_official_report: "Официальный отчет",
        project_docs_link: "Смотреть документацию",
        project_alert_serious: "Обнаружены серьезные расхождения с отчетами граждан!",
        project_alert_minor: "Поступили жалобы от граждан.",
        project_show_on_map: "Показать на карте",
        project_view_reports_link: "Посмотреть отчеты",
        contractors_title: "Рейтинг Подрядчиков",
        contractor_rating: "Рейтинг",
        contractor_projects_completed: "Завершено проектов",
        contractor_current_projects: "Текущие/завершенные проекты:",
        contractor_no_projects: "Нет информации о проектах",
        report_title: "Сообщить о состоянии объекта",
        report_subtitle: "Заметили проблему со строительством или состоянием объекта? Расскажите нам!",
        report_select_project: "Выберите проект:",
        report_select_placeholder: "-- Выберите проект --",
        report_comment_label: "Ваш комментарий:",
        report_comment_placeholder: "Опишите проблему (например, 'дорогу отремонтировали месяц назад, а уже ямы')",
        report_attach_photo: "Прикрепить фото:", // Изменено
        report_attach_hint: "Допустимые форматы: JPG, PNG, GIF, WEBP (макс. 10MB)", // Изменено
        report_geolocation_label: "Геолокация:", // Изменено
        report_geolocation_fetching: "Получение координат...",
        report_geolocation_success: "Координаты получены",
        report_geolocation_error: "Не удалось получить координаты. Отчет будет отправлен без них.",
        report_geolocation_permission_denied: "Доступ к геолокации запрещен.", // Добавлено
        report_geolocation_unavailable: "Информация о местоположении недоступна.", // Добавлено
        report_geolocation_timeout: "Время ожидания запроса геолокации истекло.", // Добавлено
        report_geolocation_unsupported: "Геолокация не поддерживается вашим браузером.",
        report_submit_button: "Отправить отчет",
        report_latest_reports: "Последние отчеты граждан:",
        report_no_reports: "Пока нет отчетов.",
        report_no_reports_for_project: "Нет отчетов для этого проекта.", // Новый ключ
        report_card_project: "Проект",
        report_card_comment: "Комментарий",
        report_card_date: "Дата",
        report_card_photo: "Фото",
        report_card_location: "Локация",
        report_card_unknown_project: "Неизвестный проект",
        public_reports_title: "Публичные отчеты граждан",
        public_reports_title_filtered: "Отчеты по проекту: {projectName}", // Новый ключ
        public_reports_show_all: "Показать все отчеты", // Новый ключ
        message_success: "Ваш отчет успешно отправлен!",
        message_error_form: "Пожалуйста, выберите проект и напишите комментарий.",
        message_docs_simulation: "Симуляция открытия документа:",
        footer_year: new Date().getFullYear(),
        footer_rights: "Все права защищены.",
        'Loading reports...': 'Загрузка отчетов...', // Ключ для индикатора загрузки
        'Submitting...': 'Отправка...', // Ключ для кнопки отправки
        'Error fetching data ({endpoint}): {message}': 'Ошибка загрузки данных ({endpoint}): {message}', // Ключ для ошибки загрузки
        'Error: Invalid coordinates for this project.': 'Ошибка: Неверные координаты для этого проекта.',
        'Error: Project not found.': 'Ошибка: Проект не найден.',
        'Error: Map not loaded yet.': 'Ошибка: Карта еще не загружена.',
        'Error: Project location data is missing or invalid.': 'Ошибка: Данные о местоположении проекта отсутствуют или неверны.',
        'Error submitting report. Please try again.': 'Ошибка отправки отчета. Пожалуйста, попробуйте еще раз.',
        'Failed to Load Application Data': 'Не удалось загрузить данные приложения',
        'Please check your connection and refresh the page.': 'Пожалуйста, проверьте соединение и обновите страницу.'
    },
    en: {
        platform_title: "Jamoatchilik Qurilish - Civic Control",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Home",
        nav_map: "Map",
        nav_projects: "Projects",
        nav_contractors: "Contractors",
        nav_public_reports: "Reports",
        nav_report: "Report Issue",
        landing_title: "Control Construction. Together.",
        landing_subtitle: "The \"Jamoatchilik Qurilish\" platform is your tool for transparent monitoring of state infrastructure projects in Uzbekistan. Find out budgets, track deadlines, and influence quality.",
        landing_cta_projects: "Explore Projects",
        landing_cta_report: "Report an Issue",
        landing_how_it_works_title: "How it works? Simple.",
        landing_how_step1_title: "Find Projects",
        landing_how_step1_desc: "Use the interactive map or list to search for ongoing or completed projects near you.",
        landing_how_step2_title: "Explore Details",
        landing_how_step2_desc: "Access information about the budget, deadlines, contractor, and official documentation for each project.",
        landing_how_step3_title: "Share Observations",
        landing_how_step3_desc: "Noticed a problem? Submit a photo or comment with geolocation directly through the platform.",
        landing_features_title: "Key Features",
        landing_feature1_title: "Full Transparency",
        landing_feature1_desc: "All information on budgets, deadlines, contractors, and documentation in one place.",
        landing_feature2_title: "Civic Monitoring",
        landing_feature2_desc: "Opportunity for every citizen to report on the actual condition of facilities.",
        landing_feature3_title: "AI Report Analysis",
        landing_feature3_desc: "The system analyzes citizen data and compares it with official reports to identify discrepancies.",
        landing_feature4_title: "Contractor Rating",
        landing_feature4_desc: "Public rating of companies based on the quality of work and citizen feedback.",
        landing_benefits_title: "Benefits for Everyone",
        landing_benefits_citizens_title: "For Citizens",
        landing_benefits_citizens1: "Real control over budget spending.",
        landing_benefits_citizens2: "Ability to influence the quality of infrastructure in your city.",
        landing_benefits_citizens3: "Convenient tool for feedback and reporting issues.",
        landing_benefits_gov_title: "For the Government",
        landing_benefits_gov1: "Increased efficiency of budget spending.",
        landing_benefits_gov2: "Timely identification of problematic projects and unreliable contractors.",
        landing_benefits_gov3: "Improved infrastructure quality and increased public trust.",
        landing_final_cta_title: "Join the Control!",
        landing_final_cta_desc: "Start using the platform today. Explore projects in your area or report a problem you've noticed.",
        landing_final_cta_map: "View Map",
        landing_final_cta_report: "Report an Issue",
        map_title: "Interactive Project Map",
        map_hint: "Click on a marker to view project information.",
        map_popup_status: "Status",
        map_popup_budget: "Budget",
        map_popup_deadline: "Deadline",
        map_popup_contractor: "Contractor",
        map_popup_docs: "Documentation",
        map_popup_alert: "Warning: Complaints received!",
        projects_title: "List of Infrastructure Projects",
        projects_search_placeholder: "Search by name or contractor...",
        projects_not_found: "Projects not found.",
        project_status: "Status",
        project_budget: "Budget",
        project_deadline: "Deadline",
        project_contractor: "Contractor",
        project_rating: "Rating",
        project_official_report: "Official Report",
        project_docs_link: "View Documentation",
        project_alert_serious: "Serious discrepancies found with citizen reports!",
        project_alert_minor: "Complaints received from citizens.",
        project_show_on_map: "Show on Map",
        project_view_reports_link: "View Reports",
        contractors_title: "Contractor Rating",
        contractor_rating: "Rating",
        contractor_projects_completed: "Projects Completed",
        contractor_current_projects: "Current/Completed Projects:",
        contractor_no_projects: "No project information available",
        report_title: "Report Object Condition",
        report_subtitle: "Noticed a problem with the construction or condition of an object? Tell us!",
        report_select_project: "Select project:",
        report_select_placeholder: "-- Select project --",
        report_comment_label: "Your comment:",
        report_comment_placeholder: "Describe the problem (e.g., 'the road was repaired a month ago, but there are already potholes')",
        report_attach_photo: "Attach photo:", // Changed
        report_attach_hint: "Allowed formats: JPG, PNG, GIF, WEBP (max 10MB)", // Changed
        report_geolocation_label: "Geolocation:", // Changed
        report_geolocation_fetching: "Getting coordinates...",
        report_geolocation_success: "Coordinates obtained",
        report_geolocation_error: "Failed to get coordinates. The report will be sent without them.",
        report_geolocation_permission_denied: "Geolocation access denied.", // Added
        report_geolocation_unavailable: "Location information is unavailable.", // Added
        report_geolocation_timeout: "Geolocation request timed out.", // Added
        report_geolocation_unsupported: "Geolocation is not supported by your browser.",
        report_submit_button: "Submit Report",
        report_latest_reports: "Latest Citizen Reports:",
        report_no_reports: "No reports yet.",
         report_no_reports_for_project: "No reports found for this project.", // New key
        report_card_project: "Project",
        report_card_comment: "Comment",
        report_card_date: "Date",
        report_card_photo: "Photo",
        report_card_location: "Location",
        report_card_unknown_project: "Unknown Project",
        public_reports_title: "Public Citizen Reports",
        public_reports_title_filtered: "Reports for project: {projectName}", // New key
        public_reports_show_all: "Show All Reports", // New key
        message_success: "Your report has been submitted successfully!",
        message_error_form: "Please select a project and write a comment.",
        message_docs_simulation: "Simulation of opening document:",
        footer_year: new Date().getFullYear(),
        footer_rights: "All rights reserved.",
        'Loading reports...': 'Loading reports...',
        'Submitting...': 'Submitting...',
        'Error fetching data ({endpoint}): {message}': 'Error fetching data ({endpoint}): {message}',
        'Error: Invalid coordinates for this project.': 'Error: Invalid coordinates for this project.',
        'Error: Project not found.': 'Error: Project not found.',
        'Error: Map not loaded yet.': 'Error: Map not loaded yet.',
        'Error: Project location data is missing or invalid.': 'Error: Project location data is missing or invalid.',
        'Error submitting report. Please try again.': 'Error submitting report. Please try again.',
        'Failed to Load Application Data': 'Failed to Load Application Data',
        'Please check your connection and refresh the page.': 'Please check your connection and refresh the page.'
    },
    uz: {
        platform_title: "Jamoatchilik Qurilish - Fuqarolik Nazorati",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Bosh sahifa",
        nav_map: "Xarita",
        nav_projects: "Loyihalar",
        nav_contractors: "Pudratchilar",
        nav_public_reports: "Hisobotlar",
        nav_report: "Xabar berish",
        landing_title: "Qurilishni nazorat qiling. Birgalikda.",
        landing_subtitle: "\"Jamoatchilik Qurilish\" platformasi — O'zbekistondagi davlat infratuzilma loyihalarining shaffof monitoringi uchun sizning vositangiz. Byudjetlarni bilib oling, muddatlarni kuzatib boring va sifatga ta'sir qiling.",
        landing_cta_projects: "Loyihalarni o'rganish",
        landing_cta_report: "Muammo haqida xabar berish",
        landing_how_it_works_title: "Qanday ishlaydi? Oddiy.",
        landing_how_step1_title: "Loyihalarni toping",
        landing_how_step1_desc: "Yaqiningizdagi qurilayotgan yoki tugallangan obyektlarni qidirish uchun interaktiv xarita yoki roʻyxatdan foydalaning.",
        landing_how_step2_title: "Tafsilotlarni o'rganing",
        landing_how_step2_desc: "Har bir loyiha bo'yicha byudjet, muddatlar, pudratchi va rasmiy hujjatlar haqidagi ma'lumotlarga ega bo'ling.",
        landing_how_step3_title: "Kuzatuvlaringizni baham ko'ring",
        landing_how_step3_desc: "Muammoni payqadingizmi? Geolokatsiya bilan fotosurat yoki izohni to'g'ridan-to'g'ri platforma orqali yuboring.",
        landing_features_title: "Asosiy imkoniyatlar",
        landing_feature1_title: "To'liq shaffoflik",
        landing_feature1_desc: "Byudjetlar, muddatlar, pudratchilar va hujjatlar haqidagi barcha ma'lumotlar bir joyda.",
        landing_feature2_title: "Fuqarolik monitoringi",
        landing_feature2_desc: "Har bir fuqaro uchun obyektlarning haqiqiy holati to'g'risida xabar berish imkoniyati.",
        landing_feature3_title: "AI-hisobot tahlili",
        landing_feature3_desc: "Tizim fuqarolardan olingan ma'lumotlarni tahlil qiladi va nomuvofiqliklarni aniqlash uchun ularni rasmiy hisobotlar bilan taqqoslaydi.",
        landing_feature4_title: "Pudratchilar reytingi",
        landing_feature4_desc: "Ish sifati va fuqarolarning fikr-mulohazalariga asoslangan kompaniyalarning ommaviy reytingi.",
        landing_benefits_title: "Hamma uchun foyda",
        landing_benefits_citizens_title: "Fuqarolar uchun",
        landing_benefits_citizens1: "Byudjet mablag'larining sarflanishi ustidan haqiqiy nazorat.",
        landing_benefits_citizens2: "O'z shahridagi infratuzilma sifatiga ta'sir qilish imkoniyati.",
        landing_benefits_citizens3: "Qayta aloqa va muammolar haqida xabar berish uchun qulay vosita.",
        landing_benefits_gov_title: "Davlat uchun",
        landing_benefits_gov1: "Byudjet mablag'larini sarflash samaradorligini oshirish.",
        landing_benefits_gov2: "Muammoli obyektlar va vijdonsiz pudratchilarni o'z vaqtida aniqlash.",
        landing_benefits_gov3: "Infratuzilma sifatini yaxshilash va fuqarolar ishonchini oshirish.",
        landing_final_cta_title: "Nazoratga qo'shiling!",
        landing_final_cta_desc: "Bugunoq platformadan foydalanishni boshlang. O'z hududingizdagi loyihalarni o'rganing yoki siz payqagan muammo haqida xabar bering.",
        landing_final_cta_map: "Xaritani ko'rish",
        landing_final_cta_report: "Muammo haqida xabar berish",
        map_title: "Loyihalarning interaktiv xaritasi",
        map_hint: "Loyiha ma'lumotlarini ko'rish uchun belgini bosing.",
        map_popup_status: "Holati",
        map_popup_budget: "Byudjet",
        map_popup_deadline: "Muddati",
        map_popup_contractor: "Pudratchi",
        map_popup_docs: "Hujjatlar",
        map_popup_alert: "Diqqat: Shikoyatlar mavjud!",
        projects_title: "Infratuzilma Loyihalari Ro'yxati",
        projects_search_placeholder: "Nomi yoki pudratchi bo'yicha qidirish...",
        projects_not_found: "Loyihalar topilmadi.",
        project_status: "Holati",
        project_budget: "Byudjet",
        project_deadline: "Topshirish muddati",
        project_contractor: "Pudratchi",
        project_rating: "Reyting",
        project_official_report: "Rasmiy hisobot",
        project_docs_link: "Hujjatlarni ko'rish",
        project_alert_serious: "Fuqarolar hisobotlari bilan jiddiy nomuvofiqliklar aniqlandi!",
        project_alert_minor: "Fuqarolardan shikoyatlar kelib tushdi.",
        project_show_on_map: "Xaritada ko'rsatish",
        project_view_reports_link: "Hisobotlarni ko'rish",
        contractors_title: "Pudratchilar Reytingi",
        contractor_rating: "Reyting",
        contractor_projects_completed: "Tugatilgan loyihalar",
        contractor_current_projects: "Joriy/tugallangan loyihalar:",
        contractor_no_projects: "Loyiha haqida ma'lumot yo'q",
        report_title: "Obyekt holati haqida xabar berish",
        report_subtitle: "Qurilish yoki obyekt holati bilan bog'liq muammoni payqadingizmi? Bizga xabar bering!",
        report_select_project: "Loyihani tanlang:",
        report_select_placeholder: "-- Loyihani tanlang --",
        report_comment_label: "Sizning izohingiz:",
        report_comment_placeholder: "Muammoni tavsiflang (masalan, 'yo'l bir oy oldin ta'mirlandi, lekin allaqachon chuqurlar paydo bo'ldi')",
        report_attach_photo: "Foto biriktirish:", // Changed
        report_attach_hint: "Ruxsat etilgan formatlar: JPG, PNG, GIF, WEBP (maks. 10MB)", // Changed
        report_geolocation_label: "Geolokatsiya:", // Changed
        report_geolocation_fetching: "Koordinatalar olinmoqda...",
        report_geolocation_success: "Koordinatalar olindi",
        report_geolocation_error: "Koordinatalarni olish imkoni bo'lmadi. Hisobot ularsiz yuboriladi.",
        report_geolocation_permission_denied: "Geolokatsiyaga ruxsat berilmadi.", // Added
        report_geolocation_unavailable: "Joylashuv ma'lumotlari mavjud emas.", // Added
        report_geolocation_timeout: "Geolokatsiya so'rovi vaqti tugadi.", // Added
        report_geolocation_unsupported: "Geolokatsiya sizning brauzeringiz tomonidan qo'llab-quvvatlanmaydi.",
        report_submit_button: "Hisobotni yuborish",
        report_latest_reports: "So'nggi fuqarolik hisobotlari:",
        report_no_reports: "Hozircha hisobotlar yo'q.",
        report_no_reports_for_project: "Ushbu loyiha uchun hisobotlar topilmadi.", // New key
        report_card_project: "Loyiha",
        report_card_comment: "Izoh",
        report_card_date: "Sana",
        report_card_photo: "Foto",
        report_card_location: "Joylashuv",
        report_card_unknown_project: "Noma'lum loyiha",
        public_reports_title: "Ommaviy fuqarolik hisobotlari",
        public_reports_title_filtered: "{projectName} loyihasi bo'yicha hisobotlar", // Yangi kalit
        public_reports_show_all: "Barcha hisobotlarni ko'rsatish", // Yangi kalit
        message_success: "Sizning hisobotingiz muvaffaqiyatli yuborildi!",
        message_error_form: "Iltimos, loyihani tanlang va izoh yozing.",
        message_docs_simulation: "Hujjat ochish simulyatsiyasi:",
        footer_year: new Date().getFullYear(),
        footer_rights: "Barcha huquqlar himoyalangan.",
         'Loading reports...': 'Hisobotlar yuklanmoqda...',
        'Submitting...': 'Yuborilmoqda...',
        'Error fetching data ({endpoint}): {message}': 'Maʼlumotlarni yuklashda xatolik ({endpoint}): {message}',
        'Error: Invalid coordinates for this project.': "Xatolik: Ushbu loyiha uchun noto'g'ri koordinatalar.",
        'Error: Project not found.': 'Xatolik: Loyiha topilmadi.',
        'Error: Map not loaded yet.': 'Xatolik: Xarita hali yuklanmagan.',
        'Error: Project location data is missing or invalid.': "Xatolik: Loyihaning joylashuvi ma'lumotlari yo'q yoki noto'g'ri.",
        'Error submitting report. Please try again.': 'Hisobot yuborishda xatolik. Qaytadan urinib ko‘ring.',
        'Failed to Load Application Data': 'Ilova maʼlumotlarini yuklab boʻlmadi',
        'Please check your connection and refresh the page.': 'Iltimos, ulanishni tekshiring va sahifani yangilang.'
    }
};

// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
const API_BASE_URL = ''; // Оставляем пустым, если фронтенд и бэкенд на одном домене/порту
// const API_BASE_URL = 'http://localhost:3000'; // Используйте, если развернуто на разных
let currentLanguage = 'ru';
let map;
let markers = {};
let allProjectsData = []; // Кеш данных проектов
let allContractorsData = []; // Кеш данных подрядчиков
let allReportsData = []; // Кеш данных отчетов


// --- ФУНКЦИИ ---

// Утилита для загрузки данных
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
        if (!response.ok) {
            // Пытаемся получить сообщение об ошибке от бэкенда
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) { /* Игнорируем ошибку парсинга JSON */ }
            const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        // Используем _() для перевода, если ключ существует
         showMessage(_('Error fetching data ({endpoint}): {message}', { endpoint: endpoint, message: error.message }) || `Error fetching data (${endpoint}): ${error.message}`, 'error', 5000);
        return []; // Возвращаем пустой массив при ошибке
    }
}

// --- Обновленная функция установки языка ---
async function setLanguage(lang) {
    if (!languages[lang]) { lang = 'ru'; }
    currentLanguage = lang;
    const langData = languages[lang];

    // Применяем переводы к элементам с data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        const text = langData[key] || key; // Текст или ключ как fallback

        // Особая обработка заголовка отфильтрованных отчетов
        if (el.id === 'public-reports-title' && text.includes('{projectName}')) {
            const currentText = el.textContent;
            if (currentText !== _('public_reports_title')) { // Проверяем, отфильтрован ли сейчас
                const match = currentText.match(/:\s*(.+)/); // Пытаемся извлечь имя проекта
                if (match && match[1]) {
                    el.textContent = _('public_reports_title_filtered', { projectName: match[1] });
                } else {
                     el.textContent = _('public_reports_title'); // Общий заголовок, если не удалось
                }
            } else {
                 el.textContent = _('public_reports_title'); // Общий заголовок
            }
        } else if (langData[key] !== undefined) {
            el.textContent = text;
        } else {
             console.warn(`Translation key "${key}" not found for lang "${lang}".`);
        }
    });

     // Применяем переводы к плейсхолдерам
     document.querySelectorAll('[data-lang-placeholder-key]').forEach(el => {
         const key = el.dataset.langPlaceholderKey;
         if (langData[key] !== undefined) { el.placeholder = langData[key]; }
         else { console.warn(`Placeholder key "${key}" not found for lang "${lang}".`); }
     });

    // Обновляем язык документа и заголовок
    document.documentElement.lang = lang;
    document.title = _('platform_title') || 'Jamoatchilik Qurilish';
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    localStorage.setItem('preferredLanguage', lang);

    // Перерисовываем компоненты с кешированными данными на новом языке
    displayProjectsInList();
    displayContractors();
    populateProjectSelect();
    displayCitizenReports(); // Обновляем список последних отчетов в секции отправки

    // Перерисовываем публичные отчеты. Проще всего показать все при смене языка.
    await displayPublicReports(null); // Показываем все публичные отчеты

    if (map) displayProjectsOnMap(); // Перерисовываем маркеры/попапы на карте
    updateFooterYear();
}

// --- Помощник для перевода ---
function _(key, args = null) {
    // Сначала проверяем наличие ключа в текущем языке
    let text = languages[currentLanguage]?.[key];

    // Если ключ не найден в текущем языке, пробуем найти его в английском как fallback
    if (text === undefined) {
        text = languages['en']?.[key];
    }

    // Если ключ не найден и в английском, используем сам ключ
    if (text === undefined) {
        text = key;
    }

    // Подставляем аргументы, если они есть
     if (args && typeof args === 'object' && typeof text === 'string') {
         for (const k in args) {
             // Используем RegExp для глобальной замены плейсхолдера
             const placeholder = new RegExp(`\\{${k}\\}`, 'g');
             text = text.replace(placeholder, args[k]);
         }
     }
    return text;
}


// --- Функции загрузки и кеширования данных ---
async function loadProjects() {
    allProjectsData = await fetchData('projects');
    // Убеждаемся, что подрядчики загружены, если они нужны для отображения проектов
    if (allContractorsData.length === 0) await loadContractors();
}
async function loadContractors() {
    allContractorsData = await fetchData('contractors');
}
async function loadReports(projectId = null) {
     const endpoint = projectId ? `reports?projectId=${projectId}` : 'reports';
     const fetchedReports = await fetchData(endpoint);
     // Сортируем отчеты по дате (сначала новые) после загрузки
     allReportsData = fetchedReports.sort((a, b) => new Date(b.date) - new Date(a.date));
}

 async function loadInitialData() {
     // Загружаем параллельно, где возможно
     await Promise.all([
         loadProjects(), // Загружает и подрядчиков, если нужно
         loadReports()     // Загружаем все отчеты изначально
     ]);
     // Дополнительная проверка на случай, если loadProjects не вызвал loadContractors
     if(allContractorsData.length === 0) await loadContractors();
 }


// --- Помощники для получения имени/рейтинга подрядчика и имени проекта ---
function getContractorName(contractorId) {
    const contractor = allContractorsData.find(c => String(c.id) === String(contractorId));
    return contractor ? contractor.name : _('report_card_unknown_project');
}
function getContractorRating(contractorId) {
    const contractor = allContractorsData.find(c => String(c.id) === String(contractorId));
     return contractor && typeof contractor.rating === 'number' ? contractor.rating.toFixed(1) : 'N/A';
}
function getProjectName(projectId) {
    const project = allProjectsData.find(p => String(p.id) === String(projectId));
    return project ? project.name : _('report_card_unknown_project');
}

// --- Инициализация карты ---
function initializeMap() {
    if (map) { map.remove(); map = null; } // Удаляем предыдущий экземпляр карты
     map = L.map('map').setView([41.3111, 69.2797], 12); // Центр Ташкента по умолчанию
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
     }).addTo(map);
     markers = {}; // Сбрасываем объект маркеров
     displayProjectsOnMap(); // Отображаем проекты (уже загруженные)
}

// --- Отображение проектов на карте ---
function displayProjectsOnMap() {
    if (!map || !Array.isArray(allProjectsData)) return;

    // Очищаем существующие маркеры с карты и из объекта
    Object.values(markers).forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
     });
    markers = {};

    if (allProjectsData.length === 0) {
         console.warn("Нет данных о проектах для отображения на карте.");
         return;
    }

    allProjectsData.forEach(project => {
        if (!project.location || !Array.isArray(project.location) || project.location.length !== 2) {
            console.warn(`Проект ${project.id} (${project.name || 'Без имени'}) имеет неверные данные геолокации.`);
            return; // Пропускаем проекты с неверной геолокацией
        }

        const lat = parseFloat(project.location[0]);
        const lon = parseFloat(project.location[1]);

         if (isNaN(lat) || isNaN(lon)) {
             console.warn(`Проект ${project.id} (${project.name || 'Без имени'}) имеет нечисловые координаты.`);
             return;
         }

        const marker = L.marker([lat, lon]);

        // Базовая очистка имени проекта от HTML
        const safeProjectName = project.name ? project.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : _('Unnamed Project'); // Добавлен перевод

        const popupContent = `
            <div class="text-xs p-1">
                <b class="text-sm block mb-1">${safeProjectName}</b>
                <b>${_('map_popup_status')}:</b> ${project.status || 'N/A'}<br>
                <b>${_('map_popup_budget')}:</b> ${project.budget || 'N/A'}<br>
                <b>${_('map_popup_deadline')}:</b> ${project.deadline || 'N/A'}<br>
                <b>${_('map_popup_contractor')}:</b> ${getContractorName(project.contractorId)}<br>
                <a href="#" onclick="alert('${_('message_docs_simulation')} ${project.docs || _('No document specified')}')" class="text-blue-600 hover:underline">${_('map_popup_docs')}</a>
                ${project.citizenAlertLevel > 0 ? `<br><b class="text-red-600 mt-1 block">${_('map_popup_alert')}</b>` : ''}
            </div>`;
        marker.bindPopup(popupContent, {minWidth: 200});
        marker.addTo(map);
         markers[String(project.id)] = marker; // Используем строковый ID для согласованности
    });
}


// --- Отображение списка проектов ---
function displayProjectsInList(filteredProjects = null) {
    const projectList = document.getElementById('project-list');
    const projectsToDisplay = filteredProjects !== null ? filteredProjects : allProjectsData;
    projectList.innerHTML = '';

    if (!Array.isArray(projectsToDisplay) || projectsToDisplay.length === 0) {
        projectList.innerHTML = `<p class="text-gray-500 italic p-4">${_('projects_not_found')}</p>`;
        return;
    }

    projectsToDisplay.forEach(project => {
         const alertClass = project.citizenAlertLevel === 2 ? 'border-red-400 bg-red-50/50' : (project.citizenAlertLevel === 1 ? 'border-yellow-400 bg-yellow-50/50' : 'border-gray-200');
         const alertTextKey = project.citizenAlertLevel === 2 ? 'project_alert_serious' : (project.citizenAlertLevel === 1 ? 'project_alert_minor' : null);
        let alertHtml = '';

         if (alertTextKey) {
             const alertTextColor = project.citizenAlertLevel === 2 ? 'text-red-700' : 'text-yellow-700';
             const alertBgColor = project.citizenAlertLevel === 2 ? 'bg-red-100' : 'bg-yellow-100';
             const viewReportsLink = `<a href="#" onclick="showProjectReports('${String(project.id)}'); return false;" class="ml-2 text-blue-600 hover:underline font-medium">${_('project_view_reports_link')}</a>`;
             alertHtml = `<div class="text-xs font-semibold ${alertTextColor} mt-2 p-2 rounded-md ${alertBgColor}">${_(alertTextKey)} ${viewReportsLink}</div>`;
         }

         const formattedDeadline = project.deadline || 'N/A';

        const projectCard = `
            <div class="list-card ${alertClass}">
                <h3>${project.name || _('Unnamed Project')}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
                     <p><span class="font-medium">${_('project_status')}:</span> ${project.status || 'N/A'}</p>
                     <p><span class="font-medium">${_('project_budget')}:</span> ${project.budget || 'N/A'}</p>
                     <p><span class="font-medium">${_('project_deadline')}:</span> ${formattedDeadline}</p>
                     <p><span class="font-medium">${_('project_contractor')}:</span> ${getContractorName(project.contractorId)} (${_('project_rating')}: ${getContractorRating(project.contractorId)} ★)</p>
                </div>
                 <p class="text-xs text-gray-600 mt-1 mb-2"><span class="font-medium">${_('project_official_report')}:</span> <span class="italic">${project.officialReport || 'N/A'}</span></p>
                <div class="flex items-center space-x-4 mt-3">
                    <a href="#" onclick="alert('${_('message_docs_simulation')} ${project.docs || _('No docs')}')" class="text-xs text-blue-600 hover:underline font-medium">${_('project_docs_link')}</a>
                     <button onclick="focusProjectOnMap('${String(project.id)}')" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 mr-1"><path fill-rule="evenodd" d="M8.5 4.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM5.75 6.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM4 10a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 014 10z" clip-rule="evenodd"></path></svg> ${_('project_show_on_map')}
                    </button>
                 </div>
                 ${alertHtml}
            </div>`;
        projectList.innerHTML += projectCard;
    });
}

// --- Фокусировка на проекте на карте ---
function focusProjectOnMap(projectId) {
     const projectIdStr = String(projectId);
     const project = allProjectsData.find(p => String(p.id) === projectIdStr);

     if (project && map && project.location && Array.isArray(project.location) && project.location.length === 2) {
         const lat = parseFloat(project.location[0]);
         const lon = parseFloat(project.location[1]);

         if (!isNaN(lat) && !isNaN(lon)) {
            showSection('map-section', false);
            map.flyTo([lat, lon], 16);

            // Убеждаемся, что маркер существует
             if (markers[projectIdStr]) {
                setTimeout(() => {
                    if (markers[projectIdStr] && map.hasLayer(markers[projectIdStr])) {
                        markers[projectIdStr].openPopup();
                    }
                 }, 500);
             } else {
                  console.warn(`Маркер для проекта ${projectIdStr} не найден.`);
             }
         } else {
             console.warn(`Невозможно сфокусироваться на проекте ${projectIdStr}: Неверные координаты.`);
              showMessage(_('Error: Invalid coordinates for this project.'), 'error');
         }
     } else if (!project) {
          console.warn(`Невозможно сфокусироваться: Проект с ID ${projectIdStr} не найден.`);
          showMessage(_('Error: Project not found.'), 'error');
     } else if (!map) {
         console.warn(`Невозможно сфокусироваться: Карта не инициализирована.`);
         showMessage(_('Error: Map not loaded yet.'), 'error');
     } else {
          console.warn(`Невозможно сфокусироваться на проекте ${projectIdStr}: Отсутствуют или неверные данные геолокации.`);
          showMessage(_('Error: Project location data is missing or invalid.'), 'error');
     }
}


// --- Отображение подрядчиков ---
function displayContractors() {
    const contractorList = document.getElementById('contractor-list');
    contractorList.innerHTML = '';

    if (!Array.isArray(allContractorsData) || allContractorsData.length === 0) {
        contractorList.innerHTML = `<p class="text-gray-500 italic p-4">${_('contractor_no_projects')}</p>`;
        return;
    }

    // Сортируем по рейтингу (сначала высокий)
    const sortedContractors = [...allContractorsData].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    sortedContractors.forEach(contractor => {
         const contractorProjects = allProjectsData.filter(p => String(p.contractorId) === String(contractor.id));
        const projectListItems = contractorProjects.length > 0
            ? contractorProjects.map(p => `<li class="text-xs">${p.name || _('Unnamed Project')} (${p.status || 'N/A'})</li>`).join('')
            : `<li class="text-xs italic">${_('contractor_no_projects')}</li>`;

         const contractorRatingDisplay = getContractorRating(contractor.id); // Используем помощника

        const contractorCard = `
            <div class="list-card">
                <h3>${contractor.name || _('Unnamed Contractor')}</h3>
                 <p class="text-xs text-gray-600 mt-1 mb-1"><span class="font-medium">${_('contractor_rating')}:</span> <span class="font-bold text-yellow-500">${contractorRatingDisplay} ★</span></p>
                <p class="text-xs text-gray-600 mb-2"><span class="font-medium">${_('contractor_projects_completed')}:</span> ${contractor.projectsCompleted || 0}</p>
                <div class="mt-2 border-t border-gray-100 pt-2">
                    <h4 class="text-xs font-semibold text-gray-700 mb-1">${_('contractor_current_projects')}</h4>
                    <ul class="list-disc list-inside text-xs space-y-0.5 pl-2">
                        ${projectListItems}
                    </ul>
                </div>
            </div>`;
        contractorList.innerHTML += contractorCard;
    });
}


// --- Заполнение выпадающего списка проектов ---
function populateProjectSelect() {
    const selectElement = document.getElementById('report-project');
    const currentValue = selectElement.value;
    selectElement.innerHTML = '';

    // Добавляем опцию-плейсхолдер
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = _('report_select_placeholder');
    placeholderOption.selected = !currentValue; // Выбрана, если ничего не было выбрано ранее
    placeholderOption.disabled = false; // Разрешаем выбрать сначала
    selectElement.appendChild(placeholderOption);

    if (!Array.isArray(allProjectsData) || allProjectsData.length === 0) {
        console.warn("Нет проектов для заполнения выпадающего списка.");
        return;
    }

    // Сортируем проекты по имени
    const sortedProjects = [...allProjectsData].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    sortedProjects.forEach(project => {
        const option = document.createElement('option');
         option.value = project.id;
        option.textContent = project.name || _('Unnamed Project');
         option.selected = String(project.id) === currentValue; // Восстанавливаем выбор
        selectElement.appendChild(option);
    });

    // Отключаем плейсхолдер, если выбран валидный проект
    if (selectElement.value !== "") {
         placeholderOption.disabled = true;
     }
    // Добавляем слушатель, чтобы отключить плейсхолдер после первого выбора
     selectElement.addEventListener('change', function() {
         const placeholder = this.querySelector('option[value=""]');
         if(this.value !== "" && placeholder) {
             placeholder.disabled = true;
         }
     }, { once: true }); // Сработает только один раз
}


// --- Отображение ПОСЛЕДНИХ отчетов граждан (в секции отправки отчета) ---
function displayCitizenReports() {
    const reportsList = document.getElementById('reports-list');
    reportsList.innerHTML = '';

    if (!Array.isArray(allReportsData) || allReportsData.length === 0) {
        reportsList.innerHTML = `<p class="text-gray-500 italic text-sm">${_('report_no_reports')}</p>`;
        return;
    }

    // Берем 5 самых свежих отчетов (данные уже отсортированы на бэке или в loadReports)
    const recentReports = allReportsData.slice(0, 5);

    recentReports.forEach(report => {
        const projectName = getProjectName(report.projectId);
         // Форматируем дату/время согласно локали пользователя
         const formattedDate = report.date ? new Date(report.date).toLocaleString(_('locale_code', 'ru-RU'), { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
         const locationText = report.location ? ` | <span class="whitespace-nowrap">${_('report_card_location')}: ${report.location.lat.toFixed(4)}, ${report.location.lon.toFixed(4)}</span>` : '';
        // Отображаем реальное фото, если оно есть
        const photoHtml = report.photoPath
             ? `<div class="mt-2"><a href="${report.photoPath}" target="_blank" title="${_('report_card_photo')}"><img src="${report.photoPath}" alt="${_('report_card_photo')} for ${projectName}" class="max-h-32 max-w-full rounded border border-gray-200 shadow-sm" loading="lazy"></a></div>`
             : '';

        const reportElement = `
            <div class="border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                <p class="text-sm font-medium text-gray-800 mb-0.5">${projectName}</p>
                <p class="text-sm text-gray-700 mb-1 break-words">${report.comment || ''}</p>
                 ${photoHtml}
                 <p class="text-xs text-gray-500 mt-1"><span class="whitespace-nowrap">${_('report_card_date')}: ${formattedDate}</span>${locationText}</p>
            </div>`;
        reportsList.innerHTML += reportElement;
    });
}

// --- Отображение ВСЕХ/ОТФИЛЬТРОВАННЫХ публичных отчетов (отдельная секция) ---
async function displayPublicReports(filterProjectId = null) {
    const publicReportsList = document.getElementById('public-reports-list');
    const reportsTitleElement = document.getElementById('public-reports-title');
    const showAllButton = document.getElementById('show-all-reports-button');
    publicReportsList.innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading reports...')}</p>`; // Индикатор загрузки

    let isFiltered = false;
    let reportsToDisplay = [];

    // Загружаем отчеты (все или отфильтрованные)
     await loadReports(filterProjectId);
     reportsToDisplay = allReportsData; // Используем свежие, отсортированные данные

    // Обновляем заголовок и видимость кнопки
    if (filterProjectId !== null) {
         isFiltered = true;
         const project = allProjectsData.find(p => String(p.id) === String(filterProjectId));
         const projectName = project ? project.name : `ID ${filterProjectId}`;
         reportsTitleElement.textContent = _('public_reports_title_filtered', { projectName: projectName });
         showAllButton.classList.remove('hidden');
     } else {
         reportsTitleElement.textContent = _('public_reports_title');
         showAllButton.classList.add('hidden');
     }

    // Отображаем отчеты
    publicReportsList.innerHTML = ''; // Очищаем индикатор
    if (!Array.isArray(reportsToDisplay) || reportsToDisplay.length === 0) {
         const messageKey = isFiltered ? 'report_no_reports_for_project' : 'report_no_reports';
         publicReportsList.innerHTML = `<p class="text-gray-500 italic p-4">${_(messageKey)}</p>`;
         return;
    }

    reportsToDisplay.forEach(report => { // Данные уже отсортированы
         const projectName = getProjectName(report.projectId);
         const formattedDate = report.date ? new Date(report.date).toLocaleString(_('locale_code', 'ru-RU'), { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';

         // Иконки (убедитесь, что SVG или классы иконок соответствуют вашей верстке)
         const dateIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M4 1.75a.75.75 0 01.75-.75h6.5a.75.75 0 01.75.75V3h1.75A1.75 1.75 0 0115.5 4.75v8.5A1.75 1.75 0 0113.75 15H2.25A1.75 1.75 0 01.5 13.25v-8.5A1.75 1.75 0 012.25 3H4V1.75zM2 6.25v7A.25.25 0 002.25 13.5h11.5a.25.25 0 00.25-.25v-7H2zM14 4.75a.25.25 0 00-.25-.25H2.25a.25.25 0 00-.25.25V5h12V4.75z" clip-rule="evenodd"></path></svg>`;
         const projectIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path d="M3.75 2a.75.75 0 00-1.5 0v12c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V8.75a.75.75 0 00-1.5 0v4.5h-9v-11h3V2H3.75z"></path><path d="M8.75 2a.75.75 0 000 1.5h3.56l-7.22 7.22a.75.75 0 101.06 1.06L13.5 4.31V7.75a.75.75 0 001.5 0V2.75a.75.75 0 00-.75-.75H8.75z"></path></svg>`;
         // const photoIcon = `...`; // Иконка фото не нужна, если показываем само фото
         const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M8 1.75a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.5A.75.75 0 018 1.75zM4.75 4.5a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zM10.75 8a.75.75 0 01-.75.75H6a.75.75 0 010-1.5h4a.75.75 0 01.75.75zM8 11.75a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75z" clip-rule="evenodd"></path><path d="M3.75 0A1.75 1.75 0 002 1.75v12.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 14.25V1.75A1.75 1.75 0 0012.25 0h-8.5zM3.5 1.75c0-.138.112-.25.25-.25h8.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25V1.75z"></path></svg>`;

         const locationHtml = report.location ? `<span class="whitespace-nowrap flex items-center">${locationIcon}${_('report_card_location')}: ${report.location.lat.toFixed(4)}, ${report.location.lon.toFixed(4)}</span>` : '';
        const photoHtml = report.photoPath
             ? `<div class="mt-2"><a href="${report.photoPath}" target="_blank" title="${_('report_card_photo')}"><img src="${report.photoPath}" alt="${_('report_card_photo')} for ${projectName}" class="max-h-48 max-w-full rounded border border-gray-300 shadow-sm hover:shadow-md transition-shadow" loading="lazy"></a></div>`
             : '';

         const reportCard = `
            <div class="list-card">
                <h4>${_('report_card_comment')}:</h4>
                <p class="text-gray-800 mb-2 break-words">${report.comment || ''}</p>
                ${photoHtml}
                <div class="report-card-meta flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                     <span class="whitespace-nowrap flex items-center">${dateIcon}${_('report_card_date')}: ${formattedDate}</span>
                     <span class="whitespace-nowrap flex items-center">${projectIcon}${_('report_card_project')}: ${projectName}</span>
                     ${locationHtml || ''} {/* Отображаем только если есть */}
                 </div>
            </div>`;
        publicReportsList.innerHTML += reportCard;
    });
}


// --- Логика переключения секций ---
async function showSection(sectionId, forceRefreshReports = false) { // forceRefreshReports используется для вкладки "Отчеты"
    document.querySelectorAll('.content-section').forEach(section => {
         if (!section.classList.contains('hidden')) {
             section.classList.add('hidden');
             section.style.opacity = 0;
             section.style.transform = 'translateY(10px)';
         }
    });

    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
         sectionToShow.classList.remove('hidden');
         requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                 sectionToShow.style.opacity = 1;
                 sectionToShow.style.transform = 'translateY(0)';
              });
         });
    }

    // Обновляем активную вкладку
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('tab-active');
        if (tab.dataset.section === sectionId) {
            tab.classList.add('tab-active');
        }
    });

     // Действия при открытии конкретной секции
    switch (sectionId) {
        case 'map-section':
            if (!map) {
                initializeMap();
            } else {
                 setTimeout(() => { if(map) map.invalidateSize() }, 10); // Обновляем размер карты
            }
            break;
         case 'projects-section':
             displayProjectsInList(); // Перерисовываем список проектов
             break;
         case 'contractors-section':
             displayContractors(); // Перерисовываем список подрядчиков
             break;
         case 'citizen-reports-public-section':
             // Если перешли через главную вкладку (forceRefreshReports=true), показываем все.
             // Если перешли по ссылке из проекта, displayPublicReports вызовется позже из showProjectReports.
             // Если просто обновили страницу на этой вкладке, тоже покажем все.
              await displayPublicReports(forceRefreshReports ? null : undefined);
             break;
         case 'report-section':
             populateProjectSelect(); // Обновляем список проектов в форме
             displayCitizenReports(); // Показываем последние отчеты под формой
             getGeolocation();      // Запрашиваем геолокацию при открытии формы
             break;
    }

    // Скролл вверх, кроме карты
    if (sectionId !== 'map-section') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }
     closeMobileMenu(); // Закрываем мобильное меню при смене секции
}

// --- Показ отчетов по конкретному проекту ---
function showProjectReports(projectId) {
    const projectIdStr = String(projectId);
    // Сначала переключаем на секцию публичных отчетов
    showSection('citizen-reports-public-section', false); // false = не форсировать показ всех
    // Затем вызываем отображение отчетов с фильтром по ID проекта
    displayPublicReports(projectIdStr);
}

// --- Получение геолокации ---
function getGeolocation() {
    const statusElement = document.getElementById('geolocation-status');
    const latInput = document.getElementById('report-latitude');
    const lonInput = document.getElementById('report-longitude');

    statusElement.textContent = _('report_geolocation_fetching');
    statusElement.className = 'text-sm text-gray-500';
    latInput.value = '';
    lonInput.value = '';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                latInput.value = lat.toFixed(6);
                lonInput.value = lon.toFixed(6);
                statusElement.textContent = `${_('report_geolocation_success')}: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                statusElement.className = 'text-sm text-green-600';
            },
            (error) => {
                console.error("Geolocation error:", error.code, error.message);
                let errorKey;
                switch(error.code) {
                    case error.PERMISSION_DENIED: errorKey = 'report_geolocation_permission_denied'; break;
                    case error.POSITION_UNAVAILABLE: errorKey = 'report_geolocation_unavailable'; break;
                    case error.TIMEOUT: errorKey = 'report_geolocation_timeout'; break;
                    default: errorKey = 'report_geolocation_error';
                }
                statusElement.textContent = _(errorKey);
                statusElement.className = 'text-sm text-red-600';
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        statusElement.textContent = _('report_geolocation_unsupported');
        statusElement.className = 'text-sm text-red-600';
    }
}

// --- Обновление года в подвале ---
function updateFooterYear() {
     const yearElement = document.getElementById('footer-year');
     if (yearElement) yearElement.textContent = new Date().getFullYear();
}

// --- Закрытие мобильного меню ---
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// --- Отображение уведомлений ---
function showMessage(messageOrKey, type = 'info', duration = 3500) {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;

     // Пытаемся перевести, если это ключ, иначе используем как есть
    let messageText = _(messageOrKey); // _() вернет ключ, если перевода нет

    messageBox.textContent = messageText;
    messageBox.className = `message-box ${type}`; // Базовые классы + тип

    // Перезапуск анимации через reflow
    messageBox.style.display = 'none';
    void messageBox.offsetWidth;
    messageBox.style.display = '';
    messageBox.classList.add('show');

    // Очистка предыдущего таймера
     if (messageBox.timerId) {
         clearTimeout(messageBox.timerId);
     }

    // Установка нового таймера
    messageBox.timerId = setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// Отправка формы отчета
document.getElementById('report-form').addEventListener('submit', async function(event) {
     event.preventDefault();
     const form = this;
     const submitButton = form.querySelector('button[type="submit"]');
     const submitButtonSpan = submitButton.querySelector('span');
     const originalButtonText = submitButtonSpan.textContent;

     submitButton.disabled = true;
     submitButtonSpan.textContent = _('Submitting...');

     const projectId = document.getElementById('report-project').value;
     const comment = document.getElementById('report-comment').value;
     const photoInput = document.getElementById('report-photo');
     const latitude = document.getElementById('report-latitude').value;
     const longitude = document.getElementById('report-longitude').value;

     if (!projectId || !comment.trim()) {
         showMessage('message_error_form', 'error');
         submitButton.disabled = false;
         submitButtonSpan.textContent = originalButtonText;
         return;
     }

     const formData = new FormData();
     formData.append('projectId', projectId);
     formData.append('comment', comment.trim());
     if (latitude && longitude) {
         formData.append('latitude', latitude);
         formData.append('longitude', longitude);
     }
     if (photoInput.files.length > 0) {
         formData.append('report-photo', photoInput.files[0]);
     }

     try {
         const response = await fetch(`${API_BASE_URL}/api/reports`, {
             method: 'POST',
             body: formData
         });

         const result = await response.json();

         if (!response.ok) {
             throw new Error(result.message || `HTTP error! status: ${response.status}`);
         }

         // --- Успех ---
         showMessage('message_success', 'success');
         form.reset(); // Сбрасываем форму
          const projectSelect = document.getElementById('report-project');
         projectSelect.value = "";
         if (projectSelect.options[0]) {
             projectSelect.options[0].disabled = false;
             projectSelect.options[0].selected = true;
         }
         document.getElementById('geolocation-status').textContent = _('report_geolocation_fetching');
         document.getElementById('geolocation-status').className = 'text-sm text-gray-500';

         // --- Обновление данных после отправки ---
         await loadReports(); // Перезагружаем отчеты
         displayCitizenReports(); // Обновляем список последних отчетов

         // Обновляем данные проекта, если бэкенд вернул обновленный проект
         if (result.updatedProject) {
             const projectIndex = allProjectsData.findIndex(p => String(p.id) === String(result.updatedProject.id));
             if (projectIndex !== -1) {
                 allProjectsData[projectIndex] = result.updatedProject;
                 displayProjectsInList();
                 if(map) displayProjectsOnMap();
             }
         }

         // Обновляем секцию публичных отчетов, если она активна
         const activeSectionId = document.querySelector('.content-section:not(.hidden)')?.id;
         if (activeSectionId === 'citizen-reports-public-section') {
              const publicReportsTitle = document.getElementById('public-reports-title').textContent;
              const isPublicReportsFiltered = publicReportsTitle !== _('public_reports_title');
              const currentFilterId = isPublicReportsFiltered ? projectId : null;
              await displayPublicReports(currentFilterId); // Перерисовываем с текущим фильтром (или без)
         }

         getGeolocation(); // Запрашиваем геолокацию для следующего отчета

     } catch (error) {
         console.error("Ошибка отправки отчета:", error);
         showMessage(error.message || _('Error submitting report. Please try again.'), 'error', 5000);
     } finally {
         submitButton.disabled = false; // Всегда включаем кнопку обратно
         submitButtonSpan.textContent = originalButtonText; // Возвращаем исходный текст
     }
});


// Поиск проектов
document.getElementById('project-search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!Array.isArray(allProjectsData)) return;

    const filtered = allProjectsData.filter(project => {
         const projectName = project.name || '';
         const contractorName = getContractorName(project.contractorId) || '';
         return projectName.toLowerCase().includes(searchTerm) ||
                contractorName.toLowerCase().includes(searchTerm);
     });
    displayProjectsInList(filtered);
});

// Кнопка мобильного меню
document.getElementById('mobile-menu-button').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// --- Инициализация при загрузке страницы ---
document.addEventListener('DOMContentLoaded', async () => {
     const savedLang = localStorage.getItem('preferredLanguage');
     const browserLang = navigator.language.split('-')[0];
     const initialLang = savedLang || (languages[browserLang] ? browserLang : 'ru');

     await setLanguage(initialLang); // Устанавливаем язык

     try {
         // document.body.classList.add('loading'); // Показать индикатор загрузки

         await loadInitialData(); // Загружаем все начальные данные

         // Отображаем данные после загрузки
         displayProjectsInList();
         displayContractors();
         populateProjectSelect();
         displayCitizenReports();
         await displayPublicReports();

         // Показываем стартовую секцию
         showSection('landing-section', false);

         getGeolocation();
         updateFooterYear();

     } catch (error) {
         console.error("Ошибка при начальной загрузке:", error);
         const mainContentArea = document.querySelector('main');
         if (mainContentArea) {
             mainContentArea.innerHTML = `<div class="p-8 text-center text-red-600 bg-red-100 rounded-lg">
                 <h2 class="text-xl font-semibold mb-2">${_('Failed to Load Application Data')}</h2>
                 <p>${error.message || _('Please check your connection and refresh the page.')}</p>
             </div>`;
         }
     } finally {
         // document.body.classList.remove('loading'); // Скрыть индикатор загрузки
     }
});