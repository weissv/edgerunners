// --- ПОЛНЫЙ JAVASCRIPT КОД ДЛЯ ПЛАТФОРМЫ "Jamoatchilik Qurilish" ---

// --- ЯЗЫКОВЫЕ ДАННЫЕ ---
const languages = {
    ru: {
        platform_title: "Jamoatchilik Qurilish - Гражданский Контроль",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Главная", nav_map: "Карта", nav_projects: "Проекты", nav_contractors: "Подрядчики", nav_public_reports: "Отчеты", nav_report: "Сообщить",
        nav_login: "Вход", nav_register: "Регистрация", nav_logout: "Выход",
        landing_title: "Контролируйте строительство. Вместе.",
        landing_subtitle: "Платформа \"Jamoatchilik Qurilish\" — ваш инструмент для прозрачного мониторинга государственных инфраструктурных проектов в Узбекистане. Узнавайте бюджеты, следите за сроками и влияйте на качество.",
        landing_cta_projects: "Изучить проекты", landing_cta_report: "Сообщить о проблеме",
        landing_how_it_works_title: "Как это работает? Просто.", landing_how_step1_title: "Находите проекты", landing_how_step1_desc: "Используйте интерактивную карту или список для поиска строящихся или завершенных объектов рядом с вами.", landing_how_step2_title: "Изучайте детали", landing_how_step2_desc: "Получите доступ к информации о бюджете, сроках, подрядчике и официальной документации по каждому проекту.", landing_how_step3_title: "Делитесь наблюдениями", landing_how_step3_desc: "Заметили проблему? Отправьте фото или комментарий с геолокацией прямо через платформу.",
        landing_features_title: "Ключевые возможности", landing_feature1_title: "Полная прозрачность", landing_feature1_desc: "Вся информация о бюджетах, сроках, подрядчиках и документации в одном месте.", landing_feature2_title: "Гражданский мониторинг", landing_feature2_desc: "Возможность для каждого гражданина сообщать о реальном состоянии объектов.", landing_feature3_title: "AI-анализ отчетов", landing_feature3_desc: "Система анализирует данные от граждан и сравнивает их с официальными отчетами для выявления расхождений.", landing_feature4_title: "Рейтинг подрядчиков", landing_feature4_desc: "Публичный рейтинг компаний, основанный на качестве работ и отзывах граждан.",
        landing_benefits_title: "Польза для всех", landing_benefits_citizens_title: "Для Граждан", landing_benefits_citizens1: "Реальный контроль за расходованием бюджетных средств.", landing_benefits_citizens2: "Возможность влиять на качество инфраструктуры в своем городе.", landing_benefits_citizens3: "Удобный инструмент для обратной связи и сообщений о проблемах.", landing_benefits_gov_title: "Для Государства", landing_benefits_gov1: "Повышение эффективности расходования бюджетных средств.", landing_benefits_gov2: "Своевременное выявление проблемных объектов и недобросовестных подрядчиков.", landing_benefits_gov3: "Улучшение качества инфраструктуры и повышение доверия граждан.",
        landing_final_cta_title: "Присоединяйтесь к контролю!", landing_final_cta_desc: "Начните использовать платформу уже сегодня. Изучайте проекты в вашем районе или сообщите о проблеме, которую вы заметили.", landing_final_cta_map: "Посмотреть карту", landing_final_cta_report: "Сообщить о проблеме",
        map_title: "Интерактивная карта проектов", map_hint: "Нажмите на маркер для просмотра информации о проекте.", map_popup_status: "Статус", map_popup_budget: "Бюджет", map_popup_deadline: "Срок", map_popup_contractor: "Подрядчик", map_popup_docs: "Документация", map_popup_alert: "Внимание: Есть жалобы!",
        projects_title: "Список Инфраструктурных Проектов", projects_search_placeholder: "Поиск по названию или подрядчику...", projects_not_found: "Проекты не найдены.", project_status: "Статус", project_budget: "Бюджет", project_deadline: "Срок сдачи", project_contractor: "Подрядчик", project_rating: "Рейтинг", project_official_report: "Официальный отчет", project_docs_link: "Смотреть документацию", project_alert_serious: "Обнаружены серьезные расхождения с отчетами граждан!", project_alert_minor: "Поступили жалобы от граждан.", project_show_on_map: "Показать на карте", project_view_reports_link: "Посмотреть отчеты",
        contractors_title: "Рейтинг Подрядчиков", contractor_rating: "Рейтинг", contractor_projects_completed: "Завершено проектов", contractor_current_projects: "Текущие/завершенные проекты:", contractor_no_projects: "Нет информации о проектах",
        report_title: "Сообщить о состоянии объекта", report_subtitle: "Заметили проблему со строительством или состоянием объекта? Расскажите нам!", report_select_project: "Выберите проект:", report_select_placeholder: "-- Выберите проект --", report_comment_label: "Ваш комментарий:", report_comment_placeholder: "Опишите проблему...", report_attach_photo: "Прикрепить фото:", report_attach_hint: "Допустимые форматы: JPG, PNG, GIF, WEBP (макс. 10MB)", report_geolocation_label: "Геолокация:", report_geolocation_fetching: "Получение координат...", report_geolocation_success: "Координаты получены", report_geolocation_error: "Не удалось получить координаты.", report_geolocation_permission_denied: "Доступ к геолокации запрещен.", report_geolocation_unavailable: "Информация о местоположении недоступна.", report_geolocation_timeout: "Время ожидания запроса геолокации истекло.", report_geolocation_unsupported: "Геолокация не поддерживается браузером.", report_submit_button: "Отправить отчет", report_latest_reports: "Последние отчеты граждан:", report_no_reports: "Пока нет отчетов.", report_no_reports_for_project: "Нет отчетов для этого проекта.", report_card_project: "Проект", report_card_comment: "Комментарий", report_card_date: "Дата", report_card_photo: "Фото", report_card_location: "Локация", report_card_unknown_project: "Неизвестный проект",
        public_reports_title: "Публичные отчеты граждан", public_reports_title_filtered: "Отчеты по проекту: {projectName}", public_reports_show_all: "Показать все отчеты",
        // Ключи для информационного шага регистрации
        reginfo_title: "Шаг 1: Важная информация",
        reginfo_explanation: "Это пример объяснения под фотографией. Здесь может быть важная информация о правилах безопасности на стройке, о том, как правильно делать отчеты для платформы, или любая другая ключевая информация, с которой пользователь должен ознакомиться перед регистрацией. Убедитесь, что текст понятен и связан с изображением.",
        reginfo_continue_button: "Понятно, продолжить регистрацию",
        // Ключи для формы регистрации (шаг 2)
        register_title: "Регистрация",
        register_intro: "Пожалуйста, заполните форму для создания аккаунта.",
        register_email_label: "Email:",
        register_email_placeholder: "Введите ваш email",
        register_password_label: "Пароль:",
        register_password_placeholder: "Придумайте пароль (мин. 6 символов)",
        register_confirm_password_label: "Подтвердите пароль:",
        register_confirm_password_placeholder: "Повторите пароль",
        register_submit_button: "Зарегистрироваться",
        register_success_message: "Регистрация прошла успешно! Теперь вы можете войти.",
        register_error_passwords_mismatch: "Пароли не совпадают.",
        register_error_user_exists: "Пользователь с таким email уже существует.",
        register_error_generic: "Ошибка регистрации. Попробуйте позже.",
        // Ключи для формы входа
        login_title: "Вход",
        login_intro: "Введите ваши данные для входа.",
        login_email_label: "Email:",
        login_email_placeholder: "Введите ваш email",
        login_password_label: "Пароль:",
        login_password_placeholder: "Введите ваш пароль",
        login_submit_button: "Войти",
        login_forgot_password: "Забыли пароль?",
        login_error_generic: "Ошибка входа. Проверьте email/пароль.",
        login_success_message: "Вход выполнен успешно!",
        logout_success_message: "Вы успешно вышли.",
        // Общие сообщения
        message_success: "Успешно!",
        message_error_form: "Пожалуйста, заполните все обязательные поля.",
        message_docs_simulation: "Симуляция открытия документа:",
        // Footer и системные
        footer_year: new Date().getFullYear(), footer_rights: "Все права защищены.", locale_code: "ru-RU",
        'Loading reports...': 'Загрузка отчетов...', 'Loading projects...': 'Загрузка проектов...', 'Loading contractors...': 'Загрузка подрядчиков...',
        'Submitting...': 'Отправка...',
        'Error fetching data ({endpoint}): {message}': 'Ошибка загрузки данных ({endpoint}): {message}',
        'Error: Invalid coordinates for this project.': 'Ошибка: Неверные координаты для этого проекта.', 'Error: Project not found.': 'Ошибка: Проект не найден.', 'Error: Map not loaded yet.': 'Ошибка: Карта еще не загружена.', 'Error: Project location data is missing or invalid.': 'Ошибка: Данные о местоположении проекта отсутствуют или неверны.', 'Error submitting report. Please try again.': 'Ошибка отправки отчета. Пожалуйста, попробуйте еще раз.',
        'Failed to Load Application Data': 'Не удалось загрузить данные приложения', 'Please check your connection and refresh the page.': 'Пожалуйста, проверьте соединение и обновите страницу.',
        'Unnamed Project': 'Проект без названия', 'Unnamed Contractor': 'Подрядчик без названия', 'No document specified': 'Документ не указан', 'No docs': 'Нет документов'
        // Ключи quiz_* были удалены
    },
    en: { // Placeholder translations - NEED ACTUAL TRANSLATION
        platform_title: "Jamoatchilik Qurilish - Civic Control",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Home", nav_map: "Map", nav_projects: "Projects", nav_contractors: "Contractors", nav_public_reports: "Reports", nav_report: "Report",
        nav_login: "Login", nav_register: "Register", nav_logout: "Logout",
        landing_title: "Control construction. Together.",
        landing_subtitle: "The \"Jamoatchilik Qurilish\" platform is your tool for transparent monitoring of state infrastructure projects in Uzbekistan. Find out budgets, track deadlines, and influence quality.",
        landing_cta_projects: "Explore projects", landing_cta_report: "Report an issue",
        landing_how_it_works_title: "How it works? Simple.", landing_how_step1_title: "Find projects", landing_how_step1_desc: "Use the interactive map or list to find ongoing or completed objects near you.", landing_how_step2_title: "Study details", landing_how_step2_desc: "Get access to information about budget, deadlines, contractor, and official documentation for each project.", landing_how_step3_title: "Share observations", landing_how_step3_desc: "Noticed a problem? Submit a photo or comment with geolocation directly through the platform.",
        landing_features_title: "Key Features", landing_feature1_title: "Full transparency", landing_feature1_desc: "All information about budgets, deadlines, contractors, and documentation in one place.", landing_feature2_title: "Civic monitoring", landing_feature2_desc: "Opportunity for every citizen to report on the real state of objects.", landing_feature3_title: "AI analysis of reports", landing_feature3_desc: "The system analyzes citizen data and compares it with official reports to identify discrepancies.", landing_feature4_title: "Contractor rating", landing_feature4_desc: "Public rating of companies based on the quality of work and citizen feedback.",
        landing_benefits_title: "Benefits for Everyone", landing_benefits_citizens_title: "For Citizens", landing_benefits_citizens1: "Real control over the spending of budget funds.", landing_benefits_citizens2: "Opportunity to influence the quality of infrastructure in your city.", landing_benefits_citizens3: "Convenient tool for feedback and reporting problems.", landing_benefits_gov_title: "For the Government", landing_benefits_gov1: "Increased efficiency in budget spending.", landing_benefits_gov2: "Timely identification of problematic objects and unscrupulous contractors.", landing_benefits_gov3: "Improved infrastructure quality and increased citizen trust.",
        landing_final_cta_title: "Join the control!", landing_final_cta_desc: "Start using the platform today. Explore projects in your area or report a problem you've noticed.", landing_final_cta_map: "View map", landing_final_cta_report: "Report an issue",
        map_title: "Interactive Project Map", map_hint: "Click on a marker to view project information.", map_popup_status: "Status", map_popup_budget: "Budget", map_popup_deadline: "Deadline", map_popup_contractor: "Contractor", map_popup_docs: "Documentation", map_popup_alert: "Attention: Complaints received!",
        projects_title: "List of Infrastructure Projects", projects_search_placeholder: "Search by name or contractor...", projects_not_found: "Projects not found.", project_status: "Status", project_budget: "Budget", project_deadline: "Deadline", project_contractor: "Contractor", project_rating: "Rating", project_official_report: "Official Report", project_docs_link: "View documentation", project_alert_serious: "Serious discrepancies found with citizen reports!", project_alert_minor: "Citizen complaints received.", project_show_on_map: "Show on map", project_view_reports_link: "View reports",
        contractors_title: "Contractor Rating", contractor_rating: "Rating", contractor_projects_completed: "Projects completed", contractor_current_projects: "Current/Completed projects:", contractor_no_projects: "No project information",
        report_title: "Report Object Status", report_subtitle: "Noticed a problem with construction or object condition? Tell us!", report_select_project: "Select project:", report_select_placeholder: "-- Select project --", report_comment_label: "Your comment:", report_comment_placeholder: "Describe the problem...", report_attach_photo: "Attach photo:", report_attach_hint: "Allowed formats: JPG, PNG, GIF, WEBP (max 10MB)", report_geolocation_label: "Geolocation:", report_geolocation_fetching: "Getting coordinates...", report_geolocation_success: "Coordinates obtained", report_geolocation_error: "Failed to get coordinates.", report_geolocation_permission_denied: "Geolocation access denied.", report_geolocation_unavailable: "Location information unavailable.", report_geolocation_timeout: "Geolocation request timed out.", report_geolocation_unsupported: "Geolocation not supported by browser.", report_submit_button: "Submit report", report_latest_reports: "Latest citizen reports:", report_no_reports: "No reports yet.", report_no_reports_for_project: "No reports for this project.", report_card_project: "Project", report_card_comment: "Comment", report_card_date: "Date", report_card_photo: "Photo", report_card_location: "Location", report_card_unknown_project: "Unknown project",
        public_reports_title: "Public Citizen Reports", public_reports_title_filtered: "Reports for project: {projectName}", public_reports_show_all: "Show all reports",
        // Keys for registration info step (NEED TRANSLATION)
        reginfo_title: "Step 1: Important Information",
        reginfo_explanation: "This is an example explanation under the photo. Important information about construction site safety rules, how to correctly make reports for the platform, or any other key information the user should read before registering can go here. Ensure the text is clear and related to the image.",
        reginfo_continue_button: "Understood, continue registration",
        // Keys for registration form (step 2)
        register_title: "Registration",
        register_intro: "Please fill out the form to create an account.",
        register_email_label: "Email:",
        register_email_placeholder: "Enter your email",
        register_password_label: "Password:",
        register_password_placeholder: "Create a password (min. 6 chars)",
        register_confirm_password_label: "Confirm Password:",
        register_confirm_password_placeholder: "Repeat password",
        register_submit_button: "Register",
        register_success_message: "Registration successful! You can now log in.",
        register_error_passwords_mismatch: "Passwords do not match.",
        register_error_user_exists: "User with this email already exists.",
        register_error_generic: "Registration error. Please try again later.",
        // Keys for login form
        login_title: "Login",
        login_intro: "Enter your credentials to log in.",
        login_email_label: "Email:",
        login_email_placeholder: "Enter your email",
        login_password_label: "Password:",
        login_password_placeholder: "Enter your password",
        login_submit_button: "Login",
        login_forgot_password: "Forgot password?",
        login_error_generic: "Login failed. Check email/password.",
        login_success_message: "Login successful!",
        logout_success_message: "You have successfully logged out.",
        // General messages
        message_success: "Success!", message_error_form: "Please fill in all required fields.", message_docs_simulation: "Simulation of opening document:",
        // Footer & system
        footer_year: new Date().getFullYear(), footer_rights: "All rights reserved.", locale_code: "en-US",
         'Loading reports...': 'Loading reports...', 'Loading projects...': 'Loading projects...', 'Loading contractors...': 'Loading contractors...',
         'Submitting...': 'Submitting...',
         'Error fetching data ({endpoint}): {message}': 'Error fetching data ({endpoint}): {message}',
         'Error: Invalid coordinates for this project.': 'Error: Invalid coordinates for this project.', 'Error: Project not found.': 'Error: Project not found.', 'Error: Map not loaded yet.': 'Error: Map not loaded yet.', 'Error: Project location data is missing or invalid.': 'Error: Project location data is missing or invalid.', 'Error submitting report. Please try again.': 'Error submitting report. Please try again.',
         'Failed to Load Application Data': 'Failed to Load Application Data', 'Please check your connection and refresh the page.': 'Please check your connection and refresh the page.',
         'Unnamed Project': 'Unnamed Project', 'Unnamed Contractor': 'Unnamed Contractor', 'No document specified': 'No document specified', 'No docs': 'No docs'
        // quiz_* keys removed
    },
    uz: { // Placeholder translations - NEED ACTUAL TRANSLATION
        platform_title: "Jamoatchilik Qurilish - Fuqarolik Nazorati",
        platform_name: "Jamoatchilik Qurilish",
        platform_name_footer: "Jamoatchilik Qurilish",
        nav_home: "Bosh sahifa", nav_map: "Xarita", nav_projects: "Loyihalar", nav_contractors: "Pudratchilar", nav_public_reports: "Hisobotlar", nav_report: "Xabar berish",
        nav_login: "Kirish", nav_register: "Ro'yxatdan o'tish", nav_logout: "Chiqish",
        landing_title: "Qurilishni nazorat qiling. Birgalikda.",
        landing_subtitle: "\"Jamoatchilik Qurilish\" platformasi — O'zbekistondagi davlat infratuzilma loyihalarini shaffof monitoring qilish uchun sizning vositangiz. Byudjetlarni bilib oling, muddatlarni kuzating va sifatga ta'sir qiling.",
        landing_cta_projects: "Loyihalarni o'rganish", landing_cta_report: "Muammo haqida xabar berish",
        landing_how_it_works_title: "Bu qanday ishlaydi? Oddiy.", landing_how_step1_title: "Loyihalarni toping", landing_how_step1_desc: "Yaqiningizdagi qurilayotgan yoki tugallangan ob'ektlarni topish uchun interaktiv xarita yoki ro'yxatdan foydalaning.", landing_how_step2_title: "Tafsilotlarni o'rganing", landing_how_step2_desc: "Har bir loyiha bo'yicha byudjet, muddatlar, pudratchi va rasmiy hujjatlar haqidagi ma'lumotlarga ega bo'ling.", landing_how_step3_title: "Kuzatuvlaringizni baham ko'ring", landing_how_step3_desc: "Muammoni payqadingizmi? Geolokatsiya bilan fotosurat yoki izohni to'g'ridan-to'g'ri platforma orqali yuboring.",
        landing_features_title: "Asosiy imkoniyatlar", landing_feature1_title: "To'liq shaffoflik", landing_feature1_desc: "Byudjetlar, muddatlar, pudratchilar va hujjatlar haqidagi barcha ma'lumotlar bir joyda.", landing_feature2_title: "Fuqarolik monitoringi", landing_feature2_desc: "Har bir fuqaro uchun ob'ektlarning haqiqiy holati to'g'risida xabar berish imkoniyati.", landing_feature3_title: "Hisobotlarning AI-tahlili", landing_feature3_desc: "Tizim fuqarolardan olingan ma'lumotlarni tahlil qiladi va nomuvofiqliklarni aniqlash uchun ularni rasmiy hisobotlar bilan taqqoslaydi.", landing_feature4_title: "Pudratchilar reytingi", landing_feature4_desc: "Ish sifati va fuqarolarning fikrlariga asoslangan kompaniyalarning ommaviy reytingi.",
        landing_benefits_title: "Hamma uchun foyda", landing_benefits_citizens_title: "Fuqarolar uchun", landing_benefits_citizens1: "Byudjet mablag'larining sarflanishi ustidan haqiqiy nazorat.", landing_benefits_citizens2: "O'z shahridagi infratuzilma sifatiga ta'sir qilish imkoniyati.", landing_benefits_citizens3: "Qayta aloqa va muammolar haqida xabar berish uchun qulay vosita.", landing_benefits_gov_title: "Davlat uchun", landing_benefits_gov1: "Byudjet mablag'larini sarflash samaradorligini oshirish.", landing_benefits_gov2: "Muammoli ob'ektlarni va vijdonsiz pudratchilarni o'z vaqtida aniqlash.", landing_benefits_gov3: "Infratuzilma sifatini yaxshilash va fuqarolar ishonchini oshirish.",
        landing_final_cta_title: "Nazoratga qo'shiling!", landing_final_cta_desc: "Platformadan bugunoq foydalanishni boshlang. O'z hududingizdagi loyihalarni o'rganing yoki siz sezgan muammo haqida xabar bering.", landing_final_cta_map: "Xaritani ko'rish", landing_final_cta_report: "Muammo haqida xabar berish",
        map_title: "Loyihalarning interaktiv xaritasi", map_hint: "Loyiha haqida ma'lumot olish uchun marker ustiga bosing.", map_popup_status: "Holati", map_popup_budget: "Byudjet", map_popup_deadline: "Muddati", map_popup_contractor: "Pudratchi", map_popup_docs: "Hujjatlar", map_popup_alert: "Diqqat: Shikoyatlar mavjud!",
        projects_title: "Infratuzilma Loyihalari Roʻyxati", projects_search_placeholder: "Nomi yoki pudratchi boʻyicha qidirish...", projects_not_found: "Loyihalar topilmadi.", project_status: "Holati", project_budget: "Byudjet", project_deadline: "Topshirish muddati", project_contractor: "Pudratchi", project_rating: "Reyting", project_official_report: "Rasmiy hisobot", project_docs_link: "Hujjatlarni ko'rish", project_alert_serious: "Fuqarolar hisobotlari bilan jiddiy nomuvofiqliklar aniqlandi!", project_alert_minor: "Fuqarolardan shikoyatlar kelib tushdi.", project_show_on_map: "Xaritada ko'rsatish", project_view_reports_link: "Hisobotlarni ko'rish",
        contractors_title: "Pudratchilar Reytingi", contractor_rating: "Reyting", contractor_projects_completed: "Tugallangan loyihalar", contractor_current_projects: "Joriy/tugallangan loyihalar:", contractor_no_projects: "Loyihalar haqida ma'lumot yo'q",
        report_title: "Ob'ekt holati haqida xabar berish", report_subtitle: "Qurilish yoki ob'ekt holatida muammo payqadingizmi? Bizga xabar bering!", report_select_project: "Loyihani tanlang:", report_select_placeholder: "-- Loyihani tanlang --", report_comment_label: "Sizning izohingiz:", report_comment_placeholder: "Muammoni tasvirlab bering...", report_attach_photo: "Fotosuratni biriktirish:", report_attach_hint: "Ruxsat etilgan formatlar: JPG, PNG, GIF, WEBP (maks. 10MB)", report_geolocation_label: "Geolokatsiya:", report_geolocation_fetching: "Koordinatalar olinmoqda...", report_geolocation_success: "Koordinatalar olindi", report_geolocation_error: "Koordinatalarni olib bo'lmadi.", report_geolocation_permission_denied: "Geolokatsiyaga ruxsat berilmagan.", report_geolocation_unavailable: "Joylashuv ma'lumoti mavjud emas.", report_geolocation_timeout: "Geolokatsiya so'rovi vaqti tugadi.", report_geolocation_unsupported: "Brauzer geolokatsiyani qo'llab-quvvatlamaydi.", report_submit_button: "Hisobotni yuborish", report_latest_reports: "So'nggi fuqarolik hisobotlari:", report_no_reports: "Hozircha hisobotlar yo'q.", report_no_reports_for_project: "Ushbu loyiha uchun hisobotlar yo'q.", report_card_project: "Loyiha", report_card_comment: "Izoh", report_card_date: "Sana", report_card_photo: "Foto", report_card_location: "Joylashuv", report_card_unknown_project: "Noma'lum loyiha",
        public_reports_title: "Ommaviy Fuqarolik Hisobotlari", public_reports_title_filtered: "Loyiha bo'yicha hisobotlar: {projectName}", public_reports_show_all: "Barcha hisobotlarni ko'rsatish",
        // Keys for registration info step (NEED TRANSLATION)
        reginfo_title: "1-qadam: Muhim ma'lumot",
        reginfo_explanation: "Bu fotosurat ostidagi tushuntirish namunasi. Bu yerda qurilish maydonchasidagi xavfsizlik qoidalari, platforma uchun hisobotlarni qanday to'g'ri tayyorlash haqida muhim ma'lumotlar yoki foydalanuvchi ro'yxatdan o'tishdan oldin tanishishi kerak bo'lgan boshqa muhim ma'lumotlar bo'lishi mumkin. Matn tushunarli va rasm bilan bog'liqligiga ishonch hosil qiling.",
        reginfo_continue_button: "Tushunarli, ro'yxatdan o'tishni davom ettirish",
        // Keys for registration form (step 2)
        register_title: "Ro'yxatdan o'tish",
        register_intro: "Akkunt yaratish uchun shaklni toʻldiring.",
        register_email_label: "Email:",
        register_email_placeholder: "Emailingizni kiriting",
        register_password_label: "Parol:",
        register_password_placeholder: "Parol yarating (min. 6 belgi)",
        register_confirm_password_label: "Parolni tasdiqlang:",
        register_confirm_password_placeholder: "Parolni takrorlang",
        register_submit_button: "Ro'yxatdan o'tish",
        register_success_message: "Muvaffaqiyatli roʻyxatdan oʻtdingiz! Endi tizimga kirishingiz mumkin.",
        register_error_passwords_mismatch: "Parollar mos kelmadi.",
        register_error_user_exists: "Bunday emailga ega foydalanuvchi mavjud.",
        register_error_generic: "Ro'yxatdan o'tishda xatolik. Keyinroq urinib ko'ring.",
        // Keys for login form
        login_title: "Kirish",
        login_intro: "Kirish uchun maʼlumotlaringizni kiriting.",
        login_email_label: "Email:",
        login_email_placeholder: "Emailingizni kiriting",
        login_password_label: "Parol:",
        login_password_placeholder: "Parolingizni kiriting",
        login_submit_button: "Kirish",
        login_forgot_password: "Parolni unutdingizmi?",
        login_error_generic: "Kirishda xatolik. Email/parolni tekshiring.",
        login_success_message: "Muvaffaqiyatli kirdingiz!",
        logout_success_message: "Muvaffaqiyatli chiqdingiz.",
        // General messages
        message_success: "Muvaffaqiyatli!", message_error_form: "Iltimos, barcha majburiy maydonlarni to'ldiring.", message_docs_simulation: "Hujjatni ochish simulyatsiyasi:",
        // Footer & system
        footer_year: new Date().getFullYear(), footer_rights: "Barcha huquqlar himoyalangan.", locale_code: "uz-UZ",
        'Loading reports...': 'Hisobotlar yuklanmoqda...', 'Loading projects...': 'Loyihalar yuklanmoqda...', 'Loading contractors...': 'Pudratchilar yuklanmoqda...',
        'Submitting...': 'Yuborilmoqda...',
        'Error fetching data ({endpoint}): {message}': 'Maʼlumotlarni yuklashda xatolik ({endpoint}): {message}',
        'Error: Invalid coordinates for this project.': 'Xatolik: Ushbu loyiha uchun noto‘g‘ri koordinatalar.', 'Error: Project not found.': 'Xatolik: Loyiha topilmadi.', 'Error: Map not loaded yet.': 'Xatolik: Xarita hali yuklanmagan.', 'Error: Project location data is missing or invalid.': 'Xatolik: Loyiha joylashuvi maʼlumotlari yo‘q yoki noto‘g‘ri.', 'Error submitting report. Please try again.': 'Hisobot yuborishda xatolik. Iltimos, qayta urinib ko‘ring.',
        'Failed to Load Application Data': 'Ilova maʼlumotlarini yuklab bo‘lmadi', 'Please check your connection and refresh the page.': 'Iltimos, ulanishni tekshiring va sahifani yangilang.',
        'Unnamed Project': 'Nomsiz Loyiha', 'Unnamed Contractor': 'Nomsiz Pudratchi', 'No document specified': 'Hujjat ko‘rsatilmagan', 'No docs': 'Hujjatlar yo‘q'
        // quiz_* keys removed
    }
};

// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
const API_BASE_URL = 'https://backranners.onrender.com'; // Ваш URL бэкенда
let currentLanguage = 'ru';
let map;
let markers = {};
let allProjectsData = [];
let allContractorsData = [];
let allReportsData = [];
// Глобальные переменные, связанные с квизом (currentQuizQuestions, quizPassed), удалены

// --- ФУНКЦИИ ---

// Утилита для загрузки данных (GET)
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
        if (!response.ok) {
            let errorData; try { errorData = await response.json(); } catch (e) { /* ignore */ }
            const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        showMessage(_('Error fetching data ({endpoint}): {message}', { endpoint: endpoint, message: error.message }), 'error', 5000);
        return null; // Return null on error
    }
}

// Утилита для отправки данных (POST, PUT, DELETE)
async function sendData(endpoint, method = 'POST', bodyData = null, isFormData = false) {
    try {
        const options = {
            method: method,
            headers: {}, // Initialize headers
            body: null
        };

        if (bodyData) {
            if (isFormData) {
                // Don't set Content-Type for FormData, browser does it
                options.body = bodyData;
            } else {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(bodyData);
            }
        }

        // Add authorization token if available (e.g., from localStorage after login)
        // const token = localStorage.getItem('authToken');
        // if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, options);
        const result = await response.json(); // Try to parse JSON always

        if (!response.ok) {
             throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        return result; // Return parsed JSON from backend
    } catch (error) {
         console.error(`Error ${method}ing data to ${endpoint}:`, error);
         // Use the error message from the backend if available
         showMessage(error.message || `Error communicating with server.`, 'error', 5000);
         return null; // Indicate failure
    }
}


// --- Обновленная функция установки языка ---
async function setLanguage(lang) {
    if (!languages[lang]) { lang = 'ru'; }
    currentLanguage = lang;
    const langData = languages[lang];

    // Apply translations to elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey; const text = _(key);
        // Special handling for filtered reports title to preserve project name
        if (el.id === 'public-reports-title' && key === 'public_reports_title_filtered') {
             const currentText = el.textContent;
             if (currentText.startsWith(_('public_reports_title_filtered', {projectName:''}).split(':')[0])) {
                 const match = currentText.match(/:\s*(.+)/);
                 el.textContent = match && match[1] ? _(key, { projectName: match[1] }) : _('public_reports_title');
             } else { el.textContent = _('public_reports_title'); }
        } else if (el.tagName === 'BUTTON' || el.tagName === 'A') {
             // Preserve existing icons/spans within buttons/links if necessary
             // Simple approach: just set textContent for most buttons/links
             // More complex buttons might need specific handling (like submit buttons with loading state)
             if (el.dataset.preserveHtml) { // Example: add data-preserve-html="true" to button if needed
                 const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                 if (textNode) { textNode.textContent = ` ${text} `; } else { el.textContent = text; } // Fallback
             } else if (el.querySelector('span:not(.icon)')) { // Target specific spans if needed
                 el.querySelector('span:not(.icon)').textContent = text;
             } else if (el.id !== 'logout-button-header' && el.id !== 'logout-button-mobile') { // Avoid overwriting dynamically created logout buttons here
                 el.textContent = text;
             }
        } else {
            // For other elements, just set the text content
             el.textContent = text;
        }
    });

    // Apply translations to placeholders
    document.querySelectorAll('[data-lang-placeholder-key]').forEach(el => { el.placeholder = _(el.dataset.langPlaceholderKey); });

    document.documentElement.lang = lang;
    document.title = _('platform_title');
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    localStorage.setItem('preferredLanguage', lang);

    // Re-render components that might contain dynamic text or need refreshing
    displayProjectsInList(); displayContractors(); populateProjectSelect(); displayCitizenReports();
    await displayPublicReports(null); // Show all public reports on lang change
    if (map) displayProjectsOnMap(); // Refresh map popups if map is loaded
    updateFooterYear();

    // Quiz re-rendering logic removed

    // Re-render header buttons (Login/Logout) based on current state
    // const storedToken = localStorage.getItem('authToken'); // Uncomment if using localStorage
    // const storedEmail = localStorage.getItem('userEmail');
    const storedToken = null; // Placeholder - Replace with actual check
    const storedEmail = null; // Placeholder - Replace with actual check
    if (storedToken && storedEmail) {
        updateHeaderUI(true, storedEmail);
    } else {
        updateHeaderUI(false);
    }
}

