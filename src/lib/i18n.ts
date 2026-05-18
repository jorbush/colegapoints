export type Locale = 'en' | 'es' | 'ca';
export const DEFAULT_LOCALE: Locale = 'en';
export const locales: Locale[] = ['en', 'es', 'ca'];

export function getLocale(cookies?: any, headers?: Headers | null): Locale {
  // 1. Try to get locale from cookies
  if (cookies) {
    if (typeof cookies.get === 'function') {
      const cookieVal = cookies.get('lang')?.value;
      if (cookieVal && locales.includes(cookieVal as Locale)) {
        return cookieVal as Locale;
      }
    } else if (typeof cookies === 'string') {
      const match = cookies.match(/lang=([^;]+)/);
      if (match) {
        const cookieVal = match[1] as Locale;
        if (locales.includes(cookieVal)) return cookieVal;
      }
    } else if (typeof cookies === 'object') {
      const cookieVal = cookies['lang'];
      if (cookieVal && locales.includes(cookieVal as Locale)) {
        return cookieVal as Locale;
      }
    }
  }

  // 2. Try to get locale from Accept-Language header
  if (headers && typeof headers.get === 'function') {
    const acceptLang = headers.get('accept-language');
    if (acceptLang) {
      const langs = acceptLang.split(',').map((l) => l.split(';')[0].trim().toLowerCase());
      for (const lang of langs) {
        if (lang.startsWith('ca')) return 'ca';
        if (lang.startsWith('es')) return 'es';
        if (lang.startsWith('en')) return 'en';
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function getClientLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const htmlLang = document.documentElement.lang as Locale;
  if (locales.includes(htmlLang)) return htmlLang;

  const match = document.cookie.match(/lang=([^;]+)/);
  if (match) {
    const val = match[1] as Locale;
    if (locales.includes(val)) return val;
  }
  return DEFAULT_LOCALE;
}

export const translations = {
  en: {
    'meta.description':
      "Track friend points with your crew. Give points, take points, see who's the best colega.",
    'home.title': 'Home',
    'home.hero_subtitle': 'The scoreboard your friend group actually deserves.',
    'home.your_groups': 'Your Groups',
    'home.or_start_fresh': 'or start fresh',
    'home.start_new_group': 'Start a new group',
    'home.group_name': 'Group name *',
    'home.group_name_placeholder': 'e.g. The Gang, Squad Goals…',
    'home.group_description': 'Description (optional)',
    'home.group_description_placeholder': "What's this crew about?",
    'home.create_group': 'Create Group →',
    'home.creating': 'Creating…',
    'home.sync_existing_group': 'Sync existing group',
    'home.sync_hint': 'Enter a sync code from your browser to move your profile here.',
    'home.sync_placeholder': 'e.g. AB12XY',
    'home.sync_button': 'Sync',
    'home.invite_hint': "Got an invite link? Just open it — you'll join automatically. 🔗",
    'home.you': 'You: {name}',
    'footer.created_by': 'Created by',
    'group.invite': '🔗 Invite',
    'group.copied': '✅ Copied!',
    'group.history': '📜 History',
    'group.leave': '🚪 Leave',
    'group.give_take_points': '⭐ Give / Take Points',
    'group.give_take_tooltip': 'Add more members to give or take points',
    'group.sync_to_app': '📱 Sync to App',
    'group.sync_desc': 'Move this group to your installed app',
    'group.get_sync_code': 'Get Sync Code',
    'group.generating': 'Generating…',
    'group.sync_failed': 'Failed to generate code. Try again.',
    'group.your_sync_code': 'Your Sync Code',
    'group.sync_expiration':
      'Enter this on the Home screen of your ColegaPoints app. Expires in 10 min.',
    'group.copy_code': '📋 Copy Code',
    'group.push_notifications': 'Push Notifications',
    'group.push_desc': 'Get notified on updates',
    'group.leave_modal_title': 'Leave group?',
    'group.leave_modal_body':
      "You'll be removed from {groupName}. Your history stays, but the squad will miss you.",
    'group.leave_confirm': 'Leave',
    'group.leave_cancel': 'Cancel',
    'group.leaving': 'Leaving…',
    'join.title': '👋 Join the squad',
    'join.name_label': 'Your name',
    'join.name_placeholder': 'What do your colegas call you?',
    'join.emoji_label': 'Pick your emoji',
    'join.button': 'Join the squad →',
    'join.joining': 'Joining…',
    'join.error_name': 'Enter your name!',
    'leaderboard.title': 'Leaderboard',
    'leaderboard.no_colegas': 'No colegas yet.',
    'leaderboard.no_colegas_desc': 'Share the link to get the party started!',
    'leaderboard.top_colega': 'Top Colega',
    'leaderboard.joined': 'Joined {date}',
    'event.gave': 'gave',
    'event.took': 'took',
    'event.pts': 'pt',
    'event.pts_plural': 'pts',
    'event.to': 'to',
    'event.from': 'from',
    'event.gave_compact': 'gave to',
    'event.took_compact': 'took from',
    'modal.points_title': 'Points',
    'modal.who_gets': 'Who gets the points?',
    'modal.amount': 'Amount',
    'modal.custom_amount_placeholder': 'Or custom amount…',
    'modal.reason': 'Reason (optional)',
    'modal.reason_placeholder': 'Why tho? e.g. Forgot to pay back',
    'modal.submit': 'Send Points ⭐',
    'modal.sending': 'Sending…',
    'modal.error_select_member': 'Select a member!',
    'modal.error_pick_points': 'Pick or enter points!',
    'activity.title': 'Recent Activity',
    'activity.full_history': 'See full history →',
    'profile.title': 'Colega Profile',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.saving': 'Saving…',
    'profile.cancel': 'Cancel',
    'profile.name_label': 'Your name',
    'profile.emoji_label': 'Pick your emoji',
    'profile.name_placeholder': 'Name',
    'profile.name_required': 'Name is required!',
    'profile.joined': 'Joined {date}',
    'profile.exact_points': 'Exact Points',
    'profile.squad_rank': 'Squad Rank',
    'profile.statistics': 'Statistics',
    'profile.stat_received': '⭐ Points Received:',
    'profile.stat_deducted': '💔 Points Deducted:',
    'profile.stat_given': '📤 Points Given to others:',
    'profile.stat_taken': '📥 Points Taken from others:',
    'profile.stat_interactions': '🔄 Total Interactions:',
    'profile.no_activity': 'No point activity yet.',
    'profile.history_received': 'From {name}',
    'profile.history_sent': 'To {name}',
    'profile.history_gave_tag': 'Gave +{delta}',
    'profile.history_took_tag': 'Took {delta}',
    'history.back': '← Back to {groupName}',
    'history.title': 'Point History',
    'history.events_total_one': '1 event total',
    'history.events_total_many': '{count} events total',
    'history.no_events': 'No point events yet.',
    'history.go_give': 'Go give your colegas some points!',
  },
  es: {
    'meta.description':
      'Lleva la cuenta de los puntos con tus amigos. Da puntos, quita puntos, mira quién es el mejor colega.',
    'home.title': 'Inicio',
    'home.hero_subtitle': 'El marcador que tu grupo de amigos realmente se merece.',
    'home.your_groups': 'Tus Grupos',
    'home.or_start_fresh': 'o empieza de cero',
    'home.start_new_group': 'Crear un nuevo grupo',
    'home.group_name': 'Nombre del grupo *',
    'home.group_name_placeholder': 'p. ej. La Banda, El Equipo…',
    'home.group_description': 'Descripción (opcional)',
    'home.group_description_placeholder': '¿De qué va este grupo?',
    'home.create_group': 'Crear Grupo →',
    'home.creating': 'Creando…',
    'home.sync_existing_group': 'Sincronizar grupo existente',
    'home.sync_hint':
      'Introduce un código de sincronización desde tu navegador para mover tu perfil aquí.',
    'home.sync_placeholder': 'p. ej. AB12XY',
    'home.sync_button': 'Sincronizar',
    'home.invite_hint':
      '¿Tienes un enlace de invitación? Solo ábrelo y te unirás automáticamente. 🔗',
    'home.you': 'Tú: {name}',
    'footer.created_by': 'Creado por',
    'group.invite': '🔗 Invitar',
    'group.copied': '✅ ¡Copiado!',
    'group.history': '📜 Historial',
    'group.leave': '🚪 Salir',
    'group.give_take_points': '⭐ Dar / Quitar Puntos',
    'group.give_take_tooltip': 'Añade más miembros para dar o quitar puntos',
    'group.sync_to_app': '📱 Sincronizar con la App',
    'group.sync_desc': 'Mueve este grupo a tu aplicación instalada',
    'group.get_sync_code': 'Obtener código',
    'group.generating': 'Generando…',
    'group.sync_failed': 'No se pudo generar el código. Inténtalo de nuevo.',
    'group.your_sync_code': 'Tu código de sincronización',
    'group.sync_expiration':
      'Introdúcelo en la pantalla de inicio de tu app de ColegaPoints. Caduca en 10 min.',
    'group.copy_code': '📋 Copiar código',
    'group.push_notifications': 'Notificaciones Push',
    'group.push_desc': 'Recibe notificaciones cuando haya cambios',
    'group.leave_modal_title': '¿Salir del grupo?',
    'group.leave_modal_body':
      'Se te eliminará de {groupName}. Tu historial se mantiene, pero el equipo te echará de menos.',
    'group.leave_confirm': 'Salir',
    'group.leave_cancel': 'Cancelar',
    'group.leaving': 'Saliendo…',
    'join.title': '👋 Únete al equipo',
    'join.name_label': 'Tu nombre',
    'join.name_placeholder': '¿Cómo te llaman tus colegas?',
    'join.emoji_label': 'Elige tu emoji',
    'join.button': 'Únete al equipo →',
    'join.joining': 'Uniéndose…',
    'join.error_name': '¡Introduce tu nombre!',
    'leaderboard.title': 'Clasificación',
    'leaderboard.no_colegas': 'No hay colegas todavía.',
    'leaderboard.no_colegas_desc': '¡Comparte el enlace para empezar la fiesta!',
    'leaderboard.top_colega': 'Colega Top',
    'leaderboard.joined': 'Se unió el {date}',
    'event.gave': 'dio',
    'event.took': 'quitó',
    'event.pts': 'pt',
    'event.pts_plural': 'pts',
    'event.to': 'a',
    'event.from': 'a',
    'event.gave_compact': 'dio a',
    'event.took_compact': 'quitó a',
    'modal.points_title': 'Puntos',
    'modal.who_gets': '¿Quién recibe los puntos?',
    'modal.amount': 'Cantidad',
    'modal.custom_amount_placeholder': 'O cantidad personalizada…',
    'modal.reason': 'Motivo (opcional)',
    'modal.reason_placeholder': '¿Por qué? p. ej. Olvidó pagar su parte',
    'modal.submit': 'Enviar Puntos ⭐',
    'modal.sending': 'Enviando…',
    'modal.error_select_member': '¡Selecciona un miembro!',
    'modal.error_pick_points': '¡Elige o introduce puntos!',
    'activity.title': 'Actividad Reciente',
    'activity.full_history': 'Ver historial completo →',
    'profile.title': 'Perfil del Colega',
    'profile.edit': 'Editar',
    'profile.save': 'Guardar',
    'profile.saving': 'Guardando…',
    'profile.cancel': 'Cancelar',
    'profile.name_label': 'Tu nombre',
    'profile.emoji_label': 'Elige tu emoji',
    'profile.name_placeholder': 'Nombre',
    'profile.name_required': '¡El nombre es obligatorio!',
    'profile.joined': 'Se unió el {date}',
    'profile.exact_points': 'Puntos Exactos',
    'profile.squad_rank': 'Posición',
    'profile.statistics': 'Estadísticas',
    'profile.stat_received': '⭐ Puntos Recibidos:',
    'profile.stat_deducted': '💔 Puntos Restados:',
    'profile.stat_given': '📤 Puntos Dados a otros:',
    'profile.stat_taken': '📥 Puntos Quitados a otros:',
    'profile.stat_interactions': '🔄 Interacciones Totales:',
    'profile.no_activity': 'Sin actividad de puntos todavía.',
    'profile.history_received': 'De {name}',
    'profile.history_sent': 'A {name}',
    'profile.history_gave_tag': 'Dio +{delta}',
    'profile.history_took_tag': 'Quitó {delta}',
    'history.back': '← Volver a {groupName}',
    'history.title': 'Historial de Puntos',
    'history.events_total_one': '1 evento en total',
    'history.events_total_many': '{count} eventos en total',
    'history.no_events': 'No hay eventos de puntos todavía.',
    'history.go_give': '¡Ve a darles algunos puntos a tus colegas!',
  },
  ca: {
    'meta.description':
      'Porta el compte dels punts amb els teus amics. Dóna punts, treu punts, mira qui és el millor colega.',
    'home.title': 'Inici',
    'home.hero_subtitle': "El marcador que el teu grup d'amics realment es mereix.",
    'home.your_groups': 'Els teus grups',
    'home.or_start_fresh': 'o comença de nou',
    'home.start_new_group': 'Crear un grup nou',
    'home.group_name': 'Nom del grup *',
    'home.group_name_placeholder': "p. ex. La Banda, L'Equip…",
    'home.group_description': 'Descripció (opcional)',
    'home.group_description_placeholder': 'De què va aquest grup?',
    'home.create_group': 'Crear Grup →',
    'home.creating': 'Creant…',
    'home.sync_existing_group': 'Sincronitzar grup existent',
    'home.sync_hint':
      'Introdueix un codi de sincronització des del teu navegador per moure el teu perfil aquí.',
    'home.sync_placeholder': 'p. ex. AB12XY',
    'home.sync_button': 'Sincronitzar',
    'home.invite_hint': "Tens un enllaç d'invitació? Només obre'l i t'afegiràs automàticament. 🔗",
    'home.you': 'Tu: {name}',
    'footer.created_by': 'Creat per',
    'group.invite': '🔗 Convidar',
    'group.copied': '✅ Copiat!',
    'group.history': '📜 Historial',
    'group.leave': '🚪 Sortir',
    'group.give_take_points': '⭐ Donar / Treure Punts',
    'group.give_take_tooltip': 'Afegeix més membres per donar o treure punts',
    'group.sync_to_app': "📱 Sincronitzar amb l'App",
    'group.sync_desc': 'Mou aquest grup a la teva aplicació instal·lada',
    'group.get_sync_code': 'Obtenir codi',
    'group.generating': 'Generant…',
    'group.sync_failed': "No s'ha pogut generar el codi. Torna-ho a provar.",
    'group.your_sync_code': 'El teu codi de sincronització',
    'group.sync_expiration':
      "Introdueix-lo a la pantalla d'inici de la teva app de ColegaPoints. Caduca en 10 min.",
    'group.copy_code': '📋 Copiar codi',
    'group.push_notifications': 'Notificacions Push',
    'group.push_desc': 'Rep notificacions quan hi hagi canvis',
    'group.leave_modal_title': 'Sortir del grup?',
    'group.leave_modal_body':
      "Se t'eliminarà de {groupName}. El teu historial es manté, però l'equip et trobarà a faltar.",
    'group.leave_confirm': 'Sortir',
    'group.leave_cancel': 'Cancel·lar',
    'group.leaving': 'Sortint…',
    'join.title': "👋 Uneix-te a l'equip",
    'join.name_label': 'El teu nom',
    'join.name_placeholder': 'Com et diuen els teus colegas?',
    'join.emoji_label': 'Tria el teu emoji',
    'join.button': "Uneix-te a l'equip →",
    'join.joining': 'Unint-se…',
    'join.error_name': 'Introdueix el teu nom!',
    'leaderboard.title': 'Classificació',
    'leaderboard.no_colegas': 'No hi ha colegas encara.',
    'leaderboard.no_colegas_desc': "Comparteix l'enllaç per començar la festa!",
    'leaderboard.top_colega': 'Colega Top',
    'leaderboard.joined': 'Es va unir el {date}',
    'event.gave': 'va donar',
    'event.took': 'va treure',
    'event.pts': 'pt',
    'event.pts_plural': 'pts',
    'event.to': 'a',
    'event.from': 'a',
    'event.gave_compact': 'va donar a',
    'event.took_compact': 'va treure a',
    'modal.points_title': 'Punts',
    'modal.who_gets': 'Qui rep els punts?',
    'modal.amount': 'Quantitat',
    'modal.custom_amount_placeholder': 'O quantitat personalitzada…',
    'modal.reason': 'Motiu (opcional)',
    'modal.reason_placeholder': 'Per què? p. ex. Va oblidar pagar la seva part',
    'modal.submit': 'Enviar Punts ⭐',
    'modal.sending': 'Enviant…',
    'modal.error_select_member': 'Selecciona un membre!',
    'modal.error_pick_points': 'Tria o introdueix punts!',
    'activity.title': 'Activitat Recent',
    'activity.full_history': 'Veure historial complet →',
    'profile.title': 'Perfil del Colega',
    'profile.edit': 'Editar',
    'profile.save': 'Guardar',
    'profile.saving': 'Guardant…',
    'profile.cancel': 'Cancel·lar',
    'profile.name_label': 'El teu nom',
    'profile.emoji_label': 'Tria el teu emoji',
    'profile.name_placeholder': 'Nom',
    'profile.name_required': 'El nom és obligatori!',
    'profile.joined': 'Es va unir el {date}',
    'profile.exact_points': 'Punts Exactes',
    'profile.squad_rank': 'Posició',
    'profile.statistics': 'Estadístiques',
    'profile.stat_received': '⭐ Punts Rebuts:',
    'profile.stat_deducted': '💔 Punts Restats:',
    'profile.stat_given': '📤 Punts Donats a altres:',
    'profile.stat_taken': '📥 Punts Trets a altres:',
    'profile.stat_interactions': '🔄 Interaccions Totals:',
    'profile.no_activity': 'Sense activitat de punts encara.',
    'profile.history_received': 'De {name}',
    'profile.history_sent': 'A {name}',
    'profile.history_gave_tag': 'Va donar +{delta}',
    'profile.history_took_tag': 'Va treure {delta}',
    'history.back': '← Tornar a {groupName}',
    'history.title': 'Historial de Punts',
    'history.events_total_one': '1 esdeveniment en total',
    'history.events_total_many': '{count} esdeveniments en total',
    'history.no_events': 'No hi ha esdeveniments de punts encara.',
    'history.go_give': 'Vés a donar alguns punts als teus colegas!',
  },
} as const;

export function useTranslation(locale: Locale) {
  const dict = translations[locale] || translations[DEFAULT_LOCALE];

  return function t(
    key: keyof typeof translations.en,
    params?: Record<string, string | number>
  ): string {
    let text: string = (dict as any)[key] || (translations.en as any)[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    return text;
  };
}
