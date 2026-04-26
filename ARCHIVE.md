# Immo Akte — Projekt-Archiv

> **Status: eingestampft (April 2026).**
> Dieses Dokument konserviert alles, was außerhalb des Codes nur noch in
> Chat-Verläufen und Köpfen lebt — Kontext, Strategie, Entscheidungen,
> Personen, offene Threads. Wenn das Projekt jemals wiederbelebt wird,
> startet man hier.

---

## 1. Projekt-Identität

| Feld | Wert |
|---|---|
| **Produktname** | Immo Akte |
| **Vorgängername** | Protokoll-Pro (siehe Commit `4b26a0c` — Rebrand) |
| **Domain** | `immoakte.app` (gesichert; Markenrecherche zum Zeitpunkt des Stopps: keine Kollision gefunden, **DPMA-Anmeldung wurde nicht mehr durchgeführt**) |
| **Repo** | `github.com/tikiz-dev/immoakte` |
| **Branch zum Zeitpunkt des Stopps** | `main` @ `6c4ebec` (Speed up hero phone carousel rotation) |
| **Hosting** | Vercel (EU-Region, DSGVO) |
| **Backend** | Supabase |
| **Stack** | Next.js (App Router) + TypeScript + Tailwind + Framer Motion |
| **Brand-Look** | Seriös, dezent — Gold-Akzent („nicht zu verspielt, muss vertrauensvoll wirken"), nicht zu „kurdisch-glänzend" |
| **Logo-Status** | KI-generierter Entwurf in der App, Final-Logo war Martynas To-do — nicht abgeschlossen |

---

## 2. Team

| Person | Rolle | Anmerkung |
|---|---|---|
| **Öz** (otikiz) | Founder, Solo-Dev, Code-Lead | Eigentümer / Vollzeitjob + DAA + Energieberater-Schulung |
| **Carsten** | Co-Founder | Sollte Bugs/Features mit übernehmen — keine Kapazität |
| **Martyna** | Co-Founder | Logo, Flyer, Persona — keine Kapazität |

> Gegen Ende April 2026 hat Öz entschieden, alleine weiterzumachen — und
> dann das Projekt komplett einzustampfen, weil neben Vollzeitjob, eigener
> Reinigungsfirma (DAA) und Energieberater-Schulung schlicht keine Bandbreite blieb.

---

## 3. Zielgruppe & Use-Case (wie zuletzt definiert)

- **Primäre Persona:** Privatvermieter mit 1–5 Einheiten, 45–60 Jahre, hasst Papierkram
- **Sekundär:** kleine Hausverwaltungen
- **Explizit NICHT:** Mieter — Vermieter organisiert alles, Mieter bekommt nur Kopien
- **Versteckte Zielgruppe:** Wohnungsmieter mit eigener Auslandsimmobilie (z. B. Türkei) — schwer zu targeten, aber relevant
- **Jobs-to-be-done:**
  - Mietverträge erstellen (E-Sign-Lizenz war offen — bewusst nicht angeboten)
  - Übergabeprotokolle (Einzug/Auszug) digital
  - Schlüsselverwaltung
  - DSGVO-konforme Archivierung
  - Mieterkommunikation

---

## 4. Pricing-Modell (Stand ROADMAP.md)

| Plan | Preis | Inhalt |
|---|---|---|
| **Free / Test** | 0 € | 1 Protokoll einmalig, Basis-PDF |
| **On-Demand** | 9,90 € / Protokoll | Voller Funktionsumfang, kein Abo — Zielgruppe Privatvermieter |
| **Pro (Solo)** | 14,99 € / Monat | Volles Set + eigenes Logo + digitale Signatur + Cloud, **30–50 Protokolle/Monat** als Missbrauchsschutz |
| **Business** *(geplant)* | 39,90 € / Monat | 3 Nutzer-Lizenzen, Team-Verwaltung, API-Export |

---

## 5. Geplante Killer-Features (nicht umgesetzt)

- **KI-Zählerstand (OCR):** Strom/Wasser/Gas per Foto erkennen — wäre 2026 Standard gewesen
- **Team-Verwaltung:** Multi-User pro Account
- **API-Export:** ERP-/Hausverwalter-Software-Anbindung
- **Aktive DSGVO-Vermarktung:** „Bußgeld-Schutz" als Vertrauensanker
- **Internationalisierung:** Englisch + bis zu 40 Sprachen via KI (war Phase-6-Thema)

---

## 6. Was technisch fertig war (Commit-Historie als Beleg)

- Vollständige Landingpage mit Hero-Carousel + animierten Mockups
- Auth-Flow (Login, Passwort-Reset)
- Mietvertrags-Wizard mit eigenen Vorlagen, abschnittbasierter Editor
- Digitale Unterschriften (mit Modus-Wahl)
- DSGVO-Pflichtelemente: Vercel-EU, Consent, Self-Delete
- Datenexport, Widerrufsbelehrung, AVV, Speicherfristen
- Checkout-Confirm-Dialog mit Widerrufsverzicht
- Mobile-Optimierung
- Test-Agent-Prompt + `.bugs/` Reporting-Protokoll
- Modulare Komponenten-Struktur
- Hero-Carousel-Speed-Tuning (letzter Commit)

## Was offen blieb

- **Cookie-Banner** (war Top-Punkt im 14.04.-Meeting, nie eingebaut)
- **Markenanmeldung DPMA** (nur informelle Recherche)
- **DPMA/EU-IPO finale Prüfung**
- **Logo-Final**
- **Marketing/Persona** (im Gespräch erarbeitet, nie ausgeführt)
- **Social-Media-Kanäle** (Instagram/Facebook nie erstellt)
- **Pricing-Live-Schaltung** + Stripe-Anbindung jenseits Test
- **OCR-Zählerstand**
- **Empfehlungs-QR-Code in der App** (Idee aus dem 14.04.-Meeting)

---

## 7. Meeting-Historie

### Meeting 1 — 14.04.2026 (Öz + Carsten + Martyna)

**Kernfokus:** Marketingstrategie, Aufgabenverteilung, technische Weiterentwicklung. Wegkommen vom Lokal-Bias (Hameln) hin zu deutschlandweit.

**Beschlossene Themen:**
- Persona Buyer als nächster essenzieller Schritt
- Social Media: Instagram + Facebook zuerst, TikTok später
- Canva-Automation + Mockup-basierte Posts
- Gewinnspiele (Test-Abos) zur Datensammlung
- Flyer für Einfamilienhäuser
- DVG-Prinzip („Wer kennt wen") — nicht aggressiv
- In-App-Empfehlung mit QR-Code (Werber + Geworbener bekommen Freimonat)
- E-Mail-Marketing **verworfen** wegen Abmahn-/DSGVO-Risiko
- Internationalisierung später via KI-Übersetzung

**Aufgabenverteilung (To-dos):**
- Martyna: Logo + Flyer-Design
- Martyna: Persona Bias + Konkurrenz-/Marktpotenzialanalyse
- Öz: Komplette Code-Seite, Bugfixing, Domain-Verfügbarkeit, Marken-Vorprüfung
- Alle: App testen + Bug-Reports in WhatsApp-Gruppe „Bugs"

**Nächster Termin** war **25.04.2026, 16:00 Uhr** — fand de-facto nicht produktiv statt, weil Carsten + Martyna keine Kapazität hatten.

### Meeting 2 — 25./26.04.2026 (Öz alleine, Entscheidung)

- Carsten + Martyna hatten keine Zeit
- Öz hat versucht, das Projekt solo weiterzuführen
- **Entscheidung:** Projekt einstampfen — neben Vollzeitjob, DAA und Energieberater-Schulung nicht stemmbar

---

## 8. Solo-Go-To-Market-Plan (final ausgearbeitet, **nicht ausgeführt**)

> Konserviert für den Fall, dass Öz oder ein anderer das Projekt
> wiederbelebt. Annahme war: ~5–10 h/Woche solo.

### Leitprinzipien

1. Automatisierung vor Fleiß
2. Traffic vor Umsatz (erste 90 Tage)
3. Bundesweit denken, lokal testen (Hameln als Test-Lab)
4. Build in Public (Solo-Dev-Story als Gratis-Marketing)
5. Eine Zielgruppe, ein Use-Case

### Phasen

| Phase | Dauer | Ziel |
|---|---|---|
| **0 — Foundation** | Wo 1–2 (~10 h) | Cookie-Banner, Impressum/DSE/AGB, Marken-Anmeldung DPMA (~290 €), Logo final, Analytics (Plausible/PostHog), Beta-Disclaimer |
| **1 — Persona & Positionierung** | Wo 2 (~6 h) | 1 Persona, 3 Konkurrenten analysiert (Hausmagazin, Vermietet.de, Smartlandlord), One-Liner-Pitch, Schmerzpunkte aus FB-Gruppen sammeln |
| **2 — Content-Maschine** | Wo 3–4 (~12 h einmalig + 2 h/Wo) | N8N-Pipeline Insta+FB, 5 Canva-Templates, Mockup-Pack (8–10 Screens), Reels-Skript, 5 Content-Pillars |
| **3 — Soft Launch** | Wo 5–6 (~8 h) | DVG-Mindmap solo, FB-Vermietergruppen, Reddit (r/Finanzen, r/Immobilien), 200 Flyer Hameln, In-App-QR-Empfehlung live |
| **4 — Feedback-Loop** | Wo 7–10 fortlaufend | 14-tägige Beta-Calls, In-App-NPS, Bug-Triage, A/B-Tests, erste Pricing-Hypothese |
| **5 — Bezahlte Reichweite** | ab Wo 11, nur wenn Conversion ≥ 5 % & Retention ≥ 30 % | Meta Ads 5 €/Tag, Google-Search-Ads, Mikro-Influencer |
| **6 — Skalierung** | Q3 2026+ | TikTok, B2B-Hausverwaltungen, E-Sign-Lizenz, AT/CH, dann EN |

### KPI-Ziele

| Phase | Metrik | Ziel |
|---|---|---|
| 0–1 | Landing-Page-Visits | 200/Woche |
| 2 | Sign-up-Conversion | ≥ 5 % |
| 3 | Beta-Tester aktiv | 50 |
| 4 | 14-Tage-Retention | ≥ 30 % |
| 5 | CAC | < 15 € |
| 6 | Zahlende Nutzer | 100 |

### Wöchentlicher Solo-Rhythmus (vorgeschlagen)

| Tag | Slot | Aufgabe |
|---|---|---|
| Mo Abend | 1 h | Content-Pipeline füttern |
| Mi Abend | 1 h | DMs / Community-Engagement |
| Sa Vormittag | 2–3 h | Bugfix + Feature-Sprint |
| So Abend | 30 min | Wochen-Review (KPIs) |

**Hartes Limit:** > 6 h/Wochenende → Plan ist kaputt (zu manuell oder zu unklar).

### Tooling-Stack (alles solo-tauglich)

- Code: Next.js + Supabase
- Analytics: Plausible / PostHog
- Content: Canva Pro + Mockuuups Studio + Buffer (oder N8N → Meta-API)
- Automation: N8N
- Feedback: Tally Forms + Calendly
- Issues: Linear (Free) / GitHub Issues
- Knowledge: Notion

---

## 9. Verworfene Optionen (mit Begründung)

| Option | Warum verworfen |
|---|---|
| **B2B/B2C E-Mail-Marketing** | DSGVO + Abmahnrisiko — selbst gekaufte Leads sind verbrannt |
| **Lokal-Marketing als Hauptkanal** | Reichweite zu klein; ab Insta nur deutschlandweit denken |
| **TikTok in Phase 1** | Content-Aufwand zu hoch für Solo-Setup |
| **E-Sign sofort** | Erfordert Lizenz, nur 2 zugelassene Verfahren — auf später verschoben |
| **Pricing live ohne Validierung** | Erst Retention ≥ 30 % nachweisen, dann Pricing-Test |

---

## 10. Reactivation-Notes — was bräuchte es für einen Restart?

Wenn Öz (oder jemand anderes) das Projekt wieder aufgreifen will:

1. **Repo läuft sofort:** `npm install && npm run dev`. `.env.local` neu befüllen (Supabase-Keys, Gemini-Key — siehe `.env.example`).
2. **Erster harter Tag:** Cookie-Banner + Impressum/DSE/AGB einbauen. Vorher kein öffentlicher Launch.
3. **Markenrecherche & DPMA-Anmeldung** als Allererstes — bevor man Reichweite aufbaut, sollte die Marke sicher sein.
4. **Co-Founder-Frage ehrlich stellen:** Solo geht nur mit aggressiver Automatisierung — sonst wieder erstickt es im Alltag.
5. **Phasenplan oben (§ 8) ist die Blaupause** — Phase 0 reicht für den ersten Monat.
6. **Bestehende Beta-Tester-Liste:** existierte nicht, weil nie öffentlich gelaunched wurde. Persönliches Netzwerk ist der erste Anlauf.
7. **Domain `immoakte.app`** verlängern, falls noch im Besitz. Sonst neu registrieren — war zum Stop-Zeitpunkt frei.
8. **Lessons Learned dieses Versuchs:**
   - Ein Trio ohne klare Stundenverpflichtung skaliert nicht — entweder bezahlte Rollen oder Solo
   - Nicht erst die App komplett bauen und dann Marketing nachschieben — Marketing-Kanal-Aufbau parallel zum letzten Code-Drittel starten
   - Persona-Definition gehört VOR die ersten UI-Entscheidungen, nicht erst nach dem Launch

---

## 11. Wo sonst noch Spuren liegen

- `ROADMAP.md` — Pricing & Killer-Features (Original-Snapshot)
- `README.md` — minimaler Setup-Hinweis
- `TEST_AGENT_PROMPT.md` — automatisierter Test-Agent-Prompt
- `.bugs/` — Bug-Report-Sammlung aus Test-Durchläufen
- `_src_old/` — Vorgängerversion vor Redesign (Commit `fa0a532`)
- WhatsApp-Gruppen: Haupt-Gruppe „Immo Akte" + „Bugs"-Gruppe (nicht im Repo)
- Apple Notes (Öz' Aufzeichnungen)

---

*Letzter Eintrag: April 2026 — Öz, im Alleingang, beim Einstampfen.*
*Wenn jemand das hier liest und das Ding wieder aufmacht: viel Glück.* 🍀
