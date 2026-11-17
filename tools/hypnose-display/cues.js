/* Cues für das Steuerpult. Alle Medien liegen unter media/ und werden von make_media.py erzeugt
   (eigene Werke, keine Fremdquellen). Neue Datei einfach hier eintragen.
   label = deutsche Beschriftung, en = englische (Steuerpult-Sprache EN).
   loop:true = läuft in Schleife bis "stopp". Audio mit "Kopfhörer" wirkt nur über Kopfhörer.
   Audio-Loop: loopStart/loopLength/loopFade (Sekunden) = periodisches Fenster ohne Naht (siehe make_media.py).
   Eigene Audiodateien ohne diese Angaben werden mit Überblendung (loopFade) in sich geloopt.
   Markenregeln: siehe CLAUDE.md (verbotene Begriffe) und knowledge/verbotene_phrasen.md */
window.CUES = {
  images: [
    { label: "Spirale Gold",    en: "Gold spiral",     src: "media/img/spirale-gold.svg" },
    { label: "Ringe Cyan",      en: "Cyan rings",      src: "media/img/ringe-cyan.svg" },
    { label: "Tunnel",          en: "Tunnel",          src: "media/img/tunnel-rechtecke.svg" },
    { label: "Wellen",          en: "Waves",           src: "media/img/wellen-theta.svg" },
    { label: "Horizont",        en: "Horizon",         src: "media/img/horizont.svg" },
    { label: "Sternenfeld",     en: "Star field",      src: "media/img/sternenfeld.svg" },
    { label: "Himmel & Wolken", en: "Sky & clouds",    src: "media/img/himmel-wolken.svg" }
  ],
  videos: [
    { label: "Tunnel · 12 s Schleife",         en: "Tunnel · 12 s loop",           src: "media/video/tunnel.mp4",       loop: true },
    { label: "Spirale Gold · 10 s Schleife",   en: "Gold spiral · 10 s loop",      src: "media/video/spirale-gold.mp4", loop: true },
    { label: "Wellen · 10 s Schleife",         en: "Waves · 10 s loop",            src: "media/video/wellen.mp4",       loop: true },
    { label: "Atem-Kreis · 5 s ein / 5 s aus", en: "Breath circle · 5 s in / 5 s out", src: "media/video/atem-kreis.mp4", loop: true }
  ],
  audios: [
    { label: "Theta 6 Hz · Kopfhörer",  en: "Theta 6 Hz · headphones",  src: "media/audio/theta-6hz.mp3",      loop: true, loopStart: 2, loopLength: 30, loopFade: 1 },
    { label: "Alpha 10 Hz · Kopfhörer", en: "Alpha 10 Hz · headphones", src: "media/audio/alpha-10hz.mp3",     loop: true, loopStart: 2, loopLength: 30, loopFade: 1 },
    { label: "Ruhiges Rauschen",        en: "Calm noise",               src: "media/audio/rauschen-ruhig.mp3", loop: true, loopStart: 2, loopLength: 30, loopFade: 1 },
    { label: "Tiefer Drone",            en: "Deep drone",               src: "media/audio/drone-tief.mp3",     loop: true, loopStart: 2, loopLength: 30, loopFade: 1 }
  ],
  /* Einblendungen in Gruppen; {name} wird durch den Namen aus dem Steuerpult ersetzt.
     items = Deutsch, itemsEn = Englisch (wird bei Steuerpult-Sprache EN gezeigt) */
  texts: [
    { group: "Ankommen", en: "Arriving",
      items: [
        "{name}, du entscheidest jederzeit selbst, wie weit du gehst.",
        "Richte den Blick auf einen Punkt. Atme ruhig weiter.",
        "Höre auf den Klang meiner Stimme.",
        "Spüre die Unterlage, die dich trägt.",
        "Mit jedem Ausatmen werden die Augenlider schwerer."
      ],
      itemsEn: [
        "{name}, you decide at any time how far you go.",
        "Rest your gaze on one point. Keep breathing calmly.",
        "Listen to the sound of my voice.",
        "Feel the surface that supports you.",
        "With every breath out, your eyelids grow heavier."
      ] },
    { group: "Vertiefen", en: "Deepening",
      items: [
        "Atme ein … und aus.",
        "Gedanken dürfen kommen und ziehen wie Wolken vorbei.",
        "Die Schultern werden weich, der Atem wird langsam.",
        "Du machst das genau richtig."
      ],
      itemsEn: [
        "Breathe in … and out.",
        "Thoughts may come and drift past like clouds.",
        "Your shoulders soften, your breathing slows.",
        "You are doing this exactly right."
      ] },
    { group: "Ausleiten", en: "Waking up",
      items: [
        "Ich zähle jetzt von eins bis fünf.",
        "Eins. Frische kehrt in Hände und Füße zurück.",
        "Zwei. Ein tiefer, erfrischender Atemzug.",
        "Drei. Du spürst deinen Körper, fest und geerdet.",
        "Vier. Dein Kopf wird klar und wach.",
        "Fünf. Augen auf. Hellwach und erfrischt."
      ],
      itemsEn: [
        "I will now count from one to five.",
        "One. Freshness returns to your hands and feet.",
        "Two. A deep, refreshing breath.",
        "Three. You feel your body, firm and grounded.",
        "Four. Your head becomes clear and awake.",
        "Five. Eyes open. Wide awake and refreshed."
      ] }
  ]
};
