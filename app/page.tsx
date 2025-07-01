"use client";

import React, { useState, useEffect, useRef, MutableRefObject } from "react";

// 类型定义 (No changes)
interface ChannelData {
  voltage: string;
  current: string;
  frequency: string;
  power: string;
  efficiency: string;
  status: "NOMINAL" | "WARNING" | "ERROR" | "OFFLINE" | "OVERLOAD";
}
interface ChannelCardProps {
  channelData: ChannelData;
  title: string;
  color: {
    border: string;
    text: string;
    gradientFrom: string;
    gradientTo: string;
  };
  iconPaths: IconPaths;
}
interface IconProps {
  path: string;
  className?: string;
}
interface DataFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}
interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: () => void;
  colorClass?: "cyan" | "purple";
}
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorClass?: "green" | "purple";
}

interface ControlPanelProps {
  systemInfo: SystemInfo;
  onModeChange: (mode: string) => void;
  channel1Enabled: boolean;
  onChannel1Toggle: () => void;
  channel2Enabled: boolean;
  onChannel2Toggle: () => void;
  onEmergencyShutdown: () => void;
  voltageCalibration: number;
  onVoltageCalibrationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentLimit: number;
  onCurrentLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxPowerInput: string;
  onMaxPowerInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetMaxPowerLimit: () => void;
}
interface SystemInfo {
  mode: string;
  totalPower: string;
  uptime: string;
  maxPowerLimit: number;
}
interface IconPaths {
  voltage: string;
  current: string;
  power: string;
  frequency: string;
}
interface EventLogItem {
  time: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR";
}

// Helper components (No changes)

const Icon: React.FC<IconProps> = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

const DataField: React.FC<DataFieldProps> = ({ icon, label, value, unit, colorClass }) => (
  <div className="bg-black/50 p-4 rounded-lg flex flex-col justify-between">
    <div className="flex items-center text-gray-400 mb-2">
      {icon}
      <span className="ml-2 text-sm font-medium tracking-wider">{label}</span>
    </div>
    <div>
      <span className={`text-4xl font-mono font-bold ${colorClass}`}>
        {value}
      </span>
      <span className={`text-lg ml-2 ${colorClass}/80`}>{unit}</span>
    </div>
  </div>
);

