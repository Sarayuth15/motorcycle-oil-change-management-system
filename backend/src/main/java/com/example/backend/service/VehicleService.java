package com.example.backend.service;

import com.example.backend.dto.req.AcknowledgeServiceRequest;
import com.example.backend.dto.req.CreateVehicleRequest;
import com.example.backend.dto.req.UpdateKilometersRequest;
import com.example.backend.dto.req.UpdateVehicleRequest;
import com.example.backend.dto.res.VehicleResponse;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.model.Vehicle;
import com.example.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final EmailService emailService;

    @Value("${app.service-interval-km:2500}")
    private double serviceIntervalKm;

    // ─── Create ───────────────────────────────────────────────────────────────
    @Transactional
    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        double nextService = request.getCurrentKilometers() + serviceIntervalKm;

        Vehicle vehicle = Vehicle.builder()
                .ownerName(request.getOwnerName())
                .ownerEmail(request.getOwnerEmail())
                .vehicleName(request.getVehicleName())
                .currentKilometers(request.getCurrentKilometers())
                .nextServiceKilometers(nextService)
                .serviceIntervalKm(serviceIntervalKm)
                .notificationStatus(NotificationStatus.PENDING)
                .build();

        vehicle = vehicleRepository.save(vehicle);

        // Send a welcome/registration confirmation email
        emailService.sendWelcomeEmail(vehicle);

        log.info("Vehicle '{}' registered for {}. Next service at {} km.",
                vehicle.getVehicleName(), vehicle.getOwnerEmail(), nextService);

        return VehicleResponse.fromEntity(vehicle);
    }

    // ─── Read ─────────────────────────────────────────────────────────────────
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = findOrThrow(id);
        return VehicleResponse.fromEntity(vehicle);
    }

    public List<VehicleResponse> getVehiclesByEmail(String email) {
        return vehicleRepository.findByOwnerEmail(email).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─── Update Kilometers ────────────────────────────────────────────────────
    @Transactional
    public VehicleResponse updateKilometers(Long id, UpdateKilometersRequest request) {
        Vehicle vehicle = findOrThrow(id);
        vehicle.setCurrentKilometers(request.getCurrentKilometers());

        // If the vehicle was previously notified or acknowledged and km was reset, re-arm
        if (vehicle.getCurrentKilometers() < vehicle.getNextServiceKilometers()
                && vehicle.getNotificationStatus() == NotificationStatus.NOTIFIED) {
            vehicle.setNotificationStatus(NotificationStatus.PENDING);
        }

        vehicle = vehicleRepository.save(vehicle);

        // Immediate check: has it hit the service interval?
        if (vehicle.getCurrentKilometers() >= vehicle.getNextServiceKilometers()
                && vehicle.getNotificationStatus() == NotificationStatus.PENDING) {
            sendNotificationAndMark(vehicle);
        }

        return VehicleResponse.fromEntity(vehicle);
    }

    // ─── Update Vehicle Info ──────────────────────────────────────────────────
    @Transactional
    public VehicleResponse updateVehicle(Long id, UpdateVehicleRequest request) {
        Vehicle vehicle = findOrThrow(id);

        if (request.getVehicleName() != null && !request.getVehicleName().isBlank()) {
            vehicle.setVehicleName(request.getVehicleName());
        }

        if (request.getCurrentKilometers() != null) {
            vehicle.setCurrentKilometers(request.getCurrentKilometers());
            // Recalculate next service from new base
            vehicle.setNextServiceKilometers(request.getCurrentKilometers() + serviceIntervalKm);
            vehicle.setNotificationStatus(NotificationStatus.PENDING);
        }

        vehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(vehicle);
    }

    // ─── Acknowledge Service Done ─────────────────────────────────────────────
    @Transactional
    public VehicleResponse acknowledgeService(Long id, AcknowledgeServiceRequest request) {
        Vehicle vehicle = findOrThrow(id);

        double newKm = request.getNewCurrentKilometers();
        double nextService = newKm + serviceIntervalKm;

        vehicle.setCurrentKilometers(newKm);
        vehicle.setNextServiceKilometers(nextService);
        vehicle.setNotificationStatus(NotificationStatus.PENDING);

        vehicle = vehicleRepository.save(vehicle);

        log.info("Service acknowledged for vehicle '{}'. Next service at {} km.",
                vehicle.getVehicleName(), nextService);

        return VehicleResponse.fromEntity(vehicle);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ─── Scheduled Check ─────────────────────────────────────────────────────
    /**
     * Every hour, check for any vehicles that have reached their service interval
     * but haven't been notified yet.
     */
    @Scheduled(fixedRateString = "${app.notification-check-interval-ms:3600000}")
    @Transactional
    public void checkAndNotifyDueVehicles() {
        List<Vehicle> dueVehicles = vehicleRepository.findVehiclesDueForService();

        if (!dueVehicles.isEmpty()) {
            log.info("Scheduled check: {} vehicle(s) due for service.", dueVehicles.size());
            dueVehicles.forEach(this::sendNotificationAndMark);
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private void sendNotificationAndMark(Vehicle vehicle) {
        emailService.sendOilChangeReminder(vehicle);
        vehicle.setNotificationStatus(NotificationStatus.NOTIFIED);
        vehicleRepository.save(vehicle);
        log.info("Notification sent and status updated for vehicle id={}", vehicle.getId());
    }

    private Vehicle findOrThrow(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }
}
