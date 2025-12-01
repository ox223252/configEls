import Els from "./Els.js"

/// \brief read JSON config and create elements from it
export default class Config {
	/// \param | in ] config : JSoN object who represent HMI (see README for full details)
	/// \param | in ] id : base ID of every element created
	/// \param [ in ] params : config parameters
	constructor ( config, id, params )
	{
		if ( ( undefined == config )
			|| ( undefined == id ) )
		{
			return;
		}

		this._callbacksFunctions = []; ///< array with all elements callback {periode: Number, channel: String, f: function }
		this._config = config;
		this._id = id;
		this._params = params;
		this._entries = [];

		this.update ( );
	}

	///\return array of callback elements
	get callbacks ( )
	{
		return this._callbacksFunctions || [];
	}

	/// \return clean config object, who could be used to create new "Config"
	get config ( )
	{
		let conf = JSON.parse ( JSON.stringify ( this._config ) );
		for ( let i = 0; i < conf.dataset.length; i++ )
		{
			delete conf.dataset[ i ].el; // remove main div
			delete conf.dataset[ i ].cel; // remove grid div
			if ( undefined == conf.dataset[ i ].data )
			{
				delete conf.dataset.splice ( i , 1 ) // remove empty dataset element
				i--;
			}
		}
		return conf;
	}

	#eventData = {
		// contient les données a envoyer sur evenement
	};

	#eventEmitter = {
		// contient les fonctions d'envoie sur evenement
	};

	/// \brief add event listener on channel (fromm callback) to get data from a socket
	/// \param [ in ] socket : input socket
	///     can be a basic websocket or an IO socket from socket.io
	/// \param [ in ] clean : define if clean or not previously defined event and data
	/// \return the list of listenned data
	setIO ( socket, clean = true )
	{
		if ( clean )
		{
			// remove all previously define event listener
			// and clean remaining data
			for ( let eventName in this.#eventEmitter )
			{
				document.removeEventListener ( c.args?.event, this.#eventEmitter[ c.args?.event ] );
			}

			this.#eventData = {};
			this.#eventEmitter = {};
		}

		function socketEmiter ( src, data )
		{
			if ( "" == src )
			{ // no output cmd
			}
			else if ( undefined != socket.on )
			{ // if we-re using socket.io
				socket.emit ( src, data );
			}
			else
			{ // if we're using basics websockets
				let event = new Event ( src );

				event.data = data;

				socket.dispatchEvent ( event );
			}
		}

		if ( undefined == socket )
		{
			return [];
		}

		let list = {};
		for ( let c of this._callbacksFunctions )
		{
			if ( c.channel )
			{
				list[ c.channel ] = c.periode;
				if ( undefined != socket.on )
				{ // if we-re using socket.io
					socket.on ( c.channel, c.f );
				}
				else
				{ // if we're using basics websockets
					socket.addEventListener ( c.channel, c.f );
				}
			}

			// if this object should manage to some event in/out
			switch ( c.eventType )
			{
				case undefined:
				{
					break;
				}
				case "input":
				{
					if ( c.args?.event )
					{
						c.args.domEl.removeEventListener ( "change", c.fnOnInput );
						c.args.domEl.addEventListener ( "change", c.fnOnInput = ()=>{
							if ( !this.#eventData[ c.args.event ] )
							{
								this.#eventData[ c.args.event ] = {};
							}

							this.#eventData[ c.args.event ][ c.channel ] = c.args.domEl.value;

							if ( !this.#eventEmitter[ c.args.event ] )
							{
								this.#eventEmitter[ c.args.event ] = ()=>{
									socketEmiter ( "data-set", this.#eventData[ c.args?.event ]);
								};
								document.addEventListener ( c.args?.event, this.#eventEmitter[ c.args?.event ] );
							}
						});
					}
					else
					{
						c.args.domEl.removeEventListener ( "change", c.fnOnInput );
						c.args.domEl.addEventListener ( "change", c.fnOnInput = ()=>{
							socketEmiter ( "data-set", {
								[ c.channel ]: c.args?.domEl?.value,
							});
						});
					}
					break;
				}
				case "in":
				{
					document.removeEventListener ( c.args.event, c.fnOnEvent );
					document.addEventListener ( c.args.event, c.fnOnEvent = (ev)=>{
						c.args.cb ( ev.value );
					});
					break;
				}
				case "out":
				{
					c.args.domEl.removeEventListener ( "click", c.fnOnClick );
					c.args.domEl.addEventListener ( "click", c.fnOnClick = ()=>{
						if ( c.args.cmd )
						{
							socketEmiter ( "userCmd", c.args.args );
						}

						if ( c.args.event )
						{
							let ev = new Event ( c.args.event );
							ev.value = c.args.args;
							document.dispatchEvent ( ev );
						}
					});
					break;
				}
			}
		}

		return list;
	}

	/// \brief create elements displayed folowing the config
	/// \note the config should be updated externaly
	update ( )
	{
		if ( "Array" !== this._config?.dataset?.constructor.name )
		{
			return;
		}

		// create all elements once
		for ( let [i,ds] of this._config.dataset.entries() )
		{
			if ( ds.el )
			{ // element already creted
				continue;
			}

			// create main elements
			ds.el = document.createElement ( "div" );
			ds.el.className = ds.class;
			ds.el.style = ds.style;
			ds.el.title = ds.name || "";
			
			if ( !ds.data )
			{ // not data available 
				continue;
			}

			let entries = [];

			for ( let [j,da] of ds.data.entries() )
			{
				if ( !Els[ da.type ] )
				{ // data type unknow
					continue;
				}

				// define ID + dataset index + data in dataset index 
				let uId = this._id+"_"+i+"_"+j;

				if ( da?.unit
					&& this._params?.units )
				{
					da.unitCurrent = this._params.units;
				}

				// create sub elements
				let entry = new Els[ da.type ]( da, uId );

				// add it to the maine one
				ds.el.appendChild ( entry.dom );

				this._callbacksFunctions.push ( ...entry.callbacks );
				entries.push ( entry );
			}
			
			this._entries.push ( entries );
		}
	}
}