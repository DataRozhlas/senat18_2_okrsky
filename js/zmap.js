var hst = 'https://data.irozhlas.cz/senat18_2_okrsky/';
if (window.location.hostname == 'localhost') {
  hst = './scratch/'
};

var isFirefox = typeof InstallTrigger !== 'undefined';
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;

var partyNames = {
  166: 'STAN',
  768: 'ANO 2011',
  1187: 'SENÁTOR 21',
  53: 'ODS',
  7: 'ČSSD',
  80: 'Nezávislý',
  596: 'SPOJENI DŮVĚROU',
  1426: 'Piráti s LES',
  720: 'Piráti',
  659: 'TOP 09 a STAN',
  1408: '',
  1194: '',
  1: 'KDU-ČSL',
  1306: 'ODS, STAN a STO',
  1321: 'Mikuláš Bek (ODS + ST)',
  594: 'KDU-ČSL a NV',
  1329: 'Společně pro Opavsko',
  755: 'Ostravak',
  47: 'KSČM',
  716: 'Soukromníci'
}

var partyCols = {
  166: 'darkgray',
  768: '#cab2d6',
  53: '#1f78b4',
  7: '#ff7f00',
  720: 'black',
  1: '#fdbf6f',
  47: '#e31a1c',
};

function getColor(props) {
  var kands = JSON.parse(props.result.replace(/\'/g, '"')).sort(function(a, b){
    return b.hlasy - a.hlasy
  });
  var col = '#006d2c';

  try {
    var party = kandidati[props.CIS_OBVOD + '_' + kands[0].id].VSTRANA;
    if (party in partyCols) {
      col = partyCols[party];
    }
  } catch {}
 
  var style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "lightgray",
      width: 0.3
    }),
    fill: new ol.style.Fill({
      color: col
    })
  })
  return style;
};

function makeTooltip(evt) {
  var kands = JSON.parse(evt.result.replace(/\'/g, '"')).sort(function(a, b){
    return b.hlasy - a.hlasy
  });
  var kand1 = null;
  var kand2 = null;
  
  if (kands[0]) {
    kand1 = kandidati[evt.CIS_OBVOD + '_' + kands[0].id]
  };
  if (kands[1]) {
    kand2 = kandidati[evt.CIS_OBVOD + '_' + kands[1].id]
  };
  
  var blabol = '<b>Okrsek č. ' + evt['Cislo'] + ', ' + (evt['Momc'] || evt['Obec']) + '</b>, okres ' + evt['Okres'] + '<br>'

  if (kand1 != null) {
    blabol += '<span style="color: ' + (partyCols[kand1.VSTRANA] || '#006d2c') + '; font-weight: bold;">' + kand1.JMENO + ' ' + kand1.PRIJMENI 
    + ' (' + partyNames[kand1.VSTRANA] + ')</span>, ' + kands[0].hlasy + ' hlasů.<br>'
  };
  if (kand2 != null) {
    blabol += '<span style="color: ' + (partyCols[kand2.VSTRANA] || '#006d2c') + '; font-weight: bold;">' 
    + kand2.JMENO + ' ' + kand2.PRIJMENI + ' (' + partyNames[kand2.VSTRANA] + ')</span>, ' + kands[1].hlasy + ' hlasů.'
  }
  
  blabol += '<br>Účast: ' + Math.round((evt.ODEVZDANE_OBALKY / evt.ZAPSANI_VOLICI) * 1000) / 10 + ' %'
  
  document.getElementById('tooltip').innerHTML = blabol
};

var tilegrid = ol.tilegrid.createXYZ({tileSize: 512, maxZoom: 15});

var background = new ol.layer.Tile({
  source: new ol.source.TileImage({
    url: 'https://interaktivni.rozhlas.cz/tiles/ton_b1/{z}/{x}/{y}.png',
    attributions: [
      new ol.Attribution({ html: 'obrazový podkres <a target="_blank" href="http://stamen.com">Stamen</a>, <a target="_blank" href="https://samizdat.cz">Samizdat</a>, data <a target="_blank" href="https://www.volby.cz">ČSÚ</a> a <a target="_blank" href="http://vdp.cuzk.cz/vdp/ruian/vymennyformatspecialni/vyhledej?vf.cr=U&_vf.vu=on&vf.vu=VOH&_vf.vu=on&search=Vyhledat">ČÚZK</a>'})
    ]
  })
})

var labels = new ol.layer.Tile({
  source: new ol.source.TileImage({
    url: 'https://interaktivni.rozhlas.cz/tiles/ton_l1/{z}/{x}/{y}.png',
    maxZoom: 15
   })
})

function drawMap() {
  $('#map').empty()
  var layer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      format: new ol.format.MVT(),
      tileGrid: tilegrid,
      tilePixelRatio: 8,
      url: hst + 'tiles/{z}/{x}/{y}.pbf'
    }),
    style: function(feature) {
      return getColor(feature.properties_)
    }
  });

  var initZoom;

  if (window.innerWidth < 768) {
    initZoom = 6;
    document.getElementById('tooltip').innerHTML = 'Kliknutím vyberte okrsek.'
  } else {
    initZoom = 7;
  }

  var map = new ol.Map({
    interactions: ol.interaction.defaults({mouseWheelZoom:false}),
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([15.3350758, 49.7417517], 'EPSG:4326', 'EPSG:3857'), //Číhošť
      zoom: initZoom,
      minZoom: 6,
      maxZoom: 15
    })
  });

  map.addLayer(background);
  map.addLayer(layer);
  map.addLayer(labels);

  if (!(isEdge | isFirefox | isIE)) {
    map.on('pointermove', function(evt) {
      if (evt.dragging) {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      if (map.hasFeatureAtPixel(pixel)){
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          makeTooltip(feature.properties_);
        });
      } else {
        document.getElementById('tooltip').innerHTML = 'Myší vyberte okrsek.'
      }
    });
  };

  //mobil
  map.on('singleclick', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    if (map.hasFeatureAtPixel(pixel)){
      map.forEachFeatureAtPixel(pixel, function(feature) {
        makeTooltip(feature.properties_);
      });
    } else {
      document.getElementById('tooltip').innerHTML = 'Kliknutím vyberte okrsek.'
    }
  });

var form = document.getElementById("frm-geocode");
var geocoder = null;
var geocodeMarker = null;
form.onsubmit = function(event) {
  event.preventDefault();
  var text = document.getElementById("inp-geocode").value;
  if (text == '') {
    map.getView().setCenter(ol.proj.transform([15.3350758, 49.7417517], 'EPSG:4326', 'EPSG:3857'))
    map.getView().setZoom(8)
  } else {
    $.get( "https://api.mapy.cz/geocode?query=" + text, function(data) {
      if (typeof $(data).find('item').attr('x') == 'undefined') {
        alert("Bohužel, danou adresu nebylo možné najít");
        return;
      }
      var x = parseFloat($(data).find('item').attr('x'))
      var y = parseFloat($(data).find('item').attr('y'))
      map.getView().setCenter(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857'))
      map.getView().setZoom(12)
    }, 'xml');
  } 
};
};

drawMap();

