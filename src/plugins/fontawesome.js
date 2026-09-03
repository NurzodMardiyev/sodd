import { library } from '@fortawesome/fontawesome-svg-core';
import { faBus, faChartColumn, faGaugeHigh, faGraduationCap, faPeopleGroup, faRoad, faShareNodes, faTrafficLight, faTrainSubway } from '@fortawesome/free-solid-svg-icons';

// Sidebar navigatsiyasida (useModuleNav.js'dagi `apps` ro'yxati) ishlatiladigan
// FontAwesome ikonkalar shu yerda ro'yxatga olinadi. Yangi app/modul faIcon
// qo'shsangiz, mos ikonani shu faylga import qilib `library.add(...)`ga
// qo'shish kifoya.
library.add(faGaugeHigh, faBus, faTrainSubway, faGraduationCap, faTrafficLight, faShareNodes, faPeopleGroup, faRoad, faChartColumn);
