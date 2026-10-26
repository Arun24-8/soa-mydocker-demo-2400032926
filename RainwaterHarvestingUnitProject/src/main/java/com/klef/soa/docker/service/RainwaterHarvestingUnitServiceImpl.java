package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.RainwaterHarvestingUnitResponse;
import com.klef.soa.docker.entity.RainwaterHarvestingUnit;
import com.klef.soa.docker.repository.RainwaterHarvestingUnitRepository;

@Service
public class RainwaterHarvestingUnitServiceImpl
        implements RainwaterHarvestingUnitService {

    @Autowired
    private RainwaterHarvestingUnitRepository repo;

    @Override
    public RainwaterHarvestingUnit addUnit(
            RainwaterHarvestingUnit rainHarvesting) {

        return repo.save(rainHarvesting);
    }

    @Override
    public List<RainwaterHarvestingUnitResponse> displayAllHarvestingUnit() {

        return repo.findAllRainwaterHarvestingUnits();
    }

    @Override
    public String deleteRainHarvestingById(Long id) {

        boolean status = repo.existsById(id);

        if (status) {
            repo.deleteById(id);
            return "RainHarvestingUnit Deleted Successfully";
        } else {
            return "RainHarvestingUnit Id Not Found";
        }
    }
}