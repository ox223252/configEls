/// \brief base element for HMI display
class Els_Back {
	/// \param [ in ] config : object with configuration
	///     { type: <className String>, id: <String>, style: { } }
	/// \param [ ind ] id : new element ID (String)
	constructor ( config, id )
	{
		this.data = [];
		this._callArgs = [];
		this._config = config;

		this._domEl = document.createElement ( "div" );
		this._domEl.className = config.type;
		this._domEl.id = config.id || id;
		this._domEl.style = config.style;
	}

	/// \brief need to be surcharged
	/// \note allow user to update part of config to change display
	update ( config )
	{
	}

	/// \brief update style
	/// \aram [ in ] config : object with the input element need to be updated
	_update ( config )
	{
		if ( !config )
		{
			return;
		}

		for ( let k of Object.keys ( config ) )
		{
			switch ( k )
			{
				case "style":
				{
					this._domEl.style = config.style;
					break;
				}
			}
		}
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
	static new ( params = {}, config = undefined )
	{
		return new Promise((ok,ko)=>{ko("not available for this type")});
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
	static newJson ( json, jsonDiv, outDiv, jsonText )
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
			// outDiv contain the new element configured followin json
			if ( outDiv )
			{
				outDiv.update ( json );
			}
		}
		catch ( e )
		{
			console.error ( e );
		}
	}
}

