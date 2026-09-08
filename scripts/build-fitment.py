"""Derive the vehicle hierarchy and part fitment from OE part-number prefixes."""
import json, urllib.request, hashlib

# ── chassis prefixes -> (model_id, generation_code, year_from, year_to) ──────
CHASSIS = {
 '8L0':('a3','8L',1996,2003), '8P0':('a3','8P',2003,2013), '1K0':('a3','8P',2003,2013),
 '8V0':('a3','8V',2012,2020), '8V4':('a3','8V',2012,2020), '8V5':('a3','8V',2012,2020),
 '5Q0':('a3','8V',2012,2020), '8Y0':('a3','8Y',2020,2026), '8Y5':('a3','8Y',2020,2026),
 '5WA':('a3','8Y',2020,2026), '1J0':('a3','8L',1996,2003), '2Q0':('a1','GB',2018,2026),
 '8E0':('a4','B7',2000,2008), '8H0':('a4','B7',2000,2008),
 '8K0':('a4','B8',2007,2016), '8K5':('a4','B8',2007,2016), '8K9':('a4','B8',2007,2016),
 '8W0':('a4','B9',2015,2026), '8W2':('a4','B9',2015,2026), '8W5':('a4','B9',2015,2026),
 '8W9':('a4','B9',2015,2026),
 '8W6':('a5','F5',2016,2026), '8W7':('a5','F5',2016,2026), '8W8':('a5','F5',2016,2026),
 '8T0':('a5','8T',2007,2017), '8F0':('a5','8F',2009,2017),
 '8B3':('a5','8B',2024,2026), '8B5':('a5','8B',2024,2026),
 '4B0':('a6','C5',1997,2005), '4F0':('a6','C6',2004,2011),
 '4G0':('a6','C7',2010,2018), '4G5':('a6','C7',2010,2018),
 '4K0':('a6','C8',2018,2026), '4K5':('a6','C8',2018,2026),
 '4G8':('a7','C7',2010,2018), '4K8':('a7','C8',2018,2026), '4KE':('a6','C8',2018,2026),
 '4E0':('a8','D3',2002,2010), '4H0':('a8','D4',2010,2017), '4N0':('a8','D5',2017,2026),
 '8U0':('q3','8U',2011,2018), '83H':('q3','F3',2018,2026), '85E':('q3','F3',2018,2026),
 '85F':('q3','F3',2018,2026), '85H':('q3','F3',2018,2026),
 '8R0':('q5','8R',2008,2017), '80A':('q5','FY',2017,2026), '80F':('q5','FY',2017,2026),
 '4L0':('q7','4L',2005,2015), '4M0':('q7','4M',2015,2026), '4M6':('q7','4M',2015,2026),
 '4M8':('q8','4M',2018,2026), '4MN':('q8','4M',2018,2026),
 '420':('r8','42',2006,2015), '4S0':('r8','4S',2015,2024), '4S8':('r8','4S',2015,2024),
 '8J8':('tt','8J',2006,2014), '8S0':('tt','8S',2014,2023),
 '89A':('q4-etron','89',2021,2026), '89E':('q4-etron','89',2021,2026),
 '1EA':('q4-etron','89',2021,2026),
 '6R0':('vw-polo','6R',2009,2017), '6N0':('vw-polo','6N',1994,2002),
 '6Q0':('vw-polo','9N',2001,2009), '7L0':('vw-touareg','7L',2002,2010),
 '7B0':('vw-touareg','7L',2002,2010),
 '9J1':('taycan','J1',2019,2026),
}

