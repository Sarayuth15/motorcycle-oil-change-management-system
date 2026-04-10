package com.example.backend.dto.req;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateVehicleRequest {

    @Size(max = 100, message = "Vehicle name must be under 100 characters")
    private String vehicleName;

    @PositiveOrZero(message = "Kilometers must be 0 or greater")
    private Double currentKilometers;
}
