title: "Jak se volilo ve vašem okrsku? Prohlédněte si nejpodrobnější mapu výsledků druhého kola senátních voleb"
perex: "Detailní mapa volebních výsledků ukazuje něco chytrýho."
authors: ["Jan Cibulka", "Michal Zlatkovský"]
published: "8. října 2018"
coverimg: https://data.irozhlas.cz/obce18-okrsky/media/cover.png
coverimg_note: ""
styles: ["https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.4/ol.css"]
libraries: ["https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js", "https://ft-polyfill-service.herokuapp.com/v2/polyfill.min.js?features=Object.values,String.prototype.startsWith", "https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.4/ol-debug.js"]
options: "" #wide, noheader (+nopic)
---

Plky plky.

<wide>
<div>_Mapa ukazuje <b>volební okrsky</b>, tedy nejmenší možné rozčlenění volebních výsledků. Větší obce se dělí na více okrsků.<br>

<div id="mapdiv">
	<div id="tooltip">Myší vyberte obec.</div>
	<div id="map" class="map"></div>
	 <form action="?" id='frm-geocode'>
	  <label for="inp-geocode">Najít adresu</label>
	  <div class="inputs">
	    <input type="text" id="inp-geocode" placeholder="Bruntál">
	    <input type="submit" value="Najít">
	  </div>
	</form>
</div>
</wide>

Moudra moudra.