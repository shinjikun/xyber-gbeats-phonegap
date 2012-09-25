function init(){
		document.addEventListener("deviceready", onDeviceReady, true);  
	}
$('#legalese').live('pagecreate',function(event){	
	initPages();
	
	});




$('#home').live('pagechange',function(event){	
	//if(checkConnectivity2()) {
		initMainPage();	
//	}
	
	
	});


//http://dloadstation.com/wap2/Modules/SMSService/subscribe.php?soid=3017&sid=137&domain=dloadstation.com&confirm=true


var featArtist;
function onDeviceReady(){
	// get the filesystem setup and run the pre-loader (follow the callback road)
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail_FS);
	     startAnalytics();
	     //	initPages();
		$('#yes').on('click', function(){
		
		 	trackEvent("legalese","Yes","He pressed Yes");
			$.mobile.changePage("#mobtel", { transition: "slide",reverse: false,
			changeHash: false } );
			
		
		});
		$('#no').on('click', function(){
			trackEvent("legalese","No","He pressed NO");
			navigator.app.exitApp();
		});
		
		$("#login").on('click',submitMobtel);
		$('#btnResend').on('click', function () {
		   window.localStorage.removeItem("code");
		   //trackPageView(location.pathname +location.search +location.hash);
		   $.mobile.changePage("#mobtel", { transition: "slide", reverse: false,
			changeHash: false} );
			
		});
		$('#btnVerify').on('click', function () {
			if ($('#txtCode').val() == localStorage.getItem("code"))
			{
				localStorage.setItem("verified", true);
			//	trackPageView(location.pathname +location.search +location.hash);
		
				$.mobile.changePage("#home", { transition: "slide"} );
			    initMainPage();
			
			}
			else
			{
				alert('Invalid verification code.');
			}
		});
	
		if(checkConnectivity2()) {
			$("#featured-artist-list").on("click",initfeatartist);
//			initGenreList(7,"#opm_list","#opm");
			initGenreList(5,"#pop_list","#pops");
			initGenreList(6,"#alt-rock_list","#alt-rock");
			initGenreList(8,"#loves_list","#loves");	
			initGenreList(1,'#d70_list',"#d70");
			initGenreList(2,'#d80_list',"#d80");
			initGenreList(3,'#d90_list',"#d90");
			initGenreList(9,'#tops_list',"#tops");
			 //initMoreList(9,'#more_hits_list',-1);
			
		}
		
	
		
	}
function genre_paid_list_click(divTag,type){
	$(divTag +" #more-hits-"+type).on('click',function(event, ui){
	
		    
		var soid = $(this).attr("data-soid");
        var sid = $(this).attr("data-sid");
        var artist_name = $(this).parent().parent().find("h6").text();
        var song_name = $(this).parent().parent().find("h5").text();
        serviceOid =soid;
        service_id =sid;
        sub_artist = artist_name;
        sub_song = song_name;
        showSubscribeDialog(song_name, artist_name, soid, sid,type,divTag);
       
   });
}


