package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.RainwaterHarvestingUnitResponse;
import com.klef.soa.docker.entity.RainwaterHarvestingUnit;
import com.klef.soa.docker.service.RainwaterHarvestingUnitService;

@RestController
@RequestMapping("/Harvestingunit")
public class RainwaterHarvestingUnitController 
{

    @Autowired
    private RainwaterHarvestingUnitService service;

    @GetMapping("/")
    public String test() {
        return "RainWaterHarvestingUnit Demo Project";
    }

    @PostMapping("/add")
    public ResponseEntity<RainwaterHarvestingUnit> addUnit(
            @RequestBody RainwaterHarvestingUnit unit) {

        RainwaterHarvestingUnit harvestingUnit =
                service.addUnit(unit);

        return ResponseEntity.status(201).body(harvestingUnit);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<RainwaterHarvestingUnitResponse>>
            displayAllHarvestingUnits() {

        List<RainwaterHarvestingUnitResponse> units =
                service.displayAllHarvestingUnit();

        return ResponseEntity.status(200).body(units);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHarvestingUnit(
            @PathVariable long id) {

        String message = service.deleteRainHarvestingById(id);

        return ResponseEntity.status(200).body(message);
    }
}