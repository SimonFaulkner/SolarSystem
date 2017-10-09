// SolarSytem Javascript

// Set up web socket connection
var backoff=1;
var ws=null;
function wsconnect()
{
document.getElementById("status").textContent="Connecting";
ws = new WebSocket((window.location.protocol=="https:"?"wss://":"ws://")+window.location.host+window.location.pathname);
ws.onopen=function()
{
	document.getElementById("status").textContent="Connected to "+window.location.hostname;
	backoff=1;
}
ws.onclose=function()
{
	document.getElementById("status").textContent="DISCONNECTED";
	backoff=backoff*2;
	setTimeout(wsconnect,100*backoff);
}
ws.onerror=function()
{
	document.getElementById("status").textContent="Error";
}
ws.onmessage=function(event)
{
	o=JSON.parse(event.data);
	if(o.group)o.group.forEach(function(g)
	{
		x=document.getElementById("group"+g.id);
		if(!x)
		{
			x=document.createElement("div");
			x.id="group"+g.id;
			x.className="group";
			document.getElementById("groups").appendChild(x);
			l=document.createElement("img");
			l.className="groupimg";
			l.groupid=g.id;
			l.onclick=function()
			{
				var a={disarm:[this.groupid]};
				if(this.src.match(/UNSET/))a={arm:[this.groupid]};
				ws.send(JSON.stringify(a));
			}
			x.appendChild(l);
				l=document.createElement("div");
				l.className="groupid";
				l.textContent=g.id;
				x.appendChild(l);
			if(g.name)
			{
				l=document.createElement("div");
				l.className="groupname";
				l.textContent=g.name;
				x.appendChild(l);
			}
		}
	});
	if(o.clr&&o.clr.arm)o.clr.arm.forEach(function(g)
	{
		document.getElementById("group"+g).children[0].src="groupUNSET.png";
	});
	if(o.set&&o.set.set)o.set.set.forEach(function(g)
	{
		document.getElementById("group"+g).children[0].src="groupSET.png";
	});
	if(o.set&&o.set.arm)o.set.arm.forEach(function(g)
	{
		document.getElementById("group"+g).children[0].src="groupARM.png";
	});
	if(o.set&&o.set.unset)o.set.unset.forEach(function(g)
	{
		document.getElementById("group"+g).children[0].src="groupUNSET.png";
	});
	if(o.keypad)o.keypad.forEach(function(k)
	{
		x=document.getElementById(k.id);
		if(!x)
		{
			x=document.createElement("div");
			x.id=k.id;
			x.className="keypad";
			document.getElementById("keypads").appendChild(x);
			l=document.createElement("img");
			l.className="keypad";
			l.src="keypad.png";
			x.appendChild(l);
			l=document.createElement("div");
			l.className="keypadline1";
			x.appendChild(l);
			l=document.createElement("div");
			l.className="keypadline2";
			x.appendChild(l);
			l=document.createElement("div");
			l.className="keypadlabel";
			l.textContent=k.id;
			x.appendChild(l);
			l=document.createElement("div");
			l.className="keypadbuttons";
			x.appendChild(l);
			keys=['1','2','3','A','4','5','6','B','7','8','9','ent','*','0','#','esc'];
			for(var n=0;n<16;n++)
			{
				b=document.createElement("button");
				b.className="keypadbutton";
				b.style.left=((n%4)*25)+"%";
				b.style.top=(Math.floor(n/4)*25)+"%";
				b.key=keys[n];
				b.onclick=function()
				{
					var a={keypad:[{id:k.id,key:this.key}]};
					ws.send(JSON.stringify(a));
				}
				l.appendChild(b);
			}
		}
		x.children[1].textContent=k.line[0];
		x.children[2].textContent=k.line[1];
	});
	if(o.door)o.door.forEach(function(d)
	{
		x=document.getElementById(d.id);
		if(!x)
		{
			x=document.createElement("div");
			x.id=d.id;
			x.className="door";
			document.getElementById("doors").appendChild(x);
			l=document.createElement("div");
			l.className="doorlabel";
			l.textContent=d.name;
			x.appendChild(l);
			l=document.createElement("img");
			l.className="doorimg";
			l.textContent=d.name;
			l.doorid=d.id;
			l.onclick=function()
			{
				var a={door:[{id:this.doorid}]};
				ws.send(JSON.stringify(a));
			}
			x.appendChild(l);
			l=document.createElement("div");
			l.className="doorstate";
			l.textContent=d.name;
			x.appendChild(l);
		}
		x.children[1].src="door"+d.state+".png";
		x.children[2].textContent=d.state;
	});
	if(o.input)o.input.forEach(function(d)
	{
		x=document.getElementById("input"+d.id);
		if(!x)
		{
			x=document.createElement("div");
			x.id="input"+d.id;
			x.textContent=x.id;
			if(x.name)x.title=x.name;
			document.getElementById("inputs").appendChild(x);
		}
		x.className=(x.tamper?"inputtamper":x.fault?"inputfault":x.active?"inputactive":"inputidle");
	});
	if(o.output)o.output.forEach(function(d)
	{	// Log updates
		x=document.getElementById("output"+d.id);
		if(!x)
		{
			x=document.createElement("div");
			x.id="output"+d.id;
			x.textContent=x.id;
			if(x.name)x.title=x.name;
			document.getElementById("outputs").appendChild(x);
		}
		x.className=(x.active?"outputactive":"outputidle");
	});
}
}

window.onload=wsconnect;

