import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AGB() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-muted-foreground text-sm mb-8">Stand: April 2026 · ImmoAkte, betrieben von Weserbergland Dienstleistungen</p>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Weserbergland Dienstleistungen, Inhaber Özgür Tikiz, Chamissostraße 23, 31785 Hameln (nachfolgend „Anbieter") und den Nutzern der Plattform ImmoAkte (nachfolgend „Nutzer").
            </p>
            <p className="mt-2">
              Abweichende Bedingungen des Nutzers gelten nicht, sofern der Anbieter diesen nicht ausdrücklich schriftlich zugestimmt hat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 2 Leistungsbeschreibung</h2>
            <p>
              ImmoAkte ist eine webbasierte Software-as-a-Service-Plattform (SaaS) zur digitalen Erstellung und Verwaltung von Wohnungsübergabeprotokollen. Die Plattform ermöglicht:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Erfassung von Raumzuständen, Mängeln und Fotos</li>
              <li>Dokumentation von Zählerständen und Schlüsselübergaben</li>
              <li>Digitale Unterschriften beider Parteien</li>
              <li>Generierung rechtssicherer PDF-Protokolle</li>
              <li>Verwaltung mehrerer Objekte und Mietverhältnisse</li>
            </ul>
            <p className="mt-2">
              Der Anbieter stellt die Plattform im Rahmen der jeweils gebuchten Tarifoptionen zur Verfügung. Ein Anspruch auf bestimmte Funktionserweiterungen oder eine ununterbrochene Verfügbarkeit besteht nicht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 3 Registrierung & Vertragsschluss</h2>
            <p>
              Die Registrierung ist kostenlos. Mit der Registrierung kommt ein Nutzungsvertrag für den Gratis-Tarif zustande. Für kostenpflichtige Tarife kommt der Vertrag mit Abschluss des Zahlungsvorgangs über Stripe zustande.
            </p>
            <p className="mt-2">
              Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und diese aktuell zu halten. Die Zugangsdaten sind vertraulich zu behandeln.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 4 Tarife & Preise</h2>
            <p>Es stehen folgende Tarife zur Verfügung:</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-2 border border-slate-200 font-semibold">Tarif</th>
                    <th className="text-left p-2 border border-slate-200 font-semibold">Preis</th>
                    <th className="text-left p-2 border border-slate-200 font-semibold">Leistung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-200">Gratis</td>
                    <td className="p-2 border border-slate-200">0,00 €</td>
                    <td className="p-2 border border-slate-200">1 Protokoll (einmalig)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200">Flex</td>
                    <td className="p-2 border border-slate-200">9,99 € / Protokoll</td>
                    <td className="p-2 border border-slate-200">1 Protokoll, Einmalzahlung</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200">Standard</td>
                    <td className="p-2 border border-slate-200">19,99 € / Monat</td>
                    <td className="p-2 border border-slate-200">10 Protokolle pro Monat, monatlich kündbar</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200">Pro</td>
                    <td className="p-2 border border-slate-200">39,99 € / Monat</td>
                    <td className="p-2 border border-slate-200">50 Protokolle pro Monat, monatlich kündbar</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer. Die Abrechnung erfolgt über den Zahlungsdienstleister Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 5 Zahlung</h2>
            <p>
              Zahlungen werden ausschließlich über Stripe Payments Europe, Ltd. abgewickelt. Für Einmalzahlungen (Gratis, Flex) erfolgt die Abrechnung sofort. Für Abonnements (Standard, Pro) wird der Betrag monatlich im Voraus am jeweiligen Vertragsjahrestag abgebucht.
            </p>
            <p className="mt-2">
              Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zur Plattform zu sperren, bis der ausstehende Betrag beglichen ist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 6 Laufzeit & Kündigung</h2>
            <p>
              Abonnements (Standard, Pro) sind monatlich kündbar. Die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam. Eine Kündigung kann über die Kontoeinstellungen oder per E-Mail an <a href="mailto:info@weserbergland-dienstleistungen.de" className="text-primary hover:underline">info@weserbergland-dienstleistungen.de</a> erfolgen.
            </p>
            <p className="mt-2">
              Einmalzahlungen (Flex) begründen kein Dauerschuldverhältnis und können nicht gekündigt werden.
            </p>
            <p className="mt-2">
              Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 7 Nutzungsrechte & Pflichten</h2>
            <p>
              Der Nutzer erhält ein einfaches, nicht übertragbares Recht zur Nutzung der Plattform im Rahmen des gebuchten Tarifs. Die Weitergabe von Zugangsdaten an Dritte ist nicht gestattet.
            </p>
            <p className="mt-2">
              Der Nutzer ist verantwortlich dafür, dass alle über die Plattform verarbeiteten Daten (insbesondere Mieterdaten) DSGVO-konform erhoben wurden und die betroffenen Personen über die Verarbeitung informiert sind. Der Anbieter ist in diesem Verhältnis Auftragsverarbeiter gemäß Art. 28 DSGVO.
            </p>
            <p className="mt-2">
              Die missbräuchliche Nutzung der Plattform, insbesondere das automatisierte Abgreifen von Daten oder die Umgehung von Sicherheitsmechanismen, ist untersagt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 8 Haftung</h2>
            <p>
              Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.
            </p>
            <p className="mt-2">
              Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und zwar begrenzt auf den vertragstypischen, vorhersehbaren Schaden.
            </p>
            <p className="mt-2">
              Der Anbieter übernimmt keine Haftung für die rechtliche Verwertbarkeit der erstellten Protokolle im Einzelfall. Die Protokolle sind als Dokumentationshilfe konzipiert; eine Rechtsberatung findet nicht statt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 9 Verfügbarkeit & Wartung</h2>
            <p>
              Der Anbieter strebt eine Verfügbarkeit von 99 % im Jahresmittel an, schuldet diese jedoch nicht. Planmäßige Wartungsarbeiten werden nach Möglichkeit außerhalb der Hauptnutzungszeiten durchgeführt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 10 Datenschutz</h2>
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>. Soweit der Nutzer über die Plattform personenbezogene Daten Dritter (z. B. Mieterdaten) verarbeitet, schließen die Parteien auf Anfrage einen Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO ab.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 11 Änderungen der AGB</h2>
            <p>
              Der Anbieter behält sich das Recht vor, diese AGB mit einer Frist von 30 Tagen zu ändern. Die Änderung wird dem Nutzer per E-Mail mitgeteilt. Widerspricht der Nutzer nicht innerhalb von 30 Tagen, gelten die geänderten AGB als akzeptiert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 12 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für Streitigkeiten mit Kaufleuten oder juristischen Personen des öffentlichen Rechts ist Hameln.
            </p>
            <p className="mt-2">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>

          <p className="text-slate-400 text-xs pt-4 border-t border-slate-200">
            Weserbergland Dienstleistungen · Özgür Tikiz · Chamissostraße 23, 31785 Hameln · info@weserbergland-dienstleistungen.de
          </p>

        </div>
      </main>
      <Footer />
    </div>
  )
}