function initGenreList(genretype,divTag,divTagParent) {
	  $(divTag).empty();
	  			$.get("http://vme3.wyrls.net/gbeatsws/services/genre_info?genre_id="+genretype,
	  					function(json,status){
	  				       
	  						var parent = jQuery.parseJSON(json);
	  						var obj = parent[0].songs;
	  				    		
	  	    				$.each(obj ,function(i,element){
	  	    					index =i+1;
	  	    					artist_name = element.artist_name;
	  	    					song_name = element.song_name;
	  	    					desc = element.song_info;
	  	    					sid ="notready";
	  	    					if(element.paid_content_info.ftm.service_id){
	  	    						sid = element.paid_content_info.ftm.service_id;	
	  	    					}
	  	    					soid ="notready";
	  	    					if(element.paid_content_info.ftm.service_offering_id){
	  	    					soid = element.paid_content_info.ftm.service_offering_id;	
	  	    					}
	  	    					contentid="notready";
	  	    					if(element.paid_content_info.ftm.service_offering_id){
	  	    						contentid = element.free_content_info.ftm.content_id;	
		  	    					}
	  	    					imghomepanel = "albums/default.jpg";
	  	    					if(element.song_image){
	  	    						imghomepanel = element.song_image;	
	  	    					}
	  	    					
	  	    					
	 	 	    			
	  	    					 
	 	    					 if(imghomepanel == "" || imghomepanel=="null" || imghomepanel== null){
	 	    						 imghomepanel = "albums/default.jpg";
	 	    					 }
	 	    					 
	 	    				
	  	        				$('<div class="rank-item" data-soid='+soid+' data-sid='+sid+' data-desc="'+desc+'" data-contentid='+contentid+ '>' +
	  	        						'<div class="dl-ftm"><a>&nbsp;</a></div>'+
	  	                                '<div class="ranking">'+index+'</div>'+
	  	                                '<div class="album-art"><img src='+imghomepanel+'></div>'+
	  	                                '<div class="the-song">'+
	  	                            	     '<h5>'+element.song_name+'</h5>'+
	  	                                     '<h6>'+element.artist_name+'</h6>'+
	  	                                '</div></div>').appendTo(divTag);	
	  	        				
	  	           				
	  	        					genrepaidlist(element, divTagParent+" .the-hits");
	  	         			});
	  	
	                         
	  	    				
	  	    				$(divTag +" .the-song , "+ divTag +" .dl-ftm").on('click',function(event, ui){
	                          
	                     		var artist_name = $(this).parent().find('h6').text();
	                    		var song_name = $(this).parent().find('h5').text();
	              	    		var contentid= $(this).parent().attr("data-contentid");
	  	    			  	    showDirectDialog(song_name,artist_name,contentid,divTagParent);   
	                       });
	  	    				
	  	    				$(divTag +" .album-art").on('click',function(event, ui){
	  	    				  var artist_name = $(this).parent().find('h6').text();
                              var song_name = $(this).parent().find('h5').text();
                              var img_src = $(this).parent().find('img').attr("src");
                              var desc= $(this).parent().attr("data-desc");
                              $("#songinfodialog #songTitle").text(song_name);
                              $("#songinfodialog #artistName").text(artist_name);
                              $("#songinfodialog #songinfo").text(desc);
                              $("#songinfodialog #albumart").attr("src",img_src);
	  	    				  $.mobile.changePage('#songinfodialog', {transition: 'slide', role: 'dialog'});
                           });
	                                     				
	  	    				genre_paid_list_click(divTagParent, "rbt");
	  	    				genre_paid_list_click(divTagParent, "mp3");
	  	    				genre_paid_list_click(divTagParent, "ftm");
	  				}).success(function(){
	  				
	  					//hideDialog();
	  					
	  				}).error(function(request, status, error){
	  				  //  alert("on"+divTag);
	  					jsonError(request.responseText+"on"+divTag);
	  				}); 
	
		
}