// --- Помощник для перевода ---
function _(key, args = null) {
    let text = languages[currentLanguage]?.[key] ?? languages['en']?.[key] ?? key; // Fallback chain: current -> en -> key
     if (args && typeof args === 'object' && typeof text === 'string') {
          for (const k in args) { text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), args[k]); }
     }
    return text;
}

// --- ФУНКЦИИ РЕГИСТРАЦИИ (Информационный Шаг + Форма) ---

// Шаг 1: Показ информационного окна
function startRegistrationProcess() {
    showSection('registration-info-section');
    // Убедимся, что кнопка "Продолжить" в инфо-секции имеет обработчик
    // Можно добавить здесь, если он не добавлен в DOMContentLoaded
     const continueBtn = document.querySelector('[data-lang-key="reginfo_continue_button"]'); // Or use ID if assigned
     if (continueBtn && !continueBtn.hasClickListener) { // Avoid adding multiple listeners
          continueBtn.addEventListener('click', proceedToRegistration);
          continueBtn.hasClickListener = true; // Mark as listener added
     }
}

// Шаг 2: Переход к форме регистрации после инфо-шага
function proceedToRegistration() {
    showSection('register-section');

    // Добавляем обработчик на форму регистрации ТОЛЬКО сейчас, удаляя старые, если были
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const newForm = registerForm.cloneNode(true);
        registerForm.parentNode.replaceChild(newForm, registerForm);
        document.getElementById('register-form').addEventListener('submit', submitRegistration);
    }
}

