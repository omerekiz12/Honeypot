	/* function: load config file */
	var loadXml = function()
	{	
		try
  		{
   			if ($.w.ActiveXObject)
 			{
				$.userxmlDoc = new ActiveXObject("Microsoft.XMLDOM");				
				$.userxmlDoc.async = false;
  				$.userxmlDoc.load("config/DynamicConfig.xml");
			}
			else
			{
				var oXmlHttp1 = new XMLHttpRequest();
				var url1 = "config/DynamicConfig.xml";
				oXmlHttp1.open("GET", url1, false);
			
				oXmlHttp1.send(null);
				$.userxmlDoc = oXmlHttp1.responseXML;
				//console.log("documentElement: ", $.userxmlDoc.documentElement);
			}
  		}
		catch(e)
		{
 			alert("Load file Fail");
			console.log("hello3");
  		}
	}
	var localAddLoading = function()
	{
		
	}
	/* function: fix object stack. Such as ACT_GL operation, get stack from local is null, we should to modify this stack */
	var gl_fixinstance = function(oid, stack)
	{
		var depth = 0;
		var index = [];
		var firstname = null;
		var firstindex;
		var savestack = stack;
		var path = oid_str[oid].split('.');
		for (var i = 0; i < path.length; i++)
		{
			if (path[i] == "{i}")
			{
				depth++;
				if (firstname == null)
				{
					firstname = path[i-1];
					firstindex = i;	
				}
			}
		}
		//console.log("firstname: ", firstname);
		//console.log("depth: ", depth);
		if (depth == 0 || firstname == null)
		{
			/* Error */
			return null;
		}
		var myarray = [];
		var number = 0;
		var savenum = 0;
		var len = 0;
		var mystack;
		/*
		console.log("stack1: " , stack.split(','));
		console.log("stack: ", stack);
		*/
		if (depth)
		{	
			var stack1 = stack.split(',');
			if (stack1.length != 6)
			{
				/* Error */
				return null;
			}
		}
		
		if (depth)
		{
			for (var i = 0; i < depth; i++)
			{
				index[i] = parseInt(stack1[i], 10);
			}
		}	
		//console.log("index: ",index);
		var tmp;
		var tmpnode;
		var parentnode;
		var child = [];
		var tmpas = [];
		var tmpds = [];
		//console.log("path[0]: ", path[0]);
		tmp = $.userxmlDoc.documentElement.getElementsByTagName(path[0])[0];
		//console.log("documentElement: ", $.userxmlDoc.documentElement);
		if (tmp == null)
		{
			//console.log("step IN ");
			return null;
		}
		//console.log("tmp: ", tmp);
		var sss = stack.split(',');
		var instance = {}; 

		var index1 = 1;
		var tmptarget;
		
		while (path[index1] != "{i}")
		{
			var tmpchild = tmp.childNodes;
			for (var h = 0; h < tmpchild.length; h++)
			{
				if (tmpchild[h].nodeName == path[index1])
				{
					tmp = tmpchild[h];
					index1++;
					break;
				}
			}

			if (h == tmpchild.length)
			{
				break;
			}			
		}
		//console.log("tmpchild: ", tmpchild);
		if (index[len] == 0)
		{	
			var nextflag = 0;
			while (1)
			{
				var oldtmp = tmp;
				if (oldtmp.getAttribute("instance") == null || oldtmp.nextSibling == null)
				{
					break;
				}
				else
				{
					instance = {};
					sss[len] = oldtmp.getAttribute("instance");
					instance.__stack = sss.join(",");
					instance.__node = oldtmp;
					tmpds.push(instance);
				}
				while (oldtmp.nextSibling.nodeType != 1)
				{
					oldtmp = oldtmp.nextSibling;
					if (oldtmp.nextSibling == null)
					{
						nextflag = 1;
						break;
					}
				}
				if (nextflag || oldtmp.nextSibling == null || oldtmp.nextSibling.nodeName != tmp.nodeName)
				{
					break;
				}
				else
				{
					tmp = oldtmp.nextSibling;
				}
			}
			len++;
		}
		else
		{
			instance = {};
			var count = index[len] - 1;
			if (count == 0)
			{
				sss[len] = tmp.getAttribute("instance");
				instance.__stack = sss.join(",");
				instance.__node = tmp;
				tmpds.push(instance);
				len++;
			}
			else
			{
				while (count)
				{
					var oldtmp = tmp;
					while (oldtmp.nextSibling.nodeType != 1)
					{
						oldtmp = oldtmp.nextSibling;
					}
					tmp = oldtmp.nextSibling;
					if (tmp.nodeName == oldtmp.nodeName)
					{
						count--;
					}
				}
				sss[len] = tmp.getAttribute("instance");
				instance.__stack = sss.join(",");
				instance.__node = tmp;
				tmpds.push(instance);
				len++;
			}
		}
		var obj;
		
		for (var i  = firstindex + 1; i < path.length - 1; i++)
		{	
			if (path[i] == "{i}")
			{	
				while (obj = tmpds.shift())
				{
					tmpnode = obj.__node;
					parentnode = tmpnode.parentNode;
					child = parentnode.childNodes;
					if (index[len] == 0)
					{
						for (var y = 0; y < child.length; y++)
						{
							sss = obj.__stack.split(',');
							if (child[y].nodeName == tmpnode.nodeName)
							{
								if (child[y].getAttribute("instance") != null)
								{
									var newobj = {};
									sss[len] = child[y].getAttribute("instance");
									newobj.__stack = sss.join(",");
									newobj.__node = child[y];
									tmpas.push(newobj);
								}
							}
						}
					}
					else
					{
						for (var z = 0; z < child.length; z++)
						{		
							if (child[z].nodeName == obj.__node.nodeName)
							{
								if (parseInt(child[z].getAttribute("instance"), 10) == index[len])
								{
									obj.__node = child[z];
									tmpas.push(obj);
								}
							}
						}
					}
				}
				tmpds.length = 0;
				tmpds = tmpas.slice(0);
				tmpas.length = 0;
				len++;
			}
			else
			{
				while (obj = tmpds.shift())
				{
					tmpnode = obj.__node;
					child = tmpnode.childNodes;
					var findindex = 0;
					for (var j = 0 ; j < child.length; j++)
					{
						if (child[j].nodeName == path[i])
						{
							instance = {};
							instance.__node = child[j];
							instance.__stack = obj.__stack;
							tmpas.push(instance);
							break;
						}
					}	
				}
				tmpds.length = 0;
				tmpds = tmpas.slice(0);
				tmpas.length = 0;
			}
		}
		//console.log("tmpds: ", tmpds);
		return tmpds;
	}
	
	/* function: fix object stack. Such as ACT_GS operation, we should to modify this stack */
	var gs_fixinstance = function(oid, stack)
	{
		var depth = 0;
		var firstname = null;
		var firstindex = 0;
		var index = [];
		var savestack = stack;
		var path = oid_str[oid].split('.');
	
		for (var i = 0; i < path.length; i++)
		{
			if (path[i] == "{i}")
			{
				depth++;
				if (firstname == null)
				{
					firstname = path[i-1];
					firstindex = i;
				}
			}
		}
		if (depth == 0 || firstname == null)
		{
			return null;
		}
		var myarray = [];
		var number = 0;
		var savenum = 0;
		var len = 0;
		var mystack;
		if (depth)
		{	
			var stack1 = stack.split(',');
			if (stack1.length != 6)
			{
				return null;
			}
		}
		
		if (depth)
		{
			for (var i = 0; i < depth; i++)
			{
				index[i] = parseInt(stack1[i], 10);
			}
		}
			
		var tmp;

		tmp = $.userxmlDoc.documentElement.getElementsByTagName(path[0])[0];
		if (tmp == null)
		{
			return null;
		}

		var index1 = 1;
		
		while (path[index1] != "{i}")
		{
			var tmpchild = tmp.childNodes;
			for (var h = 0; h < tmpchild.length; h++)
			{
				if (tmpchild[h].nodeName == path[index1])
				{
					tmp = tmpchild[h];
					index1++;
					break;
				}
			}
			if (h == tmpchild.length)
			{
				break;
			}
		}
		if (tmp.nodeName != oid)
		{
			return [];
		}

		var sss = stack.split(',');
		var instance = {};
		var tmpnode;
		var parentnode;
		var child = [];
		var tmpds = [];

		sss[len] = tmp.getAttribute("instance");
		instance.__stack = sss.join(",");
		instance.__node = tmp;

		tmpnode = instance.__node;
		parentnode = tmpnode.parentNode;
		child = parentnode.childNodes;tmpnode = instance.__node;
		
		for (var y = 0; y < child.length; y++)
		{
			sss = instance.__stack.split(',');
			if (child[y].nodeName == tmpnode.nodeName)
			{
				if (child[y].getAttribute("instance") != null)
				{
					var newobj = {};
					sss[len] = child[y].getAttribute("instance");
					newobj.__stack = sss.join(",");
					newobj.__node = child[y];
					tmpds.push(newobj);
				}
			}
		}
		return tmpds;
	}	
	
	/* function: get object stack */
	var getstack = function(stack)
	{
		while(1)
		{
			var z = stack.indexOf("#");
			stack = stack.substr(z+1);
			z = stack.indexOf("#");
			if (z == -1)
			{
				stack2 = stack;
			}
			else
			{
				stack2 = stack.substr(0, z);
			}
			var stack1 = stack2.split(',');
			if (stack1.length == 6)
			{
				break;
			}
						
		}
			
		return stack2;
	}
	
	/* function: get object pstack */
	var getpstack = function(stack)
	{
		var count = 0;
		while(1)
		{
			var z = stack.indexOf("#");
			stack = stack.substr(z+1);
			z = stack.indexOf("#");
			if (z == -1)
			{
				stack2 = stack;
			}
			else
			{
				stack2 = stack.substr(0, z);
			}
			var stack1 = stack2.split(',');
			if (stack1.length == 6)
			{
				count++;
				if (count == 2)
				{
					break;
				}
			}
						
		}
		return stack2;
	}
	
	/* function: get all attributes. Such as ACT_GL operation, attrs parameter is null. */
	var gl_getattr = function(ds)
	{
		var obj = {};
		var tmpobj;
		var tmpas = [];
		while (tmpobj = ds.shift())
		{
			obj = tmpobj;
			var child = obj.__node.childNodes;
			var targetname = obj.__node.nodeName;
			for (var i  = 0; i < child.length; i++)
			{
				if (child[i].nodeType == 1)
				{
					var name = child[i].nodeName;
					obj[child[i].nodeName] = child[i].getAttribute("val");	
				}	
			}
			tmpas.push(obj);
			obj = {};
		}
		return tmpas;
	}
	
	/* function: get all attributes. Such as ACT_GET operation, attrs parameter is null. */
	var get_getattr = function(targetnode, instance)
	{
		var child = [];
		var newname;
		var targetname;
		var node;
		var childnode;
		var rename;
		var childname;
		var ret;
		child = targetnode.childNodes;
		for (var i = 0; i < child.length; i++)
		{	
			if (child[i].nodeType == 1)
			{	
				var attr = child[i].getAttribute("val");
				if (attr == null)
				{
					instance[child[i].nodeName] = "";
				}
				else
				{
					instance[child[i].nodeName] = attr;
				}
			}
		}
		return instance;
	}
	
	/* function: get object path in datamodel */
	var getpath = function(path, stack, optype) 
	{
		var depth = 0;
		var index =[];
		var firstname = null;
		var id_path = path.split(".");
		var firstindex = 0;
		var tmp = [];
		var parentnode;
		var node;
		var childnode;
		var len = 0;
		//console.log("getpath  path: ", path);
		//console.log("id_path: ", id_path);
		for (var x = 0; x < id_path.length; x++)
		{
			if (id_path[x] == "{i}")
			{
				depth++;
				if (firstname == null)
				{
					firstname = id_path[x-1];
					firstindex = x;
				}
			}
		}
		var stack1 = stack.split(',');
		if (depth) 
		{
			for (var n = 0; n < depth; n++)
			{
				index[n] = parseInt(stack1[n], 10);
			}
		}
		else
		{
			index[0] = 0;
		}
		if (optype == ACT_GET || optype == ACT_SET)
		{
			if (depth == 0)
			{
				//console.log("id_path[id_path.length-2] :  ", id_path[id_path.length-2]);
				tmp = $.userxmlDoc.documentElement.getElementsByTagName(id_path[id_path.length-2]);
				if (tmp.length == 0)
				{
					return null;
				}
				return tmp[0];	
			}
			else
			{
				tmp = $.userxmlDoc.documentElement.getElementsByTagName(id_path[0])[0];
				if (tmp == null)
				{
					return null;
				}

				var index1 = 1;
				var tmptarget;
				while (id_path[index1] != "{i}")
				{
					var tmpchild = tmp.childNodes;
					for (var h = 0; h < tmpchild.length; h++)
					{
						if (tmpchild[h].nodeName == id_path[index1])
						{
							tmp = tmpchild[h];
							index1++;
							break;
						}
					}
				}
				if (len < depth)
				{
					if (index[len] == 0)
					{
						node = tmp;
					}
					else
					{
						var count = index[len] - 1;
                        var instanceVal = index[len];
						if (instanceVal === parseInt(tmp.getAttribute("instance"), 10))
						{
							node = tmp;
						}
						else
						{
							while (count)
							{
								node = tmp;
								while (node.nextSibling.nodeType != 1)
								{
									node = node.nextSibling;
								}
								tmp = node.nextSibling;
                                if (instanceVal === parseInt(tmp.getAttribute("instance"), 10))
                                {
								    node = tmp;
                                    break;
                                }
								count--;
							}
						}
						
					}
					len++;
				}
				else
				{
					return null;
				}
				parentnode = node;
				for (var i = firstindex + 1; i < id_path.length - 1; i++)
				{
					if (id_path[i] == "{i}")
					{
						if (len < depth && index[len] != 1 && index[len] != 0)
						{
							childnode = parentnode;
							parentnode = parentnode.parentNode;
							tmp = parentnode.childNodes;
							node = null;
							for (var p = 0; p < tmp.length; p++)
							{
								if (tmp[p].nodeName == childnode.nodeName)
								{
									if (tmp[p].getAttribute("instance") == null)
									{
										continue;
									}
									else if (tmp[p].getAttribute("instance").toString(10) == index[len])
									{
										node = tmp[p];
										break;
									}
									
								}
							}
							
							if (p >= tmp.length && node == null)
							{

							}
							else if (p <= tmp.length)
							{
								parentnode = node;
								len++;
							}	
						}
					}
					else
					{
						tmp = parentnode.childNodes;
						var nextnode = null;
						for (var j = 0; j < tmp.length; j++)
						{
							if (tmp[j].nodeName == id_path[i])
							{
								nextnode = tmp[j];
								break;
							}
						}
						if (j == tmp.length && nextnode == null)
						{
				
						}
						else if (j <= tmp.length)
						{
							parentnode = nextnode;
						}
					}
				}	
				return parentnode;
			}
		}	
		else
		{
			return null;
		}
	}	
	var localexe = function(hook, unerr) {
		var data = "";
		var index = 0;
		var obj;
		while (obj = $.as.shift())
		{
			data += "[" + obj[0] + "&" + obj[2] + "#" + obj[3] + "#" + obj[4] + "]" + index + "," +obj[6] + "\r\n" + obj[5];
			index++;
		}
		var lines = data.split('\n');
		var targetnode;
		var attrnum;
	
		for (var i = 0; i < lines.length; i++)
		{
			if (lines[i] == "") 
				continue;
			if (lines[i].charAt(0) == "[")
			{
				var p = lines[i].indexOf("&");
				var optype = parseInt(lines[i].substr(1, p-1), 10);
				var k =	lines[i].indexOf("#");
				var oid = lines[i].substr(p+1 ,k-p-1);
				var n = lines[i].indexOf("]");
				var j = parseInt(lines[i].substr(n+1), 10);
				var stack = lines[i].substr(p+1, n-p-1);
				var subline = lines[i].substr(n+1);
				var q = subline.indexOf(",");
				attrnum = parseInt(subline.substr(q+1), 10);
				var mystack = getstack(stack);
				var instance;
				var newline;

				if (mystack == "error")
				{
					if (j)
					{
						var ret = j;
						if (ret != ERR_HTTP_ERR_CGI_INVALID_ANSI) $.err("exe", ret, unerr);
							break;
					}
				}
				else if ($.ds[j] instanceof Array && optype == ACT_GL)
				{	
					var tmparray = [];
					tmparray = gl_fixinstance(oid, mystack);
					if (attrnum == 0)
					{	
						var tmparray1 = gl_getattr(tmparray);
						var tttobj;
						while (tttobj = tmparray1.shift())
						{
							$.ds[j].push(tttobj);
						}
					}
					else
					{
						var tmpobj = {};
						while ( tmpobj = tmparray.shift())
						{
							$.ds[j].push(tmpobj);
						}
					}
				}
				else if ($.ds[j] instanceof Array && optype == ACT_GS)
				{
					var mypstack = getpstack(stack);
					var tmparray = [];
	
					tmparray = gs_fixinstance(oid, mypstack);
					if (attrnum == 0)
					{	
						var tmparray1 = gl_getattr(tmparray);
						var tttobj;
						while (tttobj = tmparray1.shift())
						{
							$.ds[j].push(tttobj);
						}
					}
					else
					{
						var tmpobj = {};
						while (tmpobj = tmparray.shift())
						{
							$.ds[j].push(tmpobj);
						}
					}
				}
				else if ($.ds[j] != null)
				{
					instance  = $.ds[j];
					instance.__stack = mystack;
					//console.log("oid: ", oid);
					//console.log("oid_str[oid]: ", oid_str[oid]);
					//console.log("typeof(oid_str[oid]): ", typeof(oid_str[oid]));
					if (typeof(oid_str[oid]) != "undefined")
					{
						targetnode = getpath(oid_str[oid], mystack, optype);
						if (attrnum == 0 && optype != ACT_ADD)
						{
							instance = get_getattr(targetnode, instance);
						}
					}
					
				
				}
			}
			else if (lines[i])
			{	
				lines[i] = lines[i].substr(0, lines[i].length-1);

				if (optype == ACT_GET && targetnode != null)
				{	
					var child = targetnode.childNodes;
					for (var k = 0; k < child.length; k++)
					{
						if (child[k].nodeName == lines[i])
						{
							if (child[k].getAttribute("val"))
							{
								instance[lines[i]] = child[k].getAttribute("val");
								break;
							}
						}
					}
					if (lines[i] == "WEPKeyIndex")
					{
						var temp = instance[lines[i]];
						instance[lines[i]] = parseInt(temp, 10);
					}
				}
				else if (optype == ACT_GL || optype == ACT_GS)
				{
					if (!($.ds[j] instanceof Array) || $.ds[j].length == 0) 
						continue;
						
					var tmpobj;
					var tmpds = $.ds[j];
					var tmpas = [];
					
					while (tmpobj = tmpds.shift())
					{
						var child = tmpobj.__node.childNodes;
						for (var p = 0 ; p < child.length; p++)
						{
							if (child[p].nodeName == lines[i])
							{	
								if (child[p].getAttribute("val"))
								{
									tmpobj[lines[i]] = child[p].getAttribute("val");
									break;
								}
							}
						}
						if (p >= child.length && tmpobj[lines[i]] == undefined)
						{
							tmpobj[lines[i]] = "";
						}	

						if (lines[i] == "WEPKeyIndex")
						{
							var tempvalue = tmpobj[lines[i]];
							tmpobj[lines[i]] = parseInt(tempvalue, 10);
						}
						tmpas.push(tmpobj);
					}
					while (tmpobj = tmpas.shift())
					{
						$.ds[j].push(tmpobj);
					}			
				}	
			}
		}
		while($.ds.length)  
		{
			$.ds.pop();
		}
		if (hook && typeof hook === "function")
		{
			hook(0);
		}
		return 0;
	}