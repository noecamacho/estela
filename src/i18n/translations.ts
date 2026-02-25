export type Language = 'es' | 'en';

export interface Translations {
  common: {
    cancel: string;
    delete: string;
    edit: string;
    clickToEdit: string;
    add: (label: string) => string;
  };
  auth: {
    subtitle: string;
    appName: string;
    tagline: string;
    signIn: string;
    sessionInfo: string;
  };
  nav: {
    logout: string;
    showGuide: string;
    hideGuide: string;
  };
  greeting: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  exercises: {
    exercise1: {
      name: string;
      icon: string;
      guide: {
        section1Label: string;
        section1Desc: string;
        section2Label: string;
        section2Desc: string;
        instruction: string;
      };
      addLabel: string;
      emptyMessage: string;
    };
    exercise2: {
      name: string;
      icon: string;
      description: string;
      questions: string;
      addLabel: string;
      emptyMessage: string;
    };
    exercise3: {
      name: string;
      icon: string;
      description: string;
      questions: string;
      addLabel: string;
      emptyMessage: string;
    };
  };
  time: {
    today: string;
    yesterday: string;
    days: string[];
    months: string[];
    dateFormat: (parts: {
      prefix: string;
      day: string;
      date: number;
      month: string;
      year: number;
      time: string;
    }) => string;
  };
  dosBanderas: {
    newRecord: string;
    dateTimeLabel: string;
    section1Label: string;
    section1Placeholder: string;
    section2Label: string;
    section2Placeholder: string;
    learningLabel: string;
    learningPlaceholder: string;
    deleteRecord: string;
    deleteRecordConfirm: string;
    deleteItemConfirm: string;
    noRecords: string;
  };
  freeform: {
    instructionLabel: string;
    questionsLabel: string;
    dateLabel: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    noTitle: string;
    deleteEntry: string;
    deleteEntryConfirm: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  messages: {
    noHurry: string;
  };
  language: {
    toggle: string;
  };
  marquee: {
    journal: string;
  };
}

export const es: Translations = {
  common: {
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    clickToEdit: 'Click para editar...',
    add: (label) => `Agregar ${label.toLowerCase()}`,
  },
  auth: {
    subtitle: 'Diario de Proceso',
    appName: 'Estela',
    tagline: 'Tu espacio para registrar, reflexionar y crecer',
    signIn: 'Iniciar sesion con Google',
    sessionInfo: 'Ejercicios de introspección',
  },
  nav: {
    logout: 'Salir',
    showGuide: 'Ver guia del ejercicio',
    hideGuide: 'Ocultar guia',
  },
  greeting: {
    morning: 'Buenos dias',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  },
  exercises: {
    exercise1: {
      name: 'Dos Banderas',
      icon: '🏴',
      guide: {
        section1Label: '✨ Polvo de Estrellas:',
        section1Desc: 'Serenidad, flujo, ser tu mismo.',
        section2Label: '🏴 La Madeja:',
        section2Desc: 'Revoltijo, adaptacion forzada, incomodidad, atrapado.',
        instruction: 'Registra momentos de ambas banderas cada dia.',
      },
      addLabel: 'Nuevo registro diario',
      emptyMessage: 'Aun no hay registros. Crea tu primer registro diario.',
    },
    exercise2: {
      name: 'Vinculo Significativo',
      icon: '🕊',
      description:
        'Escribe sobre una relacion significativa en tus años formativos, antes de que se acumulara la desilucion. Recupera el deseo original de conexion.',
      questions:
        '¿Cual es tu primer recuerdo de sentirte cerca y comprendido? ¿Que esperabas de esa conexion? ¿Cuando empezo a cambiar la dinamica? ¿Que patrones reconoces en tus relaciones posteriores?',
      addLabel: 'Nueva entrada',
      emptyMessage: 'Cuando estes listo, crea tu primera entrada. Sin prisa.',
    },
    exercise3: {
      name: 'Expectativas Idealizadas',
      icon: '🪞',
      description:
        'Examina las expectativas idealizadas que proyectas en tus relaciones. Si esta version ideal existiera como persona real, ¿seria alguien de tu circulo de confianza?',
      questions:
        '¿Que caracteristicas idealizas? ¿Cuales son las criticas implicitas en este ideal? Describelo como persona real. ¿Te atrae genuinamente? ¿Estas atraido a lo que representa o a quien realmente eres con esa persona?',
      addLabel: 'Nueva reflexion',
      emptyMessage: 'Cuando estes listo, empieza tu primera reflexion.',
    },
  },
  time: {
    today: 'Hoy',
    yesterday: 'Ayer',
    days: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
    ],
    months: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    dateFormat: ({ prefix, day, date, month, year, time }) =>
      `${prefix}${day} ${date} de ${month}, ${year} — ${time}`,
  },
  dosBanderas: {
    newRecord: 'Nuevo registro diario',
    dateTimeLabel: 'Fecha/Hora:',
    section1Label: 'Polvo de Estrellas',
    section1Placeholder: 'Agrega momentos de serenidad y autenticidad...',
    section2Label: 'La Madeja',
    section2Placeholder: 'Agrega momentos de madeja/supervivencia...',
    learningLabel: '¿Que aprendi hoy?',
    learningPlaceholder: 'Reflexion del dia...',
    deleteRecord: 'Eliminar registro',
    deleteRecordConfirm: '¿Seguro que quieres eliminar este registro completo?',
    deleteItemConfirm: '¿Seguro que quieres eliminar este elemento?',
    noRecords: 'Aun no hay registros. Crea tu primer registro diario.',
  },
  freeform: {
    instructionLabel: 'Instrucciones:',
    questionsLabel: 'Preguntas guia:',
    dateLabel: 'Fecha:',
    titlePlaceholder: 'Titulo de esta entrada...',
    contentPlaceholder: 'Escribe aqui...',
    noTitle: 'Sin titulo',
    deleteEntry: 'Eliminar entrada',
    deleteEntryConfirm: '¿Seguro que quieres eliminar esta entrada?',
  },
  theme: {
    light: 'Modo claro',
    dark: 'Modo oscuro',
  },
  messages: {
    noHurry: 'Sin prisa, sin presion',
  },
  language: {
    toggle: 'Cambiar idioma',
  },
  marquee: {
    journal: 'Diario de Proceso',
  },
};

