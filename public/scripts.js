window.addEventListener('DOMContentLoaded', () => {

    console.log("DOM готов. Запускаем скрипт v6.0 PurchaseLikelihoodAnalysis (Хакатон)...");

    // --- Элементы DOM ---
    const videoContainer = document.getElementById("videoContainer");
    const statusText = document.getElementById("statusText");
    const registrationForm = document.getElementById("registrationForm");
    const clientIdInput = document.getElementById("clientId");
    const visitTimeInput = document.getElementById("visitTime");
    const clientNameInput = document.getElementById("clientName");
    const clientAgeInput = document.getElementById("clientAge");
    const clientGenderInput = document.getElementById("clientGender");
    const clientPhoneInput = document.getElementById("clientPhone");
    const clientPurposeInput = document.getElementById("clientPurpose");
    const saveRegFormButton = document.getElementById("saveRegFormButton");
    const closeRegFormButton = document.getElementById("closeRegFormButton");
    const dossierDisplayPanel = document.getElementById("dossierDisplayPanel");
    const dossierId = document.getElementById("dossierId");
    const dossierName = document.getElementById("dossierName");
    const dossierAge = document.getElementById("dossierAge");
    const dossierGender = document.getElementById("dossierGender");
    const dossierPhone = document.getElementById("dossierPhone");
    const dossierClientIdDisplay = document.getElementById("dossierClientIdDisplay");
    const dossierVisitHistory = document.getElementById("dossierVisitHistory");
    const closeDossierButton = document.getElementById("closeDossierButton");
    const dashboardContent = document.getElementById("dashboardContent");
    const recentVisitsTitle = document.getElementById("recentVisitsTitle");
    const recentVisitsContent = document.getElementById("recentVisitsContent");

    // Проверка элементов
    const allElements = { videoContainer, statusText, registrationForm, clientIdInput, visitTimeInput, clientNameInput, clientAgeInput, clientGenderInput, clientPhoneInput, clientPurposeInput, saveRegFormButton, closeRegFormButton, dossierDisplayPanel, dossierId, dossierName, dossierAge, dossierGender, dossierPhone, dossierClientIdDisplay, dossierVisitHistory, closeDossierButton, dashboardContent, recentVisitsTitle, recentVisitsContent };
    let allDomElementsFound = true;
    for (const key in allElements) {
        if (!allElements[key]) {
            console.error(`CRITICAL ERROR: DOM Element with ID '${key}' not found! Check index.html.`);
            allDomElementsFound = false;
        }
    }
    if (allDomElementsFound) {
        console.log("Все ключевые элементы DOM успешно найдены.");
    } else {
        alert("Критическая ошибка: Не все элементы DOM найдены. Проверьте index.html и консоль разработчика (F12).");
        return;
    }

    const video = document.createElement("video");
    video.autoplay = true; video.muted = true; video.width = 720; video.height = 560;
    if (videoContainer) {
        videoContainer.appendChild(video);
    } else {
        console.error("videoContainer не найден, видео не может быть добавлено.");
        return;
    }

    let canvas;
    let clientDataMap = new Map();
    let labels = [];
    let faceMatcher = null;
    let detectionInterval = null;

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЛОГИКИ ---
    let activeClients = new Map();
    const INACTIVITY_TIMEOUT = 10000;
    const ZONE_THRESHOLD = 3000;
    let sessionCounter = 0;
    let isFormOpen = false;
    let isDossierOpen = false;
    let formLinkedClientId = null;

    // !!! ВАЖНО: УКАЖИТЕ ПРАВИЛЬНЫЕ КООРДИНАТЫ И budgetCategory ДЛЯ ВАШИХ ЗОН !!!
    const interestZones = {
        'Model_S': { x1: 50, y1: 100, x2: 250, y2: 400, name: 'Седан "Элегант"', budgetCategory: 'premium' },
        'Model_X': { x1: 450, y1: 100, x2: 670, y2: 400, name: 'Внедорожник "Простор"', budgetCategory: 'mid-range' },
        'Model_3': { x1: 260, y1: 300, x2: 440, y2: 500, name: 'Спорткар "Скорость"', budgetCategory: 'budget' },
        'Negotiation_Table': { x1: 300, y1: 10, x2: 420, y2: 80, name: 'Стол переговоров', budgetCategory: null } // Бюджет не применим
    };
    const REGISTRATION_DELAY = 5000;

    // --- Переменные для сглаживания возраста ---
    const MIN_FACE_AREA_FOR_RELIABLE_AGE = 12000; 
    const AGE_READINGS_BUFFER_SIZE = 15;

    // --- Переменные для последних визитов на дашборде ---
    let recentVisitSummaries = [];
    const MAX_SUMMARIES = 3;

    // --- Переменные для незарегистрированных ---
    let unregisteredFaces = new Map();
    let unregIdCounter = 0;
    const MAX_DESCRIPTORS_PER_UNREGISTERED = 3;
    const SIMILARITY_THRESHOLD_FOR_UNREGISTERED_MATCH = 0.52; 
    const MIN_TIME_TO_SAVE_UNKNOWN_AS_UNREG = 6000;    
    const MIN_FACE_AREA_TO_SAVE_AS_UNREG = 10000;      
    const MIN_DISTANCE_FOR_NEW_UNREG_DESCRIPTOR = 0.3; 
    const MIN_QUALITY_DESCRIPTORS_TO_SAVE_UNREG = 1; 
    const MAX_TEMP_DESCRIPTORS_FOR_UNKNOWN = 5;    

    // Отладка
    const DEBUG_SPECIFIC_PERSON = false;
    const DEBUG_PERSON_LABEL = "ИМЯ_ПРОБЛЕМНОГО_ЧЕЛОВЕКА";

    if (typeof faceapi === 'undefined') {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Библиотека face-api.min.js не загружена!");
        if(statusText) statusText.innerText = "ОШИБКА: face-api.js не найден!";
        return;
    }

    // --- Вспомогательные функции ---
    function generateClientId() { return `NEW-${Date.now().toString().slice(-6)}`; }

    function calculateMedian(arr) {
        if (!arr || arr.length === 0) return null;
        const sorted = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        return Math.round(median);
    }
    
    function getRepresentativeDescriptor(descriptors) {
        if (!descriptors || descriptors.length === 0) return null;
        if (descriptors.length === 1) return descriptors[0];
        let bestIndex = 0; let minAvgDistance = Infinity;
        for (let i = 0; i < descriptors.length; i++) {
            let currentSumDistances = 0;
            for (let j = 0; j < descriptors.length; j++) {
                if (i === j) continue;
                currentSumDistances += faceapi.euclideanDistance(descriptors[i], descriptors[j]);
            }
            const avgDistance = currentSumDistances / (descriptors.length - 1);
            if (avgDistance < minAvgDistance) { minAvgDistance = avgDistance; bestIndex = i; }
        }
        return descriptors[bestIndex];
    }

    // --- Функции отслеживания ---
    function createClientState(label, descriptor, detection, isKnown = false) {
        const now = Date.now();
        const initialAge = detection.age ? Math.round(detection.age) : '?';
        const initialBox = detection.detection?.box;
        const initialArea = initialBox ? initialBox.width * initialBox.height : 0;
        return {
            id: label, descriptor: descriptor, isKnown: isKnown, entryTime: now, lastSeen: now, timeSpent: 0,
            currentZone: null, zoneEntryTime: null, viewedModels: new Map(),
            age: initialAge, ageReadings: (detection.age && initialArea > MIN_FACE_AREA_FOR_RELIABLE_AGE) ? [detection.age] : [],
            isAgeReliable: (detection.age && initialArea > MIN_FACE_AREA_FOR_RELIABLE_AGE),
            tempQualityDescriptors: [], gender: detection.gender || '?', box: initialBox,
            emotionsHistory: [], dominantEmotion: 'neutral', registrationTriggered: false,
        };
    }

    function checkZone(box, zones) {
        if (!box) return null;
        const centerX = box.x + box.width / 2; const centerY = box.y + box.height / 2;
        for (const zoneKey in zones) {
            const zone = zones[zoneKey];
            if (centerX >= zone.x1 && centerX <= zone.x2 && centerY >= zone.y1 && centerY <= zone.y2) { return zoneKey; }
        }
        return null;
    }

    // --- Функции отрисовки ---
    function drawZones(ctx, zones) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)'; ctx.lineWidth = 1; ctx.font = '13px Inter';
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        for (const zoneKey in zones) {
            const z = zones[zoneKey];
            ctx.strokeRect(z.x1, z.y1, z.x2 - z.x1, z.y2 - z.y1);
            ctx.fillText(z.name, z.x1 + 5, z.y1 + 15);
        }
    }

    function drawClientInfo(ctx, box, client) {
        if (!box || !client) return;
        const lines = [];
        let nameToDisplay = client.id;
        if (client.isKnown) { nameToDisplay = clientDataMap.get(client.id)?.name || client.id; }
        else if (client.id.startsWith('unreg_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]} (не зарег.)`; }
        else if (client.id.startsWith('unknown_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]}`; }

        const genderMap = { 'male': 'М', 'female': 'Ж', '?': '?' };
        let ageTextForCanvas = (client.age !== '?') ? `~${client.age}` : '?';
        if (client.age !== '?' && !client.isAgeReliable) { ageTextForCanvas += " (оц.)"; }
        lines.push(`${nameToDisplay} (${genderMap[client.gender]}, ${ageTextForCanvas})`);
        const timeInSalon = ((Date.now() - client.entryTime) / 1000).toFixed(0);
        lines.push(`Время: ${timeInSalon} сек`);
        if (client.currentZone && interestZones[client.currentZone]) { lines.push(`Зона: ${interestZones[client.currentZone].name}`); }
        lines.push(`Эмоция: ${client.dominantEmotion}`);
        new faceapi.draw.DrawTextField(lines, box.topLeft, {
            backgroundColor: 'rgba(22, 27, 34, 0.8)', fontColor: '#C9D1D9', fontSize: 13, padding: 6
        }).draw(ctx);
    }
    
    // --- НОВАЯ ФУНКЦИЯ АНАЛИЗА ВЕРОЯТНОСТИ ПОКУПКИ ---
    function analyzePurchaseLikelihood(client, allCurrentlyActiveClients) {
        let likelihood = 'не определена';
        let preferredBudget = 'любой';
        let reason = [];

        const age = (client.age !== '?') ? parseInt(client.age) : null;
        const gender = client.gender;

        if (gender === 'male' && age !== null) {
            if (age >= 18 && age <= 25) {
                let accompanied = false;
                if (allCurrentlyActiveClients && allCurrentlyActiveClients.size > 1) {
                    for (const [otherId, otherClient] of allCurrentlyActiveClients.entries()) {
                        if (otherId === client.id || !otherClient.entryTime) continue;
                        if (Math.abs(client.entryTime - otherClient.entryTime) < 20000) { // 20 сек разница во входе
                            accompanied = true;
                            reason.push("Пришел не один (предположительно).");
                            break;
                        }
                    }
                }
                if (accompanied) {
                    likelihood = 'высокий'; preferredBudget = 'budget'; // Бюджетные модели
                    reason.push("Возраст 18-25(М), с кем-то.");
                } else {
                    likelihood = 'очень низкий'; reason.push("Возраст 18-25(М), один.");
                }
            } else if (age > 25 && age <= 35) {
                likelihood = 'средний'; reason.push("Возраст 25-35(М).");
            } else if (age > 35 && age <= 45) {
                likelihood = 'высокий'; reason.push("Возраст 35-45(М).");
            } else {
                likelihood = 'средний (вне фокус-группы)'; reason.push("Мужчина, возраст вне основных фокус-групп.");
            }
        } else if (gender === 'female' && age !== null) {
            // Примерные правила для женщин, можно расширить
            if (age >= 28 && age <= 45) {
                likelihood = 'средний'; reason.push("Возраст 28-45(Ж).");
            } else {
                likelihood = 'низкий (вне фокус-группы)'; reason.push("Женщина, возраст вне фокус-группы.");
            }
        } else {
            reason.push("Пол/возраст не определены точно для профилирования.");
        }

        const negotiationZoneName = interestZones['Negotiation_Table']?.name || 'Стол переговоров';
        const negotiationTimeSec = (client.viewedModels.get(negotiationZoneName) || 0) / 1000;

        if (negotiationTimeSec > 45) { // Увеличил порог для стола
            const highLikelihoods = ['высокий', 'очень высокий'];
            const mediumLikelihoods = ['средний', 'средний (вне фокус-группы)', 'средний (Ж)'];
            if (highLikelihoods.includes(likelihood) || mediumLikelihoods.includes(likelihood)) {
                likelihood = 'очень высокий'; reason.push("Длительное время у стола переговоров.");
            } else { // если был низкий или очень низкий
                likelihood = 'средний'; reason.push("Проявил интерес к переговорам, повышая шанс.");
            }
        }
        
        if (likelihood === 'высокий' && preferredBudget === 'budget') {
            let showedInterestInBudgetModels = false;
            client.viewedModels.forEach((time, modelNameKey) => { // modelNameKey здесь это имя зоны
                let modelBudgetCategory = null;
                for(const zoneKey in interestZones){
                    if(interestZones[zoneKey].name === modelNameKey){
                        modelBudgetCategory = interestZones[zoneKey].budgetCategory;
                        break;
                    }
                }
                if (modelBudgetCategory === 'budget' && (time / 1000) > 15) {
                    showedInterestInBudgetModels = true;
                }
            });
            if (showedInterestInBudgetModels) { reason.push("Подтвержден интерес к бюджетным моделям."); }
            else { reason.push("Интерес к бюджетным моделям не зафиксирован, но группа риска покупки бюджетных авто.");}
        }
        return { likelihood, preferredBudget, reason: reason.join(' ') };
    }


    // --- Функция анализа (основная) ---
    function generateVisitSummary(client) {
        if (!client) return { details: "Нет данных о клиенте.", goal: "Не определена", recommendations: [] };
        const age = client.age;
        const gender = client.gender === 'male' ? 'М' : (client.gender === 'female' ? 'Ж' : '?');
        const timeSpent = (client.timeSpent / 1000);
        const interactions = client.viewedModels;
        const clientDominantEmotion = client.dominantEmotion;
        const negotiationZoneKey = 'Negotiation_Table';
        const negotiationZoneName = interestZones[negotiationZoneKey] ? interestZones[negotiationZoneKey].name : 'Стол переговоров';
        const negotiationTimeSec = (interactions.get(negotiationZoneName) || 0) / 1000;
        const significantCarsViewed = new Map();
        interactions.forEach((time, modelNameWithFlagOrZoneName) => {
            let modelName = modelNameWithFlagOrZoneName;
            if (modelNameWithFlagOrZoneName.endsWith('_INTEREST')) { modelName = modelNameWithFlagOrZoneName.replace('_INTEREST', '');}
            let isCarZoneName = false;
            for(const key in interestZones){ if(interestZones[key].name === modelName && key !== negotiationZoneKey){ isCarZoneName = true; break; } }
            if (isCarZoneName) {
                 const totalTimeForModelMs = interactions.get(modelName) || 0;
                if (totalTimeForModelMs / 1000 > 15) { significantCarsViewed.set(modelName, totalTimeForModelMs / 1000); }
            }
        });
        let inferredGoal = "Не определена";
        let nameToDisplay = client.id;
        if (client.isKnown) { nameToDisplay = clientDataMap.get(client.id)?.name || client.id; }
        else if (client.id.startsWith('unreg_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]} (не зарег.)`; }
        else if (client.id.startsWith('unknown_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]}`; }
        let details = `Клиент '${nameToDisplay}' (${gender}, ~${age}${client.age !== '?' && !client.isAgeReliable ? " (оценка)" : ""}) провел(а) ${timeSpent.toFixed(0)}с. `;
        let recommendations = [];
        if (negotiationTimeSec > 30) {
            if (significantCarsViewed.size > 0) {
                inferredGoal = "Обсуждение покупки / Консультация"; details += `Высокий интерес к: ${[...significantCarsViewed.keys()].join(', ')}. `;
                details += `Провел(а) у стола: ${negotiationTimeSec.toFixed(0)}с. (Возможно, обсуждался кредит).`;
            } else {
                inferredGoal = "Сервис / Финансы / Другой вопрос";
                details += `Не проявил(а) интереса к авто, но был(а) у стола ${negotiationTimeSec.toFixed(0)}с. (Возможно, кредит или сервис).`;
            }
        } else if (significantCarsViewed.size > 0) {
            inferredGoal = "Активное изучение моделей"; details += `Высокий интерес к: ${[...significantCarsViewed.keys()].join(', ')}. Не подходил(а) к столу.`;
        } else {
            let hasAnyCarInteraction = false;
            interactions.forEach((time, modelName) => {
                let isCarZoneName = false;
                for(const key in interestZones){ if(interestZones[key].name === modelName && key !== negotiationZoneKey){ isCarZoneName = true; break; } }
                if (isCarZoneName && !modelName.endsWith('_INTEREST')) hasAnyCarInteraction = true;
            });
            if (hasAnyCarInteraction) { inferredGoal = "Первичный осмотр / Сравнение"; details += `Кратко осмотрел(а) некоторые модели.`; }
            else { inferredGoal = "Ожидание / Случайный визит"; details += `Не проявил(а) интереса к зонам.`; }
        }
        const recommendationCandidates = [];
        significantCarsViewed.forEach((time, modelName) => {
            let score = time; let reason = `Проявлен интерес (${time.toFixed(0)}с).`;
            if (age !== '?' && age < 30 && client.gender === 'male' && modelName.toLowerCase().includes('спорткар')) {
                score += 50; reason += " Подходит молодому активному водителю.";
                if (clientDominantEmotion === 'happy') { score += 30; reason += " Вызвал положительные эмоции!"; }
            }
            if (age !== '?' && age >= 30 && age <= 50 && modelName.toLowerCase().includes('внедорожник')) {
                score += 40; reason += " Отличный выбор для семьи или активного отдыха.";
                if (inferredGoal === "Обсуждение покупки / Консультация") { score += 50; reason += " Серьезные намерения."; }
            }
            if (modelName.toLowerCase().includes('седан')) { score += 20; reason += " Классический и комфортный выбор."; }
            recommendationCandidates.push({ modelName, score, reason });
        });
        recommendationCandidates.sort((a, b) => b.score - a.score);
        if (recommendationCandidates.length > 0) {
            recommendations.push({ modelName: recommendationCandidates[0].modelName, reason: recommendationCandidates[0].reason });
            if (recommendationCandidates.length > 1 && recommendations.length < 2) {
                 recommendations.push({ modelName: recommendationCandidates[1].modelName, reason: recommendationCandidates[1].reason });
            }
        } else if (inferredGoal === "Первичный осмотр / Сравнение") {
            recommendations.push({ modelName: "Любая модель", reason: "Продолжите изучение, чтобы определиться с предпочтениями." });
        }
        if (recommendations.length > 0) {
            details += " Рекомендации: ";
            recommendations.forEach((rec, index) => { details += `${index + 1}) ${rec.modelName} (${rec.reason}) `; });
        }
        return { details: details, goal: inferredGoal, recommendations: recommendations };
    }

    // --- Функция отправки данных ---
    async function sendClientDataToServer(client) {
        if (!client) return;
        const viewed = {}; const significantInterest = {};
        const negotiationZoneKey = 'Negotiation_Table';
        const negotiationZoneName = interestZones[negotiationZoneKey] ? interestZones[negotiationZoneKey].name : 'Стол переговоров';
        const negotiationTime = (client.viewedModels.get(negotiationZoneName) || 0) / 1000;
        client.viewedModels.forEach((time, model) => {
            if (!model.endsWith('_INTEREST')) {
                 const timeSeconds = time / 1000;
                 viewed[model] = timeSeconds.toFixed(1) + 'c';
                 if (timeSeconds > 15 && model !== negotiationZoneName) { significantInterest[model] = timeSeconds.toFixed(1) + 'c'; }
            }
        });
        
        const { details, goal, recommendations } = generateVisitSummary(client);
        const purchaseAnalysis = analyzePurchaseLikelihood(client, activeClients); // Анализ вероятности покупки

        const dataToSend = {
            id: client.id, known: client.isKnown, age: client.age, isAgeReliable: client.isAgeReliable, gender: client.gender,
            entryTime: new Date(client.entryTime).toLocaleString('ru-RU'), exitTime: new Date().toLocaleString('ru-RU'),
            timeSpentSeconds: (client.timeSpent / 1000).toFixed(0), allViewedModels: viewed,
            significantInterest: significantInterest, negotiationTimeSeconds: negotiationTime.toFixed(0),
            inferredGoal: goal, summaryDetails: details, recommendations: recommendations,
            purchaseLikelihood: purchaseAnalysis.likelihood, // Добавляем результат анализа
            preferredBudgetCategory: purchaseAnalysis.preferredBudget,
            likelihoodReason: purchaseAnalysis.reason
        };
        console.log("ОТПРАВКА ДАННЫХ (с анализом покупки):", dataToSend);
        
        let nameForDisplay = client.id;
        if (client.isKnown) { nameForDisplay = clientDataMap.get(client.id)?.name || client.id; }
        else if (client.id.startsWith('unreg_')) { nameForDisplay = `Клиент ${client.id.split('_')[1]} (не зарег.)`; }
        else if (client.id.startsWith('unknown_')) { nameForDisplay = `Клиент ${client.id.split('_')[1] || '?'}`; }
        
        const summaryForDisplay = { 
            name: nameForDisplay, details: details, goal: goal, 
            purchaseLikelihood: purchaseAnalysis.likelihood, // Для дашборда
            likelihoodReason: purchaseAnalysis.reason, // Для дашборда
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) 
        };
        recentVisitSummaries.unshift(summaryForDisplay);
        if (recentVisitSummaries.length > MAX_SUMMARIES) { recentVisitSummaries.pop(); }
        
        try {
            const response = await fetch('/api/save-visit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(dataToSend) });
            if (response.ok) { console.log("УСПЕХ: Данные отправлены на сервер!"); } else { console.error("ОШИБКА ОТПРАВКИ:", response.status, await response.text()); }
        } catch (error) { console.error("СЕТЕВАЯ ОШИБКА:", error); }
    }

    // --- Функция для панели ---
    function updateDashboard() {
        if (!dashboardContent) return;
        if (!activeClients || activeClients.size === 0) { dashboardContent.innerHTML = '<p>Ожидание клиентов...</p>'; }
        else {
            let html = ''; const now = Date.now();
            activeClients.forEach(client => {
                let nameToDisplay = client.id;
                 if (client.isKnown) { nameToDisplay = clientDataMap.get(client.id)?.name || client.id; }
                 else if (client.id.startsWith('unreg_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]} (не зарег.)`; }
                 else if (client.id.startsWith('unknown_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]}`; }
                const timeInSeconds = ((now - client.entryTime) / 1000).toFixed(0);
                const genderMap = { 'male': 'М', 'female': 'Ж', '?': '?' };
                let ageDisplay = (client.age !== '?') ? `~${client.age}` : '?';
                if (client.age !== '?' && !client.isAgeReliable) { ageDisplay += " (оценка)"; }
                html += `<div class="client-card"><h3>${nameToDisplay}</h3>`;
                html += `<p>Статус: <span>${client.isKnown ? 'Известен' : (client.id.startsWith('unreg_') ? 'Виден ранее' : 'Новый')}</span></p>`;
                html += `<p>Пол/Возраст: <span>${genderMap[client.gender]} / ${ageDisplay}</span></p>`;
                html += `<p>Эмоция: <span>${client.dominantEmotion}</span></p><p>Время: <span>${timeInSeconds} сек</span></p>`;
                html += `<p>Смотрит: <span>${client.currentZone && interestZones[client.currentZone] ? interestZones[client.currentZone].name : '-'}</span></p>`;
                const viewedModels = [...client.viewedModels.keys()].filter(k => !k.endsWith('_INTEREST'));
                if (viewedModels.length > 0) {
                    html += `<p>Интерес к:</p><ul>`;
                    viewedModels.forEach(modelName => { const time = (client.viewedModels.get(modelName) / 1000).toFixed(0); html += `<li>${modelName} (${time}с)</li>`; });
                    html += `</ul>`;
                } html += `</div>`;
            });
            dashboardContent.innerHTML = html;
        }
        if (recentVisitsContent && recentVisitsTitle) {
            if (recentVisitSummaries.length > 0) {
                recentVisitsTitle.style.display = 'block'; let summaryHtml = '';
                recentVisitSummaries.forEach(visit => {
                    summaryHtml += 
                    `<div class="visit-summary-card">
                        <p class="client-name">${visit.name} <span class="timestamp">(${visit.timestamp})</span></p>
                        <p>${visit.details}</p>
                        <p class="goal">Цель: ${visit.goal}</p>
                        <p class="goal" style="color: var(--accent-purple);">Вероятность покупки: ${visit.purchaseLikelihood || 'N/A'}</p> 
                        </div>`;
                });
                recentVisitsContent.innerHTML = summaryHtml;
            } else { recentVisitsTitle.style.display = 'none'; recentVisitsContent.innerHTML = ''; }
        }
    }

    // --- Функции для формы ---
    function showRegistrationForm(age, gender, clientId) {
        if (isFormOpen || isDossierOpen) return; console.log(`ВЫЗОВ: showRegistrationForm() для ${clientId}`);
        isFormOpen = true; formLinkedClientId = clientId;
        if(clientIdInput) clientIdInput.value = clientId; if(visitTimeInput) visitTimeInput.value = new Date().toLocaleString('ru-RU');
        if(clientAgeInput) clientAgeInput.value = (age !== '?') ? age : ''; if(clientGenderInput) clientGenderInput.value = gender || 'unknown';
        if(clientNameInput) clientNameInput.value = ''; if(clientPhoneInput) clientPhoneInput.value = ''; if(clientPurposeInput) clientPurposeInput.value = '';
        if(registrationForm) registrationForm.style.display = 'block';
    }
    function hideRegistrationForm() { console.log("ВЫЗОВ: hideRegistrationForm()"); if(registrationForm) registrationForm.style.display = 'none'; isFormOpen = false; formLinkedClientId = null; }
    if(saveRegFormButton) saveRegFormButton.addEventListener('click', () => {
        const idToSaveFromForm = clientIdInput.value; const clientName = clientNameInput.value.trim(); const clientPhone = clientPhoneInput.value.trim();
        const newLabelForMatcher = clientName || idToSaveFromForm;
        const newData = {
            id: generateClientId(), label: newLabelForMatcher, name: clientName, age: clientAgeInput.value, gender: clientGenderInput.value, phoneNumber: clientPhone,
            clientIdOriginal: idToSaveFromForm, visitSchedule: [{ visitId: `V-${Date.now()}`, entryTime: visitTimeInput.value, exitTime: null, purpose: clientPurposeInput.value }]
        };
        console.log("Сохранение клиента:", newData); alert(`Клиент '${newLabelForMatcher}' условно сохранен!`);
        clientDataMap.set(newLabelForMatcher, newData);
        const activeClient = activeClients.get(idToSaveFromForm);
        if (activeClient) {
            activeClient.isKnown = true; activeClient.id = newLabelForMatcher;
            if (idToSaveFromForm !== newLabelForMatcher) { activeClients.delete(idToSaveFromForm); activeClients.set(newLabelForMatcher, activeClient); }
        }
        if (unregisteredFaces.has(idToSaveFromForm)) { unregisteredFaces.delete(idToSaveFromForm); }
        hideRegistrationForm();
    });
    if(closeRegFormButton) closeRegFormButton.addEventListener('click', hideRegistrationForm);

    // --- Функции для досье ---
    function showDossier(clientInfo) {
        if (!clientInfo || isFormOpen || isDossierOpen) return; console.log(`ВЫЗОВ: showDossier() для ${clientInfo.label || clientInfo.name}`);
        isDossierOpen = true;
        if(dossierId) dossierId.textContent = clientInfo.id || '-'; if(dossierName) dossierName.textContent = clientInfo.name || '-';
        if(dossierAge) dossierAge.textContent = clientInfo.age || '-'; if(dossierGender) dossierGender.textContent = clientInfo.gender === 'male' ? 'Мужской' : (clientInfo.gender === 'female' ? 'Женский' : 'Не указан');
        if(dossierPhone) dossierPhone.textContent = clientInfo.phoneNumber || '-'; if(dossierClientIdDisplay) dossierClientIdDisplay.textContent = clientInfo.clientIdOriginal || clientInfo.clientId || clientInfo.label || '-';
        if(dossierVisitHistory){
            if (clientInfo.visitSchedule && clientInfo.visitSchedule.length > 0) { dossierVisitHistory.innerHTML = clientInfo.visitSchedule.map(v => `<li>${v.purpose} <span>${v.entryTime}</span></li>`).join(''); }
            else { dossierVisitHistory.innerHTML = '<li>Нет данных о визитах</li>'; }
        }
        if(dossierDisplayPanel) dossierDisplayPanel.style.display = 'block';
    }
    function hideDossier() { console.log("ВЫЗОВ: hideDossier()"); if(dossierDisplayPanel) dossierDisplayPanel.style.display = 'none'; isDossierOpen = false; }
    if(closeDossierButton) closeDossierButton.addEventListener('click', hideDossier);

    // --- Функции загрузки данных ---
    async function loadClientData() {
        console.log("Начинаю загрузку clients.json...");
        try {
            const response = await fetch('./clients.json'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for clients.json`);
            const clients = await response.json(); clients.forEach(client => { clientDataMap.set(client.label, client); labels.push(client.label); });
            console.log("УСПЕХ: Данные клиентов загружены. Всего меток:", labels.length);
        } catch (error) { console.error("ОШИБКА загрузки clients.json:", error); if(statusText) statusText.innerText = "Ошибка: Не удалось загрузить базу клиентов."; }
    }

    async function loadLabeledImagesAndMatcher(labelsToLoad) {
        if (!labelsToLoad || labelsToLoad.length === 0) { console.warn("Нет меток для загрузки. FaceMatcher не будет создан."); return null; }
        console.log("ЗАГРУЗКА ЭТАЛОННЫХ ЛИЦ для:", labelsToLoad); if(statusText) statusText.innerText = "Загрузка эталонных лиц...";
        const labeledFaceDescriptors = await Promise.all(
            labelsToLoad.map(async (label) => {
                const descriptors = []; console.log(`-- Загрузка для ${label} --`);
                for (let i = 1; i <= 2; i++) {
                    let img = null; for (const ext of ['jpg', 'png', 'jpeg']) { const path = `./labeled_faces/${label}/${i}.${ext}`; try { img = await faceapi.fetchImage(path); console.log(`   УСПЕХ: ${path} загружен.`); break; } catch (e) {} }
                    if (img) { try { const detectionResult = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor(); if (detectionResult) { descriptors.push(detectionResult.descriptor); console.log(`       => Лицо найдено и дескриптор добавлен.`); } else { console.warn(`       => Лицо НЕ найдено на ${label}/${i}.`); } } catch (detectError) { console.error(`       => ОШИБКА обнаружения на ${label}/${i}:`, detectError); } }
                    else { console.error(`   ОШИБКА: Не удалось загрузить ${label}/${i}.(jpg/png/jpeg).`); }
                } if (descriptors.length > 0) { console.log(`   => УСПЕХ для ${label}: ${descriptors.length} дескриптор(а) создано.`); return new faceapi.LabeledFaceDescriptors(label, descriptors); } else { console.error(`   => ОШИБКА для ${label}: Не удалось создать ни одного дескриптора.`); return null; }
            })
        );
        const validDescriptors = labeledFaceDescriptors.filter(d => d !== null);
        console.log(`ИТОГО: Загружено валидных дескрипторов: ${validDescriptors.length} из ${labelsToLoad.length}`);
        if (validDescriptors.length === 0) { console.error("КРИТИЧЕСКАЯ ОШИБКА: НИ ОДНОГО дескриптора."); if(statusText) statusText.innerText = "Ошибка: Не удалось загрузить эталонные лица."; return null; }
        console.log("Face Matcher УСПЕШНО создан."); return new faceapi.FaceMatcher(validDescriptors, 0.62);
    }

    // --- ГЛАВНАЯ ЛОГИКА ОБРАБОТКИ КАДРА ---
    async function processMultipleDetections(detections, displaySize, canvas) {
        const now = Date.now(); const seenLabelsThisFrame = new Set(); const ctx = canvas.getContext("2d");
        for (const d of detections) {
            if (!d.descriptor || !d.detection || !d.detection.box) continue;
            let client = null; let currentLabelForFace = null; let isKnownByMainMatcher = false; let isRecognizedAsUnregistered = false;
            const currentDescriptor = d.descriptor;
            const bestMatch = faceMatcher ? faceMatcher.findBestMatch(currentDescriptor) : { label: 'unknown', distance: Infinity };
            if (bestMatch.label !== 'unknown') { currentLabelForFace = bestMatch.label; isKnownByMainMatcher = true; client = activeClients.get(currentLabelForFace); }
            else {
                let bestUnregMatchId = null; let minUnregDistance = SIMILARITY_THRESHOLD_FOR_UNREGISTERED_MATCH;
                for (const [unregId, unregData] of unregisteredFaces.entries()) {
                    for (const storedDesc of unregData.descriptors) {
                        const dist = faceapi.euclideanDistance(currentDescriptor, storedDesc);
                        if (dist < minUnregDistance) { minUnregDistance = dist; bestUnregMatchId = unregId; }
                    }
                }
                if (bestUnregMatchId) {
                    currentLabelForFace = bestUnregMatchId; isRecognizedAsUnregistered = true; client = activeClients.get(currentLabelForFace);
                    const unregData = unregisteredFaces.get(currentLabelForFace);
                    if (unregData) {
                        unregData.lastSeen = now;
                        if (unregData.descriptors.length < MAX_DESCRIPTORS_PER_UNREGISTERED) {
                            let isFarEnough = true;
                            for (const desc of unregData.descriptors) { if (faceapi.euclideanDistance(currentDescriptor, desc) < MIN_DISTANCE_FOR_NEW_UNREG_DESCRIPTOR) { isFarEnough = false; break; } }
                            if (isFarEnough) { unregData.descriptors.push(currentDescriptor); console.log(`[UNREG UPDATE]: Добавлен ${unregData.descriptors.length}-й дескриптор для ${currentLabelForFace}.`);}
                        }
                    }
                }
            }
            if (!currentLabelForFace) { sessionCounter++; currentLabelForFace = `unknown_${sessionCounter}`; }
            if (!activeClients.has(currentLabelForFace)) {
                client = createClientState(currentLabelForFace, currentDescriptor, d, isKnownByMainMatcher);
                if (isRecognizedAsUnregistered) {
                    const unregData = unregisteredFaces.get(currentLabelForFace);
                    if (unregData) { client.age = unregData.ageEstimate || client.age; client.gender = unregData.genderEstimate || client.gender; const currentBox = d.detection.box; client.isAgeReliable = (d.age && currentBox && (currentBox.width * currentBox.height > MIN_FACE_AREA_FOR_RELIABLE_AGE));}
                }
                activeClients.set(currentLabelForFace, client); console.log(`[ПОЯВИЛСЯ]: ${currentLabelForFace} (Известен: ${isKnownByMainMatcher}, Как незарег: ${isRecognizedAsUnregistered})`);
            } else { client = activeClients.get(currentLabelForFace); }
            if (!client) continue;
            client.lastSeen = now; client.box = d.detection.box; client.descriptor = currentDescriptor;
            if (!isKnownByMainMatcher && !isRecognizedAsUnregistered && client.id.startsWith('unknown_') && client.tempQualityDescriptors) {
                const box = d.detection.box; const faceArea = box.width * box.height;
                if (faceArea > MIN_FACE_AREA_TO_SAVE_AS_UNREG ) { if (client.tempQualityDescriptors.length < MAX_TEMP_DESCRIPTORS_FOR_UNKNOWN) { client.tempQualityDescriptors.push(currentDescriptor); } }
            }
            if (d.age) {
                const currentRawAge = Math.round(d.age); const box = d.detection.box; const faceArea = box.width * box.height;
                if (faceArea > MIN_FACE_AREA_FOR_RELIABLE_AGE) { client.ageReadings.push(d.age); if (client.ageReadings.length > AGE_READINGS_BUFFER_SIZE) { client.ageReadings.shift(); } client.isAgeReliable = true; }
                else { client.isAgeReliable = (client.ageReadings.length > 0); }
                if (client.ageReadings.length > 0) { client.age = calculateMedian(client.ageReadings); } else if (client.age === '?') { client.age = currentRawAge; client.isAgeReliable = (faceArea > MIN_FACE_AREA_FOR_RELIABLE_AGE); }
            } else { client.isAgeReliable = false; }
            client.gender = d.gender || client.gender;
            if(d.expressions) {
                client.emotionsHistory.push(d.expressions); if(client.emotionsHistory.length > 50) client.emotionsHistory.shift();
                let currentDominant = 'neutral'; let maxProb = 0.4; const latestExpressions = d.expressions;
                if(latestExpressions){ for (const [emo, prob] of Object.entries(latestExpressions)) { if (prob > maxProb) { maxProb = prob; currentDominant = emo; } } client.dominantEmotion = currentDominant; }
            }
            seenLabelsThisFrame.add(currentLabelForFace);
            if (DEBUG_SPECIFIC_PERSON && faceMatcher && d.descriptor && bestMatch.label === 'unknown' && !isRecognizedAsUnregistered) {
                const knownPersonData = faceMatcher.labeledDescriptors.find(ld => ld.label === DEBUG_PERSON_LABEL);
                if (knownPersonData && knownPersonData.descriptors.length > 0) { const distance1 = faceapi.euclideanDistance(d.descriptor, knownPersonData.descriptors[0]); let logMsg = `DEBUG_RECOGNITION: Для лица ${currentLabelForFace} (вероятно ${DEBUG_PERSON_LABEL}?) дистанция до ${DEBUG_PERSON_LABEL}[0]: ${distance1.toFixed(3)}. BestMatch: ${bestMatch.toString()}`; if (knownPersonData.descriptors.length > 1) { const distance2 = faceapi.euclideanDistance(d.descriptor, knownPersonData.descriptors[1]); logMsg += `, до ${DEBUG_PERSON_LABEL}[1]: ${distance2.toFixed(3)}`; } console.log(logMsg); }
            }
            const zoneKey = checkZone(client.box, interestZones);
            if (zoneKey && interestZones[zoneKey]) {
                const zoneName = interestZones[zoneKey].name;
                if (client.currentZone !== zoneKey) { client.currentZone = zoneKey; client.zoneEntryTime = now; }
                else { const timeInZone = now - client.zoneEntryTime; client.viewedModels.set(zoneName, (client.viewedModels.get(zoneName) || 0) + 500); if (timeInZone >= ZONE_THRESHOLD && zoneKey !== 'Negotiation_Table' && !client.viewedModels.has(`${zoneName}_INTEREST`)) { console.log(`[ИНТЕРЕС]: ${currentLabelForFace} к ${zoneName}`); client.viewedModels.set(`${zoneName}_INTEREST`, true); } }
            } else { client.currentZone = null; client.zoneEntryTime = null; }
            faceapi.draw.drawDetections(canvas, d); drawClientInfo(ctx, client.box, client);
            if (!isFormOpen && !isDossierOpen) {
                if (client.isKnown && clientDataMap.has(client.id)) { showDossier(clientDataMap.get(client.id)); }
                else if (!client.isKnown && !client.id.startsWith('unreg_') && !client.registrationTriggered && (now - client.entryTime > REGISTRATION_DELAY)) { client.registrationTriggered = true; showRegistrationForm(client.age, client.gender, client.id); }
            }
        }
        for (const [label, client] of activeClients.entries()) {
            if (!seenLabelsThisFrame.has(label)) {
                if (now - client.lastSeen > INACTIVITY_TIMEOUT) { client.timeSpent = client.lastSeen - client.entryTime; console.log(`[УШЕЛ]: ${label}. Время: ${(client.timeSpent / 1000).toFixed(0)}с.`); await sendClientDataToServer(client); activeClients.delete(label); if (isDossierOpen && dossierDisplayPanel.style.display === 'block' && (dossierId.textContent === label || (client.isKnown && clientDataMap.get(label) && dossierId.textContent === clientDataMap.get(label).id) ) ) { hideDossier(); } if (isFormOpen && registrationForm.style.display === 'block' && formLinkedClientId === label) { hideRegistrationForm(); } }
            } else {
                if (!client.isKnown && client.id.startsWith('unknown_') && !unregisteredFaces.has(client.id) && client.tempQualityDescriptors && client.tempQualityDescriptors.length >= MIN_QUALITY_DESCRIPTORS_TO_SAVE_UNREG) {
                    const timeVisible = now - client.entryTime;
                    if (timeVisible > MIN_TIME_TO_SAVE_UNKNOWN_AS_UNREG) {
                        unregIdCounter++; const newUnregId = `unreg_${unregIdCounter}`;
                        const repDescriptor = getRepresentativeDescriptor(client.tempQualityDescriptors);
                        if(repDescriptor){
                            unregisteredFaces.set(newUnregId, { id: newUnregId, descriptors: [repDescriptor], firstSeen: client.entryTime, lastSeen: now, ageEstimate: client.age, genderEstimate: client.gender });
                            console.log(`[NEW UNREG]: ${client.id} (unknown_X) сохранен как ${newUnregId} с 1 репрезентативным дескриптором.`);
                            const oldClientData = activeClients.get(client.id); 
                            if(oldClientData){
                                oldClientData.id = newUnregId;
                                oldClientData.tempQualityDescriptors = []; 
                                activeClients.delete(label); 
                                activeClients.set(newUnregId, oldClientData); 
                                 if (formLinkedClientId === label) { formLinkedClientId = newUnregId; if(clientIdInput) clientIdInput.value = newUnregId; }
                            }
                        } else {
                            console.warn("Не удалось получить репрезентативный дескриптор для", client.id, "несмотря на наличие tempQualityDescriptors");
                        }
                    }
                }
            }
        }
        if(statusText) statusText.innerText = `Активных: ${activeClients.size} (Незарег: ${unregisteredFaces.size}) Форма: ${isFormOpen} Досье: ${isDossierOpen}`;
    }

    async function startDetection() {
        console.log("Вызвана функция startDetection.");
        if (!canvas) { if (!videoContainer) { console.error("videoContainer не найден!"); return; } canvas = faceapi.createCanvasFromMedia(video); videoContainer.appendChild(canvas); }
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
        if (detectionInterval) clearInterval(detectionInterval);
        detectionInterval = setInterval(async () => {
            try {
                const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors().withAgeAndGender().withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height);
                if(Object.keys(interestZones).length > 0) drawZones(ctx, interestZones);
                await processMultipleDetections(resizedDetections, displaySize, canvas);
            } catch (error) { console.error("ОШИБКА в цикле обнаружения:", error); if(statusText) statusText.innerText = "Ошибка обнаружения!"; if (detectionInterval) clearInterval(detectionInterval); detectionInterval = null; }
        }, 700);
    }

    const run = async () => {
        console.log("Вызвана функция run."); if(statusText) statusText.innerText = "Загрузка моделей...";
        const models = ['ssdMobilenetv1', 'faceLandmark68Net', 'faceRecognitionNet', 'ageGenderNet', 'faceExpressionNet'];
        for (const modelName of models) { try { await faceapi.nets[modelName].loadFromUri("./models"); console.log(`УСПЕХ: ${modelName} загружена.`); } catch (error) { console.error(`!!! ОШИБКА загрузки ${modelName}:`, error); if(statusText) statusText.innerText = `Ошибка загрузки ${modelName}!`; return; } }
        await loadClientData();
        faceMatcher = await loadLabeledImagesAndMatcher(labels);
        if(statusText) statusText.innerText = "Запуск видеопотока...";
        try { const stream = await navigator.mediaDevices.getUserMedia({ video: {} }); video.srcObject = stream; }
        catch (err) { console.error("Ошибка доступа к камере:", err); if(statusText) statusText.innerText = "ОШИБКА: Нет доступа к камере!"; alert("Нет доступа к камере!"); return; }
        video.addEventListener("play", () => { console.log("Событие 'play'. Вызываю startDetection..."); startDetection(); setInterval(updateDashboard, 1000); });
    };

    console.log("Вызываю run()...");
    run();
});