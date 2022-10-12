var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("usuario").value="";
	document.getElementById("password").value="";
}

	var usuario = $("#usuario").val();
	var password = $("#password").val();

//Login
function validarUsuario(usuario, password){

}

//Comentario para despues: Usar el localStorage para verificar que el mismo usuario está navegando todas las paginas

$(document).ready(function(){
	$("#loginUsuario").click(function(){
	
		var usuario = $("#usuario").val();
		var password = $("#password").val();
		
	
		db.transaction(function(transaction){
			var sql="SELECT * FROM usuarios where usuario='"+usuario+"' AND password='"+password+"';";
			transaction.executeSql(sql,undefined,function(transaction,result){
				if(result.rows.length){
					db.transaction(function(transaction){
						var row=result.rows.item(0);
						var usuario=row.usuario;
						var rol=row.rol;
						localStorage.setItem("usuario", usuario);
						localStorage.setItem("rol", rol);
						localStorage.setItem("departamento","");
						localStorage.setItem("cedula","");
						localStorage.setItem("nombre","");
						localStorage.setItem("puesto","");
						
						window.location.href = 'home.html';
					})
					
				}
				else{
					alert("Datos no válidos, por favor verificar");
				}
			})
		})
	});
})

//Cargar la lista de productos
$("#listar").click(function(){
	cargarDatos();
})
