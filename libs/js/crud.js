var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("usuario").value="";
	document.getElementById("password").value="";
}

//Login
function validarUsuario(usuario, password){

	
}

$("#loginUsuario").click(function(){

	alert("click");
	/*var usuario = $("#usuario").val();
	var password = $("#password").val();

	db.transaction(function(transaction){
		var sql="SELECT * FROM usuarios where usuario='"+usuario+"' AND password='"+password+"';";
		transaction.executeSql(sql,undefined,function(transaction,result){
			if(result.rows.length){
				window.location.href = 'vistaIdiomas.html';
			}
			else{
				alert("Datos no válidos, por favor verificar");
			}
		})
	})*/
})



//Cargar la lista de productos
$("#listar").click(function(){
	cargarDatos();
})