export const en: Translations = {
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    clickToEdit: 'Click to edit...',
    add: (label) => `Add ${label.toLowerCase()}`,
  },
  auth: {
    subtitle: 'Process Journal',
    appName: 'Estela',
    tagline: 'Your space to record, reflect, and grow',
    signIn: 'Sign in with Google',
    sessionInfo: 'Introspection exercises',
  },
  nav: {
    logout: 'Sign out',
    showGuide: 'View exercise guide',
    hideGuide: 'Hide guide',
  },
  greeting: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },
  exercises: {
    exercise1: {
      name: 'Two Flags',
      icon: '🏴',
      guide: {
        section1Label: '✨ Stardust:',
        section1Desc: 'Serenity, flow, being yourself.',
        section2Label: '🏴 The Tangle:',
        section2Desc:
          'Confusion, forced adaptation, discomfort, feeling trapped.',
        instruction: 'Record moments of both flags each day.',
      },
      addLabel: 'New daily record',
      emptyMessage: 'No records yet. Create your first daily record.',
    },
    exercise2: {
      name: 'Significant Bond',
      icon: '🕊',
      description:
        'Write about a significant relationship from your formative years, before disillusionment accumulated. Recover the original desire for connection.',
      questions:
        'What is your first memory of feeling truly close and understood? What did you hope for from that connection? When did the dynamic begin to shift? What patterns do you recognize in your later relationships?',
      addLabel: 'New entry',
      emptyMessage: 'When you are ready, create your first entry. No rush.',
    },
    exercise3: {
      name: 'Idealized Expectations',
      icon: '🪞',
      description:
        'Examine the idealized expectations you project onto relationships. If this ideal version existed as a real person, would they be part of your inner circle?',
      questions:
        'What qualities do you idealize? What implicit criticisms underlie this ideal? Describe them as a real person. Are you genuinely drawn to them? Are you attracted to what they represent or to who you truly become with them?',
      addLabel: 'New reflection',
      emptyMessage: 'When you are ready, begin your first reflection.',
    },
  },
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    dateFormat: ({ prefix, day, date, month, year, time }) =>
      `${prefix}${day} ${month} ${date}, ${year} — ${time}`,
  },
  dosBanderas: {
    newRecord: 'New daily record',
    dateTimeLabel: 'Date/Time:',
    section1Label: 'Stardust',
    section1Placeholder: 'Add moments of serenity and authenticity...',
    section2Label: 'The Tangle',
    section2Placeholder: 'Add moments of tangle/survival...',
    learningLabel: 'What did I learn today?',
    learningPlaceholder: 'Daily reflection...',
    deleteRecord: 'Delete record',
    deleteRecordConfirm: 'Are you sure you want to delete this entire record?',
    deleteItemConfirm: 'Are you sure you want to delete this item?',
    noRecords: 'No records yet. Create your first daily record.',
  },
  freeform: {
    instructionLabel: 'Instructions:',
    questionsLabel: 'Guiding questions:',
    dateLabel: 'Date:',
    titlePlaceholder: 'Entry title...',
    contentPlaceholder: 'Write here...',
    noTitle: 'Untitled',
    deleteEntry: 'Delete entry',
    deleteEntryConfirm: 'Are you sure you want to delete this entry?',
  },
  theme: {
    light: 'Light mode',
    dark: 'Dark mode',
  },
  messages: {
    noHurry: 'No rush, no pressure',
  },
  language: {
    toggle: 'Change language',
  },
  marquee: {
    journal: 'Process Journal',
  },
};

const translations: Record<Language, Translations> = { es, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