// Шаг 3: Отправка данных формы регистрации
async function submitRegistration(event) {
    event.preventDefault();
    // Проверка quizPassed удалена

    const form = event.target;
    const emailInput = form.elements['email'];
    const passwordInput = form.elements['password'];
    const confirmPasswordInput = form.elements['confirmPassword'];

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Client-side validation
    if (!email || !password || !confirmPassword) {
        showMessage(_('message_error_form'), 'error');
        return;
    }
    if (password !== confirmPassword) {
        showMessage(_('register_error_passwords_mismatch'), 'error');
        return;
    }
    if (password.length < 6) {
        showMessage(_('register_password_placeholder'), 'error'); // Use text from placeholder
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent; // Store original text before changing
    submitButton.disabled = true;
    submitButton.textContent = _('Submitting...');

    // Send registration data to backend
    const result = await sendData('users/register', 'POST', { email, password }); // Assuming API endpoint

    submitButton.disabled = false;
    submitButton.textContent = originalButtonText; // Restore original text

    if (result && result.success) { // Check if result is not null and has success property
        showMessage(_('register_success_message'), 'success');
        form.reset(); // Clear the form
        showSection('landing-section', true); // Go to landing or show login prompt
    } else {
        // Show error from backend or generic one
        showMessage(result?.message || _('register_error_generic'), 'error');
    }
}


// --- Функции загрузки и кеширования данных ---
async function loadProjects() {
    allProjectsData = (await fetchData('projects')) || []; // Use empty array on fetch error
    if (allContractorsData.length === 0) await loadContractors(); // Load contractors if not already loaded
}
async function loadContractors() {
    allContractorsData = (await fetchData('contractors')) || []; // Use empty array on fetch error
}
async function loadReports(projectId = null) {
     const endpoint = projectId ? `reports?projectId=${projectId}` : 'reports';
     const fetchedReports = (await fetchData(endpoint)) || []; // Use empty array on fetch error
     // Sort reports by date, newest first
     allReportsData = fetchedReports.sort((a, b) => new Date(b.date) - new Date(a.date));
}
async function loadInitialData() {
     // Show loading indicators in relevant sections
     document.getElementById('project-list').innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading projects...')}</p>`;
     document.getElementById('contractor-list').innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading contractors...')}</p>`;
     document.getElementById('public-reports-list').innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading reports...')}</p>`;
     document.getElementById('reports-list').innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading reports...')}</p>`;

     // Fetch data concurrently
     await Promise.all([ loadProjects(), loadReports() ]);
     // Ensure contractors are loaded if needed (if loadProjects didn't trigger it)
     if(allContractorsData.length === 0) await loadContractors();
}


// --- Помощники для получения данных ---
function getContractorName(contractorId) { const c = allContractorsData.find(c => String(c.id) === String(contractorId)); return c ? c.name : _('Unnamed Contractor'); }
function getContractorRating(contractorId) { const c = allContractorsData.find(c => String(c.id) === String(contractorId)); return c && typeof c.rating === 'number' ? c.rating.toFixed(1) : 'N/A'; }
function getProjectName(projectId) { const p = allProjectsData.find(p => String(p.id) === String(projectId)); return p ? p.name : _('report_card_unknown_project'); }


// --- Функции Карты ---
function initializeMap() { if (map) { map.remove(); map = null; } map = L.map('map').setView([41.3111, 69.2797], 12); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map); markers = {}; displayProjectsOnMap(); }
function displayProjectsOnMap() { if (!map || !Array.isArray(allProjectsData)) return; Object.values(markers).forEach(m => { if(map.hasLayer(m)) map.removeLayer(m); }); markers = {}; if(allProjectsData.length === 0) return; allProjectsData.forEach(p => { if (!p.location || !Array.isArray(p.location) || p.location.length !== 2) return; const lat = parseFloat(p.location[0]), lon = parseFloat(p.location[1]); if(isNaN(lat) || isNaN(lon)) return; const marker = L.marker([lat, lon]); const safeName = p.name ? p.name.replace(/</g,"&lt;").replace(/>/g,"&gt;") : _('Unnamed Project'); const popup = `<div class="text-xs p-1"><b class="text-sm block mb-1">${safeName}</b><b>${_('map_popup_status')}:</b> ${p.status||'N/A'}<br><b>${_('map_popup_budget')}:</b> ${p.budget||'N/A'}<br><b>${_('map_popup_deadline')}:</b> ${p.deadline||'N/A'}<br><b>${_('map_popup_contractor')}:</b> ${getContractorName(p.contractorId)}<br><a href="#" onclick="alert('${_('message_docs_simulation')} ${p.docs || _('No document specified')}')" class="text-blue-600 hover:underline">${_('map_popup_docs')}</a>${p.citizenAlertLevel > 0 ? `<br><b class="text-red-600 mt-1 block">${_('map_popup_alert')}</b>` : ''}</div>`; marker.bindPopup(popup, {minWidth: 200}).addTo(map); markers[String(p.id)] = marker; }); }
function focusProjectOnMap(projectId) { const pid = String(projectId); const p = allProjectsData.find(proj => String(proj.id) === pid); if (p && map && p.location && Array.isArray(p.location) && p.location.length === 2) { const lat = parseFloat(p.location[0]), lon = parseFloat(p.location[1]); if (!isNaN(lat) && !isNaN(lon)) { showSection('map-section', false); map.flyTo([lat, lon], 16); if (markers[pid]) { setTimeout(() => { if (markers[pid] && map.hasLayer(markers[pid])) markers[pid].openPopup(); }, 500); } else { console.warn(`Marker ${pid} not found.`); } } else { showMessage(_('Error: Invalid coordinates for this project.'), 'error'); } } else if (!p) { showMessage(_('Error: Project not found.'), 'error'); } else if (!map) { showMessage(_('Error: Map not loaded yet.'), 'error'); } else { showMessage(_('Error: Project location data is missing or invalid.'), 'error'); } }


