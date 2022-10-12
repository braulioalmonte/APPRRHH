var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("cedula").value="";
	document.getElementById("nombre").value="";
	document.getElementById("fechaIngreso").value="";
	document.getElementById("departamento").value="";
	document.getElementById("puesto").value="";
	document.getElementById("salario").value="";
	document.getElementById("estado").value="";
	
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];
		$("#listaEmpleados").each(function(){
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
			var sql="DELETE FROM empleados WHERE id="+nuevoId+";"
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
		$("#listaEmpleados").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		document.getElementById("insertarEmpleado").style.visibility="hidden";
		document.getElementById("nombre").readOnly=false;
		document.getElementById("puesto").disabled=false;
		document.getElementById("departamento").readOnly=false;

		document.getElementById("cedula").value=lista[1];
		document.getElementById("nombre").value=lista[2];
		document.getElementById("fechaIngreso").value=lista[3];
		document.getElementById("departamento").value=lista[4];
		document.getElementById("puesto").value=lista[5];
		document.getElementById("salario").value=lista[6];
		document.getElementById("estado").value=lista[7];
		nuevoId=lista[0].substr(1);
})
}


$(function (){
// crear la tabla de candidato
$("#crearEmpleado").click(function(){
	db.transaction(function(transaction){
		var sql="CREATE TABLE empleados "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"cedula VARCHAR(13) UNIQUE NOT NULL, "+
		"nombre VARCHAR(50) NOT NULL," +
		"fechaIngreso DATE NOT NULL," +
		"departamento VARCHAR(100) NOT NULL,"+ 
		"puesto VARCHAR(100) NOT NULL,"+ 
		"salario INT NOT NULL,"+ 
		"estado VARCHAR(10) NOT NULL)";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	});

//Cargar la lista de candidatos
$("#listarEmpleado").click(function(){
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
}


function recibirDatosCandidato(){

	var cedula = localStorage.getItem("cedula");
	var nombre = localStorage.getItem("nombre");
	var puesto = localStorage.getItem("puesto");
	var departamento = localStorage.getItem("departamento");

	//alert(puesto);

	document.getElementById("cedula").value = cedula;
	document.getElementById("nombre").value = nombre;
	document.getElementById("puesto").value = puesto;
	document.getElementById("departamento").value = departamento;
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
window.addEventListener("load", recibirDatosCandidato);
window.addEventListener("load", cargarDatos);
window.addEventListener("load", cargarOpciones);

$("#exportarEmpleado").click(function(){
	ExportToExcel('xlsx');
})

function ExportToExcel(type, fn, dl) {
	var elt = document.getElementById('listaEmpleados');
	var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
	return dl ?
	  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
	  XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
 }

//Funcion para listar y pintar tabla de candidatos en la página web
function cargarDatos(){
	$("#listaEmpleados").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM empleados ORDER BY fechaIngreso DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaEmpleados").append('<tr><th>ID</th><th>Cedula</th><th>Nombre</th><th>Fecha Ingreso</th><th>Departamento</th><th>Puesto</th><th>Salario</th><th>Estado</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var cedula=row.cedula;
					var nombre=row.nombre;
					var fechaIngreso=row.fechaIngreso;
					var departamento=row.departamento;
					var puesto=row.puesto;
					var salario=row.salario;
					var estado=row.estado;
					var id =row.id;
					$("#listaEmpleados").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+
					cedula+'</span></td><td><span>'+
					nombre+'</span></td><td><span>'+
					fechaIngreso+'</span></td><td><span>'+
					departamento+'</span></td><td><span>'+
					puesto+'</span></td><td><span>'+
					salario+'</span></td><td><span>'+
					estado+'</span></td><td><span></span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5 2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 -1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button></td></tr>');
				}
			}else{
				$("#listaEmpleados").append('<tr><td colspan="5" align="center">No existen registros de empleados</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}


//insertar registros
$("#insertarEmpleado").click(function(){
		var cedula=$("#cedula").val();
		var nombre=$("#nombre").val();
		var fechaIngreso=$("#fechaIngreso").val();
		var departamento=$("#departamento").val();
		var puesto=$("#puesto").val();
		var salario=$("#salario").val();
		var estado=$("#estado").val();
		
			db.transaction(function(transaction){
			var sql="INSERT INTO empleados(cedula,nombre,fechaIngreso,departamento,puesto,salario,estado) VALUES(?,?,?,?,?,?,?)";
			transaction.executeSql(sql,[cedula,nombre,fechaIngreso,departamento,puesto,salario,estado],function(){			
			}, function(transaction, err){
				alert(err.message);
			})
		})
			limpiar();
			cargarDatos();
			window.location.reload();
	})

//Modificar un registro
$("#modificarEmpleado").click(function(){
	var ncedula=$("#cedula").val();
	var nnombre=$("#nombre").val();
	var nfechaIngreso=$("#fechaIngreso").val();
	var ndepartamento=$("#departamento").val();
	var npuesto=$("#puesto").val();
	var nsalario=$("#salario").val();
	var nestado=$("#estado").val();
	
	db.transaction(function(transaction){
		var sql="UPDATE empleados SET cedula='"+ncedula+"', nombre='"+nnombre+"', fechaIngreso='"+nfechaIngreso+"', departamento='"+ndepartamento+"', puesto='"+npuesto+"', salario='"+nsalario+"', estado='"+nestado+"', experiencias='"+nexperiencias+"', recomendacion='"+nrecomendacion+"' WHERE id="+nuevoId+";"
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
$("#borrarTodoEmpleado").click(function(){
	if(!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE empleados";
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
	
