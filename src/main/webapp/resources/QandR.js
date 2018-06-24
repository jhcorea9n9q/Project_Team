function qna() {
	qnalist(1);
	admitcheck();
	var i = 0;
    $("#qa_tap li").off().on("click", function(){
                i = $(this).index() + 1;
                var title = ["<h3>공지사항</h3>", "<h3>자주묻는 질문</h3>", "<h3>고객 의견</h3>"];
                $("#qa_board table").hide();
                $("#qa_table" + i).show();
                $("#qa_btitle").empty();
                $("#qa_btitle").html(title[i - 1]);
                if (i == 1) {
                    $("#qa_bno").css("display", "inline-block");
                    $("#qa_write").css("display", "none");
                    $("#qa_ta2tap").css("display", "none");
                    admitcheck();
                } else if (i == 2) {
                    $("#qa_bno").css("display", "none");
                    $("#qa_ta2tap").css("display", "inline-block");
                } else if (i == 3) {
                    $("#qa_bno").css("display", "inline-block");
                    $("#qa_write").css("display", "block");
                    $("#qa_ta2tap").css("display", "none");                    
                }
            });
    $("#qa_bno li").off().on("click", function(){
    	if(i == 3) {
    		var PageNumber = $(this).text();
    		if(PageNumber != "▶" && PageNumber != "◀") {
    			$("#qa_table3").empty();
    			qnalist(PageNumber);
    		} else if (PageNumber == "▶") {
    			for (var j = 1; j<12; j++){
    				var no = $("#qa_bno li").eq(j).text();
    				no = Number(no) + 11;
    				$("#qa_bno li").eq(j).text(no);
    			}
    		} else if (PageNumber == "◀") {
    			for (var j = 1; j<12; j++){
    				var no = $("#qa_bno li").eq(j).text();
    				if (no != 1) {
    					no = Number(no) - 11;
        				$("#qa_bno li").eq(j).text(no);
    				} else if (no == 1) {
    					break;
    				}
    			}
    		}
    	}
    });
    
    QnAdetail();
    qnainsert();
}

function qnalist(PageNumber) {
	$.ajax({
		type: "post",
		url:"/ljh/QnAboardList",
		data:{"PageNumber":PageNumber}
	}).done(function(data){
		var d = JSON.parse(data).list;
		var AllCount = d[0] - (PageNumber * 10);
		if (AllCount < 0) {
			AllCount = 0;
		}
		var comYN = "";
		$("#qa_table3").empty();
		for(var k=1; k<d.length; k++){
			var boardList = d[k];
			if (boardList.comYn == "N") {
				comYN = "확인중";
			}else if (boardList.comYn == "Y") {
				comYN = "완료!";
			}
			var html = "<tr>";
				html += "<td>"+(AllCount+k)+"</td>";
				html += "<td class='qa_btext'><a href='/ljh/page/main.html?boardNo=" + boardList.boardNo +"'>"+ boardList.boardTitle +"</a></td>";
				html += "<td>" + comYN + "</td>";
				html += "<td>" + boardList.regDate + "</td>";
				html += "</tr>";
				$("#qa_table3").prepend(html);
		}
		var html_tr = "<tr><th>번호</th><th>제목</th><th>답변유무</th><th>작성일자</th></tr>";
		$("#qa_table3").prepend(html_tr);
	});	
}

function qnainsert(){
	$("#qa_write").off().on("click", function(){
    	$("#qa_main").empty();
    	$("#qa_inputplease").css("display", "inline-block");
    });
    
    $("#qa_inputplease").submit(function(e){
    	e.preventDefault();
    	var V1 = $("#qa_inputplease input").eq(0).val();
    	var V2 = $("#qa_inputplease input").eq(1).val();
    	if(V1 == ""){
    		alert("제목을 입력해 주세요.");
    		document.getElementById('qa_ip1').focus();
    	}else{
    		if(V2 == ""){
    			alert("내용을 입력해 주세요.");
        		document.getElementById('qa_ip2').focus();
    		}else{
    			$.ajax({
    	    		type:"post",
    	    		url: "/ljh/QnAinsert",
    	    		data: {"boardTitle" : V1,
    	    			"boardContents" : V2}
    	    	}).done(function(data){
    	    		var d = JSON.parse(data);
    	    		if(d.logincheck == "NO") {
    	    			alert("우선 로그인 해주십시오.");
    	    			localStorage.setItem("url", "login.html");
    	    			location.href="/ljh/page/main.html";
    	    		}else{
    	    			if(d.status == 1) {
    	        			alert("작성이 완료되었습니다.");
    	        			location.href="/ljh/page/main.html";
    	        		}else if(d.status == 0) {
    	        			alert("작성을 실패했습니다. 다시 시도해주십시오.");
    	        		}
    	    		}
    	    		
    	    	});
    		}
    	}
    });
    
    $("#qa_rollback").off().on("click",function(){
    	var checkmessage = confirm("정말로 취소하시겠습니까?");
    	if(checkmessage == true){
    		location.href="/ljh/page/main.html";
    	}
    });
}

