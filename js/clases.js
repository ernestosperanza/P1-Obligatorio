class Sistema {
    constructor(personas, compras) {
        this.compras = compras;
        this.personas = personas;
    }
    agregarPersonaSistema(persona) {
        this.personas.push(persona);
    }
    agregarCompraSistema(compra) {
        this.compras.push(compra);
    }
    buscarComprasPorKeyword(keyword) {

        let match = [];
    
        for (let elemento of this.compras) {
    
            let compra = elemento;
            let descripcion = compra.descripcion.toLowerCase();
    
            if (descripcion.includes(keyword)) {
    
                match.push(compra);
    
            }
        }
        return match;
    }
    pagosCobrosPendientes(persona) {

        let sumaParticipacion = 0;
        let sumaResponsable = 0;
    
        for (let elemento of this.compras) {
    
            let compra = elemento;
    
            if (compra.estado === 'pendiente') {
    
                if (compra.responsable === persona) {
                    sumaResponsable += compra.monto;
                }
    
                for (let participante of compra.participantes) {
    
                    if (participante === persona) {
                        let participacion = compra.monto / compra.participantes.length;
                        sumaParticipacion += participacion;
                    }
                }
            }
        }
    
        sumaParticipacion = Math.round(sumaParticipacion);
        sumaResponsable = Math.round(sumaResponsable);
    
        return [sumaParticipacion, sumaResponsable];
    }
}

class Compra {
    constructor(id, responsable, descripcion, monto, participantes, estado) {
        this.id = id;
        this.responsable = responsable;
        this.descripcion = descripcion;
        this.monto = monto;
        this.participantes = participantes;
        this.estado = estado;
    }
    reintegrar() {
        if (this.estado === "pendiente") {
            this.estado = "reintegrado";
        }
    }
}

class Persona {
    constructor(nombre, seccion, mail) {
        this.nombre = nombre;
        this.seccion = seccion;
        this.mail = mail;
    }
}
