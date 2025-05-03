import os
import json
import uuid
import requests # <-- Убедитесь, что установили: pip install requests
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

API_URL = "https://api-inference.huggingface.co/models/blanchefort/rubert-base-cased-sentiment-rusentiment"
# Получаем токен из переменных окружения (настройте на Render!)
HF_API_TOKEN = os.environ.get("HF_TOKEN")
API_HEADERS = {}
if HF_API_TOKEN:
    API_HEADERS["Authorization"] = f"Bearer {HF_API_TOKEN}"
else:
    print("Предупреждение: Переменная окружения HF_TOKEN не найдена. API Hugging Face может иметь низкие лимиты.")
# -------------------------------------------------------------------------------------
# --- Настройка Flask ---
BASE_DIR = os.getcwd()
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
# --->>> Используем папку 'upload' согласно вашему скриншоту <<<---
UPLOADS_DIR = os.path.join(PUBLIC_DIR, 'upload')
# -----------------------------------------------------------
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Flask настроен на раздачу статики из 'public'
app = Flask(__name__, static_folder=PUBLIC_DIR, static_url_path='')
CORS(app) # Разрешаем CORS

# --- Инициализация окружения ---
def initialize_environment():
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        os.makedirs(PUBLIC_DIR, exist_ok=True)
        # --->>> Создаем папку 'upload' <<<---
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        # ----------------------------------

        data_files = ['projects.json', 'contractors.json', 'reports.json']
        for filename in data_files:
            filepath = os.path.join(DATA_DIR, filename)
            if not os.path.exists(filepath):
                with open(filepath, 'w', encoding='utf-8') as f: json.dump([], f)
                print(f"Создан пустой файл данных: {filename}")

        index_html_path = os.path.join(PUBLIC_DIR, 'index.html')
        if not os.path.exists(index_html_path):
             with open(index_html_path, 'w', encoding='utf-8') as f:
                 f.write('<!DOCTYPE html><html><head><title>App</title></head><body>index.html not found in /public!</body></html>')
             print(f"Создан базовый файл: {index_html_path}")

    except Exception as e:
        print(f"Ошибка при инициализации окружения: {e}")
        exit(1)

initialize_environment()

# --- Функции для работы с JSON ---
def read_data(filename):
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f: return json.load(f)
    except FileNotFoundError: print(f"Предупреждение: Файл {filename} не найден."); return []
    except json.JSONDecodeError: print(f"Ошибка: Файл {filename} не JSON."); return []
    except Exception as e: print(f"Ошибка чтения {filename}: {e}"); raise
