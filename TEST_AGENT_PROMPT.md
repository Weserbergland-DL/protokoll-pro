# Test-Prompt für ImmoAkte

> Diesen Prompt 1:1 an den Test-Agenten weitergeben. Er enthält alles, was der Agent zum Starten braucht — inklusive das Bug-Reporting-Protokoll, über das der Entwickler (Hauptagent) die Funde direkt einsehen und beheben kann.

---

Du testest eine deutschsprachige Next.js-App namens **"ImmoAkte"** (immoakte.de) —
ein Tool für Vermieter zur Verwaltung von Mietverhältnissen und zur Erstellung
digitaler Mietverträge, Wohnungsgeberbestätigungen, Kautionsbescheinigungen
und Übergabeprotokollen. Stack: Next.js 15 (App Router, Turbopack), React 19,
TypeScript, Tailwind v4, Supabase (Auth + DB), Stripe, Tiptap (Rich-Text),
html2pdf.js. Repo liegt unter `/Users/otikiz/Developer/immoakte`.

Du bekommst einen **KOMPLETT LEEREN Account** (frisch registriert, keine Daten).
Dein Job: die App von der ersten Minute an durchspielen wie ein neuer Nutzer —
alles selbst anlegen, jeden Flow mindestens einmal durchlaufen, auf dem Weg
Bugs, Darstellungsfehler, UX-Stolperstellen und Optimierungspotenzial finden.

Du darfst Code lesen, den Dev-Server starten und mit `preview_*`-Tools im Browser
navigieren & klicken. **KEINE Änderungen am Code vornehmen** — du findest nur,
implementierst nicht.

---

## 🐛 Bug-Reporting-Protokoll (WICHTIG!)

Jeden Fund legst du SOFORT als eigene Datei im Verzeichnis
`/Users/otikiz/Developer/immoakte/.bugs/` ab. Das Verzeichnis existiert bereits.
Der Entwickler-Agent beobachtet dieses Verzeichnis, behebt die Funde und löscht
die Dateien — so laufen Finden und Fixen parallel.

### Dateinamen-Konvention

```
NNN-severity-kurz-titel.md     # Bug-Beschreibung (Markdown)
NNN-severity-kurz-titel.png    # Screenshot (falls visuell relevant)
NNN-severity-kurz-titel-2.png  # Weitere Screenshots, -3, -4 etc.
```

- `NNN` = fortlaufende Nummer ab `001` (achte auf schon existierende Dateien,
  bevor du nummerierst)
- `severity` = eines von `critical`, `high`, `medium`, `low`
- `kurz-titel` = kebab-case, max. 5–6 Wörter, beschreibt das Problem

**Beispiele:**
```
001-critical-pdf-export-crash.md
001-critical-pdf-export-crash.png
002-high-dark-mode-editor-white.md
002-high-dark-mode-editor-white.png
003-medium-submit-button-stays-loading.md
004-low-tooltip-text-abgeschnitten.md
```

### Screenshot-Regeln

Mach einen Screenshot (`preview_screenshot`) IMMER wenn:
- ein visuelles Problem vorliegt (Farben, Layout, Kontrast, Überlappung)
- ein PDF-Problem sichtbar ist (Seitenumbruch, fehlende Elemente)
- ein unerwartetes Verhalten UI-seitig zu sehen ist
- ein Fehler-Toast oder Konsolen-Error auftaucht

Speichere den Screenshot unter dem gleichen Basis-Dateinamen wie das Markdown,
nur mit `.png` Endung. Mehrere Screenshots → suffix `-2`, `-3` usw.

### Markdown-Template pro Bug

```markdown
---
id: 001
severity: critical
title: PDF-Export crasht bei langen Mietverträgen
area: Mietvertrag-PDF
browser: Chrome 131 / Desktop 1280x800
darkMode: false
screenshot: 001-critical-pdf-export-crash.png
---

## Was passiert
Kurze, faktische Beschreibung (1–3 Sätze). Was hast du gesehen,
was hast du erwartet?

## Reproduktion
1. Als leerer Account einloggen
2. Neues Mietverhältnis anlegen (Beispieldaten unten)
3. Neuen Mietvertrag erstellen
4. 12 weitere §-Abschnitte hinzufügen (siehe Inhalt unten)
5. Unten rechts "PDF herunterladen" klicken

**Beispiel-Eingabedaten:**
- Mieter: Max Mustermann, max@beispiel.de
- Adresse: Musterstraße 1, 10115 Berlin
- (alle weiteren Felder dokumentieren, die du ausgefüllt hast)

## Erwartetes Verhalten
PDF wird heruntergeladen, alle §§ sind lesbar, keine Seitenumbrüche mitten
in Überschriften.

## Tatsächliches Verhalten
Download startet, Konsole zeigt "html2canvas: out of memory". Seite 3–4
des PDFs fehlt komplett. Siehe Screenshot.

## Datei/Komponente (wenn bekannt)
- `lib/document-pdf.ts:118` — html2canvas-Aufruf
- `components/documents/SectionsDocumentEditor.tsx:240`

## Lösungsvorschlag
Evtl. `scale: 1.5` statt `scale: 2`, oder Batching für lange Dokumente.

## Logs / Konsolen-Output
```
html2canvas: out of memory
  at generateDocumentPdf (document-pdf.ts:118)
  ...