function searchMusic(searchItem,divTag) {
    $(divTag).empty();
   
              $.get(" http://vme3.wyrls.net/gbeatsws/services/song_search?keyword="+searchItem,
                      function(json,status){
                         
                          var parent = jQuery.parseJSON(json);
                          var obj = parent;
                         
                          $.each(obj ,function(i,element){
                              index =i+1;
                              artist_name = element.artist_name;
                              song_name = element.song_name;
                              desc = element.song_info;
                              sid ="notready";
                              if(element.paid_content_info.ftm.service_id){
                                  sid = element.paid_content_info.ftm.service_id; 
                              }
                              soid ="notready";
                              if(element.paid_content_info.ftm.service_offering_id){
                              soid = element.paid_content_info.ftm.service_offering_id;   
                              }
                              contentid="notready";
                              if(element.paid_content_info.ftm.service_offering_id){
                                  contentid = element.free_content_info.ftm.content_id;   
                                  }
                              imghomepanel = "albums/default.jpg";
                              if(element.song_image){
                                  imghomepanel = element.song_image;  
                              }
                              
                              
                          
                               
                               if(imghomepanel == "" || imghomepanel=="null" || imghomepanel== null){
                                   imghomepanel = "albums/default.jpg";
                               }
                               
                             
                              $('<div class="rank-item" data-soid='+soid+' data-sid='+sid+' data-desc="'+desc+'" data-contentid='+contentid+ '>' +
                                      '<div class="dl-ftm"><a>&nbsp;</a></div>'+
                                      '<div class="ranking">'+index+'</div>'+
                                      '<div class="album-art"><img src='+imghomepanel+'></div>'+
                                      '<div class="the-song">'+
                                           '<h5>'+element.song_name+'</h5>'+
                                           '<h6>'+element.artist_name+'</h6>'+
                                      '</div></div>').appendTo(divTag);   
                              
                              genrepaidlist(element, "#searchresult .the-hits");
                                 
                          });
      
                           
                          
                          $(divTag +" .the-song , "+ divTag +" .dl-ftm").on('click',function(event, ui){
                            
                              var artist_name = $(this).parent().find('h6').text();
                              var song_name = $(this).parent().find('h5').text();
                              var contentid= $(this).parent().attr("data-contentid");
                              showDirectDialog(song_name,artist_name,contentid,divTagParent);   
                         });
                          
                          $(divTag +" .album-art").on('click',function(event, ui){
                            var artist_name = $(this).parent().find('h6').text();
                            var song_name = $(this).parent().find('h5').text();
                            var img_src = $(this).parent().find('img').attr("src");
                            var desc= $(this).parent().attr("data-desc");
                            $("#songinfodialog #songTitle").text(song_name);
                            $("#songinfodialog #artistName").text(artist_name);
                            $("#songinfodialog #songinfo").text(desc);
                            $("#songinfodialog #albumart").attr("src",img_src);
                            $.mobile.changePage('#songinfodialog', {transition: 'slide', role: 'dialog'});
                         });
                                                      
                          genre_paid_list_click("#searchresult", "rbt");
	  	    				genre_paid_list_click("#searchresult", "mp3");
	  	    				genre_paid_list_click("#searchresult", "ftm");  
                  }).success(function(){
                	 
                		 	$("#searchresult_header").text("Search Result: '"+searchItem+"'");
                		 	$.mobile.changePage("#searchresult", { transition: "slide"} );
                	
                  }).error(function(request, status, error){
                	 alert("No records match the Search Criteria. Try Searching Again"); 
                    //  alert("on"+divTag);
                   //   jsonError(request.responseText+"on"+divTag);
                  }); 
  
      
}


function genrepaidlist(element, divTag){
	
	    artist_name = element.artist_name;
	   
		song_name = element.song_name;
		fsid ="notready";
		if(element.paid_content_info.ftm.service_id){
			fsid = element.paid_content_info.ftm.service_id;	
		}
		fsoid ="notready";
		if(element.paid_content_info.ftm.service_offering_id){
		fsoid = element.paid_content_info.ftm.service_offering_id;	
		}
		
		msid ="notready";
		if(element.paid_content_info.mp3.service_id){
			msid = element.paid_content_info.mp3.service_id;	
		}
		msoid ="notready";
		if(element.paid_content_info.mp3.service_offering_id){
		msoid = element.paid_content_info.mp3.service_offering_id;	
		}
		
		rsid ="notready";
		if(element.paid_content_info.rbt.service_id){
			rsid = element.paid_content_info.rbt.service_id;	
		}
		rsoid ="notready";
		if(element.paid_content_info.rbt.service_offering_id){
		rsoid = element.paid_content_info.rbt.service_offering_id;	
		}
		
	
		rsid = element.paid_content_info.rbt.service_id;
		rsoid =element.paid_content_info.rbt.service_offering_id;
		 imghomepanel = element.song_image;
			
		 if(imghomepanel == "" || imghomepanel=="null" || imghomepanel== null){
			 imghomepanel = "albums/default.jpg";
		 }
       $('<div class="hit-items">'+
                '<div class="song-details">'+
                     '<div class="album-art"><img src='+imghomepanel+'></div>'+
                     '<div class="the-song">'+
                     		'<h5>'+element.song_name+'</h5>'+
                     		'<h6>'+element.artist_name+'</h6>'+
                     '</div>'+
                 '</div>'+
                 '<div class="dl-containers">'+
                     '<a id="more-hits-ftm" data-soid='+fsoid+' data-sid='+fsid+ 
                     '  >Fullsong</a>'+    
                   '<a id="more-hits-mp3" data-soid='+msoid+' data-sid='+msid+ 
                     '  >MP3</a>'+
                   '<a id="more-hits-rbt" data-soid='+rsoid+' data-sid='+rsid+ 
                     '  >Caller Ringback</a>'+
                 '</div>'+
           '</div>').appendTo(divTag);
		
	
	
}



 isfeatlistartist =false;
