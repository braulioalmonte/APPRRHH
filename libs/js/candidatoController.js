var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("cedula").value="";
	document.getElementById("nombre").value="";
	document.getElementById("puesto").value="";
	document.getElementById("departamento").value="";
	document.getElementById("salario").value="";
	document.getElementById("competencias").value="";
	document.getElementById("capacitaciones").value="";
	document.getElementById("experiencias").value="";
	document.getElementById("recomendacion").value="";
	
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaCandidatos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span.mid');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});

		var rol = localStorage.getItem("rol");

	if(rol=="candidato"){
		alert("No tiene permisos para esta función");
	}

	else{
		nuevoId=lista[0].substr(1);
		//alert(nuevoId);
		db.transaction(function(transaction){
			var sql="DELETE FROM candidatos WHERE id="+nuevoId+";"
			transaction.executeSql(sql,undefined,function(){
				window.location.reload();
			}, function(transaction, err){
				alert(err.message);
			})
		})
	}

		
	});
}



//Editar registro
function editar(){
		$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaCandidatos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});

		var rol = localStorage.getItem("rol");

	if(rol=="candidato"){
		alert("No tiene permisos para esta función");
	}

	else{
		document.getElementById("insertarCandidato").style.visibility="hidden";
		document.getElementById("cedula").value=lista[1];
		document.getElementById("nombre").value=lista[2];
		document.getElementById("puesto").value=lista[3];
		document.getElementById("departamento").value=lista[4];
		document.getElementById("salario").value=lista[5];
		document.getElementById("competencias").value=lista[6];
		document.getElementById("capacitaciones").value=lista[7];
		document.getElementById("experiencias").value=lista[8];
		document.getElementById("recomendacion").value=lista[9];
		nuevoId=lista[0].substr(1);
	}


		
})
}

function convertirEmpleado(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaCandidatos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});

	var rol = localStorage.getItem("rol");

	if(rol=="candidato"){
		alert("No tiene permisos para esta función");
	}

	else{
		document.getElementById("cedula").value=lista[1];
		document.getElementById("nombre").value=lista[2];
		document.getElementById("puesto").value=lista[3];
		document.getElementById("departamento").value=lista[4];

		localStorage.setItem("cedula", lista[1]);
		localStorage.setItem("nombre", lista[2]);
		localStorage.setItem("puesto", lista[3]);
		localStorage.setItem("departamento", lista[4]);

	window.location.href = 'vistaEmpleados.html';
	}

	return false;
})
}

$(function (){
// crear la tabla de candidato
$("#crearCandidato").click(function(){
	db.transaction(function(transaction){
		var sql="CREATE TABLE candidatos "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"cedula VARCHAR(13) UNIQUE NOT NULL, "+
		"nombre VARCHAR(50) NOT NULL," +
		"puesto VARCHAR(100) NOT NULL," +
		"departamento VARCHAR(100) NOT NULL,"+ 
		"salario INT NOT NULL,"+ 
		"competencias VARCHAR(100) NOT NULL,"+ 
		"capacitaciones VARCHAR(100) NOT NULL,"+ 
		"experiencias VARCHAR(100) NOT NULL,"+ 
		"recomendacion VARCHAR(50) NOT NULL)";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	});


//Cargar la lista de candidatos
$("#listarCandidato").click(function(){
	cargarDatos();
})


function cargarOpciones(){
	$("puesto").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT puesto FROM puestos where estado='Activo'";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var puesto=row.puesto;
					$("#puesto").append('<option value="'+puesto+'">'+puesto+'</option>')
				}
			}
			else{
				$("#puesto").append('<option value="nada">No hay puestos disponibles<option>')
			}
			
		})
	})

	$("competencias").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT competencia FROM competencias where estado='Activo'";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var competencia=row.competencia;
					$("#competencias").append('<option value="'+competencia+'">'+competencia+'</option>')
				}
			}
			else{
				$("#competencias").append('<option value="nada">No hay puestos disponibles<option>')
			}
		})
	})

	$("capacitaciones").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT capacitacion FROM capacitaciones;";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var capacitacion=row.capacitacion;
					$("#capacitaciones").append('<option value="'+capacitacion+'">'+capacitacion+'</option>')
				}
			}
			else{
				$("#capacitaciones").append('<option value="nada">No hay puestos disponibles<option>')
			}
		})
	})

	$("experiencias").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT puesto FROM experiencias;";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var puesto=row.puesto;
					$("#experiencias").append('<option value="'+puesto+'">'+puesto+'</option>')
				}
			}
			else{
				$("#experiencias").append('<option value="nada">No hay puestos disponibles<option>')
			}
		})
	})

}

