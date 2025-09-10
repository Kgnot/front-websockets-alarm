export interface AlarmData {
  id: string;
  user: User;
  alarmUserDevice: AlarmUserDevice;
  active: boolean;
}


export interface User {
  id: number;
  name: string,
  email: string,
  phone: string,
  address: Address, // dirrección residencia
  isVerified: boolean, // podriamos saber si hay gente verificada o no
}

export interface AlarmUserDevice {
  id: number;
  name: string, // nombre dle dispositivo
  device: string, // quiza como Android, iOS, etc.
  location: Location // desde donde se envio la alarma
}

//direccion integrado a la alarma (casa asociada)
export interface Address {
  location: Location
}

export interface Location {
  lat: number,
  lng: number,
  accuracy?: number; // Precisión del GPS en metros
  timestamp?: Date;
}
