var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("empresa").value="";
	document.getElementById("puesto").value="";
	document.getElementById("fechaDesde").value="";
	document.getElementById("fechaHasta").value="";
	document.getElementById("salario").value="";
	
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaExperiencias").each(function(){
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
			var sql="DELETE FROM experiencias WHERE id="+nuevoId+";"
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
		$("#listaExperiencias").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		document.getElementById("insertarExperiencia").style.visibility="hidden";
		document.getElementById("empresa").value=lista[1];
		document.getElementById("puesto").value=lista[2];
		document.getElementById("fechaDesde").value=lista[3];
		document.getElementById("fechaHasta").value=lista[4];
		document.getElementById("salario").value=lista[5];
		nuevoId=lista[0].substr(1);
})
}


$(function (){
// crear la tabla de Experiencias Laborales
$("#crearExperiencia").click(function(){
	db.transaction(function(transaction){
		var sql="CREATE TABLE experiencias "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"empresa VARCHAR(100) NOT NULL, "+
		"puesto VARCHAR(100) NOT NULL," +
		"fechaDesde DATE NOT NULL," + 
		"fechaHasta DATE NOT NULL,"+ 
		"salario INT NOT NULL);";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	});

//Cargar la lista de Experiencias Laborales
$("#listarExperiencia").click(function(){
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



//Funcion para listar y pintar tabla de Experiencias Laborales en la página web
function cargarDatos(){
	$("#listaExperiencias").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM experiencias ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaExperiencias").append('<tr><th>ID</th><th>Empresa</th><th>puesto</th><th>Desde</th><th>Hasta</th><th>Salario</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var empresa=row.empresa;
					var puesto=row.puesto;
					var fechaDesde=row.fechaDesde;
					var fechaHasta=row.fechaHasta;
					var salario=row.salario;
					var id =row.id;
					$("#listaExperiencias").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+empresa+'</span></td><td><span>'+
					puesto+'</span></td><td><span>'+fechaDesde+'</span></td><td><span>'+fechaHasta+'</span></td><td><span>'+salario+'</span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaExperiencias").append('<tr><td colspan="5" align="center">No existen registros de Experiencas Laborales</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}

//insertar registros
$("#insertarExperiencia").click(function(){
	var empresa=$("#empresa").val();
	var puesto=$("#puesto").val();
	var fechaDesde=$("#fechaDesde").val();
	var fechaHasta=$("#fechaHasta").val();
	var salario=$("#salario").val();
	
		db.transaction(function(transaction){
		var sql="INSERT INTO experiencias(empresa,puesto,fechaDesde,fechaHasta,salario) VALUES(?,?,?,?,?)";
		transaction.executeSql(sql,[empresa,puesto,fechaDesde,fechaHasta,salario],function(){			
		}, function(transaction, err){
			alert(err.message);
		})
	})
		limpiar();
		cargarDatos();
		window.location.reload();
	})

//Modificar un registro
$("#modificarExperiencia").click(function(){
	var nexperiencia=$("#empresa").val();
	var npuesto=$("#puesto").val();
	var nfechaDesde=$("#fechaDesde").val();
	var nfechaHasta=$("#fechaHasta").val();
	var nsalario=$("#salario").val();
	
	db.transaction(function(transaction){
		var sql="UPDATE experiencias SET empresa='"+nexperiencia+"', puesto='"+npuesto+"', fechaDesde='"+nfechaDesde+"', fechaHasta='"+nfechaHasta+"', salario='"+nsalario+"' WHERE id="+nuevoId+";"
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
$("#borrarTodoExperiencia").click(function(){
	if(!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE experiencias";
		transaction.executeSql(sql,undefined,function(){
			alert("Tabla borrada satisfactoriamente, Por favor, actualice la página")
		}, function(transaction, err){
			alert(err.message);
		})
	})
})




})
	
