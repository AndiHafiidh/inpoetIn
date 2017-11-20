
var BASE_URL = "http://api.andihafiidh.net/data/";
var CDN_URL = "http://cdn.andihafiidh.net/";
var GMAPS = "https://maps.googleapis.com/maps/api/distancematrix/json?";

jQuery.loadScript = function (url, callback) {
	jQuery.ajax({
		url: url,
		dataType: 'script',
		success: callback,
		async: true
	});
}

$(document).ready(function(){	

	var in_prop = ".in-prop";
	var in_kot = ".in-kot";
	var in_kec = ".in-kec";
	var in_kel = ".in-kel";	
	
	var cls_origins = $(".in-origins");
	var cls_destinations = $(".in-destinations");
	var cls_prop = $(".in-prop");
	var cls_kot = $(".in-kot");
	var cls_kec = $(".in-kec");
	var cls_kel = $(".in-kel");	
	var cls_encrypt = $(".in-encrypt");	

	var out_prop = $(".out-prop");
	var out_kot = $(".out-kot");
	var out_kec = $(".out-kec");
	var out_kel = $(".out-kel");

	var in_search = $(".in-search");
	var out_search = $(".out-search");
	
	var form_distance = $(".in-form-distance");	
	var out_distance = $(".out-distance");

	function setDefaultMessage(){

		if (cls_prop.length) {
			cls_prop.append('<option disabled selected>Pilih salah satu</option>');	
		}
		
		if (cls_kot.length) {
			if (cls_prop.length) {
				cls_kot.append('<option disabled selected>Pilih provinsi dahulu</option>');		
			}else{
				cls_kot.append('<option disabled selected>Pilih salah satu</option>');		
			}
		}	

		if (cls_kec.length) {
			if (cls_kot.length) {
				cls_kec.append('<option disabled selected>Pilih kab/kota dahulu</option>');	
			}else{
				cls_kec.hide();
				console.error('.in-kot tidak ditemukan! untuk dapat menampilkan pilihan kecamatan, perlu adanya inputan kota');
			}
		}	

		if (cls_kel.length) {
			if (cls_kec.length && cls_kec.is(":visible")) {
				cls_kel.append('<option disabled selected>Pilih kecamatan dahulu</option>');				
			}else {
				cls_kel.hide();
				console.error('.in-kec tidak ditemukan! untuk dapat menampilkan pilihan kelurahan, perlu adanya inputan kecamatan');
			}
		}	
		
	}

	function setDefaultOption(){
		if (cls_prop.length) {		
			setOption(BASE_URL+"provinsi", cls_prop);			
		}else if (cls_kot.length){
			setOption(BASE_URL+"kota", cls_kot);			
		}

		cls_prop.change(function(){
			var parent = $(this).parent();
			var cls_kot = parent.find(in_kot);
			
			if (cls_kot.length) {
				cls_kot.removeAttr("data-id");
				setOption(BASE_URL+"kota/"+$(this).val(), cls_kot);	
			}	
		});

		cls_kot.change(function(){
			var parent = $(this).parent();
			var cls_kec = parent.find(in_kec);

			if (cls_kec.length) {
				cls_kec.removeAttr("data-id");
				setOption(BASE_URL+"kecamatan/"+$(this).val(), cls_kec);	
			}	
		});

		cls_kec.change(function(){
			var parent = $(this).parent();
			var cls_kel = parent.find(in_kel);
			
			if (cls_kel.length) {
				cls_kel.removeAttr("data-id");
				setOption(BASE_URL+"kelurahan/"+$(this).val(), cls_kel);									
			}
		});
	}

	function setSelectedData(){
		if (cls_prop.data('id') > 0) {						
			var id = cls_prop.data('id');
			setTimeout(function(){
				cls_prop.val(cls_prop.data('id'));
			}, 250);						

			if (cls_kot.length) {
				setOption(BASE_URL+"kota/"+id, cls_kot);	
			}	
		}
		
		if (cls_kot.data('id') > 0) {										
			var id = cls_kot.data('id');
			setTimeout(function(){
				cls_kot.val(cls_kot.data('id'));
			}, 500);						

			if (cls_kec.length) {
				setOption(BASE_URL+"kecamatan/"+id, cls_kec);	
			}
		}
		
		if (cls_kec.data('id') > 0) {	
			var id = cls_kec.data('id');
			setTimeout(function(){	
				cls_kec.val(cls_kec.data('id'));
			}, 500);						

			if (cls_kel.length) {
				setOption(BASE_URL+"kelurahan/"+id, cls_kel);									
			}
		}
		
		if (cls_kel.data('id') > 0) {			
			setTimeout(function(){		
				cls_kel.val(cls_kel.data('id'));
			}, 500);						
		}
	}

	function setTextData(){
		if (out_prop.length) {
			var id = out_prop.data('id');			
			setText(BASE_URL+"provinsi/"+id, out_prop);
		}

		if (out_kot.length) {
			var id = out_kot.data('id');			
			setText(BASE_URL+"kota/null/"+id, out_kot);
		}

		if (out_kec.length) {
			var id = out_kec.data('id');			
			setText(BASE_URL+"kecamatan/null/"+id, out_kec);
		}

		if (out_kel.length) {
			var id = out_kel.data('id');			
			setText(BASE_URL+"kelurahan/null/"+id, out_kel);
		}

	}

	function setMd5(){
		if (cls_encrypt.length) {				
			var parent = cls_encrypt.parent();			
			var cloning = cls_encrypt.clone().attr('type', 'hidden');			
			cls_encrypt.removeAttr("name");
			parent.prepend(cloning);

			$.loadScript(CDN_URL+'jquery.md5.js', function(){
				cls_encrypt.keyup(function(e){
					if (cls_encrypt.val().length != 0) {
						var md5 = $.md5(cls_encrypt.val());
						cloning.val(md5);	
					}else{
						cloning.val("");
					}					
				});	
			});		
		}
	}

	function countDistance(origins, destinations){
		var distance = 0;
		var url = encodeURI(BASE_URL+"distance/"+origins+"/"+destinations);

		JSONGetRequest(
			url,
			function(result){			
				var data = JSON.parse(result.data);

				console.log(JSON.stringify(data));		

				out_distance.val(data.rows[0].elements[0].distance.value);
			});
	}


	form_distance.submit(function(event){
		event.preventDefault();		
		var origins = cls_origins.find(in_kel+" option:selected").text()+","+cls_origins.find(in_kec+" option:selected").text()+","+cls_origins.find(in_kot+"option:selected").text();
		var destinations = cls_destinations.find(in_kel+" option:selected").text()+","+cls_destinations.find(in_kec+" option:selected").text()+","+cls_destinations.find(in_kot+" option:selected").text();
		countDistance(origins, destinations);
	});


	setDefaultMessage();
	setDefaultOption();
	setSelectedData();
	setTextData();
	setMd5();

});


