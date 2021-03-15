    String.prototype.format = function()
        {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) 
            {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
            }
        return formatted;
        };
    
    var nodes = new vis.DataSet([]);
    var edges = new vis.DataSet([]);
    var aNodeId = {};
    var idRoot = 0;
    
    function nodeScan(jsonData, n)
    {
    //console.log('{id: ',n,',label: \'Node',n,'\'}, ');
    //console.log('{id: ',n,',label: \'',jsonData.nodeId,'\'}, ');
    //console.log(jsonData.nodeId,' ',n);
    console.log('{id: {0}, text: "{1}"}'.format(n,jsonData.nodeId));
    
    var element = {};
    var strRoot = "";
    
    if ( !(typeof jsonData.root === 'undefined') )
        {
        element["label"] = '"{0}\nRoot"'.format(jsonData.nodeId);
        element["color"] = "green";
        }
    else
        {
        element["label"] = '"{0}"'.format(jsonData.nodeId);
        delete element["color"];
        }
    element["id"] = n;
    nodes.add(element);
    aNodeId[jsonData.nodeId]=n;
    n++;
    if ( !(typeof jsonData.subs === 'undefined') )
        {
        for (var i = 0; i < jsonData.subs.length; i++) 
            {
            //console.log(jsonData.subs[i].nodeId,' ',n);
            console.log('{id: {0}, text: "{1}"}'.format(n,jsonData.subs[i].nodeId));
    
            if ( !(typeof jsonData.subs[i].root === 'undefined') )
                {
                element["label"] = '"{0}\nRoot"'.format(jsonData.subs[i].nodeId);
                element["color"] = "green";
                }
            else
                {
                element["label"] = '"{0}"'.format(jsonData.subs[i].nodeId);
                delete element["color"];
                }
            element["id"] = n;
            nodes.add(element);
            aNodeId[jsonData.subs[i].nodeId]=n;
            n++;
            if ( !(typeof jsonData.subs[i].subs === 'undefined') )
                {n=nodeScan(jsonData.subs[i].subs[0],n);}
            }
        }
    return n;
    }
    
    function edgesScan(jsonData,prevIndex)
    {
    //console.log('{id: ',n,',label: \'Node',n,'\'}, ');
    //console.log('{id: ',n,',label: \'',jsonData.nodeId,'\'}, ');
    from=jsonData.nodeId;
    fromIndex=aNodeId[from];
    var element = {};
    if (prevIndex >= 0)
        {
        console.log('#{from: {0}, to: {1}, width: 2}'.format(prevIndex,fromIndex));
        element["id"] = n++;
        element["from"] = prevIndex;
        element["to"] = fromIndex;    
        element["width"] = 2;
        edges.add(element);
        }
    if ( !(typeof jsonData.subs === 'undefined') )
        {
        for (var i = 0; i < jsonData.subs.length; i++) 
            {
            //console.log(jsonData.subs[i].nodeId);
            to=jsonData.subs[i].nodeId;
            toIndex=aNodeId[to];
            console.log('@{from: {0}, to: {1}, width: 2} {2}'.format(fromIndex,toIndex,i));
    
            element["id"] = n++;
            element["from"] = fromIndex;
            element["to"] = toIndex;
            element["width"] = 2;
            edges.add(element);
            if ( !(typeof jsonData.subs[i].subs === 'undefined') )
                {edgesScan(jsonData.subs[i].subs[0],toIndex);}
            }
        }
    }
    
    //var txt = '{"nodeId":681158729,"root":true,"subs":[{"nodeId":3221191353,"subs":[{"nodeId":681157921}]}]}';
    //var url = new URL(window.location.href);
    //var txt = url.searchParams.get("subcon");
    console.log(txt);
    var jsonData = JSON.parse(txt);
    nodeScan(jsonData,1);
    var n=1;
    edgesScan(jsonData,-1);
    
      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {};
      var network = new vis.Network(container, data, options);
    