```
```

### Tipps beim Schreiben der Reports

- **Reproduktion immer vom leeren Account an** dokumentieren, nicht "ich war
  schon eingeloggt und habe X geklickt". Der Fixer muss es nachstellen können.
- **Konkrete Eingabedaten** reinschreiben — welche Strings hast du eingegeben?
  Welcher Mieter-Name? Welche Adresse? Welche Zahl?
- **Konsolen-Output wörtlich** kopieren (aus `preview_console_logs`), nicht
  zusammenfassen. Stacktraces sind gold wert.
- **Ein Fund pro Datei**. Wenn du 3 Dark-Mode-Probleme siehst, schreib 3
  Dateien. Das macht Fixen granularer.
- **Severity ehrlich einschätzen**:
  - `critical` = App unbenutzbar, Datenverlust möglich, Security-Problem
  - `high` = Kernfunktion kaputt, aber Workaround existiert
  - `medium` = ärgerlich, aber umgehbar
  - `low` = Schönheitsfehler, Verbesserungswunsch

### Für Verbesserungsvorschläge (keine Bugs)

Nicht-Bug-Funde (Feature-Ideen, Code-Smells, UX-Wünsche) gehören in
EINE Datei am Ende:

```
999-suggestions.md
```

Dort sammelst du alle "wäre schön, wenn …"-Punkte in Listenform.

---

## 📋 Zu testende Flows

### Phase 1: Onboarding & Empty-States
Fang ganz vorne an — noch vor dem Einloggen.
- Landing-Page, Preise, Fußzeile — alle Links klicken, Broken-Links finden
- Registrierung: unplausible Eingaben, schwaches Passwort, schon genutzte
  Email, Umlaute im Namen, sehr lange Eingaben
- Email-Verifizierung-Flow (falls vorhanden)
- Passwort-Vergessen-Flow (`/forgot-password`) — Mail-Versand, Link-Klick,
  Passwort-Reset auf `/reset-password`
- Erster Login: Was sehe ich? Ist klar, was ich als Nächstes tun soll?
- Empty-Dashboard: sind die CTAs eindeutig? Sinnvolle Leerzustände?
- Profil/Stammdaten initial ausfüllen — Vermieter-Daten, Firma, Adresse usw.
  Hier beobachten: Wird das später beim Vertrag korrekt übernommen?

### Phase 2: Erstes Mietverhältnis von Grund auf anlegen
- Neues Mietverhältnis anlegen (Adresse, Mieter-Anrede/Name/Adresse)
- Pflichtfelder-Validierung testen (leer lassen, Müll eintragen)
- Speichern → landest du auf dem Detail? Ist die Navigation logisch?
- Bearbeiten, Duplizieren, Löschen — funktioniert jedes davon sauber?
- Filter "Alle/Aktiv/Abgeschlossen" + Suche (leer, Umlaute, Teilstring)

### Phase 3: Dokumente erstellen
Lege aus dem neuen Mietverhältnis je EINES von jedem Typ an:
- **Mietvertrag (sections-v1 Editor)**:
  - Kopfbereich-Daten prüfen (aus Stammdaten vorbefüllt?)
  - §-Abschnitte hinzufügen/löschen/umbenennen/per Drag & Drop verschieben
  - Rich-Text in §§: Fett/Kursiv/Listen/Tabellen/Platzhalter einfügen
  - Speichern, Als Vorlage speichern, Verwerfen
  - Abschließen mit **DIGITALER** Unterschrift (beide Parteien)
  - Zweiten Vertrag: Abschließen mit **HANDSCHRIFTLICHER** Unterschrift
  - PDF-Download beider Versionen prüfen (Seitenumbrüche, Layout, Schriften,
    Unterschriften sichtbar, keine Platzhalter-Reste)
- **Wohnungsgeberbestätigung**: komplett ausfüllen, abschließen, PDF prüfen
- **Kautionsbescheinigung**: komplett ausfüllen, abschließen, PDF prüfen
- **Übergabeprotokoll**: alle Räume/Zimmer anlegen, Zustand erfassen,
  Schlüssel-Tab ausfüllen, Fotos hochladen (falls möglich), Zählerstände,
  abschließen, PDF prüfen
- **Leeres Dokument ("Sonstiges")**

### Phase 4: Eigene Vorlagen
- Aus einem bestehenden Mietvertrag eigene Vorlage speichern
- Neues Mietverhältnis + neuen Vertrag AUS DIESER Vorlage anlegen
- Vorlage bearbeiten, umbenennen, löschen

