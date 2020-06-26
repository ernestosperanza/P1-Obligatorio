/* Realizado por: Christian Fortunato(173958) y Ernesto Speranza(198426) --> */

window.addEventListener("load", main);


let sistema = new Sistema([], []);


// Definir los listener de los botones
function main() {

    // Botones - Personas
    document.getElementById("personas-registro-btn").addEventListener("click", registroPersonas);
    // Botones - Compras
    document.getElementById("compras-registro-btn").addEventListener("click", agregarCompra);
    document.getElementById("compras-reintegros-form-btn").addEventListener("click", reintegroCompra);
    document.getElementById("orden-numero").addEventListener("click", ordenarTabla);
    document.getElementById("orden-nombre").addEventListener("click", ordenarTabla);
    // Botones - Consultas
    document.getElementById("consultar-totales-btn").addEventListener("click", consultarTotales);
    document.getElementById("consultar-compras-btn").addEventListener("click", consultarCompras);
    document.getElementById("graficar-btn").addEventListener("click", graficarDatos);


    // TODO: Borrar esto cuando este el objeto compra implementado
    // Dummy data de compras
    sistema.agregarCompraSistema(new Compra(1, 'Victoria Alvariza', 'Café especial con leche y con azúcar', 990, ['Ana Vega', 'Fernando García', 'Roberto López'], 'reintegrada'));
    sistema.agregarCompraSistema(new Compra(2, 'Ana Vega', 'Ensaladas común y condimentos', 450, ['Ana Vega', 'Victoria Alvariza'], 'pendiente'));
    sistema.agregarCompraSistema(new Compra(3, 'Ana Vega', 'Sopas', 300, ['Fernando García', 'Roberto López', 'Victoria Alvariza'], 'pendiente'));
    sistema.agregarCompraSistema(new Compra(4, 'Ana Vega', 'Sopas', 520, ['Fernando García', 'Roberto López', 'Victoria Alvariza'], 'pendiente'));
    sistema.agregarCompraSistema(new Compra(5, 'Ana Vega', 'Sopas', 550, ['Fernando García', 'Roberto López', 'Victoria Alvariza'], 'pendiente'));
    sistema.agregarCompraSistema(new Compra(6, 'Ana Vega', 'Sopas', 555, ['Fernando García', 'Roberto López', 'Victoria Alvariza'], 'pendiente'));

    // Dummy data de usuarios
    sistema.agregarPersonaSistema(new Persona('Ana Vega', 1, 'anavega@compras.com'));
    sistema.agregarPersonaSistema(new Persona('Victoria Alvariza', 2, 'valvariza@compras.com'));
    sistema.agregarPersonaSistema(new Persona('Fernando García', 1, 'fgarcia@compras.com'));
    sistema.agregarPersonaSistema(new Persona('Roberto López', 2, 'rlopez@compras.com'));

    // Hacer update UI
    agregarAlDomCompras();
    agregarAlDomPersonas();
}


/*----------------------------------------------------------------------------*/
/*------------------------------ Controlador ---------------------------------*/
/*----------------------------------------------------------------------------*/

function registroPersonas() {


    let datosPersona = obtenerInputForm('personas-registro-form');
    let personaEsValida = crearPersona(datosPersona);

    if (personaEsValida) {
        // Agregar los datos al DOM
        agregarAlDomPersonas();
        document.getElementById('personas-registro-form').reset();
    }
}


function agregarCompra() {

    let datosCompras = [];

    datosCompras[0] = obtenerInputElemento('comprador-select');
    datosCompras[1] = obtenerInputElemento('descripcion-compra');
    datosCompras[2] = obtenerInputElemento('monto-compra');

    let checkbox = document.getElementById('comprador-checkbox').getElementsByTagName('input');
    let participantesCompra = verificarCheckbox(checkbox);

    if (participantesCompra) {

        let compra = crearCompra(datosCompras, participantesCompra);

        if (compra) {

            agregarAlDomCompras();
            document.getElementById("compras-registro-form").reset();
        }
    }
}


