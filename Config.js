/// \brief read JSON config and create elements from it
class Config {
	/// \param | in ] config : JSoN object who represent HMI (see README for full details)
	/// \param | in ] id : base ID of every element created
	constructor ( config, id )
	{
		if ( ( undefined == config )
			|| ( undefined == id ) )
		{
			return;
		}

		this._callbacksFunctions = []; ///< array with all elements callback {periode: Number, channel: String, f: function }
		this._config = config;
		this._id = id;

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
		if ( undefined == socket )
		{
			return [];
		}

		let list = {};
		for ( let c of this._callbacksFunctions )
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

		return list;
	}

	/// \brief create elements displayed folowing the config
	/// \note the config should be updated externaly
	update ( )
	{
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
			ds.el.title = ds.name;
			
			if ( !ds.data )
			{ // not data available 
				continue;
			}

			for ( let [j,da] of ds.data.entries() )
			{
				if ( !Els[ da.type ] )
				{ // data type unknow
					continue;
				}

				// define ID + dataset index + data in dataset index 
				let uId = this._id+"_"+i+"_"+j;

				// create sub elements
				let entry = new Els[ da.type ]( da, uId );

				// add it to the maine one
				ds.el.appendChild ( entry.dom );

				this._callbacksFunctions.push ( ...entry.callbacks );
			}
		}
	}
}