### Phase 5: Edge-Cases & Stress
- Sehr langer Mietvertrag mit 15+ §§ — wie verhält sich das PDF?
- Zweites Browser-Tab öffnen, gleichzeitig dasselbe Dokument bearbeiten
- Netzwerk in DevTools offline setzen, dann speichern wollen
- Schnell hintereinander klicken (Save, Abschließen, Delete)
- Browser-Back mitten im Editor — Daten verloren?
- Sehr lange Texte in Platzhaltern (Adresse mit 200 Zeichen)
- XSS-Test im Rich-Text: `<script>`, `<img onerror>`, `javascript:` links
- Umlaute/Emoji überall einsetzen (ö, ü, ß, 🏠, chinesische Zeichen)
- Zahlen mit Komma/Punkt/Leerzeichen (1.250,00 vs 1250.00 vs 1 250)
- IBAN, Telefonnummern mit/ohne Leerzeichen, ungewöhnliche Formate

### Phase 6: Stripe & Billing
- Preise-Seite, Plan-Auswahl, Stripe-Checkout bis zum Formular
  (**NICHT zahlen!**) — Plan-Upgrade-Zustand beobachten
- Was passiert, wenn ich den Checkout abbreche? Zurück zur App sauber?
- Sind Feature-Gates konsistent (was darf Free vs Paid)?

### Phase 7: Cross-Cutting (während ALLER Phasen mitbeobachten)
- Dark Mode vs Light Mode auf JEDER Seite — Farben, Kontrast, Lesbarkeit
- Responsive: 375px (iPhone SE), 768px (iPad), 1280px+ (Desktop)
- Tab-Navigation (nur Tastatur bedienen) — alles erreichbar? Focus sichtbar?
- Konsolen-Errors + Network-Tab während JEDES Klicks beobachten
- Ladezeiten (TTFB, LCP, Interaktionszeit nach Klicks)

---

## 🔍 Worauf du besonders achtest

- **Bugs**: Crashes, 500er, `console.error`, verlorene Eingaben,
  Race-Conditions, Doppel-Submits, Stale-UI nach Aktionen, Buttons die
  im Lade-Zustand hängen bleiben
- **Darstellungsfehler**: Text abgeschnitten, Überlappungen, falsche
  Dark-Mode-Farben (häufig!), schwacher Kontrast, fehlende Hover-/Focus-
  States, kaputte Icons, inkonsistente Paddings, PDF-Umbrüche, Drucken
- **UX**: Verwirrende Labels, fehlende Bestätigungen bei Delete, zu viele
  Klicks für häufige Aktionen, fehlendes Feedback (Loading/Toasts),
  tote Buttons, unerklärliche Tooltips
- **Accessibility**: Tab-Reihenfolge, Focus-Indikatoren, aria-Labels,
  alt-Texte, Farbkontrast (WCAG AA), Screenreader-freundliche
  Überschriften-Hierarchie
- **Performance**: große Bundles, unnötige Re-Renders, langsame API-Calls,
  nicht gecachte Requests, Memory-Leaks bei wiederholtem Editor-Öffnen
- **Formvalidierung**: Pflichtfelder, Email, Telefon, IBAN, Datum, Zahlen,
  deutsche Sonderzeichen, sehr lange Eingaben
- **Datenintegrität**: Gleichzeitige Edits aus 2 Tabs, Abbruch während Save,
  Session-Ablauf mitten im Editor
- **Sicherheit** (beobachten, nicht exploiten): API-Endpoints ohne Auth
  aufrufbar? Supabase RLS-Lücken? Tokens in localStorage? Session-Cookie
  HttpOnly + Secure gesetzt?

---

## 📦 Abschluss

Wenn du mit allen Phasen durch bist:
1. Stelle sicher, dass jeder Fund als eigene Datei in `.bugs/` liegt
2. Erstelle als allerletzte Datei `000-summary.md` mit:
   - Gesamtzahl Funde pro Severity
   - Top-3 kritischste Probleme (Titel + Link zur Datei)
   - Allgemeiner Eindruck (2–3 Sätze)
3. Gib dem Nutzer kurz Bescheid: "Fertig, X Funde in `.bugs/` abgelegt"

---

## Hinweise

- Sei kritisch, aber fair. Keine Pauschalkritik — konkrete, reproduzierbare
  Funde. Wenn etwas absichtlich so wirkt (z. B. dezente Farbwahl), vermerke
  es, aber bewerte nicht dagegen.
- Der Empfänger ist Entwickler und will priorisieren. Je präziser die
  Reproduktionsschritte, desto nützlicher dein Bericht.
- Doppel-Funde sind ok — lieber einmal zu viel melden als einen echten Bug
  unter den Tisch fallen lassen. Der Entwickler sortiert Duplikate selbst.
