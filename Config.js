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

	/// \brief add event listener on channel (fromm callback) to get data from a socket
	/// \param [ in ] socket : input socket
	///     can be a basic websocket or an IO socket from socket.io
	/// \return the list of listenned data
	setIO ( socket )
	{
		function emitter ( config )
		{
			if ( undefined != socket.on )
			{ // if we-re using socket.io
				let c = Object.keys ( config || {} )
					.filter ( k=>k!="obj" )
					.reduce ( (a,k)=>{
						a[ k ] = config[ k ];
						return a;
					}, {});
				socket.emit ( "userCmd", c );
			}
			else
			{ // if we're using basics websockets
				let event = new Event ( "userCmd" );

				for ( let k in config )
				{
					if ( ( "obj" == k )
						|| ( undefined === config[ k ] ) )
					{
						continue;
					}
					if ( undefined == event.data )
					{
						event.data = {};
					}
					event.data[ k ] = config[ k ];
				}

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

			if ( c.obj )
			{
				c.obj.removeEventListener ( "click", c.obj.fnOnClick );
				c.obj.addEventListener ( "click", c.obj.fnOnClick = ()=>{
					emitter ( c );
				});
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