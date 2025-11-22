import React, { useState, useMemo, useEffect } from "react";
import { aggregateByRegion } from "../utils/aggregate";

export default function RegionTable({ data }) {
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [channelFilter, setChannelFilter] = useState("all");
  const [channelPage, setChannelPage] = useState({});
  const channelPageSize = 5;

  const channelList = useMemo(() => {
    const set = new Set();
    data.forEach((d) => set.add(d.channel));
    return ["all", ...Array.from(set)];
  }, [data]);

  // AGGREGATION + SORT
  const regions = useMemo(() => {
    const arr = aggregateByRegion(data);
    arr.sort((a, b) =>
      sortOrder === "asc"
        ? a.region.localeCompare(b.region)
        : b.region.localeCompare(a.region)
    );
    return arr;
  }, [data, sortOrder]);

  // REGION SEARCH + CHANNEL FILTER
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return regions
      .map((r) => ({
        ...r,
        channels:
          channelFilter === "all"
            ? r.channels
            : r.channels.filter((c) => c.channel === channelFilter)
      }))
      .filter((r) => r.region.toLowerCase().includes(q)); // search only region
  }, [regions, search, channelFilter]);

  // COLLAPSE WHEN ALL FILTERS CLEARED
  useEffect(() => {
    const noSearch = !search.trim();
    const noFilter = channelFilter === "all";

    if (noSearch && noFilter) {
      setOpen({});
      setChannelPage({});
    }
  }, [search, channelFilter]);

  // CHANNEL FILTER HANDLER
  const handleChannelFilter = (selected) => {
    setChannelFilter(selected);

    setOpen({});
    setChannelPage({});
    setPage(1);

    if (selected !== "all") {
      const expanded = {};
      filtered.forEach((r) => {
        if (r.channels.some((c) => c.channel === selected)) {
          expanded[r.region] = true;
        }
      });
      setOpen(expanded);
    }
  };

  // REGION PAGINATION
  const paginatedRegions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleRegion = (region) => {
    setOpen((prev) => ({ ...prev, [region]: !prev[region] }));
    setChannelPage((prev) => ({ ...prev, [region]: 1 }));
  };

  return (
    <div className="card">
      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          className="input"
          placeholder="Search region..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            setChannelPage({});
          }}
        />

        <select
          className="input"
          value={channelFilter}
          onChange={(e) => handleChannelFilter(e.target.value)}
        >
          {channelList.map((ch) => (
            <option key={ch} value={ch}>
              {ch === "all" ? "All Channels" : ch}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Region
              <button
                className="btn"
                style={{ padding: "2px 6px", fontSize: "11px" }}
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? "▲" : "▼"}
              </button>
            </th>
            <th>Spend</th>
            <th>Impressions</th>
            <th>Conversions</th>
            <th>Clicks</th>
            <th>CTR</th>
          </tr>
        </thead>

        <tbody>
          {paginatedRegions.map((r) => (
            <React.Fragment key={r.region}>
              {/* REGION ROW */}
              <tr
                className="region-row"
                style={{ cursor: "pointer" }}
                onClick={() => toggleRegion(r.region)}
              >
                <td>▸ {r.region}</td>
                <td>${r.spend.toFixed(2)}</td>
                <td>{r.impressions.toLocaleString()}</td>
                <td>{r.conversions}</td>
                <td>{r.clicks}</td>
                <td>
                  {((r.conversions / r.impressions) * 100).toFixed(2)}%
                </td>
              </tr>

              {/* CHANNELS + PAGINATION */}
              {open[r.region] &&
                (() => {
                  const currentPage = channelPage[r.region] || 1;
                  const start = (currentPage - 1) * channelPageSize;

                  const paginatedChannels = r.channels.slice(
                    start,
                    start + channelPageSize
                  );

                  return (
                    <>
                      {paginatedChannels.map((c) => (
                        <tr key={c.channel}>
                          <td style={{ paddingLeft: "30px" }}>{c.channel}</td>
                          <td>${c.spend.toFixed(2)}</td>
                          <td>{c.impressions.toLocaleString()}</td>
                          <td>{c.conversions}</td>
                          <td>{c.clicks}</td>
                          <td>
                            {(
                              (c.conversions / c.impressions) *
                              100
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}

                      {/* CHANNEL PAGINATION */}
                      {r.channels.length > channelPageSize && (
                        <tr>
                          <td colSpan="6" style={{ paddingLeft: "30px" }}>
                            <button
                              className="btn"
                              onClick={() =>
                                setChannelPage((prev) => ({
                                  ...prev,
                                  [r.region]: Math.max(1, currentPage - 1)
                                }))
                              }
                              disabled={currentPage === 1}
                            >
                              Prev
                            </button>

                            <span style={{ margin: "0 10px" }}>
                              Page {currentPage} of{" "}
                              {Math.ceil(
                                r.channels.length / channelPageSize
                              )}
                            </span>

                            <button
                              className="btn"
                              onClick={() =>
                                setChannelPage((prev) => ({
                                  ...prev,
                                  [r.region]: Math.min(
                                    Math.ceil(
                                      r.channels.length / channelPageSize
                                    ),
                                    currentPage + 1
                                  )
                                }))
                              }
                              disabled={
                                currentPage >=
                                Math.ceil(
                                  r.channels.length / channelPageSize
                                )
                              }
                            >
                              Next
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })()}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* REGION PAGINATION */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span style={{ fontSize: "13px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          className="btn"
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
