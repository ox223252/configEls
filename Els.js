let Els_Debug = console.error

import {colorClicker} from "../colorpicker/color.js"

/// \brief base element for HMI display
class Els_Back {
	static _defaultConfig = {};

	/// \param [ in ] config : object with configuration
	///     { type: <className String>, id: <String>, style: { } }
	/// \param [ ind ] id : new element ID (String)
	constructor ( config, id )
	{
		this.data = [];
		this._callArgs = [];
		this._config = Object.assign ( config, this.defaultConfig );

		this._domEl = document.createElement ( "div" );
		this._domEl.className = config.type;
		this._domEl.style.flexGrow = 1;
		this._domEl.id = config.id || id;

		this._update ( this._config );
	}

	/// \brief need to be surcharged
	/// \note allow user to update part of config to change display
	update ( config )
	{
	}

	/// \brief update style
	/// \aram [ in ] config : object with the input element need to be updated
	_update ( config, domEl = this._domEl )
	{
		if ( !config )
		{
			return;
		}

		try
		{
			// allow all object to have style config (object or string)
			switch ( config?.style?.constructor.name )
			{
				case 'Object':
				{
					Object.assign ( domEl.style, config.style );
					break;
				}
				case 'String':
				{
					domEl.style.cssText = config.style;
					break;
				}
				case undefined:
				{
					break;
				}
				default:
				{
					console.error ( 'Unknown style object prototype' );
					console.log ( config?.style );
					console.log ( config?.style?.constructor.name );
					break;
				}
			}

			switch ( config.classList?.constructor.name )
			{
				case 'Array':
				{
					domEl.classList.add ( ...config.classList )
					break;
				}
				case 'String':
				{
					domEl.classList.add ( config.classList )
					break;
				}
				case undefined:
				{
					break;
				}
				default:
				{
					console.error ( 'Unknown classList object prototype' );
					console.log ( config?.classList );
					console.log ( config?.classList?.constructor.name );
					break;
				}

			}
		}
		catch ( e )
		{
			Els_Debug ( e );
		}
	}

	// return default config for this element
	get defaultConfig ( )
	{
		return this._defaultConfig;
	}

	/// \brief return callbacks
	get callbacks ( )
	{
		return this._callArgs || [];
	}

	/// \brief return the main dom elements of the object
	get dom ( )
	{
		return this._domEl;
	}

	/// \brief return the list of sub elements
	get _els ( )
	{
		return this._elList;
	}

	/// \biref return the config of the object
	get config ( )
	{
		return this._config || {};
	}

	/// \brief need to be surcherged to allow creation of the configs div used to configure new element
	static canCreateNew ( )
	{
		return false;
	}

	/// \brief need to be surcherged to create the configs div used to configure new element
	/// \params [ in ] params : object with the id of the new element
	///     { id : "xxx" }
	/// \params [ in ] config : base config for the new element
	/// \params [ in ] deep : use to know level in call stack, if != 0 then config should be correct
	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( !params.confItem )
		{
			params.confItem = {};
		}

		// if config.channel exit then it's an entry with data from server
		// theses datas need to be configured
		if ( config?.channel )
		{
			params.confItem = Object.assign ({
				channel: {
					fnct: _createInput,
					args: [ "channel", params.channels ],
					value: config?.channel,
				},
				periode: {
					fnct: _createSelectPeriode ,
					args: [],
				}
			},
			params.confItem );
		}

		try
		{
			// obj that display output
			let outDiv = Els_Back._newOut ( params.id, config );

			// obj that contain config flieds
			let configDiv = document.createElement ( "div" );
			
			// object that contain the json config in text mode
			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( config, null, 4 );
			jsonDiv.onchange = (ev)=>{
				// here we parse json text, so we read changes from user input
				Els_Back.newJson ( config, jsonDiv, outDiv, ev.target.value );

				// now for each entry we're updating value followinf json entry
				for ( let key in params.confItem )
				{
					try
					{
						sub[ key ].input.value = config?.[ key ] || "";
					}
					catch ( e )
					{ // probable error in params.confItem[ key ], that avaoid creation of sub[ key ]
						Els_Debug ( "can't init "+key, e );
					}
				}
			}
			jsonDiv.onkeyup = ()=>{jsonDiv.onchange};

			// config filed
			let sub = {};
			for ( let key in params.confItem )
			{
				try
				{
					let item = params.confItem[ key ];

					let [d,i] = item.fnct( ...item.args )
					sub[ key ] = {
						div: d,
						input: i,
					};

					sub[ key ].input.value = config[ item ] || "";

					if ( item.help )
					{
						sub[ key ].input.title = item.help;
					}

					for ( let k in item )
					{
						if ( [ "fnct", "args", "onchange", "onkeyup", "help" ].includes ( k ) )
						{ // specials key
							continue;
						}

						if ( undefined == item[ k ] )
						{
							continue;
						}
						sub[ key ].input[ k ] = item[ k ];
					}

					if ( "Function" == item.onchange?.constructor.name )
					{
						sub[ key ].input.onchange = item.onchange;
					}
					else
					{
						sub[ key ].input.onchange = (ev)=>{
							let outItem = key;
							let outObj = config;

							if ( item.dataPath )
							{
								let s = item.dataPath.split ( "." );

								outItem = s.pop ( );

								s.map ( s2=>{
									if ( "Object" != outObj[ s2 ].constructor.name )
									{
										outObj[ s2 ] = {};
									}
									outObj = outObj[ s2 ];
								});
							}

							if ( "number" == item.type  )
							{
								outObj[ outItem ] = Number ( ev.target.value );
							}
							else
							{
								outObj[ outItem ] = ev.target.value;
							}
							Els_Back.newJson ( config, jsonDiv, outDiv );
						}
					}

					sub[ key ].input.onkeyup = sub[ key ].input.onchange;
					configDiv.appendChild ( sub[ key ].div );
				}
				catch ( e )
				{
					Els_Debug ( "config invalid for "+ key, params.confItem[ key ] );
					Els_Debug ( e )
				}
			}

			return {
				config:configDiv,
				json:jsonDiv,
				out:outDiv._domEl,
				sub:sub,
				outObj:outDiv, // needed for Els_Back._newOut
			};
		}
		catch ( e )
		{
			Els_Debug ( e );
			return undefined;
		}
	}

	/// \brief create an element width input config
	/// \params [ in ] index : string with the id of the new element
	/// \params [ in ] json : configuration of new element
	static _newOut ( index, json )
	{
		try // out
		{
			let newChild = new Els[ json.type ]( json, index );

			return newChild;
		}
		catch ( e )
		{
			throw "no out el available";
		}
	}

	/// \brief manage the json check and coloration
	/// \param [ out ] json : out data object (JSON)
	/// \param [ in ] jsonDiv : div with the red coloration in case of error
	/// \param [ in ] outDiv : div with the element need to be update if all right
	/// \param [ in ] jsonText : string with data need to be checked
	static newJson ( json, jsonDiv, outObj, jsonText )
	{
		try
		{
			// this.timeOut is used to debounce
			if ( this.timeOut )
			{
				clearTimeout ( this.timeOut );
			}
			if ( jsonDiv )
			{
				jsonDiv.style.backgroundColor = "";
				jsonDiv.style.color = "";
			}
			if ( jsonText )
			{
				Object.assign ( json, JSON.parse ( jsonText ) );
			}
			if ( jsonDiv )
			{
				jsonDiv.value = JSON.stringify ( json, null, 4 );
			}
		}
		catch ( e )
		{
			this.timeOut = setTimeout( function() {
				if ( jsonDiv )
				{
					jsonDiv.style.backgroundColor = "rgba(255,0,0,0.5)";
					jsonDiv.style.color = "rgba(255,255,255,1)";
				}
			}, 1000 );
		}

		try {
			// outObj contain the new element configured followin json
			if ( outObj )
			{
				outObj.update ( json );
			}
		}
		catch ( e )
		{
			console.error ( e );
		}
	}

	static get parent ( )
	{
		return Object.getPrototypeOf ( this );
	}


	static parseValue ( msg )
	{
		let v = msg;
		if ( "String" == msg.constructor.name ) try
		{
			v = JSON.parse ( msg );
		}
		catch ( e )
		{
			return msg;
		}

		if ( undefined != v?.value )
		{
			v = v.value;
		}

		return v;
	}
}

class Els_text extends Els_Back {
	static _domType = "p";
	static _defaultConfig = {
		type:"text",
		text:"",
		style:undefined,
	};
	
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement ( this.constructor._domType );
		this._domEl.appendChild ( this._elList );
		this.update ( config );
	}

	update ( config )
	{
		this._update ( config );

		for ( let k of Object.keys ( config ) )
		{
			switch ( k )
			{
				case "text":
				{
					this._elList.innerHTML = config.text;
					break;
				}
				default:
				{
					this._elList[ k ] = config[ k ];
					break;
				}
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			text: {
				fnct: _createInput,
				args: [ "text" ],
				value: config?.text,
			}
		},
		params.confItem );

		return this.parent.new ( params, json, deep + 1 );
	}
}

class Els_title extends Els_text {
	static _domType = "h3";
	static _defaultConfig = {
		type:"title",
		text:"",
		style:undefined,
	};

	constructor ( config, id )
	{
		super( config, id );
	}
}

class Els_img extends Els_text {
	static _domType = "img";
	static _defaultConfig = {
		type:"img",
		src:"",
		style:undefined,
	};

	constructor ( config, id )
	{
		super( config, id );

		Object.assign ( this._elList.style, {
			maxWidth: "100%",
			maxHeight: "100%",
		});
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		params.confItem = {
		};

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			src: {
				fnct: _createInput,
				args: [ "src" ],
				value: config?.src,
			},
			text: undefined,
		},
		params.confItem );

		return this.parent.new ( params, json, deep + 1 );
	}
}

class Els_title_id extends Els_title {
	constructor ( config, id )
	{
		super( config, id );
		_createTranslateItem ( this._els, config );
	}
}

class Els_text_id extends Els_text {
	constructor ( config, id )
	{
		super( config, id );
		_createTranslateItem ( this._els, config );
	}
}

class Els_map extends Els_Back {
	static _domType = "iframe";
	static _defaultConfig = {
		type:"map",
		gps:[
			{
				latitude:0,
				longitude:0
			}
		],
		view:{
			left:-0.01,
			top:-0.01,
			right:0.01,
			bottom:0.01,
		}
	};

	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement(this.constructor._domType);
		this._domEl.appendChild ( this._elList );
		this._elList.className = "map";

		this.update ( config );
	}

	update ( config )
	{
		this._update ( config );

		let src = "https://www.openstreetmap.org/export/embed.html"
		src += "?bbox="+config.view.left;
		src += "%2C"+config.view.top;
		src += "%2C"+config.view.right;
		src += "%2C"+config.view.bottom;
		config.gps.forEach((p)=>{
			src += "&marker="+p.latitude+"%2C"+p.longitude;
		})
		src += "&layers=ND";
		this._elList.src = src
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let zoom = 0.01;

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			latitude: {
				fnct: _createInput,
				args: [ "Latitude (N/S)" ],
				type: "number",
			},
			longitude: {
				fnct: _createInput,
				args: [ "Longitude (E/W)" ],
				type: "number",
			},
			zoom: {
				fnct: _createInput,
				args: [ "Longitude (E/W)" ],
				type: "number",
			},
		},
		params.confItem );

		let divs = this.parent.new ( params, json, deep + 1 );

		divs.sub.latitude.input.value = isNaN ( json.gps[0].latitude )? "" : json.gps[0].latitude;
		divs.sub.latitude.input.onchange = (ev)=>{
			json.gps[0].latitude = Number ( ev.target.value );
			json.view.top = json.gps[0].latitude - zoom;
			json.view.bottom = json.gps[0].latitude + zoom;
			Els_Back.newJson ( json, divs.json, divs.outObj );
		}

		divs.sub.longitude.input.value = isNaN ( json.gps[0].longitude )? "" : json.gps[0].longitude;
		divs.sub.longitude.input.onchange = (ev)=>{
			json.gps[0].longitude = Number ( ev.target.value );
			json.view.left = json.gps[0].longitude - zoom;
			json.view.right = json.gps[0].longitude + zoom;
			Els_Back.newJson ( json, divs.json, divs.outObj );
		}

		divs.sub.zoom.input.value = 0.001;
		divs.sub.zoom.input.step = 0.0001;
		divs.sub.zoom.input.onchange = (ev)=>{
			zoom = Number ( ev.target.value );
			json.view.left = Number ( json.gps[0].longitude ) - zoom;
			json.view.top = Number ( json.gps[0].latitude ) - zoom;
			json.view.right = Number ( json.gps[0].latitude ) + zoom;
			json.view.bottom = Number ( json.gps[0].longitude ) + zoom;
			Els_Back.newJson ( json, divs.json, divs.outObj );
		}

		divs.json.onchange = (ev)=>{
			Els_Back.newJson ( json, divs.json, divs.outObj, ev.target.value );

			divs.sub.latitude.input.value = json?.gps[0]?.latitude || "";
			divs.sub.longitude.input.value = json?.gps[0]?.longitude || "";

			divs.sub.zoom.input.dispatchEvent ( new Event ( "change" ) );
		}

		return divs;
	}
}

