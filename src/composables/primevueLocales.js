// PrimeVue global konfiguratsiyasi (`$primevue.config.locale`) — Calendar/DatePicker,
// shuningdek boshqa PrimeVue komponentlarining bugun/tozalash/oy-kun nomlari kabi matnlari
// shu obyektdan o'qiladi. Loyihaning Angular tarafidagi (`app.component.ts`) xuddi shu
// konfiguratsiyasining Vue'ga moslashtirilgani — dayNames/monthNames/today/clear va h.k.
//
// Faqat kalendar bilan bog'liq kalitlar tarjima qilingan (dateFormat, kun/oy nomlari,
// today/clear/chooseYear va h.k.) — DataTable filtri, FileUpload va shu kabi boshqa
// komponentlarning ingliz tilidagi standart matnlari o'zgartirilmagan (ular alohida
// keng qamrovli i18n loyihasi doirasida qilinishi kerak).

const uz = {
    dayNames: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    dayNamesShort: ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha'],
    dayNamesMin: ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
    monthNames: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    monthNamesShort: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    today: 'Bugun',
    clear: 'Tozalash',
    weekHeader: 'Hafta',
    firstDayOfWeek: 1,
    dateFormat: 'dd.mm.yy',
    chooseYear: 'Yilni tanlang',
    chooseMonth: 'Oyni tanlang',
    chooseDate: 'Sanani tanlang',
    prevDecade: "Oldingi o'n yillik",
    nextDecade: "Keyingi o'n yillik",
    prevYear: 'Oldingi yil',
    nextYear: 'Keyingi yil',
    prevMonth: 'Oldingi oy',
    nextMonth: 'Keyingi oy',
    accept: 'Ha',
    reject: "Yo'q"
};

const ru = {
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    today: 'Сегодня',
    clear: 'Очистить',
    weekHeader: 'Неделя',
    firstDayOfWeek: 1,
    dateFormat: 'dd.mm.yy',
    chooseYear: 'Выберите год',
    chooseMonth: 'Выберите месяц',
    chooseDate: 'Выберите дату',
    prevDecade: 'Предыдущее десятилетие',
    nextDecade: 'Следующее десятилетие',
    prevYear: 'Предыдущий год',
    nextYear: 'Следующий год',
    prevMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    accept: 'Да',
    reject: 'Нет'
};

const en = {
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    weekHeader: 'Wk',
    firstDayOfWeek: 0,
    dateFormat: 'mm/dd/yy',
    chooseYear: 'Choose Year',
    chooseMonth: 'Choose Month',
    chooseDate: 'Choose Date',
    prevDecade: 'Previous Decade',
    nextDecade: 'Next Decade',
    prevYear: 'Previous Year',
    nextYear: 'Next Year',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    accept: 'Yes',
    reject: 'No'
};

const LOCALES = { uz, ru, en };

// PrimeVue'ning o'zi ta'minlagan ingliz tilidagi standart `config.locale` obyekti ustiga
// (u DataTable/FileUpload va h.k. uchun barcha kalitlarni allaqachon o'z ichiga oladi)
// faqat kalendarga tegishli kalitlarni ustma-ust yozamiz — shu bois boshqa
// komponentlarning matnlari yo'qolib qolmaydi.
export function getPrimeVueLocale(lang, baseLocale) {
    return { ...(baseLocale ?? {}), ...(LOCALES[lang] ?? LOCALES.uz) };
}