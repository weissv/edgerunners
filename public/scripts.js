window.addEventListener('DOMContentLoaded', () => {

    console.log("DOM готов. Запускаем скрипт v4.0 Multi-Track (Хакатон)...");

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

    // Проверка элементов
    const allElements = { /* ... (как у вас) ... */ };
    // ... (код проверки) ...

    const video = document.createElement("video");
    video.autoplay = true; video.muted = true; video.width = 720; video.height = 560;
    videoContainer.appendChild(video);

    let canvas;
    let clientDataMap = new Map();
    let labels = [];
    let faceMatcher = null;
    let detectionInterval = null;

    // --- НОВЫЕ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let activeClients = new Map(); // Карта для отслеживания всех активных клиентов
    const INACTIVITY_TIMEOUT = 10000; // 10 секунд отсутствия = клиент ушел
    const ZONE_THRESHOLD = 3000;    // 3 секунды в зоне = интерес
    let sessionCounter = 0;         // Счетчик для уникальных ID неизвестных
    let isFormOpen = false;         // Флаг: открыта ли форма регистрации
    let isDossierOpen = false;      // Флаг: открыто ли досье
    let formLinkedClientId = null;  // С каким ID связана открытая форма

    // --- ЗОНЫ ИНТЕРЕСА (НАСТРОЙТЕ ЭТИ КООРДИНАТЫ!) ---
    const interestZones = {
        'Model_S': { x1: 50, y1: 100, x2: 250, y2: 400, name: 'Седан "Элегант"' },
        'Model_X': { x1: 450, y1: 100, x2: 670, y2: 400, name: 'Внедорожник "Простор"' },
        'Model_3': { x1: 260, y1: 300, x2: 440, y2: 500, name: 'Спорткар "Скорость"' }
    };

    const REGISTRATION_DELAY = 5000; // 5 секунд задержки перед показом формы

    // Проверка faceapi
    if (typeof faceapi === 'undefined') {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Библиотека face-api.min.js не загружена!");
        statusText.innerText = "ОШИБКА: face-api.js не найден!";
        return;
    }

    // --- Вспомогательные функции ---
    function calculateMedian(arr) { /* ... (как у вас) ... */ }
    function calculateMode(arr) { /* ... (как у вас) ... */ }
    function generateClientId() { return `NEW-${Date.now().toString().slice(-6)}`; }

    // --- НОВЫЕ Функции для отслеживания ---
    function createClientState(label, descriptor, detection, isKnown = false) {
        const now = Date.now();
        return {
            id: label,
            descriptor: descriptor,
            isKnown: isKnown,
            entryTime: now,
            lastSeen: now,
            timeSpent: 0,
            currentZone: null,
            zoneEntryTime: null,
            viewedModels: new Map(), // Модель -> Время (мс)
            age: detection.age ? Math.round(detection.age) : '?',
            gender: detection.gender || '?',
            box: detection.detection.box,
            emotionsHistory: [], // История сырых данных эмоций
            dominantEmotion: 'neutral',
            registrationTriggered: false, // Флаг, что форма для него уже была вызвана
        };
    }

    function checkZone(box, zones) {
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        for (const zoneName in zones) {
            const zone = zones[zoneName];
            if (centerX >= zone.x1 && centerX <= zone.x2 && centerY >= zone.y1 && centerY <= zone.y2) {
                return zoneName;
            }
        }
        return null;
    }

    function drawZones(ctx, zones) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.font = '13px Inter';
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        for (const zoneName in zones) {
            const z = zones[zoneName];
            ctx.strokeRect(z.x1, z.y1, z.x2 - z.x1, z.y2 - z.y1);
            ctx.fillText(zones[zoneName].name, z.x1 + 5, z.y1 + 15);
        }
    }

    function drawClientInfo(ctx, box, client) {
        const lines = [];
        const name = client.isKnown
            ? (clientDataMap.get(client.id)?.name || client.id)
            : `Клиент ${client.id.split('_')[1]}`;
        const genderMap = { 'male': 'М', 'female': 'Ж', '?': '?' };
        lines.push(`${name} (${genderMap[client.gender]}, ~${client.age})`);

        const timeInSalon = ((Date.now() - client.entryTime) / 1000).toFixed(0);
        lines.push(`Время: ${timeInSalon} сек`);

        if (client.currentZone) {
            lines.push(`Зона: ${interestZones[client.currentZone].name}`);
        }

        // Показать доминирующую эмоцию
        if (client.emotionsHistory.length > 0) {
           let dominant = 'neutral';
           let maxProb = 0.5; // Порог для отображения
           const lastEmotions = client.emotionsHistory[client.emotionsHistory.length - 1];
           for(const [emo, prob] of Object.entries(lastEmotions)) {
               if(prob > maxProb) {
                   maxProb = prob;
                   dominant = emo;
               }
           }
           lines.push(`Эмоция: ${dominant}`);
        }

        new faceapi.draw.DrawTextField(lines, box.topLeft, {
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            fontColor: '#C9D1D9',
            fontSize: 13,
            padding: 6
        }).draw(ctx);
    }

    function sendClientDataToServer(client) {
        const viewed = {};
        client.viewedModels.forEach((time, model) => {
            viewed[model] = (time / 1000).toFixed(1);
        });

        console.log("ОТПРАВКА ДАННЫХ (Симуляция):", {
            id: client.id,
            known: client.isKnown,
            age: client.age,
            gender: client.gender,
            entryTime: new Date(client.entryTime).toLocaleString('ru-RU'),
            exitTime: new Date().toLocaleString('ru-RU'),
            timeSpentSeconds: (client.timeSpent / 1000).toFixed(0),
            viewedModels: viewed,
        });
        // fetch('/api/client-visit', { method: 'POST', body: JSON.stringify(...) });
    }

    // --- Функции для работы с формой ---
    function showRegistrationForm(age, gender, clientId) {
        if (isFormOpen || isDossierOpen) return; // Не открывать, если что-то уже открыто

        console.log(`ВЫЗОВ: showRegistrationForm() для ${clientId}`);
        isFormOpen = true;
        formLinkedClientId = clientId; // Связываем форму с ID

        clientIdInput.value = clientId; // Используем temp ID или настоящий
        visitTimeInput.value = new Date().toLocaleString('ru-RU');
        clientAgeInput.value = age || '';
        clientGenderInput.value = gender || 'unknown';
        clientNameInput.value = ''; clientPhoneInput.value = ''; clientPurposeInput.value = '';
        registrationForm.style.display = 'block';
        // Не останавливаем интервал, чтобы видеть других
    }

    function hideRegistrationForm() {
        console.log("ВЫЗОВ: hideRegistrationForm()");
        registrationForm.style.display = 'none';
        isFormOpen = false;
        formLinkedClientId = null;
        // Не сбрасываем клиента, он может быть еще в кадре
    }

    saveRegFormButton.addEventListener('click', () => {
        const idToSave = clientIdInput.value;
        const newData = {
            id: generateClientId(), // Генерируем новый ID для БД
            label: clientNameInput.value || idToSave, // Используем имя как метку (или старый ID)
            name: clientNameInput.value, age: clientAgeInput.value,
            gender: clientGenderInput.value, phoneNumber: clientPhoneInput.value,
            clientId: idToSave, // Сохраняем временный ID для связи
            visitSchedule: [{ visitId: `V-${Date.now()}`, entryTime: visitTimeInput.value, exitTime: null, purpose: clientPurposeInput.value }]
        };

        console.log("Сохранение нового клиента (СИМУЛЯЦИЯ):", newData);
        alert(`Клиент ${newData.name} условно сохранен! \n(ТРЕБУЕТСЯ БЭКЕНД И ПЕРЕЗАГРУЗКА ДЛЯ РАСПОЗНАВАНИЯ)`);

        // В идеале: обновить clientDataMap, labels, faceMatcher (сложно)
        // Пока просто закрываем форму и, если клиент еще тут, он будет "известным" (условно)
        const client = activeClients.get(idToSave);
        if (client) {
            client.isKnown = true;
            client.id = newData.label; // Меняем ID на имя (для примера)
            client.needsRegistration = false;
            clientDataMap.set(newData.label, newData); // Добавляем в карту
            activeClients.delete(idToSave); // Удаляем старый
            activeClients.set(newData.label, client); // Добавляем новый
            console.log(`Клиент ${idToSave} обновлен до ${newData.label}`);
        }
        hideRegistrationForm();
    });
    closeRegFormButton.addEventListener('click', hideRegistrationForm);

    // --- Функции для досье ---
    function showDossier(clientInfo) {
        if (!clientInfo || isFormOpen || isDossierOpen) return; // Не открывать, если что-то открыто

        console.log(`ВЫЗОВ: showDossier() для ${clientInfo.label}`);
        isDossierOpen = true;
        dossierId.textContent = clientInfo.id || '-';
        dossierName.textContent = clientInfo.name || '-';
        // ... (остальные поля как у вас) ...
        dossierDisplayPanel.style.display = 'block';
    }

    function hideDossier() {
        console.log("ВЫЗОВ: hideDossier()");
        dossierDisplayPanel.style.display = 'none';
        isDossierOpen = false;
    }
    closeDossierButton.addEventListener('click', hideDossier);

    // --- Функции загрузки данных ---
    async function loadClientData() { /* ... (как у вас) ... */ }
    async function loadLabeledImagesAndMatcher(labelsToLoad) { /* ... (как у вас) ... */ }

    // --- НОВАЯ Логика обработки ---
    async function processMultipleDetections(detections, displaySize, canvas) {
        const now = Date.now();
        const seenLabelsThisFrame = new Set();
        const ctx = canvas.getContext("2d");

        for (const d of detections) {
            if (!d.descriptor) continue; // Пропускаем, если нет дескриптора

            const bestMatch = faceMatcher ? faceMatcher.findBestMatch(d.descriptor) : { label: 'unknown' };
            let currentLabel = bestMatch.label;
            let isKnown = bestMatch.label !== 'unknown';
            let client = null;

            // Ищем клиента
            if (isKnown) {
                client = activeClients.get(currentLabel);
            } else {
                for (const [label, c] of activeClients.entries()) {
                    if (!c.isKnown) {
                        const distance = faceapi.euclideanDistance(d.descriptor, c.descriptor);
                        if (distance < 0.55) {
                            client = c;
                            currentLabel = label;
                            break;
                        }
                    }
                }
            }

            // Если не нашли - создаем нового
            if (!client) {
                if (!isKnown) {
                    sessionCounter++;
                    currentLabel = `unknown_${sessionCounter}`;
                }
                client = createClientState(currentLabel, d.descriptor, d, isKnown);
                activeClients.set(currentLabel, client);
                console.log(`[ПОЯВИЛСЯ]: ${currentLabel} (Известен: ${isKnown})`);
            }

            // Обновляем данные
            client.lastSeen = now;
            client.box = d.detection.box;
            client.age = d.age ? Math.round(d.age) : client.age;
            client.gender = d.gender || client.gender;
            client.descriptor = d.descriptor;
            if(d.expressions) client.emotionsHistory.push(d.expressions);
            if(client.emotionsHistory.length > 50) client.emotionsHistory.shift();

            seenLabelsThisFrame.add(currentLabel);

            // Обновляем зоны
            const zone = checkZone(client.box, interestZones);
            if (zone) {
                if (client.currentZone !== zone) {
                    client.currentZone = zone;
                    client.zoneEntryTime = now;
                } else {
                    const timeInZone = now - client.zoneEntryTime;
                    client.viewedModels.set(interestZones[zone].name, (client.viewedModels.get(interestZones[zone].name) || 0) + 500);
                    if (timeInZone >= ZONE_THRESHOLD && !client.viewedModels.has(`${interestZones[zone].name}_INTEREST`)) {
                        console.log(`[ИНТЕРЕС]: ${currentLabel} к ${interestZones[zone].name}`);
                        client.viewedModels.set(`${interestZones[zone].name}_INTEREST`, true);
                    }
                }
            } else { client.currentZone = null; client.zoneEntryTime = null; }

            // Рисуем
            faceapi.draw.drawDetections(canvas, d);
            drawClientInfo(ctx, client.box, client);

            // Логика UI (только если ничего не открыто)
            if (!isFormOpen && !isDossierOpen) {
                if (client.isKnown) {
                    showDossier(clientDataMap.get(client.id));
                } else if (!client.registrationTriggered && (now - client.entryTime > REGISTRATION_DELAY)) {
                    client.registrationTriggered = true;
                    showRegistrationForm(client.age, client.gender, client.id);
                }
            }
        }

        // Удаляем ушедших
        for (const [label, client] of activeClients.entries()) {
            if (!seenLabelsThisFrame.has(label)) {
                if (now - client.lastSeen > INACTIVITY_TIMEOUT) {
                    client.timeSpent = client.lastSeen - client.entryTime;
                    console.log(`[УШЕЛ]: ${label}. Время: ${(client.timeSpent / 1000).toFixed(0)}с.`);
                    sendClientDataToServer(client);
                    activeClients.delete(label);
                    if (isDossierOpen && dossierId.textContent === label) hideDossier();
                    if (isFormOpen && formLinkedClientId === label) hideRegistrationForm();
                }
            }
        }
         statusText.innerText = `Активных клиентов: ${activeClients.size}. Форма: ${isFormOpen}. Досье: ${isDossierOpen}`;
    }


    // --- Запуск и интервал ---
    async function startDetection() {
        console.log("Вызвана функция startDetection.");
        if (!canvas) { canvas = faceapi.createCanvasFromMedia(video); videoContainer.appendChild(canvas); }
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        if (detectionInterval) clearInterval(detectionInterval);

        detectionInterval = setInterval(async () => {
            try {
                const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptors()
                    .withAgeAndGender()
                    .withFaceExpressions(); // <-- Добавили эмоции

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                drawZones(ctx, interestZones); // Рисуем зоны

                await processMultipleDetections(resizedDetections, displaySize, canvas); // Вызываем новую функцию

            } catch (error) {
                console.error("ОШИБКА в цикле обнаружения:", error);
                statusText.innerText = "Ошибка обнаружения!";
                if (detectionInterval) clearInterval(detectionInterval);
                detectionInterval = null;
            }
        }, 500); // 500ms интервал
    }

    // --- Функция RUN ---
    const run = async () => {
        console.log("Вызвана функция run.");
        statusText.innerText = "Загрузка моделей...";
        // УБЕДИТЕСЬ, ЧТО ВСЕ МОДЕЛИ ЕСТЬ В ПАПКЕ /models
        const models = ['ssdMobilenetv1', 'faceLandmark68Net', 'faceRecognitionNet', 'ageGenderNet', 'faceExpressionNet'];
        for (const modelName of models) {
            try { await faceapi.nets[modelName].loadFromUri("./models"); console.log(`УСПЕХ: ${modelName} загружена.`); }
            catch (error) { console.error(`!!! ОШИБКА загрузки ${modelName}:`, error); statusText.innerText = `Ошибка загрузки ${modelName}!`; return; }
        }

        await loadClientData();
        faceMatcher = await loadLabeledImagesAndMatcher(labels);

        statusText.innerText = "Запуск видеопотока...";
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (err) { console.error("Ошибка доступа к камере:", err); statusText.innerText = "ОШИБКА: Нет доступа к камере!"; return; }

        video.addEventListener("play", () => {
            console.log("Событие 'play'. Вызываю startDetection...");
            startDetection();
        });
    };

    console.log("Вызываю run()...");
    run();

}); // Конец DOMContentLoaded