class Els_io extends Els_Back {
	static _defaultConfig = {
		type: "io",
		channel: "WEBSOCKET CHANNEL",
		domType: "output",
		periode: 1,
		default: "",
		valueType: undefined,
		label: undefined,
		prefix: undefined,
		text_id: undefined,
		format: undefined,
		action: undefined,
		unit: undefined,
		format: undefined,
	};

	static _choices = {
		domType: [
			"output", // creat a div to display data (server -> client)
			"input", // create an input to change information (client -> server)
			"select" // create a select with limited choices (client -> server)
		],
		valueType: ["obj", "volume", "flow", "temperature", "date", "dateMs", "error"],
	};

	constructor ( config,  id )
	{
		super( config, id );

		// label if neeted
		this.divLabel = document.createElement ( "div" );
		this._domEl.appendChild ( this.divLabel );
		this.divLabel.className = "label";
		if ( this._config.label )
		{
			this.divLabel.innerHTML = this._config.label;
		}
		if ( this._config.text_id )
		{
			_createTranslateItem ( this.divLabel, this._config );
		}

		// data
		this.divData = document.createElement ( this.domType );
		this._domEl.appendChild ( this.divData );
		this.divData.className = "data";
		this.value = config.default;

		// unit
		this.divUnit = document.createElement ( "div" );
		this._domEl.appendChild ( this.divUnit );
		this.divUnit.className = "unit";
		if ( config.unit )
		{
			this.divUnit.innerHTML =  config.unit;
		}
		else
		{
			this.divUnit.style.display = "none"
		}
		

		this._callArgs.push ( ...this.callObjs );
	}

	update ( config )
	{
		this._update ( config );

		for ( let k of Object.keys ( config ) )
		{
			switch ( k )
			{
				case "label":
				{
					this.divLabel.innerHTML = config.label;
					break;
				}
				case "default":
				{
					this.value = config.default;
					break;
				}
				case "unit":
				{
					this.divUnit.innerHTML = config.unit;
					break;
				}
				case "valueType":
				case "channel":
				case "label_id":
				{
					break;
				}
			}
		}
	}

	set value ( value )
	{
		if ( undefined == value )
		{
			value = "...";
		}
		
		this.divData.innerHTML = value;
	}

	get domType ( )
	{
		return "div";
	}

	get callObjs ( )
	{

		if ( "array" === this._config.channel?.constructor?.name.toLowerCase ( ) )
		{
			this.currentData = [];
			let mainCallBack = this.callFnct;

			return this._config.channel.map ( (channel,index)=>{
				return {
					periode: this._config.periode || 0,
					channel: channel,
					f: (msg)=>{
						let last = this.currentData[ index ];
						this.currentData[ index ] = msg;

						switch ( config.action )
						{
							case "min":
							{
								mainCallBack ( this.currentData.sort ( (a,b)=>a-b )[ 0 ] );
								break;
							}
							case "max":
							{
								mainCallBack ( this.currentData.sort ( (a,b)=>b-a )[ 0 ] );
								break;
							}
							case "average":
							{
								mainCallBack ( this.currentData.reduce ( (a,v)=> v + a ) / this.currentData.length );
								break;
							}
						}
					}
				};
			});
		}
		else
		{
			return [{
				periode: this._config.periode || 0,
				channel: this._config.channel,
				f: this.callFnct
			}];
		}
	}

	get callFnct ( )
	{
		switch ( this._config.valueType )
		{
			case "obj":
			{
				return (msg)=>{
					if ( !this._config?.format )
					{
						return;
					}
					let out = this._config.format || "";

					let value = Els_io.parseValue ( msg, this._config.coef, true );

					if ( msg?.value?.label )
					{
						this.divLabel.innerHTML = value.label;
						delete msg.value.label;
					}

					for ( let k in value )
					{
						out = out.replace ( "${"+k+"}", value[ k ] );
					}

					out = out.replace ( /\${[^}]*}/g, "" );

					if ( "" == out )
					{
						return;
					}

					this.value = out;
				};
			}
			case "volume":
			{
				return (msg)=>{
					let value = Els_io.parseValue ( msg, this._config.coef );

					if ( isNaN ( msg.value ) )
					{
						this.value = msg.value;
						return;
					}

					let {coef,print} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );

					this.value = refactor ( value * coef , "v_"+this._config.unitCurrent.volume );
					this.divUnit.innerHTML = print;
				};
			}
			case "flow":
			{
				return (msg)=>{
					let value = Els_io.parseValue ( msg, this._config.coef );

					if ( isNaN ( msg.value ) )
					{
						this.value = msg.value;
						return;
					}
					
					let {coef,print} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );

					this.value = refactor ( value * coef , 1 );
					this.divUnit.innerHTML = print;
				}
				break;
			}
			case "temperature":
			{
				return (msg)=>{
					let value = Els_io.parseValue ( msg, this._config.coef );

					if ( isNaN ( value ) )
					{
						this.value = value;
						return;
					}

					if ( this._config.unitCurrent
						&& this._config.unit )
					{
						value = temperatureConvert ( value, this._config.unitCurrent.temperature, this._config.unit );
					}
					this.divData.innerText = refactor ( value, this._config.unitCurrent.temperature );

					if ( this._config.unit )
					{
						this.divUnit.innerHTML = "°" + this._config.unitCurrent.temperature;
					}
				}
			}
			case "date":
			case "dateMs":
			{
				return (msg)=>{
					let value = Els_io.parseValue ( msg, this._config.coef );

					if ( isNaN ( value ) )
					{
						this.value = value;
						return;
					}

					value = new Date ( value );

					if ( "date" == this._config.valueType )
					{
						this.value = value.toLocaleString ( "sv" ).replace ( /\.\d\d\dZ/, "" )
					}
					else
					{
						this.value = value.toLocaleString ( "sv" ).replace ( "Z", "" )
							+"."
							+value.getMilliseconds ( ).toString ( ).padStart ( 3, "0" );
					}
				};
			}
			case "error":
			{
				return (msg)=>{
					let value = Number ( Els_io.parseValue ( msg ) );

					this.value = value;
					if ( value != 0 )
					{
						this.divData.classList.add ( "err" );
					}
					else
					{
						this.divData.classList.remove ( "err" );
					}
				}
			}
			default:
			{
				return (msg)=>{
					let value = Els_io.parseValue ( msg, this._config.coef );

					if ( isNaN ( value ) )
					{
						this.value = value;
						return;
					}
					
					if ( "select" == this._config.domType )
					{
						this.value = value;
					}
					else if ( undefined != window.refactor )
					{
						let a = this._config.valueType;
						if ( a == undefined )
						{
							a = 1;
						}
						this.value = refactor ( value, a );
					}
					else
					{
						this.value = value;
					}

					if ( this._config.unit )
					{
						this.divUnit.innerHTML =  this._config.unit;
					}
					else
					{
						this.divUnit.style.display = "none"
					}
				}
			}
		}
	};

	static parseValue ( msg, coef = 1, obj = false )
	{
		let v = this.parent.parseValue ( msg );

		if ( obj )
		{
			if ( "String" == v ) try
			{
				v = JSON.parse ( v );
			}
			catch ( e )
			{
				console.log ( "Object requested : "+v );
			}
		}
		else if ( !isNaN ( v ) )
		{
			v *= coef;
		}

		return v;
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			label: {
				fnct: _createInput,
				args: [ "label" ],
				value: config?.label,
				help: "text to display on the side of input value",
			},
			default: {
				fnct: _createInput,
				args: [ "default" ],
				placeholder: "default value",
				value: config?.default,
				help: "text to display as value until get data",
			},
			valueType: {
				fnct: _createInput,
				args: [ "data type", Els_io._choices.valueType ],
				placeholder: "nb digit / type",
				value: config?.valueType,
			},
			unit: {
				fnct: _createInput,
				args: [ "unit" ],
				value: config?.unit,
			},
			coef: {
				fnct: _createInput,
				args: [ "static Coef" ],
				type: "number",
				value: config?.coef,
			}
		},
		params.confItem);


		return this.parent.new ( params, json, deep + 1 );
	}
}

class Els_input extends Els_io {
	static _defaultConfig = {
		type: "input",
		channel: "WEBSOCKET CHANNEL",
		periode: 1,
		default: "",
		action: undefined,
		valueType: undefined,
		format: undefined,
		label: undefined,
		prefix: undefined,
		text_id: undefined,
		unit: undefined,
		fieldConfig:{
			type: undefined,
			min: undefined,
			max: undefined,
			step: undefined,
			title: undefined,
		},
	};

	static _choices = {
		valueType: ["obj", "volume", "flow", "temperature", "date", "dateMs", "error"],
	};

	constructor ( config,  id )
	{
		super( config, id );

		if ( "string" != this._config.channel?.constructor.name.toLowerCase ( ) )
		{
			throw "only one chanel for inputs";
		}

		this.divData.disabled = !!this._config?.fieldConfig?.channel;

		Object.assign ( this.divData, this._config.fieldConfig )

		this.divData.addEventListener ( "change", (ev)=>{
			switch ( this._config.fieldConfig.type )
			{
				case "checkbox":
				{
					this.divData.value = this.divData.checked == true;
					break;
				}
				default:
				{
					ev.target.classList.remove ( "err" );

					if ( this._config.fieldConfig.min > ev.target.value )
					{
						console.log ( "min", this._config.fieldConfig.min, ev.target.value )
						ev.target.classList.add ( "err" );
						ev.target.value = this._config.fieldConfig.min;
					}

					if ( this._config.fieldConfig.max < ev.target.value )
					{
						console.log ( "min", this._config.fieldConfig.max, ev.target.value )
						ev.target.classList.add ( "err" );
						ev.target.value = this._config.fieldConfig.max;
					}
					break;
				}
			}
		});

		// used to give min / max or other data;
		if ( this._config?.fieldConfig?.channel )
		{
			let cb = {
				periode: -1, // send once
				channel: this._config.fieldConfig.channel,
				f: (msg)=>{
					this.divData.disabled = false;

					if ( undefined != msg.value.step )
					{
						let p = Math.pow ( 10, Math.round ( Math.log10 ( msg.value.step ) ) - 1 )
						msg.value.step = Math.round ( msg.value.step / p ) * p;
					}

					Object.assign ( this.divData, msg.value );
					Object.assign ( this._config.fieldConfig, msg.value );
					this.divData.title = JSON.stringify ( msg.value, null, 4 );
				}
			}

			this._callArgs.push ( cb );
		}
	}

	get domType ( )
	{
		return "input";
	}

	get callObjs ( )
	{
		return [{
			periode: this._config.periode || 0,
			channel: this._config.channel,
			f: this.callFnct,
			eventType: "input",
			args: {
				domEl: this.divData,
				event: this._config.fieldConfig?.event,
				format: this._config.fieldConfig?.format,
			}
		}];
	}

	set value ( value )
	{
		if ( undefined == value )
		{
			value = "...";
		}
		
		if ( "checkbox" == this._config.fieldConfig.type )
		{
			this.divData.checked = [ true, "true", "True", "TRUE", "on", "ON", 1 ].includes ( value );
		}
		else
		{
			this.divData.value = value;
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			fType: {
				fnct: _createSelect,
				args: [ [ "number", "text", "email" ], "type" ],
				placeholder: "value type",
				value: config?.fieldConfig?.type,
				help: "text to display as value until data set",
				dataPath: "fieldConfig.type",
			},
			text: {
				type: "text",
				fnct: _createText,
				args: [ "only for type number" ],
			},
			fMin: {
				type: "number",
				fnct: _createInput,
				args: [ "min" ],
				placeholder: "min value",
				value: config?.fieldConfig?.min,
				help: "min value",
				dataPath: "fieldConfig.min",
			},
			fMax: {
				type: "number",
				fnct: _createInput,
				args: [ "max" ],
				placeholder: "max value",
				value: config?.fieldConfig?.max,
				help: "max value",
				dataPath: "fieldConfig.max",
			},
			fStep: {
				type: "number",
				fnct: _createInput,
				args: [ "step" ],
				placeholder: "change step",
				value: config?.fieldConfig?.step,
				help: "change step",
				dataPath: "fieldConfig.step",
			},
		},
		params.confItem);

		return this.parent.new ( params, json, deep + 1 );
	}
}

class Els_select extends Els_io {
	static _defaultConfig = {
		type: "select",
		channel: "WEBSOCKET CHANNEL",
		periode: 1,
		label: undefined,
		valueType: undefined,
		format: undefined,
		fieldConfig: {
			options:[],
			format: undefined,
		},
	};