def write_data(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e: print(f"Ошибка записи {filename}: {e}"); raise

# --- Конфигурация Hugging Face API ---
# Модель для анализа тональности русского текста
API_URL = "https://api-inference.huggingface.co/models/blanchefort/rubert-base-cased-sentiment-rusentiment"
# Получаем токен из переменных окружения (настройте на Render!)
HF_API_TOKEN = os.environ.get("HF_TOKEN")
API_HEADERS = {}
if HF_API_TOKEN:
    API_HEADERS["Authorization"] = f"Bearer {HF_API_TOKEN}"
else:
    print("Предупреждение: Переменная окружения HF_TOKEN не найдена. API Hugging Face может иметь низкие лимиты.")


# --- Маршруты API ---
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try: return jsonify(read_data('projects.json'))
    except Exception as e: return jsonify({"message": "Ошибка получения списка проектов", "error": str(e)}), 500

@app.route('/api/contractors', methods=['GET'])
def get_contractors():
    try: return jsonify(read_data('contractors.json'))
    except Exception as e: return jsonify({"message": "Ошибка получения списка подрядчиков", "error": str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        project_id = request.args.get('projectId')
        reports = read_data('reports.json')
        if project_id: reports = [r for r in reports if str(r.get('projectId')) == str(project_id)]
        reports.sort(key=lambda r: r.get('date', ''), reverse=True)
        return jsonify(reports)
    except Exception as e: return jsonify({"message": "Ошибка получения списка отчетов", "error": str(e)}), 500

# --- ОБНОВЛЕННЫЙ Маршрут POST /api/reports с вызовом Sentiment API ---



@app.route('/api/reports', methods=['POST'])
def add_report():
    """
    Обрабатывает POST-запрос для добавления нового отчета гражданина.
    Включает загрузку фото, анализ тональности комментария через Hugging Face API
    и обновление уровня тревоги проекта на основе негативной тональности.
    """
    saved_photo_filepath = None # Путь к сохраненному файлу для возможного удаления при ошибке
    try:
        # 1. Получение данных из запроса
        project_id = request.form.get('projectId')
        comment = request.form.get('comment', '').strip() # Убираем лишние пробелы
        latitude_str = request.form.get('latitude')
        longitude_str = request.form.get('longitude')
        photo_file = request.files.get('report-photo') # Имя поля <input type="file" name="report-photo">

        # 2. Базовая валидация
        if not project_id or not comment:
            return jsonify({"message": "ID проекта и комментарий обязательны."}), 400

        # 3. Обработка загруженного файла (если есть)
        photo_path_for_json = None
        if photo_file:
            if photo_file.filename == '':
                 # Файл был отправлен, но без имени (редко, но возможно)
                 return jsonify({"message": "Получен файл без имени."}), 400

            # Проверка расширения файла
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
            file_ext = photo_file.filename.split('.')[-1].lower() if '.' in photo_file.filename else ''
            if not file_ext or file_ext not in allowed_extensions:
                 return jsonify({"message": "Недопустимый тип файла. Разрешены только изображения (png, jpg, jpeg, gif, webp)."}), 400

            # Создание безопасного и уникального имени файла
            filename = secure_filename(photo_file.filename) # Удаляет опасные символы
            unique_suffix = f"{int(datetime.now().timestamp())}-{uuid.uuid4().hex[:6]}"
            base, ext = os.path.splitext(filename)
            secure_unique_filename = f"report-photo-{unique_suffix}{ext}" # Префикс + уникальность + расширение

            # Путь для сохранения файла на сервере
            saved_photo_filepath = os.path.join(UPLOADS_DIR, secure_unique_filename) # UPLOADS_DIR должен быть определен глобально
            # Сохранение файла
            photo_file.save(saved_photo_filepath)
            # URL-путь для доступа к файлу из браузера (относительно корня сайта)
            photo_path_for_json = f"/upload/{secure_unique_filename}" # Используем /upload/ согласно вашей структуре

        # 4. Обработка геолокации (если есть)
        location = None
        try:
            if latitude_str and longitude_str:
                lat = float(latitude_str)
                lon = float(longitude_str)
                location = {"lat": lat, "lon": lon}
        except (ValueError, TypeError):
            print(f"Предупреждение: Неверный формат геолокации ({latitude_str}, {longitude_str}), проигнорировано.")
            location = None # Игнорируем неверные данные

        # 5. Анализ тональности комментария через Hugging Face API
        sentiment_label = 'unknown' # Метка тональности по умолчанию
        sentiment_score = 0         # Оценка уверенности по умолчанию
        sentiment_full_result = None # Полный результат для сохранения
        alert_level = 0              # Расчетный уровень тревоги по умолчанию

        if comment: # Анализируем только если есть непустой комментарий
            try:
                api_payload = {"inputs": comment}
                # Отправляем запрос к API
                api_response = requests.post(API_URL, headers=API_HEADERS, json=api_payload, timeout=10) # Таймаут 10 секунд

                # Проверяем успешность ответа API
                if api_response.status_code == 200:
                    sentiment_results = api_response.json()
                    print(f"Sentiment API response: {sentiment_results}") # Логируем ответ для отладки

                    # Извлекаем результат (структура может зависеть от модели)
                    # Ожидаем [[{'label': '...', 'score': ...}, ...]]
                    if sentiment_results and isinstance(sentiment_results, list) and sentiment_results[0]:
                        # Находим метку с наивысшей оценкой (score)
                        top_result = max(sentiment_results[0], key=lambda x: x.get('score', 0))
                        sentiment_label = top_result.get('label', 'unknown').lower()
                        sentiment_score = top_result.get('score', 0)
                        sentiment_full_result = {"label": sentiment_label, "score": sentiment_score}

                        # --->>> ИСПРАВЛЕННАЯ ЛОГИКА ОПРЕДЕЛЕНИЯ УРОВНЯ ТРЕВОГИ <<<---
                        # Повышаем уровень только для НЕГАТИВНЫХ отзывов
                        if sentiment_label == 'negative':
                            if sentiment_score > 0.8: # Уверенно негативный -> Уровень 2
                                alert_level = 2
                            else: # Менее уверенный негативный -> Уровень 1
                                alert_level = 1
                        # Для 'positive' и 'neutral' alert_level остается 0
                        # --->>> КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ <<<---

                else:
                    # Логируем ошибку от API, если статус не 200 OK
                    print(f"Ошибка Sentiment API: Статус {api_response.status_code}, Ответ: {api_response.text}")
                    # Оставляем alert_level = 0

            # Обработка ошибок сети или API
            except requests.exceptions.Timeout:
                print("Ошибка Sentiment API: Таймаут запроса")
                # Оставляем alert_level = 0
            except requests.exceptions.RequestException as api_err:
                print(f"Ошибка вызова Sentiment API: {api_err}")
                # Оставляем alert_level = 0
            except Exception as parse_err:
                 print(f"Ошибка обработки ответа Sentiment API: {parse_err}")
                 # Оставляем alert_level = 0
        # --- Конец блока анализа тональности ---

        # 6. Чтение текущих данных
        # read_data/write_data должны быть определены глобально или импортированы
        all_reports = read_data('reports.json')
        all_projects = read_data('projects.json')

        # 7. Создание объекта нового отчета
        new_report = {
            "id": str(uuid.uuid4()),
            "projectId": project_id,
            "comment": comment,
            "date": datetime.now().isoformat() + "Z", # ISO формат UTC
            "photoPath": photo_path_for_json,
            "location": location,
            "sentiment": sentiment_full_result # Сохраняем результат анализа (может быть None)
        }
        all_reports.append(new_report) # Добавляем новый отчет

        # 8. Обновление уровня тревоги проекта (если необходимо)
        updated_project = None # Проект, который вернется в ответе
        project_index = -1
        # Ищем проект по ID (сравнение строк)
        for i, p in enumerate(all_projects):
            if str(p.get('id')) == str(project_id):
                project_index = i
                break

        if project_index != -1:
            project = all_projects[project_index]
            current_alert_level = project.get("citizenAlertLevel", 0)

            # --->>> ИСПРАВЛЕННАЯ ЛОГИКА ОБНОВЛЕНИЯ УРОВНЯ <<<---
            # Обновляем ТОЛЬКО если новый уровень (alert_level, основанный на негативе)
            # строго ВЫШЕ текущего уровня тревоги проекта (current_alert_level).
            should_update = alert_level > current_alert_level

            if should_update:
                all_projects[project_index]["citizenAlertLevel"] = alert_level
                updated_project = all_projects[project_index] # Запоминаем обновленный проект
                print(f"Обновлен уровень тревоги для проекта {project_id} на {alert_level} на основе НЕГАТИВНОЙ тональности")
                # Сохраняем ИЗМЕНЕННЫЙ список проектов
                write_data('projects.json', all_projects)
            else:
                updated_project = project # Возвращаем текущий проект (не измененный)
                if alert_level > 0: # Логируем, почему не обновили, если был негатив
                     print(f"Уровень тревоги для проекта {project_id} не повышен (текущий {current_alert_level} >= нового {alert_level})")
            # --->>> КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ОБНОВЛЕНИЯ <<<---
        else:
             print(f"Предупреждение: Проект с ID {project_id} не найден для обновления уровня тревоги.")


        # 9. Сохранение списка отчетов (всегда, т.к. добавлен новый)
        write_data('reports.json', all_reports)

        # 10. Возврат успешного ответа фронтенду
        # Возвращаем созданный отчет и проект (обновленный или нет)
        return jsonify({'report': new_report, 'updatedProject': updated_project}), 201

    # 11. Обработка общих ошибок внутри функции
    except Exception as e:
        print(f"Критическая ошибка при обработке /api/reports POST: {e}")
        # Пытаемся удалить загруженный файл, если ошибка произошла после его сохранения
        if saved_photo_filepath and os.path.exists(saved_photo_filepath):
             try:
                 os.remove(saved_photo_filepath)
                 print(f"Удален файл {saved_photo_filepath} из-за ошибки обработки.")
             except OSError as unlink_error:
                 # Логируем ошибку удаления, но продолжаем
                 print(f"Ошибка удаления файла {saved_photo_filepath} после ошибки: {unlink_error}")
        # Возвращаем ошибку 500
        return jsonify({"message": "Внутренняя ошибка сервера при отправке отчета", "error": str(e)}), 500

# --- Маршрут для раздачи загруженных файлов из папки 'upload' ---
@app.route('/upload/<path:filename>')
def serve_upload(filename):
    if '..' in filename or filename.startswith('/'): return jsonify({"message": "Недопустимый путь файла"}), 400
    try:
        # Отдаем файл из папки UPLOADS_DIR (public/upload)
        return send_from_directory(UPLOADS_DIR, filename)
    except FileNotFoundError:
         return jsonify({"message": "Файл не найден"}), 404


# --- Catch-all маршрут отдает index.html из папки 'public' ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    # Пропускаем API и Uploads
    if path.startswith('api/') or path.startswith('upload/'):
         return jsonify({"message": "Не найдено (API/Upload)"}), 404

    requested_path = os.path.join(PUBLIC_DIR, path)
    # Отдаем статический файл (css, js, img), если он есть в public/
    if path != "" and os.path.exists(requested_path) and not os.path.isdir(requested_path):
         return send_from_directory(PUBLIC_DIR, path)
    else:
         # Иначе отдаем index.html
         return send_from_directory(PUBLIC_DIR, 'index.html')


# --- Запуск сервера ---
if __name__ == '__main__':
    # Используем порт из окружения Render или 5000 по умолчанию для Flask
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)