$("#cedula").focusout(function(){

	cedula1 = document.getElementById("cedula").value;

	if(validar_cedula(cedula1))
	{

	}

	else{
		alert("Cédula Invalida");
		document.getElementById("cedula").value = "";
	}

})


function verificarRolUsuario(){

	var rol = localStorage.getItem("rol");

	if(rol=="candidato"){
		$(".rrhh").hide();
		$(".btn-warning").hide();
	}

	else{
		$(".rrhh").show();
	}
	
}

window.addEventListener("load",verificarRolUsuario);
window.addEventListener("load", cargarDatos);
window.addEventListener("load", cargarOpciones);

$("#buscarCandidato").change(function(){
	var valor=$("#buscarCandidato").val();

	$("#listaCandidatos").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM candidatos where cedula like '%"+valor+
		"%' OR nombre like '%"+valor+
		"%' OR puesto like '%"+valor+
		"%' OR departamento like '%"+valor+
		"%' OR salario like '%"+valor+
		"%' OR competencias like '%"+valor+
		"%' OR capacitaciones like '%"+valor+
		"%' OR experiencias like '%"+valor+
		"%' OR recomendacion like '%"+valor+"%' ORDER BY id;";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaCandidatos").append('<tr><th>ID</th><th>Cedula</th><th>Nombre</th><th>Puesto</th><th>Departamento</th><th>Salario que aspira</th><th>Competencias</th><th>Capacitaciones</th><th>Experiencias</th><th>Recomendado por</th><th></th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var cedula=row.cedula;
					var nombre=row.nombre;
					var puesto=row.puesto;
					var departamento=row.departamento;
					var salario=row.salario;
					var competencias=row.competencias;
					var capacitaciones=row.capacitaciones;
					var experiencias=row.experiencias;
					var recomendacion=row.recomendacion;
					var id =row.id;
					$("#listaCandidatos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+
					cedula+'</span></td><td><span>'+
					nombre+'</span></td><td><span>'+
					puesto+'</span></td><td><span>'+
					departamento+'</span></td><td><span>'+
					salario+'</span></td><td><span>'+
					competencias+'</span></td><td><span>'+
					capacitaciones+'</span></td><td><span>'+
					experiencias+'</span></td><td><span>'+
					recomendacion+'</span></td><td><button type="button" id="A'+id+'" class="btn btn-warning" onclick="convertirEmpleado()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg></td><td><button type="button" id="A'+id+'" class="btn btn-success rrhh" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger rrhh" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaCandidatos").append('<tr><td colspan="5" align="center">No existen registros de candidatos</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})

})

