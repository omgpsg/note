  // Initialize Firebase
  var log = console.log
  var config = {
  	apiKey: "AIzaSyCkSkFovCQ2-KcER880cdyexNwRa6JNNOY",
  	authDomain: "noteapp-dbd84.firebaseapp.com",
  	databaseURL: "https://noteapp-dbd84.firebaseio.com",
  	projectId: "noteapp-dbd84",
  	storageBucket: "noteapp-dbd84.appspot.com",
  	messagingSenderId: "20551780289"
  };
  firebase.initializeApp(config);

  var db = firebase.database(); //firebase의 datavase를 가지고 오는것
  var ref = null;

  //▼ 데이터 베이스 변수
  var auth = firebase.auth(); //firebase의 auth를 가지고 오는것
  var google = new firebase.auth.GoogleAuthProvider(); // 구글인증을 쓸 수 있다.
  var user = null;
  var li = $(".navs");
  var ta = $("#content"); //ta변수에 content를 담음

  //signIn 되면 실행되는 함수
  function init(){// 실행될 init을 만든다
	li.empty();//li 안을 모두 지운다.
	ref = db.ref("root/note/"+user.uid) //내 전용아이디 안에 담긴 데이터를 init함수에 담음.
	ref.on("child_added",  callbackAdd)//ref 에 child_addid라는 이벤트붙임 파이어 베이스가 만들어준 이벤트. child가 추가가 된다면, 함수를 데이터를 보여줘라. 추가되면 콜백함수가 실행됨
	ref.on("child_changed",  callbackChg) //변경되면 콜백함수가 실행됨
	ref.on("child_removed",  callbackRev) //삭제되면 콜백함수가 실행됨
  }

  //데이터 베이스 콜백함수
  function callbackAdd(data){
	log("추가", data.key, data.val()); //추가된 데이터 나에게 전송(알려줘)
	var html = `
		<ul id="${data.key}">
			<li>${data.val().content.substr(0, 16)}</li> 
			<li>${timeConverter(data.val().saveTime)}</li> 
			<li onclick="delData(this);" class="hand">x</li>
			</ul>`;//${timeConverter(data.val().saveTime)} 밑에 시간표기값을 정해준 timeConverter 에 담긴 날짜 변경함수를 불러와서 시간 데이터를 담았다.
			li.append(html); //내가 전달받은 데이터들을 li변수안에 담는다.
		}
  function callbackChg(data){
	log("수정", data.key, data.val());//수정된 데이터 나에게 전송(알려줘)
  }
  function callbackRev(data){
	//log("삭제", data.key, data.val());삭제된 데이터 나에게 전송(알려줘)
	$("#"+data.key).remove();  
  }

  //데이터베이스 구현
  $("#bt_add").click(function () { //add를 클릭하면

  });
  $("#bt_save").click(function () { //등록버튼을 클릭시
  	var content = ta.val(); //()안에 아무것도 없으면 ()안에 뭔가를 가지고 오는것.
  	if (content == '') { //등록을 클릭시 content가 빈값이라면 
  		alert("내용을 입력하세요") //내용을 입력하세요가 뜬다.
  		ta.focus(); //ta에게 커서를 가져다 놓는다. 커서를 가져다놓으라는 명령어 focus -> 입력할 수 있게 준비시키는것.
	} 
	else {
		ref = db.ref("root/note/"+user.uid); //사용자마다 아이디가 달라 전용 아이디 폴덜를 생성해 그곳에 데이터를 저장 관리, 하며 보는곳은 파이어베이스 데이터베이스 에서 볼 수 있다.
		ref.push({ //데이터를 윗줄에서 발급된 전용아이디 폴더로 밀어 넣는다.
			content: content, //입력한 데이터
			saveTime: new Date().getTime() //입력한 시간 
		}).key;// 키값도 함께 밀어 넣는다.
		
  	}

  });
  $("#bt_cancel").click(function(){
  	ta.val(''); //textarea에 벨류값을 빈값으로 넣어 취소를 클릭했을때 글자가 삭제된다. 괄호안에 아무것도 안넣어서 비워지는것
  });
  function delData(obj){
	  if(confirm("정말로 삭제할거?")){ //삭제하는 창을띄워 컨펌받는것.
	  var id = $(obj).parent().attr("id")
	  ref = db.ref("root/note/"+user.uid+"/"+id)
	  ref.remove(); //데이터베이스 지우는것.
	  }
  }


  //2번 방식 ★★인증 구현★★
  $("#bt_google_login").click(function () {
  	auth.signInWithPopup(google); //로그인 명령만 내림 (팝업으로 띄워라)
  	//auth.signInWithRedirect(google); 로그인 명령만 내림 (팝업을 띄우지 않고 계정선택화면이 바로 나온다.)
  });
  $("#bt_google_logout").click(function () {
  	auth.signOut(); //로그아웃 명령만 내림
  });

  auth.onAuthStateChanged(function (data) { //로그인 로그아웃 명령을 auth.onAuthStateChanged 실행? 받아들인다?.. auth의 명령상태가 변화되면 이 함수를 실행한다 (로그인이되어도, 로그아웃이 되어도 실행된다.)
  	log(data);
  	if (data) { //로그인 상태
  		user = data; // 로그인 상태에서 유저에 로그인된 유저의 정보를 담음
  		$("#bt_google_login").hide(); // 로긴성공후 데이터가 보여지면 로그인 버튼을 가리고
  		$("#bt_google_logout").show(); // 로그아웃 버튼이 떠라
  		$(".email").html(user.email); //이메일에 유저이메일html 추가
  		$(".symbol").show(); // 심볼을 보이게하고
		$(".symbol > img").attr("src", user.photoURL); //유저 이미지 url을 넣는다.
		init();

  	} else { //로그아웃 상태
  		user = null; // 유저에 null을 넣어라
  		$(this).hide(); //logout을 감춘다
  		$("#bt_google_login").show(); //로그인을 보여라
  		$("#bt_google_logout").hide(); //logout을 감춘다
  		$(".email").html(""); //이메일에 유저이메일html 빼기
  		$(".symbol").hide(); // 심볼을 감추고
  		$(".symbol > img").attr("src", ""); //유저 이미지 url을 비운다

  	}
  });


