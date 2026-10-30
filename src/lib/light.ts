export const lightPhases = ['dawn', 'day', 'golden', 'night'] as const

export type LightPhase = (typeof lightPhases)[number]

export type LightOverride = LightPhase | 'auto'

export type LightState = {
  phase: LightPhase
  minutes: number
  time: string
  ready: boolean
}

const MANILA = 'Asia/Manila'

const formatter = new Intl.DateTimeFormat('en-PH', {
  timeZone: MANILA,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function manilaClock(now: Date = new Date()): { hour: number; minute: number } {
  let hour = 0
  let minute = 0

  for (const part of formatter.formatToParts(now)) {
    if (part.type === 'hour') hour = Number(part.value)
    if (part.type === 'minute') minute = Number(part.value)
  }

  return { hour, minute }
}

export function phaseFromMinutes(minutes: number): LightPhase {
  if (minutes >= 300 && minutes < 420) return 'dawn'
  if (minutes >= 420 && minutes < 960) return 'day'
  if (minutes >= 960 && minutes < 1110) return 'golden'
  return 'night'
}

export function readLight(now: Date = new Date()): LightState {
  const { hour, minute } = manilaClock(now)
  const minutes = hour * 60 + minute

  return {
    phase: phaseFromMinutes(minutes),
    minutes,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    ready: true,
  }
}

export function isLightPhase(value: string | null | undefined): value is LightPhase {
  return value === 'dawn' || value === 'day' || value === 'golden' || value === 'night'
}

export const initialLight: LightState = {
  phase: 'day',
  minutes: 720,
  time: '--:--',
  ready: false,
}

export const lightBootstrap = `(function(){try{var f=new Intl.DateTimeFormat('en-PH',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});var h=0,m=0;f.formatToParts(new Date()).forEach(function(p){if(p.type==='hour')h=Number(p.value);if(p.type==='minute')m=Number(p.value)});var t=h*60+m;var p=t>=300&&t<420?'dawn':t>=420&&t<960?'day':t>=960&&t<1110?'golden':'night';var v=['dawn','day','golden','night'];var q=null;try{q=new URLSearchParams(location.search).get('light')}catch(e){}var s=null;try{s=localStorage.getItem('velaris-light')}catch(e){}if(q&&v.indexOf(q)>-1)p=q;else if(s&&v.indexOf(s)>-1)p=s;document.documentElement.dataset.light=p}catch(e){}})();`