// --- Отображение списков (Проекты, Подрядчики, Отчеты) ---
function displayProjectsInList(filteredProjects = null) { const list = document.getElementById('project-list'); const data = filteredProjects ?? allProjectsData; list.innerHTML = ''; if (!Array.isArray(data) || data.length === 0) { list.innerHTML = `<p class="text-gray-500 italic p-4">${_('projects_not_found')}</p>`; return; } data.forEach(p => { const alertClass = p.citizenAlertLevel===2?'border-red-400 bg-red-50/50':(p.citizenAlertLevel===1?'border-yellow-400 bg-yellow-50/50':'border-gray-200'); const alertKey = p.citizenAlertLevel===2?'project_alert_serious':(p.citizenAlertLevel===1?'project_alert_minor':null); let alertHtml=''; if(alertKey){const alertTxtC=p.citizenAlertLevel===2?'text-red-700':'text-yellow-700'; const alertBgC=p.citizenAlertLevel===2?'bg-red-100':'bg-yellow-100'; const link=`<a href="#" onclick="showProjectReports('${String(p.id)}'); return false;" class="ml-2 text-blue-600 hover:underline font-medium">${_('project_view_reports_link')}</a>`; alertHtml=`<div class="text-xs font-semibold ${alertTxtC} mt-2 p-2 rounded-md ${alertBgC}">${_(alertKey)} ${link}</div>`;} const deadline = p.deadline||'N/A'; const card = `<div class="list-card ${alertClass}"><h3>${p.name||_('Unnamed Project')}</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2"><p><span class="font-medium">${_('project_status')}:</span> ${p.status||'N/A'}</p><p><span class="font-medium">${_('project_budget')}:</span> ${p.budget||'N/A'}</p><p><span class="font-medium">${_('project_deadline')}:</span> ${deadline}</p><p><span class="font-medium">${_('project_contractor')}:</span> ${getContractorName(p.contractorId)} (${_('project_rating')}: ${getContractorRating(p.contractorId)} ★)</p></div><p class="text-xs text-gray-600 mt-1 mb-2"><span class="font-medium">${_('project_official_report')}:</span> <span class="italic">${p.officialReport||'N/A'}</span></p><div class="flex items-center space-x-4 mt-3"><a href="#" onclick="alert('${_('message_docs_simulation')} ${p.docs || _('No docs')}')" class="text-xs text-blue-600 hover:underline font-medium">${_('project_docs_link')}</a><button onclick="focusProjectOnMap('${String(p.id)}')" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 mr-1"><path fill-rule="evenodd" d="M8 1a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 8 4zM8 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" clip-rule="evenodd" /></svg> ${_('project_show_on_map')}</button></div>${alertHtml}</div>`; list.innerHTML += card; });}
function displayContractors() { const list = document.getElementById('contractor-list'); list.innerHTML = ''; if (!Array.isArray(allContractorsData) || allContractorsData.length === 0) { list.innerHTML = `<p class="text-gray-500 italic p-4">${_('contractor_no_projects')}</p>`; return; } const sorted = [...allContractorsData].sort((a, b) => (b.rating || 0) - (a.rating || 0)); sorted.forEach(c => { const projs = allProjectsData.filter(p => String(p.contractorId) === String(c.id)); const items = projs.length > 0 ? projs.map(p => `<li class="text-xs">${p.name||_('Unnamed Project')} (${p.status||'N/A'})</li>`).join('') : `<li class="text-xs italic">${_('contractor_no_projects')}</li>`; const rating = getContractorRating(c.id); const card = `<div class="list-card"><h3>${c.name||_('Unnamed Contractor')}</h3><p class="text-xs text-gray-600 mt-1 mb-1"><span class="font-medium">${_('contractor_rating')}:</span> <span class="font-bold text-yellow-500">${rating} ★</span></p><p class="text-xs text-gray-600 mb-2"><span class="font-medium">${_('contractor_projects_completed')}:</span> ${c.projectsCompleted||0}</p><div class="mt-2 border-t border-gray-100 pt-2"><h4 class="text-xs font-semibold text-gray-700 mb-1">${_('contractor_current_projects')}</h4><ul class="list-disc list-inside text-xs space-y-0.5 pl-2">${items}</ul></div></div>`; list.innerHTML += card; }); }
function populateProjectSelect() { const sel = document.getElementById('report-project'); const curVal = sel.value; sel.innerHTML = ''; const ph = document.createElement('option'); ph.value = ""; ph.textContent = _('report_select_placeholder'); ph.selected = !curVal; ph.disabled = false; sel.appendChild(ph); if (!Array.isArray(allProjectsData) || allProjectsData.length === 0) return; const sorted = [...allProjectsData].sort((a, b) => (a.name||'').localeCompare(b.name||'')); sorted.forEach(p => { const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name||_('Unnamed Project'); opt.selected = String(p.id) === curVal; sel.appendChild(opt); }); if (sel.value !== "") ph.disabled = true; sel.addEventListener('change', function() {const p = this.querySelector('option[value=""]'); if(this.value !== "" && p) p.disabled = true;}, { once: true }); }
function displayCitizenReports() { const list = document.getElementById('reports-list'); list.innerHTML = ''; if (!Array.isArray(allReportsData) || allReportsData.length === 0) { list.innerHTML = `<p class="text-gray-500 italic text-sm">${_('report_no_reports')}</p>`; return; } const recent = allReportsData.slice(0, 5); // Show only recent 5 in report section
     recent.forEach(r => { const pName = getProjectName(r.projectId); const date = r.date ? new Date(r.date).toLocaleString(_('locale_code', 'ru-RU'), {dateStyle:'medium', timeStyle:'short'}) : 'N/A'; const loc = r.location ? ` | <span class="whitespace-nowrap">${_('report_card_location')}: ${r.location.lat.toFixed(4)}, ${r.location.lon.toFixed(4)}</span>` : ''; const photo = r.photoPath ? `<div class="mt-2"><a href="${r.photoPath}" target="_blank" title="${_('report_card_photo')}"><img src="${r.photoPath}" alt="${_('report_card_photo')} for ${pName}" class="max-h-32 max-w-full rounded border border-gray-200 shadow-sm" loading="lazy"></a></div>` : ''; const el = `<div class="border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"><p class="text-sm font-medium text-gray-800 mb-0.5">${pName}</p><p class="text-sm text-gray-700 mb-1 break-words">${r.comment||''}</p>${photo}<p class="text-xs text-gray-500 mt-1"><span class="whitespace-nowrap">${_('report_card_date')}: ${date}</span>${loc}</p></div>`; list.innerHTML += el; }); }