function initfeatartist(){
   
   if(!isfeatlistartist){
		

						var obj = jQuery.parseJSON(featArtist);
						
						$.each(obj.data,function(i,element){
							 img_feat_artist = "albums/default.jpg";
						  
						   if(element.featured_artist_image){
							   img_feat_artist = element.featured_artist_image;  
	    					 }
						   if(img_feat_artist == "" || img_feat_artist=="null" || img_feat_artist== null){
							   img_feat_artist = "albums/default.jpg";
	    					 }
						  
							
							$('<div class="featured-artists"><a ><img alt='+element.link_to_promo+
									' data-artist_name='+element.artist_name+' src='+ img_feat_artist
		           					+  ' /></a></div>').
		           					appendTo("#featartistlistitem");
						});
	    
	    			          				
	    				$(".featured-artists img").on('click',function(event, ui){
	    					var hurl = $(this).attr("alt");
	    					var artist_name = $(this).attr("data-artist_name");
	    					
	    					window.plugins.childBrowser.showWebPage(hurl, { showLocationBar: true,pageTitle:artist_name });
	    					trackPageView(hurl);
					   });
	    				isfeatlistartist =true;			 
  	}
}

var islocatartistloaded =false;
var isnewartistloaded =false;
var ismoreartistloaded =false;
var istophitlistloaded =false;


	

function initSlideshow(isloaded,genretype,divTag) {
	 $(divTag).empty();
	if(!isloaded){ 			
		$.get("http://vme3.wyrls.net/gbeatsws/services/genre_info?genre_id="+genretype,
	  					function(json,status){
	  				       
	  						var parent = jQuery.parseJSON(json);
	  						
	  						var obj = parent[0].songs;
	  				    		
	  	    				$.each(obj ,function(i,element){
	  	    					imghomepanel = "albums/default.jpg";
	  	    					if(element.song_image){
	  	    						imghomepanel = element.song_image;
	  	    					}
	  	    					
	 	    					 imghomepanel = element.song_image;
	 	    				
	 	    					 if(imghomepanel == "" || imghomepanel=="null" || imghomepanel== null){
	 	    						 imghomepanel = "albums/default.jpg";
	 	    					 }
		    					
		    						$('<li><img  src='+ imghomepanel +  ' /></li>').	  	                            
	  	                            appendTo(divTag);	
	  	        				
	  	           				
	  	        					
	  	         			});
	  	                    
	  	    			          				
	  	    				
	  				}).success(function(){
	  					isloaded = true;
	  				
	  					
	  				}).error(function(request,status,error){
	  					//alert(request.responseText);
	  					jsonError(request.responseText+"on"+divTag);
	  				}); 
	}
		
}




var isphotoLoaded =false;
function initMainPage() {

	
		  	if(!isphotoLoaded){
	    		
	  			$.post("http://vme3.wyrls.net/gbeatsws/services/artist_list?artist_type=featured",
	  					function(json,status){
	  						var obj = jQuery.parseJSON(json);
	  						featArtist = json;
	  	    				$.each(obj.data,function(i,element){
	  	    					 imghomepanel = "albums/default.jpg";
	  	    					if(element.home_panel_image){
	  	    						 imghomepanel = element.home_panel_image;
	  	    						
	  	    					 }
	  	    					
	  	    					 
	  	    					// alert(imghomepanel);
	  	    					 if(imghomepanel == ""){
	  	    						 imghomepanel = "albums/default.jpg";
	  	    					 }
	  	        					$('<li><img id="artistimg" src='+ imghomepanel
	  	           					+  ' alt="" /></li>').
	  	           					appendTo("#slide-featured");
	  	        					
	  	        				
	  	           				
	  	        					
	  	         			});
	  	
	  				}).success(function(){
	  					isphotoLoaded = true; 
	  					
	  					
	  				}).error(function(request, status, error){
	  				   
	  					jsonError(request.responseText+"on mainpage");
	  				}); 
		  	}
		  	//initlocalartist();
			initSlideshow(islocatartistloaded,7,"#slide-local");
			initSlideshow(isnewartistloaded,5,"#slide-new");
			initSlideshow(ismoreartistloaded,3,"#slide-more");
			initSlideshow(istophitlistloaded,9,"#slide-top-hits");
			
}


