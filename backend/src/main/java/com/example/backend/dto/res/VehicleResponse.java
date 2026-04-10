package com.example.backend.dto.res;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {

    private Long id;
    private String ownerName;
    private String ownerEmail;
    private String vehicleName;
    private Double currentKilometers;
    private Double nextServiceKilometers;
    private Double serviceIntervalKm;
    private Double kmUntilService;
    private boolean isDueForService;
    private NotificationStatus notificationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VehicleResponse fromEntity(Vehicle v) {
        double kmUntilService = v.getNextServiceKilometers() - v.getCurrentKilometers();
        return VehicleResponse.builder()
                .id(v.getId())
                .ownerName(v.getOwnerName())
                .ownerEmail(v.getOwnerEmail())
                .vehicleName(v.getVehicleName())
                .currentKilometers(v.getCurrentKilometers())
                .nextServiceKilometers(v.getNextServiceKilometers())
                .serviceIntervalKm(v.getServiceIntervalKm())
                .kmUntilService(kmUntilService)
                .isDueForService(kmUntilService <= 0)
                .notificationStatus(v.getNotificationStatus())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}
