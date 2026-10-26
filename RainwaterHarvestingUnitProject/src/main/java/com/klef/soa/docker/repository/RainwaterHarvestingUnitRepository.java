package com.klef.soa.docker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klef.soa.docker.dto.RainwaterHarvestingUnitResponse;
import com.klef.soa.docker.entity.RainwaterHarvestingUnit;

@Repository
public interface RainwaterHarvestingUnitRepository extends JpaRepository<RainwaterHarvestingUnit, Long>
{
	@Query("select new com.klef.soa.docker.dto.RainwaterHarvestingUnitResponse(r.rainwaterHarvestingUnitid, r.rainwaterHarvestingUnitname, r.capacityLitres, r.installationDate) from RainwaterHarvestingUnit r")
	List<RainwaterHarvestingUnitResponse> findAllRainwaterHarvestingUnits();
}