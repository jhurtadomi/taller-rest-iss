import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleado } from '../models/empleado';
import { EmpleadoService } from '../services/empleado';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];
  textoBusqueda: string = '';
  mensaje: string = '';
  totalEmpleados: number = 0;
  totalMasculino: number = 0;
  totalFemenino: number = 0;
  totalSoltero: number = 0;
  totalCasado: number = 0;
  totalDivorciado: number = 0;

  empleado: Empleado = {
    nombre: '',
    apellido: '',
    dni: '',
    genero: '',
    estadoCivil: ''
  };

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.empleadoService.listar().subscribe({
      next: data => {
        this.empleados = data;
        this.calcularEstadisticas();
      },
      error: error => {
        console.error('Error al listar empleados', error);
        this.mensaje = 'Error al cargar empleados';
      }
    });
  }

  guardar(): void {
    if (!this.validarFormulario()) return;

    if (this.empleado.id) {
      this.actualizar();
    } else {
      this.empleadoService.guardar(this.empleado).subscribe({
        next: () => {
          this.mensaje = 'Empleado registrado correctamente';
          this.listar();
          this.limpiarFormulario();
        },
        error: error => {
          console.error('Error al guardar', error);
          this.mensaje = 'No se pudo registrar el empleado';
        }
      });
    }
  }

  editar(empleado: Empleado): void {
    this.empleado = { ...empleado };
    this.mensaje = 'Editando empleado';
  }

  actualizar(): void {
    if (!this.empleado.id) return;

    this.empleadoService.actualizar(this.empleado.id, this.empleado).subscribe({
      next: () => {
        this.mensaje = 'Empleado actualizado correctamente';
        this.listar();
        this.limpiarFormulario();
      },
      error: error => {
        console.error('Error al actualizar', error);
        this.mensaje = 'No se pudo actualizar el empleado';
      }
    });
  }

  eliminar(id?: number): void {
    if (!id) return;
    if (!confirm('¿Está seguro de eliminar este empleado?')) return;

    this.empleadoService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Empleado eliminado correctamente';
        this.listar();
      },
      error: error => {
        console.error('Error al eliminar', error);
        this.mensaje = 'No se pudo eliminar el empleado';
      }
    });
  }

  buscar(): void {
    const texto = this.textoBusqueda.trim();
    if (texto === '') {
      this.listar();
      return;
    }

    this.empleadoService.buscar(texto).subscribe({
      next: data => { this.empleados = data; },
      error: error => {
        console.error('Error al buscar', error);
        this.mensaje = 'Error al buscar empleados';
      }
    });
  }

  limpiarFormulario(): void {
    this.empleado = {
      nombre: '',
      apellido: '',
      dni: '',
      genero: '',
      estadoCivil: ''
    };
  }

  validarFormulario(): boolean {
    if (
      this.empleado.nombre.trim() === '' ||
      this.empleado.apellido.trim() === '' ||
      this.empleado.dni.trim() === '' ||
      this.empleado.genero.trim() === '' ||
      this.empleado.estadoCivil.trim() === ''
    ) {
      this.mensaje = 'Todos los campos son obligatorios';
      return false;
    }

    if (this.empleado.dni.length !== 8) {
      this.mensaje = 'El DNI debe tener 8 dígitos';
      return false;
    }

    return true;
  }

  calcularEstadisticas(): void {
    this.totalEmpleados = this.empleados.length;
    this.totalMasculino = this.empleados.filter(e => e.genero === 'Masculino').length;
    this.totalFemenino = this.empleados.filter(e => e.genero === 'Femenino').length;
    this.totalSoltero = this.empleados.filter(e => e.estadoCivil === 'Soltero').length;
    this.totalCasado = this.empleados.filter(e => e.estadoCivil === 'Casado').length;
    this.totalDivorciado = this.empleados.filter(e => e.estadoCivil === 'Divorciado').length;
  }
}