	constructor ( config,  id )
	{
		super( config, id );

		this.select = {
			options: [],
			value: undefined,
		};

		if ( "string" != config.channel?.constructor.name.toLowerCase ( ) )
		{
			throw "only one chanel for inputs";
		}

		if ( !this._config?.fieldConfig )
		{
			return
		}

		// used to give min / max or other data;
		if ( this._config.fieldConfig.channel )
		{
			let cb = {
				periode: -1, // send once
				channel: this._config.fieldConfig.channel,
				f: (msg)=>{
					this.options = msg.value;
				}
			}

			this._callArgs.push ( cb );
		}

		if ( this._config.fieldConfig.options )
		{
			this.options = this._config.fieldConfig?.options;
		}
		else if ( this._config.fieldConfig.text_id )
		{
			let json = {
				textId: this._config.fieldConfig.text_id,
				prefix: config?.prefix
			};

			this.divData.classList.add ( "translate" );
			this.divData.dataset.translate = JSON.stringify ( json );
		}
	}

	get domType ( )
	{
		return "select";
	}

	get callObjs ( )
	{
		return [{
			periode: this._config.periode || 0,
			channel: this._config.channel,
			f: this.callFnct,
			eventType: "input",
			args: {
				domEl: this.divData,
				event: this._config.fieldConfig?.event,
				format: this._config.fieldConfig?.format,
			}
		}];
	}

	set options ( array )
	{
		this.divData.disabled = true;

		if ( "Array" != array?.constructor.name )
		{
			return;
		}

		while ( this.divData.firstChild )
		{
			this.divData.removeChild ( this.divData.firstChild );
		}

		array.map ( (item,index)=>{
			if ( "Object" == item.constructor.name )
			{
				this.select.options.push (item);
			}
			else
			{
				this.select.options.push ({value:item,text:item});
			}
		})

		this.select.options.map ( (item)=>{
			let opt = document.createElement ( "option" );

			opt.value = item.value;
			opt.innerText = item.text;

			this.divData.appendChild ( opt );

		});

		this.value = this.select.value;

		this.divData.disabled = ( this.select.options?.length <= 0 );
	}

	set value ( value )
	{
		if ( undefined == value )
		{
			value = "...";
		}

		if ( !this.select?.options )
		{
			return;
		}
		
		if ( !this.select.options.length )
		{
			while ( this.divData.firstChild )
			{
				this.divData.removeChild ( this.divData.firstChild );
			}

			let opt = document.createElement ( "option" );
			opt.innerText = value;

			this.divData.appendChild ( opt );

			this.select.value = value;
		}
		else
		{
			let v = this.select.options.filter ( f=>f.value==value||f.text==value );
			this.divData.value = v[ 0 ]?.value
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			nbOptions: {
				fnct: _createInput,
				args: [ "Nb of Options" ],
				type: "number",
				min: 0,
				onchange: ()=>{},
			},
		});

		let divs = this.parent.new ( params, json, deep + 1 );

		try
		{
			_createTable ( divs, {
				cols:[
					{text:"value"},
					{text:"text"},
				],
				input: "nbOptions",
				dataPath: "fieldConfig.options",
				json: json,
			} );
		}
		catch ( e )
		{
			console.log ( e )
		}

		return divs;
	}
}

class Els_bin extends Els_text {
	static _domType = "p";
	static _defaultConfig = {
		type:"bin",
		channel:"WS_DATA_CHANNEL",
		periode:0,
		text:"",
		revert: false,
		mask: undefined,
		color: undefined,
	};

	constructor ( config, id )
	{
		super( config, id );

		this._elList.className = "status"

		if ( undefined == this._config.mask )
		{
			this._config.mask = 0x01;
		}

		let cb = {
			periode: this._config.periode || 0,
			channel: this._config.channel,
			f: this._callback,
		};

		this._callArgs.push ( cb );
	}

	get _callback ( )
	{
		return (msg)=>{
			let v = ( this._config.revert )? ~msg.value: msg.value;
			v &= this._config.mask;
			v = !!v;

			if ( v )
			{
				this._elList.classList.add( "active" );
			}
			else
			{
				this._elList.classList.remove( "active" );
			}

			if ( !this._config?.color )
			{ // no color defined
				return;
			}
			else
			{
				this._elList.style="--status-color:"+_getColor ( this._config.color[ v?1:0 ] );
			}
		};
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			text: {
				fnct: _createInput,
				args: [ "label" ],
			}
		},
		params.confItem);

		return Els_Back.new ( params, json, deep + 1 );
	}
}

class Els_multi extends Els_bin {
	static _domType = "p";
	static _defaultConfig = {
		type:"multi",
		channel:"WS_DATA_CHANNEL",
		periode:0,
		text:"",
		revert: false,
		mask: undefined,
		color: ["red",5,"green",6,"orange",7,"pink"],
		defaultColor: "red", // default color if no color available
	};

	constructor ( config, id )
	{
		super( config, id );
	}

	get _callback ( )
	{
		return (msg)=>{
			if ( !this._config?.color )
			{ // no color defined
				return;
			}

			if ( undefined == this._config.text )
			{
				this.div.innerHTML = msg.value;
			}

			let upValue = this._config.color
				.filter ( c=>!isNaN ( c ) )
				.filter ( c=>c>msg.value )
				.sort ( (a,b)=>a-b )?.[ 0 ];

			let color = undefined;
			if ( undefined == upValue )
			{
				color = this._config?.color[ this._config?.color.length - 1 ];
			}
			else
			{
				color = this._config.color[ this._config?.color?.indexOf ( upValue ) - 1 ];
			}

			if ( ( undefined == color )
				|| ( "String" != color.constructor.name ) )
			{
				color = this._config.defaultColor || "red";
			}

			this.div.style="--status-color:"+_getColor ( color );
		};
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}


		let divs = this.parent.new ( params, json, deep + 1 );

		try // config
		{
			_createColorLimitTable ( divs, json );

			return divs;
		}
		catch ( e )
		{
			console.log( e )
			return undefined
		}
	}
}

class Els_gauge extends Els_Back {
	static _defaultConfig = {
		type:"gauge",
		channel:"WEBSOCKET CHANNEL",
		periode:0, // temps de rafraichissement
		valueType: undefined, // cf Chapter valueType
		unit: undefined, // cf Chapter valueTypet
		options:{
			values: [ 0, "yellow", 100 ],
			curve: {
				min: 0, // angle start (left)
				max: 180, // angle stop (right)
				size: 300, // graph width (px)
				width: 30, // line width (px)
				label: {
					color: "black", // text color
					height: 20, // text height (px)
					line: 1, // number of line for bound print
				},
				backColor: "transparent", // line color in case of no color provided in values
			},
			coef: 1, // coefficeint need to be applied on gauge label value
			offset: 0, // offset need to be applied on gauge label value
			errorColor: "red", // Out Of Limit error color
			needleColor: "black", // ...
		}
	};

	constructor ( config,  id )
	{
		super( config, id );

		this.gauge = new Gauge ( this._config.options );

		this.gauge.textColor =  _getColor ( this._config.options?.curve?.label?.color ) ;
		
		this._domEl.appendChild ( this.gauge.domEl );
		this._domEl.style.textAlign = "center";

		switch ( this._config.valueType )
		{
			case "temperature":
			case "volume":
			{
				this.config.unitCurrent.event.addEventListener ( this._config.valueType, (event)=>{
					let {offset,coef} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );
					this.gauge.coef = coef;
					this.gauge.offset = offset;
				});

				let {offset,coef} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );
				this.gauge.coef = coef;
				this.gauge.offset = offset;
				break;
			}
			case "flow":
			{
				for ( let u in this._config.unit )
				{
					this.config.unitCurrent.event.addEventListener ( u, (event)=>{
						let {coef} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );
						this.gauge.coef = coef;
					});

					let {coef} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );
					this.gauge.coef = coef;
				}
				break;
			}
		}

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				this.gauge.value = msg.value;
			}
		};

		this._callArgs.push ( cb );
	}

	// add all static labels to the graph
	_addMinMaxLabel ( c, array )
	{
		for ( let  label of ["min","max"] )
		{
			if ( undefined != c[ label ]
				&& !array.includes ( c[ label ] ) )
			{
				array.push ( c[ label ] );
			}
		}
	}

	update ( config )
	{
		this._update ( config );
		this.gauge.textColor = _getColor ( this._config.options?.curve?.label?.color );
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		let divs = this.parent.new ( params, json, deep + 1 );

		try // config
		{
			_createColorLimitTable ( divs, json, {array:json.options.values,limit:"left"} );

			return divs;
		}
		catch ( e )
		{
			console.log ( e )
			return undefined
		}
	}
}

class Els_table extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this.table = document.createElement ( "table" );
		this._domEl.appendChild ( this.table );

		for ( let [i,row] of config.dataset.entries() )
		{
			let tr = document.createElement ( "tr" );

			for ( let [j,col] of row.entries() )
			{
				let td = document.createElement ( "td" );
		
				let entry = new Els[ col.type ]( col, id+"_"+i+"_"+j );
				this._callArgs.push ( ...entry.callbacks );
				td.appendChild ( entry.dom );
				tr.appendChild ( td );
			}
			this.table.appendChild ( tr );
		}
	}
}

class Els_dinTable extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this.table = document.createElement ( "table" );
		this._domEl.appendChild ( this.table );

		if ( config.head )
		{
			let head = document.createElement ( "thead" );
			this.table.appendChild ( head );

			let tr = document.createElement ( "tr" );
			head.appendChild ( tr );

			for ( let [i,head] of config.head.entries() )
			{
				let td = document.createElement ( "td" );
				tr.appendChild ( td );

				let entry = new Els[ head.type ]( head, id+"_"+i );
				td.appendChild ( entry.dom );

				this._callArgs.push ( ...entry.callbacks );
			}
		}

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				function createCol ( col )
				{
					let td = document.createElement ( "td" );

					if ( "object" == col.constructor.name.toLowerCase ( ) )
					{
						td.appendChild ( document.createTextNode ( col.value ) );
						td.style = col.style;
					}
					else
					{
						td.appendChild ( document.createTextNode ( col ) );
					}

					return td;
				}
				function createLine ( row )
				{
					let tr = document.createElement ( "tr" );

					for ( let col of row )
					{
						tr.appendChild ( createCol ( col ) );
					}
					return tr;
				}

				if ( msg.update )
				{
					if ( !this.line )
					{
						return;
					}

					for ( let update of msg.update )
					{
						if ( this.line[ update.id ] )
						{ // update existing line
							while ( this.line[ update.id ].firstChild )
							{
								this.line[ update.id ].removeChild ( this.line[ update.id ].lastChild );
							}

							if ( !update.value )
							{ // empty line
								this.line[ update.id ].style.display = "none";
							}
							else for ( let col of update.value )
							{ // line with values
								this.line[ update.id ].appendChild ( createCol ( col ) );
							}
						}
						else
						{
							let tr = createLine ( update.value );
							this.body.appendChild ( tr );
							this.line[ update.id ] = tr;
						}
					}
				}
				else if ( msg.value )
				{
					this.line = [];
					let body = document.createElement ( "tbody" );

					for ( let row of msg.value )
					{
						let tr = createLine ( row );
						body.appendChild ( tr );
						this.line.push ( tr );
					}

					if ( this.body )
					{
						this.table.removeChild ( this.body );
					}

					this.body = body;
					this.table.appendChild ( this.body );
				}
			}
		};

		this._callArgs.push ( cb );
	}
}

class Els_log extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );
		this.p = document.createElement("p");

		fetch ( "imgs/trash_icon.svg" )
			.then(r=>r.text())
			.then(text=>{
				let svg = new DOMParser().parseFromString(text, 'text/html').querySelector('svg');
				this._domEl.appendChild ( svg );
				svg.onclick = ()=>{this.p.innerHTML=""};
			})
			.catch(console.log)

		this._domEl.appendChild ( this.p );

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				this.p.innerHTML = msg.value + "<br>" + this.p.innerHTML;
				if ( ( 0 != this.p.clientHeight )
					&& ( !this.p.style.height ) )
				{
					this.p.style.height = this.p.clientHeight + "px";
				}
			}
		};

		this._callArgs.push ( cb );
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		return this.parent.new ( params, json, deep + 1 );
	}
}

