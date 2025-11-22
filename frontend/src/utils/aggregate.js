export function aggregateByRegion(data) {
  const map = new Map();

  for (const r of data) {
    const region = r.region;
    if (!map.has(region))
      map.set(region, {
        region,
        spend: 0,
        impressions: 0,
        conversions: 0,
        clicks: 0,
        channels: new Map()
      });

    const reg = map.get(region);

    reg.spend += r.spend;
    reg.impressions += r.impressions;
    reg.conversions += r.conversions;
    reg.clicks += r.clicks;

    const ch = r.channel;
    if (!reg.channels.has(ch))
      reg.channels.set(ch, {
        channel: ch,
        spend: 0,
        impressions: 0,
        conversions: 0,
        clicks: 0
      });

    const c = reg.channels.get(ch);

    c.spend += r.spend;
    c.impressions += r.impressions;
    c.conversions += r.conversions;
    c.clicks += r.clicks;
  }

  return Array.from(map.values()).map((r) => ({
    ...r,
    channels: Array.from(r.channels.values())
  }));
}
