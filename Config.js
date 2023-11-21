class Config {
	constructor ( config, id, param = {} )
	{
		if ( ( undefined == config )
			|| ( undefined == id ) )
		{
			return;
		}

		this._callbacksFunctions = [];
		this._config = config;
		this._id = id;

		for ( let [i,ds] of this._config.dataset.entries() )
		{
			if ( undefined == ds.data )
			{
				continue;
			}

			ds.el = document.createElement ( "div" );
			ds.el.className = ds.class;
			ds.el.style = ds.style;
			ds.el.title = ds.name;

			for ( let [j,da] of ds.data.entries() )
			{
				if ( !Els[ da.type ] )
				{
					continue;
				}
				let uId = id+"_"+i+"_"+j;
				let entry = new Els[ da.type ]( da, uId );

				ds.el.appendChild ( entry.dom );

				this._callbacksFunctions.push ( ...entry.callbacks );
			}
		}
	}

	get callbacks ( )
	{
		return this._callbacksFunctions || [];
	}

	get config ( )
	{
		let conf = JSON.parse ( JSON.stringify ( this._config ) );
		for ( let i = 0; i < conf.dataset.length; i++ )
		{
			delete conf.dataset[ i ].el;
			delete conf.dataset[ i ].cel;
			if ( undefined == conf.dataset[ i ].data )
			{
				delete conf.dataset.splice ( i , 1 )
				i--;
			}
		}
		return conf;
	}

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

	update ( )
	{
		for ( let [i,ds] of this._config.dataset.entries() )
		{
			if ( ( null != ds.el )
				&& ( undefined != ds.el )
				|| ( undefined == ds.data ) )
			{
				continue;
			}

			ds.el = document.createElement ( "div" );
			ds.el.className = ds.class;
			ds.el.style = ds.style;
			ds.el.title = ds.name;

			for ( let [j,da] of ds.data.entries() )
			{
				if ( !Els[ da.type ] )
				{
					continue;
				}
				let uId = this._id+"_"+i+"_"+j;
				let entry = new Els[ da.type ]( da, uId );

				ds.el.appendChild ( entry.dom );

				this._callbacksFunctions.push ( ...entry.callbacks );
			}
		}
	}
}