-- ============================================================================
-- JalRakshak AI — PostgreSQL Schema
-- Hyperlocal Water Intelligence & Climate-Risk Prediction for Agriculture
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Roles & Users (auth, RBAC)
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(20) UNIQUE NOT NULL,           -- 'farmer' | 'admin'
    description     TEXT
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE,
    mobile_number   VARCHAR(15) UNIQUE,
    password_hash   VARCHAR(255),                          -- NULL for OTP-only farmer accounts
    full_name       VARCHAR(150) NOT NULL,
    role_id         INTEGER NOT NULL REFERENCES roles(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role_id);

-- ---------------------------------------------------------------------------
-- Farmers & Farms
-- ---------------------------------------------------------------------------
CREATE TABLE farmers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name       VARCHAR(150) NOT NULL,
    mobile_number   VARCHAR(15) UNIQUE NOT NULL,
    village         VARCHAR(150),
    district        VARCHAR(100),
    state           VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farmers_district ON farmers(district);

CREATE TABLE farms (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_code           VARCHAR(20) UNIQUE NOT NULL,       -- e.g. FARM-001
    farmer_id           UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    village             VARCHAR(150) NOT NULL,
    district            VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    area_acres          NUMERIC(6,2) NOT NULL CHECK (area_acres > 0),
    crop_type           VARCHAR(100) NOT NULL,
    sowing_date         DATE,
    soil_type           VARCHAR(100),
    irrigation_method   VARCHAR(50),
    latitude            NUMERIC(9,6) NOT NULL,
    longitude           NUMERIC(9,6) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farms_farmer ON farms(farmer_id);
CREATE INDEX idx_farms_district ON farms(district);
CREATE INDEX idx_farms_location ON farms(latitude, longitude);

-- ---------------------------------------------------------------------------
-- Sensor / observational data
-- ---------------------------------------------------------------------------
CREATE TABLE soil_data (
    id              BIGSERIAL PRIMARY KEY,
    farm_id         UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    soil_moisture_pct  NUMERIC(5,2) NOT NULL,
    soil_temperature_c NUMERIC(5,2),
    ph_level        NUMERIC(4,2),
    nitrogen_ppm    NUMERIC(6,2),
    phosphorus_ppm  NUMERIC(6,2),
    potassium_ppm   NUMERIC(6,2),
    source          VARCHAR(30) DEFAULT 'iot_sensor'        -- 'iot_sensor' | 'manual' | 'satellite'
);

CREATE INDEX idx_soil_data_farm_time ON soil_data(farm_id, recorded_at DESC);

CREATE TABLE weather_data (
    id                  BIGSERIAL PRIMARY KEY,
    district            VARCHAR(100) NOT NULL,
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    temperature_c       NUMERIC(5,2),
    humidity_pct        NUMERIC(5,2),
    rainfall_mm         NUMERIC(6,2),
    wind_speed_kmph      NUMERIC(5,2),
    forecast_horizon_days INTEGER DEFAULT 0,                -- 0 = observed, >0 = forecast
    source              VARCHAR(30) DEFAULT 'imd_api'
);

CREATE INDEX idx_weather_district_time ON weather_data(district, recorded_at DESC);

CREATE TABLE groundwater_data (
    id                  BIGSERIAL PRIMARY KEY,
    district            VARCHAR(100) NOT NULL,
    farm_id             UUID REFERENCES farms(id) ON DELETE SET NULL,
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    water_table_depth_m NUMERIC(6,2) NOT NULL,
    recharge_status      VARCHAR(30),                       -- 'stable' | 'declining' | 'critical'
    source              VARCHAR(30) DEFAULT 'cgwb'
);

CREATE INDEX idx_groundwater_district_time ON groundwater_data(district, recorded_at DESC);

CREATE TABLE satellite_data (
    id              BIGSERIAL PRIMARY KEY,
    farm_id         UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    captured_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    ndvi            NUMERIC(4,3),
    ndwi            NUMERIC(4,3),
    vegetation_health_pct NUMERIC(5,2),
    cloud_cover_pct NUMERIC(5,2),
    satellite_source VARCHAR(50) DEFAULT 'Sentinel-2',
    geojson         JSONB
);

CREATE INDEX idx_satellite_farm_time ON satellite_data(farm_id, captured_at DESC);

-- ---------------------------------------------------------------------------
-- AI prediction outputs
-- ---------------------------------------------------------------------------
CREATE TABLE water_predictions (
    id                      BIGSERIAL PRIMARY KEY,
    farm_id                 UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    predicted_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    decision                VARCHAR(30) NOT NULL,           -- 'Irrigate Now' | 'Delay Irrigation'
    water_requirement_litres NUMERIC(10,2),
    water_saved_litres      NUMERIC(10,2),
    irrigation_duration_min INTEGER,
    confidence_pct          NUMERIC(5,2),
    reasoning               TEXT,
    model_version           VARCHAR(50) DEFAULT 'water-demand-rf-v1'
);

CREATE INDEX idx_water_predictions_farm_time ON water_predictions(farm_id, predicted_at DESC);

CREATE TABLE risk_predictions (
    id                  BIGSERIAL PRIMARY KEY,
    farm_id             UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    predicted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    forecast_horizon_days INTEGER NOT NULL DEFAULT 7,        -- 7 | 15 | 30
    drought_risk_score   NUMERIC(5,2),
    heatwave_risk_score  NUMERIC(5,2),
    water_stress_score   NUMERIC(5,2),
    drought_level        VARCHAR(20),                        -- low | medium | high | critical
    heatwave_level       VARCHAR(20),
    water_stress_level   VARCHAR(20),
    confidence_pct        NUMERIC(5,2),
    model_version         VARCHAR(50) DEFAULT 'climate-risk-v1'
);

CREATE INDEX idx_risk_predictions_farm_time ON risk_predictions(farm_id, predicted_at DESC);

CREATE TABLE digital_twin_results (
    id                      BIGSERIAL PRIMARY KEY,
    farm_id                 UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    simulated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    scenario_name           VARCHAR(50) NOT NULL,            -- Irrigate Now | Delay 12 Hours | Wait For Rain | Reduce Water By 30%
    water_litres            NUMERIC(10,2),
    cost_inr                NUMERIC(10,2),
    energy_kwh              NUMERIC(8,2),
    groundwater_impact_pct  NUMERIC(5,2),
    crop_health_score       NUMERIC(5,2),
    yield_prediction_pct    NUMERIC(5,2),
    carbon_kg_co2           NUMERIC(8,2),
    sustainability_score    NUMERIC(5,2),
    rank                    INTEGER,
    is_recommended          BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_digital_twin_farm_time ON digital_twin_results(farm_id, simulated_at DESC);

-- ---------------------------------------------------------------------------
-- Alerts
-- ---------------------------------------------------------------------------
CREATE TABLE community_alerts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category            VARCHAR(20) NOT NULL,               -- water | climate | groundwater | community
    severity            VARCHAR(20) NOT NULL,                -- low | medium | high | critical
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    district            VARCHAR(100),
    farm_id             UUID REFERENCES farms(id) ON DELETE SET NULL,
    affected_farm_count INTEGER DEFAULT 0,
    rainfall_deficit_pct NUMERIC(5,2),
    temperature_anomaly_c NUMERIC(5,2),
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_community_alerts_district ON community_alerts(district);
CREATE INDEX idx_community_alerts_severity ON community_alerts(severity);

-- ---------------------------------------------------------------------------
-- Reports & Chat
-- ---------------------------------------------------------------------------
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
    district        VARCHAR(100),
    report_type     VARCHAR(50) NOT NULL,                    -- water_usage | savings | yield_forecast | climate_risk
    generated_by    UUID REFERENCES users(id),
    period_start    DATE,
    period_end      DATE,
    payload         JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_farm ON reports(farm_id);
CREATE INDEX idx_reports_type ON reports(report_type);

CREATE TABLE chat_history (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_id         UUID REFERENCES farms(id) ON DELETE SET NULL,
    role            VARCHAR(10) NOT NULL,                    -- 'user' | 'assistant'
    message         TEXT NOT NULL,
    language        VARCHAR(10) DEFAULT 'en',
    intent          VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_history_user_time ON chat_history(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Seed roles
-- ---------------------------------------------------------------------------
INSERT INTO roles (name, description) VALUES
    ('farmer', 'Farm owner/operator — dashboard, advisor, digital twin, alerts, reports'),
    ('admin', 'Platform administrator — district monitoring, farmer management, analytics')
ON CONFLICT (name) DO NOTHING;
