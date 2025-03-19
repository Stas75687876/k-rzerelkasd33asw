# Videos

Die folgenden Videodateien sind aufgrund von GitHub-Größenbeschränkungen nicht im Repository enthalten:

1. `demo-video.mp4.mp4` (114 MB)
2. `hero-background.mp4.mp4` (104 MB)

## Alternativen

Die Videos müssen separat bereitgestellt werden. Für die Render-Deployment müssen diese Dateien über einen der folgenden Wege bereitgestellt werden:

1. Hosten Sie die Videos auf einem Videohosting-Dienst (z.B. Vimeo, YouTube)
2. Verwenden Sie einen CDN (Content Delivery Network)
3. Speichern Sie die Dateien in einem Cloud-Speicher (z.B. AWS S3, Google Cloud Storage)

## Platzhalter

Für Entwicklungszwecke wurden Textdateien als Platzhalter hinzugefügt:
- `demo-video.txt`
- `hero-background.txt`

Diese Dateien enthalten URLs oder Informationen, wo die tatsächlichen Videodateien zu finden sind.

## Für Render-Deployment

Für die Bereitstellung auf Render.com müssen die Videodateien extern gehostet und dann die Pfade in den Komponenten entsprechend aktualisiert werden.

# Video-Dateien für die Website

In diesem Projekt werden Videos über Vimeo eingebunden statt lokale Dateien zu verwenden.

## 1. Hero-Hintergrundvideo
- **Vimeo-Link:** https://vimeo.com/1067507561/48d0275128
- **Einbindung:** Als Hintergrundvideo im Hero-Bereich
- **Player-Einstellungen:** autoplay=1, loop=1, background=1, muted=1

## 2. Demo-/Werbevideo
- **Vimeo-Link:** https://vimeo.com/1067508106/343f245390
- **Einbindung:** Im Portfolio-Bereich als Showcase-Video
- **Player-Einstellungen:** autoplay=0, loop=0, nicht stumm geschaltet

## 3. Video-Thumbnail
- **Dateiname:** `video-thumbnail.svg`
- **Pfad:** `/videos/video-thumbnail.svg` (im Videos-Verzeichnis)
- **Empfohlene Größe:** 1920x1080px
- **Format:** SVG oder JPG
- **Beschreibung:** Ein statisches Bild, das als Vorschau für das Werbevideo angezeigt wird, bevor der Benutzer auf Play klickt.

---

**Hinweis:** Die Verwendung von Vimeo-gehosteten Videos anstelle von lokal gespeicherten Dateien bietet mehrere Vorteile:
1. Reduzierte Hosting-Kosten und Serverbelastung
2. Adaptive Bitrate für optimale Wiedergabe je nach Internetverbindung
3. Verbesserte Ladezeiten der Website
4. Kompatibilität mit allen Geräten und Browsern

**Hinweis:** Diese Dateien müssen manuell hinzugefügt werden, bevor die Website in Produktion geht. Die Website wird funktionieren, auch wenn diese Dateien nicht vorhanden sind, aber die visuelle Erfahrung wird dadurch beeinträchtigt. 