function initPages() {
	
	if ('true' == localStorage.getItem("verified"))
	{  
       // trackPageView(location.pathname +location.search +location.hash); 
		$.mobile.changePage("#home");
	   	initMainPage();
		
	}
	else if (null != localStorage.getItem("code"))
	{  
		//trackPageView(location.pathname +location.search +location.hash);
		$.mobile.changePage("#verifypage", { transition: "slide",reverse: false,
		changeHash: false } );
		
		
	}
	
}


/**
 * method that determine whether if the MSISDN is prepaid or postpage 
 * @param prefix
 * @param digits
 */
function isPrepaid(prefix, digits){
    var	is_prepaid = false;

	// Globe
	 
	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^[2-4]/)));
	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^5[0-7]/)));

	is_prepaid = is_prepaid||((prefix=='0906')&&(digits.match(/^[2-5]/)));

	is_prepaid = is_prepaid||((prefix=='0915')&&(digits.match(/^[1-9]/)));

	is_prepaid = is_prepaid||((prefix=='0916')&&(digits.match(/^[2-7]/)));

	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^2[0-7]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^3[3-9]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^4/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^6[01469]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^7[3-8]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^90/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^91[0-8]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^919[0-8]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^919900[0-9]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^9[2-4]/)));
	is_prepaid = is_prepaid||((prefix=='0917')&&(digits.match(/^9[5-9]/)));

	is_prepaid = is_prepaid||((prefix=='0926')&&(digits.match(/^6[1-9]/)));
	is_prepaid = is_prepaid||((prefix=='0926')&&(digits.match(/^7[0-5]/)));

	is_prepaid = is_prepaid||((prefix=='0927')&&(digits.match(/^[2-9]/)));

	// Touch Mobile

	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^1[3-7]/)));
	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^5[8-9]/)));
	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^[6-8]/)));
	is_prepaid = is_prepaid||((prefix=='0905')&&(digits.match(/^9[0-7]/)));

	is_prepaid = is_prepaid||((prefix=='0906')&&(digits.match(/^1/)));
	is_prepaid = is_prepaid||((prefix=='0906')&&(digits.match(/^[6-8]/)));
	is_prepaid = is_prepaid||((prefix=='0906')&&(digits.match(/^9[0-7]/)));

	is_prepaid = is_prepaid||((prefix=='0916')&&(digits.match(/^1/)));
	is_prepaid = is_prepaid||((prefix=='0916')&&(digits.match(/^8[2-9]/)));
	is_prepaid = is_prepaid||((prefix=='0916')&&(digits.match(/^9/)));

	is_prepaid = is_prepaid||((prefix=='0926')&&(digits.match(/^[1-9]/)));

	is_prepaid = is_prepaid||((prefix=='0935')&&(digits.match(/^[1-2]/)));
	is_prepaid = is_prepaid||((prefix=='0935')&&(digits.match(/^30/)));
	is_prepaid = is_prepaid||((prefix=='0935')&&(digits.match(/^8[6-9]/)));
	is_prepaid = is_prepaid||((prefix=='0935')&&(digits.match(/^9/)));
	is_prepaid = is_prepaid||((prefix=='0935')&&(digits.match(/^21/)));
	if(is_prepaid)
		return true;
	
	return false;
}

