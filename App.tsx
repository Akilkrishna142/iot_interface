import React, { useState, useEffect, useRef } from 'react';
import { Sliders, X } from 'lucide-react';

function App() {
  const [config, setConfig] = useState({
    // Temperature settings (20°C to 50°C range)
    currentTemperature: 35,
    targetTemperature: 40,
    minTemperature: 20,
    maxTemperature: 50,
    optimalTemperature: 40,
    temperatureVariance: 2,
    
    // Flow and Power (Updated ranges)
    flowRate: 2.2,
    maxFlowRate: 2.5,
    minFlowRate: 2.0,
    powerConsumption: 3.5,
    maxPowerConsumption: 4.5,
    minPowerConsumption: 3.0,
    efficiency: 94,
    maxEfficiency: 100,
    
    // Pressure settings (0.6-1 bar)
    currentPressure: 0.8,
    minPressure: 0.6,
    maxPressure: 1.0,
    
    // Usage metrics
    dailyUsage: 4.2,
    weeklyUsage: 28.5,
    monthlyUsage: 124.3,
    totalCycles: 1247,
    totalRuntime: 892,
    
    // Cost calculations (₹7 per kWh)
    electricityRate: 7.0,
    weeklyCost: 58.80,
    monthlyCost: 245.70,
    
    // Maintenance (6-month service cycle)
    lastMaintenance: 45,
    predictedMaintenance: 135,
    maintenanceInterval: 180, // 6 months
    maintenanceWarningDays: 60,
    
    // Device info
    deviceModel: 'V-Guard AquaFlow Pro 2000X',
    firmwareVersion: 'v3.2.1',
    serialNumber: 'VG-AF2000X-2024-1247',
    installationDate: 'Jan 15, 2024',
    
    // Thresholds
    optimalFlowThreshold: 2.0,
    powerWarningThreshold: 4.0,
    efficencyOptimalThreshold: 92,
    dataUpdateInterval: 5000, // Changed to 5-10 seconds
    temperatureStep: 5,
    
    // UI settings
    appTitle: 'V-Guard AquaFlow Pro',
    appSubtitle: 'Smart Water Heater Control',
    statusOnlineText: 'Online',
    statusOfflineText: 'Offline',
    
    // Eco mode settings
    ecoModeMinPower: 3.0,
    ecoModeMaxPower: 3.5,
    ecoModeMinEfficiency: 96,
    ecoModeMaxEfficiency: 98,
    normalModeMinPower: 3.2,
    normalModeMaxPower: 4.2,
    normalModeMinEfficiency: 90,
    normalModeMaxEfficiency: 98,
    
    // Component statuses
    waterFilterStatus: 'Good',
    heatExchangerStatus: 'Check Soon',
    ventingSystemStatus: 'OK',
    gasValveStatus: 'Normal',
    ignitionSystemStatus: 'OK',
    exhaustFanStatus: 'Normal',
    
    // Enhanced sensor data
    sensors: {
      temperatureSensor: { status: 'normal', value: 35, lastReading: new Date() },
      pressureSensor: { status: 'normal', value: 0.8, lastReading: new Date() },
      flowSensor: { status: 'normal', value: 2.2, lastReading: new Date() },
      vibrationSensor: { status: 'warning', value: 0.8, lastReading: new Date() },
      leakDetector: { status: 'normal', value: 0, lastReading: new Date() },
      gasValve: { status: 'normal', value: 1, lastReading: new Date() },
      ignitionSensor: { status: 'normal', value: 1, lastReading: new Date() },
      exhaustFan: { status: 'normal', value: 2400, lastReading: new Date() },
      waterInletSensor: { status: 'normal', value: 0.8, lastReading: new Date() },
      heatExchangerTemp: { status: 'warning', value: 45, lastReading: new Date() },
    },
    
    // Alerts system
    alerts: [
      { id: 1, type: 'warning', message: 'Heat exchanger temperature high - Service recommended', time: '1 hour ago' },
      { id: 2, type: 'info', message: 'No leaks detected - System secure', time: '2 hours ago' },
      { id: 3, type: 'warning', message: 'Vibration sensor detected unusual activity', time: '3 hours ago' },
      { id: 4, type: 'info', message: 'Maintenance due in 135 days', time: '1 day ago' },
      { id: 5, type: 'success', message: 'All safety sensors operational', time: '2 days ago' },
      { id: 6, type: 'info', message: 'Pressure maintained within optimal range', time: '2 days ago' },
      { id: 7, type: 'success', message: 'Flow rate optimized for efficiency', time: '3 days ago' },
      { id: 8, type: 'info', message: 'Peak efficiency achieved', time: '3 days ago' }
    ]
  });

  const [isOnline, setIsOnline] = useState(true);
  const [ecoMode, setEcoMode] = useState(false);
  const [targetTemp, setTargetTemp] = useState(40);
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Base values for customization (Flow Rate & Pressure only)
  const [baseStats, setBaseStats] = useState({
    flowRate: 2.2,
    pressure: 0.8
  });

  const intervalRef = useRef(null);

  // V-Guard Logo Component (Updated with JPEG)
  const VGuardLogo = ({ className = "w-8 h-8" }) => (
    <div className={`${className} rounded-lg overflow-hidden bg-white p-1`}>
      <img 
        src="/images/V-Guard_NewLogo.jpg" 
        alt="V-Guard Logo" 
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );

  // Custom Input Component
  const CustomizerInput = ({ label, value, onChange, type = "number", min, max, step = "any", ...props }) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-300 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
        {...props}
      />
    </div>
  );

  // Simulate real-time data updates with more realistic changes
  useEffect(() => {
    if (isOnline) {
      intervalRef.current = setInterval(() => {
        setConfig(prev => {
          const newConfig = { ...prev };
          
          // Simulate sensor readings with realistic variations
          const tempVariation = (Math.random() - 0.5) * prev.temperatureVariance;
          newConfig.currentTemperature = Math.max(prev.minTemperature, 
            Math.min(prev.maxTemperature, prev.targetTemperature + tempVariation));
          
          // Flow rate variations - smaller, more realistic changes (±0.02)
          newConfig.flowRate = Math.max(prev.minFlowRate, 
            Math.min(prev.maxFlowRate, baseStats.flowRate + (Math.random() - 0.5) * 0.02));
          
          // Pressure variations - smaller, more realistic changes (±0.02)
          newConfig.currentPressure = Math.max(prev.minPressure, 
            Math.min(prev.maxPressure, baseStats.pressure + (Math.random() - 0.5) * 0.02));
          
          // Power consumption based on eco mode (3.0-4.5 kW range)
          if (ecoMode) {
            newConfig.powerConsumption = prev.minPowerConsumption + 
              Math.random() * (prev.minPowerConsumption + 0.5);
            newConfig.efficiency = 96 + Math.random() * 2;
          } else {
            newConfig.powerConsumption = prev.minPowerConsumption + 
              Math.random() * (prev.maxPowerConsumption - prev.minPowerConsumption);
            newConfig.efficiency = 90 + Math.random() * 8;
          }
          
          // Update sensor values with failure simulation
          Object.keys(newConfig.sensors).forEach(sensor => {
            const sensorData = newConfig.sensors[sensor];
            let newValue = sensorData.value;
            let newStatus = 'normal';
            
            switch(sensor) {
              case 'pressureSensor':
                newValue = Math.max(0.5, Math.min(1.2, sensorData.value + (Math.random() - 0.5) * 0.02));
                if (newValue < 0.6 || newValue > 1.0) newStatus = 'warning';
                if (newValue < 0.5 || newValue > 1.1) newStatus = 'critical';
                break;
              case 'flowSensor':
                newValue = Math.max(1.8, Math.min(2.7, sensorData.value + (Math.random() - 0.5) * 0.02));
                if (newValue < 2.0 || newValue > 2.5) newStatus = 'warning';
                if (newValue < 1.9 || newValue > 2.6) newStatus = 'critical';
                break;
              case 'temperatureSensor':
                newValue = Math.max(15, Math.min(55, sensorData.value + (Math.random() - 0.5) * 1));
                if (newValue < 20 || newValue > 50) newStatus = 'warning';
                if (newValue < 18 || newValue > 52) newStatus = 'critical';
                break;
              case 'vibrationSensor':
                newValue = Math.max(0, Math.min(2, sensorData.value + (Math.random() - 0.5) * 0.1));
                if (newValue > 1.0) newStatus = 'warning';
                if (newValue > 1.5) newStatus = 'critical';
                break;
              case 'heatExchangerTemp':
                newValue = Math.max(30, Math.min(60, sensorData.value + (Math.random() - 0.5) * 2));
                if (newValue > 48) newStatus = 'warning';
                if (newValue > 52) newStatus = 'critical';
                break;
              case 'exhaustFan':
                newValue = Math.max(1000, Math.min(3000, sensorData.value + (Math.random() - 0.5) * 100));
                if (newValue < 1500 || newValue > 2800) newStatus = 'warning';
                if (newValue < 1200 || newValue > 2900) newStatus = 'critical';
                break;
              case 'waterInletSensor':
                newValue = Math.max(0.5, Math.min(1.2, sensorData.value + (Math.random() - 0.5) * 0.02));
                if (newValue < 0.6 || newValue > 1.0) newStatus = 'warning';
                if (newValue < 0.5 || newValue > 1.1) newStatus = 'critical';
                break;
              case 'leakDetector':
                // Leak detector: 0 = no leak, 1 = leak detected
                newValue = Math.random() < 0.02 ? 1 : 0; // 2% chance of leak detection
                if (newValue > 0) newStatus = 'critical';
                break;
            }
            
            newConfig.sensors[sensor] = {
              ...sensorData,
              value: newValue,
              status: newStatus,
              lastReading: new Date()
            };
          });
          
          return newConfig;
        });
      }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOnline, ecoMode, baseStats]);

  // Get sensor status color
  const getSensorStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get sensor status background
  const getSensorStatusBg = (status) => {
    switch(status) {
      case 'normal': return 'bg-green-900/20 border-green-400/30';
      case 'warning': return 'bg-yellow-900/20 border-yellow-400/30 sensor-alert';
      case 'critical': return 'bg-red-900/20 border-red-400/30 sensor-critical';
      default: return 'bg-gray-900/20 border-gray-400/30';
    }
  };

  // Calculate maintenance status
  const getMaintenanceStatus = () => {
    if (config.predictedMaintenance <= 0) return { status: 'overdue', color: 'text-red-400', message: 'Service Overdue!' };
    if (config.predictedMaintenance <= config.maintenanceWarningDays) return { status: 'due', color: 'text-yellow-400', message: 'Service Due Soon' };
    return { status: 'good', color: 'text-green-400', message: 'Service OK' };
  };

  const maintenanceStatus = getMaintenanceStatus();

  // Handle stats update from customizer
  const handleStatsUpdate = (newStats) => {
    setBaseStats(newStats);
    setShowCustomizer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <VGuardLogo className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">{config.appTitle}</h1>
              <p className="text-gray-400">{config.appSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCustomizer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors font-medium"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Status:</span>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${isOnline ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {isOnline ? config.statusOnlineText : config.statusOfflineText}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-colors"
            >
              {isOnline ? '📴 Disconnect' : '📶 Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Temperature Control */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-400">Temperature Control</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{config.currentTemperature.toFixed(1)}°C</div>
              <div className="text-sm text-gray-400">Current</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Target</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const newTemp = Math.max(config.minTemperature, targetTemp - config.temperatureStep);
                    setTargetTemp(newTemp);
                    setConfig(prev => ({...prev, targetTemperature: newTemp}));
                  }}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-white font-medium w-16 text-center">
                  {targetTemp.toFixed(1)}°C
                </span>
                <button 
                  onClick={() => {
                    const newTemp = Math.min(config.maxTemperature, targetTemp + config.temperatureStep);
                    setTargetTemp(newTemp);
                    setConfig(prev => ({...prev, targetTemperature: newTemp}));
                  }}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Range</span>
                <span>{config.minTemperature.toFixed(0)}°C - {config.maxTemperature.toFixed(0)}°C</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((config.currentTemperature - config.minTemperature) / (config.maxTemperature - config.minTemperature)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Flow Rate</span>
              <span className="text-white font-medium">{config.flowRate.toFixed(1)} L/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pressure</span>
              <span className="text-white font-medium">{config.currentPressure.toFixed(1)} bar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Power</span>
              <span className="text-white font-medium">{config.powerConsumption.toFixed(1)} kW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Efficiency</span>
              <span className={`font-medium ${config.efficiency > config.efficencyOptimalThreshold ? 'text-green-400' : 'text-yellow-400'}`}>
                {config.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Eco Mode</span>
              <label className="relative">
                <input 
                  type="checkbox" 
                  className="toggle"
                  checked={ecoMode}
                  onChange={(e) => setEcoMode(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Status */}
        <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm ${maintenanceStatus.status === 'due' ? 'animate-pulse' : ''}`}>
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">6-Month Service</h3>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold ${maintenanceStatus.color}`}>
                {config.predictedMaintenance} days
              </div>
              <div className="text-sm text-gray-400">{maintenanceStatus.message}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Last Service</span>
                <span>{config.lastMaintenance} days ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Interval</span>
                <span>{config.maintenanceInterval} days</span>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-colors">
                📅 Schedule Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(config.sensors).map(([key, sensor]) => (
          <div key={key} className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-lg p-4 backdrop-blur-sm ${getSensorStatusBg(sensor.status)}`}>
            <div className="text-center">
              <div className={`text-lg font-bold ${getSensorStatusColor(sensor.status)}`}>
                {key === 'temperatureSensor' ? `${sensor.value.toFixed(1)}°C` :
                 key === 'pressureSensor' || key === 'waterInletSensor' ? `${sensor.value.toFixed(1)} bar` :
                 key === 'flowSensor' ? `${sensor.value.toFixed(1)} L/min` :
                 key === 'vibrationSensor' ? `${sensor.value.toFixed(2)}` :
                 key === 'heatExchangerTemp' ? `${sensor.value.toFixed(0)}°C` :
                 key === 'exhaustFan' ? `${sensor.value.toFixed(0)} RPM` :
                 key === 'leakDetector' ? (sensor.value === 0 ? 'No Leak' : 'LEAK!') :
                 sensor.value}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className={`text-xs font-medium mt-1 ${getSensorStatusColor(sensor.status)}`}>
                {sensor.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage and Cost Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Usage Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{config.dailyUsage.toFixed(1)}h</div>
              <div className="text-sm text-gray-400">Daily</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{config.weeklyUsage.toFixed(1)}h</div>
              <div className="text-sm text-gray-400">Weekly</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{config.monthlyUsage.toFixed(1)}h</div>
              <div className="text-sm text-gray-400">Monthly</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{config.totalCycles}</div>
              <div className="text-sm text-gray-400">Total Cycles</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Cost Analysis (₹7/kWh)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Electricity Rate</span>
              <span className="text-white font-medium">₹{config.electricityRate.toFixed(2)}/kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Weekly Cost</span>
              <span className="text-white font-medium">₹{config.weeklyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Cost</span>
              <span className="text-white font-bold text-lg">₹{config.monthlyCost.toFixed(2)}</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Eco Mode Savings</div>
              <div className="text-green-400 font-medium">
                ₹{(config.monthlyCost * 0.15).toFixed(2)}/month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {config.alerts.slice(0, 6).map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border ${
              alert.type === 'warning' ? 'bg-yellow-900/20 border-yellow-400/30' :
              alert.type === 'critical' ? 'bg-red-900/20 border-red-400/30' :
              alert.type === 'success' ? 'bg-green-900/20 border-green-400/30' :
              'bg-blue-900/20 border-blue-400/30'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className={`font-medium ${
                    alert.type === 'warning' ? 'text-yellow-400' :
                    alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'success' ? 'text-green-400' :
                    'text-blue-400'
                  }`}>
                    {alert.type === 'warning' ? '⚠️' :
                     alert.type === 'critical' ? '🚨' :
                     alert.type === 'success' ? '✅' : 'ℹ️'} {alert.message}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{alert.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Information Footer */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center space-x-6 flex-wrap">
          <span>Model: {config.deviceModel}</span>
          <span>|</span>
          <span>Firmware: {config.firmwareVersion}</span>
          <span>|</span>
          <span>Serial: {config.serialNumber}</span>
          <span>|</span>
          <span>Installed: {config.installationDate}</span>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <VGuardLogo className="w-6 h-6" />
          <span className="text-yellow-400">Bring home a better tomorrow</span>
        </div>
      </div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-yellow-400">Customize System Stats</h3>
              <button
                onClick={() => setShowCustomizer(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <CustomizerForm 
              initialStats={baseStats}
              onUpdate={handleStatsUpdate}
              onCancel={() => setShowCustomizer(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Customizer Form Component
function CustomizerForm({ 
  initialStats, 
  onUpdate, 
  onCancel 
}: {
  initialStats: { flowRate: number; pressure: number };
  onUpdate: (stats: { flowRate: number; pressure: number }) => void;
  onCancel: () => void;
}) {
  const [flowRate, setFlowRate] = useState(initialStats.flowRate);
  const [pressure, setPressure] = useState(initialStats.pressure);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ flowRate, pressure });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        Customize the base values for Flow Rate and Pressure. The system will show realistic variations around these values.
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Flow Rate (L/min) - Range: 2.0 to 2.5
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="2.0"
            max="2.5"
            step="0.1"
            value={flowRate}
            onChange={(e) => setFlowRate(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm font-medium text-white w-16">
            {flowRate.toFixed(1)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pressure (bar) - Range: 0.6 to 1.0
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0.6"
            max="1.0"
            step="0.1"
            value={pressure}
            onChange={(e) => setPressure(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm font-medium text-white w-16">
            {pressure.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
        <div className="text-xs text-blue-400">
          <strong>Note:</strong> Power and Efficiency values are calculated automatically based on system conditions and cannot be directly customized.
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors font-medium"
        >
          Apply Changes
        </button>
      </div>
    </form>
  );
}

export default App;