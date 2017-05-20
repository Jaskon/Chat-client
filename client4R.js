			var bottomPanelOpened = 1;
			var rightPanelOpened = 0;
			var signalColor = "darkred";
			var lastName = "";
			var myNickName = "";
			var usersCount = 0;
			var notifyPermission = 0;
			
			var draw;
			
			function OpenPanel(panel)		// Open/Close the bottom panel // 0 - Bottom, 1 - Right
			{
				if (panel == 0)
					if (bottomPanelOpened)
					{
						document.all.bottomPanel.style.top = "100%";
						document.all.bottomPanelButton.style.transform = "rotate(270deg)";
						document.all.textDiv.style.height = "calc(100% - 62px)";
						document.all.nicknamesDiv.style.height = "calc(100% - 192px)";
						document.all.usersInfoDiv.style.top = "calc(100% - 95px)";
						document.all.rightPanel.style.top = "calc(50% - 250px)";
						document.all.signalColor.style.top = "calc(50% - 278px)";
						bottomPanelOpened = 0;
					}
					else
					{
						document.all.bottomPanel.style.top = "calc(100% - 100px)";
						document.all.bottomPanelButton.style.transform = "rotate(90deg)";
						document.all.textDiv.style.height = "calc(100% - 162px)";
						document.all.nicknamesDiv.style.height = "calc(100% - 292px)";
						document.all.usersInfoDiv.style.top = "calc(100% - 195px)";
						document.all.rightPanel.style.top = "calc(50% - 300px)";
						document.all.signalColor.style.top = "calc(50% - 328px)";
						bottomPanelOpened = 1;
					}
				else
					if (panel == 1)
						if (rightPanelOpened)
						{
							document.all.rightPanel.style.left = "100%";
							document.all.signalColor.style.left = "100%";
							document.all.rightPanelButton.style.transform = "rotate(180deg)";
							rightPanelOpened = 0;
						}
						else
						{
							var k = (document.body.offsetWidth - document.body.offsetWidth*56/100 - 230)/4 + 230;
							document.all.rightPanel.style.left = "calc(56% + " + k + "px)";
							document.all.signalColor.style.left = "calc(56% + " + k + "px + 70px)";
							document.all.rightPanelButton.style.transform = "rotate(0deg)";
							rightPanelOpened = 1;
						}
			}
			
			function ChangeSignalColor(color)
			{
				signalColor = color;
			}
			
			
			function Connect(url)		// Connect
			{
				draw = document.all.vol.getContext("2d");		// Canvas (for volume)
				if ("ontouchstart" in window)
				{
					document.all.vol.style.top = "60px";
					document.all.vol.setAttribute("ontouchstart", "PlayerVolTouch(event, 1)");
					document.all.vol.setAttribute("ontouchmove", "PlayerVolTouch(event, 2)");
				}
				else
				{
					document.all.vol.setAttribute("oonmousedown", "PlayerVol(event, 1)");
					document.all.vol.setAttribute("onmousemove", "PlayerVol(event, 2)");
				}
				
				socket = io.connect(url);
				socket.on("connect", function()
				{
					socket.on("firstConnection", function(data)
					{
						for (var i in data.box)		// Array of users
						{
							var div = document.createElement("div");
							div.setAttribute("id", data.box[i]);
							div.setAttribute("class", "nicknamesDivs");
							div.innerHTML = data.box[i];
							div.classList.add("runAniIn");
							document.all.nicknamesDiv.appendChild(div);
						}
						usersCount = Object.keys(data.box).length;
						document.all.usersCountDiv.innerHTML = usersCount + " users online";
						myNickName = data.myNick;
						
						for (var j = 0; j < Object.keys(data.text).length; j += 2)		// Array of last messages
						{
							var s = "";
							for (var i = 0; i < data.text[j].length; i++)
							{
								data.text[j][i] == "<" ? (s += "&#60;") : (data.text[j][i] == ">" ? (s += "&#62;") : (s += data.text[j][i]));
							}
							s += ": ";
							var ks = 0;
							for (var i = 0; i < data.text[j+1].length; i++)
							{
								data.text[j+1][i] == "<" ? (s += "&#60;") : (data.text[j+1][i] == ">" ? (s += "&#62;") :
									(data.text[j+1][i] == "&" ? (s += "&#38;") : (data.text[j+1][i] == ";" ? (s += "&#059;") : (s += data.text[j+1][i]))));
							}
							lastName == data.text[j] ? 0 : (s = s + "<hr noshade>");
							var div = document.createElement("div");
							div.setAttribute("class", "textDivs");
							div.innerHTML = s;
							document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
							lastName = data.text[j];
						}
					});
					
					/*socket.on("connected", function(data)
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='dis-connect'><i>" + data.name + "</i> just connected" + "</span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification(data.name, {body: " just connected", tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						var div = document.createElement("div");
						div.setAttribute("id", data.name);
						div.setAttribute("class", "nicknamesDivs");
						div.innerHTML = data.name;
						div.classList.add("runAniIn");
						document.all.nicknamesDiv.appendChild(div);
						
						usersCount++;
						document.all.usersCountDiv.innerHTML = usersCount + " users online";
					});*/
					
					socket.on("someConnected", function()
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='dis-connect'><i>SomeOne</i> just connected" + "</span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification("SomeOne", {body: " just connected", tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						document.all.usersCountDiv.innerHTML = usersCount + " users online";
					});
					
					socket.on("disconnected", function(data)
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='dis-connect'><i>" + data.name + "</i> just disconnected</span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification(data.name, {body: " just disconnected", tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						if (data.oldName)
						{
							return;
						}
						
						var nodeList = document.all.nicknamesDiv.childNodes;
						
						for (var i = 0; i < nodeList.length; i++)
						{
							if (nodeList[i].id == data.name)
							{
								nodeList[i].classList.remove("runAniIn");
								nodeList[i].offsetWidth = nodeList[i].offsetWidth;
								nodeList[i].classList.add("runAniOut");
								setTimeout(function() { document.all.nicknamesDiv.removeChild(nodeList[i]); }, 400);
								break;
							}
						}
						
						usersCount--;
						document.all.usersCountDiv.innerHTML = usersCount + " users online";
					});
					
					socket.on("newMessage", function(data)
					{
						var s1 = "";
						for (var i = 0; i < data.name.length; i++)
						{
							data.name[i] == "<" ? (s1 += "&#60;") : (data.name[i] == ">" ? (s1 += "&#62;") : (s1 += data.name[i]));
						}
						var ks = 0;
						var s = "";
						for (var i = 0; i < data.text.length; i++)
						{
							data.text[i] == "<" ? (s += "&#60;") : (data.text[i] == ">" ? (s += "&#62;") :
								(data.text[i] == "&" ? (s += "&#38;") : (data.text[i] == ";" ? (s += "&#059;") : (s += data.text[i]))));
						}
						
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification("Message from " + s1, {body: s, tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						s = s1 + ": " + s;
						
						lastName == data.name ? 0 : (s = s + "<hr noshade>");
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = s;
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						lastName = data.name;
					});
					
					/*socket.on("nicknameChanged", function(data)
					{
						var s = "";
						for (var i = 0; i < data.name.length; i++)
							data.name[i] == "<" ? (s += "&#60;") : (data.name[i] == ">" ? (s += "&#62;") :
								(data.name[i] == "&" ? (s += "&#38;") : (data.name[i] == ";" ? (s += "&#059;") : (s += data.name[i]))));
						var s1 = "";
						for (var i = 0; i < data.oldname.length; i++)
							data.oldname[i] == "<" ? (s1 += "&#60;") : (data.oldname[i] == ">" ? (s1 += "&#62;") :
								(data.oldname[i] == "&" ? (s1 += "&#38;") : (data.oldname[i] == ";" ? (s1 += "&#059;") : (s1 += data.oldname[i]))));
						
						myNickName == s1 ? (myNickName = s) : 0;
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification(s, {body: s1 + " changed his/her nickname", tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='nicknameChanged'><i>" + s1 + "</i> changed his/her nickname to <i>" + s + "</i></span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						
						var nodeList = document.all.nicknamesDiv.childNodes;
						for (var i = 0; i < nodeList.length; i++)
						{
							if (nodeList[i].id == s1)
							{
								nodeList[i].innerHTML = s;
								nodeList[i].id = s;
								break;
							}
						}
					});
					
					socket.on("nicknameNotChanged", function(data)
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='nicknameNotChanged'>NickName <i>" + data.name + "</i> is already exists</span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
					});*/
					
					socket.on("login", function(data)
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='dis-connect'><i>" + data.name + "</i> just connected" + "</span><br>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
						
						if (!document.hasFocus())		// now if focus? dont notify
						{
							if (notifyPermission)
							{
								var notify = new Notification(data.name, {body: " just connected", tag: "", icon: ""});
								setTimeout(function() { notify.close(); }, 4000);
							}
						}
						
						var div = document.createElement("div");
						div.setAttribute("id", data.name);
						div.setAttribute("class", "nicknamesDivs");
						div.innerHTML = data.name;
						div.classList.add("runAniIn");
						document.all.nicknamesDiv.appendChild(div);
						
						usersCount++;
						document.all.usersCountDiv.innerHTML = usersCount + " users online";
					});
					
					socket.on("notExist", function()
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='nicknameNotChanged'>This nickname isn't exists yet</span>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
					});
					
					socket.on("nowLoggedIn", function()
					{
						var div = document.createElement("div");
						div.setAttribute("class", "textDivs");
						div.innerHTML = "<span class='nicknameNotChanged'>This user is already logged in</span>";
						document.all.textDiv.insertBefore(div, document.all.textDiv.firstChild);
					});
					
					socket.on("signal", function(data)
					{
						if ((data.X < -3) || (data.X > document.all.rightPanel.offsetWidth-3) || (data.Y < -3) || (data.Y > document.all.rightPanel.offsetHeight-3))
							return;
						var div = document.createElement("div");
						div.setAttribute("class", "circleSignal");
						div.style.borderColor = data.Color;
						document.all.rightPanel.appendChild(div);
						div.style.left = data.X;
						div.style.top = data.Y;
						setTimeout(function()
						{
							div.style.width = 14;
							div.style.left = div.offsetLeft - 7;
							div.style.height = 14;
							div.style.top = div.offsetTop - 7;
							div.style.opacity = 0;
							setTimeout(function() { document.all.rightPanel.removeChild(div) }, 1000);
						} ,50);
					});
					
					SendKey = function(event, k)
					{
						if ((event.keyCode == 13) && (k == 0))
						{
							socket.send("0" + document.all.inputDiv.value);
							document.all.inputDiv.value = "";
						}
						else
							if ((event.keyCode == 13) && (k == 1))
							{
								socket.send("1" + document.all.nicknameDiv.value);
							}
					}
					
					SendBut = function(event)
					{
						socket.send("0" + document.all.inputDiv.value);
						document.all.inputDiv.value = "";
					}
					
					Signal = function(event)
					{
						if (event.button == 2)
						{
							var X = event.clientX - document.all.rightPanel.offsetLeft - 3;
							var Y = event.clientY - document.all.rightPanel.offsetTop - 3;
							socket.send("g" + X + "," + Y + "," + signalColor);
						}
					}
				});
			}
			
			function AcceptNickName()
			{
				socket.send("1" + document.all.nicknameDiv.value);
			}
			
			var notify;
			function Notify(k)
			{
				if (k)		// By label
				{
					if (document.all.chk1.checked)
					{
						notifyPermission = 0;
						document.all.chk1.checked = false;
					}
					else
					{
						Notification.requestPermission(function(result) { notifyPermission = 1; });
						document.all.chk1.checked = true;
					}
				}
				else		// By chk
				{
					if (document.all.chk1.checked)
					{
						Notification.requestPermission(function(result) { notifyPermission = 1; });
					}
					else
					{
						notifyPermission = 0;
					}
				}
			}
			
			function Player(event, k)
			{
				var radio = document.all.radio;
				if (k == 1)
				{
					radio.src = "http://radio.everypony.info:8000/320";
					radio.volume = 0.08;
					radio.play();
				}
				else
					if (k == 0)
					{
						radio.pause();
						radio.src = "";
					}
			}
			
			function PlayerVol(event, k)		// 1 - down, 0 - up, 2 - move
			{
				if (k == 2)
				{
					if ((event.button == 0) && (event.buttons > 0))
					{
						radio.volume = event.offsetX/(event.srcElement ? event.srcElement.offsetWidth : event.target.offsetWidth);
						draw.clearRect(0,0, 100,26);
						draw.beginPath();
						draw.strokeStyle = "darkred";
						draw.moveTo(0, 13);
						for (var x = 0; x < event.offsetX-1; x++)
						{
							draw.lineTo(x, Math.cos((x+5)/3)*8 + 13);
						}
						draw.stroke();
						draw.beginPath();
						draw.strokeStyle = "red";
						draw.moveTo(0, 13);
						for (var x = 0; x < event.offsetX-1; x++)
						{
							draw.lineTo(x, Math.sin(x/3)*8 + 13);
						}
						draw.stroke();
					}
					else {}
				}
				else
					if (k == 1)
					{
						radio.volume = event.offsetX/(event.srcElement ? event.srcElement.offsetWidth : event.target.offsetWidth);
						draw.clearRect(0,0, 100,26);
						draw.beginPath();
						draw.strokeStyle = "darkred";
						draw.moveTo(0, 13);
						for (var x = 0; x < event.offsetX-1; x++)
						{
							draw.lineTo(x, Math.cos((x+5)/3)*8 + 13);
						}
						draw.stroke();
						draw.beginPath();
						draw.strokeStyle = "red";
						draw.moveTo(0, 13);
						for (var x = 0; x < event.offsetX-1; x++)
						{
							draw.lineTo(x, Math.sin(x/3)*8 + 13);
						}
						draw.stroke();
					}
			}
			
			function PlayerVolTouch(event, k)		// 1 - down, (0 - up,) 2 - move
			{
				if (k == 2)
				{
					radio.volume = (event.touches[0].clientX - event.target.offsetLeft)/event.target.offsetWidth;
					draw.clearRect(0,0, 100,26);
					draw.beginPath();
					draw.strokeStyle = "darkred";
					draw.moveTo(0, 13);
					for (var x = 0; x < (event.touches[0].clientX - event.target.offsetLeft)-1; x++)
					{
						draw.lineTo(x, Math.cos((x+5)/3)*8 + 13);
					}
					draw.stroke();
					draw.beginPath();
					draw.strokeStyle = "red";
					draw.moveTo(0, 13);
					for (var x = 0; x < (event.touches[0].clientX - event.target.offsetLeft)-1; x++)
					{
						draw.lineTo(x, Math.sin(x/3)*8 + 13);
					}
					draw.stroke();
				}
				else
					if (k == 1)
					{
						radio.volume = (event.touches[0].clientX - event.target.offsetLeft)/event.target.offsetWidth;
						draw.clearRect(0,0, 100,26);
						draw.beginPath();
						draw.strokeStyle = "darkred";
						draw.moveTo(0, 13);
						for (var x = 0; x < (event.touches[0].clientX - event.target.offsetLeft)-1; x++)
						{
							draw.lineTo(x, Math.cos((x+5)/3)*8 + 13);
						}
						draw.stroke();
						draw.beginPath();
						draw.strokeStyle = "red";
						draw.moveTo(0, 13);
						for (var x = 0; x < (event.touches[0].clientX - event.target.offsetLeft)-1; x++)
						{
							draw.lineTo(x, Math.sin(x/3)*8 + 13);
						}
						draw.stroke();
					}
			}
