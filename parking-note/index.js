function fun() {
	var recode = [];
	var inputbox = document.getElementById("inputbox");
	var button = document.getElementById("button");
	button.onclick = function() {
		if (inputbox.value == "listrecord-all") {
			if (recode.length === 0) alert("没有记录");
			var len = recode.length
			for (var i = 0; i < len; i++) {
				if (recode[i][0] == "in") {
					console.log("Recode" + i + ":" + recode[i][1] + recode[i][2] + " in")
				} else {
					console.log("Recode" + i + ":" + recode[i][1] + recode[i][2] + " out")
				}
			}
		} else if (inputbox.value.substr(0, 13) == "listrecord-n=") {
			if (recode.length === 0) alert("没有记录");
			var len = recode.length;
			var car = inputbox.value.substr(inputbox.value.indxeOf("=") + 1, 6);
			for (var i = 0; i < len; i++) {
				if (recode[i][1] == car) {
					console.log("Recode" + i + ":" + recode[i][1] + recode[i][2] +" " recode[i][0])
				}
			}

		}else{
			var arr=[];
			if(inputbox.value[5]=="i"){
				arr[0]="in";
			}else if(inputbox.value[5]=="o"){
				arr[0]="out";
			}else{
				alert("输入有误")
			}
			arr[1]=GetCar(inputbox.value);
			arr[2]=GetTime(inputbox.value);
			recode.push(arr);console.log(recode)
			alert("输入成功！")
		}
	}
}
function GetTime(checkstring){
	var index=checkstring.indexOf("=");
	if(index!=-1){
		var Time=checkstring.substr(index+1,6);
	}
	return Time;
}
function GetCar(checkstring){
	var index=checkstring.indexOf("n=");
	if(index!=-1){
		var Car=checkstring.substr(index+2,6);
	}
	return Car;
}
window.onload = fun;