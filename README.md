# utilisé pour généré l'IHM du FHSONIC:

Permet de générer à partir d'un fichier statique les différents éléments qui rempliront la page. C'est utilisé avec le module `Grid` qui  permettra, de placer les éléments dans la page.

## utilisation:

```javascript
{
	// tout cequi est ici, n'est pas utilisé par le module...
	// seul le dataset est necessaire
	dataset:[
		{/*...*/}, // item 1
		{/*...*/}, // item 2
		{/*...*/}, // item 3
		{/*...*/}  // item 4
	]
}
```

les datasets se présentent comme suis :

```javascript
{
	class:"items", // classe parent à tous ce qui va suivre
	data:[ // description de ce qui devra être créé
		{/*...*/}, // element 1 de l'item X
		{/*...*/}, // element 2 de l'item X
		{/*...*/}  // element 3 de l'item X
	]
},
```

les enflements se présentent différemment selon leur type. à l'heure actuelle :

### title:
#### minimum:
```javascript
{
	type:"title",
	text:"Mon Titre"
}
```

```javascript
{
	type:"title",
	text:"Mon Titre",
	style:"/* std css */"
}
```

Créait un élément titre, avec le texte passé en paramètre.

### base:
```javascript
{
	type:"type",
	style:"/* std css */",
	id:"element id"
}
```
Ces paramètres sont disponibles sur chacun des éléments suivant.

### text:
```javascript
{
	type:"text",
	text:"un texte comme un autre"
}
```

```javascript
{
	type:"text",
	text:"un texte comme un autre",
	style:"/* std css */"
}
```

Créait un element text, avec le texte passé en paramètre.

### img:
```javascript
{
	type:"img",
	src:"imgs/fhuf_large.png"
}
```

Créait une image qui sera automatiquement chargé, avec la source passé en paramètre.

### title_id:
```javascript
{
	type:"titile_id",
	text_id:"id du titre",
	prefix:"prefix"
}
```

Utilisé avec la lib de gestion des langues permet de créer un titre avec sa traduction qui changera automatiquement en fonction de la langue demandée.

### text_id:
```javascript
{
	type:"text_id",
	text_id:"id du text",
	prefix:"prefix"
}
```

Utilisé avec la lib de gestion des langues permet de créer un titre avec sa traduction qui changera automatiquement en fonction de la langue demandée.

### map:
#### minimum:
```javascript
{
	type:"map",
	view:{
		a:0.627924,
		b:48.176467,
		c:0.630799,
		d:48.174582
	}
}
```
#### options:
```javascript
{
	type:"map",
	view:{ /*...*/},
	gps:[
		{
			a:48.175495,
			b:0.628918
		}
	]
}
```

