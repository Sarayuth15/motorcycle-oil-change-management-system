package com.example.backend.dto;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.model.Vehicle;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class VehicleDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {

        @NotBlank(message = "Owner name is required")
        private String ownerName;

        @NotBlank(message = "Owner email is required")
        @Email(message = "Invalid email format")
        private String ownerEmail;

        @NotBlank(message = "Vehicle name is required")
        @Size(max = 100, message = "Vehicle name must be under 100 characters")
        private String vehicleName;

        @NotNull(message = "Current kilometers is required")
        @PositiveOrZero(message = "Kilometers must be 0 or greater")
        private Double currentKilometers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateKilometersRequest {
        @NotNull(message = "Current kilometers is required")
        @PositiveOrZero(message = "Kilometers must be 0 or greater")
        private Double currentKilometers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateVehicleRequest {
        @Size(max = 100, message = "Vehicle name must be under 100 characters")
        private String vehicleName;
        @PositiveOrZero(message = "Kilometers must be 0 or greater")
        private Double currentKilometers;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
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

        public static Response fromEntity(Vehicle v) {
            double kmUntilService = v.getNextServiceKilometers() - v.getCurrentKilometers();
            return Response.builder()
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AcknowledgeServiceRequest {
        @NotNull(message = "New current kilometers is required after service")
        @PositiveOrZero
        private Double newCurrentKilometers;
    }
}
