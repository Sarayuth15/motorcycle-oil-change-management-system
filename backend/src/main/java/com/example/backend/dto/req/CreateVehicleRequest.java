package com.example.backend.dto.req;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateVehicleRequest {

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
