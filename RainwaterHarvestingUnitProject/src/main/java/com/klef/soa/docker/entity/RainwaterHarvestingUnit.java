package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "RainwaterHarvestingUnitTable")
public class RainwaterHarvestingUnit
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long rainwaterHarvestingUnitid;

	@Column(length = 100, nullable = false)
	private String rainwaterHarvestingUnitname;

	@Column(length = 100)
	private double capacityLitres;

	private String installationDate;

	private boolean active;


	public long getRainwaterHarvestingUnitid() {
		return rainwaterHarvestingUnitid;
	}

	public void setRainwaterHarvestingUnitid(long rainwaterHarvestingUnitid) {
		this.rainwaterHarvestingUnitid = rainwaterHarvestingUnitid;
	}

	public String getRainwaterHarvestingUnitname() {
		return rainwaterHarvestingUnitname;
	}

	public void setRainwaterHarvestingUnitname(String rainwaterHarvestingUnitname) {
		this.rainwaterHarvestingUnitname = rainwaterHarvestingUnitname;
	}

	public double getCapacityLitres() {
		return capacityLitres;
	}

	public void setCapacityLitres(double capacityLitres) {
		this.capacityLitres = capacityLitres;
	}

	public String getInstallationDate() {
		return installationDate;
	}

	public void setInstallationDate(String installationDate) {
		this.installationDate = installationDate;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "RainwaterHarvestingUnit [RainwaterHarvestingUnitid=" + rainwaterHarvestingUnitid
				+ ", RainwaterHarvestingUnitname=" + rainwaterHarvestingUnitname + ", capacityLitres=" + capacityLitres
				+ ", installationDate=" + installationDate + ", active=" + active + "]";
	}
}