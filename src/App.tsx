import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { useEffect, useState } from "react";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  minZoom: 1,
  maxZoom: 8,
  pitch: 0,
  bearing: 0,
};

interface CountryData {
  country: string;
  type: string;
  outcome: "Success" | "Failure" | "Mixed" | "None";
  summary: string;
}

const infiltrationData: CountryData[] = [
  {
    country: "Latin America",
    type: "Regime Change",
    outcome: "Mixed",
    summary:
      "В последней половине XIX века правительство США инициировало действия по смене режима в основном в Латинской Америке [1].",
  },
  {
    country: "the southwest Pacific",
    type: "Regime Change",
    outcome: "Mixed",
    summary:
      "В последней половине XIX века правительство США инициировало действия по смене режима в том числе на юго-западе Тихого океана [1].",
  },
  {
    country: "Philippines",
    type: "War and Regime Change",
    outcome: "Success",
    summary:
      "В конце XIX века США участвовали в Филиппино-американской войне с целью установления контроля после победы в Испано-американской войне и роспуска Первой Филиппинской республики [1-3].",
  },
  {
    country: "Hawaii",
    type: "Regime Change and Annexation",
    outcome: "Success",
    summary:
      "В начале XX века США сформировали правительство на Гавайях после свержения монархии в 1893 году и последующей аннексии в 1898 году [1, 4].",
  },
  {
    country: "Panama",
    type: "Regime Change and Intervention",
    outcome: "Success",
    summary:
      "В начале XX века США участвовали в создании правительства в Панаме, поддерживая движение за независимость от Колумбии в 1903 году [1, 3].",
  },
  {
    country: "Nicaragua",
    type: "Intervention and Regime Change",
    outcome: "Mixed",
    summary:
      "В начале XX века США вмешивались в Никарагуа, поддерживая различные фракции и устанавливая правительства, в частности, во время банановых войн и последующей оккупации в 1912-1933 годах [1, 5-7].",
  },
  {
    country: "Mexico",
    type: "Intervention and Political Pressure",
    outcome: "Mixed",
    summary:
      "В начале XX века США оказывали влияние на правительство Мексики, включая поддержку Бенито Хуареса против французской интервенции в 1860-х годах и вмешательство во время Мексиканской революции, в частности, поддержка свержения Франсиско Мадеро и оккупация Веракруса [1, 2, 7-9].",
  },
  {
    country: "Haiti",
    type: "Occupation and Regime Change",
    outcome: "Mixed",
    summary:
      "США оккупировали Гаити с 1915 по 1934 год, устанавливая новые правительства и диктуя условия конституции [1, 9, 10].",
  },
  {
    country: "Dominican Republic",
    type: "Occupation and Intervention",
    outcome: "Mixed",
    summary:
      "США проводили военные интервенции в Доминиканской Республике, включая оккупацию с 1916 по 1924 год, устанавливая свой контроль над правительством и вооруженными силами [1, 9, 11].",
  },
  {
    country: "Nazi German puppet regimes",
    type: "Overthrow",
    outcome: "Success",
    summary:
      "Во время Второй мировой войны США помогали свергать многочисленные марионеточные режимы нацистской Германии [12].",
  },
  {
    country: "Imperial Japanese puppet regimes",
    type: "Overthrow",
    outcome: "Success",
    summary:
      "Во время Второй мировой войны США помогали свергать многочисленные марионеточные режимы императорской Японии [12].",
  },
  {
    country: "Philippines",
    type: "Overthrow of Puppet Regime",
    outcome: "Success",
    summary:
      "Во время Второй мировой войны США помогли свергнуть марионеточный режим на Филиппинах [12, 13].",
  },
  {
    country: "Korea",
    type: "Overthrow of Puppet Regime and Division",
    outcome: "Mixed",
    summary:
      "Во время Второй мировой войны США помогли свергнуть марионеточный режим в Корее, что впоследствии привело к разделу страны [12, 14, 15].",
  },
  {
    country: "East China",
    type: "Overthrow of Puppet Regime",
    outcome: "Success",
    summary:
      "Во время Второй мировой войны США помогли свергнуть марионеточный режим в Восточном Китае [12].",
  },
  {
    country: "parts of Europe",
    type: "Overthrow of Puppet Regimes",
    outcome: "Success",
    summary:
      "Во время Второй мировой войны США помогли свергнуть марионеточные режимы в различных частях Европы [12].",
  },
  {
    country: "Germany",
    type: "Overthrow of Government and Occupation",
    outcome: "Success",
    summary:
      "США вместе с Великобританией и Советским Союзом сыграли важную роль в свержении правительства Адольфа Гитлера в Германии и последующей оккупации [12, 16].",
  },
  {
    country: "Italy",
    type: "Deposition of Leader and Occupation",
    outcome: "Success",
    summary:
      "США вместе с Великобританией и Советским Союзом сыграли важную роль в свержении Бенито Муссолини в Италии и последующей оккупации [12, 17].",
  },
  {
    country: "Iran",
    type: "Coup d'état",
    outcome: "Success",
    summary:
      "В 1953 году США и Великобритания спланировали и осуществили государственный переворот в Иране, свергнув Мохаммеда Мосаддыка [12, 18-20].",
  },
  {
    country: "Cuba",
    type: "Invasion Attempt and Destabilization",
    outcome: "Failure",
    summary:
      "В 1961 году США организовали вторжение в заливе Свиней с целью свержения Фиделя Кастро, которое потерпело неудачу. Также проводилась операция «Мангуст» по дестабилизации правительства Кубы [12, 21-23].",
  },
  {
    country: "Indonesia",
    type: "Support for Overthrow",
    outcome: "Success",
    summary:
      "США поддерживали свержение Сукарно генералом Сухарто в Индонезии [12, 24-26].",
  },
  {
    country: "Italy",
    type: "Election Interference",
    outcome: "Mixed",
    summary:
      "США вмешивались в национальные выборы в Италии в 1948 году [12, 27].",
  },
  {
    country: "Philippines",
    type: "Election Interference",
    outcome: "Mixed",
    summary:
      "США вмешивались в национальные выборы на Филиппинах в 1953 году [12].",
  },
  {
    country: "Japan",
    type: "Election Interference",
    outcome: "Mixed",
    summary:
      "США вмешивались в национальные выборы в Японии в 1950-х и 1960-х годах [12, 28].",
  },
  {
    country: "Lebanon",
    type: "Election Interference",
    outcome: "Mixed",
    summary: "США вмешивались в национальные выборы в Ливане в 1957 году [12].",
  },
  {
    country: "Russia",
    type: "Election Interference",
    outcome: "Mixed",
    summary:
      "США вмешивались в национальные выборы в России в 1996 году [12, 29, 30].",
  },
  {
    country: "Afghanistan",
    type: "War and Regime Change",
    outcome: "Mixed",
    summary:
      "После 11 сентября 2001 года США вторглись в Афганистан с целью борьбы с терроризмом и свержения режима талибов [31-35].",
  },
  {
    country: "Iraq",
    type: "War and Regime Change",
    outcome: "Mixed",
    summary:
      "США возглавили вторжение в Ирак в 2003 году, свергнув режим Саддама Хусейна под предлогом наличия оружия массового уничтожения [31, 36].",
  },
  {
    country: "Republic of Texas",
    type: "Annexation",
    outcome: "Success",
    summary:
      "США аннексировали Республику Техас, которую Мексика считала мятежным штатом [31].",
  },
  {
    country: "Mexico",
    type: "Seizure of Territory",
    outcome: "Success",
    summary: "Во время войны с Мексикой США захватили Альта-Калифорнию [31].",
  },
  {
    country: "Samoa",
    type: "Interference in Succession",
    outcome: "Mixed",
    summary:
      "В 1880-х годах США, Германия и Великобритания поддерживали соперничающих претендентов на трон Самоа, что привело к Первой гражданской войне в Самоа [4, 8].",
  },
  {
    country: "Kingdom of Hawaii",
    type: "Overthrow of Monarchy",
    outcome: "Success",
    summary:
      "В 1893 году американские антимонархисты свергли Королевство Гавайи [3, 4].",
  },
  {
    country: "Spanish Empire",
    type: "War and Regime Change",
    outcome: "Success",
    summary:
      "Успешная Филиппинская революция привела к поражению Испанской империи [2].",
  },
  {
    country: "Cuba",
    type: "Invasion and Occupation",
    outcome: "Mixed",
    summary:
      "После Испано-американской войны США вторглись и оккупировали Кубу в 1898 году, установив условия для своего влияния через поправку Платта [37, 38].",
  },
  {
    country: "Colombia",
    type: "Intervention",
    outcome: "Success",
    summary:
      "В 1903 году США вмешались в Колумбию в связи с вопросом о независимости Панамы [38, 39].",
  },
  {
    country: "Honduras",
    type: "Military Interventions",
    outcome: "Mixed",
    summary:
      "С 1903 по 1925 год США осуществили множество военных вторжений и интервенций в Гондурас в рамках «банановых войн» для защиты своих интересов и поддержки определенных режимов [38, 39].",
  },
  {
    country: "Cuba",
    type: "Occupation and Regime Change",
    outcome: "Mixed",
    summary:
      "С 1906 по 1909 год США повторно оккупировали Кубу после политического кризиса [38].",
  },
  {
    country: "Nicaragua",
    type: "Intervention and Occupation",
    outcome: "Mixed",
    summary:
      "В 1909-1910 годах США вмешивались в Никарагуа, поддерживая консервативную революцию и добиваясь отставки президента Селайи [5, 7].",
  },
  {
    country: "Mexico",
    type: "Interference in Coup and Non-Recognition",
    outcome: "Mixed",
    summary:
      "В 1913 году посол США в Мексике Генри Лейн Уилсон поддержал государственный переворот «Десять трагических дней», свергнувший президента Мадеро. Президент Вудро Вильсон отказался признать новое правительство Уэрты [7, 9].",
  },
  {
    country: "Germany",
    type: "World War I and Regime Change",
    outcome: "Success",
    summary:
      "После вступления в Первую мировую войну США потребовали отречения кайзера и установления республики в Германии [9, 11].",
  },
  {
    country: "Austria-Hungary",
    type: "World War I and Dissolution",
    outcome: "Success",
    summary:
      "После вступления в Первую мировую войну США объявили войну Австро-Венгрии, что привело к ее распаду [9, 40].",
  },
  {
    country: "Russia",
    type: "Intervention in Civil War",
    outcome: "Failure",
    summary:
      "США участвовали в интервенции союзников в Гражданскую войну в России в 1918-1920 годах, поддерживая Белое движение против большевиков [40, 41].",
  },
  {
    country: "Japan",
    type: "Occupation and Constitutional Change",
    outcome: "Success",
    summary:
      "После Второй мировой войны США оккупировали Японию и способствовали принятию новой конституции в 1946 году [40, 42].",
  },
  {
    country: "Okinawa",
    type: "Military Government",
    outcome: "Success",
    summary:
      "После вторжения США на Окинаву во время Тихоокеанской войны, США установили там военное правительство, которое затем сменила гражданская администрация до 1972 года [40].",
  },
  {
    country: "Germany",
    type: "Occupation and Denazification",
    outcome: "Success",
    summary:
      "После Второй мировой войны США участвовали в оккупации и денацификации западной части Германии, что привело к образованию Федеративной Республики Германия [16].",
  },
  {
    country: "Italy",
    type: "Invasion and Overthrow of Fascist Regime",
    outcome: "Success",
    summary:
      "В 1943 году США участвовали в союзном вторжении в Сицилию и последующей кампании по освобождению Италии от фашистского режима Муссолини [17, 43].",
  },
  {
    country: "France",
    type: "Liberation from Nazi Occupation",
    outcome: "Success",
    summary:
      "Британские, канадские и американские войска сыграли решающую роль в освобождении Франции от нацистской оккупации [43, 44].",
  },
  {
    country: "Belgium",
    type: "Liberation from Nazi Occupation",
    outcome: "Success",
    summary:
      "Американские, канадские и британские войска освободили большую часть Бельгии от нацистской оккупации [44, 45].",
  },
  {
    country: "Netherlands",
    type: "Liberation from Nazi Occupation",
    outcome: "Success",
    summary:
      "Британские, канадские и американские войска участвовали в освобождении Нидерландов от нацистской оккупации [45].",
  },
  {
    country: "Philippines",
    type: "Liberation from Japanese Occupation and Granting Independence",
    outcome: "Success",
    summary:
      "В 1944 году США высадились на Филиппинах, положив конец японской оккупации, и в 1946 году предоставили стране независимость [13, 46].",
  },
  {
    country: "Austria",
    type: "Occupation and Re-establishment of Sovereignty",
    outcome: "Success",
    summary:
      "После Второй мировой войны Австрия была оккупирована союзниками, включая США, и в 1955 году был подписан Государственный договор, восстановивший ее суверенитет [46, 47].",
  },
  {
    country: "South Korea",
    type: "Establishment of Military Government and Support for Authoritarian Regime",
    outcome: "Mixed",
    summary:
      "После капитуляции Японии США создали военное правительство в Южной Корее и поддерживали авторитарный режим Сингмана Ри [14, 15, 47].",
  },
  {
    country: "Greece",
    type: "Intervention in Civil War",
    outcome: "Success",
    summary:
      "США оказали значительную военную помощь правительственным силам Греции в Гражданской войне против коммунистов, что привело к восстановлению Королевства Греция [47, 48].",
  },
  {
    country: "Costa Rica",
    type: "Support in Civil War",
    outcome: "Success",
    summary:
      "США поддержали оппозицию в Коста-Рике во время короткой гражданской войны 1948 года, что привело к свержению правительства Кальдерона [49, 50].",
  },
  {
    country: "Albania",
    type: "Covert Operations",
    outcome: "Failure",
    summary:
      "США и Великобритания предприняли неудачные попытки проникновения в Албанию антикоммунистических элементов после Второй мировой войны [50, 51].",
  },
  {
    country: "Syria",
    type: "Support for Coup",
    outcome: "Mixed",
    summary:
      "США подозреваются в причастности к государственному перевороту в Сирии в 1949 году, в результате которого к власти пришел Хусни аз-Заим, одобривший строительство американского нефтепровода [50].",
  },
  {
    country: "China",
    type: "Covert Support for Kuomintang",
    outcome: "Failure",
    summary:
      "После Гражданской войны в Китае ЦРУ поддерживало вторжения гоминьдановцев в Западный Китай из Бирмы [52, 53].",
  },
  {
    country: "Burma",
    type: "Covert Support for Kuomintang",
    outcome: "Failure",
    summary:
      "ЦРУ использовало территорию Бирмы для поддержки операций гоминьдановцев против коммунистического Китая [52, 53].",
  },
  {
    country: "Egypt",
    type: "Influence and Potential Support for Coup",
    outcome: "Success",
    summary:
      "США поддерживали усилия по реформированию египетского правительства при Фаруке I и, возможно, имели контакты с «Свободными офицерами», совершившими переворот в 1952 году [53].",
  },
  {
    country: "Guatemala",
    type: "Aborted Coup Plot",
    outcome: "Failure",
    summary:
      "В 1952 году США планировали операцию «PBFortune» по свержению президента Хакобо Арбенса, но она была отменена [20, 54].",
  },
  {
    country: "Guatemala",
    type: "Coup d'état",
    outcome: "Success",
    summary:
      "В 1954 году ЦРУ осуществило операцию «PBSUCCESS», свергнув президента Хакобо Арбенса и установив военный режим Карлоса Кастильо Армаса [19, 20].",
  },
  {
    country: "Syria",
    type: "Failed Coup Plots",
    outcome: "Failure",
    summary:
      "В 1956 и 1957 годах ЦРУ планировало несколько государственных переворотов в Сирии, которые не были реализованы [55-57].",
  },
  {
    country: "Indonesia",
    type: "Support for Rebellion",
    outcome: "Failure",
    summary:
      "США поддерживали неудачное восстание «Перместа» в Индонезии в 1958 году, включая воздушные бомбардировки [57].",
  },
  {
    country: "Iraq",
    type: "Consideration of Regime Change",
    outcome: "None",
    summary:
      "В 1959 году США рассматривали различные планы по предотвращению коммунистического влияния в Ираке и свержению режима Касема, включая сотрудничество с Египтом [58-61].",
  },
  {
    country: "South Vietnam",
    type: "Support Against Insurgency and Regime Change",
    outcome: "Mixed",
    summary:
      "США поддерживали Южный Вьетнам против коммунистической insurgency и в 1963 году были вовлечены в свержение президента Нго Динь Зьема [21, 23, 62, 63].",
  },
  {
    country: "Cuba",
    type: "Invasion Attempt and Destabilization",
    outcome: "Failure",
    summary:
      "В 1961 году США организовали вторжение в заливе Свиней с целью свержения Фиделя Кастро, которое потерпело неудачу. Также проводилась операция «Мангуст» по дестабилизации правительства Кубы [23].",
  },
  {
    country: "Cambodia",
    type: "Failed Coup Plot and Potential Involvement in Bombing",
    outcome: "Failure",
    summary:
      "В 1959 году США, Южный Вьетнам и Таиланд были причастны к неудавшемуся заговору с целью свержения Нородома Сианука. Также существуют подозрения в причастности США к взрыву бомбы в королевском дворце [64].",
  },
  {
    country: "Congo-Leopoldville (Democratic Republic of the Congo)",
    type: "Intervention and Support for Regime Change",
    outcome: "Mixed",
    summary:
      "США были обеспокоены приходом к власти Патриса Лумумбы и поддерживали его свержение и последующее финансирование Мобуту Сесе Секо [65-67].",
  },
  {
    country: "Laos",
    type: "Covert Operations and Support for Counter-Coup",
    outcome: "Mixed",
    summary:
      "В 1960 году США поддерживали контрпереворот против нейтралистского правительства в Лаосе [67].",
  },
  {
    country: "Dominican Republic",
    type: "Support for Assassination and Regime Change",
    outcome: "Success",
    summary:
      "В 1961 году ЦРУ предоставило оружие для убийства Рафаэля Трухильо. США считали это успешным шагом к демократии [68].",
  },
  {
    country: "Iraq",
    type: "Potential Support for Coup",
    outcome: "Success",
    summary:
      "Существуют подозрения в причастности ЦРУ к государственному перевороту 8 февраля 1963 года, свергнувшему Абдель Керима Касема [69-72].",
  },
  {
    country: "British Guiana (Guyana)",
    type: "Covert Operations",
    outcome: "Mixed",
    summary:
      "ЦРУ проводило тайную политическую кампанию против левого премьер-министра Чедди Джагана, поддерживая забастовки и оппозиционные партии [25, 73].",
  },
  {
    country: "Brazil",
    type: "Support for Coup d'état",
    outcome: "Success",
    summary:
      "США поддержали военный переворот 1964 года в Бразилии, свергнувший президента Жуана Гуларта и установивший военную диктатуру [25, 74].",
  },
  {
    country: "Indonesia",
    type: "Facilitation and Encouragement of Mass Killings and Regime Change",
    outcome: "Success",
    summary:
      "США знали о массовых убийствах коммунистов в Индонезии в 1965-1966 годах, поощряли действия военных и способствовали приходу к власти Сухарто [24-26].",
  },
  {
    country: "Cambodia",
    type: "Potential Involvement in Coup and Bombing",
    outcome: "Mixed",
    summary:
      "Существуют разногласия относительно степени участия США в свержении Нородома Сианука в 1970 году и последующих бомбардировках страны [75-78].",
  },
  {
    country: "Chile",
    type: "Covert Operations and Support for Coup d'état",
    outcome: "Success",
    summary:
      "С 1963 по 1973 год США проводили тайные операции против Сальвадора Альенде и поддерживали военный переворот 1973 года, приведший к власти Аугусто Пиночета [79-81].",
  },
  {
    country: "Bolivia",
    type: "Support for Coup d'état",
    outcome: "Success",
    summary:
      "США поддержали военный переворот 1971 года, свергнувший президента Хуана Хосе Торреса [82].",
  },
  {
    country: "Ethiopian Empire",
    type: "Support for Rebels after Coup",
    outcome: "Success",
    summary:
      "После свержения императора Хайле Селассие I в 1974 году США поддерживали различные повстанческие группировки против марксистского режима Дерга [82, 83].",
  },
  {
    country: "Angola",
    type: "Covert Support for Anti-Communist Forces",
    outcome: "Failure",
    summary:
      "С 1975 по 1991 год США тайно поддерживали УНИТА и ФНЛА против левого правительства МПЛА в Ангольской гражданской войне [84-88].",
  },
  {
    country: "East Timor",
    type: "Tacit Approval of Invasion",
    outcome: "Failure",
    summary:
      "США предоставили Индонезии решающую поддержку в ходе вторжения и оккупации Восточного Тимора в 1975 году [89, 90].",
  },
  {
    country: "Argentina",
    type: "Endorsement and Support for Coup d'état",
    outcome: "Success",
    summary:
      "США поддержали военный переворот 1976 года в Аргентине, свергнувший президента Исабель Перон и установивший военную диктатуру [91, 92].",
  },
  {
    country: "Afghanistan",
    type: "Covert Support for Mujahideen",
    outcome: "Success",
    summary:
      "С 1979 по 1992 год США тайно финансировали и вооружали афганских моджахедов для борьбы против советского вторжения и поддерживаемого СССР правительства [91-93].",
  },
  {
    country: "Poland",
    type: "Support for Solidarity",
    outcome: "Success",
    summary:
      "В 1980-х годах США поддерживали профсоюз «Солидарность» в Польше в его противостоянии коммунистическому режиму [94-96].",
  },
  {
    country: "Chad",
    type: "Covert Support for Rebellion and Government",
    outcome: "Success",
    summary:
      "В 1981-1982 годах США тайно поддерживали Хиссене Хабре в его борьбе за власть в Чаде, а затем и его правительство [96-98].",
  },
  {
    country: "Nicaragua",
    type: "Covert Support for Contras",
    outcome: "Mixed",
    summary:
      "С 1981 по 1990 год США вооружали, обучали и финансировали «контрас» для свержения сандинистского правительства в Никарагуа [98-101].",
  },
  {
    country: "Grenada",
    type: "Invasion",
    outcome: "Success",
    summary:
      "В 1983 году США вторглись в Гренаду и свергли марксистское правительство Хадсона Остина [102].",
  },
  {
    country: "Panama",
    type: "Invasion",
    outcome: "Success",
    summary:
      "В 1989 году США вторглись в Панаму, свергли диктатора Мануэля Норьегу и установили новое правительство [103, 104].",
  },
  {
    country: "Soviet Union",
    type: "Support for Dissident Movements",
    outcome: "Mixed",
    summary:
      "В конце 1980-х годов США через Национальный фонд в поддержку демократии (NED) поддерживали националистические и демократические движения в различных республиках Советского Союза [29, 30, 104].",
  },
  {
    country: "Iraq",
    type: "Encouragement of Uprising and Covert Operations",
    outcome: "Failure",
    summary:
      "После войны в Персидском заливе в 1991 году США призывали к восстанию против Саддама Хусейна и осуществляли тайные операции с целью его свержения [105-108].",
  },
  {
    country: "Haiti",
    type: "Support for Coup Regime (initially) and then Reinstatement of President",
    outcome: "Mixed",
    summary:
      "После военного переворота 1991 года США первоначально поддерживали новую власть, но затем, после смены администрации, способствовали возвращению к власти свергнутого президента Аристида в 1994 году [108-110].",
  },
  {
    country: "Zaire",
    type: "Reduced Support and Potential Support for Opposition",
    outcome: "Success",
    summary:
      "В 1990-х годах США снизили поддержку Мобуту Сесе Секо в Заире и, возможно, поддерживали оппозиционные силы, что привело к его свержению [111, 112].",
  },
  {
    country: "FR Yugoslavia",
    type: "Support for Opposition",
    outcome: "Success",
    summary:
      "На выборах 2000 года США активно поддерживали оппозиционные группы в Югославии, что способствовало свержению Слободана Милошевича [110].",
  },
  {
    country: "Venezuela",
    type: "Allegations of Support for Coup Attempt",
    outcome: "Failure",
    summary:
      "Президент Чавес обвинял США в причастности к попытке государственного переворота в 2002 году, хотя США отрицали свою прямую роль [35, 113-115].",
  },
  {
    country: "Haiti",
    type: "Allegations of Orchestrating President's Resignation",
    outcome: "Success",
    summary:
      "В 2004 году президент Аристид был вынужден уйти в отставку, и он сам, а также некоторые официальные лица, обвиняли в этом Францию и США [116, 117].",
  },
  {
    country: "Kyrgyzstan",
    type: "Support for Opposition Protests",
    outcome: "Success",
    summary:
      "В 2005 году США оказывали помощь оппозиционным протестующим в Кыргызстане, что привело к свержению правительства Акаева [117].",
  },
  {
    country: "Palestine",
    type: "Support for Fatah Against Hamas Government",
    outcome: "Mixed",
    summary:
      "В 2006-2007 годах США поддерживали ФАТХ в его противостоянии правительству ХАМАС, победившему на выборах [118, 119].",
  },
  {
    country: "Syria",
    type: "Support for Opposition Groups",
    outcome: "Success",
    summary:
      "С 2005 года США поддерживали различные оппозиционные группы в Сирии, направленные против правительства Башара Асада [120-122].",
  },
  {
    country: "Libya",
    type: "Military Intervention",
    outcome: "Success",
    summary:
      "В 2011 году США участвовали в военной интервенции в Ливии, которая привела к свержению и гибели Муаммара Каддафи [123].",
  },
  {
    country: "Bolivia",
    type: "Allegations of Support for Coup",
    outcome: "Success",
    summary:
      "После переворота в Боливии в 2019 году появились обвинения в том, что США поддержали свержение Эво Моралеса [124].",
  },
  {
    country: "Venezuela",
    type: "Political Pressure and Recognition of Opposition Leader",
    outcome: "Failure",
    summary:
      "Администрация Трампа пыталась сместить Николаса Мадуро с поста президента Венесуэлы, оказывая дипломатическое и экономическое давление и признав Хуана Гуайдо временным президентом [124].",
  },
];