//Funcion para listar y pintar tabla de candidatos en la página web
function cargarDatos(){
	$("#listaCandidatos").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM candidatos ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaCandidatos").append('<tr><th>ID</th><th>Cedula</th><th>Nombre</th><th>Puesto</th><th>Departamento</th><th>Salario que aspira</th><th>Competencias</th><th>Capacitaciones</th><th>Experiencias</th><th>Recomendado por</th><th></th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var cedula=row.cedula;
					var nombre=row.nombre;
					var puesto=row.puesto;
					var departamento=row.departamento;
					var salario=row.salario;
					var competencias=row.competencias;
					var capacitaciones=row.capacitaciones;
					var experiencias=row.experiencias;
					var recomendacion=row.recomendacion;
					var id =row.id;
					$("#listaCandidatos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+
					cedula+'</span></td><td><span>'+
					nombre+'</span></td><td><span>'+
					puesto+'</span></td><td><span>'+
					departamento+'</span></td><td><span>'+
					salario+'</span></td><td><span>'+
					competencias+'</span></td><td><span>'+
					capacitaciones+'</span></td><td><span>'+
					experiencias+'</span></td><td><span>'+
					recomendacion+'</span></td><td><button type="button" id="A'+id+'" class="btn btn-warning" onclick="convertirEmpleado()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg></td><td><button type="button" id="A'+id+'" class="btn btn-success rrhh" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger rrhh" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaCandidatos").append('<tr><td colspan="5" align="center">No existen registros de candidatos</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}

//insertar registros
$("#insertarCandidato").click(function(){
	
		var cedula=$("#cedula").val();
		var nombre=$("#nombre").val();
		var puesto=$("#puesto").val();
		var departamento=$("#departamento").val();
		var salario=$("#salario").val();
		var competencias=$("#competencias").val();
		var capacitaciones=$("#capacitaciones").val();
		var experiencias=$("#experiencias").val();
		var recomendacion=$("#recomendacion").val();
		
			db.transaction(function(transaction){
			var sql="INSERT INTO candidatos(cedula,nombre,puesto,departamento,salario,competencias,capacitaciones,experiencias,recomendacion) VALUES(?,?,?,?,?,?,?,?,?)";
			transaction.executeSql(sql,[cedula,nombre,puesto,departamento,salario,competencias,capacitaciones,experiencias,recomendacion],function(){			
			}, function(transaction, err){
				alert(err.message);
			})
		})
			limpiar();
			cargarDatos();
			window.location.reload();
	})

//Modificar un registro
$("#modificarCandidato").click(function(){
	var ncedula=$("#cedula").val();
	var nnombre=$("#nombre").val();
	var npuesto=$("#puesto").val();
	var ndepartamento=$("#departamento").val();
	var nsalario=$("#salario").val();
	var ncompetencias=$("#competencias").val();
	var ncapacitaciones=$("#capacitaciones").val();
	var nexperiencias=$("#experiencias").val();
	var nrecomendacion=$("#recomendacion").val();
	
	db.transaction(function(transaction){
		var sql="UPDATE candidatos SET cedula='"+ncedula+"', nombre='"+nnombre+"', puesto='"+npuesto+"', departamento='"+ndepartamento+"', salario='"+nsalario+"', competencias='"+ncompetencias+"', capacitaciones='"+ncapacitaciones+"', experiencias='"+nexperiencias+"', recomendacion='"+nrecomendacion+"' WHERE id="+nuevoId+";"
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
$("#borrarTodoCandidato").click(function(){
	if(!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE candidatos";
		transaction.executeSql(sql,undefined,function(){
			alert("Tabla borrada satisfactoriamente, Por favor, actualice la página")
		}, function(transaction, err){
			alert(err.message);
		})
	})
})

function validar_cedula(cedula){
	if (typeof cedula !="string") return false
	
	//cleanup
	cedula = cedula.replace(/-/g, "");
	
	// La cédula debe tener 11 dígitos
	if (cedula.length != 11) return false
	
	// Validar serie
	if (parseInt(cedula.substring(0, 3)) != 402 && parseInt(cedula.substring(0, 3)) > 121 && parseInt(cedula.substring(0, 3)) < 1) return false
	  
	var suma = 0
	var verificador = 0
	
	for (var i = 0; i < cedula.length; i++){
	  let n = cedula.charAt(i);
	  //No ejecutar el ultimo digito
	  if( i == (cedula.length)-1)  break;
	  
	  // Los dígitos pares valen 2 y los impares 1
	  let multiplicador = (parseInt(i) % 2) == 0 ? 1 : 2;
	  
	  // Se multiplica cada dígito por su paridad
	  let digito = parseInt(n)*parseInt(multiplicador)
	  
	  // Si la multiplicación da de dos dígitos, se suman entre sí
	  digito = digito>9 ? [...digito.toString()].map(e=>parseInt(e)).reduce((a,b)=>a+b) : digito;
  
	  // Se va haciendo la acumulación de esa suma
	  suma = suma + digito
	}
	// Al final se obtiene el verificador con la siguiente fórmula
	verificador = (10 - (suma % 10) ) % 10
  
	// Se comprueba el verificador
	return (verificador == parseInt(cedula.slice(-1)))
  }



})
	