function submitMobtel(){
	prefix = $('#prefix').val();
	digits = $('#mobtelnum').val();
	// validate 7 digits
	is_valid = digits.match(/^\d{7}$/)!=null;
	if (!is_valid) { alert('Sorry! Please double-check your 7-digit mobile number.'); return; }
	 is_prepaidDigit = isPrepaid(prefix,digits);
	// submit
	var cellphone_number = prefix+digits;
	//alert(cellphone_number);
	$.post(
		'http://vme3.wyrls.net/gmusic/register.php',
		{
			"msisdn": cellphone_number
		},
		function(data) {
			localStorage.setItem("cellphone_number", cellphone_number);
			localStorage.setItem("is_prepaid", is_prepaidDigit);
			alert("Please Wait for Verification SMS");
			localStorage.setItem("code", data);
			$.mobile.changePage("#verifypage", { transition: "slide",reverse: false,
			changeHash: false } );
			//trackPageView(location.pathname +location.search +location.hash);
			
		}).error(function(request, status, error){
		    jsonError(request.responseText);
});
	
}

var isAnalyticsStarted = false;

/**
  * Initialize Google Analytics configuration
  * 
  * @param accountId			The Google Analytics account id 
  * @param successCallback	The success callback
  * @param failureCallback	The error callback
*/
function startAnalytics(){
	
	    //UA-34084107-1 My account lilagan@xyber.ph
	    //UA-34060489-1 GGateway account
	 window.plugins.analytics.start("UA-34084107-1", function(){
		   	//alert("Start: success");
		   	isAnalyticsStarted = true;
		   }, function(request, status, error){
		    jsonError(request.responseText);
		   	});
		 

	}

/**
 * Track a page view on Google Analytics
 * @param key/page			The name of the tracked item (can be a url or some logical name).
 * 							The key name will be presented in Google Analytics report.  
 * @param successCallback	The success callback
 * @param failureCallback	The error callback 
 */
   
function trackPageView(page){
	 if(!isAnalyticsStarted){
		 startAnalytics();
	 }
	   window.plugins.analytics.trackPageView(page, function(){
		
		   return true;
		   }, function(){
			   //failure to track page change
			   return false;
		   });
	
	}
/**
 * Track an event on Google Analytics
 * @param category			The name that you supply as a way to group objects that you want to track
 * @param action			The name the type of event or interaction you want to track for a particular web object
 * @param label				Provides additional information for events that you want to track (optional)
 * @param value				Assign a numerical value to a tracked page object (optional)
 */
function trackEvent(category,action,label,value){
	window.plugins.analytics.trackEvent(category, action, label, value,
			//success callback
			function(){return true;
			},
			//failure call back
			function(){
				//failure to track events
				return false;
				});
	}


function checkConnectivity2(){
    var networkState = navigator.network.connection.type;
    var states = {};
    isConnected = true;
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
   if(states[networkState] == "No network connection" || !states[networkState] || networkState == "unknown") 
   {
	   isConnected =false;
       alertDismissed();
    }
   return  isConnected;
}

function jsonError(errorMessage) {
    
   if(checkConnectivity2()) 
   {

	  //  alert("Oops - Something went wrong! Please try again."+errorMessage );
    }
    
}
function alertDismissed() {
	
    $.mobile.changePage("#no-connection", { transition: "slide", changeHash: false} );
    return true;
}

function showSubscribeDialog(songTitle,artistName,soid,sid,type,divTag){
   download_url = "http://dloadstation.com/wap2/Modules/SMSService/subscribe.php?soid="+soid+"&sid="+sid+"&domain=dloadstation.com&confirm=true"
  
  $("#le-modal #songTitle").text(songTitle);
   $("#le-modal #artistName").text(artistName);
   $("#le-modal #theType").text(type);
   //$("#le-modal #goLink").attr("href",download_url);
   category = "subscribe-"+type;
   action ="subscribe "+divTag;
  
   label="user downloads "+artistName+" 's"+songTitle;
   $("#le-modal #goLink").attr("onclick","submitSubscribe(artistName,songTitle,type);");
  
   $.mobile.changePage('#le-modal', {transition: 'slide', role: 'dialog'});
//   $("#le-modal #goLink").bind("click",submitSubscribe(artistName,songTitle,type,divTag,soid,sid));
}