class Els_svg extends Els_Back {
	#defaultConfig = {
		type:"svg",
		src:"imgs/img.svg", // le svg itself
		backImg:"imgs/img.png", // background if needed
		colors:{
			undefined: "grey",
			false: "red",
			true: "green",
			border: "black",
		},
		data:[
			{
				id:"id_Path1",
				type:"bin",
				channel:"WEBSOCKET CHANNEL",
				periode:0,
				revert: false, // complement a 1 sur la donnée
				mask: 0x01 // masque sur la donnée pour savori quel bits observer
				// onclick: { // send over socket 'userCmd'
				// 	cmd:"********", // cmd param
				// 	toogle: false, // for bin only onclick toogle value of input and esend it 
				// 	arg:{ // reserved
				// 		value:undefined
				// 	}
				// },
				// colors:
				// {
				// 	undefined: "grey", // si la valeur n'est pas un nombre ou pas definie
				// 	false: "red", // si la valeur masqué est 0
				// 	true: "green" // si la valeur masqué est deferente de 0
				//	stroke: "black"
				// }
			}
		]
	}

	constructor ( config, id )
	{
		super( config, id );

		this._config = _objMerge ( this.#defaultConfig, this._config );

		let img = document.createElement("img");

		this._domEl.appendChild ( img );
		this.cbEvents = [];

		fetch ( config.src )
			.then(r=>{
				if ( r.ok )
				{
					return r.text ( );
				}
				else
				{
					throw "status: "+r.status
				}
			})
			.then(t=>{
				this.svg = new DOMParser().parseFromString(t, 'text/html').querySelector('svg');
				img.replaceWith(this.svg);

				if ( !this.svg )
				{
					throw "SVG not found";
				}
				else if ( undefined != config.backImg )
				{
					let backImg = '<image href="'+config.backImg+'" '
					backImg += 'width="'+this.svg.viewBox.baseVal.width+'" '
					backImg += 'height="'+this.svg.viewBox.baseVal.height+'" />';
					this.svg.innerHTML = backImg + this.svg.innerHTML;
				}

				this.svg.style.maxWidth = "100%";
				this.svg.style.maxHeight = "100%";

				if ( !this._domEl?.style?.height )
				{
					let h = ( this.svg.clientWidth * this.svg.viewBox.baseVal.height / this.svg.viewBox.baseVal.width )
					this._domEl.style.maxHeight = h + "px";
				}
			})
			.then( ()=>{
				for ( let id in this.cbEvents )
				{
					this.svg.querySelector ( "#"+id ).addEventListener ( "click", (ev)=>{
						this.cbEvents[ id ].dispatchEvent ( new Event ( "click" ) );
					});
				}
			})
			.catch(console.log)

		for ( let d of config.data )
		{
			let style = document.createElement("style");
			this._domEl.appendChild ( style );
			style.id = "css_"+id+"_"+d.id;
			style.innerHTML = "#"+d.id+"{stroke:"+_getColor ( d.colors?.stroke || this.config?.colors?.stroke )+"}";

			let cb = {
				periode: d.periode || 0,
				channel: d.channel,
				f: console.log
			};

			if ( undefined == d.mask )
			{
				d.mask = 0x01
			}

			switch ( d.type )
			{
				case "bin":
				{
					cb.f = (msg)=>{
						let v = undefined;
						
						if ( ( msg.value || msg )
							&& !isNaN ( msg.value || msg ) )
						{
							v = Number ( msg.value || msg );
							v = ( d.revert )? ~v: v;
							v &= d.mask;
							v = v != 0
						}

						let color = d?.colors?.[ v ] || this._config?.colors?.[ v ];

						style.innerHTML="#"+d.id+"{fill:"+_getColor ( color )+"}";

						if ( d.arg )
						{
							// onclick arg
							d.arg.value = (d?.onclick?.toogle)? !v : v;
						}
					}
					break;
				}
				case "multi":
				{
					cb.f = (msg)=>{
						let color = d.color[0] || "rgba(0,0,0,0)"
						for ( let i = 0; i < d.step.length; i++ )
						{
							if ( msg.value > d.step[ i ] )
							{
								color = d.color[ i + 1 ] || color;
							}
						}
						style.innerHTML = "#"+d.id+"{fill:"+_getColor ( color )+"}";
					}
					break;
				}
			}

			// input callback
			this._callArgs.push ( cb );

			if ( !d.onclick )
			{
				continue;
			}

			if ( !d.arg )
			{
				d.arg = {};
			}

			d.arg.value = undefined;

			this.cbEvents[ d.id ] = new EventTarget ( );

			cb = {
				obj: this.cbEvents[ d.id ],
				cmd: d.onclick.cmd,
				arg: d.arg,
			};

			this._callArgs.push ( cb );
		}
	}
}

class Curve {
	constructor ( config = {}, params = {} )
	{
		_objMerge ( this.params = {
			debounce: {
				time: 100,
				active: true,
			},
		}, params );

		let defaultC = {
			type: 'scatter',
			data: {
				datasets: []
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: false,
				scales: {
					x: {
						grid: {
							color:"rgba(128,128,128,0.4)"
						},
						ticks: {

						},
					},
					y: {
						grid: {
							color:"rgba(128,128,128,0.4)"
						},
						ticks: {

						},
					}
				},
				plugins:{
					legend: {
						labels: {
							color: undefined,
						}
					}
				}
			},
			plugins:[]
		};

		this.config = Object.assign ( defaultC, config );

		this.domEl = document.createElement ( "div" );
		this.domEl.style.position  = "relative";
		this.domEl.style.minHeight = "150px"; // fallback height when the parent is sized by its content

		this._canvas = document.createElement ( "canvas" );
		this.domEl.appendChild ( this._canvas );

		// canvas out of the flow: it can never push its parent (no infinite growth)
		this._canvas.style.position = "absolute";
		this._canvas.style.left     = "0";
		this._canvas.style.top      = "0";
		
		this._chart = undefined;
		this._zoom = {
			event: new EventTarget ( ),
			x:{},
			y:{},
			active: false,
		};

		this._zoom.event.addEventListener ( "change", ()=>{
			this._chart?.update ( );
		});
	}

	update ( force = false )
	{
		if ( force
			&& this._debounce )
		{ // force update
			clearTimeout ( this.debounce )
		}
		else if ( this._debounce )
		{
			return;
		}

		let x = {
			min: [],
			max: [],
		};
		let y = {
			min: [],
			max: [],
		};

		if ( this._zoom.active )
		{
			if ( "line" == this.config.type )
			{
				x.min = Math.min ( ...this.config.data.labels );
				x.max = Math.max ( ...this.config.data.labels );
			}
			else
			{
				this.config.data.datasets.map ( d=>{
					x.min.push ( Math.min( ...d.data.map((p)=>{return p.x;}) ) );
					x.max.push ( Math.max( ...d.data.map((p)=>{return p.x;}) ) );

					x.min = Math.min ( ...x.min );
					x.max = Math.max ( ...x.max );
				});
			}

			this.config.data.datasets.map ( d=>{
				y.min.push ( Math.min( ...d.data.map((p)=>{return p.y;}) ) );
				y.max.push ( Math.max( ...d.data.map((p)=>{return p.y;}) ) );
			});

			y.min = Math.min ( ...y.min );
			y.max = Math.max ( ...y.max );
		}

		if ( !this._chart )
		{
			this._chart = new Chart ( this._canvas.getContext('2d'), this.config );
			return;
		}
		else
		{
			// no destroy on size change: Chart.js (responsive) resizes the canvas
			// itself, a destroyed chart stays empty until the next data update
			this._chart.update ( );

			if ( this.params.debounce.active )
			{
				this._debounce = setTimeout( ()=>{
					this._debounce = undefined;
				}, this.params.debounce.time );
			}
		}
	} 

	reset ( )
	{
		Object.assign ( this._zoom, this._chart?.getInitialScaleBounds ( ) );
		this._chart.resetZoom ( );
		this._zoom.active = false;

		this._zoom.event.dispatchEvent ( new Event ( "change" ) );
	}

	resetOnEvent ( event, status = true )
	{
		if ( status )
		{
			this._canvas.addEventListener ( event, ()=>{this.reset()} );
		}
		else
		{
			this._canvas.removeEventListener ( event, ()=>{this.reset()} );
		}
	}

	set color ( color = {} )
	{
		if ( color?.label )
		{
			if ( this.config?.options?.scales?.x?.ticks )
			{
				this.config.options.scales.x.ticks.color = color.label;
			}
			if ( this.config?.options?.scales?.y?.ticks )
			{
				this.config.options.scales.y.ticks.color = color.label;
			}
			if ( this.config?.options?.plugins?.legend?.labels )
			{
				this.config.options.plugins.legend.labels.color = color.label;
			}
		}

		if ( color?.grid )
		{
			if ( this.config?.options?.scales?.x?.grid )
			{
				this.config.options.scales.x.grid.color = color.grid;
			}
			if ( this.config?.options?.scales?.y?.grid )
			{
				this.config.options.scales.y.grid.color = color.grid;
			}
		}

		color?.datasets?.map ( (c,i)=>{
			if ( !c 
				|| !this.config?.data?.datasets?.[ i ] )
			{
				return;
			}
			this.config.data.datasets[ i ].borderColor = c;
		});
	}

	set mode ( param )
	{
		this._mode = params;
	}

	set zoomPlugin ( status = true )
	{
		switch ( status )
		{
			case "zoom":
			{
				if ( undefined == this._zoom )
				{
					this._zoom = {};
				}

				this.config.options.plugins.zoom = {
						pan: {
							enabled: true,
							mode: 'xy',
							modifierKey: 'ctrl',
						},
						zoom: {
							wheel: {
								enabled: true,
								modifierKey: 'ctrl',
							},
							pinch: {
								enabled: true
							},
							drag:{
								enabled:true,
								borderColor:"rgba(255,128,0,0.5)",
								borderWidth:2,
								backgroundColor:"rgba(255,128,0,0.1)"
							},
							mode: 'xy',
							onZoom: (c)=>{
								this._zoom.x.min = c.chart.scales.x.min;
								this._zoom.x.max = c.chart.scales.x.max;
								this._zoom.y.min = c.chart.scales.y.min;
								this._zoom.y.max = c.chart.scales.y.max;

								this._zoom.active = true;

								this._zoom.event.dispatchEvent ( new Event ( "change" ) );
							},
							onZoomRejected: (c)=>{
							},
							onZoomComplete: (c)=>{
							},
							onZoomStart: (c)=>{
							},
						},
						limits: {
							x: {
								minRange: 3,
							},
						}
					};
				break;
			}
			case "square":
			{
				this.config.plugins.push ({
					id: 'quadrants',
					beforeDraw: (chart, args, opt)=>{
						if ( !this._zoom.active )
						{
							return;
						}

						const {ctx, scales: {x, y}} = chart;

						let p = {
							l: x.getPixelForValue ( this._zoom.x.min ),
							r: x.getPixelForValue ( this._zoom.x.max ),
							b: y.getPixelForValue ( this._zoom.y.min ),
							t: y.getPixelForValue ( this._zoom.y.max ),
						};

						ctx.save ( );
						ctx.fillStyle = "rgba(128,128,128,0.2)";
						ctx.fillRect (
							p.l,
							p.t,
							p.r - p.l,
							p.b - p.t
						);
						ctx.restore ( );
					}
				});
				break;
			}
			case false:
			case undefined:
			case null:
			{
				delete this.config.options.plugins.zoom;
				return;
			}
			default:
			{
				console.log ( "Zoom status not managed yet : ", status );
				return;
			}
		}

		this._chart?.update ( );

		this.resetOnEvent ( "dblclick", status );
	}

	set axis ( params = {} )
	{
		switch ( params.x )
		{
			case "date":
			{
				this.config.options.scales.x.ticks.callback = (val, index)=>{
					// manage X axis labels if it's date
					val = new Date ( val );

					if ( 0 == index )
					{
						this.xAxisLastDay = val.getDay ( );
					}

					if ( this.xAxisLastDay != val.getDay ( ) )
					{
						this.xAxisLastDay = val.getDay ( );

						return val.toLocaleString ( "sv" );
					}
					else
					{
						return val.toLocaleString ( "sv" )
							.replace ( /.+\s/, "" );
					}
				};
				break;
			}
		}
	}

	set zoom ( obj )
	{
		this._zoom = obj;

		this._zoom.event.addEventListener ( "change", ()=>{
			this._chart?.update ( );
		});
	}

	get scales ( )
	{
		return this.config.options.scales;
	}

	get labels ( )
	{
		return this.config?.data?.label;
	}

	get datasets ( )
	{
		return this.config?.data?.datasets;
	}

	get canvas ( )
	{
		return this._canvas;
	}

	get zoom ( )
	{
		return this._zoom;
	}
}

class Els_graph extends Els_Back {
	static _defaultConfig = {
		type:"graph",
		subType:"sync", // sync/signaml/async
		channel:"WEBSOCKET CHANNEL X",
		periode:0,
		coef: undefined, // dans le cas ou le X doit etre modifié
		curve:[
			{
				name:"Courbe 1",
				channel:"WEBSOCKET CHANNEL Y",
				periode:0,
				color:"green",
			}
		]
	};

	static _choices = {
		subType: [ "sync", "signal", "async" ],
	};

