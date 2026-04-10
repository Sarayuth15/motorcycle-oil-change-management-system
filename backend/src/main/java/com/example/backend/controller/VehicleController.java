package com.example.backend.controller;

import com.example.backend.dto.req.AcknowledgeServiceRequest;
import com.example.backend.dto.req.CreateVehicleRequest;
import com.example.backend.dto.req.UpdateKilometersRequest;
import com.example.backend.dto.req.UpdateVehicleRequest;
import com.example.backend.dto.res.VehicleResponse;
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
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody CreateVehicleRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/vehicles — List all vehicles
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // GET /api/vehicles/{id} — Get vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    // GET /api/vehicles/by-email?email=... — Get vehicles by owner email
    @GetMapping("/by-email")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByEmail(
            @RequestParam String email) {
        return ResponseEntity.ok(vehicleService.getVehiclesByEmail(email));
    }

    // PATCH /api/vehicles/{id}/kilometers — Update current km only
    @PatchMapping("/{id}/kilometers")
    public ResponseEntity<VehicleResponse> updateKilometers(
            @PathVariable Long id,
            @Valid @RequestBody UpdateKilometersRequest request) {
        return ResponseEntity.ok(vehicleService.updateKilometers(id, request));
    }

    // PUT /api/vehicles/{id} — Full vehicle update (name, km, recalculate interval)
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    // POST /api/vehicles/{id}/acknowledge-service — Mark service as done, reset interval
    @PostMapping("/{id}/acknowledge-service")
    public ResponseEntity<VehicleResponse> acknowledgeService(
            @PathVariable Long id,
            @Valid @RequestBody AcknowledgeServiceRequest request) {
        return ResponseEntity.ok(vehicleService.acknowledgeService(id, request));
    }

    // DELETE /api/vehicles/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
    }
}