# ── engine-family prefixes -> (engine_id, [generation keys it powers]) ───────
ENGINE_FIT = {
 '06A':('18t-20v',   [('a3','8L'),('a4','B7'),('tt','8J')]),
 '06B':('18t-20v',   [('a4','B7'),('a6','C5'),('tt','8J')]),
 '058':('18t-20v',   [('a4','B7'),('a6','C5'),('tt','8J')]),
 '06D':('20-fsi',    [('a3','8P'),('a4','B7')]),
 '06J':('ea888-g2',  [('a3','8P'),('a4','B8'),('a5','8T'),('q5','8R'),('tt','8J')]),
 '06K':('ea888-g3',  [('a3','8V'),('a4','B9'),('a5','F5'),('q5','FY'),('tt','8S')]),
 '06L':('ea888-g3',  [('a3','8V'),('a4','B9'),('a5','F5'),('q5','FY'),('tt','8S')]),
 '06M':('ea888-evo', [('a3','8Y'),('a4','B9'),('a5','F5'),('q5','FY')]),
 '04E':('ea211',     [('a1','GB'),('a3','8V'),('a3','8Y')]),
 '06C':('v6-30v',    [('a4','B7'),('a6','C5'),('a8','D3')]),
 '06E':('v6-fsi',    [('a4','B8'),('a5','8T'),('a6','C6'),('a6','C7'),('a7','C7'),('a8','D4'),('q5','8R'),('q7','4L')]),
 '06H':('ea888-g2',  [('a4','B8'),('a5','8T'),('q5','8R')]),
 '078':('v6-30v',    [('a4','B7'),('a6','C5')]),
 '079':('v8-42',     [('a6','C6'),('a8','D3'),('q7','4L'),('r8','42')]),
 '077':('v8-42',     [('a8','D3'),('r8','42')]),
 '07L':('v10-52',    [('r8','42'),('s8','D3')]),
 '07K':('25-tfsi',   [('tt','8S'),('a3','8V')]),
 '07C':('w12',       [('a8','D3'),('a8','D4')]),
 '07P':('w12',       [('a8','D4')]),
 '059':('v6-tdi',    [('a4','B8'),('a6','C6'),('a6','C7'),('a8','D4'),('q7','4L')]),
 '03N':('ea288',     [('a3','8V'),('a4','B9'),('q5','FY')]),
 '03H':('vr6-36',    [('q7','4L'),('vw-touareg','7L')]),
 '021':('vr6-36',    [('q7','4L')]),
 '022':('vr6-36',    [('q7','4L')]),
 '032':('18t-20v',   [('a3','8L')]),
 '056':('18t-20v',   [('a6','C5')]),
 '057':('v6-30v',    [('a6','C5')]),
 '071':('ea888-g3',  [('a4','B9')]),
 '06N':('18t-20v',   [('a3','8L'),('tt','8J')]),
 '06Q':('20-fsi',    [('a3','8P'),('a4','B7')]),
 '01M':('unspecified',[('a3','8L'),('a4','B7')]),
 '0B5':('unspecified',[('a4','B8'),('a5','8T'),('a6','C7'),('a7','C7'),('q5','8R')]),
}

MODELS = {
 'a1':('Audi A1','audi'),'a3':('Audi A3','audi'),'a4':('Audi A4','audi'),
 'a5':('Audi A5','audi'),'a6':('Audi A6','audi'),'a7':('Audi A7','audi'),
 'a8':('Audi A8','audi'),'s8':('Audi S8','audi'),'q3':('Audi Q3','audi'),
 'q5':('Audi Q5','audi'),'q7':('Audi Q7','audi'),'q8':('Audi Q8','audi'),
 'tt':('Audi TT','audi'),'r8':('Audi R8','audi'),
 'q4-etron':('Audi Q4 e-tron','audi'),
 'vw-polo':('VW Polo','vw'),'vw-touareg':('VW Touareg','vw'),
 'taycan':('Porsche Taycan','porsche'),
}
ENGINES = {
 'unspecified':('—','Unspecified / all engines',None,None,None,None),
 '18t-20v':('1.8T','1.8T 20V',1.8,4,'petrol','turbo'),
 '20-fsi':('2.0 FSI','2.0 FSI',2.0,4,'petrol','naturally-aspirated'),
 'ea888-g2':('EA888','2.0 TFSI (EA888 Gen2)',2.0,4,'petrol','turbo'),
 'ea888-g3':('EA888','2.0 TFSI (EA888 Gen3)',2.0,4,'petrol','turbo'),
 'ea888-evo':('EA888','2.0 TFSI (EA888 evo)',2.0,4,'petrol','turbo'),
 'ea211':('EA211','1.2 / 1.4 TFSI (EA211)',1.4,4,'petrol','turbo'),
 'ea288':('EA288','2.0 TDI (EA288)',2.0,4,'diesel','turbo'),
 'v6-30v':('AHA/ATQ','2.4 / 2.8 V6 30V',2.8,6,'petrol','naturally-aspirated'),
 'v6-fsi':('CALA','3.0 / 3.2 FSI V6',3.2,6,'petrol','naturally-aspirated'),
 'v6-tdi':('BMK/CDY','2.5 / 3.0 TDI V6',3.0,6,'diesel','turbo'),
 'v8-42':('BAR/BNS','4.2 V8 FSI',4.2,8,'petrol','naturally-aspirated'),
 'v10-52':('BUJ/CTP','5.2 V10 FSI',5.2,10,'petrol','naturally-aspirated'),
 'w12':('BHT/CEJ','6.0 W12',6.0,12,'petrol','naturally-aspirated'),
 'vr6-36':('BHK/CJT','3.6 VR6 FSI',3.6,6,'petrol','naturally-aspirated'),
 '25-tfsi':('DAZA','2.5 TFSI 5-cyl',2.5,5,'petrol','turbo'),
}
MAKES = {'audi':'Audi','vw':'Volkswagen','porsche':'Porsche'}