function reintegroCompra() {

    let id = parseInt(obtenerInput("compras-reintegros"));
    reintegrarPorID(id);

    agregarAlDomCompras();
}


function ordenarTabla() {

    agregarAlDomCompras();
}


function consultarTotales() {

    let persona = obtenerInput("pagos-cobros");
    let [sumaParticipacion, sumaResponsable] = sistema.pagosCobrosPendientes(persona);

    let participacion = document.getElementById("sumaParticipacion");
    participacion.innerHTML = `Participación en total por $${sumaParticipacion}`;
    let responsable = document.getElementById("sumaResponsable");
    responsable.innerHTML = `Responsable de compras por $${sumaResponsable}`;
}


function consultarCompras() {

    let keyword = obtenerInputElemento("busqueda-compras");

    if (keyword.reportValidity()) {
        keyword = keyword.value.toLowerCase();

        // Buscar los datos en las compras
        let resultado = sistema.buscarComprasPorKeyword(keyword);

        agregarAlDomResultado(resultado, keyword);
    }
}


function graficarDatos() {

    window.addEventListener("resize", drawChart);
    
    google.charts.setOnLoadCallback(drawChart);
    drawChart();
}


/*----------------------------------------------------------------------------*/
/*---------------------- Manipulación del DOM | UI ---------------------------*/
/*----------------------------------------------------------------------------*/

function obtenerInput(inputID) {
    return document.getElementById(inputID).value;
}


function obtenerInputElemento(inputID) {
    return document.getElementById(inputID);
}


function obtenerInputForm(formID) {

    let form = document.getElementById(formID).elements;
    let input = [];
    for (let i = 0; i < form.length - 1; i++) {
        input.push(form[i]);
    }
    return input;
}


function obtenerRadioInput(radioName) {

    let elemento = document.getElementsByName(radioName);
    let input = '';

    for (i = 0; i < elemento.length; i++) {
        if (elemento[i].checked) {
            return input = elemento[i].value;
        }
    }
}


function agregarAlDom(destino, tipoDeElemento, contenido) {

    let elementoPadre = document.getElementById(destino);
    let elemento = document.createElement(tipoDeElemento);
    let texto = document.createTextNode(contenido);
    elemento.appendChild(texto);
    elementoPadre.appendChild(elemento);
}


