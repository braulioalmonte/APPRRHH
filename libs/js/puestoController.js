var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("puesto").value="";
	document.getElementById("nivelRiesgo").value="";
	document.getElementById("salarioMinimo").value="";
	document.getElementById("salarioMaximo").value="";
	document.getElementById("estado").value="";
	
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaPuestos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span.mid');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		nuevoId=lista[0].substr(1);
		//alert(nuevoId);
		db.transaction(function(transaction){
			var sql="DELETE FROM puestos WHERE id="+nuevoId+";"
			transaction.executeSql(sql,undefined,function(){
				window.location.reload();
			}, function(transaction, err){
				alert(err.message);
			})
		})
	});
}



//Editar registro
function editar(){
		$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaPuestos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		document.getElementById("insertarPuesto").style.visibility="hidden";
		document.getElementById("puesto").value=lista[1];
		document.getElementById("nivelRiesgo").value=lista[2];
		document.getElementById("salarioMinimo").value=lista[3];
		document.getElementById("salarioMaximo").value=lista[4];
		document.getElementById("estado").value=lista[5];
		nuevoId=lista[0].substr(1);
})
}


$(function (){
// crear la tabla de puestos
$("#crearPuesto").click(function(){
	db.transaction(function(transaction){
		var sql="CREATE TABLE puestos "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"puesto VARCHAR(100) NOT NULL, "+
		"nivelRiesgo VARCHAR(20) NOT NULL," +
		"salarioMinimo INT NOT NULL," + 
		"salarioMaximo INT NOT NULL,"+ 
		"estado VARCHAR(10) NOT NULL)";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	});

//Cargar la lista de puestos
$("#listarPuesto").click(function(){
	cargarDatos();
})

$(document).ready(function(){
	$("#loginUsuario").click(function(){
	
		var usuario = $("#usuario").val();
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

window.addEventListener("load", cargarDatos);

$("#salarioMaximo").focusout(function(){
	var salarioMinimo = document.getElementById("salarioMinimo").value;
	var salarioMaximo = document.getElementById("salarioMaximo").value;

	if(salarioMinimo > salarioMaximo){
		alert("Salario Minimo no puede ser mayor a salario máximo");
		
		document.getElementById("salarioMaximo").value = salarioMinimo;
	}
})

//Funcion para listar y pintar tabla de puestos en la página web
function cargarDatos(){
	$("#listaPuestos").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM puestos ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaPuestos").append('<tr><th>ID</th><th>Puesto</th><th>Nivel Riesgo</th><th>Salario Minimo</th><th>Salario Maximo</th><th>Estado</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var puesto=row.puesto;
					var nivelRiesgo=row.nivelRiesgo;
					var salarioMinimo=row.salarioMinimo;
					var salarioMaximo=row.salarioMaximo;
					var estado=row.estado;
					var id =row.id;
					$("#listaPuestos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+puesto+'</span></td><td><span>'+
					nivelRiesgo+'</span></td><td><span>'+salarioMinimo+'</span></td><td><span>'+salarioMaximo+'</span></td><td><span>'+estado+'</span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaPuestos").append('<tr><td colspan="5" align="center">No existen registros de puestos</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}

//insertar registros
$("#insertarPuesto").click(function(){
	var puesto=$("#puesto").val();
	var nivelRiesgo=$("#nivelRiesgo").val();
	var salarioMinimo=$("#salarioMinimo").val();
	var salarioMaximo=$("#salarioMaximo").val();
	var estado=$("#estado").val();
	
		db.transaction(function(transaction){
		var sql="INSERT INTO puestos(puesto,nivelRiesgo,salarioMinimo,salarioMaximo,estado) VALUES(?,?,?,?,?)";
		transaction.executeSql(sql,[puesto,nivelRiesgo,salarioMinimo,salarioMaximo,estado],function(){			
		}, function(transaction, err){
			alert(err.message);
		})
	})
		limpiar();
		cargarDatos();
		window.location.reload();
	})

//Modificar un registro
$("#modificarPuesto").click(function(){
	var npuesto=$("#puesto").val();
	var nnivelRiesgo=$("#nivelRiesgo").val();
	var nsalarioMinimo=$("#salarioMinimo").val();
	var nsalarioMaximo=$("#salarioMaximo").val();
	var nestado=$("#estado").val();
	
	db.transaction(function(transaction){
		var sql="UPDATE puestos SET puesto='"+npuesto+"', nivelRiesgo='"+nnivelRiesgo+"', salarioMinimo='"+nsalarioMinimo+"', salarioMaximo='"+nsalarioMaximo+"', estado='"+nestado+"' WHERE id="+nuevoId+";"
		transaction.executeSql(sql,undefined,function(){
			cargarDatos();
			limpiar();
			window.location.reload();
		}, function(transaction, err){
			alert(err.message)
		})
	})
})

// Para borrar toda la lista de Registros
$("#borrarTodoPuesto").click(function(){
	if(!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE puestos";
		transaction.executeSql(sql,undefined,function(){
			alert("Tabla borrada satisfactoriamente, Por favor, actualice la página")
		}, function(transaction, err){
			alert(err.message);
		})
	})
})




})
	