	constructor ( config, id )
	{
		// capitalize First Letter
		function cFL(string)
		{
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		super( config, id );

		// graph size comes from its parent, never from the canvas (avoids infinite growth)
		this._domEl.style.minHeight = "0";
		this._domEl.style.overflow  = "hidden";

		if ( !window.Chart )
		{
			console.error ( "need Chart from https://github.com/chartjs/Chart.js" );
			return;
		}

		let configM = {};

		// defined base config of the graphs signal, sync or async
		if ( this._config.subType == "sync" )
		{ // in case of sync graph set the X axis data input
			this.main = new Curve ({
				type: "line",
				data: {
					labels:[],
					datasets:[]
				},
			});
		}
		else
		{ // async/signal case
			this.main = new Curve ( );
		}

		this._domEl.appendChild ( this.main.domEl );

		if ( "date" == this.config.xAxisType )
		{
			this.main.axis = {x:"date"};
		}

		// init config of zoom overview graph
		if ( true == this._config.zoom )
		{
			this.main.zoomPlugin = "zoom";

			if ( false != this._config.zoomOverView )
			{
				this.zoom = new Curve ({
					type: this.main.config.type,
					data: this.main.config.data,
					options: {
						maintainAspectRatio: false,
						animation: false,
						scales: {
							x: {
								ticks: this.main.scales.x.ticks
							},
							y: {},
						},
						plugins: {
							quadrants: {
								view: "rgba( 128, 128, 128, 0.1)",
							},
							legend:{
								display:false
							}
						}
					},
				});

				this._domEl.appendChild ( this.zoom.domEl );

				this.zoom.resetOnEvent ( "dblclick", true );
				this.zoom.zoomPlugin = "square";
				this.zoom.zoom = this.main.zoom;
			}
		}

		this.main.domEl.style.flexGrow = 1;

		// add min / max on graph
		for ( let label of ["min","max"] )
		{
			if ( !undefined == this._config[ label ] )
			{
				continue;
			}

			this.main.scales.y[ "suggested"+cFL( label ) ] = config[ label ];

			if ( !this.zoom )
			{
				continue;
			}

			this.zoom.scales.y[ "suggested"+cFL( label ) ] = config[ label ];
		}

		if ( true == this._config.csv?.exportable )
		{
			let exportCSV = ()=>{
				let out = [];

				if ( "line" == this.graph.main.config.type )
				{
					out.push ( this._config.channel + this._config.csv.separator + dataset.labels.join ( this._config.csv.separator ) );
					this.graph.main.config.data.datasets.map ( dataset=>{
						out.push ( "" );
						out.push ( dataset.label + this._config.csv.separator + dataset.data.join ( this._config.csv.separator ) );
					})
				}
				else
				{
					this.graph.main.config.data.datasets.map ( dataset=>{
						out.push ( "X" + this._config.csv.separator + dataset.data.map ( d=>d.x ).join ( this._config.csv.separator ) );
						out.push ( dataset.label + this._config.csv.separator + dataset.data.map ( d=>d.y ).join ( this._config.csv.separator ) );
						out.push ( "" );
					})
				}

				out = out.join ( "\n" );

				let downloadLink = document.createElement ( "a" );
				downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI( out );

				let fileName = ( this._config.csv.file )
					? this._config.csv.file+'.csv'
					: "CSV_"+new Date().toISOString()+".csv";

				downloadLink.download = ( true == this._config.csv.prompt )
					? prompt ( "nom du fichier ?", fileName )
					: fileName;

				if ( "null" == downloadLink.download )
				{
					return;
				}

				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			};

			switch ( this._config.csv.export )
			{
				case "event":
				{
					this._callArgs.push ({
						eventType: "in",
						args: {
							event: this._config.csv.event,
							cb: exportCSV,
						}
					});
					break;
				}
				case "button":
				{
					// todo
					break;
				}
			}
		}

		this.update ( );
	}

	_getCallFnct ( config, index, zoomData = {} )
	{
		switch ( this.config.subType )
		{
			case "signal":
			{
				return ( msg )=>{
					const inputs = Els_graph.parseValue ( msg );
					let values = undefined;

					switch ( inputs?.constructor.name )
					{
						case "Array":
						{
							let vXY = inputs.filter ( a=>a.x!=undefined&&a.y!=undefined );
							let vY = inputs.filter ( a=>a.x==undefined&&a.y!=undefined );
							let vN = inputs.filter ( a=>!isNaN( a ) );

							if ( 0 < vXY.length )
							{
								values = vXY;
							}
							else if ( 0 < vY.length )
							{
								values = vY.map ( (v,i)=>{
									v.x = i;
									return v;
								});
							}
							else
							{
								values = vN.map ( (v,i)=>{
									return {x:i, y:v};
								});
							}

							break;
						}
						case "Object":
						{
							if ( undefined == inputs.x?.length
								|| inputs.x?.length != inputs.y?.length )
							{
								return;
							}

							values = [];
							for ( let i = 0; i < inputs.x?.length; i++ )
							{
								values.push ({
									x:inputs.x[ i ],
									y:inputs.y[ i ]
								})
							}

							break;
						}
						default:
						{
							return;
						}
					}

					this.main.datasets[ index ].trueData = values;
					this.main.datasets[ index ].data = values.map ( p=>{
						p.y*=config.coef;
						return p;
					});

					this.main.update ( );
					this.zoom?.update ( );

					this.update ( )
				}
			}
			case "sync":
			{
				return ( msg )=>{
					const input = Els_graph.parseValue ( msg );
					if ( this.graph.main.config.data.datasets[ index ].data.length < this.graph.main.config.data.labels.length  )
					{ // add data only if we add a label for this data
						// add the data to the last label
						if ( config.coef )
						{
							this.graph.main.config.data.datasets[ index ].data[ this.graph.main.config.data.labels.length - 1 ] = input * config.coef;
						}
						else
						{
							this.graph.main.config.data.datasets[ index ].data[ this.graph.main.config.data.labels.length - 1 ] = input;
						}
						this.graph.main.config.data.datasets[ index ].trueData[ this.graph.main.config.data.labels.length - 1 ] = input;
					}

					this.main.update ( );
					this.zoom?.update ( );
				}
			}
			case "async":
			{
				return ( msg )=>{
					let input = Els_graph.parseValue ( msg );

					if ( "Number" == input?.constructor.name )
					{
						input = {
							y: input
						};
					}
					else if ( "Object" != input?.constructor.name )
					{
						return;
					}

					if ( undefined == input.y )
					{
						return;
					}
					else if ( input.x && input.y )
					{ // everything ok
					}
					else if ( "date" == this.config.xAxisType )
					{ // missing X so ad date as X
						input.x = new Date ( );
					}
					else
					{ // missing X and it's not date by default add X as index
						let lentgh = this.graph.main.config.data.datasets[ index ].data.length
						if ( 0 == length )
						{
							input.x = 0;
						}
						else
						{
							input.x = this.graph.main.config.data.datasets[ index ].data[ length - 1 ].x + 1;
						}
					}

					this.graph.main.config.data.datasets[ index ].trueData.push ( {...input} );

					if ( config.coef )
					{
						input.y *= config.coef;
					}

					this.graph.main.config.data.datasets[ index ].data.push ( input );

					let deep = config.deep || this.config.deep;
					if ( ( undefined != deep )
						&& ( this.graph.main.config.data.datasets[ index ].data.length > deep ) )
					{
						this.graph.main.config.data.datasets[ index ].data.splice( 0, this.graph.main.config.data.datasets[ index ].data.length - deep )
					}

					this.main.update ( );
					this.zoom?.update ( );
				}
			}
			default:
			{
				return ( msg )=>{};
			}
		}
	}

	update ( )
	{
		let color = {
			label: ( this.config.textColor )
				? _getColor ( this.config.textColor )
				: undefined,
			grid: ( this.config.gridColor )
				? _getColor ( this.config.gridColor )
				: undefined,
			datasets: this.config?.curve?.map ( c=>{
					return ( c.color )
						? _getColor ( c.color )
						: undefined;
				}),
		};

		this.main.color = color;
		if ( this.zoom )
		{
			this.zoom.color = color;
		}
	}

	get callbacks ( )
	{
		if ( this._callArgs.length )
		{
			return this._callArgs;
		}

		// label callback for sync graphs
		if ( this._config.subType == "sync" )
		{ // in case of sync graph set the X axis data input
			this._callArgs.push ({
				periode: this._config.periode || 0,
				channel: this._config.channel,
				f: (msg)=>{
					let value = Els_graph.parseValue ( msg );
					
					this.main.labels.push ( value * ( this._config.coef || 1 ) );
					
					if ( this.main.labels.length > this._config.deep  )
					{
						let rm = this.main.labels.length - this._config.deep
						this.main.config.data.labels.splice( 0, rm );
						this.main.datasets.map ( d=>d.data.splice ( 0, rm ) );
					}

					this.main.update ( );
					this.zoom?.update ( );
				}
			});
		}

		this._config.curve.map ( (c,i)=>{
			let index = this.main.datasets.length;

			this.main.datasets[index] = {
				label:c.name,
				data:[], // value with coef
				trueData:[], // value without coef applyed (directly from device)
				tension: c.tension || 0.1,
				showLine: c.showLine || true,
				pointRadius: c.pointRadius || 0,
				pointStyle: c.pointStyle || "round"
			};

			if ( c.fill != undefined )
			{
				this.graph.main.config.data.datasets[index].fill = c.fill - i + "";
				this.graph.main.config.data.datasets[index].fillBetweenSet = 0;
			}
			
			this._callArgs.push ({
				channel: c.channel,
				periode: c.periode || 0,
				f: this._getCallFnct ( c, index, this.main.zoom )
			});

			c.coef = 1;
			if ( !this._config.unitCurrent
				&& !c.unit )
			{ // no unit needed
			}
			else if ( !this._config.unitCurrent
				&& c.unit )
			{
				console.error ( "graph element with unit selected but not set globaly" );
			}
			else switch ( c.valueType )
			{
				case "temperature":
				case "volume":
				case "flow":
				{
					for ( let u in c.unit )
					{
						this._config.unitCurrent.event.addEventListener ( u, (event)=>{
							let {coef} = _calcCoef ( c.valueType, c.unit, this._config.unitCurrent );
							c.coef = coef;
							
							switch ( config.subType )
							{
								case "async":
								case "signal":
								{
									// TODO management of c.oef
									for ( let d of this.main.datasets )
									{
										d.data = d.trueData.map( v=>({ x:v.x, y:v.y*c.coef }) );
									}
									break;
								}
								case "sync":
								{
									for ( let d of this.main.datasets )
									{
										d.data = d.trueData.map( v=>v*c.coef );
									}
									break;
								}
							}
						});

						let {coef} = _calcCoef ( c.valueType, c.unit, this._config.unitCurrent );
						c.coef = coef;
					}

					break;
				}
			}
		});

		return this._callArgs;
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			subType: {
				fnct: _createSelect,
				args: [ this._choices.subType, "Graph type" ],
				value: config?.subType,
				help: "- sync : \n- signal : \n- async",
				onchange: (ev)=>{
					json.subType = ev.target.value;
					if ( "sync" == json.subType )
					{
						divs.sub.channel.div.style.display = "flex";
						json.channel = divs.sub.channel.input.value;
					}
					else
					{
						divs.sub.channel.div.style.display = "none";
						delete json.channel;
					}

					Els_Back.newJson ( json, divs.json, divs.outObj );
				}
			},
			nbCurves: {
				fnct: _createInput,
				args: [ "Nb of Curves" ],
				type: "number",
				min: 0,
				onchange: (ev)=>{}
			},
			deep: {
				fnct: _createInput,
				args: [ "nb of points displayed" ],
				type: "number",
				min: 0,
			},
			xAxisType: {
				fnct: _createSelect,
				args: [ [ "std", "date" ], "X axis type" ],
				value: config?.xAxisType,
				min: 0,
			},
			gridColor:{
				fnct: _createColorClicker,
				args: [{
					type: "div",
					label: "Color",
					color: json.gridColor,
					callback: (ev,color)=>{
						json.gridColor = "rgba("+color.join(',')+")";
						Els_Back.newJson ( json, divs.json, divs.outObj );
					},
				}]
			}
		},
		params.confItem);

		let divs = this.parent.new ( params, json, deep + 1 );

		try
		{
			_createTable ( divs, {
				cols:[
					{text:"name"},
					{text:"channel"},
					{text:"color"},
					{text:"coef",               type:"numbrer"},
					{text:"tension",            type:"numbrer"},
					{text:"lines",id:"showLine",type:"checkbox"},
				],
				input: "nbCurves",
				dataPath: "curve",
				json: json,
			} );
		}
		catch ( e )
		{
			console.log ( e )
		}

		return divs;
	}
}

