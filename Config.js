class Config {
	constructor ( config, id )
	{
		if ( ( undefined == config )
			|| ( undefined == id ) )
		{
			return;
		}

		this._callbacksFunctions = [];

		for ( let [i,ds] of config.dataset.entries() )
		{
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