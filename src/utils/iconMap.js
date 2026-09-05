import { HeartPulse, Car, ShieldCheck, Plane, Bike, Home, Building2, ScrollText, Activity, Users, HeartHandshake, Stethoscope } from "lucide-react";

export const ICON_MAP = {
  HeartPulse,
  Car,
  ShieldCheck,
  Plane,
  Bike,
  Home,
  Building2,
  ScrollText,
  Activity,
  Users,
  HeartHandshake,
  Stethoscope,
};

export function getIcon(name) {
  return ICON_MAP[name] || ShieldCheck;
}
