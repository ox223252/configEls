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
	type:"title_id",
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
	action: "min", // "min" / "max" / "average" utile uniquement si channel est un tableau (cf section io.action)
	valueType: <Data>, // cf Chapter valueType or :
		// - obj cf section io.obj
	domType: "output", // output/input/select cf section io.input / io.select
	unit: <Data> // cf Chapter valueType
}
```

Créait un champ de texte qui sera mis à jour à partir des données envoyés par le socket défini par le Channel.

Pour que les types de données "flow" / "volume" / "temp", le module unitManager est utilisé pour les conversions. Il faut qu'une variable "unit" globale exite :
```javascript
let unit = {
	volume:"m3", // unité de volume
	flow_v:"m3", // unité de volume pour le débit
	flow_t:"s", // unité de temps pour le débit
	temperature:"C" // unitée de temperature
}
````

`unit` peut être défini a `false` pour les données de type : `flow` / `volume` / `temp`, cela permet de ne pas afficher l’unité.


#### io.action:
dans le cas ou l'on souhaite afficher la valeur la plus petite / grande ou moyenne entre plusieurs entrée, il est possible de definir la config comme suis :

```javascript
{
	type:"io",
	channel: [ "channel_1", "channel_2", ... ],
	action: "min", // min / max / average utile uniquement si channel est un tableau (cf note)
	...
}
```

#### io.obj:
Dans certain cas nous voudrons afficher une donnée formaté a partir d'une structure ou objet. Dans ce cas il faut définir le format de sortie comme suis.

```javascript
{
	type: "io",
	...
	valueType: "obj",
	format: "du_Text_Avant ;label; : ;id;",
}
```

Ici, le format déclare un text `du_Text_Avant ` suivit d'une donnée issue de l'objet `;label;`  puis un text ` : ` puis une nouvelle donnée `;id;`. pour compléter cette string il faudra un objet comme celui-ci :

```javascript
{
	label:"donnée",
	id:6
}
```

Ainsi nous obtenons la chaîne suivante : `du_Text_Avant donnée : 6`

Si vous observez bien les clées de l'objet sont utilisés comme identifiant dans le chaîne `format`, précédé et suivit d'un `;`.

#### io.input:
Il est possible de définir l'io comme une input. auquel cas des données de configuration supplémentaires sont disponibles.

```javascript
{
	type:"io",
	...
	valueType: "input",
	inputConfig:{
		channel:"channelConfig"
		type: "number", // number, string, checkbox
		min: 0, // pour les number
		max: 12, // pour les number
		step: 0.1, // pour les number
		title: "string", 
	}
}
```

### io.select:
Il est possible de definir l'io comme un select, auquel cas des données suprementaires de configuration suplémentaire sont disponiibles.

```javascript
{
	type:"io",
	...
	valueType: "select",
	inputConfig:{
		channel:"channelOptions"
	}
}
```

Ici, le channel de config doit renvoyer soit un tableau de string, soit un tableau d'object contenant `text` qui sera affiché et `value` qui sera renvoyé en cas de modification.

### bin:
```javascript
{
	type:"bin",
	channel:"WEBSOCKET CHANNEL",
	text:"texte affiché",
	periode:0,
	mask: 0x01, // masque a appliquer sur la donnée
	revert: false // inversion ou non de la donnée,
	color:[ // cf colors section
		"--color-inactive",
		"green"
	]
}
```

Créait un texte qui sera colorisé en rouge / vert selon la donnée sur le channel, 0 : rouge, 1 : vert

#### Note :
Attention, le texte n'est pas directement colorisé, c'est une classe qui est ajouté ou non, `active` si `value & mask != 0`.
Dans le cas ou les couleurs sont definie manuellement c'est un variable (`--status-color`) qui est mise à jour. Il faut donc affecter cette variable au texte ou à un autre élément.

Pour exemple le CSS pourrait ressembler à ceci :
```CSS
.items .status {
	--status-color: red;
}

.items .status.active {
	--status-color: green;
}
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
  content: "●";
  font-size: 1em;
}
```

### multi:
```javascript
{
	type:"multi",
	channel:"WEBSOCKET CHANNEL",
	text:"texte affiché",
	periode:0, // temps de rafraichissement
	color:[],
	defaultColor: "red"
}
```

Créait un texte qui sera colorisé en fonction de la donnée sur le channel ainsi que du couple seuil/couleur passé en paramètres. Si le texte n'est pas defini, la donnée sera affichée.

