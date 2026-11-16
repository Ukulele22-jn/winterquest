# Winterquest – Neustartpaket (Browser-Prototyp)

Dieses Paket ist ein **erster spielbarer technischer Prototyp**, noch nicht das fertig produzierte Spiel.
Es enthält eine Browser-Spieloberfläche, eine Levelkarte mit allen 24 geplanten Leveln,
ein einfaches Fortschrittssystem, Inventar-Grundgerüst, Tagebuch und lokale Speicherung.
Die endgültigen Pixel-Art-Sprites, Animationen, Levelkarten, Musik- und Sounddateien müssen
noch erstellt bzw. ergänzt werden. Die Levelziele sind als Struktur hinterlegt; komplexe Rätsel,
Gegner-KI und Boss-Mechaniken sind noch nicht vollständig programmiert.

## Teil 1 – GitHub

1. Erstelle auf GitHub ein **neues, leeres Repository** mit dem Namen `winterquest`.
2. Lade die Dateien aus diesem Ordner hoch. Die Ordnerstruktur muss so aussehen:

   - `index.html`
   - `style.css`
   - `game.js`
   - `config.js`
   - `supabase.sql`
   - `README-ANLEITUNG.md`
   - `.github/workflows/pages.yml`
   - `assets/audio/` (zunächst leer)

3. Öffne danach im Repository **Settings → Pages**.
4. Unter **Build and deployment** wähle **GitHub Actions**.

## Teil 2 – GitHub Pages Workflow

Die Datei `.github/workflows/pages.yml` veröffentlicht die Browserdateien automatisch.
Nach dem Hochladen öffne **Actions** und kontrolliere, ob der Workflow grün abgeschlossen ist.
Die veröffentlichte Adresse findest du unter **Settings → Pages**.

## Teil 3 – Supabase

1. Erstelle ein **neues Supabase-Projekt** für Winterquest.
2. Öffne links **SQL Editor → New query**.
3. Öffne die Datei `supabase.sql` aus diesem Paket, kopiere den gesamten Inhalt in den SQL Editor und klicke **Run**.
4. Öffne **Project Settings → API** (je nach Supabase-Oberfläche kann der Menüpunkt leicht anders heißen).
5. Kopiere **Project URL** und den **anon/public key**.
6. Öffne in GitHub die Datei `config.js` und trage beide Werte zwischen die Anführungszeichen ein.

   Beispiel (Platzhalter, keine echten Zugangsdaten):
   `supabaseUrl: "https://DEIN-PROJEKT.supabase.co"`
   `supabaseAnonKey: "DEIN_PUBLIC_ANON_KEY"`

   **Niemals** den `service_role`-Key in `config.js`, GitHub oder Browsercode eintragen.

## Wichtig zur Speicherung

Der Prototyp speichert den Fortschritt sofort lokal im Browser. Das SQL legt die sichere Tabelle
für Cloud-Spielstände an. Die Cloud-Speicherung ist erst aktiv, wenn später eine Supabase-Anmeldung
(E-Mail/Passwort oder eine andere Auth-Methode) eingebaut und der Spieler angemeldet ist.
Diese erste Fassung enthält noch keine Anmeldeoberfläche.

## Audio und Grafiken

- Audiodateien kommen später in `assets/audio/`.
- Die Musik- und Soundwiedergabe ist noch nicht fertig eingebunden. Die Schaltfläche zeigt derzeit
  nur an, dass Audio vorbereitet werden muss.
- Die Figuren und Welt sind im Prototyp Platzhaltergrafiken aus CSS/Zeichen, keine finalen Pixel-Art-Sprites.
- Verwende nur selbst erstellte oder korrekt lizenzierte Audio- und Grafikdateien.

## Was dieser Prototyp bereits kann

- Browserstart ohne Installation
- Hauptmenü, Levelkarte, 24 Level-Einträge
- Levelstatus: grün abgeschlossen, rot spielbar, grau gesperrt
- Einfache Spielfläche und Bewegung mit WASD/Pfeiltasten
- Herz-, XP- und Münzanzeige
- Inventar-Grundgerüst mit 24 Kalendergegenständen
- Tagebuch-Grundgerüst
- Lokales Speichern im Browser
- Supabase-Tabelle für spätere Cloud-Spielstände

## Noch nicht fertig

- Finale Leon-/Peter-Sprites und Animationen
- Echte begehbare Levelkarten und Kollisionen
- Vollständige Aufgaben-, Rätsel-, Gegner- und Bosskampf-Logik
- Heilgegenstände, Shop, Nebenmissionen und Charakterentwicklung
- Authentifizierung und Laden/Wiederherstellen von Cloud-Spielständen
- Musikdateien, SFX und Lautstärkeregelung
- Mobile Touch-Steuerung und Gamepad-Unterstützung
- Vollständige Tests auf verschiedenen Browsern/Geräten

Bitte behandle diese Fassung als Startpunkt. Sie ist nicht bereits das fertige 24-Level-Spiel.
