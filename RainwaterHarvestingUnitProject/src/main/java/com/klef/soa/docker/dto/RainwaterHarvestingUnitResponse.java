package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RainwaterHarvestingUnitResponse {

    private long rainwaterHarvestingUnitid;
    private String rainwaterHarvestingUnitname;
    private double capacityLitres;
    private String installationDate;
}