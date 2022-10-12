var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("usuario").value="";
	document.getElementById("password").value="";
}


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