export default function USInfiltrationMap() {
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }, []);

  const getColor = (outcome: CountryData["outcome"]) => {
    const outcomeColors = {
      Success: [0, 255, 0],
      Mixed: [0, 255, 255],
      Failure: [255, 0, 0],
    };
    return outcomeColors[outcome];
  };

  const layer =
    geoJson &&
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geoJson,
      filled: true,
      stroked: true,
      getFillColor: (d: any) => {
        const match = infiltrationData.find(
          (c) => c.country.toLowerCase() === d.properties.name.toLowerCase()
        );
        if (match) {
          return [...getColor(match.outcome), 200];
        }
        return [200, 200, 200, 50];
      },
      getLineColor: [80, 80, 80, 200],
      pickable: true,
      autoHighlight: true,
      onHover: ({ object, x, y }: any) => {
        const country =
          object &&
          infiltrationData.find(
            (c) =>
              c.country.toLowerCase() === object.properties.name.toLowerCase()
          );
        const tooltip = document.getElementById("tooltip");
        if (tooltip && country) {
          tooltip.style.top = `${y}px`;
          tooltip.style.left = `${x}px`;
          tooltip.innerHTML = `<strong>${country.country}</strong><br>${country.summary}<br><strong>${country.outcome}</strong>`;
          tooltip.style.display = "block";
        } else if (tooltip) {
          tooltip.style.display = "none";
        }
      },
    });

  return (
    <div style={{ position: "relative", height: "100lvh", width: "100lvw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      />
      <div
        id="tooltip"
        style={{
          position: "absolute",
          // background: "white",
          padding: "5px",
          display: "none",
          pointerEvents: "none",
          zIndex: 9,
        }}
      />
    </div>
  );
}