function agregarAlDomCheckbox(destino, contenido) {

    let elementoPadre = document.getElementById(destino);
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${contenido}-checkbox`;
    checkbox.value = contenido;
    checkbox.required = true;
    let label = document.createElement("label");
    label.innerHTML = contenido;
    let br = document.createElement("br");
    elementoPadre.appendChild(checkbox);
    elementoPadre.appendChild(label);
    elementoPadre.appendChild(br);
}


function agregarAlDomPersonas() {

    let personas = sistema.personas;

    // Borrar todo antes de actualizar
    document.getElementById('personas-visualizacion').innerHTML = '';
    document.getElementById('comprador-select').innerHTML = '';
    document.getElementById('comprador-checkbox').innerHTML = '';
    document.getElementById('pagos-cobros').innerHTML = '';

    // Agregar todas las personas salvadas a la UI
    for (let i = 0; i < personas.length; i++) {
        let persona = personas[i];
        let contenido = `${persona.nombre} - ${persona.seccion} - ${persona.mail}`;
        agregarAlDom('personas-visualizacion', 'li', contenido);
        agregarAlDom('comprador-select', 'option', persona.nombre);
        agregarAlDomCheckbox('comprador-checkbox', persona.nombre);
        agregarAlDom('pagos-cobros', 'option', persona.nombre);
    }
}


function agregarAlDomCompras() {

    let compras = sistema.compras;
    let orden = obtenerRadioInput('orden-tabla-reintegro');

    agregarAlDomComprasTabla(compras, orden);
    agregarAlDomComprasReintegro(compras);
}


function agregarAlDomComprasReintegro(compras) {

    document.getElementById('compras-reintegros').innerHTML = '';

    for (let i = 0; i < compras.length; i++) {

        let compra = compras[i];

        if (compra.estado === "pendiente") {
            agregarAlDom('compras-reintegros', 'option', compra.id);
        }
    }
}


function agregarAlDomComprasTabla(compras, orden) {

    let tabla = document.getElementById("compras-reintegros-tabla");
    tabla.innerHTML = '';

    let header = tabla.createTHead();
    header.innerHTML = "<th>NUMERO</th><th>RESPONSABLE</th><th>DESCRIPCION</th><th>MONTO</th><th>PARTICIPANTES</th><th>ESTADO</th>";

    if (orden === 'nombre') {

        compras = compras.sort(ordenarPersonas);
    } else {
        compras = compras.sort(ordenarId);
    }

    for (let i = 0; i < compras.length; i++) {

        let compra = compras[i];
        let index = tabla.rows.length;
        let fila = tabla.insertRow(index);
        let column;
        let contenido = compra;
        contenido = Object.values(contenido);

        for (let j = 0; j < contenido.length; j++) {
            column = fila.insertCell(j);
            column.innerHTML = contenido[j];
        }
    }
}


function agregarAlDomResultado(resultado, keyword) {

    // Exponer esos datos en la pagina
    let lista = document.getElementById("busqueda-compras-lista");
    lista.innerHTML = '';

    for (let i = 0; i < resultado.length; i++) {

        let descripcion = resultado[i].descripcion;
        let descripcionLow = resultado[i].descripcion.toLowerCase();
        let indexPrimeraOcurrencia = descripcionLow.indexOf(keyword);
        let finalPrimeraOcurrencia = (indexPrimeraOcurrencia + keyword.length);

        let primerSlice = descripcion.slice(0, indexPrimeraOcurrencia);
        let segundoSlice = descripcion.slice(indexPrimeraOcurrencia, finalPrimeraOcurrencia);
        let tercerSlice = descripcion.slice(finalPrimeraOcurrencia);

        let elemento = document.createElement('li');
        let texto = `Compra ${resultado[i].id} ${primerSlice}<span class="texto-rojo">${segundoSlice}</span>${tercerSlice}`;
        elemento.innerHTML = texto;
        lista.appendChild(elemento);
    }
}

// Mensaje de error para el radio-btn
function errorForm(id, mensaje, display) {

    let errorSpan = document.getElementById(id);
    errorSpan.innerHTML = mensaje;
    errorSpan.style.display = display;

}


function drawChart() {

    let datos = bucketsDeCompras(sistema.compras);
    let datosFinales = consolidarDatos(datos);
    let max = Math.max(...datos);


    let data = new google.visualization.DataTable();

    // Asignar los datos
    data.addColumn('string', 'Labels');
    data.addColumn('number', 'Cantidad');
    data.addRows(datosFinales);


    // Configurar las opciones del grafico
    let options = {
        'title': 'Rangos',
        'width': '100%',
        'height': 500,
        'chartArea': { 'left': '8%', 'width': '70%', 'height': '80%' },
        'vAxis': {
            gridlines: {
                count: 1.5
            },
            viewWindow: {
                max: max + 1,
                min: 0
            },
            format: '#'
        },
        'hAxis': {
            maxTextLines: 1
        },

    }

    // Dibujar el grafico
    let chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

/*----------------------------------------------------------------------------*/
/*---------------------------- Logica de Negocio -----------------------------*/
/*----------------------------------------------------------------------------*/

function crearPersona(arrayInput) {

    let nombre = arrayInput[0];
    let seccion = arrayInput[1];
    let email = arrayInput[2];
    let esValido = true;


    // Vaidar que los campos esten completos
    if (!(nombre.reportValidity()) ||
        !(seccion.reportValidity()) ||
        !(email.reportValidity()) && esValido === true) {
        esValido = false;
    } else {
        nombre = nombre.value;
        seccion = seccion.value;
        email = email.value;
    }


    for (let i = 0; i < sistema.personas.length && esValido === true; i++) {

        // Validar nombre de persona
        if (sistema.personas[i].nombre === nombre && esValido === true) {
            alert(`Ya existe un usuario ${nombre}! Intente con otro nombre de usuario`);
            esValido = false;
        }
        // Validar mail
        if (sistema.personas[i].mail === email && esValido === true) {
            alert(`Ya existe una persona con el mail ${email}! Intente con otro email`);
            esValido = false;
        }
    }

    if (esValido) {
        // Crea el objeto y lo agrega al sistema
        let persona = new Persona(nombre, seccion, email);
        sistema.agregarPersonaSistema(persona);

        return true;
    }
}


function crearCompra(datosDeCompra, participantesArray) {

    let id = sistema.compras.length + 1;
    let responsable = datosDeCompra[0];
    let descripcion = datosDeCompra[1];
    let monto = datosDeCompra[2];
    let esValido = true;

    if (!(descripcion.reportValidity()) ||
        !(monto.reportValidity())) {
        esValido = false;
    } else {
        responsable = responsable.value;
        descripcion = descripcion.value;
        monto = parseInt(monto.value);
    }

    if (esValido) {

        let participantes = participantesArray;
        let estado = "pendiente";

        let nuevaCompra = new Compra(id, responsable, descripcion, monto, participantes, estado);
        sistema.agregarCompraSistema(nuevaCompra);
        return true;
    }
}


function verificarCheckbox(checkbox) {

    let checkboxSelect = [];

    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            checkboxSelect.push(checkbox[i].value);
        }
    }

    if (checkboxSelect.length < 1) {
        let mensaje = 'Seleccione al menos un participante';
        errorForm("formError", mensaje, "inline");
    } else {
        errorForm("formError", "", "none");
        return (checkboxSelect);
    }
}

// Funciones para ordenar con sort
function ordenarPersonas(a, b) {

    let personaA = a.responsable.toUpperCase();
    let personaB = b.responsable.toUpperCase();

    let comparar = 0;
    if (personaA > personaB) {
        comparar = 1;
    } else if (personaA < personaB) {
        comparar = -1;
    }
    return comparar;
}


function ordenarId(a, b) {

    let personaA = a.id;
    let personaB = b.id;

    let comparar = 0;
    if (personaA > personaB) {
        comparar = 1;
    } else if (personaA < personaB) {
        comparar = -1;
    }
    return comparar;
}


function reintegrarPorID(id) {
    for (elemento of sistema.compras) {
        if (elemento.id === id) {
            elemento.reintegrar();
        }
    }
}

// Funciones para Google Chart
function bucketsDeCompras(compras) {

    let max = Number.MIN_SAFE_INTEGER;
    for (let elemento of compras) {
        if (elemento.monto > max) {
            max = elemento.monto;
        }
    }

    max = Math.floor(max / 100);
    let bucket = [];
    for (let i = 0; i <= max; i++) {
        bucket[i] = 0;
    }

    for (let elemento of compras) {
        let monto = elemento.monto;
        let index = Math.floor(monto / 100);
        bucket[index] += 1;
    }

    return bucket;
}


function labelsDeBucket(buckets) {

    let labels = [];
    for (let i = 0; i < buckets.length; i++) {
        if (i === 0) {
            let label = `${i} - 99`;
            labels.push(label);
        } else {
            let label = `${i}00 - ${i}99`;
            labels.push(label);
        }
    }
    return labels;
}


function consolidarDatos(datos) {

    let labels = labelsDeBucket(datos);
    let datosfinales = [];

    for (let i = 0; i < datos.length; i++) {
        let array = [labels[i], datos[i]];
        datosfinales.push(array);
    }

    return datosfinales;
}