function QnAdetail(){ // 게시물 확인.
	var Qu;
	var query = window.location.href.slice(window.location.href.indexOf('?') + 1);
	if(query!="http://localhost:8080/ljh/page/main.html"){
		Qu = query.split('=');
		var bNo = Qu[1];
		$.ajax({
			type:"post",
    		url: "/ljh/QnAdetail",
    		data: {"boardNo":bNo}
		}).done(function(data){
			var d = JSON.parse(data);
			if(d != null) {
				$("#qa_main").empty();
				$("#qa_checkdetails").css("display", "inline-block");
				$("#qa_checkdetails h3").text(d.boardTitle);
				$("#qa_checkdetails h5").text("작성자 이름 : " + d.userNo);
				$("#qa_checkdetails p").text(d.boardContents);

				$("#qa_rollback2").off().on("click",function(){
			    	location.href="/ljh/page/main.html";
			    });
				
				$.ajax({ // 세션 체크.
					type: "post",
					url: "/ljh/userCheck"
				}).done(function(data){
					var uc = JSON.parse(data);
					var list = uc.list;
					if(list != null) {
						if(list.userName != "관리자") { // 게시물 작성자와 현재 유저가 일치하지 않을 때.
							if(list.userName != d.userNo) {
								$("#qa_updatebutton").hide();
								$("#qa_deletebutton").hide();
							}
						}else { // 관리자일 때/
							if(d.comYn=="N") {
								$("#qa_updateCheck").show();
							}
						}
					} else { // 로그인된 유저가 없을 때.
						$("#qa_updatebutton").hide(); 
						$("#qa_deletebutton").hide();
					}
				});
				
				$("#qa_updateCheck").off().on("click",function(){ // 글 확인 버튼 클릭시
					var admincheck = confirm("게시글을 확인하셨나요?");
					if(admincheck == true) {
						$.ajax({
							type:"post",
							url:"/ljh/AdminCheck",
							data:{"boardNo" : bNo}
						}).done(function(data){
							var d = JSON.parse(data);
							if(d.status == 1) {
								alert("글 확인이 완료되었습니다.");
								location.href="/ljh/page/main.html";
							}else {
								alert("제대로 확인되지 않았습니다.");
							}
						});
					}
				});
				
				$("#qa_updatebutton").off().on("click",function(){ // 업데이트 버튼 클릭시
					$("#qa_checkdetails h3").hide();
					$("#qa_checkdetails h5").hide();
					$("#qa_checkdetails p").hide();
					$("#qa_updatebutton").hide();
					$(".qa_detailinput").show();
					$("#qa_rollback3").show();
					$("#qa_checkdetails input").eq(0).val(d.boardTitle);
			    	$("#qa_checkdetails input").eq(1).val(d.boardContents);
			    });
				
				$("#qa_checkdetails").submit(function(e){ // 수정하기 시도했을 때.
			    	e.preventDefault();
			    	var uV1 = $("#qa_checkdetails input").eq(0).val();
			    	var uV2 = $("#qa_checkdetails input").eq(1).val();
			    	$.ajax({
						type:"post",
						url:"/ljh/boardUpdate",
						data:{"boardNo" : bNo, "boardTitle":uV1,"boardContents":uV2}
					}).done(function(data){
						var Ud = JSON.parse(data);
						if(Ud.status == 1) {
							alert("작성글 " + d.boardTitle + " 의 수정이 완료되었습니다.");
							location.href="/ljh/page/main.html?boardNo=" + bNo;
						}else {
							alert("해당 글의 내용이 제대로 수정되지 않았습니다.");
						}
					});
				});
				
				$("#qa_deletebutton").off().on("click", function(){ // 삭제버튼 클릭시
					var reallyDel = confirm("정말로 게시물을 삭제합니까?");
					if(reallyDel == true) {
						$.ajax({
							type:"post",
							url:"/ljh/boardDelete",
							data:{"boardNo" : bNo}
						}).done(function(data){
							var d = JSON.parse(data);
							if(d.status == 1) {
								alert("글 삭제가 완료되었습니다.");
								location.href="/ljh/page/main.html";
							}else {
								alert("이런! 해당 글의 삭제를 실패했습니다.");
							}
						});
					}
				});
				
				$("#qa_rollback3").off().on("click",function(){
					var reallyNoUp = confirm("수정을 취소합니까?");
					if(reallyNoUp == true) {
						$("#qa_checkdetails h3").show();
						$("#qa_checkdetails h5").show();
						$("#qa_checkdetails p").show();
						$("#qa_updatebutton").show();
						$(".qa_detailinput").hide();
						$("#qa_rollback3").hide();
					}
				});
				
			} else { // 쿼리스트링 변경으로 못된 장난을 칠때
				alert("잘못된 접근입니다.");
				location.href="/ljh/page/main.html";
			}

		});
	}
}