#### Exemple:
```javascript
{
	//...
	color:[ "green", 1 , "blue", 2.5 ]
}
```
```
value  <= 1 : color == green
1 < value  <= 2.5 : color == "blue"
2.5 > couleur par defaut
```
Voir la section sur le management des couleurs.

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
	options: {
		values:[ 0, 100 ]
	}
}
```

Créait un un compteur avec une aiguille qui va varier en fonction de la donnée envoyée.

#### options:
```javascript
{
	type:"gauge",
	channel:"WEBSOCKET CHANNEL",
	periode:0, // temps de rafraichissement
	valueType: <Data>, // cf Chapter valueType
	unit: <Data>, // cf Chapter valueTypet
	options:{
		values: [ ],
		curve: {
			min: 0, // angle start (left)
			max: 180, // angle stop (right)
			size: 300, // graph width (px)
			width: 30, // line width (px)
			label: {
				height: 20, // text height (px)
			},
			backColor: "transparent", // line color in case of no color provided in values
			textColor: "black", // text color
		},
		coef: 1, // coefficeint need to be applied on gauge label value
		errorColor: "red", // Out Of Limit error color 
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

Le corps peut contenir un nombre variable de ligne est colonne généré à la volé en fonction des données reçues.

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
Pour mette a jour l’ensemble des données, utilisez le forma précédente, pour une partie des données :
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
			periode:0,
			revert: false, // complement a 1 sur la donnée
			mask: 0x01 // masque sur la donnée pour savori quel bits observer
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

#### options:

```javascript
{
	type:"svg",
	/* ... */
	colors:{ // applicable à toutes les entrées de type bin en même temps
		undefined: "grey", // si la valeur n'est pas un nombre ou pas definie
		false: "red", // si la valeur masqué est 0
		true: "green", // si la valeur masqué est deferente de 0
	},
	data:[
		{
			id:"id_Path1",
			type:"bin",
			/* ... */
			onclik:
			{ // send over socket 'userCmd'
				cmd:"********", // cmd param
				toogle: false, // for bin only onclick toogle value of input and esend it 
				arg:{ // reserved
					value:undefined
				}
			},
			colors:
			{ // applicable que pour une entrée bin
				undefined: "grey", // si la valeur n'est pas un nombre ou pas definie
				false: "red", // si la valeur masqué est 0
				true: "green" // si la valeur masqué est deferente de 0
			},
		},
		{/*...*/}
	]
}
````

permet l'utilisation du SVG comme zone de click et de definir les valeurs de couleurs pour l'etat bin ( undefined / flase / true )

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
	coef:1, // dans le cas ou le X doit etre modifié
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			color:"green",
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
	textColor:"black", // color of graph's text (cf Colors section)
	gridColor:"rgba(128,128,128,0.4)", // color of grid (cf Colors section)
	coef: 1, // coeficient multiplicateur pour la donnée en X
	xAxisType: "date", // type de donnée sur l'axe X (unituquement date number pour le moment)
	periode:0,
	deep:300, // nombre de point de la courbe en X
	min:-1, // valeur minimum de de l'ordonnée'
	max:1, // valeur maximum de l'ordonnée
	zoom:true, // active le mode zoom
	zooOverView: true, // active ou desactive le graph de zoom du bas
	unit: false, // need to set to true if units are needed for at least one curve
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			deep:300,
			color:"green",
			tension:0.3,
			showLine:true,
			coef: 1, // coeficient multiplicateur pour la donnée en Y
			valueType: <Data>, // cf Chapter valueType
			unit: <Data> // cf Chapter valueType
		}
	],
	debounce:{ // temps minimum entre deux mise a jour des graphiques
		time:1000, // temps en ms
		active:true // actif ou non
	},
	csv:{
		exportable: false, // defini si le CSVpeut etre exporté
		export: "event", // definie la façon d'ont l'esport est declencé (actuellement que le mode event)
		eventSrc: "exportToCSV", // l'eventment qu'il faut rechercher
		eventTarget: "exportToCSV", // sur quel objet il faut chercher l'eventement
		prompt: false, // demande à l'utilisateur le nom du fichier de sortie
		file: undefined, // le ficher de sortie
		separator: ";", // le separateur CSV
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
	title:'Download CSV',
	prompt: true, // demande le nom du fichier de sortie
	file: undefined, // nom du fichier de sortie
	periode: 0, // période of data transmission
	max:{ // pour eviter l'augmentation infinie de la taille du CSV
		size: 1000000, /// taille maximun du CSV en octet si le champ de telechargement recurent n'est pas configuré
		time: undefined, // temps maximum d'enregistrement (h)
		line: undefined,
	},
	channel:{
		synchro:"CHANNEL TIME", // channel de synchro (horodatage)
		title:"chrono", // titre de la colone de synchro dans le CSV
		data:["DATA_1","DATA_2"], // channels de donnés
		titles:["TItle 1","Title 1"] // titres des colonnes dans le CSV
	}
}
````


### button:
Element qui genère un bouton qui peut au choix, envoyer une commande, ou emetre un evenement global pour la page.
```javascript
{
	type:"button",

		type: "button",
		options:[
			{
				label: "X", // text avant le bouton
				text: "Y", // text dans le bouton
				cmd: "myCmd", // la commande renvoyé au serveur
				eventTarget: undefined, // sur quel objet il faut chercher l'eventement
				eventSrc: undefined, // l'eventment qu'il faut rechercher
			}
		]
}
```

si `cmd` n'est pas defini seul l'eventment de page sera fonctionnel et inversement.


## Shared configs:
```javascript
{
	...,
	valueType: <Data>,
	unit: <Data>,
	color: <Data>,
	textColor: <Data>
}
````

### valueType:
value type permet de déterminer comment doit être interpréter la donnée et peut être couplé à l'objet `unit`, ainsi les valeurs disponibles sont :
- <Number> : un nombre, pour avoir un nombre de digit fixe,
- temp : température,
- volume : volume,
- flow : débit
- date : date en secondes
- dateMs : date en millisecondes

// nombre / "flow" / "volume" / "temp" / date / dateMs

### unit :
```javascript
{
	...,
	valueType: 1,
	unit: "%"
}
```

```javascript
{
	...,
	valueType: "temp",
	unit: {
		temperature: "C" || "K" || "F"
	}
}
```

```javascript
{
	...,
	valueType: "volume",
	unit: {
		volume: "b" || "g" || "l" || "m3"
	}
}
```

```javascript
{
	...,
	valueType: "flow",
	unit: {
		flow_v: "b" || "g" || "l" || "m3",
		flow_t: "s" || "m" || "h" || "d"
	}
}
```

```javascript
{
	...,
	valueType: "date" || "dateMs",
}
```

### Validité:
tous les objets n'ont pas accès à tous les types de valeurs.

### Colors:
Colors values can be `red / blue / gren...`, `rgb`, `rgba`, `#fff` or CSS var like `--color-1`, if the color is defined for the body element like :

```CSS
:root {
	--color-1: rgb( 128, 128, 128 );
}
```