class Els_csv extends Els_Back {
	#defaultConfig = {
		type:"csv",
		separator:",", // séparateur utilisé pour la génération du CSV
		title:'Download CSV',
		prompt: true, // demande le nom du fichier de sortie
		file: undefined, // nom du fichier de sortie
		periode: 0, // période of data transmission
		max:{ // pour eviter l'augmentation infinie de la taille du CSV
			size: 10 * 1000 * 1000, /// taille maximun du CSV en octet si le champ de telechargement recurent n'est pas configuré
			time: 1, // temps maximum d'enregistrement (h)
			line: 7200, // nombre maximum de ligne enregistré dans le CSV
		},
		download: false,
		limitSelected: undefined, // "line" / "time" / "size"
		channel:{
			// type:"channel", // "obj" / "channel" get one obect what content everything or each dat as i own channel
			// synchro:"CHANNEL TIME", // channel de synchro (horodatage)
			// title:"chrono", // titre de la colone de synchro dans le CSV
			// data:["DATA_1","DATA_2"], // channels de donnés
			// titles:["TItle 1","Title 1"] // titres des colonnes dans le CSV
		}
	}

	constructor ( config, id )
	{
		super( config, id );

		this._config = _objMerge ( this.#defaultConfig, this._config );

		this.csv = undefined;
		this.id = Math.random ( ) + "_csv";

		this.title = document.createElement ( "h3" );
		this._domEl.appendChild ( this.title );
		this.title.innerHTML = this._config.title;

		this.table = document.createElement ( "table" );
		this.table.style.height = "auto";
		this._domEl.appendChild ( this.table );

		{ // table header
			let line = document.createElement ( "tr" );
			let cell = document.createElement ( "th" );
			line.appendChild ( cell );
			cell.colSpan = 3;
			cell.innerText = "Limit selection"
			cell.style.paddingLeft = "5%";
			cell.style.textAlign = "left";

			let span = document.createElement ( "span" );
			cell.appendChild ( span );
			span.style.float = "right";
			span.classList.add ( "right" );
			this.cellLimits = document.createElement ( "span" );
			span.appendChild ( this.cellLimits );
			this.cellLimits.classList.add ( "data" );

			this.table.appendChild ( line );
		}

		this.tableConfig = [
			{name:"size",label:"Size (Mo)"},
			{name:"time",label:"Time (h)"},
			{name:"line",label:"Line"},
		];

		for ( let item of this.tableConfig )
		{
			let line = document.createElement ( "tr" );
			
			let cell = document.createElement ( "td" );
			line.appendChild ( cell );
			cell.innerText = item.label;

			cell = document.createElement ( "td" );
			line.appendChild ( cell );
			item.input = document.createElement ( "input" );
			cell.appendChild ( item.input );
			item.input.type = "number";
			item.input.placeholder = item.label;

			if ( item.name == "size" )
			{
				item.input.value = this._config?.max?.[ item.name ] / 1000 / 1000 || "";
			}
			else
			{
				item.input.value = this._config?.max?.[ item.name ] || "";
			}
			
			cell = document.createElement ( "td" );
			line.appendChild ( cell );
			item.radio = document.createElement ( "input" );
			cell.appendChild ( item.radio );
			item.radio.type = "radio";
			item.radio.name = this.id;
			
			this.table.appendChild ( line );
		}

		{ // table footer
			let line = document.createElement ( "tr" );
			let cell = document.createElement ( "td" );
			line.appendChild ( cell );
			cell.colSpan = 2;
			cell.innerText = "Auto download at limit:"

			cell = document.createElement ( "td" );
			line.appendChild ( cell );
			let input = document.createElement ( "input" );
			cell.appendChild ( input );
			input.type = "checkbox";
			input.checked = this._config.download;

			input.addEventListener ( "change", (ev)=>{
				this.download = ev.target.checked;
			});

			this.table.appendChild ( line );
		}

		[this.divDownload,this.download] = _createIconButton ( "Download", "download" );
		this._domEl.appendChild ( this.divDownload );

		[this.divClean,this.clean] = _createIconButton ( "Clean log", "trash" );
		this._domEl.appendChild ( this.divClean );

		// init what limit should be used following config
		if ( this._config.limitSelected )
		{
			let el = this.tableConfig.filter ( t=>t.name == this._config.limitSelected );
			if ( undefined == el.length )
			{
				this.tableConfig[ 0 ].radio.checked = true;
			}
			else
			{
				el[ 0 ].radio.checked = true;
			}

			delete this._config.limitSelected;
		}
		else
		{
			this.tableConfig[ 0 ].radio.checked = true;
			this._config.limitSelected = this.tableConfig[ 0 ].name;
		}

		// radio event to select what limit is used
		for ( let item of this.tableConfig )
		{
			item.radio.addEventListener ( "change", (ev)=>{
				this.limit = item;
				this.#checkLimit ( );
			});

			item.input.addEventListener ( "change", (ev)=>{
				switch ( item.name )
				{
					case "size":
					{
						this._config.max.size = ev.target.value * 1000 * 1000;
						break;
					}
					case "time":
					case "line":
					{
						this._config.max[ item.name ] = ev.target.value
						break;
					}
				}
			});
		}

		this.limit = this.tableConfig[ 0 ];
		this.#checkLimit ( );

		this.entryDate = [];

		this.csv = {};

		this._callArgs.push ( ...this._callbacks );

		this.clean.addEventListener ('click', ()=>{
			this.#cleanData ( );
		});

		this.download.addEventListener ('click', ()=>{
			this.#saveData ( );
		});
	}

	#removeOneLine ( )
	{
		let keys = Object.keys ( this.csv );
		if ( keys[ 0 ] != this.lastIndex )
		{
			delete this.csv[ keys[ 0 ] ];
		}
	}

	#checkLimit ( )
	{
		if ( !this.csv )
		{
			return;
		}

		let keys = Object.keys ( this.csv );
		let size = _getSize ( this.csv[ keys[ 0 ] ] ) * keys.length;

		switch ( this.limit.name )
		{
			case "time":
			{
				let dateThresold = new Date ( new Date ( ).getTime ( ) - this._config.max.time * 60 * 60 * 1000 );

				let toOld = this.entryDate.filter ( e=>e.date < dateThresold )
					.map ( e=>e.index );

				if ( !toOld.length )
				{
					break;
				}
				else if ( this.download == true )
				{
					this.#saveData ( false );
					break;
				}
				else
				{
					toOld.map ( item=>delete this.csv[ item ] );
				}
				break;
			}
			case "size":
			{
				// we know the data max size is equivalent to the size of first line multiply by number of line,
				// we don't calc the size of full object to avoid function time increase following number of line
				if ( size < this._config.max.size )
				{
				}
				else if ( this.download == true )
				{
					this.#saveData ( false );
					break;
				}
				else while ( size > this._config.max.size )
				{
					this.#removeOneLine ( );
					keys.shift ( );

					size = _getSize ( this.csv[ keys[ 0 ] ] ) * keys.length;
				}
				break;
			}
			case "line":
			{
				if ( ( undefined == keys.length )
					&& keys.length < this._config.max.line )
				{
				}
				else if ( keys.length < this._config.max.line )
				{
				}
				else if ( this.download == true )
				{
					this.#saveData ( false );
					break;
				}
				else while ( keys.length > this._config.max.line )
				{
					this.#removeOneLine ( );
					keys.shift ( );
				}
				break;
			}
		}

		// clear entryDate, keep only exiting entry from csv
		this.entryDate = this.entryDate.filter ( e=>this.csv[ e.index ] != undefined );

		let p = getSIPrefix ( size );

		function pad(d) {
			return (d < 10) ? '0' + d.toString() : d.toString();
		}

		this.cellLimits.innerText = keys.length + "L / " + p.value.toFixed ( 2 ) + p.label + "o" + "\nH:M:S ";

		// time limit
		let time = new Date ( ).getTime ( ) - this.entryDate[ 0 ].date.getTime ( );
		time = Math.floor ( time / 1000 );
		let str = pad ( time % 60 ); // seconds
		time = Math.floor ( time / 60 );
		str = pad ( time % 60 ) + ":" + str; // minutes
		time = Math.floor ( time / 60 );
		str = pad ( time ) + ":" + str; // hours

		this.cellLimits.innerText += str
	}

	#saveData ( callPrompt = this._config.prompt )
	{
		function getValuesFromObj ( obj )
		{
			switch ( obj.constructor.name )
			{
				case "Object":
				{
					return getValuesFromObj ( Object.values ( obj ) );
				}
				case "Array":
				{
					return obj
						.map ( e=>{
							switch ( e.constructor.name )
							{
								case "Object":
								{
									return getValuesFromObj ( Object.values ( e ) );
								}
								case "Array":
								{
									return getValuesFromObj ( e );
								}
								default:
								{
									return e;
								}
							}
						})
						.flat ( Infinity )
				}
				default:
				{
					console.log ( "CSV can't manage this data" )
					console.log ( obj );
					return [];
				}
			}
		}

		let keys = "";
		let out = [];

		for ( let k in this.csv )
		{
			if ( k == this.lastIndex )
			{
				continue;
			}
			let data = this.csv[ k ];
			delete this.csv[ k ];
			this.entryDate.splice ( this.entryDate.map ( e=>e.index ).indexOf ( k ), 1 );

			out.push ( k+this._config.separator+getValuesFromObj ( data ).join ( "," ) );
		}
		let tKeys = Object.keys ( this.csv );

		// clear the entries dates
		this.entryDate = this.entryDate.filter ( e=>tKeys.includes ( e.index ) );

		keys = (this._config.channel.title || this._config.channel.synchro || "index") + this._config.separator;

		// create the columnt headers
		if ( this._config.channel.titles )
		{
			keys += this._config.channel.titles.join ( this._config.separator )
		}
		else
		{
			keys += this._config.channel.data.join ( this._config.separator );
		}
		out.unshift ( keys );

		out = out.join ( "\n" );

		let downloadLink = document.createElement ( "a" );
		downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI( out );

		let fileName = ( this._config.file )
			? this._config.file+'.csv'
			: "CSV_"+new Date().toISOString()+".csv";

		downloadLink.download = ( true == callPrompt )
			? prompt ( "nom du fichier ?", fileName )
			: fileName;

		if ( "null" == downloadLink.download )
		{
			return;
		}

		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	#cleanData ( )
	{
		this.csv = {};
	}

	// return callbacks
	get _callbacks ( )
	{
		function getLabelsFromObj ( obj, prefix = [] )
		{
			switch ( obj.constructor.name )
			{
				case "Array":
				{
					return obj.map ( (subObj, i)=>getLabelsFromObj ( subObj, [ ...prefix, i ] ) );
				}
				case "Object":
				{
					let tmp = Object.keys ( obj )
						.map ( k=>{
							if ( [ "Object", "Array" ].includes ( obj[ k ].constructor.name ) )
							{
								return getLabelsFromObj ( obj[ k ], [ ...prefix, k ] );
							}
							else
							{
								return [ ...prefix, k ].join ( "." );
							}
						})

					return tmp.flat ( Infinity );
				}
			}
		}

		switch ( this._config.channel.type )
		{
			default:
			case "channel":
			{
				let out = [{
						periode: this._config.periode,
						channel: this._config.channel.synchro,
						f: (msg)=>{
							if ( this.config.coef )
							{
								this.lastIndex = msg.value * this.config.coef;
							}
							else
							{
								this.lastIndex = msg.value;
							}

							this.csv[ this.lastIndex ] = [];

							this.entryDate.push ( {date:new Date ( ), index:this.lastIndex} );

							this.#checkLimit ( );
						}
					}];

				for ( let [i,c] of this._config.channel.data.entries() )
				{
					out.push ({
						periode: this._config.periode,
						channel: c,
						f: (msg)=>{
							if ( ( undefined != this.lastIndex )
								&& ( this.csv?.[ this.lastIndex ] ) )
							{
								this.csv[ this.lastIndex ][ i ] = msg.value;
							}
						}
					});
				}

				return out;
			}
			case "obj":
			{
				return [{
						periode: this._config.periode,
						channel: this._config.channel.data,
						f: (msg)=>{
							if ( undefined == this.lastIndex )
							{
								this.lastIndex = 0;

								this._config.channel.titles = getLabelsFromObj ( msg.value );
							}
							else
							{
								this.lastIndex++;
							}

							this.csv[ this.lastIndex ] = Object.values ( msg.value );

							this.entryDate.push ( {date:new Date ( ), index:this.lastIndex} );

							this.#checkLimit ( );
						}
					}]
			}
		}
	}

	update ( config )
	{
		this._update ( config );
	}

	static canCreateNew ( )
	{
		return false;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = _objMerge ( this.#defaultConfig, {
			channel:{
				synchro:"WS_DATA_CHANNEL", // channel de synchro (horodatage)
				title:"chrono", // titre de la colone de synchro dans le CSV
				data:[], // channels de donnés
				titles:[] // titres des colonnes dans le CSV
			}
		});

		json = _objMerge ( json, config );

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let [divCha,sCha] = _createInputArray ( "Sync Data", params.channels );
			configDiv.appendChild ( divCha );
			sCha.value = json.channel.synchro || "";
			sCha.onchange = (ev)=>{
				json.channel.synchro = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sCha.onkeyup = sCha.onchange;

			let [divSLa,sSLa] = _createInput ( "Sync Label" );
			configDiv.appendChild ( divSLa );
			sSLa.value = json.channel.title || "";
			sSLa.onchange = (ev)=>{
				json.channel.synchro = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sSLa.onkeyup = sSLa.onchange;

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			sPer.value = json.periode;
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				Els_Back.newJson ( json, jsonDiv );
			}
			sPer.onkeyup = sPer.onchange;

			let [divSep,iSep] = _createInput ( "CSV Sep." );
			configDiv.appendChild ( divSep );
			iSep.value = json.separator;
			iSep.style.textAlign = "center";
			iSep.onchange = (ev)=>{
				ev.target.value = ev.target.value.substring ( 0, 1 );
				json.separator = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iSep.onkeyup = iSep.onchange;

			let [divName,iName] = _createInput ( "Name" );
			configDiv.appendChild ( divName );
			iName.placeholder = "CSV_"+new Date ( 0 ).toISOString ( )+".csv";
			iName.value = json.value || "";
			iName.onchange = (ev)=>{
				json.file = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iName.onkeyup = iName.onchange;

			let [divTitle,iTitle] = _createInput ( "Title" );
			configDiv.appendChild ( divTitle );
			iTitle.placeholder = "Column title";
			iTitle.title = "splited by coma (,)";
			iTitle.value = json.channel.titles.join ( "," );
			iTitle.onchange = (ev)=>{
				json.channel.titles = ev.target.value.split ( json.separator );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iTitle.onkeyup = iTitle.onchange;

			let [divDat,iDat] = _createInputArray ( "Data", params.channels, true );
			configDiv.appendChild ( divDat );
			iDat.placeholder = "Column data channels";
			iDat.title = "splited by coma (,)";
			iDat.value = json.channel.data.join ( "," );
			iDat.onchange = (ev)=>{
				json.channel.data = ev.target.value.split ( "," );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iDat.onkeyup = iDat.onchange;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				sCha.value = json.channel.synchro || "";
				sSLa.value = json.channel.title || "";
				sPer.value = json.periode;
				iSep.value = json.separator;
				iTitle.value = json.channel.titles.join ( "," );
				iDat.value = json.channel.data.join ( "," );
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
			}
			jsonDiv.onkeyup = jsonDiv.onchange;

			let outDiv = Els_Back._newOut ( params.id, json );

			return { config:configDiv, json:jsonDiv, out:outDiv._domEl };
		}
		catch ( e )
		{
			return undefined
		}
	}
}

class Els_button extends Els_Back {
	static _defaultConfig = {
		type: "button",
		options:[
			{
				label: "X",
				text: "Y",
				cmd: "myCmd",
				event: undefined,
			}
		]
	}

	constructor ( config, id )
	{
		super( config, id );

		this._config = _objMerge ( Els_button._defaultConfig, this._config );

		this._tab = [];
		this.update ( );
	}

	update ( config )
	{
		if ( config )
		{
			this._config = config;
		}

		if ( undefined == this._config?.options )
		{
			return;
		}

		while ( this._domEl.childElementCount > this._config?.options?.length )
		{
			this._domEl.removeChild ( this._domEl.lastChild );
			this._tab.pop ( );
		}

		for ( let i = 0; i < this._domEl.childElementCount; i++ )
		{
			this._tab[ i ].label.innerText = this._config.options[ i ].label || "";
			this._tab[ i ].button.innerText = this._config.options[ i ].text || "X";
		}

		for ( let i = this._domEl.childElementCount; i < this._config?.options?.length; i++ )
		{
			let ret = this.#createButton ( this._config.options[ i ] );

			let cb = {
				eventType: "out",
				args: {
					domEl: ret.obj.button,
					args: this._config.options[ i ]?.arg,
					event: this._config.options[ i ]?.event,
					cmd: this._config.options[ i ]?.cmd,
				}
			};

			this._tab[ i ] = ret.obj;
			this._callArgs.push ( cb );

			this._domEl.appendChild ( ret.obj.div );
		}

		this.#updateCSSFlex ( );

		if ( 1 >= this._config?.options.length )
		{
			Object.assign ( this._domEl.style, {
				display: "flex",
				flexDirection: "column",
			});
		}
		else
		{
			Object.assign ( this._domEl.style, {
				display: "flex",
				flexDirection: "row",
			});
		}
	}

	#updateCSSFlex ( )
	{
		for ( let t of this._tab )
		{
			t.div.style.flexDirection = (1 >= this._tab.length)?"row":"column";
		}
	}

	#createButton ( config )
	{
		let obj = {
			div: document.createElement ( "div" ),
			label: document.createElement ( "span" ),
			button: document.createElement ( "button" ),
		}

		obj.div.appendChild ( obj.label );
		obj.div.appendChild ( obj.button );

		obj.label.style.flexGrow = 1;
		obj.button.style.flexGrow = 1;

		obj.label.innerText = config.label?.txt || "";
		obj.button.innerText = config.button?.txt || "X";

		this._update ( config.label, obj.label );
		this._update ( config.button, obj.button );

		Object.assign ( obj.div.style, {
			display: "flex",
			alignItems: "strech",
			textAlign: "center",
			flexGrow: "1",
		});

		return {obj};
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined, deep = 0 )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = undefined;
		if ( deep )
		{ // if not first call (deep!=0) then config no need to be check (check previously in child class)
			json = config;
		}
		else
		{
			json = _objMerge ( Els[ params.class ]._defaultConfig, config );
		}

		if ( !params.confItem )
		{
			params.confItem = {};
		}

		params.confItem = Object.assign ({
			nbButtons: {
				fnct: _createInput,
				args: [ "Nb of Buttons" ],
				type: "number",
				min: 0,
				style: {
					width: "5em",
				},
				onchange: (ev)=>{
					console.log ( 'coucou' );
				}
			}
		},
		params.confItem);

		let divs = this.parent.new ( params, json );

		_createTable ( divs, {
			cols: [
				{text:"label"},
				{text:"text"},
				{text:"cmd"},
				{text:"event"},
				{text:"arg"}
			],
			input: "nbButtons",
			dataPath: "options",
			json: json
		} );

		return divs;
	}
}

const Els = {
	title: Els_title,
	text: Els_text,
	img: Els_img,
	title_id: Els_title_id,
	text_id: Els_text_id,
	map: Els_map,
	io: Els_io,
	bin: Els_bin,
	multi: Els_multi,
	gauge: Els_gauge,
	table: Els_table,
	dinTable: Els_dinTable,
	log: Els_log,
	svg: Els_svg,
	graph: Els_graph,
	csv: Els_csv,
	button: Els_button,
	input: Els_input,
	select: Els_select,
};

export default Els;

function _createTranslateItem ( out, config )
{
	let json = {
		textId: config?.text_id,
		prefix: config?.prefix
	};

	let span = document.createElement ( "span" )
	span.classList.add ( "translate" );
	span.dataset.translate = JSON.stringify ( json );
	out.appendChild ( span )
}

/// \brief Create select entry
/// \param [ in ] array : array of String what represent the option list
/// \return [div,select]
///     div : main object need to be added to the DOM list
///     select : DOM element used to add event listener
function _createSelect ( array = [], inlabel )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	label.innerHTML = ( inlabel || "Data" ) + " : ";

	let select = document.createElement ( "select" );

	for ( let c of array )
	{
		let option = document.createElement ( "option" );
		option.value = c;
		option.innerHTML = c;
		select.appendChild ( option );
	}

	div.appendChild ( label );
	div.appendChild ( select );

	return [div,select];
}

/// \brief Create a text node
/// \param [ in ] str : string to display
/// \return [div,label]
///     div : main object need to be added to the DOM list
///     label : DOM element with str
function _createText ( str )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createTextNode ( str );
	div.appendChild ( label );

	return [div,label];
}