var serviceOid;
var service_id;
var sub_artist;
var sub_song;
function submitSubscribe(artistName,songTitle,type){

	 subscribeContent(serviceOid,service_id,artistName,songTitle,type);
	   category = "subscribe-"+type;
	   action ="subscribe ";
	   label="user downloads "+artistName+" 's"+songTitle;
	  
	   closeDialog(category,action,label);
	  
}



function showDirectDialog(songTitle,artistName,contentid,divTag){
	  // download_url = "http://dloadstation.com/wap2/Main/freedownload.php?content_id="+contentid+"&service_id=flyawayartistapp";
	  
	   download_url ="http://globebbcurve.com/content/download/"+contentid;
	   $("#le-modal2 #songTitle1").text(songTitle);
	   $("#le-modal2 #artistName1").text(artistName);
	   $("#le-modal2 #leFeatured").attr("href",download_url);
	   category = "absolutely-free";
	   
	   action ="direct-download "+divTag;
	   label="user downloads "+artistName+" \'s "+songTitle;
	   $("#le-modal2 #leFeatured").attr("onclick","closeDialog(category, action, label);");
	   $.mobile.changePage('#le-modal2', {transition: 'slide', role: 'dialog'});
	
	 //locationUrl = datadirectory.fullPath.substring(7);
	 //  downloadContent(download_url,songTitle);
	 
	    	
	 
	}

function subscribeContent(soid, sid,artistName,songTitle,type){
  msisdn_val = localStorage.getItem("cellphone_number");
   $.post(
			
			'http://vme3.wyrls.net/gmusic/subscribegbeats.php',
			{
				"sid": sid,
				"soid": soid,
				"msisdn":msisdn_val
				
			}, function(data){
			
			    
			//console.log("are you empty"+data);
					 			
				if(data == 'ok'){
					   $("#le-modal3 #songTitle2").text(sub_song);
					   $("#le-modal3 #artistName2").text(sub_artist);
					   $("#le-modal3 #songType2").text(type);
					   $.mobile.changePage('#le-modal3', {transition: 'slide', role: 'dialog'});
        		}
				
	
			}).error(function(request, status, error){
				 alert("Signal is weak.Please Try again");
				
			});
}


/*
var locationUrl;

function downloadContent(url,filename) {
 
    filetoDownload =   filename.replace(/\s+/g, '-').toLowerCase();
    
  
	var fileTransfer = new FileTransfer();
  fileTransfer.download(
	url,
	locationUrl+"/"+filetoDownload+".dcf",
	function(entry){
	    console.log("success")
		alert("download complete");
	},
	function(error){
		alert("errorsource "+error.source);
		alert("errortarget"+error.target);
	}
  
  );
}
 datadirectory;
function gotFS(fileSystem) {
	   fileSystem.root.getDirectory("data-gbeats1", {create: true}, gotDir, fail_GD);   
	}

	function gotDir(dir) {
	//    console.log("got dir");
	    datadirectory = dir;
	  //  alert(datadirectory.fullPath);
	    // code for downloading/updating files goes here
	    // left out for brevity and lack of relevance at this point
	}

	function fail_FS(error){
	    fail(error,'requestFileSystem');
	}

	function fail_GD(error){
	    fail(error,'getDirectory');
	}

	function fail(error,call){
	    console.log("ERROR: "+call);
	    console.log(JSON.stringify(error));
	}




*/
function searchMusicEvent(){
    if ($('#searchfield').val()==''){
        $('#searchfield'). attr("placeholder","I'm looking for music...");
    }
        
    else {
        searchItem =  $('#searchfield').val();
        searchMusic(searchItem,"#searchresult_list");
        $('#searchfield').val("");
        $('#searchfield'). attr("placeholder","I'm looking for music...");
    }
}

function closeDialog(category, action, label) {
	trackEvent(category, action, label, 0);
	
	$(".ui-dialog").dialog("close");
//	window.plugins.childBrowser.getUrl();
}

