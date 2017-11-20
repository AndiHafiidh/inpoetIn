
var BASE_URL = "http://api.inpoet.in/data/";

$(document).ready(function(){	

	var cls_prop = $(".in-prop");
	var cls_kot = $(".in-kot");
	var cls_kec = $(".in-kec");
	var cls_kel = $(".in-kel");	

	var out_prop = $(".out-prop");
	var out_kot = $(".out-kot");
	var out_kec = $(".out-kec");
	var out_kel = $(".out-kel");

	var in_search = $(".in-search");
	

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
			cls_kot.removeAttr("data-id");
			if (cls_kot.length) {
				setOption(BASE_URL+"kota/"+$(this).val(), cls_kot);	
			}	
		});

		cls_kot.change(function(){
			cls_kec.removeAttr("data-id");
			if (cls_kec.length) {
				setOption(BASE_URL+"kecamatan/"+$(this).val(), cls_kec);	
			}	
		});

		cls_kec.change(function(){
			cls_kel.removeAttr("data-id");
			if (cls_kel.length) {
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

	setDefaultMessage();
	setDefaultOption();
	setSelectedData();
	setTextData();

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