class Els_title extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement ( "h3" );
		this._domEl.appendChild ( this._elList );
		this._elList.innerHTML = config.text;
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
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"title",
			text:"",
		}

		if ( undefined != config )
		{
			json = JSON.parse ( JSON.stringify ( config ) );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let title = document.createElement ( "input" );
			configDiv.appendChild ( title );
			title.type = "text";
			title.placeholder = "title"
			title.value = json.text || "";
			title.onchange = (ev)=>{
				json.text=ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			title.onkeyup = title.onchange;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				title.value = json.text;
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

class Els_text extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement ( "p" );
		this._domEl.appendChild ( this._elList );
		this._elList.innerHTML = config.text;
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
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"text",
			text:"",
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let text = document.createElement ( "input" );
			configDiv.appendChild ( text );
			text.type = "text";
			text.value = json.text || "";
			text.onchange = (ev)=>{
				json.text=ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			text.onkeyup = text.onchange;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				text.value = json.text;
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

class Els_img extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement ( "img" );
		this._domEl.appendChild ( this._elList );
		this._elList.src = config.src;
		this._elList.style.maxWidth = "100%";
		this._elList.style.maxHeight = "100%";
	}

	update ( config )
	{
		this._update ( config );

		for ( let k of Object.keys ( config ) )
		{
			switch ( k )
			{
				case "src":
				{
					this._elList.src = config.src;
					break;
				}
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"img",
			src:"",
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let imgSrc = document.createElement ( "input" );
			configDiv.appendChild ( imgSrc );
			imgSrc.type = "text";
			imgSrc.value = json.src || "";
			imgSrc.onchange = (ev)=>{
				json.src=ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			imgSrc.onkeyup = imgSrc.onchange;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				imgSrc.value = json.src;
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

class Els_title_id extends Els_title {
	constructor ( config, id )
	{
		super( config, id );
		this._els.innerHTML = createEls ( config.text_id, config.prefix );
	}
}

class Els_text_id extends Els_text {
	constructor ( config, id )
	{
		super( config, id );
		this._els.innerHTML = createEls ( config.text_id, config.prefix );
	}
}

class Els_unit_id extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement("div");
		this._domEl.appendChild ( this._elList );
		this._els.innerHTML = creatSpansFromOptions ( config.text_id, config.prefix );
	}
}

class Els_map extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this._elList = document.createElement("iframe");
		this._domEl.appendChild ( this._elList );
		this._elList.className = "map";
		this._elList.src = "https://www.openstreetmap.org/export/embed.html"
		this._elList.src += "?bbox="+config.view.a
		this._elList.src += "%2C"+config.view.b
		this._elList.src += "%2C"+config.view.c
		this._elList.src += "%2C"+config.view.d;
		config.gps.forEach((p)=>{
			this._elList.src += "&marker="+p.a+"%2C"+p.b;
		})
		this._elList.src += "&layers=ND";
	}

	update ( config )
	{
		this._update ( config );

		this._elList.src = "https://www.openstreetmap.org/export/embed.html"
		this._elList.src += "?bbox="+config.view.a
		this._elList.src += "%2C"+config.view.b
		this._elList.src += "%2C"+config.view.c
		this._elList.src += "%2C"+config.view.d;
		config.gps.forEach((p)=>{
			this._elList.src += "&marker="+p.a+"%2C"+p.b;
		})
		this._elList.src += "&layers=ND";
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let zoom = 0.01;
		let json = {
			type:"map",
			gps:[
				{
					a:0,
					b:0
				}
			],
			view:{
				a:-0.01,
				b:-0.01,
				c:0.01,
				d:0.01,
			}
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );

			let [divLa,iLa] = _createInput ( "Latitude (N/S)" );
			configDiv.appendChild ( divLa );
			iLa.type = "number";
			iLa.value = json.gps[0].a || "";
			iLa.onchange = (ev)=>{
				json.gps[0].a = ev.target.value;
				json.view.b = Number ( ev.target.value ) - zoom;
				json.view.d = Number ( ev.target.value ) + zoom;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iLa.onkeyup = iLa.onchange;

			let [divLo,iLo] = _createInput ( "Longitude (E/W)" );
			configDiv.appendChild ( divLo );
			iLo.type = "number";
			iLo.value = json.gps[0].b || "";
			iLo.onchange = (ev)=>{
				json.gps[0].b = ev.target.value;
				json.view.a = Number ( ev.target.value ) - zoom;
				json.view.c = Number ( ev.target.value ) + zoom;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iLo.onkeyup = iLo.onchange;

			let [divZoom,iZoom] = _createInput ( "Zoom" );
			configDiv.appendChild ( divZoom );
			iZoom.type = "number";
			iZoom.value = 0.001;
			iZoom.step = 0.0001;
			iZoom.onchange = (ev)=>{
				zoom = Number ( ev.target.value );
				json.view.b = Number ( json.gps[0].a ) - zoom;
				json.view.d = Number ( json.gps[0].a ) + zoom;
				json.view.a = Number ( json.gps[0].b ) - zoom;
				json.view.c = Number ( json.gps[0].b ) + zoom;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iZoom.onkeyup = iZoom.onchange;


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				iLo.value = json?.gps[0]?.a || "";
				iLo.value = json?.gps[0]?.b || "";
			}

			let outDiv = Els_Back._newOut ( params.id, json );

			return { config:configDiv, json:jsonDiv, out:outDiv._domEl };
		}
		catch ( e )
		{
			return undefined
		}
	}
}

class Els_io extends Els_Back {
	constructor ( config,  id )
	{
		super( config, id );

		// label if neeted
		this.divLabel = document.createElement ( "div" );
		this._domEl.appendChild ( this.divLabel );
		this.divLabel.className = "label";
		if ( config.label )
		{
			this.divLabel.innerHTML = config.label;
		}
		if ( config.labelId )
		{
			this.divLabel.innerHTML = ccreateEls ( config.labelId, config.prefix );
		}

		// data
		this.divData = document.createElement ( "div" );
		this._domEl.appendChild ( this.divData );
		this.divData.className = "data";
		this.divData.innerHTML = config.default || "...";

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

		const getCallback = ( c )=>{
			switch ( c.valueType )
			{
				case "volume":
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );

						let {coef,print} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );

						this.divData.innerHTML = refactor ( value * coef , "v_"+this._config.unitCurrent.volume );
						this.divUnit.innerHTML = print;
					};
					break;
				}
				case "flow":
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );
						
						let {coef,print} = _calcCoef ( this._config.valueType, this._config.unit, this._config.unitCurrent );

						this.divData.innerHTML = refactor ( value * coef , 1 );
						this.divUnit.innerHTML = print;
					}
					break;
				}
				case "temp":
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );

						if ( this._config.unitCurrent
							&& this._config.unit )
						{
							coef = temperatureConvert ( 1, unit.temperature, "C" );
						}
						this.divData.innerHTML = refactor ( value * coef, "T_"+unit.temperature );

						if ( this._config.unit )
						{
							this.divUnit.innerHTML = "°" + this._config.unitCurrent;
						}
					}
					break;
				}
				case "date":
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );

						this.divData.innerHTML = new Date ( value ).toISOString ( ).replace ( "T"," " ).replace ( /\.\d\d\dZ/, "" );
					};
					break;
				}
				case "dateMs":
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );

						this.divData.innerHTML = new Date ( value ).toISOString ( ).replace ( "T"," " ).replace ( "Z", "" );
					};
					break;
				}
				default:
				{
					return (msg)=>{
						let value = msg.value * ( c.coef || 1 );
						if ( undefined != refactor )
						{
							let a = c.valueType;
							if ( a == undefined )
							{
								a = 1;
							}
							this.divData.innerHTML = refactor ( value, a );
						}
						else
						{
							this.divData.innerHTML = value;
						}

						if ( c.unit )
						{
							this.divUnit.innerHTML =  c.unit;
						}
						else
						{
							this.divUnit.style.display = "none"
						}
					}
					break;
				}
			}
		}
		
		if ( "array" === config.channel?.constructor?.name.toLowerCase ( ) )
		{
			this.currentData = [];

			for ( let [index,channel] of config.channel.entries ( ) )
			{
				let f = getCallback ( config );
				let cb = {
					periode: config.periode || 0,
					channel: config.channel,
					f: (msg)=>{
						let last = this.currentData[ index ];
						this.currentData[ index ] = msg;

						switch ( config.action )
						{
							case "min":
							{
								f ( this.currentData.sort ( (a,b)=>a-b )[ 0 ] );
								break;
							}
							case "max":
							{
								f ( this.currentData.sort ( (a,b)=>b-a )[ 0 ] );
								break;
							}
							case "average":
							{
								f ( this.currentData.reduce ( (a,v)=> v + a ) / this.currentData.length );
								break;
							}
						}
					}
				};
			}
		}
		else
		{
			let cb = {
				periode: config.periode || 0,
				channel: config.channel,
				f: getCallback ( config )
			};

			this._callArgs.push ( cb );
		}
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
					this.divData.innerHTML = config.default;
					break;
				}
				case "unit":
				{
					this.divUnit.innerHTML = config.unit;
					break;
				}
				case "valueType":
				// {
				// 	this._config.periode = config.periode;
				// 	break;
				// }
				case "channel":
				case "prefix":
				case "label_id":
				{
					break;
				}
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"io",
			channel:"WEBSOCKET CHANNEL",
			periode:0,
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let [divCha,sCha] = _createInputArray ( "Data", params.channels );
			configDiv.appendChild ( divCha );
			sCha.value = json.channel || "";
			sCha.onchange = (ev)=>{
				json.channel = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sCha.onkeyup = sCha.onchange;

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			sPer.value = json.periode;
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				Els_Back.newJson ( json, jsonDiv );
			}
			sPer.onkeyup = sPer.onchange;

			let [divLab,inLab] = _createInput ( "label" );
			configDiv.appendChild ( divLab );
			inLab.value = json.label || "";
			inLab.onchange = (ev)=>{
				json.label = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			inLab.onkeyup = inLab.onchange;

			let [divDef,inDef] = _createInput ( "default" );
			configDiv.appendChild ( divDef );
			inDef.value = json.default || "";
			inDef.placeholder = "default value";
			inDef.onchange = (ev)=>{
				json.default = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			inDef.onkeyup = inDef.onchange;

			let [divTyp,inTyp] = _createInput ( "type", [ "volume", "flow", "temp", "date" ] );
			configDiv.appendChild ( divTyp );
			inTyp.value = json.valueType || "";
			inTyp.placeholder = "nb digit / type";
			inTyp.onchange = (ev)=>{
				json.valueType = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			inTyp.onkeyup = inTyp.onchange;

			let [divUni,inUni] = _createInput ( "unit" );
			configDiv.appendChild ( divUni );
			inUni.value = json.unit || "";
			inUni.onchange = (ev)=>{
				json.unit = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			inUni.onkeyup = inUni.onchange;

			let [divCoef,inCoef] = _createInput ( "static Coef" );
			configDiv.appendChild ( divCoef );
			inCoef.value = json.coef || "";
			inCoef.type = "number";
			inCoef.onchange = (ev)=>{
				json.coef = Number ( ev.target.value );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			inCoef.onkeyup = inCoef.onchange;


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				sCha.value = json?.channel || "";
				sPer.value = json?.periode || "";
				inLab.value = json?.label || "";
				inDef.value = json?.default || "";
				inTyp.value = json?.valueType || "";
				inUni.value = json?.unit || "";
				inCoef.value = json?.coef || "";
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

class Els_bin extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this.div = document.createElement ( "p" );
		this.div.className = "status"
		this._domEl.appendChild ( this.div );
		this.div.innerHTML = config.text;

		if ( undefined == this._config.mask )
		{
			this._config.mask = 0x01;
		}

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				let v = ( this._config.revert )? ~msg.value: msg.value;
				v &= this._config.mask;

				this.div.style="--status-color:"+((v)?"green":"red");
			}
		};

		this._callArgs.push ( cb );
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"bin",
			channel:"WS_DATA_CHANNEL",
			periode:0,
			text:""
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );
			let [divCha,sCha] = _createInputArray ( "Data", params.channels );
			configDiv.appendChild ( divCha );
			sCha.value = json.channel || "";
			sCha.onchange = (ev)=>{
				json.channel = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sCha.onkeyup = sCha.onchange;

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			sPer.value = json.periode;
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				Els_Back.newJson ( json, jsonDiv );
			}
			sPer.onkeyup = sPer.onchange;

			let [divLa,iLa] = _createInput ( "label" );
			configDiv.appendChild ( divLa );
			iLa.onchange = (ev)=>{
				json.text = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iLa.onkeyup = iLa.onchange;


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				sCha.value = json?.channel || "";
				sPer.value = json?.periode || "";
				iLa.value = json?.text || "";
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

class Els_multi extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this.div = document.createElement ( "p" );
		this.div.className = "status"
		this._domEl.appendChild ( this.div );
		this.div.innerHTML = config.text;


		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: function f(msg){
				this.div.style = "--status-color:"+config.color[ 0 ];
				for ( let i = 0; i < config.threshold.length; i++ )
				{
					if ( msg.value <= config.threshold[ i ] )
					{
						break;
					}

					this.div.style = "--status-color:"+(config.color[ i+1 ] || "red");
				}
			}
		};

		this._callArgs.push ( cb );
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
					this.div.innerHTML = config.text;
					break;
				}
				case "channel":
				{
					break;
				}
			}
		}
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"multi",
			channel:"WS_DATA_CHANNEL",
			periode:0,
			text:"",
			threshold:[],
			color:[]
		}

		let domEls = {
			threshold: [],
			color: []
		};

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let drowThreshold = (input)=>{
				let index = 0;
				switch ( input?.constructor.name )
				{
					case "Event":
					{
						index = Number ( input.target.value );
						if ( index < 0 )
						{
							input.target.value = 0;
						}
						break;
					}
					case "Number":
					{
						index = input;
						break;
					}
				}

				if ( index < 0 )
				{
					index = 0;
				}

				for ( let thIndex = Math.min ( json.threshold.length, domEls.threshold.length ); thIndex < index; thIndex++ )
				{
					// threshold
					tr = document.createElement ( "tr" );
					tbody.appendChild ( tr );
					domEls.threshold[ thIndex ] = tr;

					let td = document.createElement ( "td" );
					tr.appendChild ( td );
					td.rowSpan = 2;
					td.style.minWidth = "100px" ;

					let threshold = document.createElement ( "input" );
					td.appendChild ( threshold );
					threshold.type = "number" ;
					threshold.value = json.threshold[ thIndex ] || json.threshold.at( -1 ) + 1 || 1;
					threshold.style.height = "100%" ;
					json.threshold[ thIndex ] = Number ( threshold.value );
	
					let colorIndex = thIndex + 1;

					// color
					tr = document.createElement ( "tr" );
					tbody.appendChild ( tr );
					domEls.color[ colorIndex ] = tr;

					let [noUsed,iColor] = _createColorClicker ( {
						callback: (ev,color)=>{
							json.color[ colorIndex ] = "rgba("+color.join(',')+")";
							Els_Back.newJson ( json, jsonDiv, outDiv );
						},
						type: "td",
						color: json.color[ colorIndex ],
					} );
					tr.appendChild ( iColor );
					iColor.rowSpan = 2;
				}

				if ( index < json.threshold.length )
				{
					let divs = domEls.threshold.splice ( index );
					divs.map ( d=> tbody.removeChild ( d ) );

					divs = domEls.color.splice ( index + 1 );
					divs.map ( d=> tbody.removeChild ( d ) );

					json.threshold.splice ( index );
				}				

				jsonDiv.value = JSON.stringify ( json, null, 4 );
			}

			let configDiv = document.createElement ( "div" );
			let [divCha,sCha] = _createInputArray ( "Data", params.channels );
			configDiv.appendChild ( divCha );
			sCha.value = json.channel || "";
			sCha.onchange = (ev)=>{
				json.channel = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sCha.onkeyup = sCha.onchange;

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			sPer.value = json.periode;
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				Els_Back.newJson ( json, jsonDiv );
			}
			sPer.onkeyup = sPer.onchange;

			let [divLa,iLa] = _createInput ( "label" );
			configDiv.appendChild ( divLa );
			iLa.onchange = (ev)=>{
				json.text = ev.target.value;
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iLa.onkeyup = iLa.onchange;

			let [divNb,iNb] = _createInput ( "limits nb" );
			configDiv.appendChild ( divNb );
			iNb.value = json.threshold.length;
			iNb.type = "number";
			iNb.min = 0;
			iNb.onchange = drowThreshold;
			iNb.onkeyup = iNb.onchange;

			let table = document.createElement ( "table" );
			configDiv.appendChild ( table );
			table.style.width = "100%";
			let thead = document.createElement ( "thead" );
			table.appendChild ( thead );
			let tr = document.createElement ( "tr" );
			thead.appendChild ( tr );
			let th = document.createElement ( "th" );
			tr.appendChild ( th );
			th.appendChild ( document.createTextNode ( "Color" ) );
			th = document.createElement ( "th" );
			tr.appendChild ( th );
			th.appendChild ( document.createTextNode ( "limit" ) );

			let tbody = document.createElement ( "tbody" );
			table.appendChild ( tbody );

			tr = document.createElement ( "tr" );
			tbody.appendChild ( tr );
			domEls.color[ 0 ] = tr;

			let [noUsed,iColor] = _createColorClicker ( {
				callback: (ev,color)=>{
					json.color[ 0 ] = "rgba("+color.join(',')+")";
					Els_Back.newJson ( json, jsonDiv, outDiv );
				},
				type: "td",
				color: json.color[ 0 ],
			} );
			tr.appendChild ( iColor );
			iColor.rowSpan = 2;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				sCha.value = json.channel;
				sPer.value = json.periode;
				iLa.value = json.text;
				iNb.value = json.threshold.length;
				iNb.dispatchEvent ( new Event ( "change" ) );
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
			}

			let outDiv = Els_Back._newOut ( params.id, json );
			
			drowThreshold ( json.threshold.length );

			return { config:configDiv, json:jsonDiv, out:outDiv._domEl };
		}
		catch ( e )
		{
			console.log( e )
			return undefined
		}
	}
}