async function displayPublicReports(filterProjectId = null) { const list = document.getElementById('public-reports-list'); const title = document.getElementById('public-reports-title'); const btn = document.getElementById('show-all-reports-button'); list.innerHTML = `<p class="text-gray-500 italic p-4">${_('Loading reports...')}</p>`; let isFiltered = false; await loadReports(filterProjectId); let data = allReportsData; if (filterProjectId !== null) { isFiltered = true; const p = allProjectsData.find(proj => String(proj.id) === String(filterProjectId)); const pName = p ? p.name : `ID ${filterProjectId}`; title.textContent = _('public_reports_title_filtered', { projectName: pName }); btn.classList.remove('hidden'); } else { title.textContent = _('public_reports_title'); btn.classList.add('hidden'); } list.innerHTML = ''; if (!Array.isArray(data) || data.length === 0) { list.innerHTML = `<p class="text-gray-500 italic p-4">${_(isFiltered ? 'report_no_reports_for_project' : 'report_no_reports')}</p>`; return; } data.forEach(r => { const pName = getProjectName(r.projectId); const date = r.date ? new Date(r.date).toLocaleString(_('locale_code', 'ru-RU'), {dateStyle:'medium', timeStyle:'short'}) : 'N/A'; const dateIcon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M4 1.75a.75.75 0 01.75-.75h6.5a.75.75 0 01.75.75V3h1.75A1.75 1.75 0 0115.5 4.75v8.5A1.75 1.75 0 0113.75 15H2.25A1.75 1.75 0 01.5 13.25v-8.5A1.75 1.75 0 012.25 3H4V1.75zM2 6.25v7A.25.25 0 002.25 13.5h11.5a.25.25 0 00.25-.25v-7H2zM14 4.75a.25.25 0 00-.25-.25H2.25a.25.25 0 00-.25.25V5h12V4.75z" clip-rule="evenodd"></path></svg>`; const projectIcon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path d="M3.75 2a.75.75 0 00-1.5 0v12c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V8.75a.75.75 0 00-1.5 0v4.5h-9v-11h3V2H3.75z"></path><path d="M8.75 2a.75.75 0 000 1.5h3.56l-7.22 7.22a.75.75 0 101.06 1.06L13.5 4.31V7.75a.75.75 0 001.5 0V2.75a.75.75 0 00-.75-.75H8.75z"></path></svg>`; const locationIcon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M7.586 3.293a.75.75 0 011.06 0l5.5 5.5a.75.75 0 01-1.06 1.06L8.5 5.267V13.5a.75.75 0 01-1.5 0V5.267L2.47 9.854a.75.75 0 11-1.06-1.06l5.5-5.5z" clip-rule="evenodd"></path></svg>`; const locHtml = r.location ? `<span class="whitespace-nowrap flex items-center">${locationIcon}${_('report_card_location')}: ${r.location.lat.toFixed(4)}, ${r.location.lon.toFixed(4)}</span>` : ''; const photoHtml = r.photoPath ? `<div class="mt-2"><a href="${r.photoPath}" target="_blank" title="${_('report_card_photo')}"><img src="${r.photoPath}" alt="${_('report_card_photo')} for ${pName}" class="max-h-48 max-w-full rounded border border-gray-300 shadow-sm hover:shadow-md transition-shadow" loading="lazy"></a></div>` : ''; const card = `<div class="list-card"><h4>${_('report_card_comment')}:</h4><p class="text-gray-800 mb-2 break-words">${r.comment||''}</p>${photoHtml}<div class="report-card-meta flex flex-wrap items-center gap-x-4 gap-y-1 mt-3"><span class="whitespace-nowrap flex items-center">${dateIcon}${_('report_card_date')}: ${date}</span><span class="whitespace-nowrap flex items-center">${projectIcon}${_('report_card_project')}: ${pName}</span>${locHtml||''}</div></div>`; list.innerHTML += card; }); }


// --- Логика переключения секций ---
async function showSection(sectionId, forceRefreshReports = false) {
    // Hide all sections first
    document.querySelectorAll('.content-section').forEach(section => {
        if (!section.classList.contains('hidden')) {
            section.classList.add('hidden');
            section.style.opacity = 0; // Reset style for transition
            section.style.transform = 'translateY(20px)'; // Reset style for transition
        }
    });

    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
         sectionToShow.classList.remove('hidden');
         // Trigger reflow before applying transition styles
         requestAnimationFrame(() => { requestAnimationFrame(() => {
             sectionToShow.style.opacity = 1;
             sectionToShow.style.transform = 'translateY(0)';
         }); });
    }

    // Update active tab in header (only for main navigation tabs)
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('tab-active');
         if (tab.dataset.section && tab.dataset.section === sectionId) {
             tab.classList.add('tab-active');
         }
    });

    // Actions specific to the shown section
    switch (sectionId) {
        case 'map-section': if (!map) initializeMap(); else setTimeout(() => { if(map) map.invalidateSize() }, 10); break; // Ensure map resizes correctly
        case 'projects-section': displayProjectsInList(); break; // Refresh list
        case 'contractors-section': displayContractors(); break; // Refresh list
        case 'citizen-reports-public-section': await displayPublicReports(forceRefreshReports ? null : undefined); break; // Refresh public reports
        case 'report-section': populateProjectSelect(); displayCitizenReports(); getGeolocation(); break; // Prepare report form
        // quiz-section case removed
        case 'registration-info-section': /* Handled by startRegistrationProcess */ break;
        case 'register-section': /* Logic handled by proceedToRegistration */ break;
        case 'login-section': /* Logic handled by showLoginForm */ break;
    }

    // Scroll to top for non-map/modal sections
    if (!['map-section', 'registration-info-section', 'register-section', 'login-section'].includes(sectionId)) {
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMobileMenu(); // Close mobile menu on section change
}

// --- Показ отчетов по проекту ---
function showProjectReports(projectId) { const pid = String(projectId); showSection('citizen-reports-public-section', false); displayPublicReports(pid); }

// --- Геолокация ---
function getGeolocation() { const statusEl=document.getElementById('geolocation-status'),latIn=document.getElementById('report-latitude'),lonIn=document.getElementById('report-longitude'); statusEl.textContent=_( 'report_geolocation_fetching');statusEl.className='text-sm text-gray-500';latIn.value='';lonIn.value=''; if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>{latIn.value=p.coords.latitude.toFixed(6);lonIn.value=p.coords.longitude.toFixed(6);statusEl.textContent=`${_('report_geolocation_success')}: ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`;statusEl.className='text-sm text-green-600';},e=>{console.error("Geo Err:",e.code,e.message);let k='report_geolocation_error'; if(e.code===1)k='report_geolocation_permission_denied';else if(e.code===2)k='report_geolocation_unavailable';else if(e.code===3)k='report_geolocation_timeout'; statusEl.textContent=_(k);statusEl.className='text-sm text-red-600';},{enableHighAccuracy:true,timeout:10000,maximumAge:0});}else{statusEl.textContent=_( 'report_geolocation_unsupported');statusEl.className='text-sm text-red-600';}}

// --- Год в подвале ---
function updateFooterYear() { document.getElementById('footer-year').textContent = new Date().getFullYear(); }

// --- Мобильное меню ---
function closeMobileMenu() { document.getElementById('mobile-menu')?.classList.add('hidden'); }

// --- Уведомления ---
function showMessage(msgOrKey, type = 'info', duration = 3500) { const box = document.getElementById('message-box'); if (!box) return; let txt = _(msgOrKey); // Always try to translate
   box.textContent = txt; box.className = `message-box ${type}`; box.style.display = 'none'; void box.offsetWidth; // Trigger reflow
   box.style.display = ''; box.classList.add('show'); if (box.timerId) clearTimeout(box.timerId); box.timerId = setTimeout(() => box.classList.remove('show'), duration); }


// --- ФУНКЦИИ КВИЗА (showQuiz, renderQuizQuestions, submitQuiz) УДАЛЕНЫ ---


// --- ФУНКЦИИ для Входа ---
function showLoginForm() {
    showSection('login-section'); // Show login section
    // Add submit listener to login form NOW, removing old ones
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);
        document.getElementById('login-form').addEventListener('submit', submitLogin);
    }
}

async function submitLogin(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.elements['email'];
    const passwordInput = form.elements['password'];
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage(_('message_error_form'), 'error');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = _('Submitting...');

    console.log("Attempting login with email:", email); // Debugging

    // --- !!! РЕАЛЬНЫЙ ВЫЗОВ API !!! ---
    // Заменяем плейсхолдер на вызов sendData
    const result = await sendData('users/login', 'POST', { email, password }); // Предполагаем эндпоинт /api/users/login
    // --- КОНЕЦ РЕАЛЬНОГО ВЫЗОВА API ---

    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;

    if (result && result.success) { // Check if result is not null and successful
        showMessage(_('login_success_message'), 'success');

        // Store token and user info (e.g., in localStorage) - РАСКОММЕНТИРОВАТЬ И АДАПТИРОВАТЬ ПРИ НЕОБХОДИМОСТИ
        // localStorage.setItem('authToken', result.token);
        // localStorage.setItem('userEmail', result.user.email);

        // Update UI (header buttons, etc.)
        updateHeaderUI(true, result.user?.email || email); // true = logged in, use email from result or input as fallback

        // Redirect to landing page or dashboard
        showSection('landing-section', true);
        form.reset(); // Clear login form

    } else {
        // Show error from backend or generic one
        showMessage(result?.message || _('login_error_generic'), 'error');
    }
}

// --- Function to update Header UI based on login state ---
function updateHeaderUI(isLoggedIn, userEmail = null) {
    const headerAuthContainer = document.querySelector('header .flex.items-center.space-x-3'); // Container for buttons/lang
    const mobileAuthContainer = document.querySelector('#mobile-menu .border-t'); // Container in mobile menu

    if (!headerAuthContainer || !mobileAuthContainer) {
         console.error("Auth containers not found in header/mobile menu.");
         return;
    }

    // Get references to static buttons (might exist or not depending on initial HTML)
    const loginBtnHeader = headerAuthContainer.querySelector('button[data-lang-key="nav_login"]');
    const registerBtnHeader = headerAuthContainer.querySelector('button[data-lang-key="nav_register"]');
    const loginBtnMobile = mobileAuthContainer.querySelector('button[data-lang-key="nav_login"]');
    const registerBtnMobile = mobileAuthContainer.querySelector('button[data-lang-key="nav_register"]');


    // Remove previously added dynamic elements if they exist
     document.getElementById('user-info-header')?.remove();
     document.getElementById('logout-button-header')?.remove();
     document.getElementById('user-info-mobile')?.remove();
     document.getElementById('logout-button-mobile')?.remove();

    // Hide static login/register buttons initially
    if (loginBtnHeader) loginBtnHeader.style.display = 'none';
    if (registerBtnHeader) registerBtnHeader.style.display = 'none';
    if (loginBtnMobile) loginBtnMobile.style.display = 'none';
    if (registerBtnMobile) registerBtnMobile.style.display = 'none';


    // --- Add elements based on login state ---
    if (isLoggedIn) {
        // --- Header (Desktop) ---
        const langDropdown = headerAuthContainer.querySelector('.lang-dropdown'); // Find anchor point

         // User Info (Email)
        const userInfoHeader = document.createElement('span');
        userInfoHeader.id = 'user-info-header';
        userInfoHeader.className = 'text-sm text-gray-600 hidden md:inline-block mr-3'; // Show on MD+, add margin
        userInfoHeader.textContent = userEmail || 'User';
        if (langDropdown) { // Insert before language dropdown if found
            headerAuthContainer.insertBefore(userInfoHeader, langDropdown);
        } else { // Append if dropdown not found (fallback)
             headerAuthContainer.appendChild(userInfoHeader);
        }


         // Logout Button
        const logoutButtonHeader = document.createElement('button');
        logoutButtonHeader.id = 'logout-button-header';
        logoutButtonHeader.className = 'btn btn-secondary btn-sm py-1.5 px-4 text-xs hidden md:inline-flex'; // Use existing styles
        logoutButtonHeader.textContent = _('nav_logout');
        logoutButtonHeader.onclick = logout;
         if (langDropdown) { // Insert before language dropdown
            headerAuthContainer.insertBefore(logoutButtonHeader, langDropdown);
         } else { // Append if dropdown not found
             headerAuthContainer.appendChild(logoutButtonHeader);
         }



        // --- Mobile Menu ---
         // User Info (Email)
        const userInfoMobile = document.createElement('span');
        userInfoMobile.id = 'user-info-mobile';
        userInfoMobile.className = 'block w-full text-left px-3 py-2 text-base font-medium text-gray-500'; // Style as needed
        userInfoMobile.textContent = userEmail || 'User';
        mobileAuthContainer.appendChild(userInfoMobile); // Append to mobile auth container



         // Logout Button
        const logoutButtonMobile = document.createElement('button');
        logoutButtonMobile.id = 'logout-button-mobile';
        // Style like other mobile menu buttons
        logoutButtonMobile.className = 'block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50';
        logoutButtonMobile.textContent = _('nav_logout');
        logoutButtonMobile.onclick = () => { logout(); closeMobileMenu(); };
        mobileAuthContainer.appendChild(logoutButtonMobile); // Append to mobile auth container

    } else {
        // --- Show Login/Register Buttons ---
         // Header
         if (loginBtnHeader) loginBtnHeader.style.display = 'inline-flex';
         if (registerBtnHeader) registerBtnHeader.style.display = 'inline-flex';
         // Mobile
         if (loginBtnMobile) loginBtnMobile.style.display = 'block';
         if (registerBtnMobile) registerBtnMobile.style.display = 'block';
    }
}

// --- Logout Function ---
function logout() {
    // Clear stored token/user info - РАСКОММЕНТИРОВАТЬ И АДАПТИРОВАТЬ ПРИ НЕОБХОДИМОСТИ
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('userEmail');

    // Update UI
    updateHeaderUI(false); // false = logged out

    // Show message and redirect
    showMessage(_('logout_success_message'), 'info');
    showSection('landing-section', true); // Go to home page
}


// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// Отправка формы отчета
document.getElementById('report-form').addEventListener('submit', async function(event) {
    event.preventDefault(); const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const span = submitButton.querySelector('span'); // Assuming text is inside a span
    const origTxt = span ? span.textContent : submitButton.textContent; // Get original text

    submitButton.disabled = true;
    if(span) span.textContent = _('Submitting...'); else submitButton.textContent = _('Submitting...');


    const projectId = form.elements['project'].value, comment = form.elements['comment'].value.trim();
    const photoInput = form.elements['report-photo'], lat = form.elements['latitude'].value, lon = form.elements['longitude'].value;

    if (!projectId || !comment) {
        showMessage(_('message_error_form'), 'error');
        submitButton.disabled = false;
        if(span) span.textContent = origTxt; else submitButton.textContent = origTxt; // Restore original text
        return;
    }

    const formData = new FormData(); formData.append('projectId', projectId); formData.append('comment', comment);
    if (lat && lon) { formData.append('latitude', lat); formData.append('longitude', lon); }
    if (photoInput.files.length > 0) formData.append('report-photo', photoInput.files[0]);

    try {
        // Use sendData for consistency (handles FormData)
        const result = await sendData('reports', 'POST', formData, true); // true indicates FormData
         if (!result) throw new Error(_('Error submitting report. Please try again.')); // Handle null return from sendData

         showMessage(_('message_success'), 'success'); form.reset();
         // Reset project dropdown
         const projSel = form.elements['project']; projSel.value = ""; if(projSel.options[0]) { projSel.options[0].disabled=false; projSel.options[0].selected=true; }
         // Reset geolocation status
         const geoStat = document.getElementById('geolocation-status'); geoStat.textContent = ''; // Clear status after success
         geoStat.className = 'text-sm text-gray-500'; // Reset class
         // Reload and display reports
         await loadReports(); displayCitizenReports();
         // Update project data if backend indicates changes
         if (result.updatedProject) {
             const idx = allProjectsData.findIndex(p => String(p.id) === String(result.updatedProject.id));
             if (idx !== -1) { allProjectsData[idx] = result.updatedProject; displayProjectsInList(); if(map) displayProjectsOnMap(); }
         }
         // Refresh public reports view if it's the active section
         const activeSect = document.querySelector('.content-section:not(.hidden)')?.id;
         if (activeSect === 'citizen-reports-public-section') {
              const title = document.getElementById('public-reports-title').textContent;
              const filtered = title !== _('public_reports_title'); // Check if currently filtered
              await displayPublicReports(filtered ? projectId : null); // Reload with or without filter
         }
         getGeolocation(); // Re-fetch geolocation for next report
    } catch (error) { console.error("Ошибка отправки:", error); showMessage(error.message || _('Error submitting report. Please try again.'), 'error', 5000);
    } finally {
        submitButton.disabled = false;
        if(span) span.textContent = origTxt; else submitButton.textContent = origTxt; // Restore original text
    }
});

// Поиск проектов
document.getElementById('project-search').addEventListener('input', function(e) { const term = e.target.value.toLowerCase().trim(); if (!Array.isArray(allProjectsData)) return; const filtered = allProjectsData.filter(p => (p.name||'').toLowerCase().includes(term) || getContractorName(p.contractorId).toLowerCase().includes(term)); displayProjectsInList(filtered); });

// Кнопка мобильного меню
document.getElementById('mobile-menu-button').addEventListener('click', () => document.getElementById('mobile-menu')?.classList.toggle('hidden'));

// --- Инициализация при загрузке страницы ---
document.addEventListener('DOMContentLoaded', async () => {
    // Determine and set initial language
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (languages[browserLang] ? browserLang : 'ru');
    await setLanguage(initialLang); // Set language first for loading messages

    try {
        await loadInitialData(); // Load all necessary data (shows loading indicators)

        // Render data after successful loading
        displayProjectsInList();
        displayContractors();
        populateProjectSelect();
        displayCitizenReports(); // Display recent reports in report section
        await displayPublicReports(); // Display all public reports initially

        // Check initial login state - РАСКОММЕНТИРОВАТЬ И АДАПТИРОВАТЬ ПРИ НЕОБХОДИМОСТИ
        // const storedToken = localStorage.getItem('authToken');
        // const storedEmail = localStorage.getItem('userEmail');
        // if (storedToken && storedEmail) {
        //    updateHeaderUI(true, storedEmail); // User is logged in
        // } else {
        //    updateHeaderUI(false); // User is not logged in
        // }
        // --- Placeholder: Assume logged out initially ---
        updateHeaderUI(false);
        // --- End Placeholder ---

        // Add listeners for static buttons that trigger flows
        const registerButton = document.querySelector('button[data-lang-key="nav_register"]'); // Assuming register button has this key
        if(registerButton) registerButton.addEventListener('click', startRegistrationProcess);

        const loginButton = document.querySelector('button[data-lang-key="nav_login"]'); // Assuming login button has this key
        if(loginButton) loginButton.addEventListener('click', showLoginForm);

        // Add listener for the "Continue Registration" button in the info section
        // Ensure this button has an ID or a unique selector
        const continueRegButton = document.getElementById('reginfo-continue-button'); // Assuming you add id="reginfo-continue-button" to this button in HTML
         if(continueRegButton) {
             continueRegButton.addEventListener('click', proceedToRegistration);
         } else {
             // Fallback if ID isn't set - find by lang key (less reliable if key used elsewhere)
             const continueRegButtonByKey = document.querySelector('button[data-lang-key="reginfo_continue_button"]');
             if (continueRegButtonByKey) {
                  continueRegButtonByKey.addEventListener('click', proceedToRegistration);
             }
         }

        // Add listeners for navigation tabs/buttons to show sections
         document.querySelectorAll('.tab[data-section]').forEach(tab => {
             tab.addEventListener('click', (e) => {
                 e.preventDefault();
                 showSection(tab.dataset.section, true); // Force refresh reports if navigating to reports tab
             });
         });
         // Add listeners for other buttons that trigger section changes (e.g., landing page CTAs)
         document.querySelectorAll('button[data-section-target]').forEach(button => {
              button.addEventListener('click', () => {
                  const targetSection = button.dataset.sectionTarget;
                  if (targetSection === 'report-section') {
                      showSection(targetSection); // Show report section
                  } else if (targetSection === 'map-section') {
                       showSection(targetSection); // Show map
                  } else if (targetSection === 'projects-section') {
                       showSection(targetSection); // Show projects
                  }
                  // Add more else if clauses for other buttons/targets if needed
              });
         });
         // Add language switcher listeners
          document.querySelectorAll('.lang-switcher a').forEach(link => {
              link.addEventListener('click', (e) => {
                  e.preventDefault();
                  const lang = e.target.dataset.lang;
                  if (lang) {
                      setLanguage(lang);
                      // Optional: Close dropdown if inside one
                      const dropdown = e.target.closest('.lang-dropdown');
                      if (dropdown) {
                        // Simple hide logic might be needed depending on dropdown implementation
                      }
                  }
              });
          });


        showSection('landing-section', false); // Show landing page initially
        getGeolocation(); // Attempt to get geolocation for the report form
        updateFooterYear(); // Set current year in footer

    } catch (error) {
        // Handle critical data loading errors
        console.error("Critical error during initial load:", error);
        const main = document.querySelector('main');
        if(main) main.innerHTML = `<div class="p-8 text-center text-red-600 bg-red-100 rounded-lg"><h2 class="text-xl font-semibold mb-2">${_('Failed to Load Application Data')}</h2><p>${error.message || _('Please check your connection and refresh the page.')}</p></div>`;
    }
});