/***** Timestamp 값을 GMT표기로 바꾸는 함수 *****/
function timeConverter(ts){
	var a = new Date(ts);
	//var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
	var year = a.getFullYear();
	//var month = months[a.getMonth()];
	var month = addZero(a.getMonth()+1);
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	//var str = String(year).substr(2)+"년 "+month+" "+date+"일 "+amPm(addZero(hour))+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	//var str = year+"년 "+month+" "+date+"일 "+amPm(hour)+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	var str = year+"-"+month+"-"+date+" "+amPm(hour)+":"+addZero(min)+":"+addZero(sec);
	return str;
}

/***** 0~9까지의 숫자의 앞에 0을 붙이는 함수 *****/
function addZero(n) {
	if(n<10) return "0"+n;
	else return n;
}

/***** 오전/오후 붙여주는 함수 *****/
function amPm(h) {
	if(h<12) return "오전 "+addZero(h);
	else if(h>12) return "오후 "+addZero(h-12);
	else return "오후 12";
}


  //1번 방식★★★★★옛날방식★★★★★
  /*$("#bt_google_login").on("click" , function(){
    auth.signInWithPopup(google).then(function(data){ //singInWithPopup 팝업으로 로그인이 된다.
    $("#bt_google_login").hide();// 로긴성공후 데이터가 보여지면 로그인 버튼을 가리고
    $("#bt_google_logout").show(); // 로그아웃 버튼이 떠라
    user = data.user; // 유저 값에 데이터 유저를 넣어라
    $(".email").html(user.email); //이메일에 유저이메일html 추가
    $("symbol").show(); // 심볼을 보이게하고
    $("symbol > img").attr("src" . user.photoURL); //유저 이미지 url을 넣는다.
    });
  })
  $("#bt_google_logout").on("click" , function(){
    aute.signQut.then(function(data){ //로그아웃되면
    $(this).hide(); //logout을 감춘다
    $("#bt_google_login").show();//로그인을 보여라
    $("#bt_google_logout").hide();//logout을 감춘다
    user = null;
    $(".email").html(""); //이메일에 유저이메일html 빼기
    $("symbol").hide(); // 심볼을 감추고
    $("symbol > img").attr("src" , ""); //유저 이미지 url을 비운다
    })
  })*/