/* Profil "Good Boys": Ablauf (Flow) zweisprachig. fx = visueller Effekt der Antwort: ripple | flash | pulse */
window.PROFILE = { name: "Good Boys" };
window.FLOW = { start: "q1", nodes: {
  q1: { q: { de: "Möchtest du selbst denken?", en: "Would you like to think for yourself?" },
    a: [ { de: "Selbstverständlich", en: "Obviously", next: "q2", fx: "ripple" },
         { de: "Natürlich nicht", en: "Of course not", next: "end", fx: "flash" } ] },
  q2: { q: { de: "Bist du dir da sicher?", en: "Are you sure about that?" },
    a: [ { de: "Ich glaube schon.", en: "I think so.", next: "q3", fx: "pulse" },
         { de: "Nein.", en: "No.", next: "end", fx: "flash" } ] },
  q3: { q: { de: "Sind deine Gedanken nützlich?", en: "Are your thoughts useful?" },
    a: [ { de: "Ja.", en: "Yes.", next: "q4", fx: "pulse" },
         { de: "Nein.", en: "No.", next: "end", fx: "flash" } ] },
  q4: { q: { de: "Lohnt sich Denken wirklich all die Mühe?", en: "Is thinking really worth all this effort?" },
    a: [ { de: "Ja.", en: "Yes.", next: "q5", fx: "ripple" },
         { de: "Nein.", en: "No.", next: "end", fx: "flash" } ] },
  q5: { q: { de: "Möchtest du es noch einmal versuchen?", en: "Would you like to try again?" },
    a: [ { de: "Ja.", en: "Yes.", next: "q4", fx: "pulse" },
         { de: "Nein.", en: "No.", next: "end", fx: "flash" } ] },
  end: { end: true, q: { de: "Richtig!", en: "Correct!" },
    sub: { de: "Mit leerem Kopf bist du am besten.", en: "You're at your best when head empty." } }
}};