const ChannelCard: React.FC<ChannelCardProps> = ({ channelData, title, color, iconPaths }) => {
  const statusColors: Record<ChannelData["status"], string> = {
    NOMINAL: "text-green-400",
    WARNING: "text-yellow-400",
    ERROR: "text-red-500",
    OFFLINE: "text-gray-500",
    OVERLOAD: "text-orange-400 animate-pulse",
  };
  const statusBgColors: Record<ChannelData["status"], string> = {
    NOMINAL: "bg-green-500",
    WARNING: "bg-yellow-500",
    ERROR: "bg-red-500",
    OFFLINE: "bg-gray-500",
    OVERLOAD: "bg-orange-500",
  };
  const isOffline = channelData.status === 'OFFLINE';

  return (
    <div className={`bg-gray-900/50 border-2 ${color.border} rounded-xl p-6 shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 ${isOffline ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${color.text} tracking-widest`}>{title}</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${statusBgColors[channelData.status]} rounded-full ${channelData.status !== 'OFFLINE' ? 'animate-pulse' : ''}`}></div>
          <span className={`${statusColors[channelData.status]} font-semibold text-lg`}>{channelData.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <DataField icon={<Icon path={iconPaths.voltage} />} label="VOLTAGE" value={channelData.voltage} unit="V" colorClass={color.text} />
        <DataField icon={<Icon path={iconPaths.current} />} label="CURRENT" value={channelData.current} unit="A" colorClass={color.text} />
        <DataField icon={<Icon path={iconPaths.power} />} label="POWER" value={channelData.power} unit="W" colorClass={color.text} />
        <DataField icon={<Icon path={iconPaths.frequency} />} label="FREQUENCY" value={channelData.frequency} unit="Hz" colorClass={color.text} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm font-medium tracking-wider">SYSTEM EFFICIENCY</span>
          <span className="text-2xl font-mono font-bold text-green-400">{channelData.efficiency}%</span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-4 border border-gray-700 p-0.5">
          <div
            className={`bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo} h-full rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${channelData.efficiency !== "-" ? channelData.efficiency : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, onChange, colorClass = "green" }) => {
  const colorVariants: Record<"green" | "purple", string> = { green: 'accent-green-500', purple: 'accent-purple-500' };
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="text-gray-400 text-sm font-medium tracking-wider">{label}</label>
        <span className="font-mono font-bold text-lg text-white">{value.toFixed(1)} <span className="text-gray-400 text-sm">{unit}</span></span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer ${colorVariants[colorClass]}`}
        style={{ backgroundSize: `${percentage}% 100%` }}
      />
    </div>
  );
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, colorClass = "cyan" }) => {
  const colorVariants: Record<"cyan" | "purple", string> = { cyan: "peer-checked:bg-cyan-500", purple: "peer-checked:bg-purple-500" };
  return (
    <label className="flex flex-col items-center cursor-pointer">
      <span className="text-gray-300 text-sm font-medium mb-2 tracking-wider">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only peer" checked={enabled} onChange={onChange} />
        <div className="w-14 h-8 bg-black/50 rounded-full border border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-300 after:border after:border-gray-500 after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 ${colorVariants[colorClass]} ${enabled ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  systemInfo, onModeChange, channel1Enabled, onChannel1Toggle, channel2Enabled, onChannel2Toggle, onEmergencyShutdown,
  voltageCalibration, onVoltageCalibrationChange, currentLimit, onCurrentLimitChange, maxPowerInput, onMaxPowerInputChange, onSetMaxPowerLimit
}) => {
  const modes = ["AUTO-PILOT", "MANUAL", "STANDBY"];
  
  const getButtonClass = (mode: string) => {
    const baseClass = "px-4 py-2 rounded-md font-bold tracking-widest transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
    if (systemInfo.mode === mode) {
      return `${baseClass} bg-green-500 text-black shadow-lg shadow-green-500/30`;
    }
    return `${baseClass} bg-black/50 text-gray-300 hover:bg-green-500/30 hover:text-white`;
  };

  return (
    <div className="lg:col-span-2 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl p-6 shadow-lg shadow-black/30 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-green-400 tracking-widest mb-6 border-b-2 border-green-500/30 pb-3">CONTROL PANEL</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
        <div className="flex flex-col items-center space-y-4">
          <h4 className="text-lg font-semibold text-gray-400 tracking-wider">SYSTEM MODE</h4>
          <div className="flex space-x-2 rounded-lg bg-black/50 p-1 border border-gray-700">
            {modes.map(mode => (
              <button key={mode} onClick={() => onModeChange(mode)} className={getButtonClass(mode)}>{mode}</button>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center space-x-8">
          <ToggleSwitch label="CHANNEL 1" enabled={channel1Enabled} onChange={onChannel1Toggle} colorClass="purple" />
          <ToggleSwitch label="CHANNEL 2" enabled={channel2Enabled} onChange={onChannel2Toggle} colorClass="cyan" />
        </div>
        <div className="flex flex-col items-center">
           <h4 className="text-lg font-semibold text-red-500/80 tracking-wider mb-2">CRITICAL ACTIONS</h4>
           <button onClick={onEmergencyShutdown} className="px-6 py-3 font-bold text-lg text-white bg-red-600/80 rounded-lg border-2 border-red-500/50 shadow-lg shadow-red-500/30 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2">
              <Icon path="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <span>SHUTDOWN</span>
           </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-t-2 border-green-500/30 pt-6">
        <div className="md:col-span-2 flex flex-col space-y-4">
          <h4 className="text-lg font-semibold text-gray-400 tracking-wider mb-2">OUTPUT REGULATION</h4>
          <Slider label="VOLTAGE CALIBRATION" value={voltageCalibration} min={-20} max={20} step={0.5} unit="V" onChange={onVoltageCalibrationChange} colorClass="purple" />
          <Slider label="CURRENT LIMIT" value={currentLimit} min={1} max={10} step={0.1} unit="A" onChange={onCurrentLimitChange} colorClass="green"/>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-400 tracking-wider mb-2">POWER MANAGEMENT</h4>
          <div className="flex flex-col items-center space-y-3 w-full">
            <input 
              type="number"
              value={maxPowerInput}
              onChange={onMaxPowerInputChange}
              className="bg-black/50 border border-gray-600 rounded-md text-center font-mono text-2xl text-white w-full py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Watts"
            />
            <button onClick={onSetMaxPowerLimit} className="w-full px-4 py-2 font-bold tracking-wider text-black bg-green-500 rounded-md hover:bg-green-400 transition-colors">
              SET MAX POWER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Main App Component
export default function App() {
  const [channel1, setChannel1] = useState<ChannelData>({ voltage: "-", current: "-", frequency: "-", power: "-", efficiency: "-", status: "OFFLINE" });
  const [channel2, setChannel2] = useState<ChannelData>({ voltage: "-", current: "-", frequency: "-", power: "-", efficiency: "-", status: "OFFLINE" });
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({ mode: "AUTO-PILOT", totalPower: "-", uptime: "00:00:00", maxPowerLimit: 2500 });
  const [eventLog, setEventLog] = useState<EventLogItem[]>([]);
  const [startTime] = useState<Date>(new Date());
  
  // State for UI controls
  const [channel1Enabled, setChannel1Enabled] = useState(true);
  const [channel2Enabled, setChannel2Enabled] = useState(true);
  const [voltageCalibration, setVoltageCalibration] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(7.0);
  const [maxPowerInput, setMaxPowerInput] = useState(systemInfo.maxPowerLimit.toString());
  
  const dataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const addEvent = (message: string, type: EventLogItem["type"]) => {
    const newEvent: EventLogItem = { time: new Date().toLocaleTimeString(), message, type };
    setEventLog(prev => [newEvent, ...prev.slice(0, 9)]);
  };

  // ==================================================================
  // =================== MODIFIED DATA FETCHING LOGIC =================
  // ==================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the Next.js API route
        const response = await fetch('/api/data'); // Assumes route is at /api/data
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error('Invalid API response format');
        }
        
        const apiData = result.data; // Contains { voltage1, current1, voltage2, current2 }

        // Determine channel data based on whether it's enabled in the UI
        let data1 = {
            voltage: channel1Enabled ? apiData.voltage1 : 0,
            current: channel1Enabled ? apiData.current1 : 0,
            status: (channel1Enabled ? "NOMINAL" : "OFFLINE") as ChannelData["status"]
        };
        
        let data2 = {
            voltage: channel2Enabled ? apiData.voltage2 : 0,
            current: channel2Enabled ? apiData.current2 : 0,
            status: (channel2Enabled ? "NOMINAL" : "OFFLINE") as ChannelData["status"]
        };

        // Perform client-side checks against UI controls
        const baseNominalVoltage = 220; // Assume a standard voltage to calibrate against
        if (data1.status === "NOMINAL" && (Math.abs(data1.voltage - (baseNominalVoltage + voltageCalibration)) > 15 || data1.current > currentLimit)) {
            data1.status = "WARNING";
        }
        if (data2.status === "NOMINAL" && (Math.abs(data2.voltage - (baseNominalVoltage + voltageCalibration)) > 15 || data2.current > currentLimit)) {
            data2.status = "WARNING";
        }

        // Calculate total power and check for system-wide overload
        const power1 = data1.voltage * data1.current;
        const power2 = data2.voltage * data2.current;
        const totalPowerNum = power1 + power2;

        if (totalPowerNum > systemInfo.maxPowerLimit && systemInfo.maxPowerLimit > 0) {
            if (data1.status !== "OFFLINE") data1.status = "OVERLOAD";
            if (data2.status !== "OFFLINE") data2.status = "OVERLOAD";
            if(Math.random() > 0.5) addEvent('MAX POWER EXCEEDED', 'ERROR');
        }

        // Helper to format the final data for the UI
        const formatChannelData = (data: { voltage: number; current: number; status: ChannelData["status"] }): ChannelData => ({
            voltage: data.status !== 'OFFLINE' ? data.voltage.toFixed(1) : "-",
            current: data.status !== 'OFFLINE' ? data.current.toFixed(2) : "-",
            power: (data.voltage > 0 && data.current > 0) ? (data.voltage * data.current).toFixed(0) : "-",
            efficiency: (data.voltage > 0 && data.current > 0) ? (94 + Math.random() * 5).toFixed(1) : "-", // Retain random efficiency
            status: data.status,
            frequency: data.status !== 'OFFLINE' ? '50.0' : '-'
        });

        setChannel1(formatChannelData(data1));
        setChannel2(formatChannelData(data2));
        setSystemInfo(prev => ({...prev, totalPower: totalPowerNum.toFixed(0)}));

      } catch (error) {
        console.error("Failed to fetch data:", error);
        addEvent('Data source connection lost', 'ERROR');
        const errorState: ChannelData = { voltage: "N/A", current: "N/A", power: "N/A", efficiency: "-", frequency: "-", status: "ERROR" };
        // Only set error state on channels that are supposed to be online
        if (channel1Enabled) setChannel1(errorState);
        if (channel2Enabled) setChannel2(errorState);
      }
    };
  
    fetchData(); // Fetch data immediately on component mount
    dataIntervalRef.current = setInterval(fetchData, 2000); // Poll for new data every 2 seconds
    
    return () => { if (dataIntervalRef.current) clearInterval(dataIntervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel1Enabled, channel2Enabled, voltageCalibration, currentLimit, systemInfo.maxPowerLimit]); 
  
  // Uptime timer (No changes)
  useEffect(() => {
    const uptimeInterval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setSystemInfo(prev => ({...prev, uptime: `${h}:${m}:${s}`}));
    }, 1000);
    return () => clearInterval(uptimeInterval);
  }, [startTime]);
  
  // Event handler functions (No changes)
  const handleModeChange = (newMode: string) => {
    if (systemInfo.mode === 'SHUTDOWN') return;
    setSystemInfo(prev => ({ ...prev, mode: newMode }));
    addEvent(`System mode changed to ${newMode}`, 'INFO');
  };

  const handleChannelToggle = (channelNum: number) => {
    if (systemInfo.mode === 'SHUTDOWN') return;
    if (channelNum === 1) {
        setChannel1Enabled(prev => { addEvent(`Channel 1 set to ${!prev ? 'ONLINE' : 'OFFLINE'}`, 'WARNING'); return !prev; });
    } else {
        setChannel2Enabled(prev => { addEvent(`Channel 2 set to ${!prev ? 'ONLINE' : 'OFFLINE'}`, 'WARNING'); return !prev; });
    }
  };
  
  const handleEmergencyShutdown = () => {
    if (dataIntervalRef.current) clearInterval(dataIntervalRef.current);
    addEvent('EMERGENCY SHUTDOWN INITIATED', 'ERROR');
    setSystemInfo(prev => ({ ...prev, mode: 'SHUTDOWN', totalPower: '0' }));
    const offlineState: ChannelData = { voltage: "-", current: "-", power: "-", efficiency: "-", frequency: "-", status: "OFFLINE" };
    setChannel1(offlineState); setChannel2(offlineState);
    setChannel1Enabled(false); setChannel2Enabled(false);
  };
  
  const handleVoltageCalibrationChange = (e: React.ChangeEvent<HTMLInputElement>) => setVoltageCalibration(parseFloat(e.target.value));
  const handleCurrentLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentLimit(parseFloat(e.target.value));
  const handleMaxPowerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxPowerInput(e.target.value);
  const handleSetMaxPowerLimit = () => {
    const newLimit = parseInt(maxPowerInput, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setSystemInfo(prev => ({ ...prev, maxPowerLimit: newLimit }));
      addEvent(`Max power limit set to ${newLimit}W`, 'INFO');
    } else {
      addEvent('Invalid max power limit', 'ERROR');
    }
  };
  // ==================================================================

  const iconPaths: IconPaths = { voltage: "M13 3L4 14h9l-1 8 9-11h-9z", current: "M12 20.9l4.95-4.95a7 7 0 1 0-9.9 0L12 20.9z", power: "M5 12h14", frequency: "M3 12h2l3-9 4 18 3-9h2" };
  const eventLogColors: Record<EventLogItem["type"], string> = { INFO: "text-cyan-400", WARNING: "text-yellow-400", ERROR: "text-red-500" };
  const isPowerOverloaded = parseInt(systemInfo.totalPower, 10) > systemInfo.maxPowerLimit;

  return (
    <>
      <style>{`
        .text-glow-cyan { text-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5); }
        .text-glow-purple { text-shadow: 0 0 5px rgba(192, 132, 252, 0.7), 0 0 10px rgba(192, 132, 252, 0.5); }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
        input[type="range"]::-webkit-slider-runnable-track { height: 0.5rem; background: #00000080; border-radius: 0.5rem; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -4px; background-color: #cbd5e1; height: 20px; width: 20px; border-radius: 50%; border: 2px solid #4a5568; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="bg-black text-gray-200 font-mono min-h-screen p-4 sm:p-6 lg:p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,43,54,0.3)_0,_rgba(40,43,54,0)_60%)]"></div>
        <div className="relative z-10">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b-2 border-cyan-500/30 pb-4">
            <h1 className="text-4xl font-bold text-cyan-400 text-glow-cyan tracking-widest">SYSTEM MONITOR</h1>
            <div className="flex space-x-6 mt-4 sm:mt-0 text-lg">
                <div className="text-purple-300">MODE: <span className="font-bold">{systemInfo.mode}</span></div>
                <div className="text-purple-300">UPTIME: <span className="font-bold">{systemInfo.uptime}</span></div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChannelCard channelData={{
  ...channel1,
  power: (!isNaN(parseFloat(channel1.voltage)) && !isNaN(parseFloat(channel1.current))) ? (parseFloat(channel1.voltage) * parseFloat(channel1.current)).toFixed(1) : "-"
}} title="CHANNEL 1" color={{ border: "border-purple-500/60", text: "text-purple-300", gradientFrom: "from-purple-600", gradientTo: "to-purple-400" }} iconPaths={iconPaths} />
            <ChannelCard channelData={{
  ...channel2,
  power: (!isNaN(parseFloat(channel2.voltage)) && !isNaN(parseFloat(channel2.current))) ? (parseFloat(channel2.voltage) * parseFloat(channel2.current)).toFixed(1) : "-"
}} title="CHANNEL 2" color={{ border: "border-cyan-500/60", text: "text-cyan-300", gradientFrom: "from-cyan-600", gradientTo: "to-cyan-400" }} iconPaths={iconPaths} />
            
            <ControlPanel 
              systemInfo={systemInfo} onModeChange={handleModeChange}
              channel1Enabled={channel1Enabled} onChannel1Toggle={() => handleChannelToggle(1)}
              channel2Enabled={channel2Enabled} onChannel2Toggle={() => handleChannelToggle(2)}
              onEmergencyShutdown={handleEmergencyShutdown}
              voltageCalibration={voltageCalibration} onVoltageCalibrationChange={handleVoltageCalibrationChange}
              currentLimit={currentLimit} onCurrentLimitChange={handleCurrentLimitChange}
              maxPowerInput={maxPowerInput} onMaxPowerInputChange={handleMaxPowerInputChange}
              onSetMaxPowerLimit={handleSetMaxPowerLimit}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 border-2 border-gray-700/50 rounded-xl p-6 shadow-lg shadow-black/30">
                    <h3 className="text-2xl font-bold text-green-400 tracking-widest mb-4">SYSTEM WIDE</h3>
                    <div className="bg-black/50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-400 mb-2">
                            <Icon path="M5 12h14M12 5l7 7-7 7" />
                            <span className="ml-2 text-sm font-medium tracking-wider">TOTAL POWER OUTPUT</span>
                        </div>
                        <div>
                            <span className={`text-6xl font-mono font-bold ${isPowerOverloaded ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>{(voltageCalibration * currentLimit).toFixed(1)}</span>
                            <span className={`text-2xl ml-2 ${isPowerOverloaded ? 'text-red-500/80' : 'text-green-400/80'}`}>W</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 tracking-wider">LIMIT: {systemInfo.maxPowerLimit}W</div>
                    </div>
                </div>

                <div className="bg-gray-900/50 border-2 border-gray-700/50 rounded-xl p-6 shadow-lg shadow-black/30">
                    <h3 className="text-2xl font-bold text-yellow-400 tracking-widest mb-4">EVENT LOG</h3>
                    <div className="space-y-2 text-sm h-36 overflow-y-auto pr-2">
                        {eventLog.length > 0 ? eventLog.map((event, index) => (
                            <div key={index} className="flex justify-between items-center animate-fadeIn">
                                <span className="text-gray-500">{event.time}</span>
                                <p className={`${eventLogColors[event.type]} font-semibold text-right`}>{event.message}</p>
                            </div>
                        )) : <p className="text-gray-600">-- NO EVENTS LOGGED --</p>}
                    </div>
                </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}