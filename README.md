# Лабораторна робота 5 — розгортання вебсайту

Вихідні файли HTML-версії лежать у корені. React-версія — у `lab_2_react`; вона має власні копії налаштувань, спільних модулів і JSON, тому збірка не залежить від файлів поза її коренем.

## 1. Публічний репозиторій GitHub

Створіть порожній Public репозиторій `web-lab-5` без README, ліцензії та .gitignore. Розпакуйте архів і відкрийте термінал саме в папці `lab_5`, де лежить `index.html`.

```powershell
git init -b main
git add .
git status --short
git commit -m "Підготував HTML і React до розгортання"
git remote add origin https://github.com/andriyskalotskiy-hub/web-lab-5.git
git push -u origin main
```

Якщо обрали іншу назву репозиторію, візьміть адресу з GitHub. Переконайтеся, що на GitHub у корені видно `index.html` і `lab_2_react/`. Збережіть посилання та скріншот.

## 2. Два проєкти Vercel з одного репозиторію

У Vercel оберіть Add New → Project → Import для цього репозиторію. Повторіть двічі з різними назвами.

| Налаштування | HTML | React |
|---|---|---|
| Root Directory | Корінь репозиторію | lab_2_react |
| Framework Preset | Other | Vite |
| Install Command | Не потрібна | npm install |
| Build Command | Порожня, без збірки | npm run build |
| Output Directory | . | dist |
| Production Branch | main | main |

Після Deploy відкрийте обидві публічні HTTPS-адреси та зробіть скріншоти. На обох перевірте тему, футер, форму, український JSON і пряме джерело JSONPlaceholder. У браузері через Network можна перевірити, що український JSON запитано окремим файлом. Надішліть тестове повідомлення з кожного сайту й перевірте пошту.

## 3. Автооновлення

Лише після першого успішного розгортання і скріншотів замініть «ОСОБИСТЕ РЕЗЮМЕ / 2026» на «ОСОБИСТЕ РЕЗЮМЕ / ЛАБОРАТОРНА 5» у `index.html` і `lab_2_react/src/components/CvHeader.jsx`.

```powershell
git add index.html lab_2_react/src/components/CvHeader.jsx
git commit -m "Оновив заголовки для перевірки автодеплою"
git push
git rev-parse HEAD
```

Не запускайте Redeploy вручну. Знайдіть у вкладці Deployments успішне Production-розгортання з новим комітом, перезавантажте обидві публічні сторінки й зробіть скріншоти зі зміненим написом. Для звіту потрібне посилання на цей коміт. Власний домен опційний.
