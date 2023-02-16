class Config {
	constructor ( config, id )
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

	setIO ( )
	{
		let list = {};
		for ( let c of this._callbacksFunctions )
		{
			list[ c.channel ] = c.periode;
			socket.on(c.channel,c.f);
		}

		socket.emit ( "list-clean" );
		socket.emit ( "list-set", JSON.stringify(list) );
	}
}