Créait une `iframe` vers [open street map](https://www.openstreetmap.org/#map=6/46.449/2.210) pour afficher une carte et un pointeur GPS si besoin.

### io:
#### minimum:
```javascript
{
	type:"io",
	channel:"WEBSOCKET CHANNEL"
}
```
#### options:
```javascript
{
	type:"io",
	channel:"WEBSOCKET CHANNEL",
	label:"",
	labelId:"", // cf texte ID
	prefix:"prefix",
	default:"...",
	periode:0, // temps de rafraichissement
	valueType:1, // nombre / "flow" / "volume" / "temp" / date / dateMs
	unit:"%"
}
```

Créait un champ de texte qui sera mis à jour à partir des données envoyés par le socket défini par le Channel.

Pour que les types de données "flow" / "volume" / "temp", le module unitManager est utilisé pour les conversions. Il faut qu'une variable "unit" globale exite :
```javascript
let unit = {
	volume:"m3", // unité de volument
	flow_v:"m3", // unité de volumet pour le débit
	flow_t:"s", // unité de temps pour le débit
	temperature:"C" // unitée de temperature
}
````

`unit` peut etre defini a `false` pour les données de type : `flow` / `volume` / `temp`, cela permat de ne pas afficher l'unitée.

### bin:
```javascript
{
	type:"bin",
	channel:"WEBSOCKET CHANNEL",
	text:"texte affiché",
	periode:0,
	mask: 0x01, // masque a appliquer sur la donnée
	revert: false // inversion ou non de la donnée
}
```

Créait un texte qui sera colorisé en rouge / vert selon la donnée sur le channel, 0 : rouge, 1 : vert

#### Note :
Attention, le texte n'est pas directement colorisé en rouge ou vert, c'est une variable qui est mise à jour. Il faut donc affecté cette variable au texte ou à un autre élément.

```
--status-color
```

pour changer la coueur du texte
```CSS
.status {
  color: var(--status-color);
}
```

ou encore pour afficher un point devant le texte qui lui seul changera de couleur, effet led.
```CSS
.status::before {
  color: var(--status-color);
  content: "● ";
  font-size: 1em;
}
```

### multi:
```javascript
{
	type:"bin",
	channel:"WEBSOCKET CHANNEL",
	text:"texte affiché",
	periode:0, // temps de rafraichissement
	threshold:[],
	color:[]
}
```

Créait un texte qui sera colorisé en fonction de la donnée sur le channel ainsi que du couple seuil/couleur passé en paramètres.

#### Exemple:
```javascript
{
	//...
	threshold:[ 1, 2.6, 312 ],
	color:[ "green", "blue", "rgba(128,128,128,0.5)", "#ff0" ]
}
````
```
value  <= 1 : color == green
1 < value  <= 2.5 : color == "blue"
2.5 < value  <= 312 : color == "rgba(128,128,128,0.5)"
312 < value : color == "#ff0"
```

#### Note :
Attention, le texte n'est pas directement colorisé selon les seuils définis, c'est une variable qui est mise à jour. Il faut donc affecté cette variable au texte ou à un autre élément.

```
--status-color
```

pour changer la couleur du texte
```CSS
.status {
  color: var(--status-color);
}
```

ou encore pour afficher un point devant le texte qui lui seul changera de couleur, effet led.
```CSS
.status::before {
  color: var(--status-color);
  content: "● ";
  font-size: 1em;
}
```

### gauge:
#### minimum:
```javascript
{
	type:"gauge",
	channel:"WEBSOCKET CHANNEL",
	periode:0, // temps de rafraichissement
	min:0,
	max:23
}
```

Créait un un compteur avec une aiguille qui va varier en fonction de la donnée envoyée.

#### options:
```javascript
{
	type:"gauge",
	channel:"WEBSOCKET CHANNEL",
	periode:0, // temps de rafraichissement
	min:0,
	max:23,
	default:1500,
	options:{
		lineWidth: 0.2,
		staticZones: [
			{
				strokeStyle: "red",
				min: 1350,
				max: 1550
			},
		]
	}
}
```

Cf https://bernii.github.io/gauge.js/ pour toutes les possibilités.

### table:
```javascript
{
	type:"table",
	dataset:[
			[
				{/*...*/}  // element 1 de la ligne 1
				{/*...*/}  // element 2 de la ligne 1
				{/*...*/}  // element 3 de la ligne 1
			],
			[
				{/*...*/}  // element 1 de la ligne 2
				{/*...*/}  // element 2 de la ligne 2
				{/*...*/}  // element 3 de la ligne 2
			]
		]
}
```

Créait un tableau pouvant contenir tout les types d'entrée (si elles ont la place de s'afficher).

### dinTable:
```javascript
{
	type:"dinTable",
	channel:"WEBSOCKET CHANNEL"
}
```

Créait un tableau pouvant contenir un nombre variable de lignes et colonnes.
L'entête peut contenir des entrées de n'importe que type.

```javascript
{
	type:"dinTable",
	channel:"WEBSOCKET CHANNEL",
	periode:0,
	head:[
		{/*...*/}  // element 1 de la ligne 1
		{/*...*/}  // element 2 de la ligne 1
		{/*...*/}  // element 3 de la ligne 1
	]
}
```

Le corp peut contenir un nombre variable de ligne est colone généré à la volé en fonction des données reçues.

les données sont au format suivant :
```javascript
{
	value:[
		[], // represente une ligne (sans donnée pour cet exemple)
		[
			{ // represente une colone avec style CSS
				value:"...",
				style:"..."
			},
			"..." // represente une colone de texte pur a afficher.
		],
	]
}
```
Pour mette a jour l'ensemblre des données, utilisez le forma précedente, pour une partie des données :
```javascript
{
	update:[
		{
			id:0, // id de la ligne qui doit etre mise a jour
			value:[
				{ // represente une colone avec style CSS
					value:"...",
					style:"..."
				},
				"..." // represente une colone de texte pur a afficher.
			]
		}
	]
}
```


