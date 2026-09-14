"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fieldNotes } from "@/lib/portfolio";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));

export default function NotesIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [exactDate, setExactDate] = useState("");
  const filterOptions = useMemo(() => [
    { value: "all", label: "All topics" },
    ...Array.from(new Set(fieldNotes.flatMap((note) => note.tags))).sort().map((tag) => ({ value: `tag:${tag}`, label: tag })),
  ], []);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matchesFilter = (note: typeof fieldNotes[number]) => filter === "all" || note.tags.includes(filter.slice(4));
    const matchesDate = (note: typeof fieldNotes[number]) => {
      if (exactDate) return note.publishedAt === exactDate;
      if (dateRange === "all") return true;
      const anchor = [...fieldNotes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]?.publishedAt ?? new Date().toISOString().slice(0, 10);
      if (dateRange === "24h") return note.publishedAt === anchor;
      const anchorDate = new Date(`${anchor}T12:00:00Z`);
      const days = dateRange === "week" ? 6 : 29;
      anchorDate.setUTCDate(anchorDate.getUTCDate() - days);
      return note.publishedAt >= anchorDate.toISOString().slice(0, 10) && note.publishedAt <= anchor;
    };
    return fieldNotes.filter((note) => matchesFilter(note) && matchesDate(note) && (!normalized || [note.title, note.summary, note.type, ...note.tags].join(" ").toLowerCase().includes(normalized)));
  }, [query, filter, dateRange, exactDate]);
  useEffect(() => { try { window.localStorage.setItem("notes-search-query", query); } catch { /* optional page context */ } }, [query]);

  return <section className="shell notes-index-shell" aria-label="Searchable field notes">
    <div className="notes-search-row">
      <div className="notes-search-controls"><div className="notes-search-wrap"><span className="notes-search-label">FIND IN NOTES</span><label className="notes-search" htmlFor="notes-search-input"><Search size={16} aria-hidden="true" /><span className="sr-only">Search notes</span><input id="notes-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Topic, tag, or title" />{query && <button type="button" aria-label="Clear note search" onClick={() => setQuery("")}><X size={14}/></button>}<kbd>/</kbd></label></div><div className="notes-filter-group"><span>TOPIC</span><label className="notes-filter"><SlidersHorizontal size={15} aria-hidden="true" /><span className="sr-only">Filter by topic</span><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by topic">{filterOptions.map((option) => <option value={option.value} key={option.value}>{option.value === "all" ? "All topics" : option.label}</option>)}</select></label></div><div className="notes-filter-group"><span>DATE</span><div className="notes-date-controls"><label className="notes-filter notes-date-filter"><span className="sr-only">Filter by date range</span><select value={dateRange} onChange={(event) => { setDateRange(event.target.value); if (event.target.value !== "all") setExactDate(""); }} aria-label="Filter by date range"><option value="all">Any time</option><option value="24h">Past 24 hours</option><option value="week">Past week</option><option value="month">Past month</option></select></label><label className="notes-date-picker"><span className="sr-only">Choose exact date</span><input type="date" value={exactDate} onChange={(event) => { setExactDate(event.target.value); if (event.target.value) setDateRange("all"); }} aria-label="Choose exact date" /></label></div></div></div>
      <span className="notes-result-count">{results.length} <span>of {fieldNotes.length}</span> notes</span>
    </div>
    <div className="notes-list">
      {results.map((note, index) => <article key={note.slug} className="note-row">
        <div className="note-row-index"><span>{String(index + 1).padStart(2, "0")}</span><time dateTime={note.publishedAt}>{formatDate(note.publishedAt)}</time></div>
        <div className="note-row-copy"><span className="note-row-type">{note.type}</span><h2><a className="note-row-title" href={note.href}>{note.title}</a></h2><p>{note.summary}</p><div className="note-row-tags">{note.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      </article>)}
      {results.length === 0 && <p className="notes-empty">No notes match the current search and filters. Try another topic, tag, or date.</p>}
    </div>
  </section>;
}