class Els_gauge extends Els_Back {
	constructor ( config,  id )
	{
		super( config, id );

		let textColor = getComputedStyle(document.body).getPropertyValue('--main-text') || "#000";

		this.gauge = new Gauge ( config.options );
		
		this.gauge.textColor = textColor || "#000";
		
		this._domEl.appendChild ( this.gauge.domEl );
		this._domEl.style.textAlign = "center";

		switch ( this._config.valueType )
		{
			case "temp":
			case "volume":
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
				if ( textColor != getComputedStyle(document.body).getPropertyValue('--main-text') )
				{
					textColor = getComputedStyle(document.body).getPropertyValue('--main-text');
					this.gauge.textColor = textColor;
				}

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
		this.gauge.textColor = getComputedStyle(document.body).getPropertyValue('--main-text');
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type: "gauge",
			channel: "WS_DATA_CHANNEL",
			periode: 0,
			options:{
				values: [ 0, "yellow", 100 ],
				curve:{
					min: 0,
					max: 180,
					label:{
						height: 20,
						line: 1
					}
				}
			}
		}

		let domEls = {
			line: [],
		};

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try // config
		{
			let createLine = ( params = {} )=>{
				let tr = document.createElement ( "tr" );

				if ( "th" == params.type )
				{
					let min = document.createElement ( "th" );
					tr.appendChild ( min );
					min.appendChild ( document.createTextNode ( params.min ) );

					let color = document.createElement ( "th" );
					tr.appendChild ( color );
					color.appendChild ( document.createTextNode ( params.color ) );

					let max = document.createElement ( "th" );
					tr.appendChild ( max );
					max.appendChild ( document.createTextNode ( params.max ) );
				
					return tr;
				}
				else
				{
					let cell = document.createElement ( "td" );
					tr.appendChild ( cell );
					cell.style.width = "33%";

					let [divMin,iMin] = _createInput ( );
					cell.appendChild ( divMin );
					iMin.type = "number";
					iMin.value = json.options.values[ params ];
					iMin.onkeyup = iMin.onchange;

					let [noUsed,iColor] = _createColorClicker ( {
						color: json.options.values[ params + 1 ],
						callback: (ev,color)=>{
							json.options.values[ params + 1 ] = "rgba("+color.join(',')+")";
							Els_Back.newJson ( json, jsonDiv, outDiv );
							outDiv.gauge.update ( );
						},
						type: "td",
					} );
					tr.appendChild ( iColor );
					iColor.style.width = "33%";
					
					cell = document.createElement ( "td" );
					tr.appendChild ( cell );
					cell.style.width = "33%";

					let [divMax,iMax] = _createInput ( );
					cell.appendChild ( divMax );
					iMax.type = "number";
					iMax.value = json.options.values[ params + 2 ];
					iMax.onkeyup = iMax.onchange;

					return {tr, iMin, iMax, iColor};
				}
			}

			let createTable = ( params = {} )=>{
				while ( 1 < tabZone.children.length )
				{
					tabZone.removeChild ( tabZone.lastChild );
				}

				let values = json.options.values.filter ( v=>!isNaN(v));

				let cells = [];
				for ( let i = 0; i < values.length - 1; i++ )
				{
					let index = json.options.values.indexOf ( values[ i ] );
					let length = json.options.values.indexOf ( values[ i + 1 ] ) - index;

					if ( length < 2 )
					{
						json.options.values.splice ( json.options.values.indexOf ( values[ i+1 ] ), 0, "transparent" );
					}

					let ret = createLine ( index );
					tabZone.appendChild ( ret.tr );

					cells.push ( ret );
				}

				for ( let i = 0; i < cells.length; i++ )
				{
					let indexMin = json.options.values.indexOf ( values[ i ] );
					let indexMax = json.options.values.indexOf ( values[ i + 1 ] );

					cells[ i ].iMin.onchange = (ev)=>{
						json.options.values[ indexMin ] = Number ( ev.target.value );

						if ( i > 0 )
						{
							cells[ i - 1 ].iMax.value = json.options.values[ indexMin ];
						}

						Els_Back.newJson ( json, jsonDiv, outDiv );
						_debounceEvent ( "gauge", ()=>{ outDiv.gauge.update ( ) } );
					}

					cells[ i ].iMax.onchange = (ev)=>{
						json.options.values[ indexMax ] = Number ( ev.target.value );

						if ( i < cells.length - 1 )
						{
							cells[ i + 1 ].iMin.value = json.options.values[ indexMax ];
						}

						Els_Back.newJson ( json, jsonDiv, outDiv );
						_debounceEvent ( "gauge", ()=>{ outDiv.gauge.update ( ) } );
					}

					cells[ i ].iColor.onclik = (ev,color)=>{
						json.options.values[ params + 1 ] = "rgba("+color.join(',')+")";
						Els_Back.newJson ( json, jsonDiv, outDiv );
						_debounceEvent ( "gauge", ()=>{ outDiv.gauge.update ( ) } );
					};
				}

				return {
					midValue:( Number( cells[ cells.length - 1 ].iMax.value ) - Number ( cells[ 0 ].iMin.value ) ) / 2 + Number ( cells[ 0 ].iMin.value ),
					nbArea: cells.length
				};
			}

			let configDiv = document.createElement ( "div" );
			let [divCha,sCha] = _createInputArray ( "Data", params.channels );
			configDiv.appendChild ( divCha );
			sCha.value = json.channel || "";
			sCha.onchange = (ev)=>{
				json.channel = ev.target.value;
				Els_Back.newJson ( json, jsonDiv );
			}
			sCha.onkeyup = sCha.onchange;

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			sPer.value = json.periode;
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				Els_Back.newJson ( json, jsonDiv );
			}
			sPer.onkeyup = sPer.onchange;

			let [divZon,iZon] = _createInput ( "Zones" );
			configDiv.appendChild ( divZon );
			iZon.type = "number";
			iZon.value = 1;
			iZon.min = 1;
			iZon.onchange = (ev)=>{
				let index = Number ( ev.target.value );
				if ( index < 0 )
				{
					index = 0;
					ev.target.value = 0;
				}

				let values = json.options.values.filter ( v=>!isNaN(v));
				if ( index < values.length - 1 )
				{
					while ( index < values.length - 1 )
					{
						values.pop ( );
					}

					for ( let i = json.options.values.indexOf ( values[ values.length - 1 ] ); i > 0; i-- )
					{
						json.options.values.pop ( );
					}
				}
				else while ( index > values.length - 1 )
				{
					values.push ( values[ values.length - 1 ] + 1 );
					json.options.values.push ( "transparent" );
					json.options.values.push ( values[ values.length - 1 ] );
				}

				createTable ( );
				outDiv.gauge.value = ( outDiv.gauge.max - outDiv.gauge.min ) / 2 + outDiv.gauge.min;

				Els_Back.newJson ( json, jsonDiv, outDiv );

				_debounceEvent ( "gauge", ()=>{ outDiv.gauge.update ( ) } );
			}
			iZon.onkeyup = iZon.onchange;

			let tabZone = document.createElement ( "table" );
			configDiv.appendChild ( tabZone );
			tabZone.appendChild ( createLine ( {min: "Min", color:"Color", max:"Max", type:"th"} ) );

			let retTable = createTable ( );
			iZon.value = retTable.nbArea;

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				sCha.value = json?.channel || "";
				sPer.value = json?.periode;

				let r = createTable ( );
				iZon.value = r.nbArea;
				outDiv.gauge.value = r.midValue;

				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				_debounceEvent ( "gauge", ()=>{ outDiv.gauge.update ( json.options ) } );
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
}

class Els_svg extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );


		let img = document.createElement("img");

		this._domEl.appendChild ( img );

		fetch ( config.src )
			.then(r=>r.text())
			.then(t=>{
				this.svg = new DOMParser().parseFromString(t, 'text/html').querySelector('svg');
				img.replaceWith(this.svg);

				if ( undefined != config.backImg )
				{
					let backImg = '<image href="'+config.backImg+'" '
					backImg += 'width="'+this.svg.viewBox.baseVal.width+'" '
					backImg += 'height="'+this.svg.viewBox.baseVal.height+'" />';
					this.svg.innerHTML = backImg + this.svg.innerHTML;
				}
			})
			.catch(console.log)

		for ( let d of config.data )
		{
			let style = document.createElement("style");
			this._domEl.appendChild ( style );
			style.id = "css_"+id+"_"+d.id;
			style.innerHTML = "#"+d.id+"{stroke:black}";

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
						let v = ( d.revert )? ~msg.value: msg.value;
						v &= d.mask;

						style.innerHTML="#"+d.id+"{fill:"+((v)?"green":"red");
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
						style.innerHTML = "#"+d.id+"{fill:"+color+"}";
					}
					break;
				}
			}

			this._callArgs.push ( cb );
		}
	}
}