### log:
```javascript
{
	type:"log",
	channel:"WEBSOCKET CHANNEL"
}
````

Créait une zone de log qui affichera les données envoyées par le serveur

### svg:
```javascript
{
	type:"svg",
	src:"imgs/img.svg", // le svg lui même
	backImg:"imgs/img.png", // arrière plan si besoin
	data:[
		{
			id:"id_Path1",
			type:"bin",
			channel:"WEBSOCKET CHANNEL",
			periode:0
		},
		{/*...*/}
	]
}
````

Affiche un svg, et permet la colorisation d'items en fonction d'une donnée

#### SVG:
```xml
<svg xmlns="http://www.w3.org/2000/svg"
    width="180mm"
    viewBox="0 0 1526 807">

  <path id="id_Path1" /*...*/ />
  <path id="id_Path2" /*...*/ />
  <path id="id_Path3" /*...*/ />
</svg>
```

### graph:
Il existe trois types de graphs, signal, sync, async, le signal sert à afficher une courbe complète à chaque donnée. Le signal sync, sert a afficher différentes données avec un même abscisse. Le graph async sert à afficher plusieurs données qui n'ont pas forcement le même abcisse.

#### signal:
```javascript
{
	type:"graph",
	subType:"signal", // sync/signam/async
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL SIGNAL",
			periode:0,
			color:"green"
		}
	]
}
```

#### sync:
```javascript
{
	type:"graph",
	subType:"sync", // sync/signam/async
	channel:"WEBSOCKET CHANNEL X"
	periode:0,
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			color:"green"
		}
	]
}
```

#### async:
```javascript
{
	type:"graph",
	subType:"async", // sync/signam/async
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL XY",
			periode:0,
			color:"green"
		}
	]
}
```

#### options:
les  options sont les même pour tous les graphs :
```javascript
{
	type:"graph",
	subType:"sync", // sync/signam/async
	channel:"WEBSOCKET CHANNEL X",
	xAxisType: "date", // type de donnée sur l'axe X (unituquement date number pour le moment)
	periode:0,
	deep:300, // nombre de point de la courbe en X
	min:-1, // valeur minimum de de l'ordonnée'
	max:1, // valeur maximum de l'ordonnée
	zoom:true, // active le mode zoom
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			deep:300,
			color:"green",
			tension:0.3,
			showLine:true
		}
	],
	debounce:{ // temps minimum entre deux mise a jour des graphiques
		time:1000, // temps en ms
		active:true // actif ou non
	}
}
```

#### données:
Attention les données a transmettre ne sont pas les même en fonction des types de graphs :

- sync :` WEBSOCKET CHANNEL X` et `WEBSOCKET CHANNEL Y` sont de simple données numériques,
- async : `WEBSOCKET CHANNEL XY` est un objet au format : `{x: 2, y: 1.3}`,
- signal : `WEBSOCKET CHANNEL SIGNAL` est un table d'objets : `[{x: 1, y: 1.3},{x: 2, y: 1.6},{x: 3, y: 1.7},...]`


### csv:
L'element CSV n'affiche rien mais permet de créer un objet qui va loguer les donnés puis les mettre a disposition pour le telecahrgement.

```javascript
{
	type:"csv",
	separator:",", // séparateur utilisé pour la génération du CSV
	display:{
		entries:true, // affiche ou non le nombre de lignes du fichier
		clean:true, // affiche un bouton de RAZ du CSV
		last:true // affiche un bouton permettant de limiter le nombre de lignes a générer
		download:false, // cache le bouton le teléchargement
		every:false, // cache le champ de sauvegarde automatique
	},
	prompt: false, // demande le nom du fichier de sortie
	file: undefined, // nom du fichier de sortie
	periode: 0, // période of data transmission
	channel:{
		synchro:"CHANNEL TIME", // channel de synchro (horodatage)
		title:"chrono", // titre de la colone de synchro dans le CSV
		data:["DATA_1","DATA_2"], // channels de donnés
		titles:["TItle 1","Title 1"] // titres des colonnes dans le CSV
	}
}
````
