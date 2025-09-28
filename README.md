# Eesti Kaartirakendus

Täisfunktsionaalne kaartirakendus Eesti huvitavate kohtade hallamiseks ja jälgimiseks.

## Funktsioonid

### 🗺️ Kaart
- **Leaflet kaart** OpenStreetMap andmetega
- **Eesti keskpunkt** vaikimisi vaates
- **Responsiivne disain** kõikidele seadmetele

### 📍 Punktide haldamine
- **6 kategooriat**: Mõisad, Arhitektuur, Ujumiskohad, Söögikohad, Muuseumid, Monumendid
- **3 külastamise staatus**:
  - 🔴 Punane - pole veel külastatud
  - 🟡 Kollane - on külastatud aga vajab veel külastamist  
  - 🟢 Roheline - külastatud
- **Unikaalsed ikoonid** iga kategooria jaoks
- **Klikkimine** punkti detailide vaatamiseks

### 🔍 Filtreerimine
- **Kategooria filter** - vali milliseid kohti näidata
- **Staatus filter** - vali milliseid külastamise staatusi näidata
- **Reaalajas filtreerimine** ilma lehte laadimata

### ✏️ Punktide redigeerimine
- **Lisa uusi punkte** kaardil klikkides või koordinaate sisestades
- **Muuda olemasolevaid punkte** - nimi, kategooria, kirjeldus, staatus
- **Kustuta punkte** kinnituse küsimisega
- **Koordinaatide automaatne täitmine** kaardil klikkides

### 📝 Postituste süsteem
- **Lisa postitusi** iga punkti kohta
- **Kuupäevade jälgimine** postituste jaoks
- **Postituste vaatamine** punkti detailides
- **Tulevikuks valmis** piltide ja linkide lisamiseks

### 💾 Andmete salvestamine
- **localStorage** - andmed salvestatakse brauseris
- **Automaatne salvestamine** iga muudatuse järel
- **Andmete taastamine** lehe uuesti laadimisel

## Kasutamine

### Alustamine
1. Ava `index.html` brauseris
2. Kaart avaneb Eesti vaates
3. Näidisandmed on juba laetud

### Uue punkti lisamine
1. Klõpsa "Lisa uus punkt" nuppu
2. Täida vormi väljad
3. Klõpsa kaardil, et määrata koordinaadid
4. Klõpsa "Salvesta"

### Punkti muutmine
1. Klõpsa punkti kaardil
2. Klõpsa "Muuda" nuppu
3. Tee vajalikud muudatused
4. Klõpsa "Salvesta"

### Filtreerimine
- Kasuta külgmenüü filtreid
- Vali soovitud kategooriad ja staatused
- Kaart uuendub automaatselt

### Postituste lisamine
1. Klõpsa punkti kaardil
2. Klõpsa "Lisa postitus" nuppu
3. Sisesta postituse sisu
4. Postitus salvestatakse automaatselt

## Tehnilised detailid

### Kasutatud tehnoloogiad
- **HTML5** - struktuur
- **CSS3** - stiilid ja animatsioonid
- **JavaScript (ES6+)** - funktsionaalsus
- **Leaflet.js** - kaartirakendus
- **Font Awesome** - ikoonid
- **OpenStreetMap** - kaardid

### Brauseri tugi
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Andmestruktuur
```javascript
{
  id: number,
  name: string,
  category: 'mansion' | 'architecture' | 'swimming' | 'restaurant' | 'museum' | 'monument',
  description: string,
  lat: number,
  lng: number,
  status: 'not-visited' | 'visited-partial' | 'visited',
  posts: Array<{
    id: number,
    content: string,
    date: string,
    images: Array<string>
  }>
}
```

## Tuleviku arendused

- 📸 Piltide üleslaadimine postitustesse
- 🔗 Linkide lisamine postitustesse
- 📊 Statistika ja aruanded
- 🌐 Andmete eksport/import
- 📱 PWA tugi
- 👥 Mitme kasutaja tugi

## Litsents

MIT License - vaba kasutamine ja modifitseerimine.