function setOption(url, element, done){
	element.html("");
	element.append('<option disabled selected>Pilih salah satu</option>');
	JSONGetRequest(
		url,
		function(result){
			$.each(result.data, function (i, item) {
				element.append($('<option>', { 
					value: item.id,
					text : item.name 
				}));
			});			
		},done);
}

function setText(url, element){
	element.text("");	
	JSONGetRequest(
		url,
		function(result){			
			var nama = result.data[0].name;
			element.text(nama);
		});				
}


/* JSON Request */
function JSONGetRequest(url, success, done = null, error = null){	
	$.getJSON(url, { get_param: 'value' }, function(result) {		
		if (!result.IsError) {    
			success(result);
		}else{		
			if (error != null) {
				error();
			}else{
				alert("Terjadi Kesalahan.");				
			}									
		}
		// console.log(result);
	}).done(function(){		
		if (done != null) {
			done();	
		}		
	});
}

function JSONPostRequest(form, url, success, error = null){	
	$.ajax({
		type        : 'POST', 
		url         : url, 
		data        : form.serialize()
	}).done(function(result){
		//console.log(result);

		var data = JSON.parse(result);		
		if (!data.IsError) {    
			success(data);
		}else{			
			if (error == null) {
				alert("Terjadi Kesalahan.");
			}else{
				error();
			}		
		}		
	});
}




