// ---------------------------------------------------------------------------
// Toshkent metropoliteni — yo'nalishlar, bekatlar va ranglar.
//
// Manba: https://uzmetro.uz/uz/metro-xaritasi (rasmiy sxema) — bekatlar tartibi,
// nomlari va yo'nalish ranglari aynan shu sxemadan olingan (SVG'dagi stroke/fill
// qiymatlari). Koordinatalar (lat, lon) — OpenStreetMap (station=subway) va
// Yandex geokoder ma'lumotlari.
//
// TransportMapCard.vue "metro" rejimida shu massivni Yandex xaritada chizadi.
// ---------------------------------------------------------------------------

export const METRO_LINES = [
    {
        id: 'chilonzor',
        name: "Chilonzor yo'nalishi",
        color: '#E53E3E',
        stations: [
            { name: "Buyuk ipak yo'li", coords: [41.32611, 69.32856] },
            { name: 'Pushkin', coords: [41.32195, 69.3111] },
            { name: 'Hamid Olimjon', coords: [41.31816, 69.29574] },
            { name: 'Amir Temur xiyoboni', coords: [41.31267, 69.28327] },
            { name: 'Mustaqillik maydoni', coords: [41.31495, 69.27106] },
            { name: 'Paxtakor', coords: [41.31779, 69.25509] },
            { name: "Xalqlar do'stligi", coords: [41.3119, 69.2431] },
            { name: "Milliy bog'", coords: [41.30339, 69.23567] },
            { name: 'Novza', coords: [41.29187, 69.22362] },
            { name: "Mirzo Ulug'bek", coords: [41.28203, 69.21258] },
            { name: 'Chilonzor', coords: [41.27436, 69.20497] },
            { name: 'Olmazor', coords: [41.25667, 69.1961] },
            { name: 'Choshtepa', coords: [41.23825, 69.19603] },
            { name: "O'zgarish", coords: [41.22734, 69.20397] },
            { name: 'Sergeli', coords: [41.22084, 69.20873] },
            { name: 'Yangihayot', coords: [41.21351, 69.21402] },
            { name: 'Chinor', coords: [41.2067, 69.21896] }
        ]
    },
    {
        id: 'uzbekiston',
        name: "O'zbekiston yo'nalishi",
        color: '#0000FE',
        stations: [
            { name: 'Beruniy', coords: [41.34462, 69.2062] },
            { name: 'Tinchlik', coords: [41.3323, 69.21912] },
            { name: 'Chorsu', coords: [41.32586, 69.23682] },
            { name: "G'afur G'ulom", coords: [41.32788, 69.24583] },
            { name: 'Alisher Navoiy', coords: [41.31892, 69.2543] },
            { name: "O'zbekiston", coords: [41.31194, 69.25341] },
            { name: 'Kosmonavtlar', coords: [41.30516, 69.26472] },
            { name: 'Oybek', coords: [41.29801, 69.27405] },
            { name: 'Toshkent', coords: [41.29329, 69.28772] },
            { name: 'Mashinasozlar', coords: [41.29898, 69.30513] },
            { name: "Do'stlik", coords: [41.29364, 69.32224] }
        ]
    },
    {
        id: 'yunusobod',
        name: "Yunusobod yo'nalishi",
        color: '#38A169',
        stations: [
            { name: 'Turkiston', coords: [41.37752, 69.29602] },
            { name: 'Yunusobod', coords: [41.36684, 69.2923] },
            { name: 'Shahriston', coords: [41.35312, 69.28811] },
            { name: 'Bodomzor', coords: [41.33717, 69.28457] },
            { name: 'Minor', coords: [41.32689, 69.28342] },
            { name: 'Abdulla Qodiriy', coords: [41.32019, 69.28176] },
            { name: 'Yunus Rajabiy', coords: [41.31389, 69.28351] },
            { name: "Mingo'rik", coords: [41.29966, 69.27441] }
        ]
    },
    {
        id: 'halqa',
        name: "Yer usti halqa yo'nalishi",
        color: '#D69E2E',
        stations: [
            { name: 'Texnopark', coords: [41.29463, 69.32319] },
            { name: 'Yashnobod', coords: [41.29759, 69.34978] },
            { name: 'Tuzel', coords: [41.29201, 69.35618] },
            { name: 'Olmos', coords: [41.28171, 69.36033] },
            { name: 'Rohat', coords: [41.26529, 69.36475] },
            { name: 'Yangiobod', coords: [41.25651, 69.35872] },
            { name: "Qo'yliq", coords: [41.23746, 69.327] },
            { name: 'Matonat', coords: [41.24447, 69.30832] },
            { name: 'Qiyot', coords: [41.24448, 69.29973] },
            { name: 'Tolariq', coords: [41.24451, 69.28496] },
            { name: 'Xonobod', coords: [41.23001, 69.27044] },
            { name: 'Quruvchilar', coords: [41.22164, 69.2605] },
            { name: 'Turon', coords: [41.21068, 69.23415] },
            { name: 'Qipchoq', coords: [41.20542, 69.22141] }
        ]
    }
];

// O'tish (peresadka) bekatlari — rasmiy sxemada qisqa bog'lovchi chiziq bilan
// ko'rsatilgan juftliklar. Xaritada shtrixli bog'lovchi sifatida chiziladi.
export const METRO_TRANSFERS = [
    ['Paxtakor', 'Alisher Navoiy'],
    ['Amir Temur xiyoboni', 'Yunus Rajabiy'],
    ['Oybek', "Mingo'rik"],
    ["Do'stlik", 'Texnopark'],
    ['Chinor', 'Qipchoq']
];

// Bekat nomi bo'yicha koordinata (o'tish bog'lovchilarini chizish uchun).
export function findStation(name) {
    for (const line of METRO_LINES) {
        const st = line.stations.find((s) => s.name === name);
        if (st) return { ...st, line };
    }
    return null;
}