/// \brief Create input entry with eventualy label and select on the right
///     the select add/update value into the input field
/// \param [ in ] inText : label of entry
/// \param [ in ] array : array of String what represent the option list
/// \param [ in ] multiple : allow to use select to add element to entry no replace
/// \return [div,input]
///     div : main object need to be added to the DOM list
///     input : DOM element used to add event listener
function _createInputArray ( inText, array = [], multiple = false )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	if ( undefined != inText )
	{
		let label = document.createElement ( "label" );
		label.innerHTML = inText+" : ";
		
		div.appendChild ( label );
	}

	let input = document.createElement ( "input" );
	div.appendChild ( input );

	if ( "Array" == array?.constructor.name )
	{
		let list = document.createElement ( "select" );
		div.appendChild ( list );
		list.style.width = "0.9em";

		for ( let index in array )
		{
			let option = document.createElement ( "option" );
			option.value = array[ index ].label;
			option.innerHTML = array[ index ].label;
			list.appendChild ( option );
		}

		list.onchange = (ev)=>{
			if ( multiple )
			{
				if ( input.value.length )
				{
					input.value = input.value.trim ( );
					input.value += ","
				}
				else
				{
				}
				input.value += ev.target.value
			}
			else
			{
				input.value = ev.target.value
			}

			input.dispatchEvent ( new Event ( "change" ) );
		}
	}

	return [div,input];
}

/// \brief Create input entry with eventualy label and select on the right
///     the select add/update value into the input field
/// \param [ in ] periodes : array of time (Number) or object with label / value
/// \return [div,input]
///     div : main object need to be added to the DOM list
///     input : DOM element used to add event listener
function _createSelectPeriode ( periodes )
{
	switch ( periodes?.constructor.name )
	{
		case undefined:
		{
			periodes = [
				{label:"event",value:0},
				{label:"1 s",value:1},
				{label:"2 s",value:2},
				{label:"10 s",value:3},
			];
			break;
		}
		case "Array":
		{
			break;
		}
		default:
		{
			throw "unmanaged type of periodes";
		}
	}

	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	div.appendChild ( label );
	label.innerHTML = "Timming : ";

	let select = document.createElement ( "select" );
	div.appendChild ( select );

	for ( let p of periodes )
	{
		let option = document.createElement ( "option" );
		select.appendChild ( option );

		if ( "Object" == p?.constructor.name )
		{
			option.value = p.value;
			option.innerHTML = p.label;
		}
		else
		{
			option.value = p;
			option.innerHTML = p;
		}
	}


	return [div,select];
}

/// \brief Create input entry with eventualy label and list of availables entries
/// \param [ in ] inLabel : label of entry
/// \param [ in ] option : array of String what represent the availables entries
/// \return [div,input]
///     div : main object need to be added to the DOM list
///     input : DOM element used to add event listener
function _createInput ( inLabel, option = undefined )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	if ( inLabel )
	{
		let label = document.createElement ( "label" );
		div.appendChild ( label );
		label.innerHTML = inLabel+" : ";
	}

	let input = document.createElement ( "input" );
	div.appendChild ( input );

	if ( undefined == option )
	{
		return [div,input];
	}

	switch ( option.constructor.name )
	{
		case "Array":
		{
			let dataList = document.createElement ( "datalist" );
			div.appendChild ( dataList );
			dataList.id = "fh_"+Math.random()+"_"+Math.random();

			input.setAttribute("list", dataList.id);

			for ( let o of option )
			{
				let tmp = document.createElement ( "option" );
				dataList.appendChild ( tmp );
				tmp.value = o;
			}
			break;
		}
	}

	return [div,input];
}

/// \brief Create a button entry with eventualy label
/// \param [ in ] inLabel : label of entry
/// \param [ in ] iconName : name of symbol from CSS : https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
/// \return [div,button]
///     div : main object need to be added to the DOM list
///     button : DOM element used to add event listener
function _createIconButton ( inLabel, iconName )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	div.appendChild ( label );
	label.innerHTML = inLabel+" : ";
	label.style.flexGrow = 1;

	let button = document.createElement ( "button" );
	div.appendChild ( button );
	button.classList.add ( "fa" );
	button.classList.add ( "fa-"+iconName );
	button.style.minWidth = "1.5em";

	return [div,button];
}

/// \brief Create a color picker
/// \param [ in ] params : object with configuration informations
///     {
///         type: "div"/"td",         // main domEl type
///         callback: (ev,color)=>{}, // callback function used once a color was selected
///         label: "String",          // label
///         color:"rgba(255,0,0,1)"   // default color
///     }
/// \return [div,button]
///     div : main object need to be added to the DOM list
///     iColor : DOM element used to add event listener
function _createColorClicker ( params = {} )
{
	params = Object.assign ( {
		type: "div",
		callback: undefined,
		label: undefined,
	}, params );

	let div = document.createElement ( params.type );
	if ( params.type != "td" )
	{
		div.style.display = "flex";
	}

	if ( params.label )
	{
		let label = document.createElement ( "label" );
		div.appendChild ( label );
		label.innerHTML = params.label+" : ";
		label.style.flexGrow = 1;
	}

	let iColor = document.createElement ( "div" );
	div.appendChild ( iColor );
	iColor.style.height = "1em";
	iColor.style.borderColor = "var( --main-border )";
	iColor.style.borderWidth = "1px";
	iColor.style.borderStyle = "solid";
	iColor.style.width = "100%";
	iColor.style.backgroundColor = params.color || "";

	if ( params.callback )
	{
		iColor.onclick = (ev)=>{colorClicker(ev, params.callback)};
	}

	return [div,iColor];
}

