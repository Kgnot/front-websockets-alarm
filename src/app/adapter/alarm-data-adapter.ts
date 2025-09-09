import {Address, AlarmData, AlarmUserDevice, User, Location} from '../interfaces/alarm-data';

export function adaptBackendToAlarmData(backendData: any): AlarmData {
  const data = backendData.data;

  const alarmLocation: Location = {
    lat: data.lat,
    lng: data.lng,
    accuracy: data.accuracy,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
  };

  const address: Address = {
    location: alarmLocation
  };

  const user: User = {
    id: data.userId || data.id || 0,
    name: data.name || 'Unknown',
    email: data.email || 'N/A',
    phone: data.cellphone || data.phone || 'N/A',
    address: address,
    isVerified: data.isVerified || false
  };

  const alarmUserDevice: AlarmUserDevice = {
    id: data.deviceId || 0,
    name: data.deviceName || data.device || 'Unknown Device',
    device: data.deviceType || data.device || 'N/A',
    location: alarmLocation
  };

  return {
    id: data.id || crypto.randomUUID(),
    user: user,
    alarmUserDevice: alarmUserDevice,
    active: data.active !== undefined ? data.active : true
  };
}
