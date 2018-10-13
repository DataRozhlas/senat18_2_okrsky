# Generátor obsahu pro snowfall šablonu iROZHLAS.cz

> Já jsem šablona, co generuje střeva pro snowfall články.

## Předpoklady
Je třeba [Python 3](https://www.python.org/downloads/) a nainstalované knihovny (příkazem `pip install markdown jsmin csscompressor pyyaml`)

## Nový článek

Jelikož si každý projekt nese dost "svého" bince, je vhodné pro každý článek založit separátní repozitář. Je tedy nutné si stáhnout (nebo naklonovat) šablonu a nastavit jí gitový *remote* na nový repozitář.

- Naklonujeme repo do nového adresáře

```bash
git clone git@bitbucket.org:samizdatcz/snowfall-builder.git jmeno-projektu
```

- Odstraníme současný remote (vedoucí na šablonu)

```bash
git remote remove origin
```

- Vytvoříme pro projekt nové repo. `smzd create` (viz [Samizdat Bitbucket Manager](https://bitbucket.org/samizdatcz/samizdat-bitbucket-manager/)) sám rovnou nastaví správný nový remote

```bash
smzd create jmeno-projektu
```

- To je celé! Teď už se můžeme vrhnout na psaní článku.

## Psaní článku
Celý neinteraktivní obsah se nastavuje v souboru `article.md`. Skládá se, podobně jako [Jekyll](https://jekyllrb.com/docs/frontmatter/), ze dvou částí: hlavičky a obsahu.

### Hlavička
Hlavička je ukončena třemi spojovníky: `---`, uvnitř se používá YAML. Každá proměnná je na novém řádku, její název je to, co je před dvojtečkou a mezerou a obsah to, co je za ní. Textový obsah (pokud to není pole) se dává do uvozovek. Uvozovky v hlavičce je nejlepší řešit typografickými uvozovkami.

```yaml
title: "Nejrelativnější článek"
---
```

YAML umí i pole, to se používá u seznamu autorů. To se píše jako ve většině programovacích jazyků

```yaml
authors: ["Jan Boček", "Jiří Hošek", "Jan Cibulka", "Marcel Šulek"]
```

V hlavičce jsou tyto podporované proměnné. Pokud není napsáno jinak, jsou povinné.

- `title` Nadpis článku.
- `perex` Perex.
- `authors` Seznam autorů.
- `published` Datum vydání.
- `coverimg` Odkaz na webově dosažitelný uvodní velkoobrázek. Co největší, při prvním buildu se vygenerují potřebné zmenšeniny.
- `coverimg_note` Popisek k velkoobrázku (s možnou atribucí).
- `libraries` pole požadovaných externích knihoven. Knihovny, které se dají vložit jednoslovně: `jquery`. Jinak je nutné vložit celou URL na knihovnu.
- `styles` pole požadovaných externích stylů, píše se celá URL, např. `styles: [https://js.arcgis.com/3.17/esri/css/esri.css]`. Opět příliš nedoporučuju odkazovat na cizí servery a opět cíl musí být na https.
- **Vlastní JS skripty vkládejte do složky `js`, CSS styly do složky `styles`. Přikompilují se pak automaticky.**
- `options` pro různé přepínače. Oddělují se čárkou a mezerou: `option1, option2, ...` Možnosti: `wide` nastaví široký textový sloupec pro celý článek, `noheader` odstraní gigantickou hlavičku, `noheader, nopic` navíc umožní nemít otevírací obrázek vůbec.

### Obsah
Obsah se píše v [Markdownu](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). Ne všechny prvky jsou nastylovány z výroby, pokud vám nějaký bude scházet, dejte vědět.

Různé interaktivity a obrázky se vkládají přes čisté HTML a s **absolutními cestami k souboru**. 

Můžete využívat také postranní boxíky - vkládají se přes pseudotagy `<left> </left>`, případně `<right> </right>`.

**Pokud používáte defaultní úzký sloupec a chcete, aby byla nějaká vizualizace široká, stačí ji uzavřít do pseudotagů `<wide> </wide>`.**

## Buildování
Celý článek buildnete příkazem
```bash
python builder.py
```

Build vytvoří `output.html`, jehož obsah následně vrazíte do hlavní položky ve snowfall šabloně. Také vytvoří náhledový `index.html` pro kontrolu. Pokud ho kopírujete a zobrazujete z jiné složky, je spolu s ním nutné zkopírovat i složky `fonts` a `wrapper_files`.

Pokud potřebujete nahrát nejrůznější obrázky, vkládejte je do složky media, objeví se na adrese `interaktivni.rozhlas.cz/data/jmeno-projektu/media/SOUBOR`.