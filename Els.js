class Els_Back {
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

	update ( config )
	{
	}

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

	get callbacks ( )
	{
		return this._callArgs || [];
	}

	get dom ( )
	{
		return this._domEl;
	}

	get _els ( )
	{
		return this._elList;
	}

	get config ( )
	{
		return this._config || {};
	}

	static canCreateNew ( )
	{
		return false;
	}

	static new ( id = {} )
	{
		return new Promise((ok,ko)=>{ko("not available for this type")});
	}

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

	static newJson ( json, jsonDiv, outDiv, jsonText )
	{

		try
		{
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
			json = JSON.parse ( JSON.stringify ( config ) );
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
			json = JSON.parse ( JSON.stringify ( config ) );
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

	static canCreateNew ( )
	{
		return false;
	}
}

class Els_text_id extends Els_text {
	constructor ( config, id )
	{
		super( config, id );
		this._els.innerHTML = createEls ( config.text_id, config.prefix );
	}

	static canCreateNew ( )
	{
		return false;
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
			json = JSON.parse ( JSON.stringify ( config ) );
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
		
		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: console.log
		};


		switch ( config.valueType )
		{
			case "volume":
			{
				cb.f = (msg)=>{
					if ( undefined != config.coef )
					{
						msg.value *= config.coef;
					}

					this.divData.innerHTML = refactor ( volumeConvert ( msg.value, unit.volume, "m3" ), "v_"+unit.volume );
					this.divUnit.innerHTML = unit.volume || "?";
				};
				break;
			}
			case "flow":
			{
				cb.f = (msg)=>{
					if ( undefined != config.coef )
					{
						msg.value *= config.coef;
					}

					this.divData.innerHTML = refactor ( volumeConvert ( msg.value, unit.flow_v, "m3" ) / timeConvert ( 1, unit.flow_t, "s" ), 1 );
					this.divUnit.innerHTML = (unit.flow_v || "?") + "/" +(unit.flow_t || "?");
				}
				break;
			}
			case "temp":
			{
				cb.f = (msg)=>{
					if ( undefined != config.coef )
					{
						msg.value *= config.coef;
					}

					this.divData.innerHTML = refactor ( temperatureConvert ( msg.value, unit.temperature, "C" ), "T_"+unit.temperature );
					this.divUnit.innerHTML = "°" + unit.temperature;
				}
				break;
			}
			case "date":
			{
				cb.f = (msg)=>{
					if ( undefined != config.coef )
					{
						msg.value *= config.coef;
					}

					this.divData.innerHTML = new Date ( msg.value ).toISOString ( ).replace ( "T"," " ).replace ( "Z", "" ).replace ( ".000", "" );
				};
				break;
			}
			default:
			{
				cb.f = (msg)=>{
					msg.value *= config.coef || 1;
					if ( undefined != refactor )
					{
						let a = config.valueType;
						if ( a == undefined )
						{
							a = 1;
						}
						this.divData.innerHTML = refactor ( msg.value, a );
					}
					else
					{
						this.divData.innerHTML = msg.value;
					}

					if ( config.unit )
					{
						this.divUnit.innerHTML =  config.unit;
					}
					else
					{
						this.divUnit.style.display = "none"
					}
				}
				break;
			}
		}

		this._callArgs.push ( cb );
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
			json = JSON.parse ( JSON.stringify ( config ) );
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


		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				switch ( msg.value )
				{
					case 0:
					{
						this.div.style="--status-color:red";
						break
					}
					case 1:
					{
						this.div.style="--status-color:green";
						break
					}
					default:
					{
						this.div.style="";
						break;
					}
				}
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
			json = JSON.parse ( JSON.stringify ( config ) );
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
			json = JSON.parse ( JSON.stringify ( config ) );
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

		let canvas = document.createElement ( "canvas" );
		this._domEl.appendChild ( canvas );
		this.gauge = undefined;

		this.opt = {
			angle:0,
			lineWidth:0.2,
			radiusScale:1,
			addText:true,
			pointer: {
				length: 0.6,
				strokeWidth: 0.035,
				color: "#000"
			},
			colorStop: "#5C57DA",
			gradientType: 0,
			strokeColor: "#e0e0e0",
			generateGradient: true,
			staticLabels: {
				font: "10px sans-serif",
				labels: [],
				color: "#000",
				fractionDigits: 0
			}
		}

		Object.assign ( this.opt, config.options );

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				if ( !this.gauge )
				{
					return;
				}
				this.gauge.options.staticLabels.color = getComputedStyle(this.gauge.canvas).getPropertyValue("--main-text") || "#000";
				this.gauge.set(msg.value);
			}
		};
		this._callArgs.push ( cb );

		let interval = setInterval (()=>{
			// parent not displayed
			if ( ( 0 == this._domEl.clientHeight )
				|| ( 0 == this._domEl.clientWidth ) )
			{
				return;
			}

			clearInterval ( interval );

			// create gauge itself
			this.gauge = new Gauge( canvas )
				.setOptions(this.opt);

			this.gauge.config = {
				radiusScale: this.gauge.options.radiusScale,
				lineWidth: this.gauge.options.lineWidth,
				baseLabels: [],
			}

			this._addMinMaxLabel ( config, this.gauge.config.baseLabels );

			if ( config.options?.staticZones )
			{
				for ( let s of config.options.staticZones )
				{
						this._addMinMaxLabel ( s, this.gauge.config.baseLabels );
				}
			}

			this.gauge.config.baseLabels.sort();

			this.opt.staticLabels.labels = [...this.gauge.config.baseLabels];

			this.gauge.minValue = config.min || this.opt.staticLabels?.labels?.at ( 0 ) || 0;
			this.gauge.maxValue = config.max || this.opt.staticLabels?.labels?.at ( -1 ) || 100;

			if ( config.default )
			{
				this.gauge.set ( config.default );
			}

			this.gauge.canvas.width = this.gauge.canvas.parentNode.clientWidth;
			this.gauge.canvas.height = this.gauge.canvas.parentNode.clientHeight;

			// corect size of the gauge if needed
			let coef = Math.min ( this.gauge.canvas.width, 400 ) / 400;

			this.gauge.availableHeight = this.gauge.canvas.height * 0.8;
			this.gauge.options.radiusScale = this.gauge.config.radiusScale * coef;
			this.gauge.options.lineWidth = this.gauge.config.lineWidth * coef;

			this.gauge.setOptions();

		}, 1000 );
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
		// console.log ( config )
		this._update ( config );

		for ( let k of Object.keys ( config ) )
		{
			switch ( k )
			{
				case "min":
				case "max":
				{
					this.gauge.config.baseLabels = [];
					this._addMinMaxLabel ( config, this.gauge.config.baseLabels );
					this.gauge.config.baseLabels.sort();
					break;
				}
				case "default":
				{
					this.gauge.set(config.default);
					break;
				}
				case "options":
				{
					Object.assign ( this.opt, config[ k ] );
					break;
				}
				default:
				{
					break;
				}
			}
		}

		this.gauge.setOptions(this.opt);
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
			type:"gauge",
			channel:"WS_DATA_CHANNEL",
			periode:0,
			min:0,
			max:100,
			default:50,
			options:{
				angle:0.1,
				radiusScale:1,
			}
		}

		let domEls = {
			line: [],
		};

		if ( undefined != config )
		{
			json = JSON.parse ( JSON.stringify ( config ) );
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

					let color = document.createElement ( "td" );
					tr.appendChild ( color );
					color.appendChild ( document.createTextNode ( params.color ) );

					let max = document.createElement ( "th" );
					tr.appendChild ( max );
					max.appendChild ( document.createTextNode ( params.max ) );
				}
				else
				{
					let [divMin,iMin] = _createInput ( );
					tr.appendChild ( divMin );
					iMin.value = params.min;
					iMin.onchange = (ev)=>{
						params.min = Number ( ev.target.value );
						Els_Back.newJson ( json, jsonDiv, outDiv );
					}
					iMin.onkeyup = iMin.onchange;

					let [noUsed,iColor] = _createColorClicker ( {
						callback: (ev,color)=>{
							params.strokeStyle = "rgba("+color.join(',')+")";
							Els_Back.newJson ( json, jsonDiv, outDiv );
						},
						type: "td",
					} );
					tr.appendChild ( iColor );

					let [divMax,iMax] = _createInput ( );
					tr.appendChild ( divMax );
					iMax.value = params.max;
					iMax.onchange = (ev)=>{
						params.max = Number ( ev.target.value );
						Els_Back.newJson ( json, jsonDiv, outDiv );
					}
					iMax.onkeyup = iMax.onchange;
				}

				return tr;
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

			let [divMin,iMin] = _createInput ( "Min" );
			configDiv.appendChild ( divMin );
			iMin.type = "number";
			iMin.value = json.min;
			iMin.onchange = (ev)=>{
				json.min = Number ( ev.target.value );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iMin.onkeyup = iMin.onchange;

			let [divDef,iDef] = _createInput ( "Default" );
			configDiv.appendChild ( divDef );
			iDef.type = "number";
			iDef.value = json.default;
			iDef.onchange = (ev)=>{
				json.default = Number ( ev.target.value );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iDef.onkeyup = iDef.onchange;

			let [divMax,iMax] = _createInput ( "Max" );
			configDiv.appendChild ( divMax );
			iMax.type = "number";
			iMax.value = json.max;
			iMax.onchange = (ev)=>{
				json.max = Number ( ev.target.value );
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iMax.onkeyup = iMax.onchange;

			let [divZon,iZon] = _createInput ( "Zones" );
			configDiv.appendChild ( divZon );
			iZon.type = "number";
			iZon.value = 0;
			iZon.onchange = (ev)=>{
				let index = Number ( ev.target.value );
				if ( index < 0 )
				{
					index = 0;
					ev.target.value = 0;
				}

				// remove statics zones
				if ( 0 == index )
				{
					json.options.staticZones = undefined;
					domEls.line = [];
					while ( tabZone.childNodes.length > 1 ) // keep only head
					{
						tabZone.removeChild ( tabZone.lastChild );
					}
					tabZone.style.display = "none";
					divStartStop.style.display = "";
					Els_Back.newJson ( json, jsonDiv, outDiv );
					return;
				}

				tabZone.style.display = "";
				divStartStop.style.display = "none";
				
				// create statics zones
				if ( !json.options?.staticZones )
				{
					json.options.staticZones = [];
				}

				for ( let i = json.options.staticZones.length; i < index; i++  )
				{
					json.options.staticZones[ i ] = {
						strokeStyle: json.options.staticZones.at ( i )?.strokeStyle,
						min: json.options.staticZones.at ( i -1 )?.max || json.min,
						max: json.max,
					};

					domEls.line[ i ] = createLine ( json.options.staticZones[ i ] );
					tabZone.appendChild ( domEls.line[ i ] );
				}

				if ( index < json.options.staticZones.length )
				{
					json.options.staticZones.splice ( index );

					while ( tabZone.childNodes.length + 1 > index ) // keep nb of line + head
					{
						tabZone.removeChild ( tabZone.lastChild );
					}

					domEls.line.splice ( index );
				}
				Els_Back.newJson ( json, jsonDiv, outDiv );
			}
			iZon.onkeyup = iZon.onchange;

			let divStartStop = document.createElement ( "div" );
			configDiv.appendChild ( divStartStop );

			let [divStart,iStart] = _createColorClicker ( {
				label:"begin",
				callback: (ev,color)=>{
					json.options.colorStart = "rgba("+color.join(',')+")";
					json.options.colorStop = json.options.colorStart;
					Els_Back.newJson ( json, jsonDiv, outDiv );
				}
			} );
			divStartStop.appendChild ( divStart );

			let [divStop,iStop] = _createColorClicker ( {
				label: "end",
				callback: (ev,color)=>{
					json.options.strokeColor = "rgba("+color.join(',')+")";
					Els_Back.newJson ( json, jsonDiv, outDiv );
				}
			} );
			divStartStop.appendChild ( divStop );


			let tabZone = document.createElement ( "table" );
			configDiv.appendChild ( tabZone );
			tabZone.style.display = "none";
			tabZone.appendChild ( createLine ( {min: "Min", color:"Color", max:"Max", type:"th"} ) );

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				Els_Back.newJson ( json, jsonDiv, outDiv, ev.target.value );
				sCha.value = json?.channel || "";
				sPer.value = json?.periode || "";
				iMin.value = json?.min || "";
				iDef.value = json?.default || "";
				iMax.value = json?.max || "";
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
				this.p.innerHTML = msg.value + "<br>" + p.innerHTML;
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

			switch ( d.type )
			{
				case "bin":
				{
					cb.f = (msg)=>{
						style.innerHTML = "#"+d.id+"{fill:"+((msg.value)?"green":"red")+"}";
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
		super( config, id );
		
		this.divMain = document.createElement("div");
		this._domEl.appendChild( this.divMain );
		this.divMain.className = "main";

		let canvas = document.createElement("canvas");
		this.divMain.appendChild( canvas );
		let canvasZ = undefined;

		let chart = null; // base graph
		let chartZ = null; // zoom overview graph

		this.chartConf = {
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
		}; // conf for base graph
		this.chartZConf = undefined; // conf of zoom graph

		let data = {
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

		// defined base config of the graphs signal, sync or async
		if ( config.subType == "sync" )
		{ // in case of sync graph set the X axis data input
			this.chartConf.type = 'line';
			this.chartConf.data = {
				labels:[],
				datasets:[]
			};
			let cb = {
				periode: config.periode || 0,
				channel: config.channel,
				f: (msg)=>{
					this.chartConf.data.labels.push ( msg.value );
					if ( this.chartConf.data.labels.length > config.deep  )
					{
						let rm = this.chartConf.data.labels.length - config.deep
						this.chartConf.data.labels.splice( 0, rm );
						for ( let d of this.chartConf.data.datasets )
						{
							d.data.splice ( 0, rm );
						}
					}

					if ( !chart )
					{
						chart = new Chart ( canvas.getContext('2d'), this.chartConf );
					}
					else if ( chart.width == 0 )
					{
						chart.destroy ( );
						chart = new Chart ( canvas.getContext('2d'), this.chartConf );
					}
					else if ( ( data.zoom == false )
						&& ( data.update == true ) )
					{
						chart.update();
					}
				}
			}
			this._callArgs.push ( cb );
		}
		else
		{ // async/signal case
			this.chartConf.type = 'scatter',
			this.chartConf.data = {
				datasets:[]
			};
		}

		// init config of zoom overview graph
		if ( true == config.zoom )
		{
			this.divZoom = document.createElement("div");
			this.divZoom.className = "zoom";
			this._domEl.appendChild( this.divZoom );

			canvasZ = document.createElement( "canvas" );
			this.divZoom.appendChild( canvasZ );
			canvasZ.addEventListener ( "dblclick", ()=>{
				data = chart.getInitialScaleBounds ( );
				data.zoom = false;
				chart.resetZoom ( );
				chart.update ( );
				chartZ.update ( );
			});

			this.chartZConf = {
				type: this.chartConf.type,
				data: this.chartConf.data,
				options: {
					maintainAspectRatio: false,
					animation: false,
					scales: {
						x: {},
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
				plugins: this.chartConf.plugins
			};

			this.chartZConf.plugins.push ({
				id: 'quadrants',
				beforeDraw(chart, args, opt) {
					const {ctx, scales: {x, y}} = chart;

					let left = x.getPixelForValue(data.x.min);
					let right = x.getPixelForValue(data.x.max);
					let bot = y.getPixelForValue(data.y.min);
					let top = y.getPixelForValue(data.y.max);

					ctx.save();
					ctx.fillStyle = "rgba(128,128,128,0.2)";
					ctx.fillRect( left, top, right - left, bot - top);
					ctx.restore();
				}
			});

			this.chartConf.options.plugins.zoom = {
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
						data.x.min = c.chart.scales.x.start;
						data.x.max = c.chart.scales.x.end;
						data.y.min = c.chart.scales.y.start;
						data.y.max = c.chart.scales.y.end;

						data.zoom = true;

						chartZ.update ( );
					},
					onZoomRejected: (c)=>{
						data.update = true;
					},
					onZoomComplete: (c)=>{
						data.update = true;
					},
					onZoomStart: (c)=>{
						data.update = false;
					}
				},
				limits: {
					x: {
						minRange: 3,
					},
				}
			};
		}

		// capitalize First Letter
		function cFL(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		// add min / max on graph
		for ( let label of ["min","max"] )
		{
			if ( undefined == config[ label ] ) continue;
			
			this.chartConf.options.scales.y[ "suggested"+cFL( label ) ] = config[ label ];

			if ( true != config.zoom ) continue;
		
			this.chartZConf.options.scales.y[ "suggested"+cFL( label ) ] = config[ label ];
		}

		for ( let [i,c] of config.curve.entries() )
		{
			let index = this.chartConf.data.datasets.length;

			this.chartConf.data.datasets[index] = {
				label:c.name,
				data:[],
				borderColor:c.color,
				tension:c.tension||0.1,
				showLine:c.showLine || true,
				pointRadius: c.pointRadius || 0,
				pointStyle: c.pointStyle || "round"
			};

			if ( c.fill != undefined )
			{
				this.chartConf.data.datasets[index].fill = c.fill - i + "";
				this.chartConf.data.datasets[index].fillBetweenSet = 0;
			}

			this._callArgs.push ({
				channel: c.channel,
				periode: c.periode || 0,
				f: (msg)=>{
					switch ( config.subType )
					{
						case "signal":
						{
							this.chartConf.data.datasets[ index ].data = JSON.parse ( msg.value );
							break;
						}
						case "sync":
						{
							if ( this.chartConf.data.datasets[ index ].data.length < this.chartConf.data.labels.length  )
							{ // add data only if we add a label for this data
								// add the data to the last label
								this.chartConf.data.datasets[ index ].data[ this.chartConf.data.labels.length - 1 ] = msg.value;
							}
							break;
						}
						case "async":
						{
							this.chartConf.data.datasets[ index ].data.push ( msg.value );
							let deep = c.deep || config.deep;
							if ( ( undefined != deep )
								&& ( this.chartConf.data.datasets[ index ].data.length > deep ) )
							{
								this.chartConf.data.datasets[ index ].data.splice( 0, this.chartConf.data.datasets[ index ].data.length - deep )
							}

							let min  = [];
							let max  = [];
							for ( let d of this.chartConf.data.datasets )
							{
								min.push ( Math.min( ...d.data.map((p)=>{return p.x;}) ) );
								max.push ( Math.max( ...d.data.map((p)=>{return p.x;}) ) );
							}

							if ( ( data.zoom == false )
								&& ( data.update == true ) )
							{
								this.chartConf.options.scales.x.min = Math.min ( ...min );
								this.chartConf.options.scales.x.max = Math.max ( ...max );
							}

							if ( true == config.zoom )
							{
								this.chartZConf.options.scales.x.min = Math.min ( ...min );
								this.chartZConf.options.scales.x.max = Math.max ( ...max );
							}
							break;
						}
					}

					if ( !chart )
					{
						chart = new Chart ( canvas.getContext('2d'), this.chartConf );
					}
					else if ( chart.width == 0 )
					{
						chart.destroy ( );
						chart = new Chart ( canvas.getContext('2d'), this.chartConf );
					}
					else if ( ( data.zoom == false )
						&& ( data.update == true ) )
					{
						chart.update();
					}

					if ( ( false == data.zoom )
						&& ( undefined != chart.scales.x )
						&& ( undefined != chart.scales.y ) )
					{
						data.x.min = chart.scales.x.min;
						data.x.max = chart.scales.x.max;
						data.y.min = chart.scales.y.min;
						data.y.max = chart.scales.y.max;
					}

					let color = getComputedStyle(chart.canvas).getPropertyValue("--main-text")
					
					this.chartConf.options.scales.x.ticks.color = color;
					this.chartConf.options.scales.y.ticks.color = color;

					if ( true != config.zoom )
					{
						return;
					}

					if ( !chartZ )
					{
						chartZ = new Chart ( canvasZ.getContext('2d'), this.chartZConf );
					}
					else if ( chartZ.width == 0 )
					{
						chartZ.destroy ( );
						chartZ = new Chart ( canvasZ.getContext('2d'), this.chartZConf );
					}
					else
					{
						chartZ.update();
					}

					this.chartZConf.options.scales.x.ticks.color = color;
					this.chartZConf.options.scales.y.ticks.color = color;
				}
			});
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
			json = JSON.parse ( JSON.stringify ( config ) );
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

			let [divDat,iDat] = _createInput ( "Data" );
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
};

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

function _createInputArray ( inText, array = [] )
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

	if ( undefined != array )
	{
		let list = document.createElement ( "datalist" );
		div.appendChild ( list );
		list.id = "newList"+Math.random( );
		input.setAttribute ( 'list', list.id );

		for ( let index in array )
		{
			let option = document.createElement ( "option" );
			option.value = array[ index ].label;
			option.innerHTML = array[ index ].label;
			list.appendChild ( option );
		}
	}

	return [div,input];
}

function _createSelectPeriode ( )
{
	let periodes = [
		{label:"event",value:0},
		{label:"1 s",value:1},
		{label:"2 s",value:2},
		{label:"10 s",value:3},
	];

	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	label.innerHTML = "Timming : ";

	let select = document.createElement ( "select" );

	for ( let p of periodes )
	{
		let option = document.createElement ( "option" );
		option.value = p.value;
		option.innerHTML = p.label;
		select.appendChild ( option );
	}

	div.appendChild ( label );
	div.appendChild ( select );

	return [div,select];
}

function _createInput ( inLabel, option = undefined )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	div.appendChild ( label );
	if ( inLabel )
	{
		label.innerHTML = inLabel+" : ";
	}
	label.style.flexGrow = 1;

	let input = document.createElement ( "input" );
	div.appendChild ( input );

	if ( ( undefined != option )
		&& ( "Array" == option.constructor.name ) )
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

function _createIconButton ( inLabel, iconName )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	label.innerHTML = inLabel+" : ";
	label.style.flexGrow = 1;

	button = document.createElement("button");
	button.classList.add ( "fa" );
	button.classList.add ( "fa-"+iconName );
	button.style.minWidth = "1.5em";

	div.appendChild ( label );
	div.appendChild ( button );

	return [div,button];
}

function _createColorClicker ( params = {} )
{
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
			()=>{

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

