# Matrix Dark Web for Firefox / source: github.com/zeittresor/dark_matrix

A local Firefox extension that transforms regular websites into a **Matrix-inspired dark mode** with dark backgrounds, green outlines, neon glow, elegant panels, and optional scanline effects.

---

## Languages
- [English](#english)
- [Deutsch](#deutsch)
- [Français](#français)
- [Русский](#русский)

---

# English

## Overview
**Matrix Dark Web for Firefox** is a local browser extension that applies a cyber-green, Matrix-like dark theme to many websites directly in Firefox.

### Features
- dark background styling
- green borders and glow effects
- improved panel/card styling
- optional scanline look
- popup for quick enable/disable
- options page for tuning the effect
- per-domain exclusions

## Installation

### Option 1: Temporary installation for testing
Recommended for local testing and development.

1. Download or extract the project files.
2. Open Firefox.
3. Enter `about:debugging` in the address bar.
4. Open **This Firefox**.
5. Click **Load Temporary Add-on**.
6. Select the `manifest.json` file from the extracted extension folder.

### Option 2: ZIP package in debugging mode
Some Firefox versions also accept a correctly packed ZIP in `about:debugging`, as long as `manifest.json` is at the root of the archive.

## Important note about XPI files
The included XPI package is intended mainly as a packed project file.
In normal Firefox Release/Beta builds, an **unsigned** XPI usually cannot be installed permanently.
If Firefox says the package is damaged or cannot be installed, this is commonly related to signing restrictions.

## Usage
- Click the toolbar button to open the popup.
- Enable or disable the Matrix effect.
- Open the options page to tune glow, overlays, and exclusions.

## Project structure
- `manifest.json` — extension manifest
- `background.js` — background logic
- `content.js` — DOM detection and runtime application
- `matrix.css` — Matrix visual styling
- `popup.html` / `popup.js` — toolbar popup
- `options.html` / `options.js` — settings page
- `ui.css` — popup/options styling
- `icons/` — extension icons

## Limitations
- Internal Firefox pages cannot be styled.
- Some highly dynamic sites may still need further custom rules.
- Very unusual site-specific layouts can require manual tuning.

---

# Deutsch

## Übersicht
**Matrix Dark Web für Firefox** ist eine lokale Browser-Erweiterung, die viele Webseiten direkt in Firefox in einen **Matrix-inspirierten Dark Mode** mit dunklen Hintergründen, grünen Umrandungen, Glow-Effekten und eleganten Panels verwandelt.

### Funktionen
- dunkle Hintergrundgestaltung
- grüne Konturen und Leuchteffekte
- verbesserte Panel-/Karten-Optik
- optionale Scanlines
- Popup zum schnellen Ein- und Ausschalten
- Optionsseite für Feineinstellungen
- Ausschlüsse pro Domain

## Installation

### Option 1: Temporäre Installation zum Testen
Empfohlen für lokale Tests und Entwicklung.

1. Projektdateien herunterladen oder entpacken.
2. Firefox öffnen.
3. `about:debugging` in die Adresszeile eingeben.
4. **Dieser Firefox** öffnen.
5. **Temporäres Add-on laden** anklicken.
6. Die Datei `manifest.json` aus dem entpackten Erweiterungsordner auswählen.

### Option 2: ZIP-Paket im Debug-Modus
Manche Firefox-Versionen akzeptieren unter `about:debugging` auch eine korrekt gepackte ZIP-Datei, sofern sich die `manifest.json` im Wurzelverzeichnis des Archivs befindet.

## Wichtiger Hinweis zu XPI-Dateien
Die beiliegende XPI-Datei dient in erster Linie als gepackte Projektdatei.
In normalen Firefox-Release-/Beta-Versionen lässt sich eine **unsignierte** XPI in der Regel nicht dauerhaft installieren.
Wenn Firefox meldet, dass das Paket beschädigt ist oder nicht installiert werden kann, liegt das meist an den Signaturvorgaben.

## Nutzung
- Auf den Toolbar-Button klicken, um das Popup zu öffnen.
- Den Matrix-Effekt aktivieren oder deaktivieren.
- Über die Optionsseite Glow, Overlays und Domain-Ausschlüsse anpassen.

## Projektstruktur
- `manifest.json` — Erweiterungsdefinition
- `background.js` — Hintergrundlogik
- `content.js` — DOM-Erkennung und Anwendung zur Laufzeit
- `matrix.css` — Matrix-Optik
- `popup.html` / `popup.js` — Toolbar-Popup
- `options.html` / `options.js` — Einstellungsseite
- `ui.css` — Styling für Popup und Optionen
- `icons/` — Erweiterungssymbole

## Einschränkungen
- Interne Firefox-Seiten können nicht umgestaltet werden.
- Manche sehr dynamischen Webseiten benötigen eventuell zusätzliche Sonderregeln.
- Ungewöhnliche Layouts einzelner Seiten können manuelle Nacharbeit erfordern.

---

# Français

## Aperçu
**Matrix Dark Web pour Firefox** est une extension locale qui transforme de nombreux sites web dans Firefox en un **mode sombre inspiré de Matrix**, avec arrière-plans foncés, contours verts, effets lumineux et panneaux élégants.

### Fonctionnalités
- style de fond sombre
- contours verts et effets glow
- apparence améliorée des cartes et panneaux
- scanlines optionnelles
- popup pour activer ou désactiver rapidement l’effet
- page d’options pour ajuster le rendu
- exclusions par domaine

## Installation

### Option 1 : installation temporaire pour les tests
Recommandée pour les tests locaux et le développement.

1. Téléchargez ou extrayez les fichiers du projet.
2. Ouvrez Firefox.
3. Saisissez `about:debugging` dans la barre d’adresse.
4. Ouvrez **This Firefox**.
5. Cliquez sur **Load Temporary Add-on**.
6. Sélectionnez le fichier `manifest.json` dans le dossier extrait de l’extension.

### Option 2 : archive ZIP en mode débogage
Certaines versions de Firefox acceptent aussi une archive ZIP correctement empaquetée dans `about:debugging`, à condition que `manifest.json` se trouve à la racine de l’archive.

## Remarque importante concernant les fichiers XPI
Le fichier XPI fourni sert principalement de paquet du projet.
Dans les versions Firefox Release/Beta classiques, un fichier XPI **non signé** ne peut généralement pas être installé de manière permanente.
Si Firefox indique que le paquet est endommagé ou ne peut pas être installé, cela est souvent lié aux restrictions de signature.

## Utilisation
- Cliquez sur le bouton de la barre d’outils pour ouvrir le popup.
- Activez ou désactivez l’effet Matrix.
- Ouvrez la page d’options pour régler le glow, les overlays et les exclusions.

## Structure du projet
- `manifest.json` — manifeste de l’extension
- `background.js` — logique d’arrière-plan
- `content.js` — détection du DOM et application dynamique
- `matrix.css` — style visuel Matrix
- `popup.html` / `popup.js` — popup de la barre d’outils
- `options.html` / `options.js` — page des paramètres
- `ui.css` — style du popup et des options
- `icons/` — icônes de l’extension

## Limitations
- Les pages internes de Firefox ne peuvent pas être modifiées.
- Certains sites très dynamiques peuvent nécessiter des règles supplémentaires.
- Des mises en page très spécifiques peuvent demander un ajustement manuel.

---

# Русский

## Обзор
**Matrix Dark Web для Firefox** — это локальное расширение для браузера, которое преобразует многие сайты в Firefox в **тёмный режим в стиле Matrix** с тёмными фонами, зелёными контурами, свечением и элегантными панелями.

### Возможности
- тёмное оформление фона
- зелёные рамки и эффекты свечения
- улучшенный стиль карточек и панелей
- дополнительные scanlines
- всплывающее окно для быстрого включения и выключения
- страница настроек для тонкой регулировки
- исключения по доменам

## Установка

### Вариант 1: временная установка для тестирования
Рекомендуется для локального тестирования и разработки.

1. Скачайте или распакуйте файлы проекта.
2. Откройте Firefox.
3. Введите `about:debugging` в адресной строке.
4. Откройте **This Firefox**.
5. Нажмите **Load Temporary Add-on**.
6. Выберите файл `manifest.json` из распакованной папки расширения.

### Вариант 2: ZIP-архив в режиме отладки
Некоторые версии Firefox также принимают правильно упакованный ZIP-архив через `about:debugging`, если файл `manifest.json` находится в корне архива.

## Важное примечание о файлах XPI
Приложенный XPI-файл в основном служит как упакованный файл проекта.
В обычных версиях Firefox Release/Beta **неподписанный** XPI, как правило, нельзя установить постоянно.
Если Firefox сообщает, что пакет повреждён или не может быть установлен, это обычно связано с требованиями подписи.

## Использование
- Нажмите кнопку на панели инструментов, чтобы открыть всплывающее окно.
- Включите или выключите эффект Matrix.
- Откройте страницу настроек, чтобы настроить свечение, наложения и исключения доменов.

## Структура проекта
- `manifest.json` — манифест расширения
- `background.js` — фоновая логика
- `content.js` — анализ DOM и применение стиля во время работы
- `matrix.css` — визуальный стиль Matrix
- `popup.html` / `popup.js` — всплывающее окно панели инструментов
- `options.html` / `options.js` — страница настроек
- `ui.css` — стиль popup и страницы настроек
- `icons/` — иконки расширения

## Ограничения
- Внутренние страницы Firefox нельзя изменить.
- Некоторые очень динамичные сайты могут потребовать дополнительных правил.
- Необычные макеты отдельных сайтов могут потребовать ручной настройки.
