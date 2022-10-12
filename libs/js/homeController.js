var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("usuario").value="";
	document.getElementById("password").value="";
}

	var usuario = $("#usuario").val();
	var password = $("#password").val();


$(document).ready(function(){
	$("#loginUsuario").click(function(){
	
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
		})
	});
})

function verificarRolUsuario(){

	var rol = localStorage.getItem("rol");

	if(rol=="candidato"){
		$(".rrhh").hide();
	}

	else{
		$(".rrhh").show();
	}
	
}

window.addEventListener("load",verificarRolUsuario);

//Cargar la lista de productos
$("#listar").click(function(){
	cargarDatos();
})
