import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronDown,
  Search,
  Calendar,
  Plus,
} from "lucide-react";
import { serviceListStyles as s } from "../../assets/dummyStyles";

export default function ListServicePage({ apiBase }) {
  const API_BASE = apiBase || "http://localhost:4000";

  const [services, setServices] = useState([]);
  const [openDetails, setOpenDetails] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [editForm, setEditForm] = useState(null);
  const fileRef = useRef();

  // Toasts
  const [toasts, setToasts] = useState([]);
  function addToast(
    message,
    type = "success",
    ttl = 3000,
    position = "bottom-right",
    animated = false
  ) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, position, animated }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Today's date in local timezone as YYYY-MM-DD (for date min)
  const todayISO = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  // ---------- ADDED: sortSlotsForDisplay ----------
function sortSlotsForDisplay(slots = []) {
  if (!Array.isArray(slots)) return [];

  const today = new Date();
  const todayVal = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const dateOnlyVal = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return Number.POSITIVE_INFINITY;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return Number.POSITIVE_INFINITY;
    const y = Number(parts[0]),
      m = Number(parts[1]) - 1,
      d = Number(parts[2]);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d))
      return Number.POSITIVE_INFINITY;
    return Date.UTC(y, m, d);
  };

  // clone so we don't mutate original
  const arr = slots.slice();

  arr.sort((a, b) => {
    const aDateVal = dateOnlyVal(a.date);
    const bDateVal = dateOnlyVal(b.date);

    const aIsPast = aDateVal < todayVal;
    const bIsPast = bDateVal < todayVal;

    // Past dates come first
    if (aIsPast !== bIsPast) return aIsPast ? -1 : 1;

    // If both past: nearest past date first (descending date)
    if (aIsPast && bIsPast && aDateVal !== bDateVal) {
      return bDateVal - aDateVal;
    }

    // If both today/future: earliest date first (ascending)
    if (!aIsPast && !bIsPast && aDateVal !== bDateVal) {
      return aDateVal - bDateVal;
    }

    // Same date (or date missing) -> sort by time-of-day ascending
    const aTs = slotDateTimeToMs(a) || Number.POSITIVE_INFINITY;
    const bTs = slotDateTimeToMs(b) || Number.POSITIVE_INFINITY;
    return aTs - bTs;
  });

  return arr;
}
// ---------- END ADDED ----------


  // Load services from backend
  async function fetchServices() {
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Failed to fetch services", body);
        addToast("Failed to load services", "error");
        setServices([]);
        return;
      }
      // support both { success:true, data: [...] } and older shape
      const items = (body && (body.data || body.services || body.items)) || [];
      // normalize id field for UI
      const normalized = items.map((s) => ({
        id: s._id || s.id,
        name: s.name,
        about: s.about || "",
        instructions: s.instructions || s.preInstructions || [],
        instructionsText: (s.instructions || s.preInstructions || []).join(
          "\n"
        ),
        price: s.price ?? s.fee ?? 0,
        available: s.available ?? s.availability === "Available",
        image: s.image || s.imageUrl || s.imageSrc || s.imageSmall || "",
        // slots: if stored as strings -> convert to array of slot objects for display,
        // if stored as map/object -> convert using convertSlotsMapToArray
        slots: Array.isArray(s.slots)
          ? convertSlotsForUI(s.slots)
          : s.slots && typeof s.slots === "object"
          ? convertSlotsMapToArray(s.slots)
          : [],
        // keep original raw for potential debug
        _raw: s,
      }));
      setServices(normalized);
    } catch (err) {
      console.error("fetchServices error", err);
      addToast("Network error while loading services", "error");
      setServices([]);
    }
  }

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert array of formatted slot-strings into UI-friendly slot objects
  // Convert array of slot-strings (various possible formats) into UI-friendly slot objects
  function convertSlotsForUI(slotStrings = []) {
    return (slotStrings || []).map((s, idx) => {
      const raw = String(s || "");
      // 1) Match your existing "DD Mon YYYY • HH:MM AM" pattern first
      const m = raw.match(
        /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i
      );
      if (m) {
        const day = m[1].padStart(2, "0");
        const monthShort = m[2];
        const year = m[3];
        const hour = String(Number(m[4])); // 1-12
        const minute = String(m[5]).padStart(2, "0");
        const ampm = (m[6] || "AM").toUpperCase();
        const mi = months.findIndex(
          (mm) => mm.toLowerCase() === monthShort.toLowerCase()
        );
        const monthNum = mi >= 0 ? String(mi + 1).padStart(2, "0") : "01";
        const date = `${year}-${monthNum}-${day}`;
        return { id: `s-${idx}`, date, hour, minute, ampm, raw };
      }

      // 2) ISO datetime like "2026-01-06T10:00:00.000Z" or "2026-01-06T10:00:00"
      const isoMatch = raw.match(
        /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?)?/
      );
      if (isoMatch) {
        const datePart = isoMatch[1]; // YYYY-MM-DD (use as-is to avoid TZ shifts)
        let hour = "10";
        let minute = "00";
        let ampm = "AM";
        if (isoMatch[2]) {
          // convert 24h to 12h for UI display (use local conversion for time if desired)
          const hh = Number(isoMatch[2]);
          const mm = String(Number(isoMatch[3] || "0")).padStart(2, "0");
          minute = mm;
          if (hh === 0) {
            hour = "12";
            ampm = "AM";
          } else if (hh === 12) {
            hour = "12";
            ampm = "PM";
          } else if (hh > 12) {
            hour = String(hh - 12);
            ampm = "PM";
          } else {
            hour = String(hh);
            ampm = "AM";
          }
        }
        return { id: `s-${idx}`, date: datePart, hour, minute, ampm, raw };
      }

      // 3) Fallback: if string looks like "HH:MM AM" only, keep date empty
      const timeOnly = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeOnly) {
        const hour = String(Number(timeOnly[1]));
        const minute = String(timeOnly[2]).padStart(2, "0");
        const ampm = (timeOnly[3] || "AM").toUpperCase();
        return {
          id: `s-${idx}`,
          date: "",
          hour,
          minute,
          ampm,
          raw,
        };
      }

      // 4) last fallback: keep raw and empty date so UI won't mis-display
      return {
        id: `s-${idx}`,
        date: "",
        hour: "10",
        minute: "00",
        ampm: "AM",
        raw,
      };
    });
  }

  // Helper: convert Map-like slots (object or Map) to array-of-slot-objects
  function convertSlotsMapToArray(slotsMap) {
    try {
      const out = [];
      if (slotsMap instanceof Map) {
        for (const [date, arr] of slotsMap.entries()) {
          (arr || []).forEach((t, idx) => {
            const parsed = parseFrontendSlotString(date, t);
            out.push({ id: `${date}-${idx}`, ...parsed, raw: t });
          });
        }
      } else {
        for (const date of Object.keys(slotsMap || {})) {
          (slotsMap[date] || []).forEach((t, idx) => {
            const parsed = parseFrontendSlotString(date, t);
            out.push({ id: `${date}-${idx}`, ...parsed, raw: t });
          });
        }
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  // parse strings like "DD Mon YYYY • HH:MM AM" or "HH:MM AM" or ISO time parts — best-effort
  function parseFrontendSlotString(date, timeStr) {
    const slot = {
      date: date || "",
      hour: "10",
      minute: "00",
      ampm: "AM",
      raw: timeStr,
    };

    if (!timeStr) return slot;
    const raw = String(timeStr);

    // If timeStr is an ISO full datetime, extract time portion
    const isoMatch = raw.match(
      /[T\s](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/
    );
    if (isoMatch) {
      const hh24 = Number(isoMatch[1]);
      const mm = String(Number(isoMatch[2])).padStart(2, "0");
      if (hh24 === 0) {
        slot.hour = "12";
        slot.ampm = "AM";
      } else if (hh24 === 12) {
        slot.hour = "12";
        slot.ampm = "PM";
      } else if (hh24 > 12) {
        slot.hour = String(hh24 - 12);
        slot.ampm = "PM";
      } else {
        slot.hour = String(hh24);
        slot.ampm = "AM";
      }
      slot.minute = mm;
      return slot;
    }

    // fallback: "HH:MM AM/PM"
    const m = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (m) {
      slot.hour = String(Number(m[1]));
      slot.minute = String(m[2]).padStart(2, "0");
      slot.ampm = (m[3] || "AM").toUpperCase();
    }
    return slot;
  }

  // Toggle details (only one open at a time)
  function toggleDetails(id) {
    setOpenDetails((prev) => ({ [id]: !prev[id] }));
  }

  // Start editing: fetch fresh service data (optional) and open form
  async function startEdit(service) {
    // try to fetch the latest single service from backend if available
    let latest = service;
    if (service.id) {
      try {
        const res = await fetch(`${API_BASE}/api/services/${service.id}`);
        const body = await res.json().catch(() => null);
        if (res.ok && body) {
          // body might be { success:true, data: service }
          latest = body.data || body.service || body;
        }
      } catch (e) {
        // ignore and use provided object
      }
    }

    const normalized = {
      id: latest._id || latest.id,
      name: latest.name || "",
      about: latest.about || "",
      // instructions (one per line)
      instructionsText: (
        latest.instructions ||
        latest.preInstructions ||
        []
      ).join("\n"),
      price: latest.price ?? latest.fee ?? 0,
      available:
        latest.available ?? latest.availability === "Available" ?? true,
      // show remote image URL as preview if present
      imagePreview: latest.imageUrl || latest.image || latest.imageSrc || "",
      imageFile: null, // file chosen by user when changing
      // UI-friendly slots (array of objects with date/hour/minute/ampm)
      slots: sortSlotsForDisplay(
        Array.isArray(latest.slots)
          ? convertSlotsForUI(latest.slots)
          : convertSlotsMapToArray(latest.slots)
      ),
    };

    setEditingId(normalized.id);
    setEditForm(normalized);
    setOpenDetails({ [normalized.id]: true });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  // Validate slots: same rules you provided + no past date/time
  function validateSlots(slots = []) {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot) {
        return {
          valid: false,
          message: "Please fill all slot date/time fields.",
        };
      }
      if (!slot.date || !/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) {
        return {
          valid: false,
          message:
            "Please provide a valid date (year-month-day) for all slots. Example: 2025-12-31.",
        };
      }
      if (!slot.hour || !/^(?:[1-9]|1[0-2])$/.test(String(slot.hour))) {
        return {
          valid: false,
          message: "Please select hour (1-12) for all slots.",
        };
      }
      if (!slot.minute || !/^\d{2}$/.test(String(slot.minute))) {
        return {
          valid: false,
          message: "Please select minute (00-59) for all slots.",
        };
      }
      const mm = Number(slot.minute);
      if (isNaN(mm) || mm < 0 || mm > 59) {
        return {
          valid: false,
          message: "Please select a valid minute (00-59) for all slots.",
        };
      }
      if (!slot.ampm || (slot.ampm !== "AM" && slot.ampm !== "PM")) {
        return {
          valid: false,
          message: "Please select AM or PM for all slots.",
        };
      }

      // block past date/time
      const slotTs = slotDateTimeToMs(slot);
      if (slotTs <= Date.now()) {
        return {
          valid: false,
          message:
            "One or more slots are in the past. Please pick future date/time for all slots.",
        };
      }
    }
    return { valid: true };
  }

  // Duplicate check
  function findDuplicateInSlots(slots = []) {
    const seen = new Set();
    for (let s of slots) {
      const key = `${s.date}|${s.hour}|${String(s.minute).padStart(2, "0")}|${
        s.ampm
      }`;
      if (seen.has(key)) return key;
      seen.add(key);
    }
    return null;
  }

  // Format slots for backend: array of formatted strings like "DD Mon YYYY • HH:MM AM"
  function slotsToFormattedStrings(slots = []) {
    return (slots || []).map((s) => {
      if (typeof s === "string") return s;
      if (s.raw && typeof s.raw === "string" && s.raw.includes("•"))
        return s.raw;
      // build formatted string from date/hour/minute/ampm
      const parts = (s.date || "").split("-");
      const year = parts[0] || "";
      const monthNum = Number(parts[1] || "1");
      const day = parts[2] ? String(Number(parts[2])).padStart(2, "0") : "";
      const monthName = months[monthNum - 1] || months[0];
      const hour = String(s.hour || "10").padStart(2, "0");
      const minute = String(s.minute || "00").padStart(2, "0");
      const ampm = (s.ampm || "AM").toUpperCase();
      if (!day || !year) {
        // fallback: use time-only or raw
        return s.raw || `${hour}:${minute} ${ampm}`;
      }
      return `${day} ${monthName} ${year} • ${hour}:${minute} ${ampm}`;
    });
  }

  // Convert slot object to timestamp in ms (local timezone)
  function slotDateTimeToMs(slot) {
    // slot.date is YYYY-MM-DD
    const [y, m, d] = (slot.date || "").split("-");
    if (!y || !m || !d) return 0;
    let h = Number(slot.hour || 0);
    const mm = Number(slot.minute || 0);
    const ap = (slot.ampm || "AM").toUpperCase();
    if (ap === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }
    // month index is 0-based in Date
    return new Date(Number(y), Number(m) - 1, Number(d), h, mm, 0, 0).getTime();
  }

  // Save edit -> send PUT /api/services/:id (multipart)
  async function saveEdit() {
    if (!editForm) return;

    // validation (includes past-date/time check)
    if ((editForm.slots || []).length > 0) {
      const validation = validateSlots(editForm.slots || []);
      if (!validation.valid) {
        addToast(validation.message, "error");
        return;
      }
      const dupKey = findDuplicateInSlots(editForm.slots || []);
      if (dupKey) {
        const [date, hour, minute, ampm] = dupKey.split("|");
        addToast(
          `Duplicate slot detected: ${formatDateHuman(
            date
          )} — ${hour}:${minute} ${ampm}`,
          "error",
          4000,
          "top-right",
          true
        );
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append("name", editForm.name || "");
      fd.append("about", editForm.about || "");
      fd.append("price", String(Number(editForm.price || 0)));
      // send availability as string to be parsed by backend ("available" / "unavailable")
      fd.append(
        "availability",
        editForm.available ? "available" : "unavailable"
      );

      // instructions: convert multi-line text to array
      const instructions = (editForm.instructionsText || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append("instructions", JSON.stringify(instructions));

      // slots: convert to formatted strings (the AddService format)
      const slotsFormatted = slotsToFormattedStrings(editForm.slots || []);
      fd.append("slots", JSON.stringify(slotsFormatted));

      if (editForm.imageFile) {
        fd.append("image", editForm.imageFile);
      }

      const id = editForm.id;
      const res = await fetch(`${API_BASE}/api/services/${id}`, {
        method: "PUT",
        body: fd,
      });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Save failed:", body);
        addToast(body?.message || "Failed to save service", "error");
        return;
      }

      // update local UI with returned data if available, otherwise patch locally
      const updatedRaw = body?.data || body?.service || null;

      setServices((list) =>
        list.map((s) =>
          s.id === id
            ? {
                id,
                name: editForm.name,
                about: editForm.about,
                instructions: instructions,
                instructionsText: instructions.join("\n"),
                price: Number(editForm.price) || 0,
                available: !!editForm.available,
                image:
                  updatedRaw?.imageUrl ||
                  updatedRaw?.image ||
                  editForm.imagePreview ||
                  s.image,
                slots:
                  updatedRaw?.slots && Array.isArray(updatedRaw.slots)
                    ? convertSlotsForUI(updatedRaw.slots)
                    : editForm.slots || s.slots,
                _raw: updatedRaw || s._raw,
              }
            : s
        )
      );

      addToast("Service updated successfully", "success");
      cancelEdit();
    } catch (err) {
      console.error("saveEdit error", err);
      addToast("Network error while saving", "error");
    }
  }

  // Remove service -> DELETE call
  async function removeService(id) {
    if (!window.confirm("Are you sure you want to remove this service?"))
      return;
    try {
      const res = await fetch(`${API_BASE}/api/services/${id}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Delete failed", body);
        addToast(body?.message || "Failed to remove service", "error");
        return;
      }
      setServices((s) => s.filter((x) => x.id !== id));
      setOpenDetails({});
      addToast("Service removed", "success");
    } catch (err) {
      console.error("removeService error", err);
      addToast("Network error while removing", "error");
    }
  }

  // When changing file in edit form, store both preview AND file
  function onImageFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // revoke previous objectURL if any
    if (editForm?.imagePreview && editForm.imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(editForm.imagePreview);
      } catch (err) {}
    }
    const url = URL.createObjectURL(f);
    setEditForm((prev) => ({ ...prev, imagePreview: url, imageFile: f }));
  }

  function addNewSlot() {
    const nextId =
      (editForm.slots?.reduce((a, b) => {
        const idA = Number(String(a.id || "0").replace(/\D/g, "")) || 0;
        const idB = Number(String(b.id || "0").replace(/\D/g, "")) || 0;
        return Math.max(idA, idB);
      }, 0) || 0) + 1;
    const newSlot = {
      id: `s-${nextId}`,
      date: todayISO, // default to today
      hour: "10",
      minute: "00",
      ampm: "AM",
    };
    setEditForm((p) => ({ ...p, slots: [...(p.slots || []), newSlot] }));
  }

  function updateSlot(slotId, field, value) {
    setEditForm((p) => {
      // find existing slot to compare
      const oldSlot = (p.slots || []).find((s) => s.id === slotId) || {};
      // restrict changes that would set a date before today
      if (field === "date" && value) {
        // block selecting a past date
        if (value < todayISO) {
          addToast(
            "Cannot select a past date. Choose today or a future date.",
            "error"
          );
          return p; // ignore change
        }
      }

      // prepare new slots
      const newSlots = (p.slots || []).map((s) =>
        s.id === slotId ? { ...s, [field]: value } : s
      );

      // show duplicate hint (non-blocking)
      const dupKey = findDuplicateInSlots(newSlots || []);
      if (dupKey) {
        const [date, hour, minute, ampm] = dupKey.split("|");
        addToast(
          `Duplicate slot detected: ${formatDateHuman(
            date
          )} — ${hour}:${minute} ${ampm}`,
          "error",
          3500,
          "top-right",
          true
        );
      }

      return { ...p, slots: newSlots };
    });
  }

  function removeSlot(slotId) {
    setEditForm((p) => ({
      ...p,
      slots: (p.slots || []).filter((s) => s.id !== slotId),
    }));
  }

  // Combined filtering by search and availability
  const filtered = services
    .filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((s) => {
      if (filterMode === "all") return true;
      if (filterMode === "available") return s.available === true;
      if (filterMode === "unavailable") return s.available === false;
      return true;
    });

  // Format date helper
  function formatDateHuman(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const mi = Number(m) - 1;
    const mon = months[mi] || m;
    return `${String(Number(d))} ${mon} ${y}`;
  }

  return (
    <div className={s.pageContainer}>
      {/* Header */}
      <div className={s.headerContainer}>
        <div className="w-full md:w-auto">
          <h1 className={s.headerTitle}>Services</h1>
          <p className={s.headerSubtitle}>
            Manage your services — edit, schedule slots or remove
          </p>
        </div>

        <div className={s.filterContainer}>
          <div className={s.filterButtonsContainer}>
            <button
              onClick={() => setFilterMode("all")}
              className={`${s.filterButton} ${
                filterMode === "all"
                  ? s.filterButtonActive
                  : s.filterButtonInactive
              } ${s.cursorPointer}`}
              type="button"
            >
              All
            </button>
            <button
              onClick={() => setFilterMode("available")}
              className={`${s.filterButton} ${
                filterMode === "available"
                  ? s.filterButtonActive
                  : s.filterButtonInactive
              } ${s.cursorPointer}`}
              type="button"
            >
              Available
            </button>
            <button
              onClick={() => setFilterMode("unavailable")}
              className={`${s.filterButton} ${
                filterMode === "unavailable"
                  ? s.filterButtonActive
                  : s.filterButtonInactive
              } ${s.cursorPointer}`}
              type="button"
            >
              Unavailable
            </button>
          </div>

          <div className={s.searchContainer}>
            <div className={s.searchIcon}>
              <Search className={s.searchIconSvg} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className={s.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={s.servicesGrid}>
        {filtered.map((svc) => {
          const isOpen = !!openDetails[svc.id];
          const isEditing = editingId === svc.id;

          return (
            <div key={svc.id} className={s.serviceCard}>
              <div
                className={s.serviceCardContent}
                onClick={() => toggleDetails(svc.id)}
              >
                <div className={s.serviceImageContainer}>
                  {svc.image ? (
                    <img
                      src={svc.image}
                      alt={svc.name}
                      className={s.serviceImage}
                    />
                  ) : (
                    <div className={s.serviceImagePlaceholder}>
                      <ImageIcon />
                    </div>
                  )}
                </div>

                <div className={s.serviceInfoContainer}>
                  <div className={s.serviceHeader}>
                    <div className="min-w-0">
                      <h2 className={s.serviceName}>{svc.name}</h2>
                      <p className={s.serviceDescription}>{svc.about}</p>
                    </div>

                    <div className={s.servicePriceContainer}>
                      <div className={s.servicePrice}>₹{svc.price}</div>
                      <div
                        className={`${s.availabilityBadge} ${
                          svc.available
                            ? s.availabilityAvailable
                            : s.availabilityUnavailable
                        }`}
                      >
                        {svc.available ? (
                          <>
                            <Check className="w-3 h-3" /> Available
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Unavailable
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={s.slotsInfo}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {svc.slots.length} slot{svc.slots.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className={s.chevronContainer}>
                  <ChevronDown
                    className={`${s.chevronIcon} ${
                      isOpen ? s.chevronOpen : s.chevronClosed
                    }`}
                  />
                </div>
              </div>

              <div
                className={`${s.detailsContainer} ${
                  isOpen ? s.block : s.hidden
                }`}
              >
                {isEditing ? (
                  <div className={s.editForm}>
                    <div className={s.editImageContainer}>
                      <div className={s.editImagePreview}>
                        {editForm?.imagePreview ? (
                          <img
                            src={editForm.imagePreview}
                            alt="preview"
                            className={s.serviceImage}
                          />
                        ) : (
                          <div className={s.serviceImagePlaceholder}>
                            <ImageIcon />
                          </div>
                        )}
                      </div>

                      <div className={s.editFormFields}>
                        <input
                          className={s.inputBase}
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, name: e.target.value }))
                          }
                        />
                        <input
                          className={`${s.inputBase} mt-1`}
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              price: e.target.value,
                            }))
                          }
                          type="number"
                          placeholder="Price"
                        />

                        <div className={s.availabilitySelectContainer}>
                          <label className={s.availabilityLabel}>
                            Availability
                          </label>
                          <select
                            value={editForm.available ? "true" : "false"}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                available: e.target.value === "true",
                              }))
                            }
                            className={s.availabilitySelect}
                          >
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                          </select>
                        </div>

                        <div className={s.fileInputContainer}>
                          <label className={s.fileInputLabel}>
                            Change image
                          </label>
                          <input
                            ref={fileRef}
                            onChange={onImageFileChange}
                            type="file"
                            accept="image/*"
                            className={s.fileInput}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={s.formLabel}>About</label>
                      <textarea
                        className={`${s.inputBase} ${s.textarea}`}
                        value={editForm.about}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, about: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className={s.formLabel}>
                        Instructions (one per line)
                      </label>
                      <textarea
                        className={`${s.inputBase} ${s.textareaInstructions}`}
                        value={editForm.instructionsText}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            instructionsText: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <div className={s.slotsHeader}>
                        <label className={s.formLabelSmall}>Slots</label>
                        <button
                          onClick={addNewSlot}
                          type="button"
                          className={`${s.addSlotButton} ${s.cursorPointer}`}
                        >
                          <Plus className="w-4 h-4" /> Add slot
                        </button>
                      </div>

                      <div className={s.slotsContainer}>
                        {(editForm.slots || []).map((slot) => (
                          <div key={slot.id} className={s.slotRow}>
                            <input
                              type="date"
                              value={slot.date}
                              onChange={(e) =>
                                updateSlot(slot.id, "date", e.target.value)
                              }
                              required
                              min={todayISO}
                              className={s.slotDateInput}
                            />

                            <div className={s.slotTimeContainer}>
                              <select
                                value={slot.hour}
                                onChange={(e) =>
                                  updateSlot(slot.id, "hour", e.target.value)
                                }
                                required
                                className={s.slotSelect}
                              >
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i + 1
                                ).map((h) => (
                                  <option key={h} value={String(h)}>
                                    {h}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={slot.minute}
                                onChange={(e) =>
                                  updateSlot(slot.id, "minute", e.target.value)
                                }
                                required
                                className={s.slotSelect}
                              >
                                {Array.from({ length: 60 }, (_, i) => i).map(
                                  (m) => (
                                    <option
                                      key={m}
                                      value={String(m).padStart(2, "0")}
                                    >
                                      {String(m).padStart(2, "0")}
                                    </option>
                                  )
                                )}
                              </select>

                              <select
                                value={slot.ampm}
                                onChange={(e) =>
                                  updateSlot(slot.id, "ampm", e.target.value)
                                }
                                required
                                className={s.slotSelect}
                              >
                                <option>AM</option>
                                <option>PM</option>
                              </select>
                            </div>

                            <div className="flex-shrink-0">
                              <button
                                onClick={() => removeSlot(slot.id)}
                                className={s.removeSlotButton}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={s.formActions}>
                      <button onClick={cancelEdit} className={s.cancelButton}>
                        Cancel
                      </button>
                      <button onClick={saveEdit} className={s.saveButton}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={s.viewSection}>
                    <div>
                      <h3 className={s.viewSectionTitle}>About</h3>
                      <p className={s.viewSectionContent}>{svc.about}</p>
                    </div>

                    <div>
                      <h3 className={s.viewSectionTitle}>Instructions</h3>
                      <ul className={s.instructionsList}>
                        {svc.instructions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className={s.viewSectionTitle}>Slots</h3>
                      <div className={s.slotsList}>
                        {svc.slots.length === 0 ? (
                          <div className={s.noSlotsMessage}>
                            No slots scheduled
                          </div>
                        ) : (
                          // sort slots for display: past-first, then today+future
                          sortSlotsForDisplay(svc.slots).map((slot) => (
                            <div key={slot.id} className={s.slotItem}>
                              <Calendar className={s.slotIcon} />
                              <div>
                                <div>
                                  {formatDateHuman(slot.date)} — {slot.hour}:
                                  {String(slot.minute).padStart(2, "0")}{" "}
                                  {slot.ampm}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className={s.viewActions}>
                      <button
                        onClick={() => startEdit(svc)}
                        className={`${s.editButton} ${s.cursorPointer}`}
                      >
                        <Edit2 className="w-4 h-4 text-emerald-600" />{" "}
                        <span className={s.textEmerald700}>Edit</span>
                      </button>

                      <button
                        onClick={() => removeService(svc.id)}
                        className={`${s.removeButton} ${s.cursorPointer}`}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className={s.emptyState}>No services match your search.</div>
      )}

      {/* Toast containers */}
      <div className={s.toastContainerTop}>
        {toasts
          .filter((t) => t.position === "top-right")
          .map((t) => (
            <div
              key={t.id}
              className={`${s.toast} ${t.animated ? s.toastAnimated : ""}`}
            >
              <div
                className={`${s.toastInner} ${
                  t.type === "success" ? s.toastSuccess : s.toastError
                }`}
              >
                <div className={s.toastContent}>
                  <div
                    className={
                      t.type === "success"
                        ? s.toastIconSuccess
                        : s.toastIconError
                    }
                  >
                    <Check className={s.toastIconSvg} />
                  </div>
                  <div className={s.toastMessage}>{t.message}</div>
                  <button
                    onClick={() =>
                      setToasts((s) => s.filter((x) => x.id !== t.id))
                    }
                    className={s.toastCloseButton}
                  >
                    <X className={s.toastCloseIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className={s.toastContainerBottom}>
        {toasts
          .filter((t) => t.position === "bottom-right")
          .map((t) => (
            <div key={t.id} className={s.toast}>
              <div
                className={`${s.toastInner} ${
                  t.type === "success" ? s.toastSuccess : s.toastError
                }`}
              >
                <div className={s.toastContent}>
                  <div
                    className={
                      t.type === "success"
                        ? s.toastIconSuccess
                        : s.toastIconError
                    }
                  >
                    <Check className={s.toastIconSvg} />
                  </div>
                  <div className={s.toastMessage}>{t.message}</div>
                  <button
                    onClick={() =>
                      setToasts((s) => s.filter((x) => x.id !== t.id))
                    }
                    className={s.toastCloseButton}
                  >
                    <X className={s.toastCloseIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
