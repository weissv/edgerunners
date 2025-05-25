window.addEventListener('DOMContentLoaded', () => {

    console.log("DOM готов. Запускаем скрипт v6.1 Merged (Хакатон)...");

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
    let formLinkedClientId = null; // ID клиента, для которого открыта форма


    const interestZones = {
        'Model_S': { x1: 50, y1: 100, x2: 250, y2: 400, name: 'Седан "Элегант"', budgetCategory: 'premium' },
        'Model_X': { x1: 450, y1: 100, x2: 670, y2: 400, name: 'Внедорожник "Простор"', budgetCategory: 'mid-range' },
        'Model_3': { x1: 260, y1: 300, x2: 440, y2: 500, name: 'Спорткар "Скорость"', budgetCategory: 'budget' },
        'Negotiation_Table': { x1: 300, y1: 10, x2: 420, y2: 80, name: 'Стол переговоров', budgetCategory: null },
        'Manager_Desk': { x1: 600, y1: 10, x2: 710, y2: 80, name: 'Стойка менеджера', budgetCategory: null } // <<< ДОБАВЛЕНО (Координаты ваши!)
    };
    const REGISTRATION_DELAY = 5000; // Задержка перед показом формы

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

    // [ИНТЕГРАЦИЯ] URL бэкенда для сохранения (из старого кода)
    const BACKEND_SAVE_URL = '/api/save-client-with-image'; // Замените на ваш реальный URL

    if (typeof faceapi === 'undefined') {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Библиотека face-api.min.js не загружена!");
        if(statusText) statusText.innerText = "ОШИБКА: face-api.js не найден!";
        return;
    }

    // --- Вспомогательные функции ---
    function generateClientId() { return `C-${Date.now().toString().slice(-6)}`; } // [ИНТЕГРАЦИЯ] Чуть изменил формат

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

    // [ИНТЕГРАЦИЯ] Функция захвата фото из старого кода
    function captureFaceImage(detectionBox) {
        if (!detectionBox || !canvas || !video.videoWidth || !video.videoHeight) {
            console.warn("captureFaceImage: не могу захватить фото - нет detectionBox, canvas или видео не готово.");
            return null;
        }
        const temp = document.createElement('canvas');
        const ctx = temp.getContext('2d');
        const { x, y, width, height } = detectionBox;
        const pad = width * 0.3; // Небольшой отступ
        const sx = Math.max(0, x - pad);
        const sy = Math.max(0, y - pad);
        let sw = width + pad * 2;
        let sh = height + pad * 2;
        sw = Math.min(sw, video.videoWidth - sx);
        sh = Math.min(sh, video.videoHeight - sy);

        if (sw <= 0 || sh <= 0) {
            console.warn("captureFaceImage: неверные размеры области захвата.");
            return null;
        }
        temp.width = sw;
        temp.height = sh;
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
        return temp.toDataURL('image/jpeg', 0.85); // Возвращаем в base64
    }

    // --- Функции отслеживания (из v6.0) ---
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

    // --- Функции отрисовки (из v6.0) ---
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

    // --- Функция анализа вероятности покупки (из v6.0) ---
    function analyzePurchaseLikelihood(client, allCurrentlyActiveClients) {
        let score = 50; // Начальный балл
        let reasons = []; // Будем собирать причины изменения счета
        let preferredBudget = 'любой';
        let testDriveInterest = "Нет";

        const age = (client.age !== '?') ? parseInt(client.age) : null;
        const gender = client.gender;
        const timeSpentMs = client.isKnown ? client.timeSpent : (Date.now() - client.entryTime); // Если ушел - берем timeSpent, если нет - текущее время
        const timeSpentMin = timeSpentMs / 60000; // Время в минутах

        const managerZoneName = interestZones['Manager_Desk']?.name || 'Стойка менеджера';
        const negotiationZoneName = interestZones['Negotiation_Table']?.name || 'Стол переговоров';
        const managerTimeSec = (client.viewedModels.get(managerZoneName) || 0) / 1000;
        const negotiationTimeSec = (client.viewedModels.get(negotiationZoneName) || 0) / 1000;

        let carViewCount = 0;
        let viewedBudget = false;
        let viewedPremium = false;
        let viewedMid = false;

        client.viewedModels.forEach((timeMs, modelNameKey) => {
            let isCar = false; let budgetCat = null;
            for (const key in interestZones) {
                if (interestZones[key].name === modelNameKey.replace('_INTEREST', '')) {
                     if (interestZones[key].budgetCategory) { // Считаем только авто-зоны
                         isCar = true; budgetCat = interestZones[key].budgetCategory; break;
                     }
                }
            }
            if (isCar && (timeMs / 1000) > 15) { // Интерес > 15 сек
                carViewCount++;
                if (budgetCat === 'budget') viewedBudget = true;
                if (budgetCat === 'premium') viewedPremium = true;
                if (budgetCat === 'mid-range') viewedMid = true;
            }
        });

        // 1. Демография и Группы
        let isAccompanied = false;
        if (allCurrentlyActiveClients && allCurrentlyActiveClients.size > 1) {
            for (const [otherId, otherClient] of allCurrentlyActiveClients.entries()) {
                if (otherId !== client.id && Math.abs(client.entryTime - otherClient.entryTime) < 20000) {
                    isAccompanied = true; break;
                }
            }
        }

        if (gender === 'male' && age !== null) {
            if (age >= 18 && age <= 25) {
                if (isAccompanied) { score += 10; reasons.push("М 18-25 (с кем-то)"); preferredBudget = 'budget'; }
                else { score -= 15; reasons.push("М 18-25 (один)"); }
            } else if (age > 25 && age <= 35) { score += 5; reasons.push("М 25-35"); }
            else if (age > 35 && age <= 45) { score += 15; reasons.push("М 35-45"); }
            else { reasons.push("М (др. возраст)"); }
        } else if (gender === 'female' && age !== null) {
            if (age >= 28 && age <= 45) { score += 5; reasons.push("Ж 28-45"); }
            else { reasons.push("Ж (др. возраст)"); }
        } else { reasons.push("Пол/возраст ?"); }

        // 2. Время
        const timeScore = Math.min(Math.floor(timeSpentMin / 5), 10);
        score += timeScore;
        if(timeScore > 0) reasons.push(`Время (${timeScore})`);

        // 3. Авто
        if (carViewCount === 1) { score += 5; }
        else if (carViewCount >= 2 && carViewCount <= 3) { score += 10; }
        else if (carViewCount > 3) { score += 15; }
        if (carViewCount > 0) reasons.push(`Авто:${carViewCount}`);

        // 4. Бюджетный интерес
        if (preferredBudget === 'budget' && viewedBudget) {
            score += 10; reasons.push("Целевой бюджет");
        }

        // 5. Столы
        if (negotiationTimeSec > 45) { score += 10; reasons.push("Переговоры"); }
        if (managerTimeSec > 30) { score += 20; reasons.push("Менеджер"); }

        // 6. Связка Авто -> Менеджер
        if (managerTimeSec > 30 && carViewCount > 0) {
            score += 15;
            reasons.push("Тест-драйв?");
            testDriveInterest = "Высокий";
        } else if (managerTimeSec > 0 && carViewCount > 0) {
             testDriveInterest = "Средний";
        }

        // Нормализация 0-100
        score = Math.max(5, Math.min(99, score)); // Держим в рамках 5-99%

        return {
            likelihood: `${score.toFixed(0)}%`,
            preferredBudget: preferredBudget,
            reason: reasons.join('; '),
            testDriveInterest: testDriveInterest
        };
    }   

    // --- Функция анализа (основная) (из v6.0) ---
    function generateVisitSummary(client) {
        if (!client) return { details: "Нет данных о клиенте.", goal: "Не определена", recommendations: [], testDriveInterest: 'Нет', purchaseLikelihood: '0%' };

        const age = client.age;
        const gender = client.gender === 'male' ? 'М' : (client.gender === 'female' ? 'Ж' : '?');
        const timeSpent = (client.timeSpent / 1000);
        const interactions = client.viewedModels;
        const negotiationZoneKey = 'Negotiation_Table';
        const negotiationZoneName = interestZones[negotiationZoneKey]?.name || 'Стол переговоров';
        const managerZoneKey = 'Manager_Desk';
        const managerZoneName = interestZones[managerZoneKey]?.name || 'Стойка менеджера';

        const negotiationTimeSec = (interactions.get(negotiationZoneName) || 0) / 1000;
        const managerTimeSec = (interactions.get(managerZoneName) || 0) / 1000;

        const significantCarsViewed = new Map();
        interactions.forEach((timeMs, modelNameKey) => {
            let modelName = modelNameKey.replace('_INTEREST', '');
            let isCarZoneName = false;
            for (const key in interestZones) {
                if (interestZones[key].name === modelName && key !== negotiationZoneKey && key !== managerZoneKey) {
                    isCarZoneName = true; break;
                }
            }
            if (isCarZoneName && (timeMs / 1000) > 15) {
                significantCarsViewed.set(modelName, timeMs / 1000);
            }
        });

        let nameToDisplay = client.id;
        if (client.isKnown) { nameToDisplay = clientDataMap.get(client.id)?.name || client.id; }
        else if (client.id.startsWith('unreg_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]} (не зарег.)`; }
        else if (client.id.startsWith('unknown_')) { nameToDisplay = `Клиент ${client.id.split('_')[1]}`; }

        // <<< ВЫЗЫВАЕМ НОВУЮ АНАЛИТИКУ >>>
        const purchaseAnalysis = analyzePurchaseLikelihood(client, activeClients);

        let inferredGoal = "Не определена"; // Можно улучшить эту логику на основе purchaseAnalysis.reason
        if (purchaseAnalysis.testDriveInterest === "Высокий") inferredGoal = "Тест-Драйв / Покупка";
        else if (significantCarsViewed.size > 0) inferredGoal = "Изучение моделей";
        else if (managerTimeSec > 25 || negotiationTimeSec > 30) inferredGoal = "Консультация / Сервис";
        else inferredGoal = "Осмотр / Случайный визит";

        let details = `Клиент '${nameToDisplay}' (${gender}, ~${age}) ${timeSpent.toFixed(0)}с. `;
        if (significantCarsViewed.size > 0) details += `Интерес: ${[...significantCarsViewed.keys()].join(', ')}. `;
        details += `Менеджер: ${managerTimeSec.toFixed(0)}с. Переговоры: ${negotiationTimeSec.toFixed(0)}с.`;
        details += ` Факторы: [${purchaseAnalysis.reason}]`; // Добавляем причины

        return {
            details: details,
            goal: inferredGoal,
            recommendations: [], // Пока пусто
            testDriveInterest: purchaseAnalysis.testDriveInterest,
            purchaseLikelihood: purchaseAnalysis.likelihood // Берем % из анализа
        };
    }

    // --- Функция отправки данных (из v6.0) ---
    async function sendClientDataToServer(client) {
        if (!client) return;

        // <<< ВЫЗЫВАЕМ НОВУЮ АНАЛИТИКУ >>>
        const analysis = analyzePurchaseLikelihood(client, activeClients);
        const { details, goal, recommendations } = generateVisitSummary(client); // Используем summary для деталей

        const viewed = {};
        client.viewedModels.forEach((time, model) => {
            if (!model.endsWith('_INTEREST')) {
                viewed[model] = (time / 1000).toFixed(1) + 'c';
            }
        });

        const dataToSend = {
            id: client.id, known: client.isKnown, age: client.age, gender: client.gender,
            entryTime: new Date(client.entryTime).toLocaleString('ru-RU'),
            exitTime: new Date().toLocaleString('ru-RU'),
            timeSpentSeconds: (client.timeSpent / 1000).toFixed(0),
            viewedModels: viewed,
            inferredGoal: goal,
            summaryDetails: details,
            purchaseLikelihood: analysis.likelihood, // Используем %
            testDriveInterest: analysis.testDriveInterest,
            likelihoodReason: analysis.reason
        };
        console.log("ОТПРАВКА ДАННЫХ:", dataToSend);

        // Обновляем сводку для дашборда
        let nameForDisplay = client.id.startsWith('unreg_') ? `Клиент ${client.id.split('_')[1]}` : client.id;
        if(client.isKnown) nameForDisplay = clientDataMap.get(client.id)?.name || client.id;

        const summaryForDisplay = {
            name: nameForDisplay, details: details, goal: goal,
            purchaseLikelihood: analysis.likelihood,
            testDriveInterest: analysis.testDriveInterest,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        recentVisitSummaries.unshift(summaryForDisplay);
        if (recentVisitSummaries.length > MAX_SUMMARIES) { recentVisitSummaries.pop(); }

        try {
            // <<< МЕНЯЕМ URL НА ЛОКАЛЬНЫЙ СЕРВЕР >>>
            const response = await fetch('http://localhost:3000/api/save-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) { console.log("УСПЕХ: Данные отправлены на Node.js сервер!"); }
            else { console.error("ОШИБКА ОТПРАВКИ на Node.js:", response.status, await response.text()); }
        } catch (error) { console.error("СЕТЕВАЯ ОШИБКА (Node.js):", error); }
    }    // --- Функция для панели (из v6.0) ---

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

                // Определяем текущую зону, включая менеджера
                let currentZoneName = '-';
                if (client.currentZone && interestZones[client.currentZone]) {
                     currentZoneName = interestZones[client.currentZone].name;
                }

                html += `<div class="client-card"><h3>${nameToDisplay}</h3>`;
                html += `<p>Статус: <span>${client.isKnown ? 'Известен' : (client.id.startsWith('unreg_') ? 'Виден ранее' : 'Новый')}</span></p>`;
                html += `<p>Пол/Возраст: <span>${genderMap[client.gender]} / ${ageDisplay}</span></p>`;
                html += `<p>Эмоция: <span>${client.dominantEmotion}</span></p><p>Время: <span>${timeInSeconds} сек</span></p>`;
                html += `<p>Смотрит: <span style="font-weight: bold; color: ${currentZoneName === 'Стойка менеджера' ? 'var(--accent-green)' : 'white'};">${currentZoneName}</span></p>`; // Выделяем стойку менеджера

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
                    // Определяем цвет для интереса к тест-драйву
                    let testDriveColor = 'white';
                    if (visit.testDriveInterest === 'Высокий') testDriveColor = 'var(--accent-green)';
                    else if (visit.testDriveInterest === 'Средний') testDriveColor = 'var(--accent-yellow)';

                    summaryHtml +=
                    `<div class="visit-summary-card">
                        <p class="client-name">${visit.name} <span class="timestamp">(${visit.timestamp})</span></p>
                        <p>${visit.details}</p>
                        <p class="goal">Цель: ${visit.goal}</p>
                        <p class="goal" style="color: var(--accent-purple);">Вероятность покупки: ${visit.purchaseLikelihood || 'N/A'}</p>
                        <p class="goal" style="color: ${testDriveColor}; font-weight: bold;">Интерес к Тест-Драйву: ${visit.testDriveInterest || 'N/A'}</p> 
                        </div>`; // <<< ДОБАВИЛИ СТРОКУ И ЦВЕТ
                });
                recentVisitsContent.innerHTML = summaryHtml;
            } else { recentVisitsTitle.style.display = 'none'; recentVisitsContent.innerHTML = ''; }
        }
    }

    // --- Функции для формы ---
    function showRegistrationForm(age, gender, clientId) {
        if (isFormOpen || isDossierOpen) return;
        console.log(`ВЫЗОВ: showRegistrationForm() для ${clientId}`);
        const client = activeClients.get(clientId);
        if (!client) { console.error("Не могу открыть форму, клиент не найден:", clientId); return; }

        isFormOpen = true; formLinkedClientId = clientId;
        if(clientIdInput) clientIdInput.value = clientId; // Используем текущий ID (unknown/unreg)
        if(visitTimeInput) visitTimeInput.value = new Date().toLocaleString('ru-RU');
        if(clientAgeInput) clientAgeInput.value = (age !== '?') ? age : '';
        if(clientGenderInput) clientGenderInput.value = gender || 'unknown';
        if(clientNameInput) clientNameInput.value = '';
        if(clientPhoneInput) clientPhoneInput.value = '';
        if(clientPurposeInput) clientPurposeInput.value = '';
        if(registrationForm) registrationForm.style.display = 'block';
    }

    function hideRegistrationForm() {
        console.log("ВЫЗОВ: hideRegistrationForm()");
        if(registrationForm) registrationForm.style.display = 'none';
        isFormOpen = false;
        formLinkedClientId = null;
    }

    // [ИНТЕГРАЦИЯ] Обработчик сохранения с захватом фото и отправкой
    // --- [ПОЛНАЯ ВЕРСИЯ ОБРАБОТЧИКА КНОПКИ СОХРАНЕНИЯ] ---
    if(saveRegFormButton) saveRegFormButton.addEventListener('click', async () => {
        const idToSave = formLinkedClientId; // Получаем ID клиента, для которого открыта форма
        const clientName = clientNameInput.value.trim();

        if (!idToSave) {
            alert("Ошибка: Неизвестно, для какого клиента сохранять данные. Попробуйте закрыть и снова открыть форму.");
            return;
        }
        if (!clientName) {
            alert("Введите имя клиента.");
            return;
        }

        const activeClient = activeClients.get(idToSave);
        if (!activeClient || !activeClient.box) {
            alert("Не удалось найти активного клиента или его рамку для фото. Убедитесь, что клиент в кадре и попробуйте снова.");
            return;
        }

        const imageDataUrl = captureFaceImage(activeClient.box);
        if (!imageDataUrl) {
            alert("Не удалось захватить фото. Убедитесь, что лицо клиента четко видно.");
            return;
        }

        // Проверка лица на сделанном снимке
        try {
            const img = await faceapi.fetchImage(imageDataUrl);
            const detectionOnSnapshot = await faceapi.detectSingleFace(img).withFaceDescriptor();
            if (!detectionOnSnapshot) {
                alert("На сделанном фото не удалось обнаружить лицо. Пожалуйста, попробуйте еще раз, возможно, с другого ракурса.");
                return;
            }
            console.log("Фото для сохранения успешно проверено.");
        } catch(imgError) {
             alert("Ошибка при проверке фото. Попробуйте еще раз.");
             console.error("Ошибка проверки фото:", imgError);
             return;
        }

        const newLabelForMatcher = clientName; // Используем имя как Label
        const newDossierId = generateClientId(); // Генерируем ID для досье

        const dataToSend = {
            id: newDossierId, // Уникальный ID досье
            label: newLabelForMatcher, // Имя для faceMatcher
            name: clientName,
            age: clientAgeInput.value,
            gender: clientGenderInput.value,
            phoneNumber: clientPhoneInput.value.trim(),
            clientIdOriginal: idToSave, // Сохраняем временный ID (unknown/unreg)
            visitSchedule: [{
                visitId: `V-${Date.now()}`,
                entryTime: visitTimeInput.value,
                exitTime: null,
                purpose: clientPurposeInput.value
            }],
            image: imageDataUrl // Добавляем фото в base64!
        };

        console.log("Попытка отправки РЕГИСТРАЦИИ на бэкенд:", dataToSend.label);
        if(statusText) statusText.innerText = `Сохранение ${dataToSend.label}...`;

        try {
            // Отправляем на Node.js сервер
            const response = await fetch('http://localhost:3000/api/register-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(`Ошибка сервера: ${response.status} - ${err.error || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('Успешный ответ от бэкенда:', result);
            alert(`Клиент '${newLabelForMatcher}' успешно сохранен!`);

            // Обновляем данные локально и перезагружаем faceMatcher
            clientDataMap.set(newLabelForMatcher, dataToSend); // Добавляем в локальную карту
            labels.push(newLabelForMatcher); // Добавляем в список меток
            faceMatcher = await loadLabeledImagesAndMatcher(labels); // Перезагружаем matcher

            // Обновляем активного клиента
            activeClient.isKnown = true;
            activeClient.id = newLabelForMatcher; // Меняем ID на новый
            activeClients.delete(idToSave); // Удаляем старый ID
            activeClients.set(newLabelForMatcher, activeClient); // Добавляем с новым ID

            // Удаляем из незарегистрированных, если был там
            if (unregisteredFaces.has(idToSave)) {
                unregisteredFaces.delete(idToSave);
            }

            hideRegistrationForm(); // Закрываем форму

        } catch (error) {
            console.error('Ошибка сохранения клиента:', error);
            alert(`Ошибка сохранения: ${error.message}. Убедитесь, что Node.js сервер запущен.`);
            if(statusText) statusText.innerText = "Ошибка сохранения!";
        }
    });

    // Убедитесь, что обработчик кнопки закрытия тоже есть
    if(closeRegFormButton) closeRegFormButton.addEventListener('click', hideRegistrationForm);
    // --- Функции для досье (из v6.0) ---
    
    function showDossier(clientInfo) {
        if (!clientInfo || isFormOpen || isDossierOpen) return;
        console.log(`ВЫЗОВ: showDossier() для ${clientInfo.label || clientInfo.name}`);
        isDossierOpen = true;
        if(dossierId) dossierId.textContent = clientInfo.id || '-';
        if(dossierName) dossierName.textContent = clientInfo.name || '-';
        if(dossierAge) dossierAge.textContent = clientInfo.age || '-';
        if(dossierGender) dossierGender.textContent = clientInfo.gender === 'male' ? 'Мужской' : (clientInfo.gender === 'female' ? 'Женский' : 'Не указан');
        if(dossierPhone) dossierPhone.textContent = clientInfo.phoneNumber || '-';
        if(dossierClientIdDisplay) dossierClientIdDisplay.textContent = clientInfo.clientIdOriginal || clientInfo.clientId || clientInfo.label || '-';
        if(dossierVisitHistory){
            if (clientInfo.visitSchedule && clientInfo.visitSchedule.length > 0) {
                dossierVisitHistory.innerHTML = clientInfo.visitSchedule.map(v => `<li>${v.purpose} <span>${v.entryTime}</span></li>`).join('');
            } else {
                dossierVisitHistory.innerHTML = '<li>Нет данных о визитах</li>';
            }
        }
        if(dossierDisplayPanel) dossierDisplayPanel.style.display = 'block';
    }

    function hideDossier() {
        console.log("ВЫЗОВ: hideDossier()");
        if(dossierDisplayPanel) dossierDisplayPanel.style.display = 'none';
        isDossierOpen = false;
    }
    if(closeDossierButton) closeDossierButton.addEventListener('click', hideDossier);

    // --- Функции загрузки данных ---
    async function loadClientData() {
        console.log("Начинаю загрузку clients.json...");
        try {
            // [ИНТЕГРАЦИЯ] Добавлен cacheBust для принудительной перезагрузки
            const response = await fetch('./clients.json?cacheBust=' + new Date().getTime());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for clients.json`);
            const clients = await response.json();
            clientDataMap.clear(); labels = []; // [ИНТЕГРАЦИЯ] Очистка перед загрузкой
            clients.forEach(client => {
                clientDataMap.set(client.label, client);
                labels.push(client.label);
            });
            console.log("УСПЕХ: Данные клиентов загружены. Всего меток:", labels.length);
        } catch (error) {
            console.error("ОШИБКА загрузки clients.json:", error);
            if(statusText) statusText.innerText = "Ошибка: Не удалось загрузить базу клиентов.";
        }
    }

    async function loadLabeledImagesAndMatcher(labelsToLoad) {
        if (!labelsToLoad || labelsToLoad.length === 0) { console.warn("Нет меток для загрузки. FaceMatcher не будет создан."); return null; }
        console.log("ЗАГРУЗКА ЭТАЛОННЫХ ЛИЦ для:", labelsToLoad);
        if(statusText) statusText.innerText = "Загрузка эталонных лиц...";
        const labeledFaceDescriptors = await Promise.all(
            labelsToLoad.map(async (label) => {
                const descriptors = [];
                console.log(`-- Загрузка для ${label} --`);
                for (let i = 1; i <= 2; i++) { // Пытаемся загрузить до 2х фото
                    let img = null;
                    for (const ext of ['jpg', 'png', 'jpeg']) {
                         // [ИНТЕГРАЦИЯ] Добавлен cacheBust для принудительной перезагрузки
                        const path = `./labeled_faces/${label}/${i}.${ext}?cacheBust=${new Date().getTime()}`;
                        try {
                            img = await faceapi.fetchImage(path);
                            console.log(`    УСПЕХ: ${path} загружен.`);
                            break;
                        } catch (e) { /* Игнорируем ошибки загрузки, т.к. может быть другое расширение или нет второго фото */ }
                    }
                    if (img) {
                        try {
                            const detectionResult = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                            if (detectionResult) {
                                descriptors.push(detectionResult.descriptor);
                                console.log(`        => Лицо найдено и дескриптор добавлен.`);
                            } else {
                                console.warn(`        => Лицо НЕ найдено на ${label}/${i}.`);
                            }
                        } catch (detectError) {
                            console.error(`        => ОШИБКА обнаружения на ${label}/${i}:`, detectError);
                        }
                    } else {
                         // [ИНТЕГРАЦИЯ] Убрали ошибку, если второе фото не найдено
                         if (i === 1) console.error(`    ОШИБКА: Не удалось загрузить ОСНОВНОЕ ФОТО ${label}/${i}.(jpg/png/jpeg).`);
                    }
                }
                if (descriptors.length > 0) {
                    console.log(`    => УСПЕХ для ${label}: ${descriptors.length} дескриптор(а) создано.`);
                    return new faceapi.LabeledFaceDescriptors(label, descriptors);
                } else {
                    console.error(`    => ОШИБКА для ${label}: Не удалось создать ни одного дескриптора.`);
                    return null;
                }
            })
        );
        const validDescriptors = labeledFaceDescriptors.filter(d => d !== null);
        console.log(`ИТОГО: Загружено валидных дескрипторов: ${validDescriptors.length} из ${labelsToLoad.length}`);
        if (validDescriptors.length === 0) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА: НИ ОДНОГО дескриптора.");
            if(statusText) statusText.innerText = "Ошибка: Не удалось загрузить эталонные лица.";
            return null;
        }
        console.log("Face Matcher УСПЕШНО создан.");
        return new faceapi.FaceMatcher(validDescriptors, 0.62); // Порог 0.62 как в v6.0
    }

    // --- ГЛАВНАЯ ЛОГИКА ОБРАБОТКИ КАДРА (из v6.0, с мелкими правками) ---
    async function processMultipleDetections(detections, displaySize, canvas) {
        const now = Date.now();
        const seenLabelsThisFrame = new Set();
        const ctx = canvas.getContext("2d");

        for (const d of detections) {
            if (!d.descriptor || !d.detection || !d.detection.box) continue;

            let client = null;
            let currentLabelForFace = null;
            let isKnownByMainMatcher = false;
            let isRecognizedAsUnregistered = false;
            const currentDescriptor = d.descriptor;

            const bestMatch = faceMatcher ? faceMatcher.findBestMatch(currentDescriptor) : { label: 'unknown', distance: Infinity };

            // 1. Проверка известных лиц
            if (bestMatch.label !== 'unknown') {
                currentLabelForFace = bestMatch.label;
                isKnownByMainMatcher = true;
            } else {
                // 2. Проверка незарегистрированных (unreg_X)
                let bestUnregMatchId = null;
                let minUnregDistance = SIMILARITY_THRESHOLD_FOR_UNREGISTERED_MATCH; // 0.52 (можно поднять до 0.53 - 0.54)

                for (const [unregId, unregData] of unregisteredFaces.entries()) {
                    for (const storedDesc of unregData.descriptors) {
                        const dist = faceapi.euclideanDistance(currentDescriptor, storedDesc);
                        if (dist < minUnregDistance) {
                            minUnregDistance = dist; bestUnregMatchId = unregId;
                        }
                    }
                }

                if (bestUnregMatchId) {
                    currentLabelForFace = bestUnregMatchId;
                    isRecognizedAsUnregistered = true;
                    const unregData = unregisteredFaces.get(currentLabelForFace);
                    if (unregData) {
                        unregData.lastSeen = now;
                        if (unregData.descriptors.length < MAX_DESCRIPTORS_PER_UNREGISTERED) {
                            let isFarEnough = !unregData.descriptors.some(desc => faceapi.euclideanDistance(currentDescriptor, desc) < MIN_DISTANCE_FOR_NEW_UNREG_DESCRIPTOR);
                            if (isFarEnough) {
                                unregData.descriptors.push(currentDescriptor);
                                console.log(`[UNREG UPDATE]: Добавлен ${unregData.descriptors.length}-й дескриптор для ${currentLabelForFace}.`);
                            }
                        }
                    }
                }
            }

            // 3. Проверка активных неизвестных (unknown_X)
            if (!currentLabelForFace) {
                let bestActiveUnknownMatchId = null;
                let minActiveUnknownDist = 0.57; // <<< УВЕЛИЧИЛИ ПОРОГ (ЭКСПЕРИМЕНТИРУЙТЕ: 0.57 - 0.59)

                for (const [activeId, activeClient] of activeClients.entries()) {
                    if (activeId.startsWith('unknown_') && activeClient.descriptor) {
                        const dist = faceapi.euclideanDistance(currentDescriptor, activeClient.descriptor);
                        // console.log(`      -> Сравнение с ${activeId}, Дистанция: ${dist.toFixed(3)}`); // <<< РАСКОММЕНТИРУЙТЕ ДЛЯ ОТЛАДКИ
                        if (dist < minActiveUnknownDist) {
                            minActiveUnknownDist = dist; bestActiveUnknownMatchId = activeId;
                        }
                    }
                }
                if (bestActiveUnknownMatchId) {
                    currentLabelForFace = bestActiveUnknownMatchId;
                    console.log(`[RE-ID UNKNOWN]: Лицо (${currentLabelForFace}) переопознано (Dist: ${minActiveUnknownDist.toFixed(3)})`);
                }
            }

            // 4. Если все еще не опознан - создаем НОВЫЙ unknown_X
            if (!currentLabelForFace) {
                sessionCounter++;
                currentLabelForFace = `unknown_${sessionCounter}`;
            }

            // 5. Получаем или Создаем состояние клиента
            if (!activeClients.has(currentLabelForFace)) {
                client = createClientState(currentLabelForFace, currentDescriptor, d, isKnownByMainMatcher);
                if(isRecognizedAsUnregistered) {
                    const unregData = unregisteredFaces.get(currentLabelForFace);
                    if (unregData) { client.age = unregData.ageEstimate || client.age; client.gender = unregData.genderEstimate || client.gender; }
                }
                activeClients.set(currentLabelForFace, client);
                console.log(`[ПОЯВИЛСЯ]: ${currentLabelForFace} (Известен: ${isKnownByMainMatcher}, Как незарег: ${isRecognizedAsUnregistered})`);
            } else {
                client = activeClients.get(currentLabelForFace);
            }

            // 6. Проверка на случай ошибки
            if (!client) {
                console.error("КРИТИЧЕСКАЯ ОШИБКА: Не удалось получить или создать клиента для", currentLabelForFace);
                continue;
            }

            // 7. Обновляем данные клиента
            client.lastSeen = now;
            client.box = d.detection.box;
            client.descriptor = currentDescriptor;

            // Накопление дескрипторов для unknown
            if (!isKnownByMainMatcher && !isRecognizedAsUnregistered && client.id.startsWith('unknown_') && client.tempQualityDescriptors) {
                 const box = d.detection.box; const faceArea = box.width * box.height;
                 if (faceArea > MIN_FACE_AREA_TO_SAVE_AS_UNREG && client.tempQualityDescriptors.length < MAX_TEMP_DESCRIPTORS_FOR_UNKNOWN) {
                    client.tempQualityDescriptors.push(currentDescriptor);
                 }
            }

            // Обновление возраста
            if (d.age) {
                const box = d.detection.box; const faceArea = box.width * box.height;
                if (faceArea > MIN_FACE_AREA_FOR_RELIABLE_AGE) {
                    client.ageReadings.push(d.age);
                    if (client.ageReadings.length > AGE_READINGS_BUFFER_SIZE) { client.ageReadings.shift(); }
                    client.isAgeReliable = true;
                } else { client.isAgeReliable = (client.ageReadings.length > 0); }
                if (client.ageReadings.length > 0) { client.age = calculateMedian(client.ageReadings); }
                else if (client.age === '?') { client.age = Math.round(d.age); client.isAgeReliable = (faceArea > MIN_FACE_AREA_FOR_RELIABLE_AGE); }
            } else { client.isAgeReliable = false; }

            // Обновление пола и эмоций
            client.gender = d.gender || client.gender;
            if (d.expressions) {
                client.emotionsHistory.push(d.expressions); if(client.emotionsHistory.length > 50) client.emotionsHistory.shift();
                let currentDominant = 'neutral'; let maxProb = 0.4;
                const latestExpressions = d.expressions;
                if (latestExpressions) {
                    for (const [emo, prob] of Object.entries(latestExpressions)) { if (prob > maxProb) { maxProb = prob; currentDominant = emo; } }
                    client.dominantEmotion = currentDominant;
                }
            }

            seenLabelsThisFrame.add(currentLabelForFace);

            // Проверка зон
            const zoneKey = checkZone(client.box, interestZones);
            if (zoneKey && interestZones[zoneKey]) {
                const zoneName = interestZones[zoneKey].name;
                if (client.currentZone !== zoneKey) { client.currentZone = zoneKey; client.zoneEntryTime = now; }
                else {
                    const timeInZone = now - client.zoneEntryTime;
                    client.viewedModels.set(zoneName, (client.viewedModels.get(zoneName) || 0) + 700); // 700 = интервал
                    if (timeInZone >= ZONE_THRESHOLD && zoneKey !== 'Negotiation_Table' && zoneKey !== 'Manager_Desk' && !client.viewedModels.has(`${zoneName}_INTEREST`)) { // Исключаем столы
                        console.log(`[ИНТЕРЕС]: ${currentLabelForFace} к ${zoneName}`);
                        client.viewedModels.set(`${zoneName}_INTEREST`, true);
                    }
                }
            } else { client.currentZone = null; client.zoneEntryTime = null; }

            // Отрисовка
            faceapi.draw.drawDetections(canvas, d);
            drawClientInfo(ctx, client.box, client);

            // Показ форм/досье
            if (!isFormOpen && !isDossierOpen) {
                 if (client.isKnown && clientDataMap.has(client.id)) {
                    showDossier(clientDataMap.get(client.id));
                } else if (!client.isKnown && !client.registrationTriggered && (now - client.entryTime > REGISTRATION_DELAY)) {
                    if (client.age !== '?' && client.gender !== '?') {
                        client.registrationTriggered = true;
                        showRegistrationForm(client.age, client.gender, client.id);
                    }
                }
            }
        } // Конец цикла for (const d of detections)

        // Обработка ушедших и сохранение незарегистрированных
        for (const [label, client] of activeClients.entries()) {
            if (!seenLabelsThisFrame.has(label)) {
                if (now - client.lastSeen > INACTIVITY_TIMEOUT) {
                    client.timeSpent = client.lastSeen - client.entryTime;
                    console.log(`[УШЕЛ]: ${label}. Время: ${(client.timeSpent / 1000).toFixed(0)}с.`);
                    await sendClientDataToServer(client); // Отправляем данные
                    activeClients.delete(label);
                    if (isDossierOpen && dossierDisplayPanel.style.display === 'block' && (formLinkedClientId === label || (client.isKnown && clientDataMap.get(label) && dossierName.textContent === clientDataMap.get(label).name))) { hideDossier(); }
                    if (isFormOpen && registrationForm.style.display === 'block' && formLinkedClientId === label) { hideRegistrationForm(); }
                }
            } else {
                 if (!client.isKnown && client.id.startsWith('unknown_') && !unregisteredFaces.has(client.id) && client.tempQualityDescriptors && client.tempQualityDescriptors.length >= MIN_QUALITY_DESCRIPTORS_TO_SAVE_UNREG && (now - client.entryTime > MIN_TIME_TO_SAVE_UNKNOWN_AS_UNREG) ) {
                    unregIdCounter++; const newUnregId = `unreg_${unregIdCounter}`;
                    const repDescriptor = getRepresentativeDescriptor(client.tempQualityDescriptors);
                    if(repDescriptor){
                        unregisteredFaces.set(newUnregId, { id: newUnregId, descriptors: [repDescriptor], firstSeen: client.entryTime, lastSeen: now, ageEstimate: client.age, genderEstimate: client.gender });
                        console.log(`[NEW UNREG]: ${client.id} сохранен как ${newUnregId}.`);
                        const oldClientData = activeClients.get(client.id);
                        if(oldClientData){
                            oldClientData.id = newUnregId; oldClientData.tempQualityDescriptors = [];
                            activeClients.delete(label); activeClients.set(newUnregId, oldClientData);
                            if (formLinkedClientId === label) { formLinkedClientId = newUnregId; if(clientIdInput) clientIdInput.value = newUnregId; }
                        }
                    } else { console.warn("Не удалось получить репр. дескриптор для", client.id); }
                }
            }
        }
        if(statusText) statusText.innerText = `Активных: ${activeClients.size} (Незарег: ${unregisteredFaces.size}) Форма: ${isFormOpen} Досье: ${isDossierOpen}`;
    }

    // --- Запуск и интервал (из v6.0) ---
    async function startDetection() {
        console.log("Вызвана функция startDetection.");
        if (!canvas) {
            if (!videoContainer) { console.error("videoContainer не найден!"); return; }
            canvas = faceapi.createCanvasFromMedia(video); videoContainer.appendChild(canvas);
        }
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
            } catch (error) {
                console.error("ОШИБКА в цикле обнаружения:", error);
                if(statusText) statusText.innerText = "Ошибка обнаружения!";
                if (detectionInterval) clearInterval(detectionInterval); detectionInterval = null;
            }
        }, 700); // 700ms - хороший баланс между производительностью и реакцией
    }

    const run = async () => {
        console.log("Вызвана функция run."); if(statusText) statusText.innerText = "Загрузка моделей...";
        const models = ['ssdMobilenetv1', 'faceLandmark68Net', 'faceRecognitionNet', 'ageGenderNet', 'faceExpressionNet'];
        for (const modelName of models) {
            try {
                await faceapi.nets[modelName].loadFromUri("./models");
                console.log(`УСПЕХ: ${modelName} загружена.`);
            } catch (error) {
                console.error(`!!! ОШИБКА загрузки ${modelName}:`, error);
                if(statusText) statusText.innerText = `Ошибка загрузки ${modelName}!`;
                return;
            }
        }
        await loadClientData();
        faceMatcher = await loadLabeledImagesAndMatcher(labels);

        if(statusText) statusText.innerText = "Запуск видеопотока...";
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (err) {
            console.error("Ошибка доступа к камере:", err);
            if(statusText) statusText.innerText = "ОШИБКА: Нет доступа к камере!";
            alert("Нет доступа к камере!"); return;
        }
        video.addEventListener("play", () => {
            console.log("Событие 'play'. Вызываю startDetection...");
            startDetection();
            setInterval(updateDashboard, 1000); // Обновляем дашборд каждую секунду
        });
    };

    console.log("Вызываю run()...");
    run();
});
