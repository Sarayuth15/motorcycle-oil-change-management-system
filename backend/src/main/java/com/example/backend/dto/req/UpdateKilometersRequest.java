package com.example.backend.dto.req;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateKilometersRequest {

    @NotNull(message = "Current kilometers is required")
    @PositiveOrZero(message = "Kilometers must be 0 or greater")
    private Double currentKilometers;
}
