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
			title.onchange = (ev)=>{
				json.text=ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					title.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
			text.onchange = (ev)=>{
				json.text=ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					text.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
			imgSrc.onchange = (ev)=>{
				json.src=ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					imgSrc.value = json.src;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
			iLa.onchange = (ev)=>{
				json.gps[0].a = ev.target.value;
				json.view.b = Number ( ev.target.value ) - 0.01;
				json.view.d = Number ( ev.target.value ) + 0.01;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let [divLo,iLo] = _createInput ( "Longitude (E/W)" );
			configDiv.appendChild ( divLo );
			iLo.type = "number";
			iLo.onchange = (ev)=>{
				json.gps[0].b = ev.target.value;
				json.view.a = Number ( ev.target.value ) - 0.01;
				json.view.c = Number ( ev.target.value ) + 0.01;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					text.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
					this.divData.innerHTML = refactor ( volumeConvert ( msg.value, unit.volume, "m3" ), "v_"+unit.volume );
					this.divUnit.innerHTML = unit.volume || "?";
				};
				break;
			}
			case "flow":
			{
				cb.f = (msg)=>{
					this.divData.innerHTML = refactor ( volumeConvert ( msg.value, unit.flow_v, "m3" ) / timeConvert ( 1, unit.flow_t, "s" ), 1 );
					this.divUnit.innerHTML = (unit.flow_v || "?") + "/" +(unit.flow_t || "?");
				}
				break;
			}
			case "temp":
			{
				cb.f = (msg)=>{
					this.divData.innerHTML = refactor ( temperatureConvert ( msg.value, unit.temperature, "C" ), "T_"+unit.temperature );
					this.divUnit.innerHTML = "°" + unit.temperature;
				}
				break;
			}
			default:
			{
				cb.f = (msg)=>{
					msg.value *= config.coef || 1;
					let a = config.valueType;
					if ( a == undefined )
					{
						a = 1;
					}
					this.divData.innerHTML = refactor ( msg.value, a );
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
			json.channel = sCha.value;
			sCha.onchange = (ev)=>{
				json.channel = ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
			}

			let [divPer,sPer] = _createSelectPeriode ( )
			configDiv.appendChild ( divPer );
			json.periode = parseInt(sPer.value);
			sPer.onchange = (ev)=>{
				json.periode = parseInt(ev.target.value);
				jsonDiv.value = JSON.stringify ( json, null, 4 );
			}

			let [divLab,inLab] = _createInput ( "label" );
			configDiv.appendChild ( divLab );
			inLab.onchange = (ev)=>{
				json.label = ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let [divDef,inDef] = _createInput ( "default value" );
			configDiv.appendChild ( divDef );
			inDef.onchange = (ev)=>{
				json.default = ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let [divTyp,inTyp] = _createInput ( "nb digits" );
			configDiv.appendChild ( divTyp );
			inTyp.onchange = (ev)=>{
				json.valueType = ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let [divUni,inUni] = _createInput ( "unit" );
			configDiv.appendChild ( divUni );
			inUni.onchange = (ev)=>{
				json.unit = ev.target.value;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					title.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
			text:""
		}

		if ( undefined != config )
		{
			json = JSON.parse ( JSON.stringify ( config ) );
		}

		try // config
		{
			let configDiv = document.createElement ( "div" );

			let [divLa,iLa] = _createInput ( "label" );
			configDiv.appendChild ( divLa );
			iLa.type = "number";
			iLa.onchange = (ev)=>{
				json.gps[0].a = ev.target.value;
				json.view.b = Number ( ev.target.value ) - 0.01;
				json.view.d = Number ( ev.target.value ) + 0.01;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}


			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					text.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
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
				for ( let i = 0; i < config.seuil.length; i++ )
				{
					if ( msg.value <= config.seuil[ i ] )
					{
						break;
					}

					this.div.style = "--status-color:"+(config.color[ i+1 ] || "red");
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
			type:"multi",
			channel:"WS_DATA_CHANNEL",
			text:"",
			seuil:[],
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
			let setColorSeuil = ( )=>{
				json.seuil = [];
				for ( let threshold of domEls.threshold )
				{
					json.seuil.push ( Number ( threshold.value ) );
				}
				json.color = [];
				for ( let color of domEls.color )
				{
					json.color.push ( color.style.backgroundColor );
				}

			}

			let colorClicker  = ( ev )=>{
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
						setColorSeuil ( );
						jsonDiv.value = JSON.stringify ( json, null, 4 );
					},
					()=>{

					});
			}

			let configDiv = document.createElement ( "div" );



			let [divLa,iLa] = _createInput ( "label" );
			configDiv.appendChild ( divLa );
			iLa.type = "number";
			iLa.onchange = (ev)=>{
				json.gps[0].a = ev.target.value;
				json.view.b = Number ( ev.target.value ) - 0.01;
				json.view.d = Number ( ev.target.value ) + 0.01;
				jsonDiv.value = JSON.stringify ( json, null, 4 );
				outDiv.update ( json );
			}

			let [divNb,iNb] = _createInput ( "threshold number" );
			configDiv.appendChild ( divNb );
			iNb.value = 0;
			iNb.type = "number";
			iNb.min = 0;
			iNb.onchange = (ev)=>{
				if ( ev.target.value < 0 )
				{
					ev.target.value = 0;
				}

				if ( ev.target.value > json.seuil.length )
				{
					while ( ev.target.value > domEls.threshold.length )
					{
						let threshold = document.createElement ( "input" );
						threshold.type = "number" ;
						threshold.value = 1 ;
						let color = document.createElement ( "div" );
						color.style.height = "1em";
						color.style.borderColor = "var( --main-border )";
						color.style.borderWidth = "1px";
						color.style.borderStyle = "solid";

						color.onclick = colorClicker;

						domEls.threshold.push ( threshold );
						domEls.color.push ( color );

						div.appendChild ( threshold );
						div.appendChild ( color );
					}
				}
				else if ( ev.target.value < json.threshold.length )
				{
					while ( ev.target.value < json.threshold.length )
					{
						div.removeChild ( domEls.threshold[ domEls.threshold.length - 1 ] );
						div.removeChild ( domEls.color[ domEls.color.length - 1 ] );

						domEls.threshold[ domEls.threshold.length - 1 ] = undefined;
						domEls.color[ domEls.color.length - 1 ] = undefined;
					}
				}

				setColorSeuil ( );
				jsonDiv.value = JSON.stringify ( json, null, 4 );
			}

			let div = document.createElement ( "div" )
			configDiv.appendChild ( div );
			div.style.display = "flex";
			div.style.flexDirection = "column";

			domEls.color[ 0 ] = document.createElement ( "div" );
			div.appendChild ( domEls.color[ 0 ] );
			domEls.color[ 0 ].style.height = "1em";
			domEls.color[ 0 ].style.borderColor = "var( --main-border )";
			domEls.color[ 0 ].style.borderWidth = "solid";
			domEls.color[ 0 ].style.borderColor = "1px";
			domEls.color[ 0 ].style.backgroundColor = "red";
			domEls.color[ 0 ].onclick = colorClicker;

			setColorSeuil ( );

			let jsonDiv = document.createElement ( "textarea" );
			jsonDiv.value = JSON.stringify ( json, null, 4 );
			jsonDiv.onchange = (ev)=>{
				try
				{
					json = JSON.parse ( ev.target.value );
					jsonDiv.style.backgroundColor = "";
					text.value = json.text;
					outDiv.update ( json );
				}
				catch ( e )
				{
					jsonDiv.style.backgroundColor = "rgba(128,0,0,0.1)";
				}
			}

			let outDiv = Els_Back._newOut ( params.id, json );

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

		let opt = {
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

		// create gauge itself
		this.gauge = new Gauge( canvas )
			.setOptions(opt)
			.setOptions(config.options);

		this.gauge.config = {
			radiusScale: this.gauge.options.radiusScale,
			lineWidth: this.gauge.options.lineWidth,
			baseLabels: [],
		}


		// add all static labels to the graph
		function addMinMaxLabel ( c, array )
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

		addMinMaxLabel ( config, this.gauge.config.baseLabels );

		if ( config.options
			&& config.options.staticZones )
		{
			for ( let s of config.options.staticZones )
			{
					addMinMaxLabel ( s, this.gauge.config.baseLabels );
			}
		}

		this.gauge.config.baseLabels.sort();

		let calcLabels = ( )=>{
			let coef = 1;
			opt.staticLabels.labels = this.gauge.config.baseLabels.map((v)=>{return v*coef;});

			this.gauge.minValue = coef * (( undefined != config.min ) ? config.min : opt.staticLabels.labels[ 0 ]);
			this.gauge.maxValue = coef * (( undefined != config.max ) ? config.max : opt.staticLabels.labels[ opt.staticLabels.labels - 1 ]);
		}

		let cb = {
			periode: config.periode || 0,
			channel: config.channel,
			f: (msg)=>{
				if ( ( this.gauge.canvas.width == 0 )
					|| ( this.gauge.canvas.height == 0 ) )
				{
					// corect size of the gauge if needed
					this.gauge.calcSize ( );
					let coef = Math.min ( this.gauge.canvas.width, 400 ) / 400;

					this.gauge.canvas.height = Math.min ( this.gauge.canvas.height, this.gauge.canvas.width / 2);
					this.gauge.availableHeight = this.gauge.canvas.height * 0.8;
					this.gauge.options.radiusScale = this.gauge.config.radiusScale * coef;
					this.gauge.options.lineWidth = this.gauge.config.lineWidth * coef;
				}

				this.gauge.options.staticLabels.color = getComputedStyle(this.gauge.canvas).getPropertyValue("--main-text") || "#000";
				calcLabels ( );
				this.gauge.set(msg.value);
			}
		};
		
		this._callArgs.push ( cb );
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

					if ( false == data.zoom )
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

		[this.divDownload,this.download] = _createIconButton ( "Download", "download" );
		this._domEl.appendChild ( this.divDownload );

		[this.divClean,this.clean] = _createIconButton ( "Clean log", "trash" );
		this._domEl.appendChild ( this.divClean );

		if ( this.config.display )
		{
			if ( false == this.config.display.entries )
			{
				this.divEntries.style.display = "none";
			}
			if ( false == this.config.display.last )
			{
				this.divLast.style.display = "none";
			}
			if ( false == this.config.display.clean )
			{
				this.divClean.style.display = "none";
			}
			
			console.log ( false == this.config.display.clean );
		}

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
				downloadLink.download = "CSV_"+new Date().toISOString();
			}

			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		});
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
			console.log ( index, array[ index ] )
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

function _createInput ( inLabel )
{
	let div = document.createElement ( "div" );
	div.style.display = "flex";

	let label = document.createElement ( "label" );
	label.innerHTML = inLabel+" : ";
	label.style.flexGrow = 1;

	let input = document.createElement ( "input" );

	div.appendChild ( label );
	div.appendChild ( input );

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