/* Cues für das Steuerpult. Alle Medien liegen unter media/ und werden von make_media.py erzeugt
   (eigene Werke, keine Fremdquellen). Neue Datei einfach hier eintragen.
   loop:true = läuft in Schleife bis "stopp". Audio mit "Kopfhörer" wirkt nur über Kopfhörer.
   Markenregeln: siehe CLAUDE.md (verbotene Begriffe) und knowledge/verbotene_phrasen.md */
window.CUES = {
  images: [
    { label: "Spirale Gold",   src: "media/img/spirale-gold.svg" },
    { label: "Ringe Cyan",     src: "media/img/ringe-cyan.svg" },
    { label: "Tunnel",         src: "media/img/tunnel-rechtecke.svg" },
    { label: "Wellen",         src: "media/img/wellen-theta.svg" },
    { label: "Horizont",       src: "media/img/horizont.svg" },
    { label: "Sternenfeld",    src: "media/img/sternenfeld.svg" },
    { label: "Himmel & Wolken", src: "media/img/himmel-wolken.svg" }
  ],
  videos: [
    { label: "Tunnel · 12 s Schleife",       src: "media/video/tunnel.mp4",        loop: true },
    { label: "Spirale Gold · 10 s Schleife", src: "media/video/spirale-gold.mp4",  loop: true },
    { label: "Wellen · 10 s Schleife",       src: "media/video/wellen.mp4",        loop: true },
    { label: "Atem-Kreis · 5 s ein / 5 s aus", src: "media/video/atem-kreis.mp4",  loop: true }
  ],
  audios: [
    { label: "Theta 6 Hz · Kopfhörer",  src: "media/audio/theta-6hz.mp3",      loop: true },
    { label: "Alpha 10 Hz · Kopfhörer", src: "media/audio/alpha-10hz.mp3",     loop: true },
    { label: "Ruhiges Rauschen",        src: "media/audio/rauschen-ruhig.mp3", loop: true },
    { label: "Tiefer Drone",            src: "media/audio/drone-tief.mp3",     loop: true }
  ],
  /* Einblendungen in Gruppen; {name} wird durch den Namen aus dem Steuerpult ersetzt */
  texts: [
    { group: "Ankommen", items: [
      "{name}, du entscheidest jederzeit selbst, wie weit du gehst.",
      "Richte den Blick auf einen Punkt. Atme ruhig weiter.",
      "Höre auf den Klang meiner Stimme.",
      "Spüre die Unterlage, die dich trägt.",
      "Mit jedem Ausatmen werden die Augenlider schwerer."
    ] },
    { group: "Vertiefen", items: [
      "Atme ein … und aus.",
      "Gedanken dürfen kommen und ziehen wie Wolken vorbei.",
      "Die Schultern werden weich, der Atem wird langsam.",
      "Du machst das genau richtig."
    ] },
    { group: "Ausleiten", items: [
      "Ich zähle jetzt von eins bis fünf.",
      "Eins. Frische kehrt in Hände und Füße zurück.",
      "Zwei. Ein tiefer, erfrischender Atemzug.",
      "Drei. Du spürst deinen Körper, fest und geerdet.",
      "Vier. Dein Kopf wird klar und wach.",
      "Fünf. Augen auf. Hellwach und erfrischt."
    ] }
  ]
};
