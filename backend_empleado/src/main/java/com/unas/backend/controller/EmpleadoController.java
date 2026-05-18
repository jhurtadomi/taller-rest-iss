package com.unas.backend.controller;

import com.unas.backend.entidad.Empleado;
import com.unas.backend.repository.EmpleadoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "http://localhost:4200")
public class EmpleadoController {

    @Autowired
    private EmpleadoRepository repository;

    @GetMapping
    public List<Empleado> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(e -> ResponseEntity.ok(e))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Empleado> buscar(@RequestParam String texto) {
        return repository.buscar(texto);
    }

    @PostMapping
    public Empleado guardar(@RequestBody Empleado empleado) {
        return repository.save(empleado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizar(@PathVariable Long id, @RequestBody Empleado datos) {
        return repository.findById(id)
                .map(e -> {
                    e.setNombre(datos.getNombre());
                    e.setApellido(datos.getApellido());
                    e.setDni(datos.getDni());
                    e.setGenero(datos.getGenero());
                    e.setEstadoCivil(datos.getEstadoCivil());
                    return ResponseEntity.ok(repository.save(e));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}