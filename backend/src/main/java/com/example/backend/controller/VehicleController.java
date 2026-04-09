package com.example.backend.controller;

import com.example.backend.dto.VehicleDto;
import com.example.backend.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
public class VehicleController {

    private final VehicleService vehicleService;

    // POST /api/vehicles — Register a new vehicle
    @PostMapping
    public ResponseEntity<VehicleDto.Response> createVehicle(
            @Valid @RequestBody VehicleDto.CreateRequest request) {
        VehicleDto.Response response = vehicleService.createVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/vehicles — List all vehicles
    @GetMapping
    public ResponseEntity<List<VehicleDto.Response>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // GET /api/vehicles/{id} — Get vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDto.Response> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    // GET /api/vehicles/by-email?email=... — Get vehicles by owner email
    @GetMapping("/by-email")
    public ResponseEntity<List<VehicleDto.Response>> getVehiclesByEmail(
            @RequestParam String email) {
        return ResponseEntity.ok(vehicleService.getVehiclesByEmail(email));
    }

    // PATCH /api/vehicles/{id}/kilometers — Update current km only
    @PatchMapping("/{id}/kilometers")
    public ResponseEntity<VehicleDto.Response> updateKilometers(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDto.UpdateKilometersRequest request) {
        return ResponseEntity.ok(vehicleService.updateKilometers(id, request));
    }

    // PUT /api/vehicles/{id} — Full vehicle update (name, km, recalculate interval)
    @PutMapping("/{id}")
    public ResponseEntity<VehicleDto.Response> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDto.UpdateVehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    // POST /api/vehicles/{id}/acknowledge-service — Mark service as done, reset interval
    @PostMapping("/{id}/acknowledge-service")
    public ResponseEntity<VehicleDto.Response> acknowledgeService(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDto.AcknowledgeServiceRequest request) {
        return ResponseEntity.ok(vehicleService.acknowledgeService(id, request));
    }

    // DELETE /api/vehicles/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
    }
}

