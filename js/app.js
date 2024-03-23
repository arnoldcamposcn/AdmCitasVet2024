const mascotaInput = document.querySelector('#mascota'),
      propietarioInput = document.querySelector('#propietario'),
      telefonoInput = document.querySelector('#telefono'),
      fechaInput = document.querySelector('#fecha'),
      horaInput = document.querySelector('#hora'),
      sintomasInput = document.querySelector('#sintomas'),
      formularioInput = document.querySelector('#nueva-cita'),
      contenedorCitas = document.querySelector('#citas');

class Citas {
    constructor() { this.citas = []; }
    agregarcita(cita){ this.citas = [...this.citas, cita]; }
    eliminarCita(id) { this.citas = this.citas.filter(cita => cita.id !== id); }
    editarCita(citaActualizada) { this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita); }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        tipo === 'error' ? divMensaje.classList.add('alert-danger') : divMensaje.classList.add('alert-success');
        divMensaje.textContent = mensaje;
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        setTimeout(() => { divMensaje.remove(); }, 5000);
    }
    mostrarCitas(citas) {
        while (contenedorCitas.firstChild) { contenedorCitas.removeChild(contenedorCitas.firstChild); }
        citas.forEach(cita => {
            const citaHTML = document.createElement('li');
            citaHTML.classList.add('list-group-item');
            citaHTML.dataset.id = cita.id;
            citaHTML.innerHTML = `
                <p><span class="font-weight-bold">Mascota:</span> ${cita.mascota}</p>
                <p><span class="font-weight-bold">Propietario:</span> ${cita.propietario}</p>
                <p><span class="font-weight-bold">Teléfono:</span> ${cita.telefono}</p>
                <p><span class="font-weight-bold">Fecha:</span> ${cita.fecha}</p>
                <p><span class="font-weight-bold">Hora:</span> ${cita.hora}</p>
                <p><span class="font-weight-bold">Síntomas:</span> ${cita.sintomas}</p>
                <button class="editar btn btn-info mr-2">Editar</button>
                <button class="eliminar btn btn-danger">Eliminar</button>
            `;
            contenedorCitas.appendChild(citaHTML);
        });
    }
}

const ui = new UI(), administrarCitas = new Citas();

function accionesCita(e) {
    e.preventDefault();
    if (e.target.classList.contains('eliminar')) 
    { eliminarCita(parseInt(e.target.parentElement.dataset.id)); }
    else if (e.target.classList.contains('editar')) 
    { llenarFormulario(parseInt(e.target.parentElement.dataset.id)); }
}

contenedorCitas.addEventListener('click', accionesCita);

function llenarFormulario(id) {
    const cita = administrarCitas.citas.find(cita => cita.id === id);
    [mascotaInput.value, propietarioInput.value, telefonoInput.value, fechaInput.value, horaInput.value, sintomasInput.value] = [cita.mascota, cita.propietario, cita.telefono, cita.fecha, cita.hora, cita.sintomas];
    formularioInput.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    formularioInput.dataset.id = id;
}

const citaObj = { mascota: '', propietario: '', telefono: '', fecha: '', hora: '', sintomas: '' };

function datosCita(e) { citaObj[e.target.name] = e.target.value; }

function nuevaCita(e) {
    e.preventDefault();
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    if (formularioInput.dataset.id) {
        const id = parseInt(formularioInput.dataset.id);
        const citaActualizada = { id, mascota: mascotaInput.value, propietario: propietarioInput.value, telefono: telefonoInput.value, fecha: fechaInput.value, hora: horaInput.value, sintomas: sintomasInput.value };
        administrarCitas.editarCita(citaActualizada);
        delete formularioInput.dataset.id;
        formularioInput.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    } else { citaObj.id = Date.now(); administrarCitas.agregarcita({ ...citaObj }); }
    formularioInput.reset();
    ui.mostrarCitas(administrarCitas.citas);
}

function eliminarCita(id) { administrarCitas.eliminarCita(id); ui.mostrarCitas(administrarCitas.citas); }

function eventListeners() {
    [mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput].forEach(input => input.addEventListener('input', datosCita));
    formularioInput.addEventListener('submit', nuevaCita);
}

eventListeners();
