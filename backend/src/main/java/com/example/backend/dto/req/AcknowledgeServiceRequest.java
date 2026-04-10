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
public class AcknowledgeServiceRequest {

    @NotNull(message = "New current kilometers is required after service")
    @PositiveOrZero
    private Double newCurrentKilometers;
}