/// \brief Create a table color
/// \param [ in ] divs :
///     {
///         config,
///         json,
///         outObj
///     }
/// \param [ in ] json :
///     {
///         [ arrayId ]: []
///     }
function _createColorLimitTable ( divs, json, params = {} )
{
	Els_Debug ( json )

	if ( !params.array )
	{
		params.array = json.color
	}

	if ( !params.limit )
	{
		params.limit = "right";
	}

	if ( params.limit == "right" )
	{
		params.min = 2;
		params.calcAdd = (value)=>{
			value  = value * 2 + 1 -  params.array.length;
		};
		params.titles = [ "color", "limit" ];
		params.tableLength = ()=>{return iNb.value * 2 + 1};
	}
	else
	{
		params.min = 0;
		params.calcAdd = (value)=>{
			value -= params.array.length;
		}
		params.titles = [ "limit", "color" ];
		params.tableLength = ()=>{return iNb.value * 2 - 1};
	}

	let length = params.array.filter ( v=>!isNaN ( v ) ).length;

	let [divNb,iNb] = _createInput ( "limits nb" );
	divs.config.appendChild ( divNb );
	iNb.value = length;
	iNb.type = "number";
	iNb.min = params.min;
	iNb.step = 1;
	iNb.onchange = (ev)=>{
		if ( ev.target.value < ev.target.min )
		{
			ev.target.value = ev.target.min;
		}

		let add = params.calcAdd ( ev.target.value );

		if ( add > 0 )
		{
			params.array.push ( new Array( add ) );
		}
		else
		{
			params.array.splice ( -add );
		}

		feedTable ( );
	};

	let table = document.createElement ( "table" );
	divs.config.appendChild ( table );
	table.style.width = "100%";

	let thead = document.createElement ( "thead" );
	table.appendChild ( thead );

	thead.appendChild ( createLine ( params.titles ) )

	let tbody = document.createElement ( "tbody" );
	table.appendChild ( tbody );

	feedTable ( );

	function feedTable ( )
	{
		let creatCellLimit = ( index )=>{
			let td = document.createElement ( "td" );
			td.rowSpan = 2;

			let input = document.createElement ( "input" );
			td.appendChild ( input );
			input.type = "number";
			input.value = Number ( params.array[ index ] );
			input.style.height = "40px";
			input.onchange = (ev)=>{
				params.array[ index ] = Number ( ev.target.value );

				params.array.map ( (v,i,a)=>{
					if ( isNaN ( v ) )
					{
						return;
					}

					if ( i < index )
					{
						if ( a[ i ] > a[ index ] )
						{
							a[ i ] = a[ index ];
						}
					}
					else
					{
						if ( a[ i ] < a[ index ] )
						{
							a[ i ] = a[ index ];
						}
					}
				} )
				Els_Back.newJson ( json, divs.json, divs.outObj );

				feedTable ( );
			};

			return td;
		};

		let creatColor = ( index )=>{
			let [divColor,iColor] = _createColorClicker ( {
				callback: (ev,color)=>{
					params.array[ index ] = "rgba("+color.join(',')+")";
					Els_Back.newJson ( json, divs.json, divs.outObj );
				},
				type: "td",
				color: params.array[ index ],
			} );
			iColor.style.height = "40px";

			divColor.rowSpan = 2;

			return divColor;
		};

		while ( tbody.firstChild )
		{
			tbody.removeChild ( tbody.firstChild );
		}

		for ( let index = 0; index < params.tableLength ( ); index++ )
		{
			let tr = document.createElement ( "tr" );
			tr.style.height = "20px";

			let colIndex = index % 2;

			switch ( params.titles[ colIndex ] )
			{
				case "limit":
				{
					tr.appendChild ( creatCellLimit ( index ) );

					break;
				}
				case "color":
				{
					tr.appendChild ( creatColor ( index ) );

					break;
				}
			}

			if ( index == 0 )
			{
				tr.appendChild ( document.createElement ( "td" ) );
			}

			tbody.appendChild ( tr );
		}
		
		let tr = document.createElement ( "tr" );
		tbody.appendChild ( tr );

		let td = document.createElement ( "td" );
		tr.appendChild ( td );
	}

	function createLine ( array )
	{
		let tr = document.createElement ( "tr" );
		for ( let str of array )
		{
			let td = createCell ( str );
			tr.appendChild ( td );
		}
		return tr;
	}

	function createCell ( str )
	{
		let td = document.createElement ( "td" );
		td.appendChild ( document.createTextNode ( str ) );
		return td;
	}
}



function _calcCoef ( type, baseUnit, currentUnit )
{
	let coef = 1;
	let print = "";
	let offset = 0;

	switch ( type )
	{
		case "volume":
		{
			if ( currentUnit
				&& baseUnit )
			{
				coef = volumeConvert ( 1,
					currentUnit.volume || currentUnit,
					baseUnit.volume || baseUnit )
			}
			break;
		}
		case "flow":
		{
			if ( currentUnit
				&& baseUnit )
			{
				coef = volumeConvert ( 1, currentUnit.flow_v, baseUnit.flow_v ) / timeConvert ( 1, currentUnit.flow_t, baseUnit.flow_t )
			}

			if ( currentUnit )
			{
				print = (currentUnit.flow_v || "?") + "/" +(currentUnit.flow_t || "?");
			}
			else if ( baseUnit )
			{
				print = (baseUnit.flow_v || "?") + "/" +(baseUnit.flow_t || "?");
			}
			break;
		}
		case "temperature":
		{
			offset = temperatureConvert ( 0,
				currentUnit.temperature || currentUnit,
				baseUnit.temperature || baseUnit );

			if ( currentUnit
				&& baseUnit )
			{
				coef = temperatureConvert ( 1,
					currentUnit.temperature || currentUnit,
					baseUnit.temperature || baseUnit )
					- offset;
			}

			if ( baseUnit )
			{
				print = "°" + currentUnit;
			}
			break;
		}
	}
	return {coef,print,offset}
}

/// \brief Create a debounce methode to avoid multiples events
/// \param[ in ] id : string
/// \param[ in ] cb : callback function
/// \param[ in ] arg : callback function arg
/// \param[ in ] delay : delay before function call
let Els_debounce = {};
function _debounceEvent ( id, cb, arg, delay = 100 )
{
	if ( Els_debounce[ id ] )
	{
		clearTimeout ( Els_debounce[ id ].timeout )
		Els_debounce[ id ].args.push ( arg )
	}
	else
	{
		Els_debounce[ id ] = {
			timeout: undefined,
			args: [ arg ],
			cb: cb
		};
	}

	Els_debounce[ id ].timeout = setTimeout ( ()=>{
		let ev = new Event ( id )
		ev.args = Els_debounce[ id ].args;

		Els_debounce[ id ].cb ( arg );

		delete Els_debounce[ id ]
	}, delay );
}

/// \brief Merge two elements to e new one
/// \param[ in ] obj1 : base object 
/// \param[ in ] obj2 : second object
/// \note if obj1.foo and obj2.foo exist obj2 will overwrite obj1 in the new one
/// \note be care obj1 use a deep copy, obj2 overwrite it with shadowcopy
function _objMerge ( obj1, obj2 )
{
	let d = {...obj1};

	for ( let s in obj2 )
	{
		switch ( obj2[s]?.constructor.name )
		{
			case "Object":
			{
				if ( !d[s] )
				{ // if property doesn't exist deep cpy
					d[s]=obj2[s];
				}
				else
				{
					d[s] = _objMerge ( obj1[s], obj2[s] );
				}
				break;
			}
			case "Array":
			{
				d[s]=obj2[s];
				break;
			}
			default:
			{
				console.log( obj2[s].constructor.name )
			}
			case 'Boolean':
			case 'Number':
			case 'String':
			{
				d[s]=obj2[s];
				break;
			}
			case undefined:
			{
				break;
			}
		}
	}

	return d
}

/// \brief function to return color, can be name : "red", or code : "#f000" or a var : "--color1"
/// \param[ in ] txt: text color
/// \return color
function _getColor ( txt )
{
	let color = txt;
	if ( 0 == color?.indexOf ( "--" ) )
	{
		color = getComputedStyle(document.body).getPropertyValue(color)
	}
	return color;
}

function _getSize ( object )
{
	const objectList = [];
	const stack = [object];
	let bytes = 0;

	while (stack.length)
	{
		const value = stack.pop();

		switch ( typeof value )
		{
			case 'boolean':
			{
				bytes += 4;
				break;
			}
			case 'string':
			{
				bytes += value.length * 2;
				break;
			}
			case 'number':
			{
				bytes += 8;
				break;
			}
			case 'object':
			{
				if (!objectList.includes(value))
				{
					objectList.push(value);
					for (const prop in value)
					{
						if (value.hasOwnProperty(prop))
						{
							stack.push(value[prop]);
						}
					}
				}
				break;
			}
			default:
			{
				console.log ( value, typeof value );
				break;
			}
		}
	}

	return bytes;
}



/// params [ in ] outDivs : return from this.parent.new ( ... ) -> ( Els_back.new ( ... ) )
/// params [ in ] params : obect with parameters
/// {
/// 	json : json data printed in outDivs.json
/// 	input : <id> of element used as nb row selector object found in outDivs.sub[ id ]
/// 	dataPath : <path> path of data in param where data stored (as array)
/// 	cols : array of object that describe table
/// 		obj : {
// 				text:"Sttring",
// 				type: "text"/"number"/"checkbox",
// 				id: "String",
// 			} 
/// }
function _createTable ( outDivs = {}, params )
{
	try
	{
		let tab = document.createElement ( "table" );
		outDivs.config.appendChild ( tab );
		tab.style.width = "100%";
		tab.style.tableLayout = "fixed";

		let thead = document.createElement ( "thead" );
		tab.appendChild ( thead );

		let tr = document.createElement ( "tr" );
		thead.appendChild ( tr );

		for ( let item of params.cols )
		{
			let cell = document.createElement ( "th" );
			tr.appendChild ( cell );

			cell.innerText = item.text;
			cell.title = item.help || item.text;
		}

		let tbody = document.createElement ( "tbody" );
		tab.appendChild ( tbody );

		if ( ( !params.input )
			|| ( !outDivs.sub?.[ params.input ]?.input ) )
		{
			return;
		}

		let nbRowDom = outDivs.sub[ params.input ].input;
		let data = params.json;

		for ( let lvl of params.dataPath?.split ( "." ) )
		{
			data = data[ lvl ];
		}

		if ( !data )
		{
			throw "data not found for "+params.dataPath
		}

		nbRowDom.onchange = (ev)=>{
			if ( ev.target.value < 0 )
			{
				ev.target.value = 0;
			}

			// manage output json
			if ( ev.target.value < data.length )
			{
				data.splice ( ev.target.value );
			}
			else while ( ev.target.value > data.length )
			{
				data.push ({})
			}

			// remove line if too much
			while ( tbody.childElementCount >= data?.length )
			{
				tbody.removeChild ( tbody.lastChild );
			}

			// add lines if some missings
			for ( let i = tbody.childElementCount; i < data.length; i++ )
			{
				tbody.appendChild ( _createTable_Line ( params, data, i ) );
			}

			Els_Back.newJson ( params.json, outDivs.json, outDivs.outObj );
		};

		nbRowDom.value = data.length;
		nbRowDom.dispatchEvent ( new Event ( "change" ) );
	}
	catch ( e )
	{
		console.log ( e );
	}

	function _createTable_Line ( params, data, index )
	{
		let line = document.createElement ( "tr" );

		for ( let item of params.cols )
		{
			// get the data identifier
			let id = item.id || item.text;

			let cell = document.createElement ( "td" );
			line.appendChild ( cell );

			let iVal = document.createElement ( "input" );
			cell.appendChild ( iVal );

			switch ( item.type )
			{
				case "checkbox":
				{
					iVal.type = "checkbox";
					iVal.checked = data[ index ][ id ] || false;

					iVal.onchange = (ev)=>{
						data[ index ][ id ] = ev.target.checked;

						Els_Back.newJson ( params.json, outDivs.json, outDivs.outObj );
					}
					break;
				}
				case "number":
				{
					iVal.value = data[ index ][ id ] || "";

					iVal.onchange = (ev)=>{
						data[ index ][ id ] = Number ( ev.target.value );
						ev.target.value = data[ index ][ id ];

						Els_Back.newJson ( params.json, outDivs.json, outDivs.outObj );
					}
					break;
				}
				default:
				case "text":
				{
					iVal.value = data[ index ][ id ] || "";

					if ( [ "Array", "Object" ].includes ( data?.[ index ]?.[ id ]?.constructor.name ) )
					{
						iVal.value = JSON.stringify ( data[ index ][ id ] );
					}

					iVal.onchange = (ev)=>{
						try
						{
							data[ index ][ id ] = JSON.parse ( ev.target.value.trim ( ) );
						}
						catch ( e )
						{
							data[ index ][ id ] = ev.target.value.trim ( );
						}
						Els_Back.newJson ( params.json, outDivs.json, outDivs.outObj );
					}
					break;
				}
			}
		}

		return line;
	}
}