<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="https://code.jquery.com/jquery-3.2.1.js"></script>     
	<script type="text/javascript" src="http://cdn.andihafiidh.net/inpoet-0.0.6.js"></script>
</head>
<body>
	<form action="" method="POST">
		<input type="password" name="password" class="in-encrypt">
		<input type="submit" name="simpan" value="Simpan">
	</form>  
</body>
</html>

<?php 

	if (isset($_POST['simpan'])) {
		echo $_POST['password'];
	}

?>