function admitcheck() {
	$.ajax({
		type: "post",
		url: "/ljh/userCheck"
	}).done(function(data){
		var d = JSON.parse(data);
		var list = d.list;
		if(list != null) {
			if(list.userName == "관리자"){
				console.log("환영합니다 관리자님.");
				$("#qa_write").css("display", "block");
			}
		}
	});
}

function admitcheckfordetail(html) {
	$.ajax({
		type: "post",
		url: "/ljh/userCheck"
	}).done(function(data){
		var d = JSON.parse(data);
		var list = d.list;
		if(list != null) {
			if(list.bo == "관리자"){
				$("qa_updateCheck").show;
			}
		}
	});
}

function reaservation() {
    var areavalue;
            $("#rsv_area ul li").off().on("click", function(){
                areavalue = $(this).index();
                areasearch(areavalue);
            });
            $("#rsv_startbutton").off().on("click", function(){
                var tableselect = $("#rsv_menu1 input:checked").val();
                if (tableselect == "bag") {
                    $("#rsv_list_table1").css("display", "table");
                    $("#rsv_list_table2").css("display", "none");
                }else if (tableselect == "watch") {
                    $("#rsv_list_table2").css("display", "table");
                    $("#rsv_list_table1").css("display", "none");
                }
                areavalue = $("#rsv_menu3 select").val();
                if(areavalue != -1){
                    areasearch(areavalue);
                }
            });
            function areasearch(av) {
                var i = av - 1;
                var mapurl = ["https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313740.168915977!2d125.62462485849026!3d35.7981071861466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356455ebcb11ba9b%3A0x91249b00ba88db4b!2z64yA7ZWc66-86rWt!5e0!3m2!1sko!2skr!4v1527065548992", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d404811.2671992865!2d126.70936381706494!3d37.56476893071881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2z7ISc7Jq47Yq567OE7Iuc!5e0!3m2!1sko!2skr!4v1527137551193", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101338.83954294637!2d126.60431045585904!3d37.46452933176048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35796f2596138247%3A0x7d37fd902cb76142!2z7J247LKc6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137642134", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d809272.1685923658!2d126.53549619265904!3d37.59699492544846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c79e4e57eb68d%3A0x10c1f98d6f6b5c2!2z6rK96riw64-E!5e0!3m2!1sko!2skr!4v1527137671773", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d806346.3823678893!2d127.68734705807618!3d37.86519080782262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356237ec59968d89%3A0xe150c7d25a07a6e!2z6rCV7JuQ64-E!5e0!3m2!1sko!2skr!4v1527137698198", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102799.74712085196!2d127.3187604303316!3d36.37307955873017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356548d7ba4a6601%3A0xd196d69d988ad3b5!2z64yA7KCE6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137742293", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103447.88670142986!2d128.4966604190018!3d35.87972967108084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e3b8b2efadd5%3A0xba92e029a0382e30!2z64yA6rWs6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137800046", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52179.11813465025!2d126.80878064034218!3d35.176694960525616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3571892301f5a7af%3A0x5f4d2ed0125f548!2z6rSR7KO86rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137828854", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104373.97914101335!2d129.0017604028086!3d35.16442984467441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568eb6de823cd35%3A0x35d8cb74247108a7!2z67aA7IKw6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137856878", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d425479.10172023147!2d126.29284951448652!3d33.57790868955271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x350ce3544cc84045%3A0x66bc36d2981ebf31!2z7KCc7KO87Yq567OE7J6Q7LmY64-E!5e0!3m2!1sko!2skr!4v1527137892293"];
                var HTML = '<iframe src=' + mapurl[i] + ' width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>';
                $("#rsv_map").empty();
                $("#rsv_map").html(HTML);
            }
}