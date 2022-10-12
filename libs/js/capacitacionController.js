var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("capacitacion").value="";
	document.getElementById("nivel").value="";
	document.getElementById("fechaDesde").value="";
	document.getElementById("fechaHasta").value="";
	document.getElementById("institucion").value="";
	
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaCapacitaciones").each(function(){
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
			var sql="DELETE FROM capacitaciones WHERE id="+nuevoId+";"
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
		$("#listaCapacitaciones").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		document.getElementById("insertarCapacitacion").style.visibility="hidden";
		document.getElementById("capacitacion").value=lista[1];
		document.getElementById("nivel").value=lista[2];
		document.getElementById("fechaDesde").value=lista[3];
		document.getElementById("fechaHasta").value=lista[4];
		document.getElementById("institucion").value=lista[5];
		nuevoId=lista[0].substr(1);
})
}


$(function (){
// crear la tabla de capacitaciones
$("#crearCapacitacion").click(function(){
	db.transaction(function(transaction){
		var sql="CREATE TABLE capacitaciones "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"capacitacion VARCHAR(100) NOT NULL, "+
		"nivel VARCHAR(20) NOT NULL," +
		"fechaDesde DATE NOT NULL," + 
		"fechaHasta DATE NOT NULL,"+ 
		"institucion VARCHAR(50) NOT NULL)";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	});

//Cargar la lista de capacitaciones
$("#listarCapacitacion").click(function(){
	cargarDatos();
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

$("#fechaHasta").focusout(function(){
	var fechadesde = document.getElementById("fechaDesde").value;
	var fechahasta = document.getElementById("fechaHasta").value;

	if(fechadesde > fechahasta){
		alert("Fecha Invalida");
		
		document.getElementById("fechaHasta").value = fechadesde;
	}
})

//Funcion para listar y pintar tabla de capacitaciones en la página web
function cargarDatos(){
	$("#listaCapacitaciones").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM capacitaciones ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaCapacitaciones").append('<tr><th>ID</th><th>Capacitacion</th><th>Nivel</th><th>Desde</th><th>Hasta</th><th>Institución</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var capacitacion=row.capacitacion;
					var nivel=row.nivel;
					var fechaDesde=row.fechaDesde;
					var fechaHasta=row.fechaHasta;
					var institucion=row.institucion;
					var id =row.id;
					$("#listaCapacitaciones").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+capacitacion+'</span></td><td><span>'+
					nivel+'</span></td><td><span>'+fechaDesde+'</span></td><td><span>'+fechaHasta+'</span></td><td><span>'+institucion+'</span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaCapacitaciones").append('<tr><td colspan="5" align="center">No existen registros de capacitaciones</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}

//insertar registros
$("#insertarCapacitacion").click(function(){
	var capacitacion=$("#capacitacion").val();
	var nivel=$("#nivel").val();
	var fechaDesde=$("#fechaDesde").val();
	var fechaHasta=$("#fechaHasta").val();
	var institucion=$("#institucion").val();
	
		db.transaction(function(transaction){
		var sql="INSERT INTO capacitaciones(capacitacion,nivel,fechaDesde,fechaHasta,institucion) VALUES(?,?,?,?,?)";
		transaction.executeSql(sql,[capacitacion,nivel,fechaDesde,fechaHasta,institucion],function(){			
		}, function(transaction, err){
			alert(err.message);
		})
	})
		limpiar();
		cargarDatos();
		window.location.reload();
	})

//Modificar un registro
$("#modificarCapacitacion").click(function(){
	var ncapacitacion=$("#capacitacion").val();
	var nnivel=$("#nivel").val();
	var nfechaDesde=$("#fechaDesde").val();
	var nfechaHasta=$("#fechaHasta").val();
	var ninstitucion=$("#institucion").val();
	
	db.transaction(function(transaction){
		var sql="UPDATE capacitaciones SET capacitacion='"+ncapacitacion+"', nivel='"+nnivel+"', fechaDesde='"+nfechaDesde+"', fechaHasta='"+nfechaHasta+"', institucion='"+ninstitucion+"' WHERE id="+nuevoId+";"
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
$("#borrarTodoCapacitacion").click(function(){
	if(!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE capacitaciones";
		transaction.executeSql(sql,undefined,function(){
			alert("Tabla borrada satisfactoriamente, Por favor, actualice la página")
		}, function(transaction, err){
			alert(err.message);
		})
	})
})




})
	