class Els_graph extends Els_Back {
	constructor ( config, id )
	{
		// manage X axis labels if it's date
		function xAxisDateCallback (val, index)
		{
			val = new Date ( this.getLabelForValue(val) )

			if ( 0 == index )
			{
				this.xAxisLastDay = val.getDay ( );
			}

			if ( this.xAxisLastDay != val.getDay ( ) )
			{
				this.xAxisLastDay = val.getDay ( );

				return val
					.toISOString ( )
					.replace ( /\....Z/,"" )
					.replace ( "T", " " );
			}
			else
			{
				return val
					.toISOString ( )
					.replace ( /\....Z/,"" )
					.replace ( /.+T/, "" );
			}
		}

		// capitalize First Letter
		function cFL(string)
		{
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		// reset Zoom
		const resetZoom = ( )=>{
			console.log ( "reset" )
			zoomData = this.graph.main.chart.getInitialScaleBounds ( );
			zoomData.zoom = false;
			this.graph.main.chart.resetZoom ( );
			this.graph.main.chart.update ( );
			this.graph.zoom.chart.update ( );
		}

		super( config, id );
		
		if ( !window.Chart )
		{
			console.error ( "need Chart from https://github.com/chartjs/Chart.js" );
			return;
		}

		// define default debounce config
		this.config.debounce = Object.assign ( {
			time: 100,
			active: true,
		}, this.config.debounce );
		
		this.divMain = document.createElement("div");
		this._domEl.appendChild( this.divMain );
		this.divMain.className = "main";

		// base graph elements
		this.graph = {
			main:{
				canvas: document.createElement("canvas"),
				chart: undefined, // base graph
				config: { // conf for base graph
					options: {
						maintainAspectRatio: false,
						animation: false,
						scales: {
							x: {
								grid: {
									color:"rgba(128,128,128,0.4)"
								}
							},
							y: {
								grid:{
									color:"rgba(128,128,128,0.4)"
								} 
							}
						},
						plugins:{}
					},
					plugins:[]
				}
			},
			zoom:{
				canvas: undefined,
				chart: undefined, // zoom overview graph
				config: {
				}, // conf of zoom graph
			}
		}

		//  add main graph to the displayed elements
		this.divMain.appendChild( this.graph.main.canvas );

		// nanagement of xAxis type if it's not a pure value like date
		if ( "date" == this.config.xAxisType )
		{
			this.graph.main.config.options.scales.x.ticks = {
				callback: xAxisDateCallback
			}
		}

		// defined base config of the graphs signal, sync or async
		if ( this.config.subType == "sync" )
		{ // in case of sync graph set the X axis data input
			this.graph.main.config.type = 'line';
			this.graph.main.config.data = {
				labels:[],
				datasets:[]
			};
			let cb = {
				periode: this.config.periode || 0,
				channel: this.config.channel,
				f: (msg)=>{
					if ( this.config.coef )
					{ // in case of you need to appli coef on XAxis data
						this.graph.main.config.data.labels.push ( msg.value * this.config.coef );
					}
					else
					{
						this.graph.main.config.data.labels.push ( msg.value );
					}

					if ( this.graph.main.config.data.labels.length > config.deep  )
					{
						let rm = this.graph.main.config.data.labels.length - config.deep
						this.graph.main.config.data.labels.splice( 0, rm );
						for ( let d of this.graph.main.config.data.datasets )
						{
							d.data.splice ( 0, rm );
						}
					}

					this._updateGraph ( "main" );
				}
			}
			this._callArgs.push ( cb );
		}
		else
		{ // async/signal case
			this.graph.main.config.type = 'scatter',
			this.graph.main.config.data = {
				datasets:[]
			};
		}

		// creat graph
		this.graph.main.chart = new Chart ( this.graph.main.canvas.getContext('2d'), this.graph.main.config );

		let zoomData = {
			zoom:false,
			update:true,
			x:{
				min:0,
				max:1,
			},
			y:{
				min:0,
				max:1,
			}
		}

		// init config of zoom overview graph
		if ( true == this.config.zoom )
		{
			this.divZoom = document.createElement("div");
			this.divZoom.className = "zoom";
			this._domEl.appendChild( this.divZoom );

			this.graph.zoom.canvas = document.createElement( "canvas" );
			this.divZoom.appendChild( this.graph.zoom.canvas );

			this.graph.zoom.canvas.addEventListener ( "dblclick", resetZoom );
			this.graph.main.canvas.addEventListener ( "dblclick", resetZoom );

			this.graph.zoom.config = {
				type: this.graph.main.config.type,
				data: this.graph.main.config.data,
				options: {
					maintainAspectRatio: false,
					animation: false,
					scales: {
						x: {
							ticks: this.graph.main.config.options.scales.x.ticks
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
				plugins: []
			};

			this.graph.zoom.config.plugins.push ({
				id: 'quadrants',
				beforeDraw(chart, args, opt) {
					const {ctx, scales: {x, y}} = chart;

					let left = x.getPixelForValue ( zoomData.x.min );
					let right = x.getPixelForValue ( zoomData.x.max );
					let bot = y.getPixelForValue ( zoomData.y.min );
					let top = y.getPixelForValue ( zoomData.y.max );

					ctx.save();
					ctx.fillStyle = "rgba(128,128,128,0.2)";
					ctx.fillRect( left, top, right - left, bot - top);
					ctx.restore();
				}
			});

			this.graph.main.config.options.plugins.zoom = {
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
						zoomData.x.min = c.chart.scales.x.min;
						zoomData.x.max = c.chart.scales.x.max;
						zoomData.y.min = c.chart.scales.y.min;
						zoomData.y.max = c.chart.scales.y.max;

						zoomData.zoom = true;

						this.graph.zoom.chart.update ( );
					},
					onZoomRejected: (c)=>{
						zoomData.update = true;
					},
					onZoomComplete: (c)=>{
						zoomData.update = true;
					},
					onZoomStart: (c)=>{
						zoomData.update = false;
					}
				},
				limits: {
					x: {
						minRange: 3,
					},
				}
			};

			this.graph.zoom.chart = new Chart ( this.graph.zoom.canvas.getContext('2d'), this.graph.zoom.config );
		}

		// add min / max on graph
		for ( let label of ["min","max"] )
		{
			if ( undefined == config[ label ] ) continue;
			
			this.graph.main.config.options.scales.y[ "suggested"+cFL( label ) ] = config[ label ];

			if ( true != config.zoom ) continue;
		
			this.graph.zoom.config.options.scales.y[ "suggested"+cFL( label ) ] = config[ label ];
		}

		for ( let [i,c] of config.curve.entries ( ) )
		{
			let index = this.graph.main.config.data.datasets.length;

			this.graph.main.config.data.datasets[index] = {
				label:c.name,
				data:[], // value with coef
				trueData:[], // value without coef applyed (directly from device)
				borderColor:c.color||defaultColor[i],
				tension:c.tension||0.1,
				showLine:c.showLine || true,
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
				f: ( msg )=>{
					switch ( config.subType )
					{
						case "signal":
						{
							if ( "Array" !== msg.value?.constructor.name )
							{
								return;
							}

							let vXY = msg.value.filter ( a=>a.x!=undefined&&a.y!=undefined );
							let vY = msg.value.filter ( a=>a.x==undefined&&a.y!=undefined );
							let vN = msg.value.filter ( a=>!isNaN( a ) );

							let v = undefined;

							if ( 0 < vXY.length )
							{
								v = vXY;
							}
							else if ( 0 < vY.length )
							{
								v = vY.map ( (v,i)=>{
									v.x = i; 
									return v;
								});
							}
							else
							{
								v = vN.map ( (v,i)=>{
									return {x:i, y:v};
								});
							}

							this.graph.main.config.data.datasets[ index ].trueData = v;
							this.graph.main.config.data.datasets[ index ].data = v.map ( p=>{
								p.y*=c.coef;
								return p;
							});

							break;
						}
						case "sync":
						{
							if ( this.graph.main.config.data.datasets[ index ].data.length < this.graph.main.config.data.labels.length  )
							{ // add data only if we add a label for this data
								// add the data to the last label
								this.graph.main.config.data.datasets[ index ].data[ this.graph.main.config.data.labels.length - 1 ] = msg.value * c.coef;
								this.graph.main.config.data.datasets[ index ].trueData[ this.graph.main.config.data.labels.length - 1 ] = msg.value;
							}
							break;
						}
						case "async":
						{
							console.log ( "graph async" );
							console.log ( msg.value );

							return;

							// TODO test management c.coef
							this.graph.main.config.data.datasets[ index ].trueData.push ( JSON.parse ( msg.value ) );

							let point = JSON.parse ( msg.value );
							point.y *= c.coef;
							this.graph.main.config.data.datasets[ index ].data.push ( point );

							let deep = c.deep || config.deep;
							if ( ( undefined != deep )
								&& ( this.graph.main.config.data.datasets[ index ].data.length > deep ) )
							{
								this.graph.main.config.data.datasets[ index ].data.splice( 0, this.graph.main.config.data.datasets[ index ].data.length - deep )
							}

							break;
						}
					}

					let color = getComputedStyle( this.graph.main.canvas ).getPropertyValue("--main-text");

					this.graph.main.config.options.scales.x.ticks.color = color;
					this.graph.main.config.options.scales.y.ticks.color = color;

					this._updateGraph ( "main" );
					
					zoomData.color = color;

					this._updateZoom ( zoomData );
				}
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
				case "temp":
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
								case "signal":
								{
									// TODO management of c.oef
									console.log ( this.chartConf.data )
									break;
								}
								case "sync":
								{
									for ( let d of this.graph.main.config.data.datasets )
									{
										d.data = d.trueData.map( v=>v*c.coef );
									}
									break;
								}
								case "async":
								{
									// TODO management of c.oef
									console.log ( this.chartConf.data )
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
		}
	}

	_updateGraph ( id, force = false )
	{
		if ( force
			&& this.graph[ id ]?.debounce )
		{ // force update
			clearTimeout ( this.graph[ id ]?.debounce )
		}
		else if ( this.graph[ id ]?.debounce )
		{
			return;
		}

		if ( !this.graph[ id ].chart )
		{
			return;
		}
		
		if ( this.graph[ id ].chart.width == 0 )
		{
			this.graph[ id ].chart.destroy ( );
			this.graph[ id ] = new Chart ( this.graph[ id ].canvas.getContext('2d'), this.graph[ id ].config );
		}
		else
		{
			this.graph[ id ].chart.update();

			this.graph[ id ].debounce = setTimeout( ()=>{
				this.graph[ id ].debounce = undefined;
			}, this.config.debounce.time );
		}
	}

	_updateZoom ( params )
	{
		if ( true != this.config.zoom )
		{
			return;
		}

		// get min / max to drax grey rectangle of zoom in zoom graph
		if ( ( false == params.zoom )
			&& ( undefined != this.graph.main.chart.scales.x )
			&& ( undefined != this.graph.main.chart.scales.y ) )
		{
			params.x.min = this.graph.main.chart.scales.x.min;
			params.x.max = this.graph.main.chart.scales.x.max;
			params.y.min = this.graph.main.chart.scales.y.min;
			params.y.max = this.graph.main.chart.scales.y.max;
		}

		// update the color of labels
		this.graph.zoom.config.options.scales.x.ticks.color = params.color;
		this.graph.zoom.config.options.scales.y.ticks.color = params.color;

		// get the min max value to draw full curve on zoom graph
		let x = {
			min: [],
			max: [],
		};
		let y = {
			min: [],
			max: [],
		};

		for ( let d of this.graph.main.config.data.datasets )
		{
			x.min.push ( Math.min( ...d.data.map((p)=>{return p.x;}) ) );
			x.max.push ( Math.max( ...d.data.map((p)=>{return p.x;}) ) );

			y.min.push ( Math.min( ...d.data.map((p)=>{return p.y;}) ) );
			y.max.push ( Math.max( ...d.data.map((p)=>{return p.y;}) ) );
		}

		if ( ( params.zoom == false )
			&& ( params.update == true ) )
		{
			this.graph.main.config.options.scales.x.min = Math.min ( ...x.min );
			this.graph.main.config.options.scales.x.max = Math.max ( ...x.max );
		
			this._updateGraph ( "main" );
		}

		if ( true == this.config.zoom )
		{
			this.graph.zoom.config.options.scales.x.min = Math.min ( ...x.min );
			this.graph.zoom.config.options.scales.x.max = Math.max ( ...x.max );

			this.graph.zoom.config.options.scales.y.min = Math.min ( ...y.min );
			this.graph.zoom.config.options.scales.y.max = Math.max ( ...y.max );
			
			this._updateGraph ( "zoom" );
		}
	}
}

class Els_csv extends Els_Back {
	constructor ( config, id )
	{
		super( config, id );

		this.config.separator ||= ',';

		this.title = document.createElement ( "h3" );
		this._domEl.appendChild ( this.title );
		this.title.innerHTML = config.title || 'Download CSV';

		[this.divEntries,this.entries] = _createInput ( "Nb Entries" );
		this._domEl.appendChild ( this.divEntries );
		this.entries.disabled = true;
		this.entries.value = 0;

		[this.divLast,this.last] = _createInput ( "Save Last" );
		this._domEl.appendChild ( this.divLast );
		this.last.value = 0;

		[this.periodeDiv,this.periode]= _createInput ( "Save Every" );
		this._domEl.appendChild ( this.periodeDiv );
		this.periode.min = 0;
		this.periode.placeholder = "hours";

		[this.divDownload,this.download] = _createIconButton ( "Download", "download" );
		this._domEl.appendChild ( this.divDownload );

		[this.divClean,this.clean] = _createIconButton ( "Clean log", "trash" );
		this._domEl.appendChild ( this.divClean );

		this.update ( );

		this.csv = undefined;
		this.mode = undefined;
		this.lastIndex = undefined;

		if ( config.channel )
		{
			if ( config.channel.synchro )
			{
				this.csv = {};
				this.mode = "obj";
				
				let cb = {
					periode: config.periode || 0,
					channel: config.channel.synchro,
					f: (msg)=>{
						this.csv[ msg.value ] = [];
						this.lastIndex = msg.value;

						let nb = Object.keys ( this.csv ).length
						if ( this.last.value == this.entries.value )
						{
							this.last.value = nb;
						}
						this.entries.value = nb;
					}
				};

				this._callArgs.push ( cb );
			}
			else
			{
				this.csv = [];
				this.mode = "array";
			}

			for ( let [i,c] of config.channel.data.entries() )
			{
				let cb = {
					periode: config.periode || 0,
					channel: c,
					f: (msg)=>{
						if ( "array" == this.mode )
						{
							if ( undefined == this.csv[ i ] )
							{
								this.csv[ i ] = [];
							}
							this.csv[ i ].push ( msg.value );

							if ( this.entries.value < this.csv[ i ].length )
							{
								if ( this.last.value == this.entries.value )
								{
									this.last.value = this.csv[ i ].length;
								}
								this.entries.value = this.csv[ i ].length;
							}
						}
						else if ( undefined != this.lastIndex )
						{
							this.csv[ this.lastIndex ][ i ] = msg.value;
						}
					}
				};

				this._callArgs.push ( cb );
			}
		}

		this.clean.addEventListener ('click', ()=>{
			console.log( "clean")
			if ( "obj" == this.mode )
			{
				this.csv = {};
				this.lastIndex = undefined;
			}
			else if ( "array" == this.mode )
			{
				this.csv = [];
			}
			this.entries.value = 0;
			this.last.value = 0;
		});

		this.download.addEventListener ('click', ()=>{
			let keys = "";
			let out = [];
			if ( "obj" == this.mode )
			{
				for ( let k in this.csv )
				{
					out.push ( k+this.config.separator+this.csv[ k ].join ( this.config.separator ) );
				}

				keys = (this.config.channel.title || this.config.channel.synchro) + this.config.separator;
			}
			else if ( "array" == this.mode )
			{
				for ( let data of this.csv )
				{
					for ( let i = 0; i < this.entries.value; i++ )
					{
						if ( undefined == out[ i ] )
						{
							out[ i ] = "";
						}
						
						if ( ( undefined == data )
							|| ( undefined == data[ i ] ) )
						{
							out[ i ] += this.config.separator;
						}
						else
						{
							out[ i ] += data[ i ]+this.config.separator;
						}
					}
				}
			}

			// reduce the number of line following the "x last" value
			while ( out.length > ( this.last.value ) )
			{
				out.shift ( );
			}

			// create the columnt headers
			if ( this.config.channel.titles )
			{
				keys += this.config.channel.titles.join ( this.config.separator )
			}
			else
			{
				keys += this.config.channel.data.join ( this.config.separator );
			}
			out.unshift ( keys );

			out = out.join ( "\n" );

			let downloadLink = document.createElement ( "a" );
			downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI( out );
			if ( true == this.config.prompt )
			{
				downloadLink.download = prompt ( "nom du fichier ?", this.config.file || "CSV_"+new Date().toISOString() )

				if ( "null" == downloadLink.download )
				{
					return;
				}
			}
			else if ( this.config.file )
			{
				downloadLink.download = this.config.file+'.csv'
			}
			else
			{
				downloadLink.download = "CSV_"+new Date().toISOString()+".csv";
			}

			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		});

		this.periode.addEventListener ( "change", ()=>{
			if ( this.interval )
			{
				clearInterval ( this.interval );
			}

			if ( 0.01666 < this.periode.value )
			{
				this.interval = setInterval ( ()=>{
					let prompt  = this.config.prompt;
					this.config.prompt = false;

					this.download.dispatchEvent ( new Event ( "click" ) );

					setTimeout ( ()=>{
						this.clean.dispatchEvent ( new Event ( "click" ) );
					}, 1000 );

					this.config.prompt  = prompt;
				},  this.periode.value * 3600 * 1000 );
			}
		})
	}

	update ( config )
	{
		this._update ( config );
		if ( config )
		{
			for ( let key in config )
			{

			}
		}

		this.divEntries.style.display  = ( true  == this.config?.display?.entries )? "flex" : "none";
		this.divLast.style.display     = ( true  == this.config?.display?.last )?    "flex" : "none";
		this.divClean.style.display    = ( true  == this.config?.display?.clean )?   "flex" : "none";
		this.divDownload.style.display = ( false == this.config?.display?.download )? "none" : "flex";
		this.periodeDiv.style.display  = ( false == this.config?.display?.every )?    "none" : "flex";
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type:"csv",
			separator:",",
			display:{
				entries:true, // affiche ou non le nombre de lignes du fichier
				clean:true, // affiche un bouton de RAZ du CSV
				last:true // affiche un bouton permettant de limiter le nombre de lignes a générer
			},
			prompt: false, // demande le nom du fichier de sortie
			file: undefined, // nom du fichier de sortie
			periode: 0,
			channel:{
				synchro:"WS_DATA_CHANNEL", // channel de synchro (horodatage)
				title:"chrono", // titre de la colone de synchro dans le CSV
				data:[], // channels de donnés
				titles:[] // titres des colonnes dans le CSV
			}
		}

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

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
	constructor ( config, id )
	{
		super( config, id );

		this._tab = [];
		this.update ( );
	}

	update ( config )
	{
		if ( config )
		{
			this._config = config;;
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
				obj: ret.obj.button,
				cmd: ret.cmd,
				arg: ret.arg
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

		obj.label.innerText = config.label || "";
		obj.button.innerText = config.text || "X";

		Object.assign ( obj.div.style, {
			display: "flex",
			alignItems: "strech",
			textAlign: "center",
			flexGrow: "1",
			padding: "10px",
		});

		return {obj, cmd:config.cmd, arg:config.arg};
	}

	static canCreateNew ( )
	{
		return true;
	}

	static new ( params = {}, config = undefined )
	{
		function drawTable ( table, json, jsonDiv, outDiv )
		{
			while ( table.childElementCount >= json.options.length )
			{
				table.removeChild ( table.lastChild );
			}

			for ( let i = table.childElementCount; i < json.options.length; i++ )
			{
				let line = document.createElement ( "tr" );
				table.appendChild ( line );

				for ( let item of ["label","text","cmd","arg"] )
				{
					let cell = document.createElement ( "td" );
					line.appendChild ( cell );
					// cell.style.width = "24%";

					if ( !json.options[ i ] )
					{
						json.options[ i ] = {};
					}

					let iVal = document.createElement ( "input" );
					cell.appendChild ( iVal );
					iVal.value = json.options[ i ][ item ] || "";
					iVal.onchange = (ev)=>{
						json.options[ i ][ item ] = ev.target.value.trim ( );
						Els_Back.newJson ( json, jsonDiv, outDiv );
					}
				}
			}
		}

		if ( undefined == params.id )
		{
			params.id = Math.random ( );
		}

		let json = {
			type: "button",
			options:[
				{
					label: "X",
					text: "Y",
					cmd: "visuEcho"
				}
			]
		};

		if ( undefined != config )
		{
			Object.assign ( json, config );
		}

		try
		{
			let configDiv = document.createElement ( "div" );
			
			let [divNbB,iNbB] = _createInput ( "Nb of Buttons" );
			configDiv.appendChild ( divNbB );
			iNbB.value = json.options.length;
			iNbB.type = "number";
			iNbB.min = "0";
			iNbB.style.width = "5em";
			iNbB.onchange = (ev)=>{
				if ( ev.target.value < 0 )
				{
					ev.target.value = 0;
				}

				if ( ev.target.value < json.options.length )
				{
					json.options = json.options.slice ( 0, ev.target.value );
				}
				else if ( ev.target.value > json.options.length )
				{
					for ( let i = json.options.length; i < ev.target.value; i++ )
					{
						json.options[ i ] = {};
					}
				}
				drawTable ( tbody, json, jsonDiv, outDiv )
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iNbB.onkeyup = iNbB.onchange;

			let tab = document.createElement ( "table" );
			configDiv.appendChild ( tab );
			tab.style.width = "100%";
			tab.style.tableLayout = "fixed";

			let thead = document.createElement ( "thead" );
			tab.appendChild ( thead )
			let tr = document.createElement ( "tr" );
			thead.appendChild ( tr )
			for ( let item of ["label","button","cmd","arg"] )
			{
				let cell = document.createElement ( "td" );
				tr.appendChild ( cell );

				cell.innerText = item;
			}
			let tbody = document.createElement ( "tbody" );
			tab.appendChild ( tbody )

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				drawTable ( tbody, json, jsonDiv, outDiv );
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
			}
			jsonDiv.onkeyup = jsonDiv.onchange;

			let outDiv = Els_Back._newOut ( params.id, json );

			drawTable ( tbody, json, jsonDiv, outDiv );

			return { config:configDiv, json:jsonDiv, out:outDiv._domEl };
		}
		catch ( e )
		{
			return e;
		}
	}
}

const Els = {
	title: Els_title,
	text: Els_text,
	img: Els_img,
	title_id: Els_title_id,
	text_id: Els_text_id,
	unit_id: Els_unit_id,
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
};

/// \brief Create select entry
/// \param [ in ] array : array of String what represent the option list
/// \return [div,select]
///     div : main object need to be added to the DOM list
///     select : DOM element used to add event listener
function _createSelect ( array = [] )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	label.innerHTML = "Data : ";

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
		label.style.flexGrow = 1;
	}

	let input = document.createElement ( "input" );
	div.appendChild ( input );

	if ( undefined == option )
	{
		return [div,input];
	}

	if ( "Array" == option.constructor.name )
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

	button = document.createElement("button");
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
	/// \brief function called once user click on a color
	/// \param [ in ] ev : event
	/// \param [ in ] cb : user callback
	function colorClicker ( ev, cb )
	{
		let target = ev.target;
		if ( target.active == true )
		{
			return;
		}
		target.active = true;
		createColorPiker( undefined,
			(color)=>{
				target.style.backgroundColor = "rgba("+color.join(',')+")";
				target.active = false;
				cb ( ev, color );
			},
			(color)=>{
				target.style.backgroundColor = "rgba("+color.join(',')+")";
				target.active = false;
				cb ( ev, color );
			});
	}

	params = Object.assign ( {
		type: "div",
		callback: undefined,
		label: undefined,
	}, params );

	let div = document.createElement ( params.type );
	div.style.display = "flex";

	if ( params.label )
	{
		let label = document.createElement ( "label" );
		div.appendChild ( label );
		label.innerHTML = params.label+" : ";
		label.style.flexGrow = 1;
	}

	let iColor = document.createElement ( params.type );
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

function _calcCoef ( type, baseUnit, currentUnit )
{
	let coef = 1;
	let print = "";

	switch ( type )
	{
		case "volume":
		{
			if ( currentUnit
				&& baseUnit )
			{
				coef = volumeConvert ( 1, currentUnit.volume, baseUnit.volume )
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
		case "temp":
		{
			if ( currentUnit
				&& baseUnit )
			{
				coef = temperatureConvert ( 1, currentUnit.temperature, baseUnit.temperature );
			}

			if ( baseUnit )
			{
				print = "°" + currentUnit;
			}
			break;
		}
	}
	return {coef,print}
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