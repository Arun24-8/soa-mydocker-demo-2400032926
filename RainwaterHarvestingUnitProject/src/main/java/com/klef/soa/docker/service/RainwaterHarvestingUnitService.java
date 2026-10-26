package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.RainwaterHarvestingUnitResponse;
import com.klef.soa.docker.entity.RainwaterHarvestingUnit;

public interface RainwaterHarvestingUnitService {

    RainwaterHarvestingUnit addUnit(
            RainwaterHarvestingUnit rainHarvesting);

    List<RainwaterHarvestingUnitResponse> displayAllHarvestingUnit();

    String deleteRainHarvestingById(Long id);
}