def env(p='.env'):
    o={}
    for l in open(p):
        l=l.strip()
        if l and not l.startswith('#') and '=' in l:
            k,v=l.split('=',1); o[k.strip()]=v.strip().strip('"').strip("'")
    return o

def fetch_parts():
    e=env(); url=e['NEXT_PUBLIC_SUPABASE_URL'].rstrip('/'); sec=e['SUPBASE_SECRET_KEY']
    r=urllib.request.Request(f"{url}/rest/v1/parts?select=sku,oe_prefix,oe_group&limit=2000",
      headers={'apikey':sec,'Authorization':f'Bearer {sec}','Accept':'application/json'})
    with urllib.request.urlopen(r,timeout=30) as x: return json.loads(x.read())

def build():
    parts = fetch_parts()
    gens, vehicles = {}, []
    for pre,(model,code,y0,y1) in CHASSIS.items():
        gens[(model,code)] = (y0,y1)
    for eng,(eid,fits) in ENGINE_FIT.items():
        for key in fits:
            if key not in gens:
                gens[key] = (2000,2020)   # conservative default for engines only
    for (model,code),(y0,y1) in sorted(gens.items()):
        for yr in range(y0, y1+1):
            vehicles.append((f"{model}-{code.lower()}-{yr}", f"{model}-{code.lower()}", yr))

    fitment=set(); unmapped=[]
    vid_by_gen={}
    for vid,gid,yr in vehicles: vid_by_gen.setdefault(gid,[]).append(vid)

    for p in parts:
        pre=p['oe_prefix']
        if not pre: unmapped.append(p['sku']); continue
        if pre in CHASSIS:
            m,c,_,_ = CHASSIS[pre]; keys=[(m,c)]
        elif pre in ENGINE_FIT:
            keys = ENGINE_FIT[pre][1]
        else:
            unmapped.append(p['sku']); continue
        for m,c in keys:
            for vid in vid_by_gen.get(f"{m}-{c.lower()}", []):
                fitment.add((p['sku'], vid))
    return parts, gens, vehicles, sorted(fitment), unmapped

if __name__ == '__main__':
    parts, gens, vehicles, fitment, unmapped = build()
    print(f"parts            {len(parts)}")
    print(f"generations      {len(gens)}")
    print(f"vehicles         {len(vehicles)}")
    print(f"fitment rows     {len(fitment)}")
    print(f"parts mapped     {len(parts)-len(unmapped)}  ({100*(len(parts)-len(unmapped))//len(parts)}%)")
    print(f"parts unmapped   {len(unmapped)}")
    from collections import Counter
    up=Counter(s.split('-')[1][:3] for s in unmapped)
    print("unmapped prefixes:", dict(up))
